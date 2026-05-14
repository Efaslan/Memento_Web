import { useState } from 'react';
import Header from '../components/ui/Header';
import PatientList from '../components/PatientList';
import type { PatientCardDto } from '../types/patient';
import DailyLogPanel from '../components/DailyLogPanel';
import GeneralReminderPanel from '../components/GeneralReminderPanel';

export default function Dashboard() {
  // SAĞ PANEL İÇİN HAFIZA: Şu an hangi hasta seçili?
  const [selectedPatient, setSelectedPatient] = useState<PatientCardDto | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      <Header />

      <main className="flex-1 flex overflow-hidden">
        {/* SOL: Hasta Listesi (Props'ları gönderiyoruz) */}
        <PatientList 
          selectedPatientId={selectedPatient?.patientId || null}
          onSelectPatient={(patient) => setSelectedPatient(patient)}
        />

        {/* SAĞ: Hasta Detayları */}
        <section className="flex-1 p-6 overflow-y-auto">
          
          {/* Eğer hasta seçilmediyse o ortadaki boş ekranı gösteriyoruz */}
          {!selectedPatient ? (
             <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
               <div className="text-center">
                 <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
                 <h3 className="text-lg font-medium text-slate-900">Hasta Seçilmedi</h3>
                 <p className="mt-1 text-sm text-slate-500">Detayları görüntülemek için sol menüden bir hasta seçin.</p>
               </div>
            </div>
          ) : (
            /* EĞER HASTA SEÇİLDİYSE DETAYLARI GÖSTER */
            <>
              {/* Dinamik Üst Bilgi Satırı */}
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <p className="text-slate-500 flex items-center gap-3 mt-1">
                    {selectedPatient.dateOfBirth && <span> Doğum: {selectedPatient.dateOfBirth}</span>}
                    {selectedPatient.heightCm && <span> {selectedPatient.heightCm} cm</span>}
                    {selectedPatient.weightKg && <span> {selectedPatient.weightKg} kg</span>}
                    {selectedPatient.emergencyNotes && <span> Not: {selectedPatient.emergencyNotes}</span>}
                  </p>
                </div>
              </div>

              {/* Geçen mesajda çizdiğimiz o Kolonlu Grid Yapısı buraya gelecek... */}
              <div className="grid grid-cols-12 gap-6">
                 {/* ... Yemek Paneli, İlaç Paneli vs ... */}
                 {/* SOL KOLON (4 Birim): Yemek Günlüğü ve Hatırlatmalar */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  
                  {/* Yemek Paneli (Kendi kutusunu ve mantığını kendi yönetir) */}
                  <DailyLogPanel patientId={selectedPatient.patientId} />

                  {/* Hatırlatma Paneli (Bunu da aynı mantıkla ayıracağız) */}
                  <GeneralReminderPanel patientId={selectedPatient.patientId} />
                </div>
              </div>
            </>
          )}

        </section>
      </main>
    </div>
  );
}