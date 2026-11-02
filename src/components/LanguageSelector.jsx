import React from 'react';
import { Languages, ChevronDown } from 'lucide-react';

export default function LanguageSelector({ currentLang = 'en', onLanguageChange, compact = false }) {
  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'हिन्दी', native: 'Hindi' },
    { code: 'ta', label: 'தமிழ்', native: 'Tamil' }
  ];

  return (
    <div className="relative inline-flex items-center">
      <div className="relative flex items-center bg-white border border-slate-300 hover:border-emerald-600 focus-within:border-emerald-600 rounded-xl shadow-2xs transition-colors">
        <div className="pl-3 flex items-center pointer-events-none text-emerald-700">
          <Languages className="w-4 h-4 text-[#062E38]" />
        </div>
        <select
          value={currentLang}
          onChange={(e) => onLanguageChange(e.target.value)}
          aria-label="Choose Language"
          className="appearance-none bg-transparent pl-2.5 pr-8 py-2 min-h-[44px] text-[14px] font-semibold text-[#062E38] cursor-pointer focus:outline-none"
          title="Scroll down to choose language"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-slate-900 font-semibold py-1">
              {lang.label} ({lang.native})
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 flex items-center pointer-events-none text-slate-500">
          <ChevronDown className="w-4 h-4 text-slate-600" />
        </div>
      </div>
    </div>
  );
}

