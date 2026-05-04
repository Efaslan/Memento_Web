import api from './api';
import type { RelationshipRequestDto, RelationshipResponseDto } from '../types/relationship';

export const relationshipService = {

  requestPatientOtp: async (email: string): Promise<string> => {
    const response = await api.post<string>('/relationships/request', { 
      targetEmail: email 
    });
    
    return response.data;
  },

  addPatient: async (data: { email: string; otpCode: string }): Promise<RelationshipResponseDto> => {
    const payload: RelationshipRequestDto = {
      targetEmail: data.email,
      relationshipType: 'DOCTOR',
      isPrimaryContact: true,
      otpCode: data.otpCode
    };

    const response = await api.post<RelationshipResponseDto>('/relationships', payload);
    
    return response.data;
  }
}