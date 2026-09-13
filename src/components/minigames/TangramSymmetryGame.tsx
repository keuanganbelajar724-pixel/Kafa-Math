import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Trophy, ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, Sparkles, X, Shapes } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface SymmetryPuzzle {
  id: number;
  name: string;
  englishName: string;
  emoji: string;
  gridCols: number; // e.g. 6 (3 left, 3 right)
  gridRows: number; // e.g. 6
  // Left side target cells (row, col) where col < 3
  leftCells: [number, number][];
  description: string;
  englishDescription: string;
  themeColor: string;
}

const PUZZLES: SymmetryPuzzle[] = [
  {
    id: 1,
    name: 'Sayap Kupu-Kupu Cantik',
    englishName: 'Beautiful Butterfly Wings',
    emoji: '🦋',
    gridCols: 6,
    gridRows: 5,
    // Left side active cells (col 0, 1, 2)
    leftCells: [
      [0, 1], [0, 2],
      [1, 0], [1, 1], [1, 2],
      [2, 1], [2, 2],
      [3, 0], [3, 1],
      [4, 1],
    ],
    description: 'Sayap kiri kupu-kupu sudah diwarnai. Sentuh kotak di sayap kanan cermin agar kupu-kupu seimbang sempurna!',
    englishDescription: 'The left wing is colored. Tap the matching squares on the right side of the mirror line!',
    themeColor: 'from-pink-500 to-rose-600',
  },
  {
    id: 2,
    name: 'Robot Sahabat Cerdas',
    englishName: 'Friendly Clever Robot',
    emoji: '🤖',
    gridCols: 6,
    gridRows: 6,
    leftCells: [
      [0, 2],
      [1, 1], [1, 2],
      [2, 0], [2, 1], [2, 2],
      [3, 1], [3, 2],
      [4, 1], [4, 2],
      [5, 1],
    ],
    description: 'Lengkapi tubuh robot! Sentuh kotak di sisi kanan garis simetri agar kedua sisi robot sama persis.',
    englishDescription: 'Complete the robot! Tap the mirrored squares on the right of the symmetry line.',
    themeColor: 'from-indigo-500 to-blue-600',
  },
  {
    id: 3,
    name: 'Istana Kerajaan Megah',
    englishName: 'Majestic Royal Castle',
    emoji: '🏰',
    gridCols: 6,
    gridRows: 6,
    leftCells: [
      [0, 0],
      [1, 0], [1, 2],
      [2, 0], [2, 1], [2, 2],
      [3, 0], [3, 1], [3, 2],
      [4, 0], [4, 1], [4, 2],
      [5, 0], [5, 1], [5, 2],
    ],
    description: 'Bangun menara kanan istana agar cerminan simetris sempurna dengan menara kiri!',
    englishDescription: 'Build the right castle tower to mirror the left side perfectly!',
    themeColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 4,
    name: 'Hati Kasih Sayang',
    englishName: 'Kind Heart Gem',
    emoji: '💖',
    gridCols: 6,
    gridRows: 5,
    leftCells: [
      [0, 1],
      [1, 0], [1, 1], [1, 2],
      [2, 0], [2, 1], [2, 2],
      [3, 1], [3, 2],
      [4, 2],
    ],
    description: 'Buat lambang hati yang simetris! Cerminkan sisi kiri ke sisi kanan garis cermin.',
    englishDescription: 'Create a symmetrical heart! Mirror the left side to the right across the line.',
    themeColor: 'from-rose-500 to-red-600',
  },
];

export const TangramSymmetryGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  // Store user-toggled active cells on the right side
  // Format: "r,c" string
  const [rightActiveCells, setRightActiveCells] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);

  const currentP = PUZZLES[puzzleIdx];
  const halfCols = currentP.gridCols / 2; // 3

  // Required right cells by reflecting leftCells across the vertical axis:
  // if left is at col c (0, 1, or 2), mirror col is (gridCols - 1 - c)
  const targetRightCells = new Set<string>();
  currentP.leftCells.forEach(([r, c]) => {
    const mirrorCol = currentP.gridCols - 1 - c;
    targetRightCells.add(`${r},${mirrorCol}`);
  });

  const initPuzzle = (idx: number = puzzleIdx) => {
    const p = PUZZLES[idx];
    setRightActiveCells(new Set());
    setIsSuccess(false);
    setFeedback('');

    const voice = isEnglish ? p.englishDescription : p.description;
    sound.speak(voice);
  };

  useEffect(() => {
    initPuzzle(puzzleIdx);
  }, [puzzleIdx, isEnglish]);

  // Handle tap on grid cell
  const handleCellClick = (r: number, c: number) => {
    if (isSuccess) return;
    // Left cells are static reference. Only right cells are editable!
    if (c < halfCols) {
      sound.speak(isEnglish ? 'This is the reference side. Tap the right side of the mirror line!' : 'Ini sisi acuan. Sentuh sisi kanan garis cermin ya!');
      return;
    }

    sound.playClick();
    const key = `${r},${c}`;
    const nextSet = new Set(rightActiveCells);
    if (nextSet.has(key)) {
      nextSet.delete(key);
    } else {
      nextSet.add(key);
    }
    setRightActiveCells(nextSet);

    // Check if right side perfectly matches target
    if (nextSet.size === targetRightCells.size) {
      let allMatch = true;
      for (const cell of targetRightCells) {
        if (!nextSet.has(cell)) {
          allMatch = false;
          break;
        }
      }

      if (allMatch) {
        sound.playCorrect();
        sound.playFanfare();
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
        setScore((s) => s + 40);
        setIsSuccess(true);
        const win = isEnglish
          ? `Magnificent! Perfect reflection symmetry! The ${currentP.englishName} is alive! ✨`
          : `Luar biasa! Simetri cermin sempurna! ${currentP.name} berhasil terbentuk seimbang! ✨`;
        setFeedback(win);
        sound.speak(win);
      }
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (puzzleIdx < PUZZLES.length - 1) {
      setPuzzleIdx((p) => p + 1);
    } else {
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90 });
      onComplete(score + 50, 3);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-rose-400 shadow-2xl overflow-hidden flex flex-col">
      {/* 1. Header */}
      <div className={`bg-gradient-to-r ${currentP.themeColor} p-4 text-white flex items-center justify-between shadow-md`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            <Shapes className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isEnglish ? currentP.englishName : currentP.name}
              </h2>
              <span className="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Teka-teki {puzzleIdx + 1}/{PUZZLES.length}
              </span>
            </div>
            <p className="text-xs text-pink-100 font-semibold">
              {isEnglish ? 'Cambridge Line of Symmetry & Mirror Grid' : 'Studio Simetri Lipat & Geometri Sentuh'}
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

      {/* 2. Mission & Guidance */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="bg-pink-50 rounded-2xl p-3.5 border-2 border-pink-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className={`text-3xl sm:text-4xl bg-white p-2 rounded-2xl shadow-xs border border-pink-200 ${isSuccess ? 'animate-bounce' : ''}`}>
              {currentP.emoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-pink-950 uppercase tracking-wide">
                  Garis Cermin Simetri:
                </span>
                <span className="bg-pink-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {rightActiveCells.size}/{targetRightCells.size} Kotak Terpasang
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 leading-snug">
                {isEnglish ? currentP.englishDescription : currentP.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => sound.speak(isEnglish ? currentP.englishDescription : currentP.description)}
            className="p-2 rounded-xl bg-pink-200/80 hover:bg-pink-300 text-pink-900 flex-shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Symmetry Grid Stage with Central Mirror Line */}
        <div className="bg-gradient-to-b from-slate-50 to-pink-50/40 rounded-3xl p-4 sm:p-6 border-2 border-pink-200 flex flex-col items-center justify-center relative select-none">
          {/* Legend indicator above grid */}
          <div className="w-full max-w-sm flex items-center justify-between mb-3 text-xs font-black">
            <span className="text-indigo-600 flex items-center gap-1">
              <span>◀ Sisi Kiri (Acuan)</span>
            </span>
            <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              Garis Cermin 🪞
            </span>
            <span className="text-rose-600 flex items-center gap-1">
              <span>Sisi Kanan (Sentuh) ▶</span>
            </span>
          </div>

          {/* Interactive Pegboard/Grid */}
          <div className="relative inline-block bg-white p-3 rounded-2xl border-2 border-slate-300 shadow-lg">
            {/* The Vertical Dashed Mirror Line */}
            <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-1 border-r-2 border-dashed border-rose-500 z-20 pointer-events-none" />

            <div
              className="grid gap-1.5 sm:gap-2"
              style={{
                gridTemplateColumns: `repeat(${currentP.gridCols}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: currentP.gridRows }).map((_, r) =>
                Array.from({ length: currentP.gridCols }).map((_, c) => {
                  const isLeft = c < halfCols;
                  const isLeftFilled = isLeft && currentP.leftCells.some(([lr, lc]) => lr === r && lc === c);
                  const isRightFilled = !isLeft && rightActiveCells.has(`${r},${c}`);

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all flex items-center justify-center text-lg ${
                        isLeft
                          ? isLeftFilled
                            ? 'bg-indigo-600 text-white shadow-md cursor-default'
                            : 'bg-indigo-50/40 border border-indigo-100 cursor-default'
                          : isRightFilled
                          ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md cursor-pointer scale-105 active:scale-95'
                          : 'bg-rose-50/50 hover:bg-rose-100/80 border border-dashed border-rose-300 cursor-pointer active:scale-95'
                      }`}
                      title={isLeft ? 'Sisi acuan' : 'Sentuh untuk mewarnai cerminan'}
                    >
                      {isLeftFilled && '🔷'}
                      {isRightFilled && '💖'}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Helper hint */}
          <p className="text-[11px] text-slate-400 font-bold mt-3">
            {isEnglish ? 'Notice the distance from each box to the red dashed mirror line is identical!' : 'Perhatikan jarak setiap kotak ke garis cermin merah sama persis!'}
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-pink-50 border-pink-300 text-pink-900'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Sparkles className="w-5 h-5 text-pink-600" />}
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* 4. Footer Controls */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={() => initPuzzle()}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEnglish ? 'Clear Right Side' : 'Hapus Sisi Kanan'}</span>
        </button>

        {!isSuccess ? (
          <div className="text-xs font-bold text-slate-500 italic">
            💡 {isEnglish ? 'Tap on the right side to reflect each box!' : 'Sentuh kotak kanan dengan jarak yang sama dari cermin!'}
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95 animate-bounce"
          >
            <span>{puzzleIdx < PUZZLES.length - 1 ? (isEnglish ? 'Next Figure' : 'Bentuk Berikutnya') : (isEnglish ? 'Symmetry Master!' : 'Selesai & Ambil Bintang!')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
