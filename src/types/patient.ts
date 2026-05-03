export type BloodType = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';

export interface PatientCardDto {
  relationshipId: number;
  patientId: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | null; // LocalDate JavaScript'e String ('YYYY-MM-DD') olarak gelir
  heightCm: number | null;
  weightKg: number | null;
  bloodType: BloodType | null;
  emergencyNotes: string | null;
}

export interface SliceResponse<T> {
  content: T[];
  number: number;
  size: number;
  last: boolean;
}