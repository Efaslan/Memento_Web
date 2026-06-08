export type BloodType = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';
export type RecurrenceRule = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

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

export interface DailyLogDto {
  dailyLogId: number;
  patientUserId: number;
  description: string;
  quantityMl: number;
  createdAt: string;
}

export interface GeneralReminderDto {
  reminderId: number;
  patientUserId: number;
  creatorName: string;
  title: string;
  description: string | null;
  reminderTime: string;
  isRecurring: boolean;
  recurrenceRule: RecurrenceRule;
}

export interface GeneralReminderRequestDto {
  patientUserId: number;
  title: string;
  reminderTime: string;
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule;
}

export interface TimeInfoDto {
  timeId: number;
  time: string; // LocalTime JavaScript'e String ('HH:mm') olarak gelir
}

export interface MedicationScheduleResponseDto {
  scheduleId: number;
  patientUserId: number;
  doctorName: string;
  medicationName: string;
  dosage: string;
  notes: string | null;
  startDate: string;
  endDate: string;
  isPrn: boolean;
  isActive: boolean;
  times: TimeInfoDto[]; // LocalTime JavaScript'e String ('HH:mm') olarak gelir
}

export interface MedicationScheduleRequestDto {
  patientUserId: number;
  medicationName: string;
  dosage: string;
  notes?: string;
  startDate: string; // LocalDate JavaScript'e String ('YYYY-MM-DD') olarak gelir
  endDate?: string;   // LocalDate JavaScript'e String ('YYYY-MM-DD') olarak gelir
  isPrn: boolean;
  times: string[];   // LocalTime JavaScript'e String ('HH:mm') olarak gelir
}