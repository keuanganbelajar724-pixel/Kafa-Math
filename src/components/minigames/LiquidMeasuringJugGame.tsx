import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Trophy, ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, Sparkles, X, Droplets, Plus, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface CapacityChallenge {
  id: number;
  title: string;
  englishTitle: string;
  targetMl: number;
  initialMl: number;
  liquidName: string;
  englishLiquidName: string;
  liquidColor: string; // Tailwind class
  liquidBgHex: string;
  storyPrompt: string;
  englishStoryPrompt: string;
  cambridgeNote: string;
  englishCambridgeNote: string;
}

const CHALLENGES: CapacityChallenge[] = [
  {
    id: 1,
    title: 'Misi 1: Resep Jus Jeruk Segar',
    englishTitle: 'Mission 1: Fresh Orange Juice Recipe',
    targetMl: 400,
    initialMl: 0,
    liquidName: 'Jus Jeruk',
    englishLiquidName: 'Orange Juice',
    liquidColor: 'from-amber-400 to-orange-500',
    liquidBgHex: '#f59e0b',
    storyPrompt: 'Tuang jus jeruk ke dalam gelas ukur sampai tepat di garis 400 mL!',
    englishStoryPrompt: 'Pour orange juice into the measuring jug until it reaches exactly 400 mL!',
    cambridgeNote: 'Gunakan tombol +100 mL dan +50 mL untuk mengisi!',
    englishCambridgeNote: 'Use the +100 mL and +50 mL buttons to fill the jug!',
  },
  {
    id: 2,
    title: 'Misi 2: Setengah Liter Susu Murni (1/2 L)',
    englishTitle: 'Mission 2: Half a Litre of Milk (1/2 L)',
    targetMl: 500,
    initialMl: 0,
    liquidName: 'Susu Murni',
    englishLiquidName: 'Fresh Milk',
    liquidColor: 'from-sky-100 to-blue-200',
    liquidBgHex: '#93c5fd',
    storyPrompt: 'Koki membutuhkan 1/2 Liter susu (500 mL). Tuangkan susu tepat ke garis 500 mL!',
    englishStoryPrompt: 'The chef needs 1/2 Litre of milk (500 mL). Fill the jug exactly to 500 mL!',
    cambridgeNote: 'Ingat konsep Cambridge: 1/2 Liter = 500 mililiter!',
    englishCambridgeNote: 'Remember: 1/2 Litre = 500 millilitres!',
  },
  {
    id: 3,
    title: 'Misi 3: Ramuan Sirup Stroberi (750 mL)',
    englishTitle: 'Mission 3: Strawberry Syrup Mix (750 mL / 3/4 L)',
    targetMl: 750,
    initialMl: 250, // Starts with 250 mL
    liquidName: 'Sirup Stroberi',
    englishLiquidName: 'Strawberry Syrup',
    liquidColor: 'from-rose-400 to-pink-600',
    liquidBgHex: '#f43f5e',
    storyPrompt: 'Sudah ada 250 mL sirup di dalam gelas. Tambahkan air sampai volumenya mencapai 3/4 Liter (750 mL)!',
    englishStoryPrompt: 'There is already 250 mL in the jug. Add water until it reaches 3/4 Litre (750 mL)!',
    cambridgeNote: '250 mL + 500 mL = 750 mL (3/4 Liter)!',
    englishCambridgeNote: '250 mL + 500 mL = 750 mL (3/4 Litre)!',
  },
  {
    id: 4,
    title: 'Misi 4: Satu Liter Penuh (1000 mL = 1 L)',
    englishTitle: 'Mission 4: Exactly One Full Litre (1 L)',
    targetMl: 1000,
    initialMl: 600,
    liquidName: 'Madu Emas',
    englishLiquidName: 'Golden Honey',
    liquidColor: 'from-yellow-400 to-amber-500',
    liquidBgHex: '#eab308',
    storyPrompt: 'Ada 600 mL madu. Isi terus sampai genap 1 Liter penuh (1000 mL)!',
    englishStoryPrompt: 'There is 600 mL honey. Fill it up to make exactly 1 full Litre (1000 mL)!',
    cambridgeNote: '1 Liter = 1000 mililiter (butuh +400 mL lagi)!',
    englishCambridgeNote: '1 Litre = 1000 millilitres (needs +400 mL more)!',
  },
];

export const LiquidMeasuringJugGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [currentMl, setCurrentMl] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);

  const currentCh = CHALLENGES[challengeIdx];

  const initChallenge = (idx: number = challengeIdx) => {
    const ch = CHALLENGES[idx];
    setCurrentMl(ch.initialMl);
    setIsSuccess(false);
    setFeedback('');

    const voice = isEnglish ? ch.englishStoryPrompt : ch.storyPrompt;
    sound.speak(voice);
  };

  useEffect(() => {
    initChallenge(challengeIdx);
  }, [challengeIdx, isEnglish]);

  const addLiquid = (amount: number) => {
    if (isSuccess) return;
    const nextVal = Math.max(0, Math.min(1000, currentMl + amount));
    if (nextVal !== currentMl) {
      sound.playClick();
      setCurrentMl(nextVal);

      if (nextVal === currentCh.targetMl) {
        sound.playCorrect();
        sound.playFanfare();
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
        setScore((s) => s + 40);
        setIsSuccess(true);
        const win = isEnglish
          ? `Sensational! Exactly ${currentCh.targetMl} mL filled! Perfect meniscus reading! 🧪✨`
          : `Luar biasa! Tepat ${currentCh.targetMl} mL terisi sempurna di garis batas! 🧪✨`;
        setFeedback(win);
        sound.speak(win);
      } else {
        const diff = currentCh.targetMl - nextVal;
        if (diff > 0) {
          setFeedback(isEnglish ? `Current: ${nextVal} mL. Need +${diff} mL more!` : `Saat ini: ${nextVal} mL. Masih kurang ${diff} mL lagi!`);
        } else {
          setFeedback(isEnglish ? `Current: ${nextVal} mL. Over by ${Math.abs(diff)} mL! Pour some out!` : `Saat ini: ${nextVal} mL. Kelebihan ${Math.abs(diff)} mL! Kurangi sedikit ya!`);
        }
      }
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (challengeIdx < CHALLENGES.length - 1) {
      setChallengeIdx((p) => p + 1);
    } else {
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90 });
      onComplete(score + 50, 3);
    }
  };

  // Height percentage of liquid in the beaker (0 to 100%)
  const liquidHeightPercent = (currentMl / 1000) * 100;
  const targetHeightPercent = (currentCh.targetMl / 1000) * 100;

  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-cyan-400 shadow-2xl overflow-hidden flex flex-col">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            🧪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isEnglish ? currentCh.englishTitle : currentCh.title}
              </h2>
              <span className="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Tantangan {challengeIdx + 1}/{CHALLENGES.length}
              </span>
            </div>
            <p className="text-xs text-cyan-100 font-semibold">
              {isEnglish ? 'Cambridge Capacity & Volume Lab (mL & L)' : 'Laboratorium Takaran Kapasitas Cairan (mL & Liter)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setIsEnglish(!isEnglish);
            }}
            className="px-2.5 py-1 rounded-xl bg-white/25 hover:bg-white/35 text-xs font-black flex items-center gap-1 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isEnglish ? '🇬🇧 EN' : '🇮🇩 ID'}</span>
          </button>

          <button
            onClick={onExit}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Mission Banner */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="bg-cyan-50 rounded-2xl p-3.5 border-2 border-cyan-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl bg-white p-2 rounded-2xl shadow-xs border border-cyan-200">
              🫗
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-cyan-950 uppercase tracking-wide">
                  Target Kapasitas:
                </span>
                <span className="bg-cyan-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {currentCh.targetMl} mL {currentCh.targetMl === 1000 ? '(1 Liter)' : currentCh.targetMl === 500 ? '(1/2 Liter)' : ''}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 leading-snug">
                {isEnglish ? currentCh.englishStoryPrompt : currentCh.storyPrompt}
              </p>
            </div>
          </div>

          <button
            onClick={() => sound.speak(isEnglish ? currentCh.englishStoryPrompt : currentCh.storyPrompt)}
            className="p-2 rounded-xl bg-cyan-200/80 hover:bg-cyan-300 text-cyan-900 flex-shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3. The Interactive Measuring Beaker Stage */}
        <div className="bg-gradient-to-b from-slate-50 to-cyan-50/50 rounded-3xl p-4 sm:p-6 border-2 border-cyan-200 flex items-center justify-center gap-6 sm:gap-10 select-none">
          {/* Beaker Container */}
          <div className="relative w-40 sm:w-48 h-64 sm:h-72 bg-white/80 border-4 border-slate-400 rounded-b-3xl shadow-xl flex flex-col justify-end overflow-hidden">
            {/* Beaker Lip Spout on top right */}
            <div className="absolute -top-1 -right-2 w-4 h-4 bg-white border-t-4 border-r-4 border-slate-400 rotate-45 rounded-sm pointer-events-none" />

            {/* Scale Markings (0 to 1000 mL, every 100 mL) */}
            <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between py-3 px-2">
              {[1000, 900, 800, 700, 600, 500, 400, 300, 200, 100, 0].map((ml) => (
                <div key={ml} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className={`h-0.5 ${ml % 500 === 0 ? 'w-6 bg-slate-900' : ml % 200 === 0 ? 'w-4 bg-slate-700' : 'w-2.5 bg-slate-500'}`} />
                    <span className={`text-[10px] ${ml === currentCh.targetMl ? 'font-black text-rose-600 bg-rose-100 px-1 rounded' : ml % 500 === 0 ? 'font-black text-slate-800' : 'font-bold text-slate-500'}`}>
                      {ml} {ml === 1000 ? 'mL (1L)' : ml === 500 ? 'mL (½L)' : 'mL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Target Dashed Line on Beaker */}
            <div
              style={{ bottom: `${targetHeightPercent}%` }}
              className="absolute left-0 right-0 border-b-2 border-dashed border-rose-500 z-30 flex items-center justify-end pr-2 transition-all"
            >
              <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded -translate-y-2.5 shadow-xs">
                TARGET: {currentCh.targetMl} mL
              </span>
            </div>

            {/* Dynamic Liquid Wave with Color */}
            <div
              style={{ height: `${liquidHeightPercent}%` }}
              className={`w-full bg-gradient-to-t ${currentCh.liquidColor} transition-all duration-300 relative z-10 opacity-90 shadow-inner flex flex-col justify-start`}
            >
              {/* Meniscus surface curve line */}
              <div className="w-full h-2 bg-white/40 rounded-full shadow-xs" />
              {/* Bubbles */}
              {currentMl > 0 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/50 text-xs animate-pulse">
                  🫧 🫧
                </div>
              )}
            </div>
          </div>

          {/* Real-time Digital Meniscus Gauge & Info */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-cyan-300 shadow-md text-center min-w-[130px]">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">
                {isEnglish ? 'Volume Reading:' : 'Bacaan Meniskus:'}
              </span>
              <span className={`text-2xl sm:text-3xl font-black block mt-1 ${currentMl === currentCh.targetMl ? 'text-emerald-600' : 'text-cyan-700'}`}>
                {currentMl} <span className="text-xs font-bold text-slate-500">mL</span>
              </span>
              <span className="text-[11px] font-bold text-slate-600 block mt-0.5">
                {currentMl >= 1000 ? '1.0 Liter' : `${(currentMl / 1000).toFixed(2)} Liter`}
              </span>
            </div>

            {/* Status Pill */}
            <div className={`px-3 py-1 rounded-full text-xs font-black shadow-xs ${
              currentMl === currentCh.targetMl
                ? 'bg-emerald-500 text-white animate-bounce'
                : currentMl > currentCh.targetMl
                ? 'bg-rose-100 text-rose-800'
                : 'bg-cyan-100 text-cyan-800'
            }`}>
              {currentMl === currentCh.targetMl
                ? 'PAS SESUAI TARGET! ✨'
                : currentMl > currentCh.targetMl
                ? `Kelebihan ${currentMl - currentCh.targetMl} mL ⚠️`
                : `Kurang ${currentCh.targetMl - currentMl} mL 💧`}
            </div>
          </div>
        </div>

        {/* 4. Pour & Drain Tactile Controls */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-700">
            <span>{isEnglish ? 'Pour & Drain Controls (Tap to Adjust Volume):' : 'Kendali Takaran Air (Sentuh untuk Mengisi / Menguras):'}</span>
            <span className="text-[11px] text-slate-400">Takaran sentuh presisi</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Fill Controls */}
            <div className="bg-cyan-50 p-2 rounded-xl border border-cyan-200 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-black text-cyan-900 uppercase w-full">Tuang Air (+):</span>
              {[50, 100, 250, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => addLiquid(amt)}
                  className="flex-1 min-w-[55px] py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs shadow-xs cursor-pointer active:scale-95 transition-transform flex items-center justify-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>{amt}</span>
                </button>
              ))}
            </div>

            {/* Drain Controls */}
            <div className="bg-rose-50 p-2 rounded-xl border border-rose-200 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-black text-rose-900 uppercase w-full">Kurangi Air (-):</span>
              {[50, 100, 250].map((amt) => (
                <button
                  key={amt}
                  onClick={() => addLiquid(-amt)}
                  disabled={currentMl === 0}
                  className="flex-1 min-w-[55px] py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-xs cursor-pointer active:scale-95 transition-transform flex items-center justify-center gap-0.5 disabled:opacity-30"
                >
                  <Minus className="w-3 h-3" />
                  <span>{amt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-cyan-50 border-cyan-300 text-cyan-900'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Droplets className="w-5 h-5 text-cyan-600" />}
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* 5. Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={() => initChallenge()}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEnglish ? 'Empty Beaker' : 'Kosongkan Gelas'}</span>
        </button>

        {!isSuccess ? (
          <div className="text-xs font-bold text-slate-500 italic">
            💡 {isEnglish ? currentCh.englishCambridgeNote : currentCh.cambridgeNote}
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95 animate-bounce"
          >
            <span>{challengeIdx < CHALLENGES.length - 1 ? (isEnglish ? 'Next Recipe' : 'Resep Berikutnya') : (isEnglish ? 'Master of Volume!' : 'Selesai & Ambil Bintang!')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
