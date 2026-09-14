import React from 'react';
import { Delete, Check } from 'lucide-react';
import { sound } from '../../services/sound';

interface BigKeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  onClose?: () => void;
}

export const BigKeypad: React.FC<BigKeypadProps> = ({
  onKeyPress,
  onBackspace,
  onSubmit,
  onClose,
}) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['/', '0', '⌫'],
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-4 border-3 border-amber-300 shadow-2xl max-w-sm mx-auto select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-100">
        <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
          <span>⌨️</span> Papan Angka KAFA
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            Tutup ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {keys.flat().map((k, idx) => {
          const isBackspace = k === '⌫';
          const isFraction = k === '/';

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                sound.playClick();
                if (isBackspace) {
                  onBackspace();
                } else {
                  onKeyPress(k);
                }
              }}
              className={`h-12 sm:h-14 rounded-2xl font-black text-lg sm:text-xl transition-all cursor-pointer flex items-center justify-center shadow-xs active:scale-90 ${
                isBackspace
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-2 border-rose-200 active:bg-rose-200'
                  : isFraction
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300'
                  : 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-2 border-slate-200 hover:border-amber-300'
              }`}
            >
              {isBackspace ? <Delete className="w-5 h-5" /> : k}
            </button>
          );
        })}
      </div>

      {/* Enter / Check Button */}
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          onSubmit();
        }}
        className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 border-2 border-emerald-600"
      >
        <Check className="w-5 h-5 stroke-[3]" />
        <span>Periksa Jawaban (Enter)</span>
      </button>
    </div>
  );
};
