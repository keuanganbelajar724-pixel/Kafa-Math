import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Trophy, ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, Sparkles, X, BarChart3, ChevronUp, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface ChartItem {
  id: string;
  label: string;
  englishLabel: string;
  emoji: string;
  tallyCount: number; // Target frequency
  color: string; // Tailwind class
}

interface SurveyMission {
  id: number;
  title: string;
  englishTitle: string;
  surveyTheme: string;
  englishSurveyTheme: string;
  maxScale: number; // e.g. 10
  stepScale: number; // e.g. 1 or 2
  items: ChartItem[];
  storyPrompt: string;
  englishStoryPrompt: string;
  themeColor: string;
}

const MISSIONS: SurveyMission[] = [
  {
    id: 1,
    title: 'Survei Buah Kesukaan Kelas 3',
    englishTitle: 'Survey: Class 3 Favorite Fruits',
    surveyTheme: 'Hasil Turus Buah Kesukaan',
    englishSurveyTheme: 'Fruit Survey Tally Results',
    maxScale: 10,
    stepScale: 1,
    items: [
      { id: 'apple', label: 'Apel', englishLabel: 'Apple', emoji: '🍎', tallyCount: 6, color: 'from-red-500 to-rose-600' },
      { id: 'banana', label: 'Pisang', englishLabel: 'Banana', emoji: '🍌', tallyCount: 8, color: 'from-amber-400 to-yellow-500' },
      { id: 'orange', label: 'Jeruk', englishLabel: 'Orange', emoji: '🍊', tallyCount: 4, color: 'from-orange-400 to-amber-500' },
      { id: 'grape', label: 'Anggur', englishLabel: 'Grape', emoji: '🍇', tallyCount: 7, color: 'from-purple-500 to-indigo-600' },
    ],
    storyPrompt: 'Lihat data turus di atas. Sentuh dan naikkan tinggi setiap batang agar sesuai dengan jumlah pemilih buah!',
    englishStoryPrompt: 'Look at the tally data above. Tap and raise each bar height to match the fruit tally count!',
    themeColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 2,
    title: 'Survei Hewan Peliharaan Favorit',
    englishTitle: 'Survey: Favorite Family Pets',
    surveyTheme: 'Hasil Turus Hewan Peliharaan',
    englishSurveyTheme: 'Pet Survey Tally Results',
    maxScale: 10,
    stepScale: 1,
    items: [
      { id: 'cat', label: 'Kucing', englishLabel: 'Cat', emoji: '🐱', tallyCount: 9, color: 'from-amber-500 to-orange-600' },
      { id: 'rabbit', label: 'Kelinci', englishLabel: 'Rabbit', emoji: '🐰', tallyCount: 5, color: 'from-pink-400 to-rose-500' },
      { id: 'fish', label: 'Ikan Hias', englishLabel: 'Fish', emoji: '🐠', tallyCount: 6, color: 'from-cyan-400 to-blue-500' },
      { id: 'bird', label: 'Burung', englishLabel: 'Bird', emoji: '🦜', tallyCount: 3, color: 'from-emerald-400 to-teal-500' },
    ],
    storyPrompt: 'Kucing mendapat 9 suara, kelinci 5, ikan 6, dan burung 3. Naikkan batang diagramnya ya!',
    englishStoryPrompt: 'Cats got 9 votes, rabbits 5, fish 6, and birds 3. Raise the chart bars to match!',
    themeColor: 'from-indigo-500 to-blue-600',
  },
];

// Helper to render Cambridge tally marks (turus)
const renderTallyMarks = (count: number) => {
  const bundles = Math.floor(count / 5);
  const remainder = count % 5;
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: bundles }).map((_, i) => (
        <span key={i} className="bg-amber-100 text-amber-900 border border-amber-300 font-mono font-black text-xs px-1 rounded shadow-2xs tracking-tighter" title="5 Turus">
          <s>||||</s>
        </span>
      ))}
      {remainder > 0 && (
        <span className="bg-slate-100 text-slate-800 border border-slate-300 font-mono font-black text-xs px-1 rounded shadow-2xs" title={`${remainder} Turus`}>
          {'|'.repeat(remainder)}
        </span>
      )}
      <span className="text-xs font-black text-slate-600 ml-1">({count})</span>
    </div>
  );
};

export const BarChartBuilderGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState<number>(0);
  // Store user-adjusted bar heights: { [itemId]: height }
  const [userHeights, setUserHeights] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);

  const mission = MISSIONS[missionIdx];

  const initMission = (idx: number = missionIdx) => {
    const m = MISSIONS[idx];
    const initial: Record<string, number> = {};
    m.items.forEach((item) => {
      initial[item.id] = 0; // Starts at 0
    });
    setUserHeights(initial);
    setIsSuccess(false);
    setFeedback('');

    const voice = isEnglish ? m.englishStoryPrompt : m.storyPrompt;
    sound.speak(voice);
  };

  useEffect(() => {
    initMission(missionIdx);
  }, [missionIdx, isEnglish]);

  // Adjust bar height
  const adjustHeight = (itemId: string, delta: number) => {
    if (isSuccess) return;
    sound.playClick();
    setUserHeights((prev) => {
      const current = prev[itemId] || 0;
      const nextVal = Math.max(0, Math.min(mission.maxScale, current + delta));
      return { ...prev, [itemId]: nextVal };
    });
  };

  // Direct set height by tapping y-axis level on column
  const setExactHeight = (itemId: string, val: number) => {
    if (isSuccess) return;
    sound.playClick();
    setUserHeights((prev) => ({ ...prev, [itemId]: val }));
  };

  const handleVerify = () => {
    let allCorrect = true;
    let mismatchItem: ChartItem | null = null;

    for (const item of mission.items) {
      if ((userHeights[item.id] || 0) !== item.tallyCount) {
        allCorrect = false;
        mismatchItem = item;
        break;
      }
    }

    if (allCorrect) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
      setScore((s) => s + 40);
      setIsSuccess(true);
      const win = isEnglish
        ? 'Outstanding! All bar heights match the tally chart perfectly! 📊✨'
        : 'Hebat sekali! Semua batang diagram sudah sesuai persis dengan data turus! 📊✨';
      setFeedback(win);
      sound.speak(win);
    } else if (mismatchItem) {
      sound.playRetry();
      const currentH = userHeights[mismatchItem.id] || 0;
      const targetH = mismatchItem.tallyCount;
      const diff = targetH - currentH;
      const hint = isEnglish
        ? `${mismatchItem.englishLabel} is at ${currentH}, but tally is ${targetH} (${diff > 0 ? `need +${diff}` : `over by ${Math.abs(diff)}`})!`
        : `Batang ${mismatchItem.label} saat ini bernilai ${currentH}, padahal jumlah turusnya adalah ${targetH} (${diff > 0 ? `kurang +${diff}` : `kelebihan ${Math.abs(diff)}`})!`;
      setFeedback(hint);
      sound.speak(hint);
    }
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
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-indigo-400 shadow-2xl overflow-hidden flex flex-col">
      {/* 1. Header */}
      <div className={`bg-gradient-to-r ${mission.themeColor} p-4 text-white flex items-center justify-between shadow-md`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isEnglish ? mission.englishTitle : mission.title}
              </h2>
              <span className="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Tantangan {missionIdx + 1}/{MISSIONS.length}
              </span>
            </div>
            <p className="text-xs text-indigo-100 font-semibold">
              {isEnglish ? 'Cambridge Bar Chart & Tally Data Studio' : 'Studio Diagram Batang & Data Turus (Cambridge Primary)'}
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

      {/* 2. Tally Survey Board */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="bg-slate-50 rounded-2xl p-3 border-2 border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <span>📋</span>
              <span>{isEnglish ? mission.englishSurveyTheme : mission.surveyTheme}</span>
            </span>
            <button
              onClick={() => sound.speak(isEnglish ? mission.englishStoryPrompt : mission.storyPrompt)}
              className="p-1 rounded-lg bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tally cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {mission.items.map((item) => (
              <div key={item.id} className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center text-center">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-xs font-black text-slate-800">{isEnglish ? item.englishLabel : item.label}</span>
                <div className="mt-1">{renderTallyMarks(item.tallyCount)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Interactive Bar Chart Stage */}
        <div className="bg-gradient-to-b from-slate-50 to-indigo-50/40 rounded-3xl p-4 sm:p-6 border-2 border-indigo-200 flex items-end justify-center select-none min-h-[260px] relative">
          {/* Y-Axis scale on the left */}
          <div className="flex flex-col justify-between h-48 pr-2 border-r-2 border-slate-400 text-[10px] font-black text-slate-600 pb-2">
            {[10, 8, 6, 4, 2, 0].map((val) => (
              <div key={val} className="flex items-center gap-1 -translate-y-2">
                <span>{val}</span>
                <div className="w-1.5 h-0.5 bg-slate-400" />
              </div>
            ))}
          </div>

          {/* Columns Container */}
          <div className="flex-1 grid grid-cols-4 gap-3 sm:gap-6 pl-3 sm:pl-6 h-48 items-end border-b-2 border-slate-400 pb-0.5">
            {mission.items.map((item) => {
              const currentH = userHeights[item.id] || 0;
              const heightPercent = (currentH / mission.maxScale) * 100;
              const isMatch = currentH === item.tallyCount;

              return (
                <div key={item.id} className="flex flex-col items-center justify-end h-full relative group">
                  {/* Up / Down adjustment buttons above bar */}
                  <div className="flex items-center gap-1 mb-1">
                    <button
                      onClick={() => adjustHeight(item.id, -1)}
                      disabled={currentH === 0}
                      className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer disabled:opacity-20"
                      title="Turunkan -1"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => adjustHeight(item.id, 1)}
                      disabled={currentH >= mission.maxScale}
                      className="w-5 h-5 rounded bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer disabled:opacity-20"
                      title="Naikkan +1"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Value badge on top of bar */}
                  <span className={`text-xs font-black px-1.5 py-0.2 rounded-md mb-0.5 ${
                    isMatch ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {currentH}
                  </span>

                  {/* The Bar Element */}
                  <div
                    onClick={() => adjustHeight(item.id, currentH >= mission.maxScale ? -currentH : 1)}
                    style={{ height: `${Math.max(6, heightPercent)}%` }}
                    className={`w-full max-w-[50px] rounded-t-xl bg-gradient-to-t ${item.color} border-2 border-b-0 border-slate-700/30 shadow-md transition-all duration-200 cursor-pointer hover:opacity-90 relative flex items-center justify-center`}
                  >
                    {/* Visual stripes */}
                    <div className="absolute inset-0 bg-white/10 rounded-t-xl" />
                  </div>

                  {/* Item Label & Emoji under x-axis */}
                  <div className="absolute -bottom-8 flex flex-col items-center">
                    <span className="text-base">{item.emoji}</span>
                    <span className="text-[10px] font-black text-slate-700 whitespace-nowrap">
                      {isEnglish ? item.englishLabel : item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        <div className="pt-5">
          {feedback && (
            <div
              className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
                isSuccess
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-indigo-50 border-indigo-300 text-indigo-900'
              }`}
            >
              {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <BarChart3 className="w-5 h-5 text-indigo-600" />}
              <span>{feedback}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Footer Controls */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={() => initMission()}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEnglish ? 'Reset Bars' : 'Atur Ulang'}</span>
        </button>

        {!isSuccess ? (
          <button
            onClick={handleVerify}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <span>{isEnglish ? 'Check Chart' : 'Periksa Diagram'} 📊</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95 animate-bounce"
          >
            <span>{missionIdx < MISSIONS.length - 1 ? (isEnglish ? 'Next Survey' : 'Survei Berikutnya') : (isEnglish ? 'Statistics Master!' : 'Selesai & Ambil Bintang!')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
