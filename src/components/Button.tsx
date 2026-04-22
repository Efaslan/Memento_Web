import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  loadingText?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '',
  isLoading = false,
  loadingText = 'Yükleniyor...',
  disabled, 
  ...rest 
}: ButtonProps) {
  
  // classes for all buttons
  const baseClasses = "font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed";
  
  // special classes for button variants
  const variants = {
    // Senin tasarımındaki "Ana Büyük Buton" sınıfları (w-full ve renkler burada)
    primary: "w-full bg-blue-600 hover:bg-blue-700 text-white",
    
    // İleride lazım olabilecek diğer buton tasarımları için hazırlık
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-800",
    danger: "w-full bg-red-600 hover:bg-red-700 text-white",
  };

  const isDisabled = isLoading || disabled;

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          {/* SVG Spinner */}
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}