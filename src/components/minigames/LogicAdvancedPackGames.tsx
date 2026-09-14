import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, X, Target, Shapes, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PackGameProps {
  gameId: string;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

// ==========================================
// 16. FRACTION DECIMAL PERCENT (Trio Ekuivalen)
// ==========================================
export const FractionDecimalPercentGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [selectedDec, setSelectedDec] = useState<string | null>(null);
  const [selectedPct, setSelectedPct] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const MISSIONS = [
    { fraction: '1/2', correctDec: '0.5', correctPct: '50%', decChoices: ['0.2', '0.5', '0.75'], pctChoices: ['25%', '50%', '75%'] },
    { fraction: '1/4', correctDec: '0.25', correctPct: '25%', decChoices: ['0.25', '0.4', '0.5'], pctChoices: ['10%', '25%', '40%'] },
    { fraction: '3/4', correctDec: '0.75', correctPct: '75%', decChoices: ['0.34', '0.7', '0.75'], pctChoices: ['34%', '70%', '75%'] },
  ];

  const mission = MISSIONS[missionIdx];

  const handleSelect = (type: 'dec' | 'pct', val: string) => {
    if (isSuccess) return;
    sound.playClick();
    if (type === 'dec') setSelectedDec(val);
    else setSelectedPct(val);

    const d = type === 'dec' ? val : selectedDec;
    const p = type === 'pct' ? val : selectedPct;

    if (d === mission.correctDec && p === mission.correctPct) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 75 });
      setIsSuccess(true);
      setScore((s) => s + 40);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-purple-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🍕</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Trio Pecahan, Desimal & Persen</h2>
            <p className="text-xs text-purple-100 font-semibold">Bentuk Ekuivalen Nilai yang Sama</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-purple-50 rounded-2xl p-3 border border-purple-200">
          <p className="text-xs sm:text-sm font-bold text-purple-950">
            Temukan bentuk Desimal dan Persen yang senilai dengan pecahan <strong>{mission.fraction}</strong>!
          </p>
        </div>

        {/* Big Target Fraction */}
        <div className="bg-slate-900 rounded-3xl p-6 text-center text-white space-y-4">
          <div className="inline-block bg-purple-600 text-white font-black text-4xl px-8 py-3 rounded-2xl border-2 border-purple-400 shadow-lg">
            {mission.fraction}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Decimal choices */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">Pilih Desimal:</span>
              <div className="flex flex-col gap-2">
                {mission.decChoices.map((d) => (
                  <button
                    key={d}
                    onClick={() => handleSelect('dec', d)}
                    className={`py-2 rounded-xl font-black text-sm border-2 cursor-pointer transition-all ${
                      selectedDec === d
                        ? d === mission.correctDec
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : 'bg-rose-500 text-white border-rose-400'
                        : 'bg-slate-800 text-purple-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Percentage choices */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">Pilih Persentase:</span>
              <div className="flex flex-col gap-2">
                {mission.pctChoices.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSelect('pct', p)}
                    className={`py-2 rounded-xl font-black text-sm border-2 cursor-pointer transition-all ${
                      selectedPct === p
                        ? p === mission.correctPct
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : 'bg-rose-500 text-white border-rose-400'
                        : 'bg-slate-800 text-purple-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => { setSelectedDec(null); setSelectedPct(null); }} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => {
              sound.playClick();
              if (missionIdx < MISSIONS.length - 1) {
                setSelectedDec(null);
                setSelectedPct(null);
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
// 17. MIRROR COORDINATES (Kapal Selam Kartesius)
// ==========================================
export const MirrorCoordinatesGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [targetX, setTargetX] = useState(3);
  const [targetY, setTargetY] = useState(2);
  const [userX, setUserX] = useState(0);
  const [userY, setUserY] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const setCoord = (x: number, y: number) => {
    if (isSuccess) return;
    sound.playClick();
    setUserX(x);
    setUserY(y);

    if (x === targetX && y === targetY) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 75 });
      setIsSuccess(true);
      setScore(50);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-teal-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🗺️</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Radar Kapal Selam Kartesius</h2>
            <p className="text-xs text-teal-100 font-semibold">Titik Koordinat (X, Y)</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-teal-50 rounded-2xl p-3 border border-teal-200 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-bold text-teal-950">
            Arahkan kapal selam ke titik koordinat harta karun: <strong>({targetX}, {targetY})</strong>!
          </p>
        </div>

        {/* 5x5 Cartesian Grid (0..4) */}
        <div className="bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center text-white">
          <div className="grid grid-cols-5 gap-2">
            {[4, 3, 2, 1, 0].map((y) =>
              [0, 1, 2, 3, 4].map((x) => {
                const isTarget = x === targetX && y === targetY;
                const isUser = x === userX && y === userY;
                return (
                  <button
                    key={`${x}-${y}`}
                    onClick={() => setCoord(x, y)}
                    className={`w-10 h-10 rounded-xl border text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                      isUser
                        ? 'bg-amber-400 border-amber-300 text-amber-950 scale-110 shadow-lg'
                        : isTarget
                        ? 'bg-teal-700/60 border-teal-400 text-yellow-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {isUser ? '🚢' : isTarget ? '👑' : `${x},${y}`}
                  </button>
                );
              })
            )}
          </div>
          <div className="mt-3 text-xs font-bold text-teal-300">
            Posisi Saat Ini: <span className="text-white text-sm font-black">({userX}, {userY})</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => { setUserX(0); setUserY(0); }} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset ke (0,0)</span>
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
// 18. CONGRUENT SHAPES (Bangun Kongruen)
// ==========================================
export const CongruentShapesGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  // Target shape: Triangle sides 3, 4, 5
  const choices = [
    { id: 'c1', label: 'Segitiga 3, 4, 5 (Diputar)', isCongruent: true },
    { id: 'c2', label: 'Segitiga 3, 3, 3 (Sama Sisi)', isCongruent: false },
    { id: 'c3', label: 'Segitiga 6, 8, 10 (Lebih Besar/Sebangun)', isCongruent: false },
    { id: 'c4', label: 'Segitiga 2, 4, 5 (Beda Sisi)', isCongruent: false },
  ];

  const pickChoice = (id: string, isCong: boolean) => {
    if (isSuccess) return;
    setSelectedId(id);
    if (isCong) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 75 });
      setIsSuccess(true);
      setScore(50);
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-rose-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">📐</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Studio Bangun Kongruen</h2>
            <p className="text-xs text-rose-100 font-semibold">Bentuk & Ukuran Sama Persis (Boleh Diputar)</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-rose-50 rounded-2xl p-3 border border-rose-200">
          <p className="text-xs sm:text-sm font-bold text-rose-950">
            Pilih bangun yang <strong>KONGRUEN</strong> (sama persis bentuk dan panjang ketiga sisinya: 3 cm, 4 cm, 5 cm) dengan bangun acuan!
          </p>
        </div>

        {/* Master Target */}
        <div className="bg-slate-900 rounded-3xl p-6 text-center text-white space-y-2">
          <span className="text-xs text-slate-400 font-bold">Bangun Acuan:</span>
          <div className="inline-block bg-rose-600 text-white px-6 py-2 rounded-2xl font-black text-lg border-2 border-rose-400 shadow-lg">
            🔺 Segitiga Siku-Siku (3 cm, 4 cm, 5 cm)
          </div>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {choices.map((c) => (
            <button
              key={c.id}
              onClick={() => pickChoice(c.id, c.isCongruent)}
              className={`p-4 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer text-left shadow-xs ${
                selectedId === c.id
                  ? c.isCongruent
                    ? 'bg-emerald-500 text-white border-emerald-400 scale-102 shadow-md'
                    : 'bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setSelectedId(null)} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
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
// 19. RATIO RECIPE MIX (Dapur Ramuan Rasio)
// ==========================================
export const RatioRecipeMixGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [waterCups, setWaterCups] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  // Recipe ratio: 1 sirup : 3 air. For 2 sirup -> need 6 air.
  const syrupGiven = 2;
  const targetWater = 6;

  const handleAdjust = (delta: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = Math.max(0, Math.min(12, waterCups + delta));
    setWaterCups(next);
    if (next === targetWater) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 75 });
      setIsSuccess(true);
      setScore(50);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-orange-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🍹</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Dapur Ramuan Rasio Sirup</h2>
            <p className="text-xs text-orange-100 font-semibold">Perbandingan Senilai (Rasio 1 : 3)</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-orange-50 rounded-2xl p-3 border border-orange-200">
          <p className="text-xs sm:text-sm font-bold text-orange-950">
            Resep Rahasia: <strong>1 cangkir sirup : 3 cangkir air</strong>. Jika kamu memasukkan <strong>2 cangkir sirup</strong>, berapa cangkir air yang harus ditambahkan agar rasanya pas?
          </p>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-center text-white space-y-4">
          <div className="flex items-center justify-center gap-8">
            <div className="bg-rose-900/60 p-4 rounded-2xl border-2 border-rose-500">
              <span className="text-xs text-rose-300 font-bold">Sirup Manis</span>
              <div className="text-3xl font-black text-rose-400 mt-1">2 Cangkir 🥤</div>
            </div>
            <div className="text-2xl font-black text-yellow-400">:</div>
            <div className="bg-cyan-900/60 p-4 rounded-2xl border-2 border-cyan-500">
              <span className="text-xs text-cyan-300 font-bold">Cangkir Air</span>
              <div className={`text-3xl font-black mt-1 ${waterCups === targetWater ? 'text-emerald-400 animate-bounce' : 'text-cyan-400'}`}>
                {waterCups} Cangkir 💧
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleAdjust(-1)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl font-black text-sm"
            >
              -1 Cangkir Air
            </button>
            <button
              onClick={() => handleAdjust(1)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-black text-sm"
            >
              +1 Cangkir Air
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setWaterCups(0)} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => onComplete(score + 40, 3)}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Selesai & Bintang!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 20. SUDOKU MINI KIDS (Sudoku 4x4)
// ==========================================
export const SudokuMiniKidsGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  // 4x4 Sudoku grid. Solution:
  // [1, 2, 3, 4]
  // [3, 4, 1, 2]
  // [2, 1, 4, 3]
  // [4, 3, 2, 1]
  const [grid, setGrid] = useState<(number | null)[]>([
    1, null, 3, 4,
    null, 4, 1, null,
    2, null, 4, 3,
    4, 3, null, 1,
  ]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const initialFixed = [0, 2, 3, 5, 6, 8, 10, 11, 12, 13, 15]; // Fixed cells

  const cycleCell = (idx: number) => {
    if (initialFixed.includes(idx) || isSuccess) return;
    sound.playClick();
    const next = [...grid];
    const curr = next[idx] || 0;
    next[idx] = curr >= 4 ? 1 : curr + 1;
    setGrid(next);

    // Validate if complete
    const filled = next.every((v) => v !== null && v > 0);
    if (filled) {
      // Check rows, cols, and 2x2 blocks
      const g = next as number[];
      // Rows
      const r0 = new Set([g[0], g[1], g[2], g[3]]).size === 4;
      const r1 = new Set([g[4], g[5], g[6], g[7]]).size === 4;
      const r2 = new Set([g[8], g[9], g[10], g[11]]).size === 4;
      const r3 = new Set([g[12], g[13], g[14], g[15]]).size === 4;

      // Cols
      const c0 = new Set([g[0], g[4], g[8], g[12]]).size === 4;
      const c1 = new Set([g[1], g[5], g[9], g[13]]).size === 4;
      const c2 = new Set([g[2], g[6], g[10], g[14]]).size === 4;
      const c3 = new Set([g[3], g[7], g[11], g[15]]).size === 4;

      // 2x2 blocks
      const b0 = new Set([g[0], g[1], g[4], g[5]]).size === 4;
      const b1 = new Set([g[2], g[3], g[6], g[7]]).size === 4;
      const b2 = new Set([g[8], g[9], g[12], g[13]]).size === 4;
      const b3 = new Set([g[10], g[11], g[14], g[15]]).size === 4;

      if (r0 && r1 && r2 && r3 && c0 && c1 && c2 && c3 && b0 && b1 && b2 && b3) {
        sound.playCorrect();
        sound.playFanfare();
        confetti({ particleCount: 80, spread: 80 });
        setIsSuccess(true);
        setScore(60);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-indigo-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🧩</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Mini Sudoku 4×4</h2>
            <p className="text-xs text-indigo-100 font-semibold">Angka 1-4 Tidak Boleh Kembar di Baris, Kolom, & Kotak</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-200">
          <p className="text-xs sm:text-sm font-bold text-indigo-950">
            Sentuh kotak bertanda tanya (?) untuk memutar angka 1, 2, 3, atau 4 sampai setiap baris, kolom, dan kotak 2×2 terisi lengkap tanpa angka kembar!
          </p>
        </div>

        {/* 4x4 Sudoku Board */}
        <div className="grid grid-cols-4 gap-2 max-w-[240px] mx-auto bg-slate-900 p-3 rounded-3xl border-4 border-indigo-500">
          {grid.map((val, idx) => {
            const isFixed = initialFixed.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => cycleCell(idx)}
                className={`h-12 rounded-xl font-black text-xl flex items-center justify-center transition-all cursor-pointer ${
                  isFixed
                    ? 'bg-indigo-700 text-white cursor-default'
                    : val
                    ? 'bg-amber-400 text-amber-950 font-black shadow-md'
                    : 'bg-slate-800 text-indigo-300 border-2 border-dashed border-indigo-400'
                }`}
              >
                {val || '?'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => setGrid([1, null, 3, 4, null, 4, 1, null, 2, null, 4, 3, 4, 3, null, 1])}
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
            <span>Master Sudoku Selesai!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
