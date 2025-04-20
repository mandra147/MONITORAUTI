import {
  users, patients, beds, sessions, patientProblems, patientPending,
  type User, type InsertUser, type Patient, type InsertPatient,
  type Bed, type InsertBed, type Session, type InsertSession,
  type PatientProblem, type InsertPatientProblem,
  type PatientPending, type InsertPatientPending
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, isNull } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: number): Promise<void>;
  
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<void>;
  
  // Bed methods
  getBed(id: number): Promise<Bed | undefined>;
  getAllBeds(): Promise<Bed[]>;
  createBed(bed: InsertBed): Promise<Bed>;
  updateBedStatus(id: number, status: string): Promise<void>;
  
  // Patient methods
  getPatient(id: number): Promise<Patient | undefined>;
  getActivePatientsWithBeds(): Promise<any[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<Patient>): Promise<void>;
  dischargePatient(id: number): Promise<void>;
  
  // Patient problems methods
  getPatientProblems(patientId: number): Promise<PatientProblem[]>;
  createPatientProblem(problem: InsertPatientProblem): Promise<PatientProblem>;
  resolvePatientProblem(id: number): Promise<void>;
  
  // Patient pending methods
  getPatientPending(patientId: number): Promise<PatientPending[]>;
  createPatientPending(pending: InsertPatientPending): Promise<PatientPending>;
  completePatientPending(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserLastLogin(id: number): Promise<void> {
    await db
      .update(users)
      .set({ lastLogin: sql`CURRENT_TIMESTAMP` })
      .where(eq(users.id, id));
  }
  
  // Session methods
  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db
      .insert(sessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.token, token),
        sql`${sessions.expiresAt} > CURRENT_TIMESTAMP`
      ));
    return session;
  }

  async deleteSession(token: string): Promise<void> {
    await db
      .delete(sessions)
      .where(eq(sessions.token, token));
  }
  
  // Bed methods
  async getBed(id: number): Promise<Bed | undefined> {
    const [bed] = await db.select().from(beds).where(eq(beds.id, id));
    return bed;
  }

  async getAllBeds(): Promise<Bed[]> {
    return await db.select().from(beds).orderBy(beds.bedNumber);
  }

  async createBed(bed: InsertBed): Promise<Bed> {
    const [newBed] = await db
      .insert(beds)
      .values(bed)
      .returning();
    return newBed;
  }

  async updateBedStatus(id: number, status: string): Promise<void> {
    await db
      .update(beds)
      .set({ status: status as any })
      .where(eq(beds.id, id));
  }
  
  // Patient methods
  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async getActivePatientsWithBeds(): Promise<any[]> {
    const result = await db
      .select({
        patient: patients,
        bed: beds
      })
      .from(patients)
      .leftJoin(beds, eq(patients.bedId, beds.id))
      .where(eq(patients.active, true))
      .orderBy(beds.bedNumber);
    
    return result;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db
      .insert(patients)
      .values(patient)
      .returning();
    
    if (patient.bedId) {
      await this.updateBedStatus(patient.bedId, 'stable');
    }
    
    return newPatient;
  }

  async updatePatient(id: number, patientData: Partial<Patient>): Promise<void> {
    await db
      .update(patients)
      .set({ 
        ...patientData, 
        updatedAt: sql`CURRENT_TIMESTAMP` 
      })
      .where(eq(patients.id, id));
  }

  async dischargePatient(id: number): Promise<void> {
    const [patient] = await db
      .select()
      .from(patients)
      .where(eq(patients.id, id));
    
    if (patient && patient.bedId) {
      await this.updateBedStatus(patient.bedId, 'available');
    }
    
    await db
      .update(patients)
      .set({
        active: false,
        dischargeDate: sql`CURRENT_TIMESTAMP`,
        bedId: null,
        updatedAt: sql`CURRENT_TIMESTAMP`
      })
      .where(eq(patients.id, id));
  }
  
  // Patient problems methods
  async getPatientProblems(patientId: number): Promise<PatientProblem[]> {
    return await db
      .select()
      .from(patientProblems)
      .where(eq(patientProblems.patientId, patientId))
      .orderBy(desc(patientProblems.createdAt));
  }

  async createPatientProblem(problem: InsertPatientProblem): Promise<PatientProblem> {
    const [newProblem] = await db
      .insert(patientProblems)
      .values(problem)
      .returning();
    return newProblem;
  }

  async resolvePatientProblem(id: number): Promise<void> {
    await db
      .update(patientProblems)
      .set({ 
        isResolved: true,
        updatedAt: sql`CURRENT_TIMESTAMP`
      })
      .where(eq(patientProblems.id, id));
  }
  
  // Patient pending methods
  async getPatientPending(patientId: number): Promise<PatientPending[]> {
    return await db
      .select()
      .from(patientPending)
      .where(eq(patientPending.patientId, patientId))
      .orderBy(desc(patientPending.createdAt));
  }

  async createPatientPending(pending: InsertPatientPending): Promise<PatientPending> {
    const [newPending] = await db
      .insert(patientPending)
      .values(pending)
      .returning();
    return newPending;
  }

  async completePatientPending(id: number): Promise<void> {
    await db
      .update(patientPending)
      .set({ 
        isCompleted: true,
        updatedAt: sql`CURRENT_TIMESTAMP`
      })
      .where(eq(patientPending.id, id));
  }
}

export const storage = new DatabaseStorage();
