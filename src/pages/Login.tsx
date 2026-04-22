import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  // Local states for form inputs and UI feedback
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooks for navigation and global authentication state
  const navigate = useNavigate();
  const { login } = useAuth(); 

  // Triggered when the form is submitted (Button click or Enter key)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default browser page reload
    setIsLoading(true);

    try { // login request to backend
      const response = await authService.login({
        email: email,
        password: password 
      });

      console.log('Response from backend:', response);
      
      // Update the global Context and localStorage with the new token/user
      login(response);
      
      // Redirect to the dashboard upon successful login
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Main Form Container */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Memento</h1>
          <p className="text-slate-500 font-medium">Doktor Yönetim Paneli</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Adresi"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="sizin@mailiniz.com"
          />

          {/* Password Input Group */}
          <div className="relative">
            <Link 
              to="/reset-password" 
              className="absolute right-0 top-0 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Şifremi Unuttum
            </Link>
          
            <Input
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isLoading}
            loadingText="Giriş Yapılıyor..."
          >
            Giriş Yap
          </Button>
        </form>

        {/* Divider and Register Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Hesabınız yok mu?{' '}
            <Link 
              to="/register" 
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Kayıt olun
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}