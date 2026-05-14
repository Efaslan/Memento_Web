import { IMaskInput } from 'react-imask';

interface PhoneInputProps {
  label: string;
  value: string;
  onAccept: (value: string) => void;
  required: boolean;
}

export default function PhoneInput({ label, value, onAccept, required}: PhoneInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="flex">
        {/* flag and country code */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 border-r-0 rounded-l-lg px-3 py-2 text-slate-600 font-medium select-none pointer-events-none">
          <img
            src="https://flagcdn.com/w20/tr.png"
            alt="TR"
            className="w-5 h-4"
            />
          <span>+90</span>
        </div>
        
        <IMaskInput
          mask="(000) 000 00 00"
          unmask={true}
          value={value}
          onAccept={(unmaskedValue) => onAccept(unmaskedValue as string)}
          required={required}
          className="flex-1 w-full px-4 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
          placeholder="(5__) ___ __ __"
        />
      </div>
    </div>
  );
}