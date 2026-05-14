import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { doctorService } from '../services/doctorService';
import type { GeneralReminderRequestDto, RecurrenceRule, GeneralReminderDto } from '../types/patient';
import Input from './ui/Input';
import Button from './ui/Button';

interface AddGeneralReminderProps {
  patientId: number;
  onClose: () => void;
  onSuccess: () => void;
  editData?: GeneralReminderDto | null; // Güncelleme için yeni prop
}

export default function AddGeneralReminder({ patientId, onClose, onSuccess, editData }: AddGeneralReminderProps) {
  
  // State'leri doğrudan editData varsa onunla, yoksa boş değerlerle başlatıyoruz
  const [title, setTitle] = useState(editData?.title || '');
  const [reminderTime, setReminderTime] = useState(
    editData?.reminderTime ? editData.reminderTime.substring(0, 16) : ''
  );
  const [isRecurring, setIsRecurring] = useState(editData?.isRecurring || false);
  const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule | ''>(
    editData?.recurrenceRule || ''
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isRecurring && !recurrenceRule) {
      toast.warning("Lütfen tekrarlama sıklığını seçin.");
      return;
    }

    setIsLoading(true);
    try {
      const payload: GeneralReminderRequestDto = {
        patientUserId: patientId,
        title,
        reminderTime,
        isRecurring,
        ...(isRecurring && { recurrenceRule: recurrenceRule as RecurrenceRule })
      };

      if (editData) {
        // Güncelleme Modu
        await doctorService.updateGeneralReminder(editData.reminderId, payload);
        toast.success("Hatırlatıcı başarıyla güncellendi!");
      } else {
        // Ekleme Modu
        await doctorService.addGeneralReminderToPatient(payload);
        toast.success("Hatırlatıcı başarıyla eklendi!"); 
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error("İşlem sırasında hata:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit modundaysa ekranın ortasında modal, değilse ekle butonunun üstünde popover olarak açılır
  const containerClasses = editData
    ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-200 text-left"
    : "absolute bottom-[calc(100%+12px)] right-0 w-[320px] bg-white rounded-2xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 text-left";

  return (
    <>
      {/* Edit modundaysa arkaplanı karartan overlay */}
      {editData && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={onClose} />
      )}

      <div className={containerClasses}>
        
        {/* Sadece ekleme modundayken aşağı bakan ok görünür */}
        {!editData && (
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-slate-200 transform rotate-45 rounded-br-sm"></div>
        )}
        
        <div className="p-5 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">
              {editData ? 'Hatırlatıcıyı Düzenle' : 'Yeni Hatırlatıcı'}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Başlık"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: İlaç Kontrolü"
              required
            />

            <Input
              label="Tarih ve Saat"
              type="datetime-local"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              required
            />

            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => {
                  setIsRecurring(e.target.checked);
                  if (!e.target.checked) setRecurrenceRule('');
                }}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                Düzenli olarak tekrarlansın mı?
              </label>
            </div>

            {isRecurring && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tekrar Sıklığı
                </label>
                <select
                  value={recurrenceRule}
                  onChange={(e) => setRecurrenceRule(e.target.value as RecurrenceRule)}
                  required={isRecurring}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                >
                  <option value="">Sıklık seçin...</option>
                  <option value="DAILY">Her Gün</option>
                  <option value="WEEKLY">Her Hafta</option>
                  <option value="MONTHLY">Her Ay</option>
                  <option value="YEARLY">Her Yıl</option>
                </select>
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              isLoading={isLoading}
              loadingText="Kaydediliyor..."
              className="w-full mt-2"
            >
              {editData ? 'Değişiklikleri Kaydet' : 'Hatırlatıcı Oluştur'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}