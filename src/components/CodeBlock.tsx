import { useState } from 'react';
import { motion } from 'motion/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from './CopyButton';

interface CodeBlockProps {
  code: string;
  language?: string;
  theme?: 'dark' | 'light';
}

export default function CodeBlock({ code, language = 'javascript', theme = 'dark' }: CodeBlockProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group rounded-xl overflow-hidden glass-panel shadow-xl my-4"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-slate-200 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800">
        <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">{language}</span>
        <CopyButton text={code} className="p-1 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-accent dark:hover:text-brand-accent transition-colors" />
      </div>
      <div className="text-sm font-mono leading-relaxed bg-[#1e1e1e]">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '0.9rem',
            lineHeight: '1.6',
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  );
}
