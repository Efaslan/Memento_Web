import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { UserRole } from '../types/user';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { IMaskInput } from 'react-imask';

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* name and surname next to each other */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ad
              </label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="John"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Soyad
              </label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Adresi
            </label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="john@memento.com"
            />
          </div>

          <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Telefon Numarası
      </label>
      <div className="flex">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 border-r-0 rounded-l-lg px-3 py-2 text-slate-600 font-medium select-none pointer-events-none">
          <span>🇹🇷</span>
          <span>+90</span>
        </div>
        
        {/* InputMask for phone numbers */}
        <IMaskInput
          mask="(000) 000 00 00" // must be numbers
          unmask={true} // unmasks (500) to "500"
          name="phoneNumber"
          value={formData.phoneNumber}
          // unmaskedValue: "5008101320"
          onAccept={(unmaskedValue) => {
            setFormData({ ...formData, phoneNumber: unmaskedValue });
          }}
          required
          className="flex-1 w-full px-4 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
          placeholder="(5__) ___ __ __"
        />
      </div>
    </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Şifre
            </label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kayıt olunuyor...
              </span>
            ) : (
              'Register'
            )}
          </button>
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