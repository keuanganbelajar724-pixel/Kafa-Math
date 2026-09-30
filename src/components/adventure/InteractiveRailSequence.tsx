import React, { useState } from 'react';
import { sound } from '../../services/sound';
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface InteractiveRailSequenceProps {
  options: string[];
  correctAnswer: string;
  isAnswered: boolean;
  onCompleteSequence: (submittedAnswer: string) => void;
  disabled?: boolean;
}

export const InteractiveRailSequence: React.FC<InteractiveRailSequenceProps> = ({
  options,
  correctAnswer,
  isAnswered,
  onCompleteSequence,
  disabled = false,
}) => {
  // Ordered slots placed by the child
  const [placedItems, setPlacedItems] = useState<string[]>([]);
  const [availableItems, setAvailableItems] = useState<string[]>(options);

  const handlePickItem = (item: string, index: number) => {
    if (disabled || isAnswered) return;
    sound.playClick();

    const nextPlaced = [...placedItems, item];
    const nextAvailable = availableItems.filter((_, i) => i !== index);

    setPlacedItems(nextPlaced);
    setAvailableItems(nextAvailable);

    // Auto-check if all slots are filled
    if (nextPlaced.length === options.length) {
      const resultString = nextPlaced.join(', ');
      onCompleteSequence(resultString);
    }
  };

  const handleRemovePlaced = (item: string, index: number) => {
    if (disabled || isAnswered) return;
    sound.playClick();

    const nextPlaced = placedItems.filter((_, i) => i !== index);
    const nextAvailable = [...availableItems, item];

    setPlacedItems(nextPlaced);
    setAvailableItems(nextAvailable);
  };

  const handleReset = () => {
    sound.playClick();
    setPlacedItems([]);
    setAvailableItems(options);
  };

  const currentResult = placedItems.join(', ');
  const isCorrect = currentResult.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  return (
    <div className="w-full bg-slate-950/90 rounded-3xl p-3.5 sm:p-4 border-4 border-amber-400/80 shadow-2xl backdrop-blur-md">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-black text-amber-300 mb-2">
        <span className="flex items-center gap-1.5">
          <span>🚂</span>
          <span>Susun Gerbong Bilangan Sesuai Urutan!</span>
        </span>
        {placedItems.length > 0 && !isAnswered && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Railway Track with Wagons */}
      <div className="relative my-2 p-3 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-2xl border-2 border-amber-600/40 min-h-[70px] flex items-center justify-center overflow-x-auto gap-2">
        {/* Rail lines */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-1 bg-amber-500/30 -z-0 pointer-events-none" />

        {/* Wagon slots */}
        {options.map((_, slotIdx) => {
          const itemInSlot = placedItems[slotIdx];
          return (
            <div
              key={slotIdx}
              onClick={() => {
                if (itemInSlot) handleRemovePlaced(itemInSlot, slotIdx);
              }}
              className={`relative z-10 w-16 sm:w-20 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-black transition-all cursor-pointer ${
                itemInSlot
                  ? isAnswered
                    ? isCorrect
                      ? 'bg-emerald-600 border-emerald-300 text-white shadow-[0_0_15px_rgba(52,211,153,0.8)]'
                      : 'bg-rose-700 border-rose-400 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 border-yellow-200 text-amber-950 shadow-md scale-105'
                  : 'bg-stone-950/80 border-dashed border-stone-600 text-stone-500'
              }`}
            >
              {itemInSlot ? (
                <>
                  <span className="text-sm sm:text-base leading-tight break-words px-1">
                    {itemInSlot}
                  </span>
                  <span className="text-[9px] opacity-75 font-normal">
                    Gerbong {slotIdx + 1}
                  </span>
                </>
              ) : (
                <span className="text-xs font-mono">Slot {slotIdx + 1}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Available choices to pick */}
      <div className="mt-3">
        <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
          Ketuk bilangan di bawah ini untuk memasukkannya ke gerbong:
        </span>
        <div className="flex flex-wrap gap-2 justify-center">
          {availableItems.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={disabled || isAnswered}
              onClick={() => handlePickItem(item, idx)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 hover:from-amber-600 hover:to-orange-700 text-white font-black text-sm border-2 border-amber-500/60 shadow-md cursor-pointer transition-all duration-200 active:scale-95"
            >
              {item}
            </button>
          ))}
          {availableItems.length === 0 && !isAnswered && (
            <div className="text-xs text-amber-300 font-bold py-1">
              ✨ Semua gerbong telah terpasang! Memeriksa urutan...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
