import { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import type { GeneralReminderDto } from '../types/patient';
import AddGeneralReminder from './AddGeneralReminder';
import { toast } from 'react-toastify';

interface ReminderPanelProps {
  patientId: number;
}

const recurrenceTranslator: Record<string, string> = {
  DAILY: 'Her Gün',
  WEEKLY: 'Her Hafta',
  MONTHLY: 'Her Ay',
  YEARLY: 'Her Yıl'
};

export default function ReminderPanel({ patientId }: ReminderPanelProps) {
  const [reminders, setReminders] = useState<GeneralReminderDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingReminder, setEditingReminder] = useState<GeneralReminderDto | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      setIsLoading(true);
      try {
        const data = await doctorService.getPatientGeneralReminders(patientId);
        setReminders(data);
      } catch (error) {
        console.error("Hatırlatmalar çekilirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (patientId) {
      fetchReminders();
    }
  }, [patientId, refreshTrigger]); // refreshTrigger değiştiğinde tekrar çeker

  const handleDelete = async (reminderId: number) => {
    try {
      await doctorService.deleteGeneralReminder(reminderId);
      toast.success("Hatırlatıcı silindi.");
      setDeleteConfirmId(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[300px]">
      
      {/* BAŞLIK VE EKLE BUTONU */}
      <div className="p-4 border-b border-slate-100 shrink-0 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">Genel Hatırlatmalar</h3>
        
        <div className="relative">
          <button 
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Hatırlatıcı Ekle ({reminders.length})
          </button>

          {/* Ekleme Popover'ı */}
          {isAddOpen && (
            <AddGeneralReminder 
              patientId={patientId} 
              onClose={() => setIsAddOpen(false)} 
              onSuccess={() => setRefreshTrigger(prev => prev + 1)} 
            />
          )}
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/30">
        
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-blue-500">
            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : reminders.length === 0 ? (
          <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
            <span className="text-2xl">🔔</span>
            Aktif bir hatırlatma bulunmuyor.
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map(reminder => {
              const timeString = reminder.reminderTime.length > 5 
                ? new Date(reminder.reminderTime).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                : reminder.reminderTime;

              return (
                // 'group' class'ını sildik, hover mantığı yok
                <div key={reminder.reminderId} className="relative bg-white border border-slate-200 p-3 rounded-xl shadow-sm hover:border-blue-300 transition-colors flex gap-3 overflow-hidden">
                  
                  {/* SİLME ONAY EKRANI (Aynı kalıyor) */}
                  {deleteConfirmId === reminder.reminderId && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2 animate-in fade-in duration-200">
                      <span className="text-sm font-semibold text-slate-700">Bu hatırlatıcıyı silmek istiyor musunuz?</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleDelete(reminder.reminderId)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                          Evet, Sil
                        </button>
                        <button onClick={() => setDeleteConfirmId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                          İptal
                        </button>
                      </div>
                    </div>
                  )}

                  {/* İkon Alanı */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </div>
                  </div>

                  {/* İçerik */}
                  <div className="flex-1 min-w-0"> {/* min-w-0 ile taşmaları engelliyoruz */}
                    
                    {/* Üst Satır: Başlık, Tarih ve Butonlar */}
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-slate-800 leading-tight truncate mt-0.5">
                        {reminder.title}
                      </h4>
                      
                      {/* Sağ Taraf: [Tarih] [Kalem] [Çöp Kutusu] */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 whitespace-nowrap">
                          {timeString}
                        </span>
                        
                        {/* Aksiyon Butonları (Her Zaman Görünür) */}
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg p-0.5">
                          <button 
                            onClick={() => setEditingReminder(reminder)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Düzenle"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(reminder.reminderId)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Sil"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Açıklama ve Alt Bilgiler */}
                    {reminder.description && (
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                        {reminder.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2.5">
                      {reminder.isRecurring && reminder.recurrenceRule && (
                        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                          {recurrenceTranslator[reminder.recurrenceRule.toString()] || reminder.recurrenceRule}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Ekleyen: {reminder.creatorName}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Güncelleme (Edit) Modalı */}
      {editingReminder && (
        <AddGeneralReminder
          patientId={patientId}
          editData={editingReminder}
          onClose={() => setEditingReminder(null)}
          onSuccess={() => {
            setRefreshTrigger(prev => prev + 1);
            setEditingReminder(null);
          }}
        />
      )}
      
    </div>
  );
}