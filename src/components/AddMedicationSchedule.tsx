import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { doctorService } from '../services/doctorService';
import type { MedicationScheduleRequestDto, MedicationScheduleResponseDto } from '../types/patient';
import Input from './ui/Input';
import Button from './ui/Button';

interface AddMedicationScheduleProps {
  patientId: number;
  onClose: () => void;
  onSuccess: () => void;
  editData?: MedicationScheduleResponseDto | null;
}

export default function AddMedicationSchedule({ patientId, onClose, onSuccess, editData }: AddMedicationScheduleProps) {
  
  const [medicationName, setMedicationName] = useState(editData?.medicationName || '');
  const [dosage, setDosage] = useState(editData?.dosage || '');
  const [notes, setNotes] = useState(editData?.notes || '');
  const [startDate, setStartDate] = useState(editData?.startDate || '');
  const [endDate, setEndDate] = useState(editData?.endDate || '');
  const [isPrn, setIsPrn] = useState(editData?.isPrn || false);
  
  // Backend'den gelen List<TimeInfoDto> yapısını formdaki string[] state'ine çeviriyoruz
  const [timeInputs, setTimeInputs] = useState<string[]>(
    editData && editData.times && editData.times.length > 0 
      ? editData.times.map(t => t.time.substring(0, 5)) // "08:00:00" -> "08:00"
      : ['']
  );
  
  const [isLoading, setIsLoading] = useState(false);

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...timeInputs];
    newTimes[index] = value;
    setTimeInputs(newTimes);
  };

  const addTimeInput = () => setTimeInputs([...timeInputs, '']);
  
  const removeTimeInput = (index: number) => {
    if (timeInputs.length > 1) {
      setTimeInputs(timeInputs.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validTimes = timeInputs.filter(t => t.trim() !== '');
    if (validTimes.length === 0 && !isPrn) {
      toast.warning("Lütfen en az bir kullanım saati girin.");
      return;
    }

    setIsLoading(true);
    try {
      const payload: MedicationScheduleRequestDto = {
        patientUserId: patientId,
        medicationName,
        dosage,
        notes,
        startDate,
        endDate,
        isPrn,
        times: validTimes // String dizisi olarak backend'e gönderiyoruz
      };

      if (editData) {
        await doctorService.updateMedicationSchedule(editData.scheduleId, payload);
        toast.success("İlaç programı güncellendi!");
      } else {
        await doctorService.addMedicationScheduleToPatient(payload);
        toast.success("İlaç programı başarıyla eklendi!");
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("İşlem hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses = editData
    ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-200 text-left max-h-[90vh] overflow-y-auto custom-scrollbar"
    : "absolute bottom-[calc(100%+12px)] right-0 w-[400px] bg-white rounded-2xl shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 text-left max-h-[80vh] overflow-y-auto custom-scrollbar";

  return (
    <>
      {editData && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={onClose} />}

      <div className={containerClasses}>
        {!editData && <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-slate-200 transform rotate-45 rounded-br-sm"></div>}
        
        <div className="p-5 relative">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">
              {editData ? 'İlaç Programını Düzenle' : 'Yeni İlaç Takvimi'}
            </h3>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full p-1.5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <Input label="İlaç Adı" value={medicationName} onChange={(e) => setMedicationName(e.target.value)} required />
            <Input label="Dozaj (Örn: 1 Tablet, 50mg)" value={dosage} onChange={(e) => setDosage(e.target.value)} required />
            
            <div className="grid grid-cols-2 gap-3">
              <Input label="Başlangıç" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              <Input label="Bitiş" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>

            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" id="isPrn" checked={isPrn} onChange={(e) => setIsPrn(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
              <label htmlFor="isPrn" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                Düzenli Kullanım (PRN)
              </label>
            </div>

            <div className="border border-slate-100 bg-slate-50 p-3 rounded-xl mt-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700">Kullanım Saatleri</label>
                <button type="button" onClick={addTimeInput} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-100 px-2 py-1 rounded">
                  + Saat Ekle
                </button>
              </div>
              
              <div className="space-y-2">
                {timeInputs.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                    label='İlaç Zamanları'
                    type="time" 
                    value={time} 
                    onChange={(e) => handleTimeChange(index, e.target.value)} 
                    required={!isPrn} 
                    />
                    {timeInputs.length > 1 && (
                      <button type="button" onClick={() => removeTimeInput(index)} className="text-red-400 hover:text-red-600 p-2 mt-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Input label="Ek Notlar" value={notes} onChange={(e) => setNotes(e.target.value)} />

            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700">
              {editData ? 'Değişiklikleri Kaydet' : 'İlaç Takvimi Oluştur'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}