import { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import type { PatientCardDto } from '../types/patient';

interface PatientListProps {
  selectedPatientId: number | null;
  onSelectPatient: (patient: PatientCardDto) => void;
}

export default function PatientList({ selectedPatientId, onSelectPatient }: PatientListProps) {
  const [patients, setPatients] = useState<PatientCardDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination (Sayfalama) stateleri
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Arama kutusuna yazıldığında 500ms bekleyip asıl arama kelimesini (debounced) günceller
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0); // Yeni arama yapıldığında her zaman 0. sayfaya dön
    }, 500);

    return () => clearTimeout(timer); // Kullanıcı yazmaya devam ederse sayacı sıfırla
  }, [searchTerm]);

  // 2. Arama kelimesi veya sayfa değiştiğinde backend'den verileri çek
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await doctorService.getMyPatients(debouncedSearch, page);
        
        // Eğer 0. sayfadaysak listeyi sıfırla, değilse eski listeye ekle (Infinite Scroll mantığı)
        if (page === 0) {
          setPatients(response.content);
        } else {
          setPatients((prev) => [...prev, ...response.content]);
        }
        
        // Başka sayfa var mı? (Örn: totalPages 5 ise ve biz 4. sayfadaysak son sayfadayız demektir)
        setHasMore(!response.last);
        
      } catch (err) {
        console.error("Hastalar çekilirken hata:", err);
        setError('Hastalar yüklenemedi. Lütfen tekrar deneyin.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [debouncedSearch, page]);

  return (
    <aside className="w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Arama Alanı */}
      <div className="p-4 border-b border-slate-100 shrink-0">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Hasta adı ile ara..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Kaydırılabilir Kart Listesi */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30">
        
        {error && <div className="text-red-500 text-sm text-center p-2">{error}</div>}
        
        {/* Hastalar Yoksa */}
        {!isLoading && patients.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-10">
            Arama kriterine uygun hasta bulunamadı.
          </div>
        )}

        {/* Hasta Kartları */}
        {patients.map((patient) => {
          const isSelected = selectedPatientId === patient.patientId;
          
          return (
            <div 
              key={patient.relationshipId} 
              onClick={() => onSelectPatient(patient)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-blue-50 border-blue-400 shadow-md ring-1 ring-blue-400' 
                  : 'bg-white border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className={`font-bold ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>
                    {patient.firstName} {patient.lastName}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    {patient.email}
                  </div>
                </div>
                {/* Kan Grubu Rozeti (Varsa) */}
                {patient.bloodType && (
                  <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-md border border-red-100">
                    {patient.bloodType.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Daha Fazla Yükle Butonu & Yükleniyor Göstergesi */}
        {isLoading && (
          <div className="text-center text-blue-600 text-sm font-medium py-4">
            Yükleniyor...
          </div>
        )}
        
        {!isLoading && hasMore && (
          <button 
            onClick={() => setPage(prev => prev + 1)}
            className="w-full py-2.5 mt-2 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Daha Fazla Göster
          </button>
        )}
      </div>
    </aside>
  );
}