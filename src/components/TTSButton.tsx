import { Volume2, Square, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TTSButtonProps {
  text: string;
  language?: string;
  className?: string;
}

export default function TTSButton({ text, language = "en", className = "" }: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTogglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    if (!text) return;

    setIsLoading(true);
    try {
      // Clean text: strip code blocks, multiple newlines, and unnecessary symbols
      const cleanText = text
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`[\s\S]*?`/g, '')   // Remove inline code
        .replace(/[#*_-]/g, ' ')      // Remove common markdown symbols
        .replace(/\s+/g, ' ')         // Normalize whitespace
        .trim();

      if (!cleanText) throw new Error('No readable text found (only code?)');

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, language })
      });

      if (!response.ok) throw new Error('Failed to fetch audio');

      const data = await response.json();
      const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsLoading(false);
        setIsPlaying(true);
      };

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
        console.error("Audio playback error");
      };

      await audio.play();
    } catch (err) {
      console.error('Failed to play TTS: ', err);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleTogglePlay}
      disabled={isLoading}
      className={`p-2 rounded-lg transition-all relative flex items-center justify-center ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isPlaying ? "Stop" : "Speak"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 size={16} className="animate-spin text-brand-accent" />
          </motion.div>
        ) : isPlaying ? (
          <motion.div
            key="stop"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Square size={16} className="fill-brand-accent text-brand-accent" />
          </motion.div>
        ) : (
          <motion.div
            key="speak"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Volume2 size={16} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
