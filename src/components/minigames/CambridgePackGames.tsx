import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, X, Plus, Minus, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PackGameProps {
  gameId: string;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

// ==========================================
// 1. ABACUS SOROBAN (Sempoa Jepang 5-1 Beads)
// ==========================================
export const AbacusSorobanGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  // 3 Rods: Hundreds, Tens, Ones. Each has upperBead (0 or 1, weight 5) and lowerBeads (0..4, weight 1)
  const [rods, setRods] = useState([
    { upper: 0, lower: 0 }, // Hundreds
    { upper: 0, lower: 0 }, // Tens
    { upper: 0, lower: 0 }, // Ones
  ]);

  const MISSIONS = [
    { target: 14, idDesc: 'Bentuk angka 14 pada sempoa (1 Puluhan, 4 Satuan)', enDesc: 'Set number 14 on the soroban (1 Ten, 4 Ones)' },
    { target: 27, idDesc: 'Bentuk angka 27 (2 Puluhan, manik atas 5 + 2 manik bawah)', enDesc: 'Set number 27 (2 Tens, upper bead 5 + 2 lower beads)' },
    { target: 50, idDesc: 'Bentuk angka 50 (Turunkan manik atas bernilai 5 pada tiang puluhan)', enDesc: 'Set number 50 (Lower the 5-bead on the tens rod)' },
    { target: 135, idDesc: 'Bentuk angka 135 (1 Ratusan, 3 Puluhan, 1 manik lima di satuan)', enDesc: 'Set number 135 (1 Hundred, 3 Tens, 1 five-bead on ones)' },
  ];

  const mission = MISSIONS[missionIdx];
  const currentValue =
    (rods[0].upper * 5 + rods[0].lower) * 100 +
    (rods[1].upper * 5 + rods[1].lower) * 10 +
    (rods[2].upper * 5 + rods[2].lower) * 1;

  useEffect(() => {
    setIsSuccess(false);
    sound.speak(isEnglish ? mission.enDesc : mission.idDesc);
  }, [missionIdx, isEnglish]);

  const toggleUpper = (rodIdx: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = [...rods];
    next[rodIdx].upper = next[rodIdx].upper === 1 ? 0 : 1;
    setRods(next);
    checkWin(next);
  };

  const setLower = (rodIdx: number, count: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = [...rods];
    next[rodIdx].lower = next[rodIdx].lower === count ? count - 1 : count;
    setRods(next);
    checkWin(next);
  };

  const checkWin = (currentRods: typeof rods) => {
    const val =
      (currentRods[0].upper * 5 + currentRods[0].lower) * 100 +
      (currentRods[1].upper * 5 + currentRods[1].lower) * 10 +
      (currentRods[2].upper * 5 + currentRods[2].lower) * 1;

    if (val === mission.target) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 70, spread: 70 });
      setIsSuccess(true);
      setScore((s) => s + 40);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (missionIdx < MISSIONS.length - 1) {
      setRods([{ upper: 0, lower: 0 }, { upper: 0, lower: 0 }, { upper: 0, lower: 0 }]);
      setMissionIdx((m) => m + 1);
    } else {
      onComplete(score + 50, 3);
    }
  };

  const ROD_NAMES = isEnglish ? ['Hundreds (100)', 'Tens (10)', 'Ones (1)'] : ['Ratusan (100)', 'Puluhan (10)', 'Satuan (1)'];

  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🧮</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">
              {isEnglish ? 'Japanese Soroban Abacus Lab' : 'Sempoa Soroban & Manik Ajaib'}
            </h2>
            <p className="text-xs text-amber-100 font-semibold">
              Misi {missionIdx + 1}/{MISSIONS.length} • Target: <span className="underline font-black text-yellow-200">{mission.target}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsEnglish(!isEnglish)} className="px-2.5 py-1 rounded-xl bg-white/20 text-xs font-black">
            {isEnglish ? '🇬🇧 EN' : '🇮🇩 ID'}
          </button>
          <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-bold text-amber-950">{isEnglish ? mission.enDesc : mission.idDesc}</p>
          <button onClick={() => sound.speak(isEnglish ? mission.enDesc : mission.idDesc)} className="p-2 rounded-xl bg-amber-200 text-amber-900">
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Soroban Wooden Frame */}
        <div className="bg-gradient-to-b from-amber-800 to-amber-950 p-4 rounded-3xl border-4 border-amber-900 shadow-xl text-white">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-amber-900/60 p-4 rounded-2xl border-2 border-amber-700/80">
            {rods.map((rod, rIdx) => {
              const rodVal = rod.upper * 5 + rod.lower;
              return (
                <div key={rIdx} className="flex flex-col items-center">
                  <span className="text-[10px] font-black text-amber-200 mb-1">{ROD_NAMES[rIdx]}</span>

                  {/* Upper Deck (Value 5 Bead) */}
                  <div className="w-full bg-amber-950/70 rounded-xl p-2 border border-amber-700 flex flex-col items-center justify-center relative min-h-[50px]">
                    <div className="absolute inset-y-0 w-1 bg-slate-400 -z-0"></div>
                    <button
                      onClick={() => toggleUpper(rIdx)}
                      className={`w-12 h-6 rounded-full border-2 transition-all cursor-pointer font-black text-xs shadow-md z-10 ${
                        rod.upper === 1
                          ? 'bg-amber-400 border-amber-200 text-amber-950 translate-y-2'
                          : 'bg-amber-600 border-amber-500 text-white -translate-y-2'
                      }`}
                    >
                      5
                    </button>
                  </div>

                  {/* Separator Beam with Alignment Dot */}
                  <div className="w-full h-3 bg-amber-700 border-y border-amber-500 my-1.5 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/80 shadow-xs"></div>
                  </div>

                  {/* Lower Deck (4 Lower Beads, Value 1 each) */}
                  <div className="w-full bg-amber-950/70 rounded-xl p-2 border border-amber-700 flex flex-col items-center gap-1 relative min-h-[140px] justify-end">
                    <div className="absolute inset-y-0 w-1 bg-slate-400 -z-0"></div>
                    {[4, 3, 2, 1].map((bNum) => {
                      const isActive = rod.lower >= bNum;
                      return (
                        <button
                          key={bNum}
                          onClick={() => setLower(rIdx, bNum)}
                          className={`w-12 h-5 rounded-full border-2 transition-all cursor-pointer text-[10px] font-black shadow-sm z-10 ${
                            isActive
                              ? 'bg-amber-400 border-amber-200 text-amber-950 -translate-y-1'
                              : 'bg-amber-600 border-amber-500 text-white translate-y-1'
                          }`}
                        >
                          1
                        </button>
                      );
                    })}
                  </div>

                  {/* Digit display */}
                  <div className="mt-2 bg-amber-950 px-3 py-1 rounded-xl border border-amber-500 font-black text-lg text-amber-300">
                    {rodVal}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Reading HUD */}
          <div className="mt-3 flex items-center justify-between px-2">
            <span className="text-xs text-amber-200 font-bold">Total Nilai Sempoa:</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black ${currentValue === mission.target ? 'text-emerald-400 animate-pulse' : 'text-yellow-400'}`}>
                {currentValue}
              </span>
              <span className="text-xs text-amber-300">/ Target {mission.target}</span>
            </div>
          </div>
        </div>

        {isSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-bold text-xs sm:text-sm flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{isEnglish ? `Target ${mission.target} reached perfectly!` : `Hebat! Nilai ${mission.target} terbentuk dengan tepat!`}</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => setRods([{ upper: 0, lower: 0 }, { upper: 0, lower: 0 }, { upper: 0, lower: 0 }])}
          className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        {isSuccess && (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>{missionIdx < MISSIONS.length - 1 ? 'Lanjut Misi' : 'Selesai & Bintang'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. CARROLL DIAGRAM (2x2 Matrix Sorter)
// ==========================================
export const CarrollDiagramGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Quadrants: Q1 (top-left), Q2 (top-right), Q3 (bottom-left), Q4 (bottom-right)
  const [placements, setPlacements] = useState<Record<string, 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'unassigned'>>({});

  const MISSIONS = [
    {
      id: 1,
      title: 'Diagram Carroll: Genap/Ganjil & Nilai > 20',
      enTitle: 'Carroll Diagram: Even/Odd & > 20',
      col1: 'Genap (Even)',
      col2: 'Bukan Genap (Ganjil / Not Even)',
      row1: '> 20 (Lebih dari 20)',
      row2: '≤ 20 (20 atau kurang)',
      cards: [
        { id: 'c1', label: '24', correct: 'Q1' }, // Genap, >20
        { id: 'c2', label: '12', correct: 'Q3' }, // Genap, <=20
        { id: 'c3', label: '27', correct: 'Q2' }, // Ganjil, >20
        { id: 'c4', label: '9', correct: 'Q4' },  // Ganjil, <=20
        { id: 'c5', label: '30', correct: 'Q1' }, // Genap, >20
        { id: 'c6', label: '15', correct: 'Q4' }, // Ganjil, <=20
      ],
    },
    {
      id: 2,
      title: 'Diagram Carroll: Kelipatan 5 & Kelipatan 10',
      enTitle: 'Carroll Diagram: Multiples of 5 & 10',
      col1: 'Kelipatan 10',
      col2: 'Bukan Kelipatan 10',
      row1: 'Kelipatan 5',
      row2: 'Bukan Kelipatan 5',
      cards: [
        { id: 'c1', label: '40', correct: 'Q1' }, // 10 yes, 5 yes
        { id: 'c2', label: '25', correct: 'Q2' }, // 10 no, 5 yes
        { id: 'c3', label: '14', correct: 'Q4' }, // 10 no, 5 no
        { id: 'c4', label: '50', correct: 'Q1' }, // 10 yes, 5 yes
        { id: 'c5', label: '35', correct: 'Q2' }, // 10 no, 5 yes
        { id: 'c6', label: '8', correct: 'Q4' },  // 10 no, 5 no
      ],
    },
  ];

  const mission = MISSIONS[missionIdx];

  const resetMission = (idx = missionIdx) => {
    const initial: Record<string, any> = {};
    MISSIONS[idx].cards.forEach((c) => (initial[c.id] = 'unassigned'));
    setPlacements(initial);
    setSelectedCardId(MISSIONS[idx].cards[0].id);
    setIsSuccess(false);
  };

  useEffect(() => {
    resetMission(missionIdx);
  }, [missionIdx]);

  const placeCard = (quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4') => {
    if (!selectedCardId || isSuccess) return;
    sound.playClick();
    const updated = { ...placements, [selectedCardId]: quadrant };
    setPlacements(updated);

    const nextUnassigned = mission.cards.find((c) => c.id !== selectedCardId && updated[c.id] === 'unassigned');
    if (nextUnassigned) setSelectedCardId(nextUnassigned.id);

    // Validate
    const allPlaced = mission.cards.every((c) => updated[c.id] !== 'unassigned');
    if (allPlaced) {
      const allCorrect = mission.cards.every((c) => updated[c.id] === c.correct);
      if (allCorrect) {
        sound.playCorrect();
        sound.playFanfare();
        confetti({ particleCount: 75, spread: 80 });
        setIsSuccess(true);
        setScore((s) => s + 50);
      } else {
        sound.playWrong();
      }
    }
  };

  const getCardsInQuadrant = (q: string) => mission.cards.filter((c) => placements[c.id] === q);

  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-indigo-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">📋</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">{isEnglish ? mission.enTitle : mission.title}</h2>
            <p className="text-xs text-indigo-100 font-semibold">Klasifikasi 4 Kuadran (Cambridge Carroll Matrix)</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Active Card Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-xs font-black text-slate-600 mr-2">Pilih Kartu:</span>
          {mission.cards.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                sound.playClick();
                setSelectedCardId(c.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-sm border-2 transition-all cursor-pointer ${
                selectedCardId === c.id
                  ? 'bg-amber-400 border-amber-600 text-amber-950 scale-105 shadow-md'
                  : placements[c.id] !== 'unassigned'
                  ? 'bg-slate-200 border-slate-300 text-slate-500'
                  : 'bg-white border-indigo-300 text-indigo-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 2x2 Carroll Table */}
        <div className="grid grid-cols-[100px_1fr_1fr] sm:grid-cols-[130px_1fr_1fr] gap-2 border-2 border-indigo-300 p-3 rounded-2xl bg-indigo-50/50">
          <div></div>
          <div className="bg-blue-600 text-white p-2 rounded-xl text-center text-xs font-black shadow-xs">{mission.col1}</div>
          <div className="bg-purple-600 text-white p-2 rounded-xl text-center text-xs font-black shadow-xs">{mission.col2}</div>

          {/* Row 1 */}
          <div className="bg-emerald-600 text-white p-2 rounded-xl flex items-center justify-center text-xs font-black text-center shadow-xs">
            {mission.row1}
          </div>
          <div
            onClick={() => placeCard('Q1')}
            className="min-h-[80px] bg-white rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-600 p-2 flex flex-wrap gap-1.5 items-center justify-center cursor-pointer transition-colors"
          >
            {getCardsInQuadrant('Q1').map((c) => (
              <span key={c.id} className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg font-black text-xs shadow-xs">
                {c.label}
              </span>
            ))}
          </div>
          <div
            onClick={() => placeCard('Q2')}
            className="min-h-[80px] bg-white rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-600 p-2 flex flex-wrap gap-1.5 items-center justify-center cursor-pointer transition-colors"
          >
            {getCardsInQuadrant('Q2').map((c) => (
              <span key={c.id} className="bg-purple-600 text-white px-2.5 py-1 rounded-lg font-black text-xs shadow-xs">
                {c.label}
              </span>
            ))}
          </div>

          {/* Row 2 */}
          <div className="bg-teal-600 text-white p-2 rounded-xl flex items-center justify-center text-xs font-black text-center shadow-xs">
            {mission.row2}
          </div>
          <div
            onClick={() => placeCard('Q3')}
            className="min-h-[80px] bg-white rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-600 p-2 flex flex-wrap gap-1.5 items-center justify-center cursor-pointer transition-colors"
          >
            {getCardsInQuadrant('Q3').map((c) => (
              <span key={c.id} className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-black text-xs shadow-xs">
                {c.label}
              </span>
            ))}
          </div>
          <div
            onClick={() => placeCard('Q4')}
            className="min-h-[80px] bg-white rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-600 p-2 flex flex-wrap gap-1.5 items-center justify-center cursor-pointer transition-colors"
          >
            {getCardsInQuadrant('Q4').map((c) => (
              <span key={c.id} className="bg-teal-600 text-white px-2.5 py-1 rounded-lg font-black text-xs shadow-xs">
                {c.label}
              </span>
            ))}
          </div>
        </div>

        {isSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-bold text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Luar biasa! Seluruh kartu masuk ke kuadran yang tepat!</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => resetMission()} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
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
// 3. THERMOMETER LAB (Celcius Scale)
// ==========================================
export const ThermometerLabGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [isEnglish, setIsEnglish] = useState(false);
  const [temp, setTemp] = useState(20);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const MISSIONS = [
    { target: 0, title: 'Titik Beku Air (Freezing Point)', enTitle: 'Freezing Point of Water (0°C)', hint: 'Turunkan suhu hingga air membeku menjadi es pada 0°C' },
    { target: 100, title: 'Titik Didih Air (Boiling Point)', enTitle: 'Boiling Point of Water (100°C)', hint: 'Naikkan suhu hingga air mendidih bergolak pada 100°C' },
    { target: 25, title: 'Suhu Ruangan Nyaman', enTitle: 'Room Temperature (25°C)', hint: 'Atur merkuri pada suhu ruang standar 25°C' },
    { target: -5, title: 'Suhu Freezer Es Krim', enTitle: 'Subzero Ice Cream Freezer (-5°C)', hint: 'Turunkan suhu di bawah nol (minus) ke -5°C' },
  ];

  const mission = MISSIONS[missionIdx];

  const adjustTemp = (delta: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = Math.max(-10, Math.min(100, temp + delta));
    setTemp(next);
    if (next === mission.target) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 70, spread: 70 });
      setIsSuccess(true);
      setScore((s) => s + 40);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-rose-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-rose-600 to-red-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🌡️</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">{isEnglish ? mission.enTitle : mission.title}</h2>
            <p className="text-xs text-rose-100 font-semibold">Laboratorium Derajat Celcius (°C)</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-rose-50 rounded-2xl p-3 border border-rose-200 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-bold text-rose-950">{mission.hint}</p>
          <span className="bg-rose-600 text-white font-black px-2.5 py-1 rounded-xl text-xs">
            Target: {mission.target}°C
          </span>
        </div>

        {/* Visual Thermometer */}
        <div className="bg-slate-900 rounded-3xl p-6 flex items-center justify-around text-white">
          <div className="relative w-12 h-64 bg-slate-800 rounded-full border-4 border-slate-600 flex flex-col items-center justify-end p-1">
            {/* Liquid column */}
            <div
              className="w-5 bg-gradient-to-t from-red-600 to-rose-400 rounded-full transition-all duration-300"
              style={{ height: `${Math.max(5, ((temp + 10) / 110) * 100)}%` }}
            ></div>
            {/* Bulb */}
            <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-rose-400 -mb-2 shadow-lg"></div>
          </div>

          <div className="space-y-3">
            <div className="text-center">
              <div className="text-xs text-slate-400 font-bold uppercase">Suhu Saat Ini</div>
              <div className={`text-4xl font-black ${temp === mission.target ? 'text-emerald-400' : 'text-rose-400'}`}>
                {temp}°C
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => adjustTemp(10)}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 font-black text-xs cursor-pointer shadow-xs active:scale-95"
              >
                +10°C
              </button>
              <button
                onClick={() => adjustTemp(-10)}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-black text-xs cursor-pointer shadow-xs active:scale-95"
              >
                -10°C
              </button>
              <button
                onClick={() => adjustTemp(1)}
                className="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 font-black text-xs cursor-pointer shadow-xs active:scale-95"
              >
                +1°C
              </button>
              <button
                onClick={() => adjustTemp(-1)}
                className="px-3 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 font-black text-xs cursor-pointer shadow-xs active:scale-95"
              >
                -1°C
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setTemp(20)} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => {
              sound.playClick();
              if (missionIdx < MISSIONS.length - 1) {
                setTemp(20);
                setIsSuccess(false);
                setMissionIdx((m) => m + 1);
              } else {
                onComplete(score + 50, 3);
              }
            }}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Lanjut Suhu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. COIN MONEY SORTER (Celengan Rupiah)
// ==========================================
export const CoinMoneySorterGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const MISSIONS = [
    { target: 3500, title: 'Beli Roti Bakar', desc: 'Kumpulkan tepat Rp 3.500 ke dalam celengan ayam!' },
    { target: 7800, title: 'Tabungan Alat Tulis', desc: 'Kumpulkan tepat Rp 7.800 menggunakan koin dan uang kertas!' },
    { target: 12500, title: 'Beli Buku Gambar', desc: 'Kumpulkan tepat Rp 12.500 dengan pecahan rupiah!' },
  ];

  const mission = MISSIONS[missionIdx];

  const addMoney = (amt: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = currentTotal + amt;
    setCurrentTotal(next);

    if (next === mission.target) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 80, spread: 75 });
      setIsSuccess(true);
      setScore((s) => s + 40);
    } else if (next > mission.target) {
      sound.playWrong();
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-yellow-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🪙</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">{mission.title}</h2>
            <p className="text-xs text-yellow-100 font-semibold">Celengan Uang Rupiah (Koin & Kertas)</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-bold text-amber-950">{mission.desc}</p>
          <span className="bg-amber-600 text-white font-black px-2.5 py-1 rounded-xl text-xs">
            Target: Rp {mission.target.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Piggy Bank Display */}
        <div className="bg-gradient-to-b from-yellow-50 to-orange-100 rounded-3xl p-6 border-2 border-amber-300 text-center space-y-2">
          <div className="text-5xl animate-bounce">🐖</div>
          <div className="text-xs font-bold text-slate-500">Uang Dalam Celengan:</div>
          <div className={`text-3xl font-black ${currentTotal === mission.target ? 'text-emerald-600' : currentTotal > mission.target ? 'text-rose-600' : 'text-slate-800'}`}>
            Rp {currentTotal.toLocaleString('id-ID')}
          </div>
          {currentTotal > mission.target && (
            <p className="text-xs font-bold text-rose-600">Uang melebihi target! Tekan Reset untuk mengulang.</p>
          )}
        </div>

        {/* Money Buttons Drawer */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {[100, 200, 500, 1000].map((koin) => (
            <button
              key={koin}
              onClick={() => addMoney(koin)}
              className="p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 font-black text-xs text-amber-950 flex flex-col items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <span className="text-lg">🪙</span>
              <span>Rp {koin}</span>
            </button>
          ))}
          {[2000, 5000, 10000].map((kertas) => (
            <button
              key={kertas}
              onClick={() => addMoney(kertas)}
              className="p-2.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-400 font-black text-xs text-emerald-950 flex flex-col items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <span className="text-lg">💵</span>
              <span>Rp {kertas.toLocaleString('id-ID')}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setCurrentTotal(0)} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Kosongkan Celengan</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => {
              sound.playClick();
              if (missionIdx < MISSIONS.length - 1) {
                setCurrentTotal(0);
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
// 5. ISOMETRIC 3D BUILDER (Balok Kubus 3D)
// ==========================================
export const Isometric3DBuilderGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [grid, setGrid] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const MISSIONS = [
    { targetVolume: 6, title: 'Tangga Balok 3D', desc: 'Susun kubus satuan hingga total Volume = 6 kubus satuan!' },
    { targetVolume: 9, title: 'Menara Isometrik', desc: 'Susun kubus satuan hingga total Volume = 9 kubus satuan!' },
  ];

  const mission = MISSIONS[missionIdx];
  const currentVolume = grid.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0);

  const toggleCube = (r: number, c: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = grid.map((row) => [...row]);
    next[r][c] = (next[r][c] + 1) % 4; // 0..3 height
    setGrid(next);

    const nextVol = next.reduce((acc, row) => acc + row.reduce((a, b) => a + b, 0), 0);
    if (nextVol === mission.targetVolume) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 75 });
      setIsSuccess(true);
      setScore((s) => s + 40);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-cyan-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🧊</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">{mission.title}</h2>
            <p className="text-xs text-cyan-100 font-semibold">Studio Balok Isometrik 3D & Volume</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-cyan-50 rounded-2xl p-3 border border-cyan-200 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-bold text-cyan-950">{mission.desc}</p>
          <span className="bg-cyan-600 text-white font-black px-2.5 py-1 rounded-xl text-xs">
            Target Volume: {mission.targetVolume} Kubus
          </span>
        </div>

        {/* 3x3 Grid Floor Plan & Height */}
        <div className="bg-slate-900 rounded-3xl p-6 text-center text-white space-y-3">
          <div className="text-xs font-bold text-slate-400">Sentuh petak untuk menambah tumpukan kubus (0 s/d 3):</div>
          <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
            {grid.map((row, r) =>
              row.map((val, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => toggleCube(r, c)}
                  className={`h-16 rounded-2xl font-black text-lg border-2 transition-all cursor-pointer flex flex-col items-center justify-center shadow-md active:scale-95 ${
                    val === 0
                      ? 'bg-slate-800 border-slate-700 text-slate-500'
                      : val === 1
                      ? 'bg-cyan-600 border-cyan-400 text-white'
                      : val === 2
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-indigo-600 border-indigo-400 text-white'
                  }`}
                >
                  <span>{val > 0 ? `📦 ${val}` : '0'}</span>
                </button>
              ))
            )}
          </div>
          <div className="text-sm font-black text-cyan-300">
            Total Volume Saat Ini: <span className="text-xl text-white">{currentVolume}</span> kubus satuan
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setGrid([[0, 0, 0], [0, 0, 0], [0, 0, 0]])} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => {
              sound.playClick();
              if (missionIdx < MISSIONS.length - 1) {
                setGrid([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
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
