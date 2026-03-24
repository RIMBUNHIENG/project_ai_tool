import { motion } from 'motion/react';
import { Cpu, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  theme: 'light' | 'dark';
}

export default function SplashScreen({ onComplete, theme }: SplashScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-white'
      }`}
    >
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`w-32 h-32 rounded-full border-2 border-dashed ${
            theme === 'dark' ? 'border-brand-accent/30' : 'border-brand-accent/20'
          }`}
        />

        {/* Inner Glow */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-0 bg-brand-accent blur-3xl rounded-full"
        />

        {/* Icon Container */}
        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3 
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative">
            <Cpu size={48} className="text-brand-accent" />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles size={20} className="text-brand-accent" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Text Content */}
      <div className="mt-12 text-center overflow-hidden">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className={`text-4xl font-black tracking-tighter ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          FNB AI PRO
        </motion.h1>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
          className="h-1 bg-brand-accent mt-4 mx-auto rounded-full"
          onAnimationComplete={() => {
            // Give a small pause after the bar fills
            setTimeout(onComplete, 500);
          }}
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className={`mt-4 text-xs font-bold uppercase tracking-[0.3em] ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          Initializing Systems
        </motion.p>
      </div>
    </motion.div>
  );
}
