import React from 'react';
import { sound } from '../../services/sound';
import { Swords, Shield, Heart, Zap, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface BossBattleArenaProps {
  bossName: string;
  bossAvatar: string;
  bossHp: number;
  bossMaxHp: number;
  options: string[];
  correctAnswer: string;
  selectedOption: string | null;
  isAnswered: boolean;
  onCastSpell: (optionText: string, index: number) => void;
  disabled?: boolean;
}

export const BossBattleArena: React.FC<BossBattleArenaProps> = ({
  bossName,
  bossAvatar,
  bossHp,
  bossMaxHp,
  options,
  correctAnswer,
  selectedOption,
  isAnswered,
  onCastSpell,
  disabled = false,
}) => {
  const isCorrect = selectedOption?.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  return (
    <div className="w-full bg-slate-950/90 rounded-3xl p-4 border-4 border-rose-500 shadow-2xl backdrop-blur-md">
      {/* Header Combat Info */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-rose-500/30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{bossAvatar}</span>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-rose-300 uppercase tracking-wide">
              {bossName}
            </h4>
            <div className="flex items-center gap-1">
              {Array.from({ length: bossMaxHp }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < bossHp ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/60 border border-rose-400/50 text-rose-200 text-xs font-black">
          <Swords className="w-3.5 h-3.5 text-yellow-300" />
          <span>Luncurkan Mantra Matematika!</span>
        </div>
      </div>

      {/* Spell Attack Orbs (Answer Options) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isSpellCorrect = option.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

          let orbStyle = 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-600 text-white hover:border-amber-400 hover:scale-102';
          if (isSelected) {
            orbStyle = 'bg-gradient-to-b from-amber-500 to-orange-600 border-white ring-4 ring-yellow-400 scale-105';
          }
          if (isAnswered) {
            if (isSpellCorrect) {
              orbStyle = 'bg-gradient-to-b from-emerald-500 to-teal-700 border-emerald-300 ring-4 ring-emerald-400 scale-105 shadow-[0_0_25px_rgba(52,211,153,0.9)]';
            } else if (isSelected && !isCorrect) {
              orbStyle = 'bg-gradient-to-b from-rose-800 to-rose-950 border-rose-500 opacity-70';
            } else {
              orbStyle = 'opacity-30 grayscale';
            }
          }

          const spellIcons = ['⚡', '🔥', '❄️', '✨'];

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || isAnswered}
              onClick={() => {
                sound.playClick();
                onCastSpell(option, idx);
              }}
              className={`p-3.5 rounded-2xl border-2 font-black cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center shadow-lg relative ${orbStyle}`}
            >
              <div className="text-xl sm:text-2xl mb-1">
                {spellIcons[idx % spellIcons.length]}
              </div>
              <span className="text-sm sm:text-base font-black leading-tight">
                {option}
              </span>

              {isAnswered && (
                <div className="absolute -top-1.5 -right-1.5">
                  {isSpellCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300 fill-emerald-600" />}
                  {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-300 fill-rose-600" />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
