import type { UserDto, UserRole } from './user';

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: UserDto;
}

export interface RegisterRequestDto{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: UserRole;
}

export interface ResetPasswordDto{
    email: string;
    otpCode: string;
    newPassword: string;
}

export interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginResponseDto) => void;
  logout: () => void;
  isLoading: boolean;
}