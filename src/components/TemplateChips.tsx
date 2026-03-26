import React from 'react';
import { Sparkles, Layout, CreditCard, Menu, Image } from 'lucide-react';

interface Template {
  id: string;
  label: string;
  prompt: string;
  icon: React.ElementType;
}

export const QUICK_TEMPLATES: Template[] = [
  {
    id: 'bento',
    label: 'Bento Grid',
    prompt: 'Create a modern Bento Grid dashboard layout with glassmorphism effects, subtle shadows, and responsive design. Include sections for stats, a small chart, and recent activity.',
    icon: Layout
  },
  {
    id: 'card',
    label: 'Glass Card',
    prompt: 'Create a premium Glassmorphism credit card or profile card with beautiful gradients, frosted glass effect, and elegant typography. Add a subtle hover animation.',
    icon: CreditCard
  },
  {
    id: 'navbar',
    label: 'Modern Navbar',
    prompt: 'Create a sleek, sticky navigation bar with a glass effect, centered links, and animated hover underlines. Include a "Get Started" button with a gradient glow.',
    icon: Menu
  },
  {
    id: 'hero',
    label: 'Hero Section',
    prompt: 'Create a stunning hero section for a creative agency. Include a large heading with a text gradient, a subheadline, primary/secondary buttons, and an abstract floating 3D-like shape using CSS.',
    icon: Image
  }
];

interface TemplateChipsProps {
  onSelect: (prompt: string) => void;
  theme: 'dark' | 'light';
}

export default function TemplateChips({ onSelect, theme }: TemplateChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 mr-2 px-2 py-1">
        <Sparkles size={12} className="text-brand-accent" />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Quick Start:</span>
      </div>
      {QUICK_TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.prompt)}
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all active:scale-95 ${
            theme === 'dark' 
              ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-brand-accent hover:text-brand-accent' 
              : 'bg-white border-slate-200 text-slate-500 hover:border-brand-accent hover:text-brand-accent shadow-sm'
          }`}
        >
          <template.icon size={12} className="group-hover:scale-110 transition-transform" />
          {template.label}
        </button>
      ))}
    </div>
  );
}
