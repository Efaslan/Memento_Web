import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0); // 5 minutes

  const navigate = useNavigate();

  // timer -= 1 if timer > 0
  useEffect(() => {
    let interval: number;
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

  // format seconds into minutes
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequestCode = async () => {
    if (!email) {
      toast.warn("Lütfen önce e-posta adresinizi girin.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.requestOtpForPasswordReset(email);
      toast.success(response); // string message from backend
      setIsCodeSent(true);
      setTimer(300); // 5 minute TTL otp
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // resetting password
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {/* Email Alanı ve Kod Al Butonu */}
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <Input
                label="E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isCodeSent}
                required
                placeholder="sizin@mailiniz.com"
              />
            </div>
            <button 
              type="button" 
              onClick={handleRequestCode} 
              disabled={isLoading || (timer > 0)}
              className="mt-5.75 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {timer > 0 ? `Tekrar (${formatTime(timer)})` : 'Kod Al'}
            </button>
          </div>

          {/* these elements activate after the otpCode is sent */}
          <div className={`flex flex-col gap-2 transition-opacity duration-300 ${isCodeSent ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}>
            
            <Input
              label="6 Haneli Kod"
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtp(e.target.value)}
              required={isCodeSent}
              className="tracking-widest text-center"
              placeholder="••••••"
            />

            <Input
              label="Yeni Şifre"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required={isCodeSent}
              placeholder="••••••••"
            />

            <Button 
              type="submit" 
              variant="primary" 
              disabled={!isCodeSent}
              isLoading={isLoading}
              loadingText="Şifre Değiştiriliyor..."
            >
              Şifreyi Değiştir
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link to="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            &larr; Giriş Yapın
          </Link>
        </div>

      </div>
    </div>
  );
}