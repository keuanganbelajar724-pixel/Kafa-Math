import React from 'react';
import { Delete, Check } from 'lucide-react';
import { sound } from '../../services/sound';

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
  allowSlash?: boolean;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onDigit,
  onBackspace,
  onSubmit,
  submitDisabled = false,
  allowSlash = false,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-slate-50/95 backdrop-blur-md p-3 sm:p-3.5 rounded-3xl border border-slate-200 shadow-sm">
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => {
              sound.playClick();
              onDigit(digit);
            }}
            className="h-12 sm:h-14 rounded-2xl bg-white hover:bg-emerald-50 active:bg-emerald-100 text-slate-800 hover:text-emerald-700 font-black text-2xl shadow-xs border border-slate-200/80 transition-all flex items-center justify-center select-none active:scale-95 cursor-pointer"
          >
            {digit}
          </button>
        ))}

        {/* Backspace */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onBackspace();
          }}
          className="h-12 sm:h-14 rounded-2xl bg-slate-200/70 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold shadow-xs border border-slate-300/80 transition-all flex items-center justify-center active:scale-95 cursor-pointer"
          title="Hapus"
        >
          <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Digit 0 */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onDigit('0');
          }}
          className="h-12 sm:h-14 rounded-2xl bg-white hover:bg-emerald-50 active:bg-emerald-100 text-slate-800 hover:text-emerald-700 font-black text-2xl shadow-xs border border-slate-200/80 transition-all flex items-center justify-center select-none active:scale-95 cursor-pointer"
        >
          0
        </button>

        {/* Submit Checkmark (or Slash if fraction, and submit on row below) */}
        {!allowSlash ? (
          <button
            type="button"
            disabled={submitDisabled}
            onClick={() => {
              onSubmit();
            }}
            className="h-12 sm:h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black shadow-md border border-emerald-500 transition-all flex items-center justify-center active:scale-95 cursor-pointer"
            title="Kirim Jawaban"
          >
            <Check className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onDigit('/');
            }}
            className="h-12 sm:h-14 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-2xl shadow-xs border border-amber-300 transition-all flex items-center justify-center active:scale-95 cursor-pointer"
            title="Garis Pecahan /"
          >
            /
          </button>
        )}
      </div>

      {/* When allowSlash is true, show big Submit bar below */}
      {allowSlash && (
        <div className="mt-2.5">
          <button
            type="button"
            disabled={submitDisabled}
            onClick={() => {
              onSubmit();
            }}
            className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black shadow-md border border-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer text-base"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>KIRIM JAWABAN</span>
          </button>
        </div>
      )}
    </div>
  );
};
