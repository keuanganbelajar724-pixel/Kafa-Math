import React from 'react';
import { sound } from '../../services/sound';
import { Waves, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface InteractiveSteppingStonesProps {
  options: string[];
  correctAnswer: string;
  selectedOption: string | null;
  isAnswered: boolean;
  onSelectStone: (optionText: string, stoneIndex: number) => void;
  disabled?: boolean;
}

export const InteractiveSteppingStones: React.FC<InteractiveSteppingStonesProps> = ({
  options,
  correctAnswer,
  selectedOption,
  isAnswered,
  onSelectStone,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      {/* Rushing River Basin */}
      <div className="relative w-full rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-500 to-teal-600 p-4 border-4 border-cyan-300 shadow-xl overflow-hidden">
        {/* Animated Water Ripples */}
        <div className="absolute inset-0 opacity-30 flex justify-between items-center pointer-events-none px-6">
          <Waves className="w-16 h-16 text-white animate-pulse" />
          <Waves className="w-20 h-20 text-white animate-bounce" style={{ animationDuration: '3s' }} />
          <Waves className="w-16 h-16 text-white animate-pulse" />
        </div>

        <div className="relative z-10 text-center mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 text-cyan-200 text-xs font-black border border-cyan-400/50 shadow-md">
            🌊 Pilih Batu Loncatan yang Benar untuk Menyeberangi Sungai! 🪨
          </span>
        </div>

        {/* Stepping Stones Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

            let stoneClass = 'bg-stone-700/90 border-stone-400 text-stone-100 hover:scale-105 hover:bg-stone-600';
            if (isSelected) {
              stoneClass = 'bg-amber-500 border-yellow-200 text-white ring-4 ring-yellow-300 scale-105 shadow-xl';
            }
            if (isAnswered) {
              if (isCorrect) {
                stoneClass = 'bg-emerald-600 border-emerald-300 text-white ring-4 ring-emerald-400 scale-105 shadow-[0_0_25px_rgba(52,211,153,0.9)]';
              } else if (isSelected && !isCorrect) {
                stoneClass = 'bg-rose-800 border-rose-400 text-white opacity-80';
              } else {
                stoneClass = 'opacity-40 grayscale';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled || isAnswered}
                onClick={() => {
                  sound.playClick();
                  onSelectStone(option, idx);
                }}
                className={`py-4 px-3 rounded-3xl border-3 shadow-lg font-black cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1 text-center min-h-[90px] relative ${stoneClass}`}
              >
                <div className="text-xl sm:text-2xl">🪨</div>
                <span className="text-base sm:text-lg font-black tracking-wide leading-tight">
                  {option}
                </span>

                {isAnswered && (
                  <div className="absolute -top-1 -right-1">
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300 fill-emerald-600" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-300 fill-rose-600" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
