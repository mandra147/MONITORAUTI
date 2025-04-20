import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertUserSchema, insertPatientSchema, insertBedSchema, insertPatientProblemSchema, insertPatientPendingSchema } from "@shared/schema";
import { authenticate, authorizeRoles, comparePassword, generateToken, hashPassword } from "./auth";
import { formatPatientWithBed, determineBedStatus } from "./utils";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication and User Routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      const isPasswordValid = comparePassword(validatedData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Create session
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 1); // 24 hours
      
      await storage.createSession({ 
        userId: user.id, 
        token, 
        expiresAt 
      });
      
      // Update last login
      await storage.updateUserLastLogin(user.id);
      
      return res.status(200).json({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/auth/logout", authenticate, async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        await storage.deleteSession(token);
      }
      
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/users", authenticate, authorizeRoles(["admin"]), async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Hash password
      const hashedPassword = hashPassword(validatedData.password);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });
      
      return res.status(201).json({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Create user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Bed Routes
  app.get("/api/beds", authenticate, async (_req: Request, res: Response) => {
    try {
      const beds = await storage.getAllBeds();
      return res.status(200).json(beds);
    } catch (error) {
      console.error("Get beds error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/beds", authenticate, authorizeRoles(["admin"]), async (req: Request, res: Response) => {
    try {
      const validatedData = insertBedSchema.parse(req.body);
      
      const bed = await storage.createBed(validatedData);
      
      return res.status(201).json(bed);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Create bed error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/beds/:id/status", authenticate, async (req: Request, res: Response) => {
    try {
      const bedId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["critical", "attention", "stable", "available"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      await storage.updateBedStatus(bedId, status);
      
      return res.status(200).json({ message: "Bed status updated successfully" });
    } catch (error) {
      console.error("Update bed status error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Patient Routes
  app.get("/api/dashboard", authenticate, async (_req: Request, res: Response) => {
    try {
      const patientsWithBeds = await storage.getActivePatientsWithBeds();
      
      // Format the response
      const formattedData = patientsWithBeds.map(({ patient, bed }) => {
        return formatPatientWithBed(patient, bed);
      });
      
      // Get all beds
      const allBeds = await storage.getAllBeds();
      
      // Map beds with patient data or mark as available
      const bedSummary = allBeds.map(bed => {
        const patientData = formattedData.find(p => p.bed && p.bed.id === bed.id);
        
        if (patientData) {
          return {
            ...bed,
            status: patientData.status,
            patient: {
              id: patientData.id,
              name: patientData.name,
              age: patientData.age,
              gender: patientData.gender,
              mainDiagnosis: patientData.mainDiagnosis,
              diagnosisCode: patientData.diagnosisCode,
              daysHospitalized: patientData.daysHospitalized,
              sapsScore: patientData.sapsScore
            }
          };
        } else {
          return {
            ...bed,
            status: 'available',
            patient: null
          };
        }
      });
      
      return res.status(200).json(bedSummary);
    } catch (error) {
      console.error("Get dashboard error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/patients/:id", authenticate, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      const bed = patient.bedId ? await storage.getBed(patient.bedId) : null;
      
      // Get patient problems
      const problems = await storage.getPatientProblems(patientId);
      
      // Get patient pending tasks
      const pendingTasks = await storage.getPatientPending(patientId);
      
      // If patient not found, return 404
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Format patient data
      const formattedPatient = formatPatientWithBed(patient, bed);
      
      return res.status(200).json({
        ...formattedPatient,
        problems: problems.filter(p => !p.isResolved),
        pendingTasks: pendingTasks.filter(p => !p.isCompleted)
      });
    } catch (error) {
      console.error("Get patient error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/patients", authenticate, async (req: Request, res: Response) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      
      // If bedId is provided, check if it's available
      if (validatedData.bedId) {
        const bed = await storage.getBed(validatedData.bedId);
        if (!bed) {
          return res.status(404).json({ message: "Bed not found" });
        }
        if (bed.status !== 'available') {
          return res.status(400).json({ message: "Bed is not available" });
        }
      }
      
      const patient = await storage.createPatient(validatedData);
      
      return res.status(201).json(patient);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Create patient error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/patients/:id", authenticate, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      // Update patient
      await storage.updatePatient(patientId, req.body);
      
      // If SAPS score is updated, update bed status
      if (req.body.sapsScore && patient.bedId) {
        const status = determineBedStatus({...patient, sapsScore: req.body.sapsScore});
        await storage.updateBedStatus(patient.bedId, status);
      }
      
      return res.status(200).json({ message: "Patient updated successfully" });
    } catch (error) {
      console.error("Update patient error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/patients/:id/discharge", authenticate, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      await storage.dischargePatient(patientId);
      
      return res.status(200).json({ message: "Patient discharged successfully" });
    } catch (error) {
      console.error("Discharge patient error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Patient Problems Routes
  app.post("/api/patients/:id/problems", authenticate, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      const validatedData = insertPatientProblemSchema.parse({
        ...req.body,
        patientId
      });
      
      const problem = await storage.createPatientProblem(validatedData);
      
      return res.status(201).json(problem);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Create patient problem error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/patients/problems/:id/resolve", authenticate, async (req: Request, res: Response) => {
    try {
      const problemId = parseInt(req.params.id);
      
      await storage.resolvePatientProblem(problemId);
      
      return res.status(200).json({ message: "Problem resolved successfully" });
    } catch (error) {
      console.error("Resolve patient problem error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Patient Pending Tasks Routes
  app.post("/api/patients/:id/pending", authenticate, async (req: Request, res: Response) => {
    try {
      const patientId = parseInt(req.params.id);
      
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      
      const validatedData = insertPatientPendingSchema.parse({
        ...req.body,
        patientId
      });
      
      const pending = await storage.createPatientPending(validatedData);
      
      return res.status(201).json(pending);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Create patient pending task error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.patch("/api/patients/pending/:id/complete", authenticate, async (req: Request, res: Response) => {
    try {
      const pendingId = parseInt(req.params.id);
      
      await storage.completePatientPending(pendingId);
      
      return res.status(200).json({ message: "Pending task completed successfully" });
    } catch (error) {
      console.error("Complete patient pending task error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
