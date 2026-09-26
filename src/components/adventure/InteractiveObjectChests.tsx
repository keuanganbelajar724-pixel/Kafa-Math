import React, { useState } from 'react';
import { sound } from '../../services/sound';
import { Sparkles, Key, Lock, Unlock, CheckCircle2, XCircle } from 'lucide-react';

interface InteractiveObjectChestsProps {
  options: string[];
  correctAnswer: string;
  selectedOption: string | null;
  isAnswered: boolean;
  onSelectChest: (optionText: string, chestIndex: number) => void;
  disabled?: boolean;
}

export const InteractiveObjectChests: React.FC<InteractiveObjectChestsProps> = ({
  options,
  correctAnswer,
  selectedOption,
  isAnswered,
  onSelectChest,
  disabled = false,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chestThemes = [
    { name: 'Peti Ruby', bg: 'from-amber-700 via-orange-800 to-amber-950', border: 'border-amber-400', icon: '📦', rune: 'I' },
    { name: 'Peti Safir', bg: 'from-blue-700 via-indigo-800 to-slate-900', border: 'border-cyan-400', icon: '📦', rune: 'II' },
    { name: 'Peti Zamrud', bg: 'from-emerald-700 via-teal-800 to-emerald-950', border: 'border-emerald-400', icon: '📦', rune: 'III' },
    { name: 'Peti Emas', bg: 'from-yellow-600 via-amber-700 to-yellow-900', border: 'border-yellow-300', icon: '📦', rune: 'IV' },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-black border border-amber-400/40 shadow-lg">
          <Key className="w-3.5 h-3.5 text-yellow-300" />
          Pilih & Buka Peti dengan Jawaban yang Tepat! 🗝️
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
          const chestMeta = chestThemes[idx % chestThemes.length];

          // Determine chest visual state
          let visualStateClass = 'hover:-translate-y-1 hover:shadow-xl';
          if (isSelected) {
            visualStateClass = 'scale-105 ring-4 ring-amber-400 shadow-2xl';
          }
          if (isAnswered) {
            if (isCorrect) {
              visualStateClass = 'scale-105 ring-4 ring-emerald-400 bg-emerald-950/90 shadow-[0_0_30px_rgba(52,211,153,0.8)]';
            } else if (isSelected && !isCorrect) {
              visualStateClass = 'ring-4 ring-rose-500 bg-rose-950/80 animate-shake';
            } else {
              visualStateClass = 'opacity-40 grayscale-[50%]';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || isAnswered}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => {
                sound.playClick();
                onSelectChest(option, idx);
              }}
              className={`relative group rounded-3xl p-3 sm:p-4 text-white text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-between min-h-[140px] sm:min-h-[160px] bg-gradient-to-b ${chestMeta.bg} border-3 ${chestMeta.border} shadow-lg ${visualStateClass}`}
            >
              {/* Top Rune Badge */}
              <div className="w-full flex items-center justify-between text-[11px] font-black text-amber-200">
                <span className="w-5 h-5 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-[10px]">
                  {chestMeta.rune}
                </span>
                <span className="text-[10px] opacity-80">{chestMeta.name}</span>
              </div>

              {/* 3D Animated Chest Sprite & Lock */}
              <div className="my-1.5 relative">
                {isAnswered && isCorrect ? (
                  // Open chest with treasure burst!
                  <div className="text-5xl sm:text-6xl animate-bounce">
                    🎁
                    <span className="absolute -top-3 -right-2 text-2xl animate-ping">✨</span>
                    <span className="absolute -top-4 -left-2 text-xl">🪙</span>
                  </div>
                ) : isAnswered && isSelected && !isCorrect ? (
                  // Wrong chest wobbled & locked
                  <div className="text-5xl sm:text-6xl opacity-80">
                    🔒
                    <span className="absolute -top-1 -right-1 text-xs">💨</span>
                  </div>
                ) : (
                  // Closed interactive chest
                  <div className={`text-5xl sm:text-6xl transition-transform ${hoveredIdx === idx ? 'scale-115' : ''}`}>
                    {chestMeta.icon}
                    <div className="absolute inset-0 flex items-center justify-center pt-2">
                      <Lock className="w-4 h-4 text-yellow-300 drop-shadow-md" />
                    </div>
                  </div>
                )}
              </div>

              {/* Answer Value Plate */}
              <div className="w-full bg-black/60 backdrop-blur-md rounded-2xl py-2 px-2 border border-white/20 text-center shadow-inner">
                <span className="block font-black text-sm sm:text-base text-yellow-200 leading-tight break-words">
                  {option}
                </span>
              </div>

              {/* Feedback Status Indicator */}
              {isAnswered && (
                <div className="absolute -top-2 -right-2">
                  {isCorrect && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-bounce border-2 border-white">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  {isSelected && !isCorrect && (
                    <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <XCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
