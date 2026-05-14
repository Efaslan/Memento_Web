import api from './api';
import type { DoctorProfileRequestDto, DoctorProfileResponseDto } from '../types/doctorProfile';

export const profileService = {
  getMyProfile: async (): Promise<DoctorProfileResponseDto | null> => {
    
    const response = await api.get<DoctorProfileResponseDto>('/profiles/me', {
      // Axios'a diyoruz ki: 200'lü kodları VE 404'ü normal kabul et, error fırlatma.
      validateStatus: (status) => (status === 200 || status === 404)
    });

    // Eğer kullanıcı yeni kayıt olmuşsa ve profili yoksa 404 dönecektir.
    // Bu durumu yakalayıp frontend'e null gönderiyoruz.
    if (response.status === 404) {
      return null;
    }

    return response.data;
  },

  updateDoctorProfile: async (dto: DoctorProfileRequestDto): Promise<DoctorProfileResponseDto> => {
    const response = await api.put<DoctorProfileResponseDto>('/profiles/doctor/me', dto);
    return response.data;
  }
};