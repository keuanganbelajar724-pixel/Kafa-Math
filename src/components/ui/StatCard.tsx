import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlightColor?: 'green' | 'amber' | 'blue' | 'rose' | 'purple';
  subtext?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  highlightColor = 'green',
  subtext,
  onClick,
}) => {
  const colorMap = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    blue: 'bg-sky-50 text-sky-700 border-sky-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };

  const iconBgMap = {
    green: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-sky-100 text-sky-600',
    rose: 'bg-rose-100 text-rose-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center gap-3 transition-all ${
        onClick ? 'cursor-pointer hover:border-emerald-300 hover:shadow-md active:scale-95' : ''
      }`}
    >
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${iconBgMap[highlightColor]}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block truncate leading-tight">
          {label}
        </span>
        <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight block leading-tight mt-0.5">
          {value}
        </span>
        {subtext && (
          <span className="text-[10px] text-slate-400 font-medium block truncate mt-0.5">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
