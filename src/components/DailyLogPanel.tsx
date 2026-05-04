import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { doctorService } from '../services/doctorService';
import type { DailyLogDto } from '../types/dailyLog';

interface DailyLogPanelProps {
  patientId: number;
}

export default function DailyLogPanel({ patientId }: DailyLogPanelProps) {
  const [logs, setLogs] = useState<DailyLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState<number>(7); // Varsayılan 7 gün, içeride yönetiliyor

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const data = await doctorService.getPatientRecentLogs(patientId, days);
        setLogs(data);
      } catch (error) {
        console.error("Loglar çekilirken hata:", error);
        // Toast ile zarif hata gösterimi
        toast.error('Günlük kayıtları çekilirken bir sorun oluştu.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [patientId, days]); // days değiştiğinde istek tekrar atılacak

  const groupedLogs = useMemo(() => {
    const groups: Record<string, { FOOD: DailyLogDto[], WATER: DailyLogDto[] }> = {};

    logs.forEach(log => {
      const date = new Date(log.createdAt).toLocaleDateString('tr-TR', {
        day: '2-digit', month: 'long', year: 'numeric'
      });

      if (!groups[date]) {
        groups[date] = { FOOD: [], WATER: [] };
      }
      groups[date][log.dailyLogType].push(log);
    });

    return groups;
  }, [logs]);

  // Dış Kutu (Card) her zaman görünür olacak. İçerik duruma göre değişecek.
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
      
      {/* BAŞLIK VE DROPDOWN (Sabit kalır) */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-slate-700">Yemek & İçecek Günlüğü</h3>
        <select 
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-md p-1.5 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value={7}>Son 7 Gün</option>
          <option value={14}>Son 14 Gün</option>
          <option value={30}>Son 30 Gün</option>
        </select>
      </div>

      {/* İÇERİK ALANI (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/30">
        
        {/* Yükleniyor Durumu */}
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-blue-500">
            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : Object.keys(groupedLogs).length === 0 ? (
          
          /* Boş Veri Durumu (Placeholder) */
          <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
            <span className="text-2xl">🍽️</span>
            Seçili tarih aralığında kayıt yok.
          </div>

        ) : (
          /* Veri Var Durumu (Liste) */
          <div className="space-y-6">
            {Object.entries(groupedLogs).map(([date, categories]) => (
              <div key={date} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{date}</span>
                  <div className="h-px bg-slate-200 w-full"></div>
                </div>

                <div className="space-y-3 pl-1">
                  {categories.FOOD.length > 0 && (
                    <div className="space-y-2">
                      {categories.FOOD.map(log => (
                        <div key={log.dailyLogId} className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
                          <p className="text-sm text-slate-700">{log.description}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {categories.WATER.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {categories.WATER.map(log => (
                        <div key={log.dailyLogId} className="bg-blue-50 border border-blue-100 p-2 rounded-lg flex justify-between items-center">
                          <span className="text-xs font-semibold text-blue-700">{log.quantityMl} ml</span>
                          <span className="text-[9px] text-blue-400">
                            {new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}