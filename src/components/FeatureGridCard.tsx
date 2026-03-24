import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FeatureGridCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  onClick: () => void;
  tryItNowLabel: string;
}

export default function FeatureGridCard({ 
  icon: Icon, 
  title, 
  description, 
  iconColor, 
  onClick,
  tryItNowLabel
}: FeatureGridCardProps) {
  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel rounded-2xl p-8 flex flex-col gap-6 group cursor-pointer hover:border-brand-accent/50 dark:hover:bg-slate-900/60 hover:bg-white transition-all shadow-lg relative overflow-hidden"
      onClick={onClick}
      id={`feature-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl group-hover:bg-brand-accent/10 transition-colors duration-500" />
      
      <motion.div 
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        className={`w-14 h-14 rounded-2xl ${iconColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}
      >
        <Icon size={28} className="text-white" />
      </motion.div>
      
      <div className="flex flex-col gap-2 relative z-10">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-accent transition-colors">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
      
      <div className="mt-auto flex items-center gap-2 text-brand-accent font-bold text-xs uppercase tracking-widest group-hover:translate-x-2 transition-all relative z-10">
        <span>{tryItNowLabel}</span>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowRight size={14} />
        </motion.div>
      </div>
    </motion.div>
  );
}
