export interface DailyLogDto {
  dailyLogId: number;
  patientUserId: number;
  description: string;
  quantityMl?: number; // Su için ml bilgisi, yemekte null gelebilir
  createdAt: string;   // ISO formatında tarih (2026-04-23T14:30:00)
}