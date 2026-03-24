import { useState } from 'react';
import { motion } from 'motion/react';
import CopyButton from './CopyButton';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group rounded-xl overflow-hidden glass-panel shadow-xl"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/50">
        <span className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">{language}</span>
        <CopyButton text={code} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-brand-accent" />
      </div>
      <pre className="p-6 overflow-x-auto font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/30">
        <code>{code}</code>
      </pre>
    </motion.div>
  );
}
