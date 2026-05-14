import { useAuth } from '../../hooks/useAuth';
import DoctorProfile from '../DoctorProfile';

export default function Header() {
  const { logout } = useAuth(); // Sadece çıkış işlemi için user'a ihtiyacımız yok

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-20 relative">
      
      {/* Logo and title */}
      <div className="flex items-center gap-3">
        <div className="w-25 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner px-2">
          Memento
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Doktor Paneli</h1>
      </div>
      
      {/* user info and logout */}
      <div className="flex items-center gap-6 relative">
        
        {/* Doktor Profili Bileşeni */}
        <DoctorProfile />
        
        {/* logout button */}
        <button 
          onClick={logout}
          className="w-10 h-10 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-full flex items-center justify-center transition-colors shrink-0"
          title="Çıkış Yap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
      
    </header>
  );
}