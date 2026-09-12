import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../services/sound';
import { Trophy, ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, Ruler, X, MoveHorizontal, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface MeasurementItem {
  id: number;
  name: string;
  englishName: string;
  emoji: string;
  lengthCm: number; // in cm
  description: string;
  englishDescription: string;
  color: string;
}

const ITEMS: MeasurementItem[] = [
  {
    id: 1,
    name: 'Pensil Warna Ajaib',
    englishName: 'Magic Color Pencil',
    emoji: '✏️',
    lengthCm: 8,
    description: 'Geser penggaris agar angka 0 tepat di ujung kiri pensil, lalu ukur panjangnya!',
    englishDescription: 'Slide the ruler so 0 aligns with the left tip of the pencil, then measure its length!',
    color: 'bg-amber-400',
  },
  {
    id: 2,
    name: 'Kunci Harta Karun',
    englishName: 'Treasure Chest Key',
    emoji: '🗝️',
    lengthCm: 5,
    description: 'Berapa panjang kunci emas kuno ini? Tempelkan penggaris dan baca angkanya!',
    englishDescription: 'How long is this antique golden key? Align the ruler to read its length!',
    color: 'bg-yellow-500',
  },
  {
    id: 3,
    name: 'Ulat Bulu Ceria',
    englishName: 'Cute Caterpillar',
    emoji: '🐛',
    lengthCm: 6,
    description: 'Ulat sedang berbaring lurus. Ukur dari kepala sampai ekornya ya!',
    englishDescription: 'The caterpillar is lying straight. Measure from head to tail!',
    color: 'bg-emerald-400',
  },
  {
    id: 4,
    name: 'Sendok Makan Perak',
    englishName: 'Silver Spoon',
    emoji: '🥄',
    lengthCm: 11,
    description: 'Ukur sendok makan perak ini dari ujung cekungan sampai ujung gagang!',
    englishDescription: 'Measure this silver spoon from tip to handle end!',
    color: 'bg-slate-300',
  },
  {
    id: 5,
    name: 'Kuas Lukis Seniman',
    englishName: 'Artist Paintbrush',
    emoji: '🖌️',
    lengthCm: 9,
    description: 'Kuas lukis ini butuh tempat wadah yang pas. Berapa panjang tepatnya?',
    englishDescription: 'This paintbrush needs a case. What is its exact length?',
    color: 'bg-indigo-400',
  },
];

export const RulerMeasurementGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [itemIdx, setItemIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  // Ruler horizontal offset in percentage (-20% to +20%)
  const [rulerOffset, setRulerOffset] = useState<number>(0);
  // User measured length in cm
  const [userLength, setUserLength] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);

  const currentItem = ITEMS[itemIdx];

  const initItem = (idx: number = itemIdx) => {
    const item = ITEMS[idx];
    setUserLength(0);
    // Start ruler slightly off so student experiences aligning it!
    setRulerOffset(0);
    setIsSuccess(false);
    setFeedback('');

    const voice = isEnglish ? item.englishDescription : item.description;
    sound.speak(voice);
  };

  useEffect(() => {
    initItem(itemIdx);
  }, [itemIdx, isEnglish]);

  const handleVerify = () => {
    if (userLength === currentItem.lengthCm) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      setScore((s) => s + 40);
      setIsSuccess(true);

      const winMsg = isEnglish
        ? `Spot on! The ${currentItem.englishName} is exactly ${currentItem.lengthCm} cm!`
        : `Tepat sekali! Panjang ${currentItem.name} adalah ${currentItem.lengthCm} cm!`;
      setFeedback(winMsg);
      sound.speak(winMsg);
    } else {
      sound.playRetry();
      let hint = '';
      if (userLength === 0) {
        hint = isEnglish ? 'Please measure and tap the length first!' : 'Tentukan hasil ukur panjangnya terlebih dahulu ya!';
      } else if (userLength < currentItem.lengthCm) {
        hint = isEnglish
          ? `You selected ${userLength} cm. Look closely at the right end — it reaches further!`
          : `Kamu memilih ${userLength} cm. Coba perhatikan ujung kanan benda, masih lebih panjang lho!`;
      } else {
        hint = isEnglish
          ? `You selected ${userLength} cm. That is longer than the item!`
          : `Kamu memilih ${userLength} cm. Itu melebihi panjang bendanya!`;
      }
      setFeedback(hint);
      sound.speak(hint);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (itemIdx < ITEMS.length - 1) {
      setItemIdx((p) => p + 1);
    } else {
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90 });
      onComplete(score + 50, 3);
    }
  };

  // 1 cm corresponds to 24px in our visual scale
  const CM_PX = 26;
  const itemWidthPx = currentItem.lengthCm * CM_PX;

  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-cyan-400 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
            <Ruler className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isEnglish ? 'Sliding Ruler & Length Lab' : 'Laboratorium Penggaris Geser'}
              </h2>
              <span className="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                {itemIdx + 1}/{ITEMS.length}
              </span>
            </div>
            <p className="text-xs text-cyan-100 font-semibold">
              {isEnglish ? 'Hands-on Metric Measurement (cm)' : 'Sentuh & Geser Penggaris Satuan Centimeter'}
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

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Mission Prompt */}
        <div className="bg-cyan-50 rounded-2xl p-3.5 border-2 border-cyan-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl bg-white p-2 rounded-2xl shadow-xs border border-cyan-200">
              {currentItem.emoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-cyan-900 uppercase tracking-wide">
                  {isEnglish ? currentItem.englishName : currentItem.name}
                </span>
                <span className="bg-cyan-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {isEnglish ? 'Measure length' : 'Ukur Panjang'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 leading-snug">
                {isEnglish ? currentItem.englishDescription : currentItem.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => sound.speak(isEnglish ? currentItem.englishDescription : currentItem.description)}
            className="p-2 rounded-xl bg-cyan-200/80 hover:bg-cyan-300 text-cyan-900 flex-shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* The Measurement Stage: Object on top, Ruler below */}
        <div className="bg-gradient-to-b from-slate-100 to-amber-50/50 rounded-3xl p-4 sm:p-6 border-2 border-slate-300 shadow-inner overflow-x-auto">
          <div className="min-w-[420px] max-w-full flex flex-col items-start relative pl-8 select-none">
            {/* Object Container */}
            <div className="mb-2 relative">
              {/* Left alignment guideline */}
              <div className="absolute -left-0 top-0 bottom-0 w-0.5 bg-rose-500/80 z-20 dashed flex flex-col items-center">
                <span className="text-[9px] font-black text-rose-600 bg-rose-100 px-1 rounded -translate-y-4 whitespace-nowrap">
                  Ujung Kiri (0)
                </span>
              </div>

              {/* The Actual Object */}
              <div
                style={{ width: `${itemWidthPx}px` }}
                className="h-16 rounded-2xl bg-white border-2 border-slate-400 shadow-md flex items-center justify-between px-3 relative overflow-hidden transition-all"
              >
                <span className="text-2xl">{currentItem.emoji}</span>
                <span className="text-xs font-black text-slate-600 opacity-60">
                  {isEnglish ? currentItem.englishName : currentItem.name}
                </span>
                {/* Visual texture */}
                <div className="absolute inset-y-0 right-0 w-4 bg-slate-200/50 rounded-r-xl" />
              </div>

              {/* Right alignment guideline */}
              <div
                style={{ left: `${itemWidthPx}px` }}
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-500/80 z-20 flex flex-col items-center"
              >
                <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1 rounded -translate-y-4 whitespace-nowrap">
                  Ujung Kanan
                </span>
              </div>
            </div>

            {/* Draggable/Sliding Ruler */}
            <div
              style={{ transform: `translateX(${rulerOffset}px)` }}
              className="mt-4 relative bg-gradient-to-b from-yellow-200 via-amber-100 to-yellow-300 border-2 border-amber-600 rounded-xl shadow-lg h-20 transition-transform duration-100 flex items-start select-none"
            >
              {/* Ruler Tick Marks (0 to 14 cm) */}
              <div className="flex relative">
                {Array.from({ length: 15 }).map((_, cm) => (
                  <div
                    key={cm}
                    onClick={() => {
                      sound.playClick();
                      setUserLength(cm);
                    }}
                    style={{ width: `${CM_PX}px` }}
                    className={`relative cursor-pointer transition-colors hover:bg-amber-300/40 ${
                      userLength === cm ? 'bg-amber-400/50' : ''
                    }`}
                  >
                    {/* Big cm tick mark */}
                    <div className="w-0.5 h-6 bg-slate-800" />
                    {/* Half-cm tick mark */}
                    <div className="absolute left-[13px] top-0 w-0.5 h-4 bg-slate-600" />
                    {/* Small mm ticks */}
                    <div className="absolute left-[6px] top-0 w-0.5 h-2 bg-slate-400" />
                    <div className="absolute left-[19px] top-0 w-0.5 h-2 bg-slate-400" />

                    {/* Number Label */}
                    <span className="block text-[11px] font-black text-slate-900 mt-1 pl-0.5">
                      {cm}
                    </span>
                  </div>
                ))}
              </div>

              {/* Ruler Wood Brand Mark */}
              <div className="absolute right-2 bottom-1 text-[9px] font-bold text-amber-800/70 tracking-widest uppercase">
                CAMBRIDGE CM
              </div>
            </div>

            {/* Slider Control to slide ruler */}
            <div className="w-full mt-4 flex items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <MoveHorizontal className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-black text-slate-700">
                  {isEnglish ? 'Slide Ruler Position:' : 'Geser Posisi Penggaris:'}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <button
                  onClick={() => setRulerOffset((o) => Math.max(-50, o - 10))}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700 text-xs flex items-center justify-center cursor-pointer"
                >
                  ◀
                </button>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={rulerOffset}
                  onChange={(e) => setRulerOffset(Number(e.target.value))}
                  className="flex-1 accent-cyan-600 cursor-pointer"
                />
                <button
                  onClick={() => setRulerOffset((o) => Math.min(50, o + 10))}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700 text-xs flex items-center justify-center cursor-pointer"
                >
                  ▶
                </button>
                <button
                  onClick={() => setRulerOffset(0)}
                  className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-1 rounded-lg border border-cyan-200 hover:bg-cyan-100 cursor-pointer"
                >
                  Pas 0
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Touch Selection of Measured Length (No ABCD!) */}
        <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-700 uppercase">
              {isEnglish ? 'Tap or Select Measured Length:' : 'Sentuh Hasil Ukuran Panjangmu:'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-bold">{isEnglish ? 'Your answer:' : 'Jawabanmu:'}</span>
              <span className="text-base font-black text-cyan-700 bg-cyan-100 px-3 py-0.5 rounded-full">
                {userLength > 0 ? `${userLength} cm` : '-'}
              </span>
            </div>
          </div>

          {/* Quick interactive touch numbers 1 to 14 cm */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {Array.from({ length: 14 }).map((_, i) => {
              const cmVal = i + 1;
              const isSelected = userLength === cmVal;
              return (
                <button
                  key={cmVal}
                  onClick={() => {
                    sound.playClick();
                    setUserLength(cmVal);
                  }}
                  className={`py-2 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-cyan-600 text-white border-cyan-700 shadow-md scale-105 ring-2 ring-cyan-400'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
                  }`}
                >
                  {cmVal} cm
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Display */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Ruler className="w-5 h-5 text-amber-600" />}
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={() => initItem()}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEnglish ? 'Reset Ruler' : 'Atur Ulang'}</span>
        </button>

        {!isSuccess ? (
          <button
            onClick={handleVerify}
            className="px-6 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <span>{isEnglish ? 'Verify Measurement' : 'Kunci Ukuran'} 📏</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <span>
              {itemIdx < ITEMS.length - 1
                ? isEnglish
                  ? 'Next Item'
                  : 'Ukur Benda Berikutnya'
                : isEnglish
                ? 'Master of Measurement!'
                : 'Selesai & Raih Bintang!'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
