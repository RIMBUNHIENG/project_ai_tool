import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FeatureCard({ icon: Icon, title, isActive, onClick }: FeatureCardProps) {
  return (
    <motion.button
      whileHover={{ x: 4, backgroundColor: isActive ? undefined : 'rgba(99, 102, 241, 0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${
        isActive
          ? 'nav-item-active'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
      }`}
      id={`feature-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-brand-accent/10 dark:bg-brand-accent/20 border-r-2 border-brand-accent"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      
      <Icon 
        size={18} 
        className={`relative z-10 transition-colors duration-300 ${
          isActive ? 'text-brand-accent' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
        }`} 
      />
      <span className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
        isActive ? 'text-brand-accent' : ''
      }`}>
        {title}
      </span>
    </motion.button>
  );
}
