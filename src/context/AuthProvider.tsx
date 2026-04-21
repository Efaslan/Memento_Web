import { useState } from 'react';
import type { ReactNode } from 'react';
import type { UserDto } from '../types/user';
import type { LoginResponseDto } from '../types/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('memento_jwt_token');
  });

  const [user, setUser] = useState<UserDto | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (data: LoginResponseDto) => {
    setToken(data.token || null);
    setUser(data.user);
    
    // save JWT to browser local storage
    if (data.token) localStorage.setItem('memento_jwt_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('memento_jwt_token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token; // token(string) = truthy! -> false! -> true. Returns true if token exists

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
};