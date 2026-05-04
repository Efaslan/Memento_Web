import api from './api';
import type { PatientCardDto, SliceResponse } from '../types/patient';
import type { DailyLogDto } from '../types/dailyLog'

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
  }

  

};