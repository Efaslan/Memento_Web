import api from './api';
import type { DoctorProfileRequestDto, DoctorProfileResponseDto } from '../types/doctorProfile';

export const profileService = {
  getMyProfile: async (): Promise<DoctorProfileResponseDto> => {
    const response = await api.get<DoctorProfileResponseDto>('/profiles/me');
    return response.data;
  },

  updateDoctorProfile: async (dto: DoctorProfileRequestDto): Promise<DoctorProfileResponseDto> => {
    const response = await api.put<DoctorProfileResponseDto>('/profiles/doctor/me', dto);
    return response.data;
  }
};