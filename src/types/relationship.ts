export interface RelationshipRequestDto {
  targetEmail: string;
  relationshipType: 'DOCTOR';
  isPrimaryContact: boolean;
}

export interface RelationshipResponseDto {
  relationshipId: number;
  patientUserId: number;
  caregiverUserId: number;
  caregiverName: string;
  caregiverPhone: string;
  caregiverEmail: string;
  relationshipType: 'DOCTOR';
  isPrimaryContact: boolean;
  isActive: boolean;
}