import api from './api';
import type { GeneralReminderDto, GeneralReminderRequestDto, MedicationScheduleRequestDto, MedicationScheduleResponseDto, PatientCardDto, SliceResponse } from '../types/patient';
import type { DailyLogDto } from '../types/patient'

export const doctorService = {
  
  // Hastaları sayfalı (pagination) ve aramalı (search) getiren metodumuz
  getMyPatients: async (search: string = '', page: number = 0, size: number = 10): Promise<SliceResponse<PatientCardDto>> => {
    
    const response = await api.get<SliceResponse<PatientCardDto>>('/relationships/my-patients', {
      params: { 
        search: search, 
        page: page, 
        size: size 
      }
    });
    
    return response.data;
  },

  getPatientRecentLogs: async (patientId: number, days: number): Promise<DailyLogDto[]> => {
    const response = await api.get<DailyLogDto[]>(`/dailylogs/${patientId}/recent/${days}`);
    return response.data;
  },

  getPatientGeneralReminders: async (patientId: number): Promise<GeneralReminderDto[]> => {
    const response = await api.get<GeneralReminderDto[]>(`/reminders/active/patient/${patientId}`);
    return response.data;
  },

  addGeneralReminderToPatient: async (reminderData: GeneralReminderRequestDto): Promise<GeneralReminderDto> => {
    const response = await api.post<GeneralReminderDto>('/reminders', reminderData);
    return response.data;
  },

  updateGeneralReminder: async (reminderId: number, reminderData: GeneralReminderRequestDto): Promise<GeneralReminderDto> => {
    const response = await api.put<GeneralReminderDto>(`/reminders/${reminderId}`, reminderData);
    return response.data;
  },

  deleteGeneralReminder: async (reminderId: number): Promise<void> => {
    await api.delete(`/reminders/${reminderId}`);
  },

  getPatientActiveMedicationSchedules: async (patientId: number): Promise<MedicationScheduleResponseDto[]> => {
    const response = await api.get<MedicationScheduleResponseDto[]>(`/medications/schedules/patient/${patientId}`);
    return response.data;
  },

  getPatientMedicationSchedulesHistory: async (patientId: number): Promise<MedicationScheduleResponseDto[]> => {
    const response = await api.get<MedicationScheduleResponseDto[]>(`/medications/schedules/${patientId}/history`);
    return response.data;
  },

  addMedicationScheduleToPatient: async (scheduleData: MedicationScheduleRequestDto): Promise<MedicationScheduleResponseDto> => {
    const response = await api.post<MedicationScheduleResponseDto>('/medications/schedules', scheduleData);
    return response.data;
  },

  updateMedicationSchedule: async (scheduleId: number, scheduleData: MedicationScheduleRequestDto): Promise<MedicationScheduleResponseDto> => {
    const response = await api.put<MedicationScheduleResponseDto>(`/medications/schedules/${scheduleId}`, scheduleData);
    return response.data;
  },

  deactivateMedicationSchedule: async (scheduleId: number): Promise<void> => {
    await api.delete(`/medications/schedules/${scheduleId}`);
  }
};