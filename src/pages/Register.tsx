import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { UserRole, Gender } from '../types/user';
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
    gender: '' as Gender,
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
      
      // navigating to login on success
      navigate('/login');
      
    } catch (err) {
      console.error(err);
      toast.error("Kayıt başarısız. Lütfen bilgilerinizi kontrol edin ve tekrar deneyin.");
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

          {/* Telefon ve Cinsiyet Alanı - Yan Yana */}
        <div className="flex flex-col sm:flex-row gap-4">
          
          {/* Telefon Numarası - flex-1 ile alanın yarısını kaplar */}
          <div className="flex-2">
            <PhoneInput 
              label="Telefon Numarası"
              value={formData.phoneNumber}
              onAccept={(val) => setFormData({ ...formData, phoneNumber: val })}
              required
            />
          </div>

          {/* Cinsiyet Dropdown - flex-1 ile alanın diğer yarısını kaplar */}
          <div className="flex-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cinsiyet
              </label>
              <select
                value={formData.gender || ""}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-slate-700 h-[42px]"
              >
                <option value="">Seçiniz</option>
                {/* Backend'deki Enum değerlerine göre value'ları güncelle (örn: MALE, FEMALE) */}
                <option value="MALE">Erkek</option>
                <option value="FEMALE">Kadın</option>
                <option value="OTHER">Diğer</option>
                <option value="PREFER_NOT_TO_SAY">Belirtmek İstemiyorum</option>
              </select>
            </div>
          </div>

        </div>

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