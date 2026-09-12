import React, { useState } from 'react';
import { sound } from '../services/sound';
import { Volume2, Sparkles } from 'lucide-react';

export type MascotMood = 'neutral' | 'happy' | 'thinking' | 'cheering' | 'celebrate' | 'encouraging';

interface KafaMascotProps {
  mood?: MascotMood;
  customMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
  interactive?: boolean;
  className?: string;
}

const DEFAULT_QUOTES = [
  'Belajar Matematika, Main Sambil Hebat! 🌟',
  'Yuk coba lagi, kamu pasti bisa! 😊',
  'Kamu semakin jago menghitung hari ini!',
  'Sedikit lagi menuju level berikutnya! 🚀',
  'Hebat! Matematika itu seru dan mengasyikkan!',
  'Jangan takut salah, dari mencoba kita jadi pintar! ✨',
];

export const KafaMascot: React.FC<KafaMascotProps> = ({
  mood = 'neutral',
  customMessage,
  size = 'md',
  showSpeechBubble = true,
  interactive = true,
  className = '',
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const currentMessage = customMessage || DEFAULT_QUOTES[quoteIndex % DEFAULT_QUOTES.length];

  const handleClick = () => {
    if (!interactive) return;
    sound.playPop();
    setQuoteIndex((prev) => prev + 1);
    sound.speak(currentMessage);
  };

  const getMascotEmoji = () => {
    switch (mood) {
      case 'happy':
      case 'celebrate':
        return '🦊🎉';
      case 'cheering':
        return '🦊✨';
      case 'thinking':
        return '🦊💡';
      case 'encouraging':
        return '🦊💪';
      default:
        return '🦊';
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-2xl',
    md: 'w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl',
    lg: 'w-24 h-24 sm:w-28 sm:h-28 text-5xl sm:text-6xl',
  };

  return (
    <div className={`flex items-center gap-3 relative ${className}`}>
      {/* Mascot Avatar Figure */}
      <button
        type="button"
        onClick={handleClick}
        disabled={!interactive}
        title={interactive ? 'Klik KAFA untuk mendengar pesan semangat!' : 'Maskot KAFA'}
        className={`${sizeClasses[size]} rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-400 p-1 flex items-center justify-center shadow-lg border-3 border-white transition-all transform ${
          interactive ? 'hover:scale-105 active:scale-95 cursor-pointer animate-bounce-subtle' : ''
        }`}
        style={{ animationDuration: '3s' }}
      >
        <div className="w-full h-full rounded-2xl bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-xs flex items-center justify-center select-none">
          <span className="filter drop-shadow-md">{getMascotEmoji()}</span>
        </div>
      </button>

      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border-2 border-amber-300 shadow-md max-w-xs sm:max-w-md animate-in fade-in zoom-in-95">
          {/* Arrow pointing to mascot */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-b-2 border-l-2 border-amber-300 transform rotate-45" />

          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> KAFA Menyemangati:
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug mt-0.5">
                "{currentMessage}"
              </p>
            </div>

            <button
              onClick={() => sound.speak(currentMessage)}
              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-xl cursor-pointer transition-transform active:scale-90 flex-shrink-0"
              title="Dengarkan Suara KAFA"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
