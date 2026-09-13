import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Trophy, ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, Sparkles, X, Scale, Plus, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface PanWeightItem {
  id: string;
  name: string;
  weight: number; // in grams or kg
  emoji: string;
}

interface BalanceMission {
  id: number;
  title: string;
  englishTitle: string;
  itemOnLeft: {
    name: string;
    englishName: string;
    emoji: string;
    unknownWeight: number;
    initialExtraWeights: number; // e.g. Box + 2kg
  };
  storyPrompt: string;
  englishStoryPrompt: string;
  availableWeights: number[]; // e.g. [1, 2, 5] or [100, 200, 500]
  unit: string;
  targetWeight: number;
  cambridgeNote: string;
  englishCambridgeNote: string;
}

const MISSIONS: BalanceMission[] = [
  {
    id: 1,
    title: 'Misi 1: Menimbang Semangka Segar',
    englishTitle: 'Mission 1: Weighing the Fresh Watermelon',
    itemOnLeft: {
      name: 'Semangka Manis',
      englishName: 'Sweet Watermelon',
      emoji: '🍉',
      unknownWeight: 4,
      initialExtraWeights: 0,
    },
    storyPrompt: 'Semangka ada di piring kiri. Letakkan anak timbangan (1 kg, 2 kg) di piring kanan sampai jarum neraca seimbang tegak lurus!',
    englishStoryPrompt: 'The watermelon is on the left pan. Place weights on the right pan until the balance beam is perfectly horizontal!',
    availableWeights: [1, 2, 5],
    unit: 'kg',
    targetWeight: 4,
    cambridgeNote: 'Gunakan kombinasi 2 kg + 2 kg, atau 2 kg + 1 kg + 1 kg!',
    englishCambridgeNote: 'Combine 2 kg + 2 kg or 2 kg + 1 kg + 1 kg!',
  },
  {
    id: 2,
    title: 'Misi 2: Durian Montong & Pemberat',
    englishTitle: 'Mission 2: Durian & Extra Weight',
    itemOnLeft: {
      name: 'Durian Harum',
      englishName: 'Fragrant Durian',
      emoji: '🍈',
      unknownWeight: 6,
      initialExtraWeights: 0,
    },
    storyPrompt: 'Timbang durian ini dengan memilih pemberat di piring kanan sampai neraca benar-benar rata sejajar!',
    englishStoryPrompt: 'Weigh this durian by balancing the right pan with matching weights!',
    availableWeights: [1, 2, 5],
    unit: 'kg',
    targetWeight: 6,
    cambridgeNote: 'Trik cepat: 5 kg + 1 kg = 6 kg!',
    englishCambridgeNote: 'Quick trick: 5 kg + 1 kg = 6 kg!',
  },
  {
    id: 3,
    title: 'Misi 3: Kotak Misteri Aljabar (x + 2 = 7)',
    englishTitle: 'Mission 3: Algebraic Mystery Box (x + 2 = 7)',
    itemOnLeft: {
      name: 'Kotak Misteri 🎁 + 2 kg',
      englishName: 'Mystery Box 🎁 + 2 kg',
      emoji: '🎁',
      unknownWeight: 5, // Box is 5, but + 2 initial = 7 total on left
      initialExtraWeights: 2,
    },
    storyPrompt: 'Di piring kiri ada Kotak Hadiah 🎁 dan pemberat 2 kg. Seimbangkan piring kanan dengan 7 kg untuk mengetahui berat kotak!',
    englishStoryPrompt: 'Left pan holds Mystery Box 🎁 + 2 kg. Balance the right pan with 7 kg to solve the box weight!',
    availableWeights: [1, 2, 5],
    unit: 'kg',
    targetWeight: 7,
    cambridgeNote: 'Total piring kanan harus 7 kg. Maka isi kotak 🎁 = 7 - 2 = 5 kg!',
    englishCambridgeNote: 'Total on right must be 7 kg. So mystery box 🎁 = 7 - 2 = 5 kg!',
  },
  {
    id: 4,
    title: 'Misi 4: Kantong Emas Karun Bajak Laut',
    englishTitle: 'Mission 4: Pirate Treasure Gold Pouch',
    itemOnLeft: {
      name: 'Kantong Emas Permata',
      englishName: 'Golden Gem Pouch',
      emoji: '💰',
      unknownWeight: 9,
      initialExtraWeights: 0,
    },
    storyPrompt: 'Berapa berat kantong emas karun ini? Tambahkan beban 5 kg, 2 kg, dan 1 kg ke piring kanan sampai seimbang sempurna!',
    englishStoryPrompt: 'What is the weight of this pirate gold pouch? Add weights on the right pan until perfectly balanced!',
    availableWeights: [1, 2, 5],
    unit: 'kg',
    targetWeight: 9,
    cambridgeNote: '5 kg + 2 kg + 2 kg = 9 kg!',
    englishCambridgeNote: '5 kg + 2 kg + 2 kg = 9 kg!',
  },
];

export const PanBalanceAlgebraGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState<number>(0);
  const [rightWeights, setRightWeights] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);

  const mission = MISSIONS[missionIdx];
  const leftTotal = mission.targetWeight;
  const rightTotal = rightWeights.reduce((a, b) => a + b, 0);

  // Physics tilt calculation:
  // -15 deg = heavy on left, +15 deg = heavy on right, 0 deg = perfectly balanced
  const diff = rightTotal - leftTotal;
  const tiltDeg = Math.max(-14, Math.min(14, diff * 3));

  const initMission = (idx: number = missionIdx) => {
    const m = MISSIONS[idx];
    setRightWeights([]);
    setIsSuccess(false);
    setFeedback('');

    const voice = isEnglish ? m.englishStoryPrompt : m.storyPrompt;
    sound.speak(voice);
  };

  useEffect(() => {
    initMission(missionIdx);
  }, [missionIdx, isEnglish]);

  const addRightWeight = (weight: number) => {
    if (isSuccess) return;
    sound.playClick();
    const nextWeights = [...rightWeights, weight];
    setRightWeights(nextWeights);

    const nextTotal = nextWeights.reduce((a, b) => a + b, 0);
    if (nextTotal === leftTotal) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
      setScore((s) => s + 40);
      setIsSuccess(true);
      const win = isEnglish
        ? `Incredible! The scale is perfectly balanced at ${leftTotal} ${mission.unit}! Left = Right! ⚖️✨`
        : `Luar biasa! Neraca seimbang sempurna di ${leftTotal} ${mission.unit}! Sisi Kiri = Sisi Kanan! ⚖️✨`;
      setFeedback(win);
      sound.speak(win);
    } else {
      const remaining = leftTotal - nextTotal;
      if (remaining > 0) {
        setFeedback(isEnglish ? `Right pan has ${nextTotal} ${mission.unit}. Need +${remaining} ${mission.unit} more!` : `Piring kanan bernilai ${nextTotal} ${mission.unit}. Masih kurang +${remaining} ${mission.unit}!`);
      } else {
        setFeedback(isEnglish ? `Too heavy on right by ${Math.abs(remaining)} ${mission.unit}! Remove a weight!` : `Piring kanan terlalu berat ${Math.abs(remaining)} ${mission.unit}! Ambil pemberatnya ya!`);
      }
    }
  };

  const removeRightWeight = (index: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = [...rightWeights];
    next.splice(index, 1);
    setRightWeights(next);
  };

  const handleNext = () => {
    sound.playClick();
    if (missionIdx < MISSIONS.length - 1) {
      setMissionIdx((p) => p + 1);
    } else {
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90 });
      onComplete(score + 50, 3);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            ⚖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isEnglish ? mission.englishTitle : mission.title}
              </h2>
              <span className="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Misi {missionIdx + 1}/{MISSIONS.length}
              </span>
            </div>
            <p className="text-xs text-amber-100 font-semibold">
              {isEnglish ? 'Cambridge Pan Balance & Algebraic Scales' : 'Neraca Aljabar & Massa Seimbang (Cambridge Primary)'}
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

      {/* 2. Mission Story Prompt */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="bg-amber-50 rounded-2xl p-3.5 border-2 border-amber-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl bg-white p-2 rounded-2xl shadow-xs border border-amber-200">
              {mission.itemOnLeft.emoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
                  Benda yang Ditimbang:
                </span>
                <span className="bg-amber-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {isEnglish ? mission.itemOnLeft.englishName : mission.itemOnLeft.name}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 leading-snug">
                {isEnglish ? mission.englishStoryPrompt : mission.storyPrompt}
              </p>
            </div>
          </div>

          <button
            onClick={() => sound.speak(isEnglish ? mission.englishStoryPrompt : mission.storyPrompt)}
            className="p-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 flex-shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3. The Physical Pan Balance Beam Stage */}
        <div className="bg-gradient-to-b from-slate-100 via-amber-50/50 to-orange-50/70 rounded-3xl p-4 sm:p-6 border-2 border-amber-200 flex flex-col items-center justify-center select-none relative min-h-[280px]">
          {/* Central Fulcrum Column & Needle */}
          <div className="relative flex flex-col items-center z-10">
            {/* Balance Indicator Dial/Needle */}
            <div className="w-12 h-12 rounded-full bg-white border-3 border-amber-600 shadow-md flex items-center justify-center relative -mb-3 z-30">
              <div
                style={{ transform: `rotate(${tiltDeg * 2}deg)` }}
                className="w-1 h-8 bg-rose-600 rounded-full origin-bottom transition-transform duration-300"
              />
              <div className="w-2 h-2 rounded-full bg-amber-800 z-10" />
            </div>

            {/* Pivot Support Stand */}
            <div className="w-4 h-24 bg-gradient-to-b from-slate-600 to-slate-800 rounded-sm shadow-md mt-2" />
            <div className="w-32 h-4 bg-slate-700 rounded-t-xl shadow-lg -mt-1 border-t-2 border-slate-500" />
          </div>

          {/* The Tilting Balance Beam Bar */}
          <div
            style={{ transform: `rotate(${tiltDeg}deg)` }}
            className="absolute top-16 sm:top-18 w-[85%] sm:w-[90%] max-w-lg h-3.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-full shadow-lg transition-transform duration-300 flex justify-between items-center px-1 z-20"
          >
            {/* Left Pan Assembly */}
            <div
              style={{ transform: `rotate(${-tiltDeg}deg)` }}
              className="relative -ml-4 flex flex-col items-center origin-top transition-transform duration-300"
            >
              {/* Chains/Strings */}
              <div className="w-16 h-16 border-l-2 border-r-2 border-amber-800 -mb-1 opacity-70" />
              {/* Left Dish/Plate */}
              <div className="w-24 sm:w-28 h-7 bg-gradient-to-t from-slate-400 to-slate-200 border-2 border-slate-500 rounded-b-full shadow-md flex flex-col items-center justify-end pb-1 relative">
                {/* Items resting on left pan */}
                <div className="absolute -top-12 flex items-end justify-center gap-1">
                  <span className="text-3xl sm:text-4xl filter drop-shadow animate-pulse">
                    {mission.itemOnLeft.emoji}
                  </span>
                  {mission.itemOnLeft.initialExtraWeights > 0 && (
                    <div className="w-7 h-7 rounded-md bg-slate-700 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                      {mission.itemOnLeft.initialExtraWeights}kg
                    </div>
                  )}
                </div>
              </div>
              {/* Left Total Label */}
              <span className="text-[11px] font-black text-slate-700 mt-1 bg-white/90 px-2 py-0.5 rounded-full border border-slate-300 shadow-2xs">
                {isSuccess ? `${leftTotal} ${mission.unit}` : 'Beban Kiri (?)'}
              </span>
            </div>

            {/* Right Pan Assembly */}
            <div
              style={{ transform: `rotate(${-tiltDeg}deg)` }}
              className="relative -mr-4 flex flex-col items-center origin-top transition-transform duration-300"
            >
              {/* Chains/Strings */}
              <div className="w-16 h-16 border-l-2 border-r-2 border-amber-800 -mb-1 opacity-70" />
              {/* Right Dish/Plate */}
              <div className="w-24 sm:w-28 h-7 bg-gradient-to-t from-slate-400 to-slate-200 border-2 border-slate-500 rounded-b-full shadow-md flex flex-col items-center justify-end pb-1 relative">
                {/* Weight weights placed by user */}
                <div className="absolute -top-10 flex flex-wrap-reverse items-end justify-center gap-1 max-w-[100px]">
                  {rightWeights.map((w, idx) => (
                    <div
                      key={idx}
                      onClick={() => removeRightWeight(idx)}
                      className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                      title="Sentuh untuk membuang pemberat ini"
                    >
                      <div
                        className={`rounded-md font-black text-[10px] sm:text-xs flex items-center justify-center shadow-md border border-slate-900 ${
                          w === 5
                            ? 'w-8 h-8 bg-amber-700 text-amber-100'
                            : w === 2
                            ? 'w-7 h-7 bg-slate-700 text-white'
                            : 'w-6 h-6 bg-slate-500 text-white'
                        }`}
                      >
                        {w}k
                      </div>
                    </div>
                  ))}
                  {rightWeights.length === 0 && (
                    <span className="text-[10px] text-slate-400 font-bold italic">
                      (Kosong)
                    </span>
                  )}
                </div>
              </div>
              {/* Right Total Label */}
              <span className={`text-[11px] font-black mt-1 px-2 py-0.5 rounded-full border shadow-2xs ${
                rightTotal === leftTotal
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : 'bg-white/90 text-slate-700 border-slate-300'
              }`}>
                {rightTotal} {mission.unit}
              </span>
            </div>
          </div>

          {/* Balance status pill at bottom */}
          <div className="mt-6 z-10">
            <div
              className={`px-3 py-1 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5 ${
                rightTotal === leftTotal
                  ? 'bg-emerald-500 text-white animate-bounce'
                  : rightTotal > leftTotal
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {rightTotal === leftTotal ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SEIMBANG SEMPURNA! KIRI = KANAN ({leftTotal} {mission.unit}) ✨</span>
                </>
              ) : rightTotal > leftTotal ? (
                <span>Berat ke Kanan (Kelebihan {rightTotal - leftTotal} {mission.unit}) ⚠️</span>
              ) : (
                <span>Berat ke Kiri (Kurang {leftTotal - rightTotal} {mission.unit}) ⚖️</span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Weight Selection Tray (Tactile weights) */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-700">
            <span>{isEnglish ? 'Weights Tray (Tap to Put on Right Pan):' : 'Baki Anak Timbangan (Sentuh untuk Meletakkan ke Piring Kanan):'}</span>
            <span className="text-[11px] text-slate-400">Sentuh beban di piring untuk melepas</span>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-6 py-1">
            {mission.availableWeights.map((w) => (
              <button
                key={w}
                onClick={() => addRightWeight(w)}
                className={`flex flex-col items-center justify-center rounded-2xl shadow-md cursor-pointer active:scale-95 transition-all p-3 border-2 ${
                  w === 5
                    ? 'w-20 h-20 bg-gradient-to-b from-amber-700 to-amber-900 border-amber-950 text-amber-100 hover:brightness-110'
                    : w === 2
                    ? 'w-18 h-18 bg-gradient-to-b from-slate-600 to-slate-800 border-slate-900 text-white hover:brightness-110'
                    : 'w-16 h-16 bg-gradient-to-b from-slate-400 to-slate-600 border-slate-700 text-white hover:brightness-110'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 mb-1" />
                <span className="text-lg sm:text-xl font-black">{w}</span>
                <span className="text-[10px] font-bold uppercase">{mission.unit}</span>
              </button>
            ))}
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
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Scale className="w-5 h-5 text-amber-600" />}
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* 5. Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={() => initMission()}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEnglish ? 'Clear Pan' : 'Kosongkan Piring'}</span>
        </button>

        {!isSuccess ? (
          <div className="text-xs font-bold text-slate-500 italic">
            💡 {isEnglish ? mission.englishCambridgeNote : mission.cambridgeNote}
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95 animate-bounce"
          >
            <span>{missionIdx < MISSIONS.length - 1 ? (isEnglish ? 'Next Challenge' : 'Timbangan Berikutnya') : (isEnglish ? 'Master of Balance!' : 'Selesai & Ambil Bintang!')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
