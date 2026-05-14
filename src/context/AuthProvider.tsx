import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';
import type { LoginResponseDto } from '../types/auth';
import type { UserDto } from '../types/user';
import { toast } from 'react-toastify';

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('memento_jwt_token');
  });

  // Yeni: Refresh Token ve Device ID State'leri
  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem('memento_refresh_token');
  });

  const [deviceId, setDeviceId] = useState<number | null>(() => {
    const saved = localStorage.getItem('memento_device_id');
    return saved ? Number(saved) : null;
  });

  const [user, setUser] = useState<UserDto | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (data: LoginResponseDto) => {
    setToken(data.accessJwtToken);
    setRefreshToken(data.refreshToken);
    setDeviceId(data.deviceId);
    setUser(data.user);
    
    // Yeni JWT yapısını storage'a kaydet
    localStorage.setItem('memento_jwt_token', data.accessJwtToken);
    localStorage.setItem('memento_refresh_token', data.refreshToken);
    localStorage.setItem('memento_device_id', data.deviceId.toString());
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = async () => {
    if (deviceId) {
      try {
        await api.delete(`/devices/logout/${deviceId}`);
      } catch (error) {
        toast.error("Çıkış yapılamadı, lütfen tekrar deneyin.");
        console.error("Backend'den çıkış yapılırken hata oluştu:", error);
        return; 
      }
    }

    // try bloğu hatasız atlatıldıysa (veya baştan deviceId yoksa) frontend'i temizle
    setToken(null);
    setRefreshToken(null);
    setDeviceId(null);
    setUser(null);
    
    localStorage.removeItem('memento_jwt_token');
    localStorage.removeItem('memento_refresh_token');
    localStorage.removeItem('memento_device_id');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      refreshToken,
      deviceId,
      isAuthenticated, 
      login, 
      logout, 
      isLoading: false 
    }}>
      {children}
    </AuthContext.Provider>
  );
};