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
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-accent/50 transition-all text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm"
      id="language-toggle"
    >
      <Languages size={16} className="text-brand-accent" />
      <span className="text-xs font-bold uppercase tracking-wider">{current === 'en' ? 'English' : 'ភាសាខ្មែរ'}</span>
    </button>
  );
}
