import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FeatureGridCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgColor: string;
  onClick: () => void;
  tryItNowLabel: string;
}

export default function FeatureGridCard({ 
  icon: Icon, 
  title, 
  description, 
  iconBgColor, 
  onClick,
  tryItNowLabel
}: FeatureGridCardProps) {
  return (
    <motion.div
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#0c1221] rounded-[32px] p-10 flex flex-col gap-8 group cursor-pointer border border-[#1e293b] hover:border-brand-accent/50 transition-all duration-300 shadow-2xl relative overflow-hidden h-full"
      onClick={onClick}
    >
      {/* Subtle Background Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Icon Container */}
      <div className={`w-20 h-20 rounded-3xl ${iconBgColor} flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={36} className="text-white" />
      </div>
      
      <div className="flex flex-col gap-4 relative z-10">
        <h3 className="text-2xl font-bold text-white group-hover:text-brand-accent transition-colors duration-300">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed font-medium">
          {description}
        </p>
      </div>
      
      <div className="mt-auto flex items-center gap-3 text-brand-accent font-bold text-xs uppercase tracking-[0.2em] group-hover:translate-x-2 transition-all duration-300 relative z-10">
        <span>{tryItNowLabel}</span>
        <ArrowRight size={16} className="transition-transform duration-300" />
      </div>
    </motion.div>
  );
}
