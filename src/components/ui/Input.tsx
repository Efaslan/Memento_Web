import React from 'react';

// inheriting the Input element's attributes to our props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; 
}

export default function Input({ 
  label, 
  className = '', // other classes can be added
  ...rest // value, onChange, placeholder, required etc.
}: InputProps) {
  
  return (
    <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>

      {/* Input field */}
      <input
        className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all invalid:focus:ring-red-500 invalid:focus:border-red-500 ${className}`}
        {...rest} // value, onChange...
      />
    </div>
  );
}