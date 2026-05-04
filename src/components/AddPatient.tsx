import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import Button from '../components/Button';
import { relationshipService } from '../services/relationshipService'; // Yeni servisimizi import ettik

interface AddPatientProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddPatient({ onClose, onSuccess }: AddPatientProps) {
  const [email, setEmail] = useState('');
  const [otpCode, setOtp] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0); // 10 dakika = 600 saniye

  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isCodeSent) {
      setTimeout(() => {
        toast.info("Kodun süresi doldu, lütfen tekrar kod alın.");
        setIsCodeSent(false); // Süre bitince inputları kilitliyoruz
        setOtp(''); // Kodu temizle
      }, 0);
    }
    return () => clearInterval(interval);
  }, [timer, isCodeSent]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequestCode = async () => {
    if (!email) {
      toast.warn("Lütfen önce hastanın e-posta adresini girin.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await relationshipService.requestPatientOtp(email); 
      toast.success(response || "Onay kodu hastaya gönderildi.");
      setIsCodeSent(true);
      setTimer(600); // 10 dakika
    } catch (err) {
      console.error("OTP gönderim hatası:", err);
      toast.error("Kod gönderilirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (timer === 0) {
      toast.error("Kod süresi doldu. Lütfen yeni bir kod alın.");
      return;
    }

    setIsLoading(true);
    try {
      await relationshipService.addPatient({ email, otpCode });
      toast.success("Hasta başarıyla eklendi!");
      if (onSuccess) onSuccess();
      onClose(); // İşlem bitince baloncuğu kapat
    } catch (err) {
      console.error("Hasta ekleme hatası:", err);
      toast.error("Hasta eklenirken bir hata oluştu. Kodu kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Sağa açılması için 'left-[calc(100%+16px)]' ve biraz daha büyük olması için 'w-[400px]' kullandık
    <div className="absolute top-0 left-[calc(100%+1rem)] w-[400px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200 z-50 animate-in fade-in slide-in-from-left-4 duration-200">
      
      {/* Konuşma Baloncuğu Oku (Saga Doğru) */}
      <div className="absolute top-5 -left-[9px] w-4 h-4 bg-white border-l border-t border-slate-200 transform -rotate-45 rounded-tl-sm"></div>
      
      <div className="relative p-6">
        {/* Başlık ve Kapatma Butonu */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Yeni Hasta Ekle</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full p-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Alanı ve Kod Al Butonu */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="Hasta E-posta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isCodeSent}
                required
                placeholder="hasta@mail.com"
              />
            </div>
            <button 
              type="button" 
              onClick={handleRequestCode} 
              disabled={isLoading || (timer > 0) || !email}
              className="mb-[16px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm h-[42px] flex items-center justify-center min-w-[80px]"
            >
              {timer > 0 ? formatTime(timer) : 'Kod Al'}
            </button>
          </div>

          {/* OTP ve Onaylama Alanı - Artık hep görünür ama duruma göre disabled */}
            <Input
              label="6 Haneli Onay Kodu"
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtp(e.target.value)}
              disabled={!isCodeSent} // Kod gönderilmeden önce yazılamaz
              required={isCodeSent}
              className={`tracking-widest text-center text-xl font-medium transition-opacity ${!isCodeSent ? 'opacity-50' : 'opacity-100'}`}
              placeholder="••••••"
            />

            <Button 
              type="submit" 
              variant="primary" 
              disabled={!isCodeSent} // Kod gönderilmeden önce basılamaz
              isLoading={isLoading}
              loadingText="Ekleniyor..."
              className="w-full py-2.5"
            >
              Hastayı Ekle
            </Button>
        </form>
      </div>
    </div>
  );
}