import { Languages } from 'lucide-react';
import { Language } from '../constants';

interface LanguageToggleProps {
  current: Language;
  onToggle: (lang: Language) => void;
}

export default function LanguageToggle({ current, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={() => onToggle(current === 'en' ? 'km' : 'en')}
      className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/40 border border-slate-800 hover:bg-slate-800/60 transition-all group shadow-sm"
      id="language-toggle"
    >
      <Languages size={16} className="text-brand-accent group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-200 group-hover:text-white transition-colors">
        {current === 'en' ? 'ENGLISH' : 'ភាសាខ្មែរ'}
      </span>
    </button>
  );
}
