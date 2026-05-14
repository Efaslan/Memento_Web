import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { profileService } from '../services/profileService';
import type { DoctorProfileRequestDto } from '../types/doctorProfile';
import Input from './Input';
import Button from './Button';
import PhoneInput from './PhoneInput';

export default function DoctorProfile() {
  const { user, updateUser } = useAuth();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // İlk state'i user objesi ile başlatıyoruz
  const [formData, setFormData] = useState<DoctorProfileRequestDto>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    specialization: '',
    hospitalName: '',
    title: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await profileService.getMyProfile();
        
        // Form verisini hem user'dan hem de varsa profilden gelen verilerle harmanlıyoruz
        setFormData({
          // Temel bilgiler her zaman Auth Context'ten (user objesinden) gelir
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          phoneNumber: user?.phoneNumber || '',
          
          // Profil bilgileri endpoint'ten gelir, null ise boş string olur
          specialization: data?.specialization || '',
          hospitalName: data?.hospitalName || '',
          title: data?.title || ''
        });
      } catch (err) {
        console.error("Profil çekilemedi:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isProfileOpen) {
      fetchProfile();
    }
  }, [isProfileOpen, user]); // user değişirse de useEffect haberdar olsun

  const handleInputChange = (field: keyof DoctorProfileRequestDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await profileService.updateDoctorProfile(formData);

      updateUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber
          });

      toast.success("Profil başarıyla güncellendi!");
    } catch (err) {
      console.error("Profil güncellenirken hata:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="group flex flex-col items-end text-right focus:outline-none"
      >
        <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors flex items-center gap-1 border-b border-dashed border-slate-400 group-hover:border-blue-600 pb-0.5">
          Dr. {user?.firstName} {user?.lastName}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </p>
      </button>

      {isProfileOpen && (
        <div className="absolute top-[calc(100%+16px)] right-0 w-[480px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200 z-50 animate-in fade-in slide-in-from-top-4 duration-200 cursor-default text-left">
          
          <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-slate-200 transform rotate-45 rounded-tl-sm"></div>
          
          <div className="p-6 relative">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-800">Profil Bilgileri</h3>
              <button onClick={() => setIsProfileOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {isLoading ? (
              <div className="py-10 text-center text-slate-500 font-medium animate-pulse">
                Bilgiler yükleniyor...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col">
                
                {/* --- KİŞİSEL BİLGİLER BÖLÜMÜ --- */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-400 tracking-wider mb-3">Kişisel Bilgiler</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Ad"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                    <Input
                      label="Soyad"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>

                    <Input
                      label="E-posta"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                    <PhoneInput
                      label="Telefon"
                      value={formData.phoneNumber}
                      onAccept={(val) => handleInputChange('phoneNumber', val)}
                      required
                    />
                </div>

                <hr className="border-slate-100 mb-4" />

                {/* --- MESLEKİ BİLGİLER BÖLÜMÜ --- */}
                <div className="mb-2">
                  <h4 className="text-sm font-bold text-slate-400 tracking-wider mb-3">Mesleki Bilgiler</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Unvan"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Örn: Prof. Dr."
                      required
                    />
                    <Input
                      label="Uzmanlık"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      placeholder="Örn: Kardiyoloji"
                      required
                    />
                  </div>

                  <Input
                    label="Hastane Adı"
                    value={formData.hospitalName}
                    onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                    required
                  />
                </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={isSaving}
                    loadingText="Kaydediliyor..."
                    className="w-full"
                  >
                    Profili Güncelle
                  </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}