import api from './api';
import type { LoginRequestDto, LoginResponseDto, RegisterRequestDto, ResetPasswordDto } from '../types/auth';
import type { UserDto } from '../types/user';

export const authService = {

    register: async(data: RegisterRequestDto): Promise<UserDto> => {
        const response = await api.post<UserDto>('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginRequestDto): Promise<LoginResponseDto> => {
        
        const response = await api.post<LoginResponseDto>('/auth/login', data);
        return response.data; 
    },

    requestOtpForPasswordReset: async (email : string) => {
        const response = await api.post('auth/password-reset/request', { email });
        return response.data;
    },

    resetPassword: async (data: ResetPasswordDto): Promise<string> =>{
        const response = await api.post<string>('auth/password-reset/reset', data);
        return response.data;
    }

};