import { type Patient, type Bed } from '@shared/schema';
import { differenceInDays } from 'date-fns';

// Calculate days since admission for a patient
export const calculateDaysOfHospitalization = (patient: Patient): number => {
  if (!patient.admissionDate) {
    return 0;
  }
  
  const endDate = patient.dischargeDate ? new Date(patient.dischargeDate) : new Date();
  return differenceInDays(endDate, new Date(patient.admissionDate));
};

// Determine bed status based on patient SAPS score
export const determineBedStatus = (patient: Patient | null): string => {
  if (!patient || !patient.sapsScore) {
    return 'available';
  }
  
  if (patient.sapsScore >= 60) {
    return 'critical';
  } else if (patient.sapsScore >= 40) {
    return 'attention';
  } else {
    return 'stable';
  }
};

// Format a patient with bed detail for API response
export const formatPatientWithBed = (
  patient: Patient, 
  bed: Bed | null
): Record<string, any> => {
  const status = determineBedStatus(patient);
  const daysHospitalized = calculateDaysOfHospitalization(patient);
  
  return {
    id: patient.id,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    medicalRecordNumber: patient.medicalRecordNumber,
    mainDiagnosis: patient.mainDiagnosis,
    diagnosisCode: patient.diagnosisCode,
    admissionDate: patient.admissionDate,
    dischargeDate: patient.dischargeDate,
    daysHospitalized,
    sapsScore: patient.sapsScore,
    status,
    secondaryDiagnoses: patient.secondaryDiagnoses,
    active: patient.active,
    bed: bed ? {
      id: bed.id,
      bedNumber: bed.bedNumber,
      wing: bed.wing,
      floor: bed.floor,
      status: status
    } : null
  };
};
