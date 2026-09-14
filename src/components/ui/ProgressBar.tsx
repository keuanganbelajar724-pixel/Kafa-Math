import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: 'sm' | 'md' | 'lg';
  variant?: 'green' | 'amber' | 'blue' | 'gradient';
  showLabel?: boolean;
  labelLeft?: string;
  labelRight?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 'md',
  variant = 'green',
  showLabel = false,
  labelLeft,
  labelRight,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantClasses = {
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-sky-500',
    gradient: 'bg-gradient-to-r from-emerald-500 to-teal-400',
  };

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (labelLeft || labelRight) && (
        <div className="flex justify-between text-xs font-semibold text-slate-500">
          <span>{labelLeft}</span>
          <span className="font-bold text-slate-800">{labelRight || `${Math.round(clampedProgress)}%`}</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[height]} p-0.5 border border-slate-200/60`}>
        <div
          className={`${variantClasses[variant]} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
