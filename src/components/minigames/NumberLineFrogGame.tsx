import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Trophy, ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, Sparkles, X, ChevronRight, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface FrogMission {
  id: number;
  title: string;
  englishTitle: string;
  startPos: number;
  targetPos: number;
  maxRange: number;
  storyPrompt: string;
  englishStoryPrompt: string;
  strategyHint: string;
  englishStrategyHint: string;
  themeColor: string;
}

const MISSIONS: FrogMission[] = [
  {
    id: 1,
    title: 'Misi 1: Lompatan Bilangan Loncat (Skip Counting by 2)',
    englishTitle: 'Mission 1: Skip Counting (+2 Hops)',
    startPos: 0,
    targetPos: 8,
    maxRange: 12,
    storyPrompt: 'Bantu Kodok Kiko melompat dari teratai 0 ke teratai 8 dengan lompatan +2!',
    englishStoryPrompt: 'Help Kiko the frog hop from lily pad 0 to 8 using +2 jumps!',
    strategyHint: 'Gunakan tombol +2 sebanyak 4 kali (2, 4, 6, 8)!',
    englishStrategyHint: 'Use the +2 button 4 times (2, 4, 6, 8)!',
    themeColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 2,
    title: 'Misi 2: Strategi Menembus 10 (Bridging to 10)',
    englishTitle: 'Mission 2: Bridging Through 10 (8 + 5)',
    startPos: 8,
    targetPos: 13,
    maxRange: 16,
    storyPrompt: 'Kiko ada di angka 8 dan ingin melompat sejauh 5 (8 + 5). Lompat +2 ke 10, lalu +3 ke 13!',
    englishStoryPrompt: 'Kiko is at 8 and needs to add 5 (8 + 5). Hop +2 to 10, then +3 to 13!',
    strategyHint: '8 + 2 = 10, lalu 10 + 3 = 13!',
    englishStrategyHint: '8 + 2 = 10, then 10 + 3 = 13!',
    themeColor: 'from-blue-500 to-cyan-600',
  },
  {
    id: 3,
    title: 'Misi 3: Lompat Mundur Pengurangan (15 - 7)',
    englishTitle: 'Mission 3: Backward Hop Subtraction (15 - 7)',
    startPos: 15,
    targetPos: 8,
    maxRange: 18,
    storyPrompt: 'Kiko di angka 15 ingin mundur 7 langkah (15 - 7). Mundur -5 ke 10, lalu -2 ke 8!',
    englishStoryPrompt: 'Kiko at 15 wants to subtract 7 (15 - 7). Hop back -5 to 10, then -2 to 8!',
    strategyHint: '15 - 5 = 10, lalu 10 - 2 = 8!',
    englishStrategyHint: '15 - 5 = 10, then 10 - 2 = 8!',
    themeColor: 'from-indigo-500 to-purple-600',
  },
  {
    id: 4,
    title: 'Misi 4: Kelipatan 5 Menangkap Capung (0 ➔ 20)',
    englishTitle: 'Mission 4: Multiple of 5 Dragonfly Hunt',
    startPos: 0,
    targetPos: 20,
    maxRange: 24,
    storyPrompt: 'Ada capung emas di teratai 20! Gunakan lompatan besar +5 atau +10 untuk mencapainya!',
    englishStoryPrompt: 'A golden dragonfly is at lily pad 20! Use big +5 or +10 hops to reach it!',
    strategyHint: 'Gunakan +10 dua kali, atau +5 empat kali!',
    englishStrategyHint: 'Hop +10 twice or +5 four times!',
    themeColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 5,
    title: 'Misi 5: Teka-teki Lompat Campuran (7 + 9)',
    englishTitle: 'Mission 5: Mixed Hop Puzzle (7 + 9)',
    startPos: 7,
    targetPos: 16,
    maxRange: 20,
    storyPrompt: 'Kiko di angka 7 harus sampai ke angka 16. Cari kombinasi lompatan paling cerdas!',
    englishStoryPrompt: 'Kiko is at 7 and must reach 16. Find the cleverest hop sequence!',
    strategyHint: 'Trik cepat: Lompat +10 ke 17, lalu mundur -1 ke 16!',
    englishStrategyHint: 'Quick trick: Hop +10 to 17, then step back -1 to 16!',
    themeColor: 'from-rose-500 to-pink-600',
  },
];

interface HopStep {
  from: number;
  to: number;
  amount: number;
}

export const NumberLineFrogGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState<number>(0);
  const [currentPos, setCurrentPos] = useState<number>(0);
  const [hopHistory, setHopHistory] = useState<HopStep[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);
  const [isHopping, setIsHopping] = useState<boolean>(false);

  const mission = MISSIONS[missionIdx];

  const initMission = (idx: number = missionIdx) => {
    const m = MISSIONS[idx];
    setCurrentPos(m.startPos);
    setHopHistory([]);
    setIsSuccess(false);
    setFeedback('');

    const voice = isEnglish ? m.englishStoryPrompt : m.storyPrompt;
    sound.speak(voice);
  };

  useEffect(() => {
    initMission(missionIdx);
  }, [missionIdx, isEnglish]);

  // Execute a jump on the number line
  const handleJump = (amount: number) => {
    if (isSuccess) return;
    const newPos = currentPos + amount;

    if (newPos < 0 || newPos > mission.maxRange) {
      sound.playRetry();
      sound.speak(isEnglish ? 'Out of pond range!' : 'Di luar batas kolam teratai!');
      return;
    }

    sound.playClick();
    setIsHopping(true);
    setTimeout(() => setIsHopping(false), 400);

    const step: HopStep = {
      from: currentPos,
      to: newPos,
      amount,
    };
    setHopHistory((prev) => [...prev, step]);
    setCurrentPos(newPos);

    // Audio cues
    if (newPos === mission.targetPos) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      setScore((s) => s + 40);
      setIsSuccess(true);
      const win = isEnglish
        ? `Ribbit! Perfect jump! Kiko landed on target ${mission.targetPos}! 🐸✨`
        : `Kroook! Lompatan tepat! Kiko berhasil mendarat di teratai target ${mission.targetPos}! 🐸✨`;
      setFeedback(win);
      sound.speak(win);
    } else {
      const remaining = mission.targetPos - newPos;
      if (remaining > 0) {
        setFeedback(isEnglish ? `At ${newPos}. Need +${remaining} more!` : `Di angka ${newPos}. Kurang +${remaining} langkah lagi!`);
      } else {
        setFeedback(isEnglish ? `At ${newPos}. Over by ${Math.abs(remaining)}, hop backwards!` : `Di angka ${newPos}. Kelewat ${Math.abs(remaining)}, ayo lompat mundur!`);
      }
    }
  };

  const handleNextMission = () => {
    sound.playClick();
    if (missionIdx < MISSIONS.length - 1) {
      setMissionIdx((m) => m + 1);
    } else {
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90 });
      onComplete(score + 50, 3);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-emerald-400 shadow-2xl overflow-hidden flex flex-col">
      {/* 1. Header */}
      <div className={`bg-gradient-to-r ${mission.themeColor} p-4 text-white flex items-center justify-between shadow-md`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            🐸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isEnglish ? mission.englishTitle : mission.title}
              </h2>
              <span className="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Level {missionIdx + 1}/{MISSIONS.length}
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-semibold">
              {isEnglish ? 'Cambridge Mental Math Number Line' : 'Garis Bilangan Lompat Kodok (Cambridge Primary)'}
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

      {/* 2. Mission & Target Banner */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="bg-emerald-50 rounded-2xl p-3.5 border-2 border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl bg-white p-2 rounded-2xl shadow-xs border border-emerald-200 animate-bounce">
              🪷
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                  Posisi Awal: <span className="text-emerald-700 font-black">{mission.startPos}</span>
                </span>
                <span className="text-slate-300">➔</span>
                <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  Target: {mission.targetPos}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 leading-snug">
                {isEnglish ? mission.englishStoryPrompt : mission.storyPrompt}
              </p>
            </div>
          </div>

          <button
            onClick={() => sound.speak(isEnglish ? mission.englishStoryPrompt : mission.storyPrompt)}
            className="p-2 rounded-xl bg-emerald-200/80 hover:bg-emerald-300 text-emerald-900 flex-shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Interactive Pond & Number Line Visual Stage */}
        <div className="bg-gradient-to-b from-sky-100 via-teal-50 to-emerald-100/60 rounded-3xl p-4 sm:p-6 border-2 border-teal-200 shadow-inner overflow-x-auto relative">
          {/* Subtle pond water lilies in background */}
          <div className="min-w-[500px] flex flex-col items-center select-none relative pt-12 pb-4">
            {/* SVG Arc Trajectories of previous hops */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {hopHistory.map((step, idx) => {
                const totalPoints = mission.maxRange;
                const padWidth = 100 / (totalPoints + 1);
                const x1 = (step.from + 0.5) * padWidth;
                const x2 = (step.to + 0.5) * padWidth;
                const midX = (x1 + x2) / 2;
                const height = Math.min(65, Math.abs(step.amount) * 12 + 25);
                const isForward = step.amount > 0;

                return (
                  <g key={idx}>
                    <path
                      d={`M ${x1}% 65 Q ${midX}% ${65 - height}, ${x2}% 65`}
                      fill="none"
                      stroke={isForward ? '#10b981' : '#f43f5e'}
                      strokeWidth="3.5"
                      strokeDasharray="4 2"
                      className="animate-in fade-in"
                    />
                    {/* Badge on the top of the arc */}
                    <text
                      x={`${midX}%`}
                      y={55 - height}
                      fill={isForward ? '#047857' : '#be123c'}
                      fontSize="11"
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      {isForward ? `+${step.amount}` : step.amount}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Lily Pads and Numbers Row */}
            <div className="w-full flex justify-between items-end relative z-20 px-2">
              {Array.from({ length: mission.maxRange + 1 }).map((_, num) => {
                const isFrogHere = currentPos === num;
                const isTarget = mission.targetPos === num;
                const isStart = mission.startPos === num;

                return (
                  <div
                    key={num}
                    onClick={() => {
                      // Tapping a lilypad directly calculates the hop difference!
                      const diff = num - currentPos;
                      if (diff !== 0) handleJump(diff);
                    }}
                    className="flex flex-col items-center cursor-pointer group"
                    title={`Teratai ${num}`}
                  >
                    {/* Animated Frog Avatar */}
                    {isFrogHere && (
                      <div className={`text-3xl -mb-2 z-30 transition-all ${isHopping ? '-translate-y-6 scale-125' : 'animate-bounce'}`}>
                        🐸
                      </div>
                    )}

                    {/* Target Dragonfly Flag */}
                    {isTarget && !isFrogHere && (
                      <div className="text-xl -mb-1 z-20 animate-pulse" title="Target Teratai">
                        🪷
                      </div>
                    )}

                    {/* Lily Pad Circle */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        isFrogHere
                          ? 'bg-emerald-500 border-emerald-700 text-white font-black shadow-lg scale-110 ring-4 ring-emerald-300'
                          : isTarget
                          ? 'bg-rose-100 border-rose-500 text-rose-800 font-black ring-2 ring-rose-300'
                          : isStart
                          ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold'
                          : 'bg-teal-50 hover:bg-teal-100 border-teal-300 text-teal-900 font-bold'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-black">{num}</span>
                    </div>

                    {/* Tick mark below */}
                    <div className="w-0.5 h-2 bg-teal-600 mt-1" />
                  </div>
                );
              })}
            </div>

            {/* Main Baseline Number Line Rod */}
            <div className="w-full h-1.5 bg-teal-600 rounded-full mt-0.5" />
          </div>

          {/* Real-time Position & Equation Bar */}
          <div className="mt-2 flex items-center justify-between bg-white/90 px-4 py-2 rounded-2xl border border-teal-200 shadow-xs text-xs font-black">
            <span className="text-slate-500">
              {isEnglish ? 'Frog Position:' : 'Posisi Kiko Saat Ini:'}
            </span>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <span className="text-emerald-700 font-black">Teratai {currentPos}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-normal">
                {hopHistory.length > 0 ? (
                  <span>
                    Jejak:{' '}
                    {hopHistory.map((h, i) => (
                      <span key={i} className={h.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {h.amount > 0 ? `+${h.amount} ` : `${h.amount} `}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span>Belum melompat</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Frog Jump Controls (Cambridge Mental Math Decomposition) */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-700">
            <span>{isEnglish ? 'Hop Controls (Tap to Jump):' : 'Kendali Lompatan Kodok (Sentuh Tombol):'}</span>
            <span className="text-[11px] text-slate-400">Atau sentuh teratai langsung</span>
          </div>

          {/* Forward and Backward Hop Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* Forward Hops */}
            <div className="flex items-center gap-1.5 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-black text-emerald-800 uppercase">Maju:</span>
              {[1, 2, 5, 10].map((step) => (
                <button
                  key={step}
                  onClick={() => handleJump(step)}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-xs cursor-pointer active:scale-95 transition-transform"
                >
                  +{step}
                </button>
              ))}
            </div>

            {/* Backward Hops */}
            <div className="flex items-center gap-1.5 bg-rose-50 p-2 rounded-xl border border-rose-200">
              <span className="text-[10px] font-black text-rose-800 uppercase">Mundur:</span>
              {[1, 2, 5, 10].map((step) => (
                <button
                  key={step}
                  onClick={() => handleJump(-step)}
                  className="flex-1 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm shadow-xs cursor-pointer active:scale-95 transition-transform"
                >
                  -{step}
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
                : 'bg-sky-50 border-sky-300 text-sky-900'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Sparkles className="w-5 h-5 text-sky-600" />}
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
          <span>{isEnglish ? 'Reset Frog' : 'Mulai Ulang'}</span>
        </button>

        {!isSuccess ? (
          <div className="text-xs font-bold text-slate-500 italic">
            💡 {isEnglish ? mission.englishStrategyHint : mission.strategyHint}
          </div>
        ) : (
          <button
            onClick={handleNextMission}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95 animate-bounce"
          >
            <span>{missionIdx < MISSIONS.length - 1 ? (isEnglish ? 'Next Mission' : 'Misi Berikutnya') : (isEnglish ? 'Master of the Pond!' : 'Selesai & Ambil Bintang!')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
