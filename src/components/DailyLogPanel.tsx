import { useState, useEffect, useMemo } from 'react';
import { doctorService } from '../services/doctorService';
import type { DailyLogDto } from '../types/patient';

interface DailyLogPanelProps {
  patientId: number;
}

export default function DailyLogPanel({ patientId }: DailyLogPanelProps) {
  const [logs, setLogs] = useState<DailyLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState<number>(7);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const data = await doctorService.getPatientRecentLogs(patientId, days);
        setLogs(data);
      } catch (error) {
        console.error("Loglar çekilirken hata:", error);
        // Hata mesajı interceptor'dan geleceği için buradaki toast'ı silebilirsin veya tutabilirsin
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [patientId, days]);

  // Sadece tarihe göre gruplama yapıyoruz
  const groupedLogs = useMemo(() => {
    const groups: Record<string, DailyLogDto[]> = {};

    logs.forEach(log => {
      const date = new Date(log.createdAt).toLocaleDateString('tr-TR', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
    });

    return groups;
  }, [logs]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-100">
      
      {/* BAŞLIK VE DROPDOWN */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-slate-700">Günlük Kayıtlar</h3>
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

      {/* İÇERİK ALANI */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/30">
        
        {/* Yükleniyor Durumu */}
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-blue-500">
            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : Object.keys(groupedLogs).length === 0 ? (
          
          /* Boş Veri Durumu */
          <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
            <span className="text-2xl">📝</span>
            Seçili tarih aralığında kayıt yok.
          </div>

        ) : (
          /* Veri Var Durumu (Tek Tip Liste) */
          <div className="space-y-6">
            {Object.entries(groupedLogs).map(([date, dailyLogs]) => (
              <div key={date} className="relative">
                
                {/* Tarih Ayırıcı Çizgisi */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{date}</span>
                  <div className="h-px bg-slate-200 w-full"></div>
                </div>

                {/* O Güne Ait Loglar */}
                <div className="space-y-2 pl-1">
                  {dailyLogs.map(log => (
                    <div key={log.dailyLogId} className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm hover:border-blue-200 transition-colors flex flex-col gap-2">
                      
                      {/* Açıklama Varsa Göster */}
                      {log.description && (
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {log.description}
                        </p>
                      )}
                      
                      {/* Alt Kısım: Miktar ve Saat */}
                      <div className="flex justify-between items-end mt-1">
                        
                        {/* Miktar (Ml) Varsa Göster */}
                        {log.quantityMl && log.quantityMl > 0 ? (
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-600 px-2 py-1 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-blue-500">
                              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </svg>
                            <span className="text-xs font-bold">{log.quantityMl} ml</span>
                          </div>
                        ) : (
                          <div></div> /* Flex-between dengesini korumak için boş div */
                        )}

                        {/* Saat (Her zaman en sağda durur) */}
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          {new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}