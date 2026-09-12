import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Sparkles, Trophy, RotateCcw, ArrowRight, Volume2, Globe, CheckCircle2, Pencil, Star, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface MatchPair {
  id: string;
  leftLabel: string;
  leftSub?: string;
  leftVisual?: string; // emoji or visual representation
  rightLabel: string;
  rightSub?: string;
  rightVisual?: string;
}

interface MatchRound {
  id: number;
  title: string;
  englishTitle: string;
  category: string;
  instructions: string;
  englishInstructions: string;
  pairs: MatchPair[];
}

const MATCH_ROUNDS: MatchRound[] = [
  {
    id: 1,
    title: 'Babak 1: Titik Ten-Frame ke Angka',
    englishTitle: 'Round 1: Ten-Frame Dots to Numbers',
    category: 'Kepekaan Bilangan (Number Sense)',
    instructions: 'Tarik garis dari kartu titik di kiri ke lambang bilangan yang tepat di kanan!',
    englishInstructions: 'Draw lines from the dot cards on the left to the matching number on the right!',
    pairs: [
      { id: 'p1', leftLabel: '●●●', leftSub: '3 Titik', leftVisual: '🟣', rightLabel: '3', rightSub: 'Tiga' },
      { id: 'p2', leftLabel: '●●●●●', leftSub: '5 Titik', leftVisual: '🟡', rightLabel: '5', rightSub: 'Lima' },
      { id: 'p3', leftLabel: '●●●●● ●●', leftSub: '7 Titik', leftVisual: '🟢', rightLabel: '7', rightSub: 'Tujuh' },
      { id: 'p4', leftLabel: '●●●●● ●●●●', leftSub: '9 Titik', leftVisual: '🔵', rightLabel: '9', rightSub: 'Sembilan' },
    ],
  },
  {
    id: 2,
    title: 'Babak 2: Pasangan Sahabat 10 (Number Bonds to 10)',
    englishTitle: 'Round 2: Number Bonds to 10',
    category: 'Fakta Berhitung (Mental Math)',
    instructions: 'Tarik garis menghubungkan pasangan angka yang jika dijumlahkan menghasilkan 10!',
    englishInstructions: 'Draw a line to pair the numbers that add up to 10!',
    pairs: [
      { id: 'nb1', leftLabel: '7 + ... = 10', leftSub: 'Butuh berapa?', leftVisual: '🎲', rightLabel: '3', rightSub: '7 + 3 = 10' },
      { id: 'nb2', leftLabel: '4 + ... = 10', leftSub: 'Butuh berapa?', leftVisual: '🎲', rightLabel: '6', rightSub: '4 + 6 = 10' },
      { id: 'nb3', leftLabel: '8 + ... = 10', leftSub: 'Butuh berapa?', leftVisual: '🎲', rightLabel: '2', rightSub: '8 + 2 = 10' },
      { id: 'nb4', leftLabel: '1 + ... = 10', leftSub: 'Butuh berapa?', leftVisual: '🎲', rightLabel: '9', rightSub: '1 + 9 = 10' },
    ],
  },
  {
    id: 3,
    title: 'Babak 3: Gambar Pecahan ke Lambang Bilangan',
    englishTitle: 'Round 3: Visual Fraction to Symbol',
    category: 'Pecahan Visual (Fraction Models)',
    instructions: 'Hubungkan visual potongan kue dengan lambang pecahan yang senilai!',
    englishInstructions: 'Connect the visual fraction slices to their matching numerical fraction!',
    pairs: [
      { id: 'f1', leftLabel: 'Setengah Lingkaran', leftSub: '1 dari 2 potong', leftVisual: '🌓', rightLabel: '1/2', rightSub: 'Satu Perdua' },
      { id: 'f2', leftLabel: 'Seperempat Kue', leftSub: '1 dari 4 potong', leftVisual: '🥧', rightLabel: '1/4', rightSub: 'Satu Perempat' },
      { id: 'f3', leftLabel: 'Tiga Perempat Martabak', leftSub: '3 dari 4 potong', leftVisual: '🍕', rightLabel: '3/4', rightSub: 'Tiga Perempat' },
      { id: 'f4', leftLabel: 'Dua Pertiga Brownies', leftSub: '2 dari 3 potong', leftVisual: '🍫', rightLabel: '2/3', rightSub: 'Dua Pertiga' },
    ],
  },
  {
    id: 4,
    title: 'Babak 4: Bangun Geometri & Benda Nyata',
    englishTitle: 'Round 4: Geometry Shapes & Real Objects',
    category: 'Spasial & Geometri (Shapes in Real Life)',
    instructions: 'Tarik garis dari bentuk bangun ruang/datar ke benda nyata yang sesuai!',
    englishInstructions: 'Connect the 2D/3D shape to the real world object!',
    pairs: [
      { id: 'g1', leftLabel: 'Lingkaran (Circle)', leftSub: 'Bentuk Bulat', leftVisual: '⭕', rightLabel: 'Roda Sepeda', rightSub: 'Bentuk Lingkaran', rightVisual: '🚲' },
      { id: 'g2', leftLabel: 'Kubus (Cube)', leftSub: '6 Sisi Persegi', leftVisual: '🧊', rightLabel: 'Dadu Permainan', rightSub: 'Bentuk Kubus', rightVisual: '🎲' },
      { id: 'g3', leftLabel: 'Kerucut (Cone)', leftSub: 'Alas Lingkaran', leftVisual: '📐', rightLabel: 'Topi Ulang Tahun', rightSub: 'Bentuk Kerucut', rightVisual: '🎉' },
      { id: 'g4', leftLabel: 'Tabung (Cylinder)', leftSub: '2 Lingkaran Sejajar', leftVisual: '🛢️', rightLabel: 'Kaleng Minuman', rightSub: 'Bentuk Tabung', rightVisual: '🥫' },
    ],
  },
  {
    id: 5,
    title: 'Babak 5: Perkalian Sebagai Penjumlahan Berulang',
    englishTitle: 'Round 5: Multiplication as Repeated Addition',
    category: 'Konsep Perkalian (Equal Groups)',
    instructions: 'Tarik garis mencocokkan bentuk perkalian dengan bentuk penjumlahan berulangnya!',
    englishInstructions: 'Connect the multiplication expression to its repeated addition meaning!',
    pairs: [
      { id: 'm1', leftLabel: '3 × 4', leftSub: '3 kelompok isi 4', leftVisual: '✖️', rightLabel: '4 + 4 + 4 = 12', rightSub: 'Jumlah 12' },
      { id: 'm2', leftLabel: '2 × 5', leftSub: '2 kelompok isi 5', leftVisual: '✖️', rightLabel: '5 + 5 = 10', rightSub: 'Jumlah 10' },
      { id: 'm3', leftLabel: '4 × 2', leftSub: '4 kelompok isi 2', leftVisual: '✖️', rightLabel: '2 + 2 + 2 + 2 = 8', rightSub: 'Jumlah 8' },
      { id: 'm4', leftLabel: '5 × 3', leftSub: '5 kelompok isi 3', leftVisual: '✖️', rightLabel: '3 + 3 + 3 + 3 + 3 = 15', rightSub: 'Jumlah 15' },
    ],
  },
  {
    id: 6,
    title: 'Babak 6: Jam Dinding ke Waktu Digital',
    englishTitle: 'Round 6: Analog Clock to Digital Time',
    category: 'Membaca Jam (Time Telling)',
    instructions: 'Tarik garis mencocokkan posisi jarum jam dengan format angka digital!',
    englishInstructions: 'Connect the clock hand description to the digital time format!',
    pairs: [
      { id: 't1', leftLabel: 'Jarum Pendek di 3, Panjang di 12', leftSub: 'Pukul Tiga Tepat', leftVisual: '🕒', rightLabel: '03:00', rightSub: 'Pukul 03.00' },
      { id: 't2', leftLabel: 'Jarum Pendek di 6, Panjang di 6', leftSub: 'Setengah Tujuh', leftVisual: '🕡', rightLabel: '06:30', rightSub: 'Pukul 06.30' },
      { id: 't3', leftLabel: 'Jarum Pendek di 9, Panjang di 12', leftSub: 'Pukul Sembilan', leftVisual: '🕘', rightLabel: '09:00', rightSub: 'Pukul 09.00' },
      { id: 't4', leftLabel: 'Jarum Pendek & Panjang di 12', leftSub: 'Pukul Dua Belas', leftVisual: '🕛', rightLabel: '12:00', rightSub: 'Pukul 12.00' },
    ],
  },
];

export const DrawLineMatchGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [roundIdx, setRoundIdx] = useState<number>(0);
  const [shuffledRight, setShuffledRight] = useState<MatchPair[]>([]);
  const [connections, setConnections] = useState<{ [leftId: string]: string }>({}); // leftId -> rightId
  const [activeDrag, setActiveDrag] = useState<{ fromLeftId: string; currentX: number; currentY: number } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);
  const [isEnglish, setIsEnglish] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftItemRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});
  const rightItemRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

  const currentRound = MATCH_ROUNDS[roundIdx];

  // Initialize and shuffle right column
  const initRound = (idx: number) => {
    const r = MATCH_ROUNDS[idx];
    setConnections({});
    setActiveDrag(null);
    setIsRoundFinished(false);

    // Shuffle right items so they don't align directly
    const shuffled = [...r.pairs].sort(() => Math.random() - 0.5);
    setShuffledRight(shuffled);

    const voiceText = isEnglish ? r.englishInstructions : r.instructions;
    sound.speak(voiceText);
  };

  useEffect(() => {
    initRound(roundIdx);
  }, [roundIdx, isEnglish]);

  // Touch/Mouse Coordinate Helper relative to container
  const getRelativeCoords = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // Get Anchor Dot Center Position
  const getLeftDotPosition = (leftId: string) => {
    const el = leftItemRefs.current[leftId];
    if (!el || !containerRef.current) return { x: 0, y: 0 };
    const containerRect = containerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return {
      x: rect.right - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
    };
  };

  const getRightDotPosition = (rightId: string) => {
    const el = rightItemRefs.current[rightId];
    if (!el || !containerRef.current) return { x: 0, y: 0 };
    const containerRect = containerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
    };
  };

  // Drag start from left item
  const handleStartDrag = (leftId: string, clientX: number, clientY: number) => {
    if (isRoundFinished) return;
    sound.playClick();
    const coords = getRelativeCoords(clientX, clientY);
    setActiveDrag({
      fromLeftId: leftId,
      currentX: coords.x,
      currentY: coords.y,
    });
  };

  // Drag move
  const handleMoveDrag = (clientX: number, clientY: number) => {
    if (!activeDrag) return;
    const coords = getRelativeCoords(clientX, clientY);
    setActiveDrag((prev) => (prev ? { ...prev, currentX: coords.x, currentY: coords.y } : null));
  };

  // Check drop target on Right column
  const handleEndDrag = (clientX: number, clientY: number) => {
    if (!activeDrag) return;

    // Detect if pointer is over any right item
    let targetRightId: string | null = null;
    for (const item of shuffledRight) {
      const el = rightItemRefs.current[item.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (
          clientX >= rect.left - 20 &&
          clientX <= rect.right + 20 &&
          clientY >= rect.top - 15 &&
          clientY <= rect.bottom + 15
        ) {
          targetRightId = item.id;
          break;
        }
      }
    }

    if (targetRightId) {
      // Connect
      if (activeDrag.fromLeftId === targetRightId) {
        // Correct match!
        sound.playCorrect();
        sound.playCoin();
        const updated = { ...connections, [activeDrag.fromLeftId]: targetRightId };
        setConnections(updated);

        // Check if all 4 matched
        if (Object.keys(updated).length === currentRound.pairs.length) {
          sound.playFanfare();
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          setScore((s) => s + 40);
          setIsRoundFinished(true);
          sound.speak(isEnglish ? 'Awesome! All pairs connected perfectly!' : 'Hebat sekali! Semua pasangan terhubung dengan tepat!');
        }
      } else {
        // Incorrect pair
        sound.playRetry();
        sound.speak(isEnglish ? 'Not quite matching. Try another pair!' : 'Kurang tepat. Coba hubungkan ke pasangan yang lain ya!');
      }
    }

    setActiveDrag(null);
  };

  const handleNextRound = () => {
    sound.playClick();
    if (roundIdx < MATCH_ROUNDS.length - 1) {
      setRoundIdx((prev) => prev + 1);
    } else {
      // Complete game
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90 });
      onComplete(score + 50, 3);
    }
  };

  return (
    <div
      className="bg-white rounded-3xl max-w-2xl w-full border-4 border-indigo-400 shadow-2xl overflow-hidden flex flex-col select-none touch-none"
      onMouseMove={(e) => handleMoveDrag(e.clientX, e.clientY)}
      onMouseUp={(e) => handleEndDrag(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        if (e.touches.length > 0) {
          handleMoveDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={(e) => {
        if (e.changedTouches.length > 0) {
          handleEndDrag(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      }}
    >
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
            <Pencil className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isEnglish ? currentRound.englishTitle : currentRound.title}
              </h2>
              <span className="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Babak {roundIdx + 1}/{MATCH_ROUNDS.length}
              </span>
            </div>
            <p className="text-xs text-indigo-100 font-semibold">{currentRound.category}</p>
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

      {/* 2. Instructions Bubble */}
      <div className="px-5 pt-4 pb-2">
        <div className="bg-indigo-50/80 rounded-2xl p-3 border-2 border-indigo-200 flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-950">
            <span className="text-xl">✏️</span>
            <span>{isEnglish ? currentRound.englishInstructions : currentRound.instructions}</span>
          </div>

          <button
            onClick={() => sound.speak(isEnglish ? currentRound.englishInstructions : currentRound.instructions)}
            className="p-1.5 rounded-xl bg-indigo-200/80 hover:bg-indigo-300 text-indigo-900 flex-shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Interactive Line-Matching Drawing Stage */}
      <div ref={containerRef} className="relative p-4 sm:p-6 min-h-[360px] flex items-center justify-between">
        {/* SVG Canvas for Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="correctGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* Render already established correct connections */}
          {Object.entries(connections).map(([leftId, rightId]) => {
            const targetId = rightId as string;
            const start = getLeftDotPosition(leftId);
            const end = getRightDotPosition(targetId);

            // Bezier curve for beautiful organic line
            const dx = (end.x - start.x) * 0.5;
            const pathD = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`;

            return (
              <g key={`${leftId}-${rightId}`}>
                <path
                  d={pathD}
                  stroke="url(#correctGrad)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  className="drop-shadow-md animate-in fade-in"
                />
                {/* Checkmark pin in the middle of line */}
                <circle cx={(start.x + end.x) / 2} cy={(start.y + end.y) / 2} r="10" fill="#059669" />
                <text
                  x={(start.x + end.x) / 2}
                  y={(start.y + end.y) / 2 + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                >
                  ✓
                </text>
              </g>
            );
          })}

          {/* Render currently active dragging line */}
          {activeDrag && (
            <path
              d={`M ${getLeftDotPosition(activeDrag.fromLeftId).x} ${getLeftDotPosition(activeDrag.fromLeftId).y} Q ${
                (getLeftDotPosition(activeDrag.fromLeftId).x + activeDrag.currentX) / 2
              } ${(getLeftDotPosition(activeDrag.fromLeftId).y + activeDrag.currentY) / 2 - 20}, ${activeDrag.currentX} ${activeDrag.currentY}`}
              stroke="url(#activeGrad)"
              strokeWidth="4"
              strokeDasharray="6 4"
              fill="none"
              strokeLinecap="round"
              className="drop-shadow-lg"
            />
          )}
        </svg>

        {/* LEFT COLUMN: Items to connect */}
        <div className="w-[44%] space-y-3 z-20">
          {currentRound.pairs.map((pair) => {
            const isConnected = !!connections[pair.id];
            const isDragging = activeDrag?.fromLeftId === pair.id;

            return (
              <div
                key={pair.id}
                ref={(el) => {
                  leftItemRefs.current[pair.id] = el;
                }}
                onMouseDown={(e) => handleStartDrag(pair.id, e.clientX, e.clientY)}
                onTouchStart={(e) => {
                  if (e.touches.length > 0) {
                    handleStartDrag(pair.id, e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                className={`relative p-3 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing flex items-center justify-between ${
                  isConnected
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                    : isDragging
                    ? 'bg-indigo-100 border-indigo-500 scale-102 shadow-md'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{pair.leftVisual || '🔹'}</span>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm leading-snug">{pair.leftLabel}</h4>
                    {pair.leftSub && <p className="text-[10px] text-slate-500 font-bold">{pair.leftSub}</p>}
                  </div>
                </div>

                {/* Left Connecting Anchor Dot */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isConnected
                      ? 'bg-emerald-500 border-emerald-600 ring-2 ring-emerald-200'
                      : isDragging
                      ? 'bg-indigo-600 border-indigo-700 ring-4 ring-indigo-200 scale-125'
                      : 'bg-white border-slate-400 hover:border-indigo-500'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-white' : 'bg-slate-400'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Hint Label */}
        <div className="hidden sm:flex flex-col items-center justify-center text-[10px] font-black uppercase tracking-wider text-slate-300 pointer-events-none">
          <span>Tarik</span>
          <span className="text-xl">➔</span>
          <span>Garis</span>
        </div>

        {/* RIGHT COLUMN: Target items */}
        <div className="w-[44%] space-y-3 z-20">
          {shuffledRight.map((pair) => {
            const isTargetConnected = Object.values(connections).includes(pair.id);

            return (
              <div
                key={pair.id}
                ref={(el) => {
                  rightItemRefs.current[pair.id] = el;
                }}
                className={`relative p-3 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  isTargetConnected
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 shadow-2xs hover:border-purple-300'
                }`}
              >
                {/* Right Connecting Anchor Dot */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mr-2 ${
                    isTargetConnected
                      ? 'bg-emerald-500 border-emerald-600 ring-2 ring-emerald-200'
                      : 'bg-white border-slate-400 hover:border-purple-500'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isTargetConnected ? 'bg-white' : 'bg-slate-400'}`} />
                </div>

                <div className="flex-1 text-right">
                  <h4 className="font-black text-xs sm:text-sm leading-snug">{pair.rightLabel}</h4>
                  {pair.rightSub && <p className="text-[10px] text-slate-500 font-bold">{pair.rightSub}</p>}
                </div>

                {pair.rightVisual && <span className="text-2xl ml-2">{pair.rightVisual}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Footer Actions & Celebration */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={() => initRound(roundIdx)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEnglish ? 'Reset Lines' : 'Reset Garis'}</span>
        </button>

        <div className="text-xs font-black text-slate-500">
          Terhubung: {Object.keys(connections).length} / {currentRound.pairs.length} Garis
        </div>

        {isRoundFinished ? (
          <button
            onClick={handleNextRound}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95 animate-bounce"
          >
            <span>{roundIdx < MATCH_ROUNDS.length - 1 ? (isEnglish ? 'Next Challenge' : 'Babak Berikutnya') : (isEnglish ? 'Claim Master Reward!' : 'Selesai & Ambil Hadiah!')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-[11px] font-bold text-indigo-600 italic">
            {isEnglish ? 'Touch dot on left & drag line to right' : 'Sentuh titik kiri & tarik garis ke kanan'}
          </div>
        )}
      </div>
    </div>
  );
};
