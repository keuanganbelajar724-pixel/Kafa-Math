import React from 'react';
import { Award, Lock, Sparkles } from 'lucide-react';

interface BadgeCardProps {
  title: string;
  desc: string;
  icon: string;
  isUnlocked: boolean;
  progressText?: string;
  unlockedAt?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  title,
  desc,
  icon,
  isUnlocked,
  progressText,
  unlockedAt,
}) => {
  return (
    <div
      className={`relative rounded-3xl p-4 sm:p-5 border transition-all flex flex-col items-center text-center ${
        isUnlocked
          ? 'bg-white border-amber-200/90 shadow-[0_4px_20px_rgba(245,158,11,0.08)] hover:scale-[1.02] hover:shadow-md'
          : 'bg-slate-50/70 border-slate-200 opacity-60'
      }`}
    >
      {/* Top Status Icon */}
      <div className="absolute top-3.5 right-3.5">
        {isUnlocked ? (
          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
            <Lock className="w-3 h-3" />
          </span>
        )}
      </div>

      {/* Main Badge Graphic */}
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl my-2 transition-transform ${
          isUnlocked
            ? 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 border-2 border-amber-300 shadow-xs scale-105'
            : 'bg-slate-200/80 grayscale border border-slate-300'
        }`}
      >
        {icon}
      </div>

      <h4 className={`font-black text-sm sm:text-base mt-2 ${isUnlocked ? 'text-slate-900' : 'text-slate-600'}`}>
        {title}
      </h4>

      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed max-w-xs">
        {desc}
      </p>

      {/* Progress or Unlock Label */}
      <div className="mt-3 pt-2 border-t border-slate-100 w-full flex items-center justify-center">
        {isUnlocked ? (
          <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <span>✓ Terbuka</span>
            {unlockedAt && <span>• {unlockedAt}</span>}
          </span>
        ) : (
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {progressText || 'Terkunci'}
          </span>
        )}
      </div>
    </div>
  );
};
