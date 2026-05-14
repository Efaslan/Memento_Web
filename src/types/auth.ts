import type { Gender, UserDto, UserRole } from './user';

export interface LoginRequestDto {
  email: string;
  password: string;
  deviceId?: number; 
  deviceModel: string;
  osVersion: string;
}

export interface LoginResponseDto {
  user: UserDto;
  accessJwtToken: string;
  refreshToken: string;
  deviceId: number;
}

export interface RegisterRequestDto{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    gender: Gender;
    role: UserRole;
}

export interface ResetPasswordDto{
    email: string;
    otpCode: string;
    newPassword: string;
}

export interface LogoutRequestDto {
    deviceId: number;
}

export interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  refreshToken: string | null;
  deviceId: number | null;
  isAuthenticated: boolean;
  login: (data: LoginResponseDto) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<UserDto>) => void;
  isLoading: boolean;
}