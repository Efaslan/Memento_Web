import api from './api';
import type { RelationshipRequestDto, RelationshipResponseDto } from '../types/relationship';

export const relationshipService = {

  addPatient: async (data: { email: string }): Promise<RelationshipResponseDto> => {
    const payload: RelationshipRequestDto = {
      targetEmail: data.email,
      relationshipType: 'DOCTOR',
      isPrimaryContact: true
    };

    const response = await api.post<RelationshipResponseDto>('/relationships', payload);
    
    return response.data;
  }
}