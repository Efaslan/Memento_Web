import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { UserRole } from '../types/user';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import PhoneInput from '../components/PhoneInput';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'DOCTOR' as UserRole
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // updates state as the inputs are changed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.phoneNumber.length !== 10) {
      toast.warning("Lütfen geçerli bir telefon numarası girin.");
      return;
    }
    
    setIsLoading(true);

    try {
      await authService.register(formData);
      
      toast.success("Kayıt başarılı. Lütfen giriş yapın.");
      // navigating to login on success
      navigate('/login');
      
    } catch (err: any) {
      console.error(err);
      toast.error("Kayıt başarısız. ")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Memento</h1>
          <p className="text-slate-500 font-medium">Hesap Oluşturun</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* name and surname next to each other */}
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Ad" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              required 
              placeholder="Ahmet" 
            />
            <Input 
              label="Soyad" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              required 
              placeholder="Yılmaz" 
            />
          </div>

          <Input 
            label="Email Adresi" 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="sizin@mailiniz.com" 
          />

          <PhoneInput 
            label="Telefon Numarası"
            value={formData.phoneNumber}
            onAccept={(val) => setFormData({ ...formData, phoneNumber: val })}
            required
          />

          <Input 
            label="Şifre" 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="••••••••" 
          />

          <Button 
            type="submit" 
            variant="primary"
            isLoading={isLoading}
            loadingText="Kayıt olunuyor..."
          >
            Kayıt Olun
          </Button>
        </form>
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Zaten hesabınız var mı?{' '}
            <Link 
              to="/login" 
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Giriş Yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}