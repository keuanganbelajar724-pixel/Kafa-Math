import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, X, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PackGameProps {
  gameId: string;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

// ==========================================
// 6. FACTOR TREE LAB (Pohon Faktor Prima)
// ==========================================
export const FactorTreeLabGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  // For number 24: 24 = 2 x 2 x 2 x 3
  const MISSIONS = [
    {
      num: 12,
      factors: [2, 2, 3],
      desc: 'Pecah angka 12 ke dalam faktor prima terkecil: 2 × 2 × 3',
      initialSlots: [null, null, null],
      choices: [2, 3, 5, 2, 4, 3],
    },
    {
      num: 18,
      factors: [2, 3, 3],
      desc: 'Pecah angka 18 ke dalam faktor prima: 2 × 3 × 3',
      initialSlots: [null, null, null],
      choices: [2, 3, 3, 6, 9, 5],
    },
    {
      num: 20,
      factors: [2, 2, 5],
      desc: 'Pecah angka 20 ke dalam faktor prima: 2 × 2 × 5',
      initialSlots: [null, null, null],
      choices: [2, 5, 2, 4, 10, 3],
    },
  ];

  const mission = MISSIONS[missionIdx];
  const [slots, setSlots] = useState<(number | null)[]>(mission.initialSlots);

  useEffect(() => {
    setSlots(mission.initialSlots);
    setIsSuccess(false);
  }, [missionIdx]);

  const addFactor = (val: number) => {
    if (isSuccess) return;
    sound.playClick();
    const firstEmpty = slots.findIndex((s) => s === null);
    if (firstEmpty === -1) return;

    const next = [...slots];
    next[firstEmpty] = val;
    setSlots(next);

    // If full, check product
    if (firstEmpty === slots.length - 1) {
      const prod = next.reduce((a, b) => (a || 1) * (b || 1), 1);
      if (prod === mission.num) {
        sound.playCorrect();
        sound.playFanfare();
        confetti({ particleCount: 75, spread: 80 });
        setIsSuccess(true);
        setScore((s) => s + 40);
      } else {
        sound.playWrong();
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-emerald-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🌳</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Pohon Faktor Prima</h2>
            <p className="text-xs text-emerald-100 font-semibold">Faktorisasi Prima (Angka {mission.num})</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
          <p className="text-xs sm:text-sm font-bold text-emerald-950">{mission.desc}</p>
        </div>

        {/* Tree Visual */}
        <div className="bg-gradient-to-b from-teal-900 to-emerald-950 p-6 rounded-3xl text-center text-white space-y-4">
          <div className="inline-block bg-amber-500 text-amber-950 font-black text-2xl px-6 py-2 rounded-2xl border-2 border-amber-300 shadow-lg">
            {mission.num}
          </div>

          <div className="text-emerald-300 text-xs font-bold">Cabang Faktor Daun Prima (Isi Semua Slot):</div>

          <div className="flex items-center justify-center gap-3">
            {slots.map((s, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`w-14 h-14 rounded-2xl border-3 flex items-center justify-center font-black text-xl transition-all ${
                    s !== null
                      ? 'bg-emerald-500 border-emerald-300 text-white shadow-md'
                      : 'bg-emerald-900/80 border-dashed border-emerald-400 text-emerald-300'
                  }`}
                >
                  {s !== null ? s : '?'}
                </div>
                {idx < slots.length - 1 && <span className="text-xl font-black text-amber-300">×</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Factor Choices */}
        <div className="space-y-2">
          <div className="text-xs font-black text-slate-600">Pilih Bilangan Prima untuk Dikalikan:</div>
          <div className="grid grid-cols-6 gap-2">
            {mission.choices.map((c, idx) => (
              <button
                key={idx}
                onClick={() => addFactor(c)}
                className="py-3 rounded-2xl bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-400 font-black text-lg text-emerald-950 shadow-xs cursor-pointer active:scale-95 transition-transform"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setSlots(mission.initialSlots)} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset Cabang</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => {
              sound.playClick();
              if (missionIdx < MISSIONS.length - 1) setMissionIdx((m) => m + 1);
              else onComplete(score + 50, 3);
            }}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Lanjut Misi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 7. PRIME NUMBER POP (Gelembung Prima)
// ==========================================
export const PrimeNumberPopGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const MISSIONS = [
    {
      title: 'Level 1: Bilangan Prima di Bawah 20',
      desc: 'Pecahkan SEMUA balon bilangan prima (hanya bisa dibagi 1 & dirinya sendiri). Jangan pecahkan bilangan komposit!',
      balloons: [
        { id: 'b1', num: 2, isPrime: true, popped: false },
        { id: 'b2', num: 7, isPrime: true, popped: false },
        { id: 'b3', num: 9, isPrime: false, popped: false }, // 3x3
        { id: 'b4', num: 11, isPrime: true, popped: false },
        { id: 'b5', num: 15, isPrime: false, popped: false }, // 3x5
        { id: 'b6', num: 13, isPrime: true, popped: false },
      ],
    },
    {
      title: 'Level 2: Bilangan Prima s/d 30',
      desc: 'Cari dan pecahkan bilangan prima: 17, 19, 23, 29!',
      balloons: [
        { id: 'b1', num: 17, isPrime: true, popped: false },
        { id: 'b2', num: 21, isPrime: false, popped: false }, // 3x7
        { id: 'b3', num: 19, isPrime: true, popped: false },
        { id: 'b4', num: 25, isPrime: false, popped: false }, // 5x5
        { id: 'b5', num: 23, isPrime: true, popped: false },
        { id: 'b6', num: 27, isPrime: false, popped: false }, // 3x9
      ],
    },
  ];

  const mission = MISSIONS[missionIdx];
  const [balloons, setBalloons] = useState(mission.balloons);

  useEffect(() => {
    setBalloons(mission.balloons);
    setIsSuccess(false);
  }, [missionIdx]);

  const popBalloon = (id: string, isPrime: boolean) => {
    if (isSuccess) return;
    if (isPrime) {
      sound.playCorrect();
      const next = balloons.map((b) => (b.id === id ? { ...b, popped: true } : b));
      setBalloons(next);

      // Check if all primes are popped
      const remainingPrimes = next.filter((b) => b.isPrime && !b.popped);
      if (remainingPrimes.length === 0) {
        sound.playFanfare();
        confetti({ particleCount: 80, spread: 80 });
        setIsSuccess(true);
        setScore((s) => s + 45);
      }
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-pink-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🎈</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">{mission.title}</h2>
            <p className="text-xs text-pink-100 font-semibold">Sentuh & Pecahkan Balon Prima!</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-pink-50 rounded-2xl p-3 border border-pink-200">
          <p className="text-xs sm:text-sm font-bold text-pink-950">{mission.desc}</p>
        </div>

        {/* Balloons Floating Area */}
        <div className="bg-gradient-to-b from-sky-200 via-indigo-100 to-pink-100 rounded-3xl p-6 min-h-[220px] flex flex-wrap items-center justify-center gap-4">
          {balloons.map((b) => {
            if (b.popped) {
              return (
                <div key={b.id} className="w-16 h-20 flex flex-col items-center justify-center text-2xl animate-ping">
                  💥
                </div>
              );
            }
            return (
              <button
                key={b.id}
                onClick={() => popBalloon(b.id, b.isPrime)}
                className="w-16 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-black text-xl shadow-lg border-2 border-white flex flex-col items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-transform"
              >
                <span>{b.num}</span>
                <span className="text-[10px] -mt-1 opacity-70">🎈</span>
              </button>
            );
          })}
        </div>

        {isSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-bold text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Hebat! Semua bilangan prima berhasil kamu temukan dan pecahkan!</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setBalloons(mission.balloons)} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset Balon</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => {
              sound.playClick();
              if (missionIdx < MISSIONS.length - 1) setMissionIdx((m) => m + 1);
              else onComplete(score + 50, 3);
            }}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Lanjut Misi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 8. MAGIC SQUARE PUZZLE (Kotak Ajaib 3x3)
// ==========================================
export const MagicSquarePuzzleGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [grid, setGrid] = useState<(number | null)[]>([
    8, null, 6,
    null, 5, null,
    4, null, 2,
  ]);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  // Target: every row, col, diagonal = 15
  // Solution: [8, 1, 6,  3, 5, 7,  4, 9, 2]
  const availableNums = [1, 3, 7, 9];

  const handleCellClick = (idx: number) => {
    // Only mutable cells
    const mutableIndices = [1, 3, 5, 7];
    if (!mutableIndices.includes(idx) || !selectedNum || isSuccess) return;

    sound.playClick();
    const next = [...grid];
    next[idx] = selectedNum;
    setGrid(next);

    // Validate if complete
    const filled = next.every((v) => v !== null);
    if (filled) {
      const g = next as number[];
      const r1 = g[0] + g[1] + g[2] === 15;
      const r2 = g[3] + g[4] + g[5] === 15;
      const r3 = g[6] + g[7] + g[8] === 15;
      const c1 = g[0] + g[3] + g[6] === 15;
      const c2 = g[1] + g[4] + g[7] === 15;
      const c3 = g[2] + g[5] + g[8] === 15;

      if (r1 && r2 && r3 && c1 && c2 && c3) {
        sound.playCorrect();
        sound.playFanfare();
        confetti({ particleCount: 80, spread: 80 });
        setIsSuccess(true);
        setScore(60);
      } else {
        sound.playWrong();
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-violet-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">✨</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Kotak Ajaib 3×3 (Magic Square)</h2>
            <p className="text-xs text-violet-100 font-semibold">Jumlah Setiap Baris & Kolom Harus = 15!</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-violet-50 rounded-2xl p-3 border border-violet-200">
          <p className="text-xs sm:text-sm font-bold text-violet-950">
            Pilih angka 1, 3, 7, atau 9 di bawah, lalu sentuh kotak tanda tanya (?) agar setiap baris dan kolom berjumlah tepat 15!
          </p>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto bg-slate-900 p-3 rounded-3xl border-4 border-violet-500">
          {grid.map((val, idx) => {
            const isMutable = [1, 3, 5, 7].includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                className={`h-16 rounded-2xl font-black text-2xl flex items-center justify-center transition-all cursor-pointer ${
                  !isMutable
                    ? 'bg-violet-700 text-white cursor-default'
                    : val !== null
                    ? 'bg-amber-400 text-amber-950 font-black shadow-md'
                    : 'bg-slate-800 text-violet-300 border-2 border-dashed border-violet-400'
                }`}
              >
                {val !== null ? val : '?'}
              </button>
            );
          })}
        </div>

        {/* Numbers Palette */}
        <div className="flex items-center justify-center gap-3">
          {availableNums.map((num) => (
            <button
              key={num}
              onClick={() => {
                sound.playClick();
                setSelectedNum(num);
              }}
              className={`w-12 h-12 rounded-2xl font-black text-lg border-2 cursor-pointer transition-all ${
                selectedNum === num
                  ? 'bg-amber-400 border-amber-600 text-amber-950 scale-110 shadow-lg'
                  : 'bg-white border-violet-300 text-violet-900 hover:bg-violet-100'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => setGrid([8, null, 6, null, 5, null, 4, null, 2])}
          className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => onComplete(score + 40, 3)}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Selesai & Ambil Bintang!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 9. ROUNDING MOUNTAIN (Bukit Pembulatan)
// ==========================================
export const RoundingMountainGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cartState, setCartState] = useState<'middle' | 'down' | 'up'>('middle');

  const MISSIONS = [
    { num: 43, lower: 40, upper: 50, correct: 'down', desc: 'Angka 43: Satuannya adalah 3 (kurang dari 5). Apakah meluncur turun ke 40 atau naik ke 50?' },
    { num: 67, lower: 60, upper: 70, correct: 'up', desc: 'Angka 67: Satuannya adalah 7 (5 ke atas). Apakah meluncur ke 60 atau naik ke 70?' },
    { num: 85, lower: 80, upper: 90, correct: 'up', desc: 'Angka 85: Berakhiran 5! Aturan matematika: 5 dibulatkan ke atas!' },
  ];

  const mission = MISSIONS[missionIdx];

  const makeChoice = (choice: 'down' | 'up') => {
    if (isSuccess) return;
    setCartState(choice);
    if (choice === mission.correct) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 75 });
      setIsSuccess(true);
      setScore((s) => s + 40);
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-orange-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🎢</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Bukit Pembulatan Puluhan</h2>
            <p className="text-xs text-orange-100 font-semibold">Aturan Pembulatan Terdekat (0-4 vs 5-9)</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-orange-50 rounded-2xl p-3 border border-orange-200">
          <p className="text-xs sm:text-sm font-bold text-orange-950">{mission.desc}</p>
        </div>

        {/* Mountain Visual Track */}
        <div className="bg-gradient-to-b from-sky-400 to-emerald-600 rounded-3xl p-6 min-h-[220px] relative flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="text-center z-10">
            <div className="inline-block bg-white text-slate-800 px-6 py-2 rounded-2xl font-black text-2xl shadow-md border-2 border-orange-400">
              Kereta Angka: {mission.num}
            </div>
          </div>

          {/* Rollercoaster Track */}
          <div className="flex items-center justify-between z-10 px-4 mt-8">
            <button
              onClick={() => makeChoice('down')}
              className="p-3 bg-amber-100 hover:bg-white text-amber-950 rounded-2xl border-2 border-amber-600 font-black text-base shadow-lg cursor-pointer active:scale-95 transition-transform"
            >
              ⬅️ Turun ke {mission.lower}
            </button>
            <div className="text-4xl animate-bounce">
              {cartState === 'down' ? '🛒💨' : cartState === 'up' ? '💨🛒' : '🛒'}
            </div>
            <button
              onClick={() => makeChoice('up')}
              className="p-3 bg-emerald-100 hover:bg-white text-emerald-950 rounded-2xl border-2 border-emerald-600 font-black text-base shadow-lg cursor-pointer active:scale-95 transition-transform"
            >
              Naik ke {mission.upper} ➡️
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setCartState('middle')} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset Kereta</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => {
              sound.playClick();
              if (missionIdx < MISSIONS.length - 1) {
                setCartState('middle');
                setIsSuccess(false);
                setMissionIdx((m) => m + 1);
              } else {
                onComplete(score + 50, 3);
              }
            }}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Lanjut Misi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 10. DOT PATTERN SEQUENCE (Pola Geometri)
// ==========================================
export const DotPatternSequenceGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const MISSIONS = [
    {
      title: 'Pola Bilangan Persegi (Square Numbers)',
      pattern: [1, 4, 9, 16],
      nextNum: 25,
      formula: '1×1=1, 2×2=4, 3×3=9, 4×4=16, 5×5 = ?',
      choices: [20, 25, 30],
    },
    {
      title: 'Pola Bilangan Segitiga (Triangular Numbers)',
      pattern: [1, 3, 6, 10],
      nextNum: 15,
      formula: '+2, +3, +4, +5... Berapa suku berikutnya setelah 10?',
      choices: [12, 14, 15],
    },
  ];

  const mission = MISSIONS[missionIdx];

  const selectAnswer = (ans: number) => {
    if (isSuccess) return;
    setUserAnswer(ans);
    if (ans === mission.nextNum) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 75 });
      setIsSuccess(true);
      setScore((s) => s + 40);
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-indigo-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🔵</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">{mission.title}</h2>
            <p className="text-xs text-indigo-100 font-semibold">Pola Barisan Bilangan Geometri</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-200">
          <p className="text-xs sm:text-sm font-bold text-indigo-950">{mission.formula}</p>
        </div>

        {/* Dots Representation */}
        <div className="bg-slate-900 rounded-3xl p-6 flex items-center justify-center gap-4 text-white">
          {mission.pattern.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-700 border-2 border-indigo-400 flex items-center justify-center font-black text-lg text-yellow-300 shadow-md">
                {val}
              </div>
              <span className="text-[10px] text-slate-400">Pola {idx + 1}</span>
            </div>
          ))}
          <div className="text-2xl font-black text-yellow-400">➡️</div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500 border-2 border-amber-300 flex items-center justify-center font-black text-2xl text-amber-950 shadow-lg">
            {isSuccess ? mission.nextNum : '?'}
          </div>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-3 gap-3">
          {mission.choices.map((c) => (
            <button
              key={c}
              onClick={() => selectAnswer(c)}
              className={`py-3 rounded-2xl font-black text-lg border-2 cursor-pointer shadow-xs transition-all ${
                userAnswer === c
                  ? c === mission.nextNum
                    ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                    : 'bg-rose-500 text-white border-rose-600'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setUserAnswer(null)} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset Jawaban</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => {
              sound.playClick();
              if (missionIdx < MISSIONS.length - 1) {
                setUserAnswer(null);
                setIsSuccess(false);
                setMissionIdx((m) => m + 1);
              } else {
                onComplete(score + 50, 3);
              }
            }}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Lanjut Misi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
