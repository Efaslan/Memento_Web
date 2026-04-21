export type UserRole = 'PATIENT' | 'DOCTOR' | 'RELATIVE';

export interface UserDto {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
}