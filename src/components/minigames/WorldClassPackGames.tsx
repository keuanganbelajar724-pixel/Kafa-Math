import React, { useState } from 'react';
import { sound } from '../../services/sound';
import confetti from 'canvas-confetti';
import { RotateCcw, Award, ArrowLeft, Lightbulb, Sparkles, CheckCircle2, Compass, Scale, Shield } from 'lucide-react';

interface GameProps {
  onExit: () => void;
  onRewardXP: (xp: number, coins: number) => void;
}

// ============================================================================
// GAME 65: ALGEBRA BALANCE SCALE LAB (Laboratorium Neraca Aljabar Visual)
// ============================================================================
export const AlgebraBalanceScaleGame: React.FC<GameProps> = ({ onExit, onRewardXP }) => {
  const levels = [
    {
      id: 1,
      formula: 'X + 2 = 6',
      xCount: 1,
      leftWeights: 2,
      rightWeights: 6,
      targetX: 4,
      options: [2, 3, 4, 5],
      hint: 'Kurangkan 2 kelereng dari kedua sisi! X = 6 - 2.',
      story: 'Satu kotak misteri X ditemani 2 kelereng emas seimbang dengan 6 kelereng di sisi kanan.',
    },
    {
      id: 2,
      formula: 'X + 5 = 12',
      xCount: 1,
      leftWeights: 5,
      rightWeights: 12,
      targetX: 7,
      options: [6, 7, 8, 9],
      hint: 'Kurangkan 5 dari kedua sisi neraca: X = 12 - 5.',
      story: 'Kiri: Kotak X + 5 kelereng seimbang dengan 12 kelereng di kanan.',
    },
    {
      id: 3,
      formula: '2X = 8',
      xCount: 2,
      leftWeights: 0,
      rightWeights: 8,
      targetX: 4,
      options: [2, 3, 4, 6],
      hint: 'Dua kotak X bernilai 8 kelereng. Maka 1 kotak X = 8 dibagi 2.',
      story: 'Dua kotak misteri identik 2X seimbang sempurna dengan 8 kelereng.',
    },
    {
      id: 4,
      formula: 'X + 8 = 15',
      xCount: 1,
      leftWeights: 8,
      rightWeights: 15,
      targetX: 7,
      options: [5, 6, 7, 8],
      hint: 'Kedua sisi dikurangi 8: X = 15 - 8.',
      story: 'Neraca aljabar setara jika kedua lengan neraca dikurangi bobot yang sama.',
    },
    {
      id: 5,
      formula: '2X + 2 = 10',
      xCount: 2,
      leftWeights: 2,
      rightWeights: 10,
      targetX: 4,
      options: [3, 4, 5, 6],
      hint: 'Langkah 1: Kurangi 2 dari kedua sisi (2X = 8). Langkah 2: Bagi 2 (X = 4).',
      story: 'Tantangan Aljabar Bertahap: Hilangkan beban tambahan dulu, lalu bagi kotaknya!',
    },
  ];

  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedX, setSelectedX] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const cur = levels[currentLevel];

  const handleSelectOption = (val: number) => {
    if (selectedX !== null || feedback !== null) return;
    setSelectedX(val);

    const isCorrect = val === cur.targetX;
    if (isCorrect) {
      sound.playCorrect();
      sound.playCombo(currentLevel + 1);
      sound.playHaptic('success');
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      setScore((prev) => prev + 120);
      setFeedback({
        isCorrect: true,
        text: `🎉 Luar Biasa! Nilai X = ${val} membuat neraca seimbang sempurna!`,
      });

      setTimeout(() => {
        if (currentLevel + 1 < levels.length) {
          setCurrentLevel((prev) => prev + 1);
          setSelectedX(null);
          setFeedback(null);
          setShowHint(false);
        } else {
          setIsFinished(true);
          sound.playCelebration();
          onRewardXP(65, 35);
        }
      }, 1500);
    } else {
      sound.playIncorrect();
      sound.playHaptic('warning');
      setFeedback({
        isCorrect: false,
        text: `Belum seimbang. Jika X = ${val}, berat kiri tidak sama dengan kanan. Coba lagi!`,
      });
      setTimeout(() => {
        setSelectedX(null);
        setFeedback(null);
      }, 1600);
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentLevel(0);
    setScore(0);
    setSelectedX(null);
    setFeedback(null);
    setShowHint(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 text-center animate-in zoom-in-95">
        <div className="bg-white rounded-3xl p-8 border-2 border-emerald-300 shadow-xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-5xl shadow-inner">
            ⚖️
          </div>
          <div>
            <span className="text-xs font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ALGEBRA MASTER CLEARED
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Hebat! Neraca Aljabar Seimbang Sempurna!
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Kamu berhasil memahami prinsip persamaan matematika: apa yang terjadi di ruas kiri harus setara dengan ruas kanan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold block">Total Skor</span>
              <span className="text-xl font-black text-slate-900">{score}</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-xs text-amber-700 font-bold block">Hadiah XP</span>
              <span className="text-xl font-black text-amber-800">+65 XP</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm cursor-pointer active:scale-95 transition-all"
            >
              Main Lagi
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-white text-sm cursor-pointer shadow-md active:scale-95 transition-all"
            >
              Game Center
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-3 sm:px-4 space-y-4 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-3.5 border border-slate-200 shadow-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <span className="text-xs font-black uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Tantangan {currentLevel + 1} / {levels.length}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{score} Poin</span>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 text-center">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black px-3 py-1 rounded-full uppercase">
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Persamaan Aljabar Linear</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Berapakah Nilai Kotak Misteri <span className="text-indigo-600 underline">X</span>?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
            {cur.story}
          </p>
        </div>

        {/* Visual Balance Scale */}
        <div className="bg-gradient-to-b from-slate-50 to-indigo-50/40 rounded-3xl p-6 border-2 border-indigo-100 relative">
          <div className="text-lg sm:text-xl font-black text-indigo-900 mb-4 bg-white/80 py-1.5 px-4 rounded-full inline-block border border-indigo-200 shadow-2xs">
            {cur.formula}
          </div>

          {/* Scale Structure */}
          <div className="relative max-w-md mx-auto py-6">
            {/* Pivot Center Pole */}
            <div className="w-4 h-24 bg-slate-400 mx-auto rounded-t-md shadow-xs" />
            <div className="w-16 h-3 bg-slate-600 mx-auto rounded-full -mt-0.5 shadow-sm" />

            {/* Horizontal Beam */}
            <div className="absolute top-6 left-4 right-4 h-3 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full shadow-md flex items-center justify-between px-2">
              <div className="w-3 h-3 rounded-full bg-slate-800" />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-200 border-2 border-slate-800" />
              <div className="w-3 h-3 rounded-full bg-slate-800" />
            </div>

            {/* Left Pan (Ruas Kiri) */}
            <div className="absolute top-9 left-2 sm:left-4 w-32 sm:w-36 flex flex-col items-center">
              <div className="w-0.5 h-10 bg-slate-400" />
              <div className="w-full min-h-[60px] bg-white/95 rounded-2xl border-2 border-indigo-300 shadow-md p-2.5 flex flex-wrap items-center justify-center gap-1.5">
                {/* Mystery boxes X */}
                {Array.from({ length: cur.xCount }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md animate-pulse"
                    title="Kotak Misteri X"
                  >
                    X
                  </div>
                ))}
                {/* Left gold weights */}
                {Array.from({ length: cur.leftWeights }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border border-amber-600 flex items-center justify-center text-[10px] font-black text-amber-950 shadow-2xs"
                  >
                    1
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1">Ruas Kiri</span>
            </div>

            {/* Right Pan (Ruas Kanan) */}
            <div className="absolute top-9 right-2 sm:right-4 w-32 sm:w-36 flex flex-col items-center">
              <div className="w-0.5 h-10 bg-slate-400" />
              <div className="w-full min-h-[60px] bg-white/95 rounded-2xl border-2 border-amber-300 shadow-md p-2.5 flex flex-wrap items-center justify-center gap-1.5">
                {Array.from({ length: cur.rightWeights }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border border-amber-600 flex items-center justify-center text-[10px] font-black text-amber-950 shadow-2xs"
                  >
                    1
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1">Ruas Kanan ({cur.rightWeights})</span>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 ${
              feedback.isCorrect
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Options to Choose Value of X */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-black text-slate-700 block uppercase">
            Pilih Nilai 1 Kotak Misteri X:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-md mx-auto">
            {cur.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectOption(opt)}
                disabled={selectedX !== null}
                className="py-3.5 px-4 rounded-2xl bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-500 font-black text-lg text-slate-800 shadow-xs active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="text-xs text-indigo-600 font-bold">X =</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Smart Hint */}
        <div className="pt-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-bold text-slate-500 hover:text-amber-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{showHint ? 'Tutup Petunjuk' : '💡 Butuh Bantuan Neraca?'}</span>
          </button>
          {showHint && (
            <div className="mt-2 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium max-w-md mx-auto text-left animate-in fade-in">
              {cur.hint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// GAME 66: COORDINATE TREASURE ISLAND (Pulau Harta Karun Koordinat Kartesius)
// ============================================================================
export const CoordinateTreasureIslandGame: React.FC<GameProps> = ({ onExit, onRewardXP }) => {
  const quests = [
    {
      id: 1,
      targetX: 3,
      targetY: 2,
      locationName: 'Pohon Kelapa Kembar 🌴',
      story: 'Ahoy! Kompas bajak laut mendeteksi peti perak di dekat Pohon Kelapa.',
      clue: 'Langkah ke kanan pada sumbu X = 3, lalu naik ke atas pada sumbu Y = 2.',
    },
    {
      id: 2,
      targetX: 4,
      targetY: 4,
      locationName: 'Gua Rahasia Tengkorak 💀',
      story: 'Peti emas bajak laut disembunyikan di dalam Gua Tengkorak!',
      clue: 'Cari koordinat X = 4 dan Y = 4.',
    },
    {
      id: 3,
      targetX: 1,
      targetY: 3,
      locationName: 'Mercusuar Pelangi 🗼',
      story: 'Cahaya mercusuar memantul ke koordinat rahasia di pesisir barat.',
      clue: 'Maju X = 1, lalu panjat ke atas Y = 3.',
    },
    {
      id: 4,
      targetX: 5,
      targetY: 1,
      locationName: 'Bangkai Kapal Karam ⚓',
      story: 'Jangkar kapal tua tertancap di pasir emas ujung selatan.',
      clue: 'Sumbu horizontal X = 5 dan sumbu vertikal Y = 1.',
    },
    {
      id: 5,
      targetX: 2,
      targetY: 5,
      locationName: 'Puncak Gunung Zamrud 🏔️',
      story: 'Mahkota raja bajak laut terkubur di puncak bukit utara!',
      clue: 'Koordinat puncak: X = 2 dan Y = 5.',
    },
  ];

  const gridSize = 6; // 0 to 5 for X and Y
  const [currentQuest, setCurrentQuest] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [dugLocation, setDugLocation] = useState<{ x: number; y: number } | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const q = quests[currentQuest];

  const handleDig = (x: number, y: number) => {
    if (feedback !== null) return;
    setDugLocation({ x, y });

    const isCorrect = x === q.targetX && y === q.targetY;
    if (isCorrect) {
      sound.playCorrect();
      sound.playStarGain();
      sound.playCombo(currentQuest + 1);
      sound.playHaptic('success');
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
      setScore((prev) => prev + 150);
      setFeedback({
        isCorrect: true,
        text: `💎 HARTA KARUN DITEMUKAN di (${x}, ${y})! Lokasi: ${q.locationName}!`,
      });

      setTimeout(() => {
        if (currentQuest + 1 < quests.length) {
          setCurrentQuest((prev) => prev + 1);
          setDugLocation(null);
          setFeedback(null);
          setShowHint(false);
        } else {
          setIsFinished(true);
          sound.playCelebration();
          onRewardXP(70, 40);
        }
      }, 1600);
    } else {
      sound.playIncorrect();
      sound.playHaptic('warning');
      const dx = q.targetX - x;
      const dy = q.targetY - y;
      let hintText = `Gali di (${x}, ${y}) kosong! `;
      if (dx > 0) hintText += `Coba geser lebih ke kanan (X tambah ${dx}). `;
      else if (dx < 0) hintText += `Coba geser lebih ke kiri (X kurang ${Math.abs(dx)}). `;
      if (dy > 0) hintText += `Dan naik lebih ke atas (Y tambah ${dy})!`;
      else if (dy < 0) hintText += `Dan turun lebih ke bawah (Y kurang ${Math.abs(dy)})!`;

      setFeedback({
        isCorrect: false,
        text: hintText,
      });

      setTimeout(() => {
        setDugLocation(null);
        setFeedback(null);
      }, 2000);
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentQuest(0);
    setScore(0);
    setDugLocation(null);
    setFeedback(null);
    setIsFinished(false);
    setShowHint(false);
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 text-center animate-in zoom-in-95">
        <div className="bg-white rounded-3xl p-8 border-2 border-amber-300 shadow-xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-5xl shadow-inner">
            🏴‍☠️
          </div>
          <div>
            <span className="text-xs font-black tracking-widest text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              KAPTEN NAVIGATOR KARTESIUS
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Seluruh Peti Emas Pulau Berhasil Digali!
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Kamu telah menguasai sistem koordinat bidang (X horizontal, Y vertikal) layaknya navigator handal tingkat dunia!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-bold block">Total Skor</span>
              <span className="text-xl font-black text-slate-900">{score}</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-xs text-amber-700 font-bold block">Hadiah Emas & XP</span>
              <span className="text-xl font-black text-amber-800">+70 XP</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm cursor-pointer active:scale-95 transition-all"
            >
              Jelajah Lagi
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-white text-sm cursor-pointer shadow-md active:scale-95 transition-all"
            >
              Game Center
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-3 sm:px-4 space-y-4 animate-in fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-3.5 border border-slate-200 shadow-xs">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <span className="text-xs font-black uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Ekspedisi {currentQuest + 1} / {quests.length}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{score} Poin</span>
        </div>
      </div>

      {/* Main Map Arena */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 text-center">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black px-3 py-1 rounded-full uppercase">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Koordinat Kartesius 2D (X, Y)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Gali Peti Harta Karun di Titik ({q.targetX}, {q.targetY})!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
            {q.story}
          </p>
        </div>

        {/* Target Coordinate Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black px-4 py-1.5 rounded-full shadow-xs text-sm">
          <span>Target Koordinat:</span>
          <span className="bg-amber-800/80 px-2.5 py-0.5 rounded-lg text-amber-100 font-mono">
            X = {q.targetX} , Y = {q.targetY}
          </span>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 ${
              feedback.isCorrect
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* 2D Coordinate Grid Island Map */}
        <div className="bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 rounded-3xl p-4 sm:p-6 border-2 border-sky-300 relative max-w-md mx-auto shadow-inner">
          <div className="text-[11px] font-extrabold text-sky-800 mb-2 flex items-center justify-between px-2">
            <span>▲ Sumbu Y (Vertikal: 0 - 5)</span>
            <span>Sumbu X (Horizontal: 0 - 5) ►</span>
          </div>

          {/* Grid rows (from Y = 5 down to 0) */}
          <div className="space-y-1.5">
            {Array.from({ length: gridSize })
              .map((_, yIdx) => gridSize - 1 - yIdx)
              .map((y) => (
                <div key={y} className="flex items-center gap-1.5 justify-center">
                  {/* Y-axis label */}
                  <span className="w-5 text-right font-mono font-bold text-xs text-sky-900 shrink-0">
                    {y}
                  </span>

                  {/* X columns (from X = 0 to 5) */}
                  {Array.from({ length: gridSize }).map((_, x) => {
                    const isTarget = x === q.targetX && y === q.targetY;
                    const isDug = dugLocation?.x === x && dugLocation?.y === y;

                    return (
                      <button
                        key={x}
                        onClick={() => handleDig(x, y)}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-bold text-xs sm:text-sm transition-all transform active:scale-95 cursor-pointer shadow-2xs ${
                          isDug
                            ? isTarget
                              ? 'bg-amber-400 border-amber-600 text-2xl animate-bounce shadow-md'
                              : 'bg-rose-200 border-rose-400 text-rose-800'
                            : 'bg-white/85 hover:bg-amber-100 border-amber-200 text-slate-600 hover:border-amber-400 hover:scale-105'
                        }`}
                        title={`Koordinat (${x}, ${y})`}
                      >
                        {isDug ? (
                          isTarget ? '👑' : '❌'
                        ) : isTarget && feedback?.isCorrect ? (
                          '💎'
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {x},{y}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}

            {/* X-axis labels at bottom */}
            <div className="flex items-center gap-1.5 justify-center pt-1 border-t border-sky-200">
              <span className="w-5 text-right font-mono font-bold text-[10px] text-transparent">Y</span>
              {Array.from({ length: gridSize }).map((_, x) => (
                <span key={x} className="w-10 sm:w-11 text-center font-mono font-black text-xs text-sky-900">
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hint toggle */}
        <div className="pt-1">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-bold text-slate-500 hover:text-amber-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{showHint ? 'Tutup Petunjuk' : '💡 Butuh Petunjuk Kompas?'}</span>
          </button>
          {showHint && (
            <div className="mt-2 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium max-w-md mx-auto text-left animate-in fade-in">
              {q.clue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
