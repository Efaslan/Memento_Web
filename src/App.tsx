import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider> 
      <Routes>
        {/* if the user is logged in, send them to dashboard */}
        <Route path="/login" element={<LoginRoute />} />

        {/* only logged in users can see these pages */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* main page is dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* unknown pages lead to dashboard, if user is not authenticated, dashboard sends the user to login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />;
};