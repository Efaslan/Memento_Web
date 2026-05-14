import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { doctorService } from '../services/doctorService';
import type { MedicationScheduleResponseDto } from '../types/patient';
import AddMedicationSchedule from './AddMedicationSchedule';

interface MedicationSchedulesPanelProps {
  patientId: number;
}

type TabType = 'active' | 'past';

export default function MedicationSchedulesPanel({ patientId }: MedicationSchedulesPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [schedules, setSchedules] = useState<MedicationScheduleResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<MedicationScheduleResponseDto | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (activeTab === 'past') {
        setSchedules([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await doctorService.getPatientActiveMedicationSchedules(patientId);
        setSchedules(data);
      } catch (error) {
        console.error("İlaç programları çekilirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (patientId) fetchSchedules();
  }, [patientId, activeTab, refreshTrigger]);

  const handleDelete = async (scheduleId: number) => {
    try {
      await doctorService.deactivateMedicationSchedule(scheduleId);
      toast.success("İlaç programı sonlandırıldı.");
      setDeleteConfirmId(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("İptal işlemi başarısız:", error);
    }
  };

  const prnSchedules = schedules.filter(s => s.isPrn);
  const regularSchedules = schedules.filter(s => !s.isPrn);

  const renderMedicationCard = (schedule: MedicationScheduleResponseDto) => {
    // TypeScript artık schedule.times'ın bir dizi olduğunu bildiği için doğrudan map kullanabiliriz
    const timeDisplay = schedule.times && schedule.times.length > 0
      ? schedule.times.map(t => t.time.substring(0, 5)).join(', ') 
      : 'Saat belirtilmemiş';

    return (
      <div key={schedule.scheduleId} className="relative bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm hover:border-indigo-300 transition-colors flex gap-3 overflow-hidden">
        
        {/* SİLME ONAY EKRANI */}
        {deleteConfirmId === schedule.scheduleId && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2 animate-in fade-in duration-200">
            <span className="text-sm font-semibold text-slate-700">İlacı sonlandırmak istiyor musunuz?</span>
            <div className="flex gap-2">
              <button onClick={() => handleDelete(schedule.scheduleId)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                Evet, Sonlandır
              </button>
              <button onClick={() => setDeleteConfirmId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                İptal
              </button>
            </div>
          </div>
        )}

        {/* İlaç İkonu */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.5 20.5 19 12a2.828 2.828 0 0 0-4-4L6.5 16.5a2.828 2.828 0 0 0 4 4z"></path><path d="m12 12 4.5 4.5"></path><path d="m4.5 4.5 1 1"></path><path d="m4.5 4.5 3 3"></path>
            </svg>
          </div>
        </div>

        {/* İlaç Detayları */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-800 leading-tight truncate">
                {schedule.medicationName}
              </h4>
              <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                {schedule.dosage}
              </p>
            </div>
            
            {/* SAĞ TARAF: Saat Rozeti ve Aksiyon Butonları */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 whitespace-nowrap flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {timeDisplay}
              </span>
              
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg p-0.5">
                <button onClick={() => setEditingSchedule(schedule)} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded transition-colors" title="Düzenle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
                <button onClick={() => setDeleteConfirmId(schedule.scheduleId)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors" title="Sonlandır">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          </div>
          
          {schedule.notes && (
            <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-md border border-slate-100 line-clamp-2">
              {schedule.notes}
            </p>
          )}

          <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {schedule.startDate} - {schedule.endDate}
            </div>
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Dr. {schedule.doctorName}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
      
      {/* ÜST KISIM */}
      <div className="px-4 pt-4 border-b border-slate-100 shrink-0">
        
        {/* Row 1: Başlık ve Ekle Butonu */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-700">İlaç Programı</h3>
          <div className="relative">
            <button onClick={() => setIsAddOpen(!isAddOpen)} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Takvim Oluştur
            </button>
            {isAddOpen && (
              <AddMedicationSchedule patientId={patientId} onClose={() => setIsAddOpen(false)} onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
            )}
          </div>
        </div>
        
        {/* Row 2: Ortalanmış Sekmeler */}
        <div className="flex justify-center gap-6 w-full mt-2">
          <button onClick={() => setActiveTab('active')} className={`pb-2.5 text-sm font-semibold transition-colors relative px-2 ${activeTab === 'active' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
            Aktif
            {activeTab === 'active' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
          
          <button onClick={() => setActiveTab('past')} className={`pb-2.5 text-sm font-semibold transition-colors relative px-2 ${activeTab === 'past' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
            Geçmiş
            {activeTab === 'past' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
          </button>
        </div>
      </div>

      {/* İÇERİK ALANI */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/30">
        
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-indigo-500">
            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : activeTab === 'past' ? (
          <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
            <span className="text-2xl">⏳</span>
            Geçmiş ilaç kayıtları yakında eklenecektir.
          </div>
        ) : schedules.length === 0 ? (
          <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
            <span className="text-2xl">💊</span>
            Hastanın aktif bir ilaç programı bulunmuyor.
          </div>
        ) : (
          <div className="space-y-6">
            
            {prnSchedules.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Düzenli İlaçlar</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="space-y-3">
                  {prnSchedules.map(renderMedicationCard)}
                </div>
              </div>
            )}

            {prnSchedules.length > 0 && regularSchedules.length > 0 && (
              <div className="h-px w-full bg-slate-200/50 my-2"></div>
            )}

            {regularSchedules.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Diğer İlaçlar</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="space-y-3">
                  {regularSchedules.map(renderMedicationCard)}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* GÜNCELLEME MODALI */}
      {editingSchedule && (
        <AddMedicationSchedule 
          patientId={patientId} 
          editData={editingSchedule} 
          onClose={() => setEditingSchedule(null)} 
          onSuccess={() => {
            setRefreshTrigger(prev => prev + 1);
            setEditingSchedule(null);
          }} 
        />
      )}

    </div>
  );
}