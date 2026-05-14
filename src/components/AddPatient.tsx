import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'react-toastify';
import Input from './ui/Input';
import Button from './ui/Button';
import { relationshipService } from '../services/relationshipService';

interface AddPatientProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddPatient({ onClose, onSuccess }: AddPatientProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await relationshipService.addPatient({ email });
      toast.success("Hasta başarıyla eklendi!");
      if (onSuccess) onSuccess();
      onClose(); // İşlem bitince baloncuğu kapat
    } catch (err) {
      console.error("Hasta ekleme hatası:", err);
      toast.error("Hasta eklenirken bir hata oluştu.");
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
                required
                placeholder="hasta@mail.com"
              />
            </div>
          </div>

            <Button 
              type="submit" 
              variant="primary" 
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