import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../../services/sound';

interface SkillCardProps {
  icon: string;
  title: string;
  desc?: string;
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'challenge';
  progress?: number; // 0 to 100
  onClick: () => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  icon,
  title,
  desc,
  questionCount,
  difficulty,
  progress = 0,
  onClick,
}) => {
  const difficultyMap = {
    easy: { label: 'Mudah', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    medium: { label: 'Sedang', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    challenge: { label: 'Tantangan', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  };

  return (
    <div
      onClick={() => {
        sound.playClick();
        onClick();
      }}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 hover:border-emerald-400 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            {icon}
          </div>
          {difficulty && (
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${difficultyMap[difficulty].color}`}>
              {difficultyMap[difficulty].label}
            </span>
          )}
        </div>

        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
          {title}
        </h3>

        {desc && (
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">
            {desc}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        {progress !== undefined && (
          <div className="space-y-1 mb-2">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500">
              <span>Penguasaan</span>
              <span className="font-bold text-slate-800">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(6, progress)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs font-bold text-emerald-600 pt-1">
          <span>{questionCount ? `${questionCount} Soal` : 'Mulai Latihan'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
