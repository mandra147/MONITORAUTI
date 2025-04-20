import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum definitions
export const userRoleEnum = pgEnum('user_role', ['admin', 'doctor', 'nurse']);

export const bedStatusEnum = pgEnum('bed_status', ['critical', 'attention', 'stable', 'available']);

export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").notNull().default('doctor'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

// Beds schema
export const beds = pgTable("beds", {
  id: serial("id").primaryKey(),
  bedNumber: text("bed_number").notNull().unique(),
  wing: text("wing").notNull(),
  floor: integer("floor").notNull(),
  status: bedStatusEnum("status").notNull().default('available'),
});

// Patients schema
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: genderEnum("gender").notNull(),
  medicalRecordNumber: text("medical_record_number").notNull().unique(),
  mainDiagnosis: text("main_diagnosis").notNull(),
  diagnosisCode: text("diagnosis_code"),
  bedId: integer("bed_id").references(() => beds.id),
  admissionDate: timestamp("admission_date").defaultNow().notNull(),
  dischargeDate: timestamp("discharge_date"),
  sapsScore: integer("saps_score"),
  secondaryDiagnoses: text("secondary_diagnoses").array(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sessions schema
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// PatientProblems schema
export const patientProblems = pgTable("patient_problems", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  description: text("description").notNull(),
  isResolved: boolean("is_resolved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// PatientPending schema
export const patientPending = pgTable("patient_pending", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  description: text("description").notNull(),
  deadline: timestamp("deadline"),
  responsibleUserId: integer("responsible_user_id").references(() => users.id),
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Data insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
});

export const insertBedSchema = createInsertSchema(beds).pick({
  bedNumber: true,
  wing: true,
  floor: true,
  status: true,
});

export const insertPatientSchema = createInsertSchema(patients).pick({
  name: true,
  age: true,
  gender: true,
  medicalRecordNumber: true,
  mainDiagnosis: true,
  diagnosisCode: true,
  bedId: true,
  sapsScore: true,
  secondaryDiagnoses: true,
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  userId: true,
  token: true,
  expiresAt: true,
});

export const insertPatientProblemSchema = createInsertSchema(patientProblems).pick({
  patientId: true,
  description: true,
  isResolved: true,
});

export const insertPatientPendingSchema = createInsertSchema(patientPending).pick({
  patientId: true,
  description: true,
  deadline: true,
  responsibleUserId: true,
  isCompleted: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Bed = typeof beds.$inferSelect;
export type InsertBed = z.infer<typeof insertBedSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type PatientProblem = typeof patientProblems.$inferSelect;
export type InsertPatientProblem = z.infer<typeof insertPatientProblemSchema>;

export type PatientPending = typeof patientPending.$inferSelect;
export type InsertPatientPending = z.infer<typeof insertPatientPendingSchema>;

// Login schema
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginData = z.infer<typeof loginSchema>;
