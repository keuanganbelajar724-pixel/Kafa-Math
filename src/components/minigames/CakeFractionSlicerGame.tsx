import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Sparkles, Trophy, RotateCcw, ArrowRight, Volume2, Globe, CheckCircle2, Scissors, ChefHat, Heart, Star, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface CakeChallenge {
  id: number;
  title: string;
  englishTitle: string;
  cakeName: string;
  shape: 'circle' | 'rectangle';
  denominator: number; // e.g. 2, 3, 4, 6, 8
  targetNumerator: number; // slices needed
  storyPrompt: string;
  englishStoryPrompt: string;
  customerName: string;
  customerEmoji: string;
  themeColor: string;
}

const CAKE_CHALLENGES: CakeChallenge[] = [
  {
    id: 1,
    title: 'Tantangan 1: Membagi Dua (Halves)',
    englishTitle: 'Challenge 1: Halves (1/2)',
    cakeName: 'Kue Bolu Stroberi 🍓',
    shape: 'circle',
    denominator: 2,
    targetNumerator: 1,
    storyPrompt: 'Potong kue bolu menjadi 2 bagian sama besar (1/2), lalu sentuh 1 potong untuk Kafa!',
    englishStoryPrompt: 'Cut the cake into 2 equal halves, then tap 1 slice for Kafa (1/2)!',
    customerName: 'Kafa',
    customerEmoji: '🦊',
    themeColor: '#f43f5e',
  },
  {
    id: 2,
    title: 'Tantangan 2: Potong Empat (Quarters)',
    englishTitle: 'Challenge 2: Quarters (1/4 & 3/4)',
    cakeName: 'Martabak Manis Keju 🧀',
    shape: 'circle',
    denominator: 4,
    targetNumerator: 3,
    storyPrompt: 'Potong martabak menjadi 4 bagian sama besar (seperempat). Sentuh dan sajikan 3 potong (3/4)!',
    englishStoryPrompt: 'Cut the cake into 4 equal quarters. Tap and serve 3 slices (3/4)!',
    customerName: 'Siti & Teman',
    customerEmoji: '👧',
    themeColor: '#eab308',
  },
  {
    id: 3,
    title: 'Tantangan 3: Brownies Balok (Thirds)',
    englishTitle: 'Challenge 3: Thirds (2/3)',
    cakeName: 'Brownies Coklat Balok 🍫',
    shape: 'rectangle',
    denominator: 3,
    targetNumerator: 2,
    storyPrompt: 'Iris brownies panjang menjadi 3 bagian sama besar (sepertiga). Sentuh 2 potong (2/3)!',
    englishStoryPrompt: 'Slice the brownie bar into 3 equal parts. Tap 2 slices (2/3)!',
    customerName: 'Budi',
    customerEmoji: '👦',
    themeColor: '#854d0e',
  },
  {
    id: 4,
    title: 'Tantangan 4: Kue Pai Apel (Sixths)',
    englishTitle: 'Challenge 4: Sixths (4/6)',
    cakeName: 'Pai Apel Karamel 🥧',
    shape: 'circle',
    denominator: 6,
    targetNumerator: 4,
    storyPrompt: 'Potong pai menjadi 6 bagian sama besar. Sentuh 4 potong (4/6) untuk piring pesta!',
    englishStoryPrompt: 'Cut the pie into 6 equal slices. Tap 4 slices (4/6) for the party plate!',
    customerName: 'Pak Guru',
    customerEmoji: '🦁',
    themeColor: '#ea580c',
  },
  {
    id: 5,
    title: 'Tantangan 5: Pesta Ulang Tahun (Eighths)',
    englishTitle: 'Challenge 5: Eighths (5/8)',
    cakeName: 'Kue Tart Coklat Berry 🎂',
    shape: 'circle',
    denominator: 8,
    targetNumerator: 5,
    storyPrompt: 'Potong kue tart pesta menjadi 8 potong sama besar. Sentuh 5 potong (5/8) untuk tamu!',
    englishStoryPrompt: 'Slice the birthday cake into 8 equal slices. Tap 5 slices (5/8) for guests!',
    customerName: 'Tamu Pesta',
    customerEmoji: '🎉',
    themeColor: '#9333ea',
  },
  {
    id: 6,
    title: 'Tantangan 6: Pecahan Senilai (Equivalent Fractions)',
    englishTitle: 'Challenge 6: Equivalent Fractions (2/4 = 1/2)',
    cakeName: 'Waffle Madu Emas 🧇',
    shape: 'circle',
    denominator: 4,
    targetNumerator: 2,
    storyPrompt: 'Buktikan pecahan senilai! Potong waffle jadi 4 bagian, ambil 2 potong (2/4) yang setara dengan setengah (1/2)!',
    englishStoryPrompt: 'Prove equivalence! Cut into 4 parts, pick 2 slices (2/4) which equals one half (1/2)!',
    customerName: 'Kaka AI Chef',
    customerEmoji: '🤖',
    themeColor: '#059669',
  },
];

export const CakeFractionSlicerGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [cutCount, setCutCount] = useState<number>(0); // how many cuts made (determines denominator)
  const [selectedSlices, setSelectedSlices] = useState<boolean[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);
  const [isKnifeActive, setIsKnifeActive] = useState<boolean>(false);

  const currentChallenge = CAKE_CHALLENGES[currentLevelIdx];

  const resetCurrentLevel = (idx: number = currentLevelIdx) => {
    const ch = CAKE_CHALLENGES[idx];
    setCutCount(0);
    setSelectedSlices([]);
    setIsSuccess(false);
    setFeedback('');

    const promptText = isEnglish ? ch.englishStoryPrompt : ch.storyPrompt;
    sound.speak(promptText);
  };

  useEffect(() => {
    resetCurrentLevel(currentLevelIdx);
  }, [currentLevelIdx, isEnglish]);

  // Children can choose how to cut: 2, 3, 4, 6, or 8 slices with touch blade
  const handleCutCake = (parts: number) => {
    sound.playClick();
    setIsKnifeActive(true);
    setTimeout(() => setIsKnifeActive(false), 500);

    setCutCount(parts);
    setSelectedSlices(new Array(parts).fill(false));

    if (parts === currentChallenge.denominator) {
      sound.speak(isEnglish ? `Great cut! Cake is now divided into ${parts} equal parts.` : `Potongan sempurna! Kue terbagi rata menjadi ${parts} bagian sama besar.`);
      setFeedback(isEnglish ? `Great! Now tap ${currentChallenge.targetNumerator} slices to serve!` : `Hebat! Sekarang sentuh ${currentChallenge.targetNumerator} potong untuk disajikan!`);
    } else {
      sound.playRetry();
      sound.speak(isEnglish ? `Notice: target needs ${currentChallenge.denominator} equal parts!` : `Perhatikan: target membutuhkan ${currentChallenge.denominator} bagian sama rata!`);
      setFeedback(isEnglish ? `Try cutting into ${currentChallenge.denominator} parts.` : `Coba potong menjadi ${currentChallenge.denominator} bagian ya.`);
    }
  };

  // Touch individual slice to pick/serve
  const handleToggleSlice = (index: number) => {
    if (isSuccess || cutCount === 0) return;
    sound.playClick();

    setSelectedSlices((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const selectedCount = selectedSlices.filter(Boolean).length;

  const handleVerify = () => {
    if (cutCount === 0) {
      sound.speak(isEnglish ? 'Please cut the cake first!' : 'Silakan potong kuenya terlebih dahulu!');
      setFeedback(isEnglish ? 'Cut the cake first using the slicer buttons below!' : 'Gunakan tombol pisau di bawah untuk memotong kue!');
      return;
    }

    const isCutCorrect = cutCount === currentChallenge.denominator;
    const isCountCorrect = selectedCount === currentChallenge.targetNumerator;

    if (isCutCorrect && isCountCorrect) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

      const newScore = score + 40;
      setScore(newScore);
      setIsSuccess(true);

      const winMsg = isEnglish
        ? `Perfect! You served ${selectedCount}/${cutCount} of the cake! 🍰`
        : `Luar biasa! Kamu berhasil menyajikan ${selectedCount}/${cutCount} kue dengan tepat! 🍰`;
      setFeedback(winMsg);
      sound.speak(winMsg);
    } else {
      sound.playRetry();
      let hintMsg = '';
      if (!isCutCorrect) {
        hintMsg = isEnglish
          ? `Cut into ${currentChallenge.denominator} parts first!`
          : `Potong menjadi ${currentChallenge.denominator} bagian sama besar dulu ya!`;
      } else {
        hintMsg = isEnglish
          ? `You selected ${selectedCount} slices. We need ${currentChallenge.targetNumerator} slices (${currentChallenge.targetNumerator}/${cutCount})!`
          : `Kamu memilih ${selectedCount} potong. Yang diminta adalah ${currentChallenge.targetNumerator} potong (${currentChallenge.targetNumerator}/${cutCount})!`;
      }
      setFeedback(hintMsg);
      sound.speak(hintMsg);
    }
  };

  const handleNextChallenge = () => {
    sound.playClick();
    if (currentLevelIdx < CAKE_CHALLENGES.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    } else {
      // Complete game
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90 });
      onComplete(score + 50, 3);
    }
  };

  // Helper to render circle cake slices
  const renderCircleCake = () => {
    const size = 260;
    const center = size / 2;
    const radius = 110;

    if (cutCount === 0) {
      // Whole uncut cake
      return (
        <div
          onClick={() => handleCutCake(currentChallenge.denominator)}
          className="relative w-64 h-64 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-rose-300 to-amber-200 border-8 border-amber-600/50 shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 group"
        >
          {/* Cake Toppings */}
          <div className="absolute inset-4 rounded-full border-4 border-dashed border-white/60 flex items-center justify-center flex-wrap gap-2 p-4">
            <span className="text-3xl animate-bounce">🍓</span>
            <span className="text-2xl">🍒</span>
            <span className="text-3xl animate-bounce delay-100">🍓</span>
            <span className="text-2xl">🍫</span>
          </div>

          <div className="bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl shadow-lg border-2 border-rose-300 text-center pointer-events-none">
            <span className="text-xs font-black text-rose-700 block uppercase">1 Kue Utuh (Whole)</span>
            <span className="text-[11px] font-bold text-slate-500">Sentuh Pisau Pemotong di Bawah 👇</span>
          </div>
        </div>
      );
    }

    // Cut cake into equal radial wedges
    const angleStep = 360 / cutCount;
    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-2xl">
          {/* Cake Plate */}
          <circle cx={center} cy={center} r={radius + 14} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="4" />
          <circle cx={center} cy={center} r={radius + 8} fill="#ffffff" />

          {/* Slices */}
          {Array.from({ length: cutCount }).map((_, i) => {
            const startAngle = (i * angleStep - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * angleStep - 90) * (Math.PI / 180);

            const isSelected = selectedSlices[i];

            // Offset slice outward slightly if selected
            const midAngle = ((i + 0.5) * angleStep - 90) * (Math.PI / 180);
            const shift = isSelected ? 12 : 0;
            const shiftX = Math.cos(midAngle) * shift;
            const shiftY = Math.sin(midAngle) * shift;

            const x1 = center + Math.cos(startAngle) * radius + shiftX;
            const y1 = center + Math.sin(startAngle) * radius + shiftY;
            const x2 = center + Math.cos(endAngle) * radius + shiftX;
            const y2 = center + Math.sin(endAngle) * radius + shiftY;
            const cx = center + shiftX;
            const cy = center + shiftY;

            const largeArcFlag = angleStep > 180 ? 1 : 0;
            const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            return (
              <g
                key={i}
                onClick={() => handleToggleSlice(i)}
                className="cursor-pointer transition-all duration-200"
              >
                <path
                  d={d}
                  fill={isSelected ? '#f43f5e' : (i % 2 === 0 ? '#fde047' : '#fbcfe8')}
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  className="hover:brightness-105 active:brightness-95"
                />
                {/* Visual fraction number in wedge */}
                <text
                  x={center + Math.cos(midAngle) * (radius * 0.65) + shiftX}
                  y={center + Math.sin(midAngle) * (radius * 0.65) + shiftY + 4}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#78350f'}
                  fontSize="12"
                  fontWeight="900"
                  pointerEvents="none"
                >
                  1/{cutCount}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating knife slicing animation */}
        {isKnifeActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
            <span className="text-5xl">🔪</span>
          </div>
        )}
      </div>
    );
  };

  // Helper to render rectangular bar cake (Brownie Bar)
  const renderRectangleCake = () => {
    if (cutCount === 0) {
      return (
        <div
          onClick={() => handleCutCake(currentChallenge.denominator)}
          className="w-full max-w-sm h-36 mx-auto rounded-3xl bg-gradient-to-r from-amber-800 to-amber-900 border-4 border-amber-950 shadow-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-102"
        >
          <span className="text-2xl mb-1">🍫 🍫 🍫</span>
          <span className="text-xs font-black text-amber-200 uppercase">1 Balok Brownies Utuh</span>
          <span className="text-[11px] text-amber-300 font-bold">Sentuh Pisau di Bawah Untuk Memotong!</span>
        </div>
      );
    }

    return (
      <div className="w-full max-w-sm mx-auto bg-slate-100 p-3 rounded-3xl border-3 border-slate-300 shadow-inner">
        <div className="flex gap-2 h-32">
          {Array.from({ length: cutCount }).map((_, i) => {
            const isSelected = selectedSlices[i];
            return (
              <div
                key={i}
                onClick={() => handleToggleSlice(i)}
                className={`flex-1 rounded-2xl p-2 flex flex-col items-center justify-between cursor-pointer border-3 transition-all duration-200 ${
                  isSelected
                    ? 'bg-rose-500 border-rose-700 text-white -translate-y-2 shadow-lg'
                    : 'bg-amber-800 border-amber-950 text-amber-200 hover:-translate-y-1 shadow-md'
                }`}
              >
                <span className="text-xl">{isSelected ? '🍰' : '🍫'}</span>
                <span className="text-xs font-black">1/{cutCount}</span>
                <span className="text-[10px] font-bold opacity-80">
                  {isSelected ? '✓ Terpilih' : 'Sentuh'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-rose-400 shadow-2xl overflow-hidden flex flex-col">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isEnglish ? currentChallenge.englishTitle : currentChallenge.title}
              </h2>
              <span className="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Level {currentLevelIdx + 1}/{CAKE_CHALLENGES.length}
              </span>
            </div>
            <p className="text-xs text-rose-100 font-semibold">{currentChallenge.cakeName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsEnglish(!isEnglish);
            }}
            className="px-2.5 py-1 rounded-xl bg-white/25 hover:bg-white/35 text-xs font-black flex items-center gap-1 transition-all"
            title="Ganti Bahasa"
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

      {/* 2. Body Game Area */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Story Customer Bubble */}
        <div className="bg-amber-50 rounded-2xl p-3.5 border-2 border-amber-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl bg-white p-2 rounded-2xl shadow-xs border border-amber-200">
              {currentChallenge.customerEmoji}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                  Pesanan {currentChallenge.customerName}:
                </span>
                <span className="bg-rose-100 text-rose-800 text-[11px] font-black px-2 py-0.5 rounded-full">
                  Target: {currentChallenge.targetNumerator}/{currentChallenge.denominator} Bagian
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mt-0.5 leading-snug">
                {isEnglish ? currentChallenge.englishStoryPrompt : currentChallenge.storyPrompt}
              </p>
            </div>
          </div>

          <button
            onClick={() => sound.speak(isEnglish ? currentChallenge.englishStoryPrompt : currentChallenge.storyPrompt)}
            className="p-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 flex-shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Interactive Cake Canvas (Touch to cut & pick slices) */}
        <div className="bg-gradient-to-b from-slate-50 to-amber-50/50 rounded-3xl p-4 border-2 border-slate-200 flex flex-col items-center justify-center min-h-[280px] relative">
          {currentChallenge.shape === 'circle' ? renderCircleCake() : renderRectangleCake()}

          {/* Realtime Interactive Fraction Display */}
          <div className="mt-4 flex items-center gap-4 bg-white/95 px-5 py-2.5 rounded-2xl shadow-md border-2 border-amber-300">
            <div className="text-center">
              <span className="text-[10px] font-black text-slate-400 block uppercase">Pecahan Terpilih</span>
              <div className="inline-flex flex-col items-center leading-none font-black text-rose-600 text-xl sm:text-2xl">
                <span>{selectedCount}</span>
                <span className="w-full h-0.5 bg-rose-600 my-0.5"></span>
                <span>{cutCount || '?'}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div className="text-xs font-bold text-slate-600">
              {cutCount === 0 ? (
                <span className="text-amber-600 font-black">🔪 Potong kue dengan pisau di bawah!</span>
              ) : selectedCount === currentChallenge.targetNumerator ? (
                <span className="text-emerald-600 font-black">✓ Porsi tepat! Klik Sajikan Kue!</span>
              ) : (
                <span>Sentuh {currentChallenge.targetNumerator - selectedCount} potong lagi</span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Knife Slicing Tools (Metode Cambridge: Hands-on Manipulative) */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-700">
            <span className="flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-rose-500" />
              <span>{isEnglish ? 'Touch Slicer Knife (Choose Equal Parts):' : 'Pisau Pemotong Interaktif (Bagi Rata):'}</span>
            </span>
            <span className="text-[11px] text-slate-400">Sentuh untuk memotong kue</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[2, 3, 4, 6, 8].map((parts) => {
              const isTargetDenominator = parts === currentChallenge.denominator;
              const isCurrent = cutCount === parts;
              return (
                <button
                  key={parts}
                  onClick={() => handleCutCake(parts)}
                  className={`py-2 px-1 rounded-xl font-black text-xs sm:text-sm border-2 transition-all flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 ${
                    isCurrent
                      ? 'bg-rose-500 border-rose-600 text-white shadow-md'
                      : isTargetDenominator
                      ? 'bg-amber-100 border-amber-400 text-amber-950 hover:bg-amber-200 animate-pulse'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-base">🔪</span>
                  <span>Bagi {parts}</span>
                  <span className="text-[10px] opacity-75">(1/{parts})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <ChefHat className="w-5 h-5 text-amber-600" />}
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* 5. Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={() => resetCurrentLevel()}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEnglish ? 'Reset Cake' : 'Ulangi Kue'}</span>
        </button>

        {!isSuccess ? (
          <button
            onClick={handleVerify}
            className="px-6 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <span>{isEnglish ? 'Serve to Plate' : 'Sajikan Kue ke Piring'} 🍽️</span>
          </button>
        ) : (
          <button
            onClick={handleNextChallenge}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <span>{currentLevelIdx < CAKE_CHALLENGES.length - 1 ? (isEnglish ? 'Next Challenge' : 'Tantangan Berikutnya') : (isEnglish ? 'Complete Master Chef!' : 'Selesai & Ambil Hadiah!')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
