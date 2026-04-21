import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Durum Yönetimi
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Saniye cinsinden (300 = 5 dk)

  const navigate = useNavigate();

  // Timer Mantığı: timer > 0 olduğu sürece her saniye düşer
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isCodeSent) {
      // Süre bittiğinde istersen kodu geçersiz sayabilirsin
      toast.info("Kodun süresi doldu, lütfen tekrar kod alın.");
    }
    return () => clearInterval(interval);
  }, [timer, isCodeSent]);

  // Saniyeyi Dakika:Saniye formatına çevir (Örn: 04:59)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. AŞAMA: Kod Talep Etme
  const handleRequestCode = async () => {
    if (!email) {
      toast.warn("Lütfen önce e-posta adresinizi girin.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.requestOtpForPasswordReset(email);
      toast.success(response); // Backend'den dönen String mesaj
      setIsCodeSent(true);
      setTimer(300); // 5 dakikayı başlat
    } catch (err) {
      // Hatalar interceptor tarafından handle ediliyor
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. AŞAMA: Şifreyi Sıfırlama
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (timer === 0) {
      toast.error("Kod süresi doldu. Lütfen yeni bir kod alın.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ email, otpCode, newPassword });
      toast.success("Şifreniz başarıyla değiştirildi!");
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Memento</h1>
          <p className="text-slate-500 font-medium">Şifre Yenileme</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Alanı ve Kod Al Butonu */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              E-posta
            </label>
            <div className="flex gap-3">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={isCodeSent}
                required 
                className="flex-1 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="ornek@memento.com"
              />
              <button 
                type="button" 
                onClick={handleRequestCode} 
                disabled={isLoading || (timer > 0)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {timer > 0 ? `Tekrar (${formatTime(timer)})` : 'Kod Al'}
              </button>
            </div>
          </div>

          {/* Sadece kod gönderildikten sonra aktifleşen alanlar */}
          <div className={`space-y-6 transition-opacity duration-300 ${isCodeSent ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                6 Haneli Kod
              </label>
              <input 
                type="text" 
                maxLength={6}
                value={otpCode} // Bir önceki koddaki otpCode typo'sunu düzelttim
                onChange={(e) => setOtp(e.target.value)} 
                required={isCodeSent}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all tracking-widest text-center text-lg"
                placeholder="••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Yeni Şifre
              </label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required={isCodeSent}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={!isCodeSent || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İşleniyor...
                </span>
              ) : (
                'Şifreyi Değiştir'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            &larr; Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}