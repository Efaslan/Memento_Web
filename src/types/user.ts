export type UserRole = 'PATIENT' | 'DOCTOR' | 'RELATIVE';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface UserDto {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
}
