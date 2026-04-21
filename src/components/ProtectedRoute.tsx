import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { JSX } from 'react';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Yükleniyor...</div>;

  if (!isAuthenticated) {
    // send back to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};