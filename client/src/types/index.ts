export type UserRole = 'admin' | 'doctor' | 'nurse';

export type BedStatus = 'critical' | 'attention' | 'stable' | 'available';

export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

export interface Bed {
  id: number;
  bedNumber: string;
  wing: string;
  floor: number;
  status: BedStatus;
  patient?: Patient | null;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: Gender;
  medicalRecordNumber: string;
  mainDiagnosis: string;
  diagnosisCode?: string;
  admissionDate: string;
  dischargeDate?: string;
  daysHospitalized?: number;
  sapsScore?: number;
  status?: BedStatus;
  secondaryDiagnoses?: string[];
  active: boolean;
  bed?: {
    id: number;
    bedNumber: string;
    wing: string;
    floor: number;
    status: BedStatus;
  } | null;
  problems?: PatientProblem[];
  pendingTasks?: PatientPending[];
}

export interface PatientProblem {
  id: number;
  patientId: number;
  description: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientPending {
  id: number;
  patientId: number;
  description: string;
  deadline?: string;
  responsibleUserId?: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
