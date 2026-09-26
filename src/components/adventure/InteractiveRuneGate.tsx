import React, { useState } from 'react';
import { sound } from '../../services/sound';
import { Key, Lock, Unlock, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface InteractiveRuneGateProps {
  options: string[];
  correctAnswer: string;
  selectedOption: string | null;
  isAnswered: boolean;
  onSelectKey: (optionText: string, keyIndex: number) => void;
  disabled?: boolean;
}

export const InteractiveRuneGate: React.FC<InteractiveRuneGateProps> = ({
  options,
  correctAnswer,
  selectedOption,
  isAnswered,
  onSelectKey,
  disabled = false,
}) => {
  const isCorrect = selectedOption?.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Stone Gate Illustration Structure */}
      <div className="relative w-full max-w-md h-32 sm:h-40 bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 rounded-t-3xl border-4 border-amber-500/70 shadow-2xl p-4 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Archway masonry pattern */}
        <div className="absolute inset-x-0 top-0 h-4 bg-stone-950/60 border-b border-amber-500/40 flex justify-around items-center text-[10px] text-amber-300 font-serif">
          <span>◆</span>
          <span>GERBANG KUNO MATEMATIKA</span>
          <span>◆</span>
        </div>

        {/* Center Giant Door Locks */}
        <div className="relative z-10 flex flex-col items-center">
          {isAnswered && isCorrect ? (
            <div className="flex flex-col items-center animate-bounce">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_35px_rgba(52,211,153,0.8)]">
                <Unlock className="w-9 h-9" />
              </div>
              <span className="mt-1 text-xs font-black text-emerald-300 tracking-wider">
                ✨ GERBANG TERBUKA!
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500/10 border-2 border-amber-400/80 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.4)] animate-pulse">
                <Lock className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              <span className="mt-1 text-[11px] font-black text-amber-200">
                Pilih Kunci Rune yang Cocok
              </span>
            </div>
          )}
        </div>

        {/* Glowing door seam */}
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
      </div>

      {/* Floating Rune Keys Dock */}
      <div className="w-full bg-slate-950/90 backdrop-blur-md rounded-b-3xl p-3 border-x-4 border-b-4 border-amber-500/70 shadow-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isKeyCorrect = option.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

            let keyStyle = 'bg-gradient-to-b from-amber-600 to-amber-800 border-amber-300 text-white hover:scale-102 hover:shadow-lg';
            if (isSelected) {
              keyStyle = 'bg-gradient-to-b from-amber-400 to-orange-600 border-white ring-4 ring-amber-300 scale-105';
            }
            if (isAnswered) {
              if (isKeyCorrect) {
                keyStyle = 'bg-gradient-to-b from-emerald-500 to-teal-700 border-emerald-300 ring-4 ring-emerald-400 scale-105';
              } else if (isSelected && !isCorrect) {
                keyStyle = 'bg-gradient-to-b from-rose-700 to-rose-900 border-rose-400 opacity-80';
              } else {
                keyStyle = 'opacity-30 grayscale';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled || isAnswered}
                onClick={() => {
                  sound.playClick();
                  onSelectKey(option, idx);
                }}
                className={`py-3 px-3 rounded-2xl border-2 font-black cursor-pointer transition-all duration-200 flex items-center justify-between gap-2 shadow-md ${keyStyle}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🗝️</span>
                  <span className="text-sm sm:text-base leading-tight">{option}</span>
                </div>
                {isAnswered && isKeyCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
