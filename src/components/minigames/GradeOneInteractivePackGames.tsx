import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../services/sound';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  Star,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Play,
  Volume2,
  Flame,
  ThumbsUp,
} from 'lucide-react';

interface GameProps {
  gameId: string;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

// ============================================================================
// 1. PETERNAKAN HITUNG CERIA & TEMAN 10 (FARM COUNTING & NUMBER BONDS)
// ============================================================================
export const FarmCountingBondsGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      type: 'count',
      animal: '🐔',
      animalName: 'Ayam',
      count: 7,
      question: 'Berapa banyak ayam yang sedang makan di peternakan?',
      options: [5, 6, 7, 8],
      targetBond: 10,
    },
    {
      type: 'bond',
      animal: '🐰',
      animalName: 'Kelinci',
      count: 6,
      needed: 4,
      question: 'Ada 6 kelinci 🐰. Berapa kelinci lagi agar menjadi 10 kelinci (Teman 10)?',
      options: [3, 4, 5, 6],
      targetBond: 10,
    },
    {
      type: 'count',
      animal: '🐮',
      animalName: 'Sapi',
      count: 9,
      question: 'Berapa banyak sapi gemuk di lapangan rumput?',
      options: [7, 8, 9, 10],
      targetBond: 10,
    },
    {
      type: 'bond',
      animal: '🦆',
      animalName: 'Bebek',
      count: 3,
      needed: 7,
      question: 'Ada 3 bebek berenang 🦆. Berapa bebek lagi yang dibutuhkan agar pas 10 ekor?',
      options: [5, 6, 7, 8],
      targetBond: 10,
    },
    {
      type: 'bond',
      animal: '🐑',
      animalName: 'Domba',
      count: 5,
      needed: 5,
      question: 'Ada 5 domba berbulu lebat 🐑. Tambah berapa domba lagi agar menjadi 10?',
      options: [4, 5, 6, 7],
      targetBond: 10,
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;

  const handleTapAnimal = (index: number) => {
    sound.playClick();
    if (tappedIndices.includes(index)) {
      setTappedIndices(tappedIndices.filter((i) => i !== index));
    } else {
      setTappedIndices([...tappedIndices, index]);
    }
  };

  const handleSelectAnswer = (ans: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(ans);

    const isCorrect = current.type === 'count' ? ans === current.count : ans === current.needed;

    if (isCorrect) {
      sound.playCorrect();
      setScore((prev) => prev + 120);
      setFeedback({
        isCorrect: true,
        text: current.type === 'count'
          ? `🎉 Tepat sekali! Ada ${current.count} ekor ${current.animalName}!`
          : `🌟 Hebat! ${current.count} + ${current.needed} = 10! Kamu menguasai Teman Sepuluh!`,
      });
      confetti({ particleCount: 50, spread: 60 });
    } else {
      sound.playIncorrect();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setFeedback({
        isCorrect: false,
        text: current.type === 'count'
          ? `Kurang tepat. Coba hitung lagi satu per satu: ada ${current.count} ekor.`
          : `Belum tepat. ${current.count} ditambah ${current.needed} yang hasilnya 10.`,
      });
    }

    setTimeout(() => {
      if (round < totalRounds && (isCorrect || hearts > 1)) {
        setRound((r) => r + 1);
        setSelectedAnswer(null);
        setFeedback(null);
        setTappedIndices([]);
      } else {
        const finalScore = score + (isCorrect ? 120 : 0);
        const stars = finalScore >= 400 ? 3 : finalScore >= 200 ? 2 : 1;
        onComplete(finalScore, stars);
      }
    }, 1700);
  };

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Ronde {round}/{totalRounds}
        </span>
      </div>

      {/* Game Stage */}
      <div className="bg-gradient-to-b from-emerald-50 via-green-50 to-amber-50 rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-lg space-y-5 text-center relative overflow-hidden">
        {/* Title & Question */}
        <div>
          <span className="bg-emerald-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            {current.type === 'count' ? 'Membilang Benda 1-10' : 'Teman Sepuluh (Number Bonds to 10)'}
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 mt-2">
            {current.question}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {current.type === 'count'
              ? '💡 Tip: Ketuk setiap hewan untuk menghitungnya satu per satu!'
              : `💡 Tip: Ingat pasangan 10! Pasangan dari ${current.count} adalah berapa?`}
          </p>
        </div>

        {/* Animal Pasture Display */}
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 sm:p-6 border border-emerald-200 shadow-inner">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 min-h-[140px]">
            {Array.from({ length: current.count }).map((_, idx) => {
              const isTapped = tappedIndices.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleTapAnimal(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center text-3xl sm:text-4xl shadow-md transition-all transform active:scale-95 cursor-pointer relative ${
                    isTapped
                      ? 'bg-amber-100 border-2 border-amber-400 scale-110 ring-2 ring-amber-300'
                      : 'bg-emerald-50 border-2 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span>{current.animal}</span>
                  {isTapped && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Ten-Frame Visualizer for 'bond' mode */}
          {current.type === 'bond' && (
            <div className="mt-4 pt-3 border-t border-emerald-100">
              <span className="text-xs font-bold text-emerald-800 block mb-2">
                Kotak Sepuluh (Ten-Frame): {current.count} hewan + [ ? ] = 10
              </span>
              <div className="grid grid-cols-5 gap-1.5 max-w-xs mx-auto">
                {Array.from({ length: 10 }).map((_, slotIdx) => {
                  const isFilled = slotIdx < current.count;
                  return (
                    <div
                      key={slotIdx}
                      className={`h-9 rounded-xl flex items-center justify-center text-sm font-black border-2 transition-all ${
                        isFilled
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 text-slate-300 border-dashed border-slate-300'
                      }`}
                    >
                      {isFilled ? current.animal : '?'}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Multiple Choice Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {current.options.map((opt) => {
            const isSelected = selectedAnswer === opt;
            const isTarget = current.type === 'count' ? opt === current.count : opt === current.needed;
            let btnStyle = 'bg-white hover:bg-emerald-50 text-slate-800 border-2 border-slate-200 hover:border-emerald-400';
            if (isSelected) {
              btnStyle = isTarget
                ? 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-md scale-105'
                : 'bg-rose-500 text-white border-2 border-rose-600';
            }
            return (
              <button
                key={opt}
                disabled={selectedAnswer !== null}
                onClick={() => handleSelectAnswer(opt)}
                className={`py-4 rounded-2xl font-black text-xl sm:text-2xl shadow-sm transition-all cursor-pointer active:scale-95 ${btnStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. KERETA BUAH & POLA CERIA (FRUIT TRAIN & SEQUENCE PATTERNS)
// ============================================================================
export const FruitTrainPatternGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      title: 'Pola Buah Berselang (A-B-A-B)',
      train: ['🍎', '🍌', '🍎', '🍌', '🍎', '?'],
      answer: '🍌',
      options: ['🍌', '🍎', '🍇', '🍊'],
      explanation: 'Pola berulang: Apel, Pisang, Apel, Pisang, Apel, maka selanjutnya adalah Pisang 🍌!',
    },
    {
      title: 'Pola Tiga Warna Buah (A-B-C)',
      train: ['🍓', '🍊', '🍇', '🍓', '🍊', '?'],
      answer: '🍇',
      options: ['🍎', '🍇', '🍓', '🍊'],
      explanation: 'Pola berulang tiga buah: Stroberi, Jeruk, Anggur. Setelah Jeruk adalah Anggur 🍇!',
    },
    {
      title: 'Pola Urutan Angka Maju (+1)',
      train: ['1', '2', '3', '4', '?'],
      answer: '5',
      options: ['4', '5', '6', '7'],
      explanation: 'Urutan membilang maju bertambah satu: 1, 2, 3, 4, lalu 5!',
    },
    {
      title: 'Pola Angka Lompat Genap (+2)',
      train: ['2', '4', '6', '8', '?'],
      answer: '10',
      options: ['9', '10', '11', '12'],
      explanation: 'Pola bilangan loncat dua: 2, 4, 6, 8, selanjutnya adalah 10!',
    },
    {
      title: 'Pola Buah Kembar (A-A-B-B)',
      train: ['🍉', '🍉', '🍍', '🍍', '🍉', '?'],
      answer: '🍉',
      options: ['🍉', '🍍', '🍎', '🍌'],
      explanation: 'Dua semangka, dua nanas, satu semangka... pasangannya adalah semangka lagi 🍉!',
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;

  const handleSelect = (choice: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choice);

    const isCorrect = choice === current.answer;
    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 120);
      setFeedback({
        isCorrect: true,
        text: `🚂 Tuut tuut! Benar sekali! ${current.explanation}`,
      });
      confetti({ particleCount: 50, spread: 70 });
    } else {
      sound.playIncorrect();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setFeedback({
        isCorrect: false,
        text: `Belum tepat. ${current.explanation}`,
      });
    }

    setTimeout(() => {
      if (round < totalRounds && (isCorrect || hearts > 1)) {
        setRound((r) => r + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        const finalScore = score + (isCorrect ? 120 : 0);
        const stars = finalScore >= 400 ? 3 : finalScore >= 200 ? 2 : 1;
        onComplete(finalScore, stars);
      }
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Ronde {round}/{totalRounds}
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-gradient-to-b from-sky-50 via-indigo-50 to-blue-50 rounded-3xl p-5 sm:p-7 border-2 border-sky-200 shadow-lg space-y-5 text-center relative overflow-hidden">
        <div>
          <span className="bg-sky-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            {current.title}
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 mt-2">
            Lengkapi Gerbong Kereta yang Hilang!
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Perhatikan pola buah dan angka di gerbong kereta secara berurutan.
          </p>
        </div>

        {/* Train Illustration */}
        <div className="bg-white/90 rounded-2xl p-4 sm:p-6 border border-sky-200 shadow-inner overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-center gap-2 min-w-max mx-auto py-3">
            {/* Locomotive Head */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-500 rounded-2xl border-4 border-amber-600 flex flex-col items-center justify-center text-white shadow-md relative">
              <span className="text-2xl sm:text-3xl">🚂</span>
              <span className="text-[9px] font-black tracking-widest uppercase">LOKO</span>
              {/* Wheels */}
              <div className="absolute -bottom-2 flex gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-amber-300"></div>
                <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-amber-300"></div>
              </div>
            </div>

            {/* Train Wagons */}
            {current.train.map((item, idx) => {
              const isMissing = item === '?';
              return (
                <div key={idx} className="flex items-center">
                  <div className="w-3 h-1 bg-slate-400"></div>
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-3 flex flex-col items-center justify-center text-2xl sm:text-3xl shadow-sm relative transition-all ${
                      isMissing
                        ? selectedAnswer
                          ? selectedAnswer === current.answer
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-700 animate-bounce'
                            : 'bg-rose-100 border-rose-500 text-rose-700'
                          : 'bg-amber-100 border-dashed border-amber-400 text-amber-600 animate-pulse'
                        : 'bg-sky-50 border-sky-300 text-slate-800'
                    }`}
                  >
                    <span>{isMissing ? selectedAnswer || '?' : item}</span>
                    {/* Small Wheels */}
                    <div className="absolute -bottom-2 flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-700 border border-white"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-700 border border-white"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback text */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {current.options.map((opt) => {
            const isChosen = selectedAnswer === opt;
            return (
              <button
                key={opt}
                disabled={selectedAnswer !== null}
                onClick={() => handleSelect(opt)}
                className={`py-4 rounded-2xl font-black text-2xl sm:text-3xl shadow-sm transition-all cursor-pointer active:scale-95 border-2 ${
                  isChosen
                    ? opt === current.answer
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                      : 'bg-rose-500 text-white border-rose-600'
                    : 'bg-white hover:bg-sky-50 text-slate-800 border-slate-200 hover:border-sky-400'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. TIMBANGAN BINTANG: LEBIH BANYAK & LEBIH SEDIKIT (STAR BALANCE COMPARE)
// ============================================================================
export const StarBalanceCompareGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      leftCount: 8,
      rightCount: 5,
      item: '⭐',
      name: 'Bintang',
      expected: 'left', // left > right
      explanation: '8 bintang LEBIH BANYAK daripada 5 bintang (8 > 5).',
    },
    {
      leftCount: 4,
      rightCount: 7,
      item: '🍬',
      name: 'Permen',
      expected: 'right', // left < right
      explanation: '4 permen LEBIH SEDIKIT daripada 7 permen (4 < 7).',
    },
    {
      leftCount: 6,
      rightCount: 6,
      item: '🍎',
      name: 'Apel',
      expected: 'equal', // left == right
      explanation: 'Kedua sisi SAMA BANYAK yaitu masing-masing 6 buah apel (6 = 6).',
    },
    {
      leftCount: 9,
      rightCount: 10,
      item: '🎈',
      name: 'Balon',
      expected: 'right', // 9 < 10
      explanation: '9 balon LEBIH SEDIKIT daripada 10 balon (9 < 10).',
    },
    {
      leftCount: 12,
      rightCount: 8,
      item: '🌸',
      name: 'Bunga',
      expected: 'left', // 12 > 8
      explanation: '12 bunga LEBIH BANYAK daripada 8 bunga (12 > 8).',
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;

  const handleSelect = (choice: 'left' | 'equal' | 'right') => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choice);

    const isCorrect = choice === current.expected;
    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 120);
      setFeedback({
        isCorrect: true,
        text: `✨ Luar biasa! ${current.explanation}`,
      });
      confetti({ particleCount: 50, spread: 60 });
    } else {
      sound.playIncorrect();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setFeedback({
        isCorrect: false,
        text: `Belum tepat. ${current.explanation}`,
      });
    }

    setTimeout(() => {
      if (round < totalRounds && (isCorrect || hearts > 1)) {
        setRound((r) => r + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        const finalScore = score + (isCorrect ? 120 : 0);
        const stars = finalScore >= 400 ? 3 : finalScore >= 200 ? 2 : 1;
        onComplete(finalScore, stars);
      }
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Ronde {round}/{totalRounds}
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 rounded-3xl p-5 sm:p-7 border-2 border-purple-200 shadow-lg space-y-5 text-center relative overflow-hidden">
        <div>
          <span className="bg-purple-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            Perbandingan Kuantitas & Simbol &gt;, &lt;, =
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 mt-2">
            Manakah yang Lebih Banyak atau Lebih Sedikit?
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Bandingkan jumlah benda di piring Kiri dan piring Kanan.
          </p>
        </div>

        {/* Visual Balance Scales */}
        <div className="bg-white/80 rounded-2xl p-5 sm:p-6 border border-purple-200 shadow-inner">
          <div className="grid grid-cols-2 gap-4 items-center">
            {/* Left Plate */}
            <div className="bg-indigo-50/70 rounded-2xl p-4 border-2 border-indigo-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-700 uppercase">Piring Kiri</span>
                <span className="bg-indigo-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                  {current.leftCount}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 min-h-[90px] p-2 bg-white rounded-xl border border-indigo-100">
                {Array.from({ length: current.leftCount }).map((_, idx) => (
                  <span key={idx} className="text-2xl sm:text-3xl animate-in zoom-in-75 duration-150">
                    {current.item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Plate */}
            <div className="bg-pink-50/70 rounded-2xl p-4 border-2 border-pink-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-pink-700 uppercase">Piring Kanan</span>
                <span className="bg-pink-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                  {current.rightCount}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 min-h-[90px] p-2 bg-white rounded-xl border border-pink-100">
                {Array.from({ length: current.rightCount }).map((_, idx) => (
                  <span key={idx} className="text-2xl sm:text-3xl animate-in zoom-in-75 duration-150">
                    {current.item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback banner */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* 3 Interactive Comparison Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            disabled={selectedAnswer !== null}
            onClick={() => handleSelect('left')}
            className={`p-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-1 ${
              selectedAnswer === 'left'
                ? current.expected === 'left'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                  : 'bg-rose-500 text-white border-rose-600'
                : 'bg-white hover:bg-indigo-50 text-indigo-950 border-slate-200 hover:border-indigo-400'
            }`}
          >
            <span className="text-xl">👈</span>
            <span>Kiri Lebih Banyak (&gt;)</span>
          </button>

          <button
            disabled={selectedAnswer !== null}
            onClick={() => handleSelect('equal')}
            className={`p-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-1 ${
              selectedAnswer === 'equal'
                ? current.expected === 'equal'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                  : 'bg-rose-500 text-white border-rose-600'
                : 'bg-white hover:bg-amber-50 text-amber-950 border-slate-200 hover:border-amber-400'
            }`}
          >
            <span className="text-xl">⚖️</span>
            <span>Sama Banyak ( = )</span>
          </button>

          <button
            disabled={selectedAnswer !== null}
            onClick={() => handleSelect('right')}
            className={`p-3.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-1 ${
              selectedAnswer === 'right'
                ? current.expected === 'right'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                  : 'bg-rose-500 text-white border-rose-600'
                : 'bg-white hover:bg-pink-50 text-pink-950 border-slate-200 hover:border-pink-400'
            }`}
          >
            <span className="text-xl">👉</span>
            <span>Kanan Lebih Banyak (&lt;)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. KATAK TERATAI: LOMPAT TAMBAH & KURANG 1-20 (FROG JUMP NUMBERLINE)
// ============================================================================
export const FrogJumpNumberlineGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [currentFrogPos, setCurrentFrogPos] = useState(6);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      start: 5,
      op: '+',
      step: 4,
      target: 9,
      question: 'Katak berada di teratai 5, melompat MAJU 4 langkah (+ 4). Di teratai berapakah katak mendarat?',
      options: [8, 9, 10, 11],
    },
    {
      start: 10,
      op: '-',
      step: 3,
      target: 7,
      question: 'Katak berada di teratai 10, melompat MUNDUR 3 langkah (- 3). Di teratai berapakah katak mendarat?',
      options: [6, 7, 8, 9],
    },
    {
      start: 8,
      op: '+',
      step: 5,
      target: 13,
      question: 'Katak berada di teratai 8, melompat MAJU 5 langkah (+ 5). Berapakah posisi katak?',
      options: [12, 13, 14, 15],
    },
    {
      start: 15,
      op: '-',
      step: 6,
      target: 9,
      question: 'Katak berada di teratai 15, melompat MUNDUR 6 langkah (- 6). Di manakah posisi katak?',
      options: [8, 9, 10, 11],
    },
    {
      start: 7,
      op: '+',
      step: 7,
      target: 14,
      question: 'Katak berada di teratai 7, melompat MAJU 7 langkah (+ 7). Berapakah posisi akhirnya?',
      options: [13, 14, 15, 16],
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;

  const handleSelect = (ans: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(ans);
    setCurrentFrogPos(ans);

    const isCorrect = ans === current.target;
    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 120);
      setFeedback({
        isCorrect: true,
        text: `🐸 Kwek kwek! Tepat sekali! ${current.start} ${current.op} ${current.step} = ${current.target}!`,
      });
      confetti({ particleCount: 50, spread: 60 });
    } else {
      sound.playIncorrect();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setFeedback({
        isCorrect: false,
        text: `Belum tepat. ${current.start} ${current.op} ${current.step} = ${current.target}.`,
      });
    }

    setTimeout(() => {
      if (round < totalRounds && (isCorrect || hearts > 1)) {
        const nextRound = round + 1;
        setRound(nextRound);
        setSelectedAnswer(null);
        setFeedback(null);
        setCurrentFrogPos(ROUNDS[(nextRound - 1) % ROUNDS.length].start);
      } else {
        const finalScore = score + (isCorrect ? 120 : 0);
        const stars = finalScore >= 400 ? 3 : finalScore >= 200 ? 2 : 1;
        onComplete(finalScore, stars);
      }
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Ronde {round}/{totalRounds}
        </span>
      </div>

      {/* Main Game Stage */}
      <div className="bg-gradient-to-b from-teal-50 via-emerald-50 to-cyan-50 rounded-3xl p-5 sm:p-7 border-2 border-teal-200 shadow-lg space-y-5 text-center relative overflow-hidden">
        <div>
          <span className="bg-teal-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            Garis Bilangan Maju & Mundur (1-20)
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 mt-2">
            {current.question}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {current.op === '+' ? 'Maju = bergerak ke kanan (tambah)' : 'Mundur = bergerak ke kiri (kurang)'}
          </p>
        </div>

        {/* Lily Pads Pond 1 - 20 */}
        <div className="bg-cyan-900/10 rounded-2xl p-4 sm:p-6 border border-teal-200 shadow-inner overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[550px] gap-2 py-3 px-2">
            {Array.from({ length: 16 }, (_, i) => i + 1).map((padNum) => {
              const isStart = padNum === current.start;
              const hasFrog = padNum === currentFrogPos;
              const isTarget = selectedAnswer && padNum === current.target;

              return (
                <div key={padNum} className="flex flex-col items-center relative">
                  {/* Frog position indicator */}
                  <div className="h-8 flex items-center justify-center">
                    {hasFrog && (
                      <span className="text-2xl animate-bounce drop-shadow-md">🐸</span>
                    )}
                  </div>

                  {/* Lily Pad Circle */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-black border-2 transition-all shadow-sm ${
                      isStart
                        ? 'bg-amber-400 text-slate-900 border-amber-500 ring-2 ring-amber-300 scale-105'
                        : isTarget
                        ? 'bg-emerald-500 text-white border-emerald-600 scale-110'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}
                  >
                    {padNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {current.options.map((opt) => {
            const isSelected = selectedAnswer === opt;
            const isRight = opt === current.target;
            return (
              <button
                key={opt}
                disabled={selectedAnswer !== null}
                onClick={() => handleSelect(opt)}
                className={`py-4 rounded-2xl font-black text-xl sm:text-2xl shadow-sm transition-all cursor-pointer active:scale-95 border-2 ${
                  isSelected
                    ? isRight
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                      : 'bg-rose-500 text-white border-rose-600'
                    : 'bg-white hover:bg-teal-50 text-slate-800 border-slate-200 hover:border-teal-400'
                }`}
              >
                Teratai {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. TOKO BUAH: PULUHAN & SATUAN (FRUIT STORE PLACE VALUE)
// ============================================================================
export const FruitStorePlaceValueGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      fruit: '🍊',
      fruitName: 'Jeruk Manis',
      tens: 1, // 1 box of 10
      ones: 4, // 4 loose oranges
      total: 14,
      question: 'Berapakah jumlah seluruh jeruk? (1 Keranjang isi 10 jeruk + 4 buah lepas)',
      options: [12, 14, 15, 16],
      tensLabel: '1 Puluhan (10)',
      onesLabel: '4 Satuan (4)',
      explanation: '1 puluhan (10) + 4 satuan (4) = 14 buah jeruk!',
    },
    {
      fruit: '🍎',
      fruitName: 'Apel Fuji',
      tens: 1,
      ones: 7,
      total: 17,
      question: 'Pada 17 buah apel, angka berapakah yang menempati nilai SATUAN?',
      options: [1, 7, 10, 17],
      targetAnswer: 7,
      tensLabel: '1 Puluhan (10)',
      onesLabel: '7 Satuan (7)',
      explanation: 'Pada bilangan 17, angka 1 adalah Puluhan dan angka 7 adalah SATUAN.',
    },
    {
      fruit: '🍓',
      fruitName: 'Stroberi Segar',
      tens: 1,
      ones: 5,
      total: 15,
      question: 'Berapakah jumlah seluruh stroberi? (1 Keranjang isi 10 + 5 buah lepas)',
      options: [13, 15, 17, 18],
      tensLabel: '1 Puluhan (10)',
      onesLabel: '5 Satuan (5)',
      explanation: '10 stroberi dalam keranjang + 5 stroberi lepas = 15 buah!',
    },
    {
      fruit: '🥭',
      fruitName: 'Mangga Harum',
      tens: 1,
      ones: 8,
      total: 18,
      question: 'Bilangan 18 terdiri dari ... Puluhan dan 8 Satuan?',
      options: [1, 2, 8, 10],
      targetAnswer: 1,
      tensLabel: '1 Puluhan (10)',
      onesLabel: '8 Satuan (8)',
      explanation: '18 terdiri dari 1 Puluhan (nilainya 10) dan 8 Satuan (nilainya 8)!',
    },
    {
      fruit: '🍌',
      fruitName: 'Pisang Emas',
      tens: 2,
      ones: 0,
      total: 20,
      question: 'Ada 2 keranjang penuh (masing-masing isi 10 buah pisang). Berapa total pisang?',
      options: [10, 12, 20, 22],
      targetAnswer: 20,
      tensLabel: '2 Puluhan (20)',
      onesLabel: '0 Satuan (0)',
      explanation: '2 keranjang puluhan = 10 + 10 = 20 buah pisang!',
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;
  const targetExpected = current.targetAnswer !== undefined ? current.targetAnswer : current.total;

  const handleSelect = (ans: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(ans);

    const isCorrect = ans === targetExpected;
    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 120);
      setFeedback({
        isCorrect: true,
        text: `🍊 Hore! Benar sekali! ${current.explanation}`,
      });
      confetti({ particleCount: 50, spread: 60 });
    } else {
      sound.playIncorrect();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setFeedback({
        isCorrect: false,
        text: `Belum tepat. ${current.explanation}`,
      });
    }

    setTimeout(() => {
      if (round < totalRounds && (isCorrect || hearts > 1)) {
        setRound((r) => r + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        const finalScore = score + (isCorrect ? 120 : 0);
        const stars = finalScore >= 400 ? 3 : finalScore >= 200 ? 2 : 1;
        onComplete(finalScore, stars);
      }
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Ronde {round}/{totalRounds}
        </span>
      </div>

      {/* Main Game Stage */}
      <div className="bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 rounded-3xl p-5 sm:p-7 border-2 border-orange-200 shadow-lg space-y-5 text-center relative overflow-hidden">
        <div>
          <span className="bg-orange-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            Nilai Tempat: Puluhan & Satuan (11-20)
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 mt-2">
            {current.question}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            1 Keranjang besar selalu berisi tepat 10 buah (1 Puluhan).
          </p>
        </div>

        {/* Visual Fruit Store Shelves */}
        <div className="bg-white/85 rounded-2xl p-4 sm:p-6 border border-orange-200 shadow-inner grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Basket Box (Tens) */}
          <div className="bg-amber-100/70 rounded-2xl p-3 border-2 border-amber-300 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-black text-amber-800 uppercase flex items-center gap-1">
                🧺 Keranjang Puluhan
              </span>
              <span className="bg-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                {current.tens} Keranjang
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1 p-2 bg-white/80 rounded-xl w-full min-h-[90px] border border-amber-200">
              {Array.from({ length: current.tens * 10 }).map((_, i) => (
                <span key={i} className="text-xl sm:text-2xl">
                  {current.fruit}
                </span>
              ))}
            </div>
            <span className="text-[11px] font-bold text-amber-700 mt-2">
              = {current.tens * 10} buah ({current.tens} Puluhan)
            </span>
          </div>

          {/* Loose Ones */}
          <div className="bg-orange-100/70 rounded-2xl p-3 border-2 border-orange-300 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-black text-orange-800 uppercase flex items-center gap-1">
                🍎 Buah Lepas (Satuan)
              </span>
              <span className="bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                {current.ones} Buah
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white/80 rounded-xl w-full min-h-[90px] border border-orange-200">
              {current.ones === 0 ? (
                <span className="text-xs font-bold text-slate-400 italic">Tidak ada buah lepas</span>
              ) : (
                Array.from({ length: current.ones }).map((_, i) => (
                  <span key={i} className="text-2xl sm:text-3xl animate-bounce">
                    {current.fruit}
                  </span>
                ))
              )}
            </div>
            <span className="text-[11px] font-bold text-orange-700 mt-2">
              = {current.ones} buah ({current.ones} Satuan)
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {current.options.map((opt) => {
            const isSelected = selectedAnswer === opt;
            const isRight = opt === targetExpected;
            return (
              <button
                key={opt}
                disabled={selectedAnswer !== null}
                onClick={() => handleSelect(opt)}
                className={`py-4 rounded-2xl font-black text-xl sm:text-2xl shadow-sm transition-all cursor-pointer active:scale-95 border-2 ${
                  isSelected
                    ? isRight
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                      : 'bg-rose-500 text-white border-rose-600'
                    : 'bg-white hover:bg-orange-50 text-slate-800 border-slate-200 hover:border-orange-400'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. DETEKTIF BANGUN DATAR CERIA (SHAPES DETECTIVE QUEST)
// ============================================================================
export const ShapesDetectiveQuestGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      shape: 'Lingkaran 🟡',
      targetShape: 'Lingkaran',
      question: 'Benda di kamar manakah yang memiliki permukaan berbentuk LINGKARAN?',
      options: ['Jam Dinding Bulat', 'Pintu Kamar', 'Buku Cerita', 'Ubin Keramik'],
      correct: 'Jam Dinding Bulat',
      emoji: '⏰',
      explanation: 'Jam dinding bulat berbentuk lingkaran karena sisinya melengkung tanpa sudut.',
    },
    {
      shape: 'Segitiga 🔺',
      targetShape: 'Segitiga',
      question: 'Manakah benda yang permukaannya berbentuk SEGITIGA (memiliki 3 sisi lurus)?',
      options: ['Potongan Pizza', 'Uang Koin Logam', 'Layar HP', 'Papan Tulis'],
      correct: 'Potongan Pizza',
      emoji: '🍕',
      explanation: 'Potongan pizza berbentuk segitiga dengan 3 sisi dan 3 sudut lancip.',
    },
    {
      shape: 'Persegi 🟦',
      targetShape: 'Persegi',
      question: 'Manakah benda yang berbentuk PERSEGI (keempat sisinya sama panjang)?',
      options: ['Papan Catur Kotak', 'Pintu Rumah', 'Penggaris Panjang', 'Roda Sepeda'],
      correct: 'Papan Catur Kotak',
      emoji: '🏁',
      explanation: 'Papan catur berbentuk persegi dengan 4 sisi yang persis sama panjang.',
    },
    {
      shape: 'Persegi Panjang 🟩',
      targetShape: 'Persegi Panjang',
      question: 'Manakah benda di kelas yang berbentuk PERSEGI PANJANG?',
      options: ['Papan Tulis Kelas', 'Koin Rp 500', 'Topi Ulang Tahun', 'Donat Manis'],
      correct: 'Papan Tulis Kelas',
      emoji: '📋',
      explanation: 'Papan tulis kelas berbentuk persegi panjang (2 sisi panjang dan 2 sisi pendek).',
    },
    {
      shape: 'Ciri Bangun Datar ✨',
      targetShape: 'Lingkaran',
      question: 'Bangun datar manakah yang TIDAK MEMILIKI SUDUT sama sekali?',
      options: ['Lingkaran', 'Segitiga', 'Persegi', 'Persegi Panjang'],
      correct: 'Lingkaran',
      emoji: '⭕',
      explanation: 'Lingkaran memiliki garis sisi melengkung mulus dan 0 titik sudut!',
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;

  const handleSelect = (choice: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choice);

    const isCorrect = choice === current.correct;
    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 120);
      setFeedback({
        isCorrect: true,
        text: `🔍 Detektif Hebat! ${current.explanation}`,
      });
      confetti({ particleCount: 50, spread: 60 });
    } else {
      sound.playIncorrect();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setFeedback({
        isCorrect: false,
        text: `Belum tepat. ${current.explanation}`,
      });
    }

    setTimeout(() => {
      if (round < totalRounds && (isCorrect || hearts > 1)) {
        setRound((r) => r + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        const finalScore = score + (isCorrect ? 120 : 0);
        const stars = finalScore >= 400 ? 3 : finalScore >= 200 ? 2 : 1;
        onComplete(finalScore, stars);
      }
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Ronde {round}/{totalRounds}
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-gradient-to-b from-blue-50 via-indigo-50 to-sky-50 rounded-3xl p-5 sm:p-7 border-2 border-blue-200 shadow-lg space-y-5 text-center relative overflow-hidden">
        <div>
          <span className="bg-blue-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            Misi Detektif: {current.shape}
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 mt-2">
            {current.question}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Perhatikan bentuk tepi garis dan sudut pada benda-benda sekitar kita!
          </p>
        </div>

        {/* Detective Card Illustration */}
        <div className="bg-white/80 rounded-2xl p-6 border border-blue-200 shadow-inner flex flex-col items-center justify-center gap-2">
          <span className="text-5xl sm:text-6xl animate-pulse">{current.emoji}</span>
          <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
            Target Bentuk: {current.targetShape}
          </span>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Multiple Choice Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {current.options.map((opt) => {
            const isChosen = selectedAnswer === opt;
            const isRight = opt === current.correct;
            return (
              <button
                key={opt}
                disabled={selectedAnswer !== null}
                onClick={() => handleSelect(opt)}
                className={`p-4 rounded-2xl font-black text-base sm:text-lg shadow-sm transition-all cursor-pointer active:scale-95 border-2 flex items-center justify-center gap-2 ${
                  isChosen
                    ? isRight
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102'
                      : 'bg-rose-500 text-white border-rose-600'
                    : 'bg-white hover:bg-blue-50 text-slate-800 border-slate-200 hover:border-blue-400'
                }`}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 7. JAM DINDING ISTANA KUCING (CAT CASTLE CLOCK)
// ============================================================================
export const CatCastleClockGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      hour: 7,
      activity: 'Kucing Oren bangun tidur & sarapan ikan gurih 🐟',
      question: 'Jarum pendek menunjuk angka 7, jarum panjang menunjuk angka 12. Pukul berapakah Kucing Oren sarapan?',
      options: [6, 7, 8, 9],
      timeStr: '07.00',
    },
    {
      hour: 10,
      activity: 'Kucing Putih bermain bola benang wol di taman 🧶',
      question: 'Jarum pendek menunjuk angka 10, jarum panjang tepat di 12. Pukul berapa Kucing Putih bermain?',
      options: [9, 10, 11, 12],
      timeStr: '10.00',
    },
    {
      hour: 12,
      activity: 'Seluruh kucing berkumpul untuk makan siang bersama 🍲',
      question: 'Kedua jarum jam (panjang & pendek) SAMA-SAMA menunjuk angka 12. Pukul berapakah itu?',
      options: [10, 11, 12, 1],
      timeStr: '12.00',
    },
    {
      hour: 2,
      activity: 'Waktunya tidur siang lelap di sofa istana 💤',
      question: 'Jarum pendek di angka 2, jarum panjang di angka 12. Pukul berapakah waktu tidur siang?',
      options: [1, 2, 3, 4],
      timeStr: '02.00 (Siang)',
    },
    {
      hour: 8,
      activity: 'Malam tiba, kucing minum susu hangat sebelum tidur malam 🥛',
      question: 'Jarum pendek menunjuk angka 8 dan jarum panjang di angka 12. Pukul berapakah itu?',
      options: [7, 8, 9, 10],
      timeStr: '08.00 (Malam / 20.00)',
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;

  const handleSelect = (ans: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(ans);

    const isCorrect = ans === current.hour;
    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 120);
      setFeedback({
        isCorrect: true,
        text: `🐱 Meow! Tepat sekali! Pukul ${current.timeStr} tepat!`,
      });
      confetti({ particleCount: 50, spread: 60 });
    } else {
      sound.playIncorrect();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setFeedback({
        isCorrect: false,
        text: `Belum tepat. Jarum pendek menunjuk jam ${current.hour}. Jadi pukul ${current.hour}.00 tepat.`,
      });
    }

    setTimeout(() => {
      if (round < totalRounds && (isCorrect || hearts > 1)) {
        setRound((r) => r + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        const finalScore = score + (isCorrect ? 120 : 0);
        const stars = finalScore >= 400 ? 3 : finalScore >= 200 ? 2 : 1;
        onComplete(finalScore, stars);
      }
    }, 1800);
  };

  // Clock Hand Angles
  const minuteAngle = 0; // Exactly at 12
  const hourAngle = (current.hour % 12) * 30; // 360 / 12 = 30 deg per hour

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Ronde {round}/{totalRounds}
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 rounded-3xl p-5 sm:p-7 border-2 border-purple-200 shadow-lg space-y-5 text-center relative overflow-hidden">
        <div>
          <span className="bg-purple-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            Membaca Jam Bulat Tepat (.00)
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 mt-2">
            {current.question}
          </h2>
          <p className="text-xs text-purple-700 font-bold mt-1">
            🐾 {current.activity}
          </p>
        </div>

        {/* SVG Analog Clock */}
        <div className="bg-white/80 rounded-2xl p-5 border border-purple-200 shadow-inner flex flex-col items-center justify-center">
          <svg className="w-44 h-44 sm:w-52 sm:h-52 drop-shadow-md" viewBox="0 0 200 200">
            {/* Clock Outer Face */}
            <circle cx="100" cy="100" r="90" fill="#fefce8" stroke="#a855f7" strokeWidth="8" />
            <circle cx="100" cy="100" r="82" fill="#ffffff" stroke="#e9d5ff" strokeWidth="2" />

            {/* Numbers on Face */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
              const angle = (num * 30 - 90) * (Math.PI / 180);
              const x = 100 + 68 * Math.cos(angle);
              const y = 100 + 68 * Math.sin(angle) + 5;
              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  className="font-black text-[13px] fill-slate-700 select-none"
                >
                  {num}
                </text>
              );
            })}

            {/* Hour Hand (Short & Bold) */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="55"
              stroke="#7c3aed"
              strokeWidth="6"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 100 100)`}
            />

            {/* Minute Hand (Long & Slender) */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="32"
              stroke="#e11d48"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 100 100)`}
            />

            {/* Center Pin */}
            <circle cx="100" cy="100" r="6" fill="#4c1d95" />
            <circle cx="100" cy="100" r="2.5" fill="#ffffff" />
          </svg>

          <div className="flex items-center gap-4 mt-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-purple-700">
              <span className="w-3 h-1 bg-purple-600 rounded-full inline-block"></span> Jarum Pendek = Jam ({current.hour})
            </span>
            <span className="flex items-center gap-1 text-rose-600">
              <span className="w-3 h-1 bg-rose-600 rounded-full inline-block"></span> Jarum Panjang = Menit 00 (Angka 12)
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Multiple Choice Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {current.options.map((opt) => {
            const isSelected = selectedAnswer === opt;
            const isRight = opt === current.hour;
            return (
              <button
                key={opt}
                disabled={selectedAnswer !== null}
                onClick={() => handleSelect(opt)}
                className={`py-4 rounded-2xl font-black text-xl sm:text-2xl shadow-sm transition-all cursor-pointer active:scale-95 border-2 ${
                  isSelected
                    ? isRight
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                      : 'bg-rose-500 text-white border-rose-600'
                    : 'bg-white hover:bg-purple-50 text-slate-800 border-slate-200 hover:border-purple-400'
                }`}
              >
                Pukul {opt < 10 ? `0${opt}.00` : `${opt}.00`}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 8. PASAR KOIN CILIK RUPIAH (MINI MARKET COINS)
// ============================================================================
export const MiniMarketCoinsGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selectedCoins, setSelectedCoins] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      item: 'Permen Stroberi 🍬',
      price: 300,
      priceStr: 'Rp 300',
      availableCoins: [100, 100, 100, 200, 500],
      question: 'Beli permen seharga Rp 300. Pilih koin yang pas jumlahnya Rp 300!',
    },
    {
      item: 'Penghapus Lucu ✏️',
      price: 500,
      priceStr: 'Rp 500',
      availableCoins: [200, 200, 100, 500, 1000],
      question: 'Beli penghapus seharga Rp 500. Pilih koin yang pas bernilai Rp 500!',
    },
    {
      item: 'Kue Cokelat Lezat 🍪',
      price: 700,
      priceStr: 'Rp 700',
      availableCoins: [500, 200, 100, 100, 1000],
      question: 'Beli kue cokelat seharga Rp 700. Gabungkan koin sehingga berjumlah Rp 700!',
    },
    {
      item: 'Buku Mewarnai Mini 🎨',
      price: 1000,
      priceStr: 'Rp 1.000',
      availableCoins: [500, 500, 200, 100, 100],
      question: 'Beli buku mewarnai seharga Rp 1.000. Pilih koin yang tepat bernilai Rp 1.000!',
    },
    {
      item: 'Pensil Warna Ajaib 🖍️',
      price: 1200,
      priceStr: 'Rp 1.200',
      availableCoins: [1000, 200, 500, 100, 100],
      question: 'Beli pensil seharga Rp 1.200. Pilih koin yang pas senilai Rp 1.200!',
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;

  const totalCurrentSelected = selectedCoins.reduce((sum, coinIdx) => {
    return sum + current.availableCoins[coinIdx];
  }, 0);

  const handleToggleCoin = (idx: number) => {
    sound.playClick();
    if (selectedCoins.includes(idx)) {
      setSelectedCoins(selectedCoins.filter((i) => i !== idx));
    } else {
      setSelectedCoins([...selectedCoins, idx]);
    }
  };

  const handlePay = () => {
    const isCorrect = totalCurrentSelected === current.price;
    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 120);
      setFeedback({
        isCorrect: true,
        text: `💰 Kring kring! Pembayaran pas sekali: Rp ${totalCurrentSelected.toLocaleString('id-ID')}!`,
      });
      confetti({ particleCount: 50, spread: 60 });
    } else {
      sound.playIncorrect();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setFeedback({
        isCorrect: false,
        text: `Uangmu Rp ${totalCurrentSelected.toLocaleString('id-ID')}, sedangkan harga barang ${current.priceStr}. Coba sesuaikan lagi koinmu!`,
      });
    }

    setTimeout(() => {
      if (round < totalRounds && (isCorrect || hearts > 1)) {
        if (isCorrect) {
          setRound((r) => r + 1);
          setSelectedCoins([]);
          setFeedback(null);
        } else {
          setFeedback(null);
        }
      } else {
        const finalScore = score + (isCorrect ? 120 : 0);
        const stars = finalScore >= 400 ? 3 : finalScore >= 200 ? 2 : 1;
        onComplete(finalScore, stars);
      }
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Ronde {round}/{totalRounds}
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-gradient-to-b from-emerald-50 via-teal-50 to-amber-50 rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-lg space-y-5 text-center relative overflow-hidden">
        <div>
          <span className="bg-emerald-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            Mengenal Pecahan Koin Rupiah
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 mt-2">
            {current.question}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Ketuk koin untuk memilih dan memasukkannya ke kasir!
          </p>
        </div>

        {/* Item & Price Tag */}
        <div className="bg-white/85 rounded-2xl p-4 border border-emerald-200 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{current.item.split(' ')[2] || '🍬'}</span>
            <div className="text-left">
              <span className="text-sm font-black text-slate-800 block">{current.item}</span>
              <span className="text-xs text-slate-500">Harga Barang:</span>
            </div>
          </div>
          <div className="bg-emerald-600 text-white font-black text-xl px-4 py-2 rounded-2xl shadow-sm">
            {current.priceStr}
          </div>
        </div>

        {/* Coin Selection Tray */}
        <div className="space-y-2">
          <span className="text-xs font-black text-slate-600 block">
            Dompet Koin Kamu (Ketuk untuk Memilih):
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {current.availableCoins.map((val, idx) => {
              const isSelected = selectedCoins.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleToggleCoin(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center border-4 transition-all transform active:scale-95 cursor-pointer shadow-md ${
                    isSelected
                      ? 'bg-amber-400 border-amber-600 text-amber-950 scale-110 ring-4 ring-amber-300'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold">Rp</span>
                  <span className="text-xs sm:text-sm font-black">{val}</span>
                  {isSelected && (
                    <span className="text-[9px] font-black text-amber-900 bg-amber-200 px-1.5 rounded-full">
                      PILIH
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Total Selected Counter & Pay Button */}
        <div className="bg-white/90 rounded-2xl p-3 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-xs text-slate-500 font-bold block">Total Koin Dipilih:</span>
            <span
              className={`text-xl font-black ${
                totalCurrentSelected === current.price
                  ? 'text-emerald-600'
                  : totalCurrentSelected > current.price
                  ? 'text-rose-600'
                  : 'text-slate-800'
              }`}
            >
              Rp {totalCurrentSelected.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={handlePay}
            disabled={selectedCoins.length === 0}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-95 ${
              totalCurrentSelected === current.price
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300 animate-pulse'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            Bayar ke Kasir 🛒
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 11. PESTA PIZZA PECAHAN CERIA (PIZZA FRACTION PARTY)
// ============================================================================
export const PizzaFractionPartyGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [selectedSlices, setSelectedSlices] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      guest: 'Kelinci Ceria',
      guestIcon: '🐰',
      totalSlices: 4,
      targetNumerator: 1,
      fractionLabel: '1/4 (Satu per Empat)',
      foodType: 'Pizza Keju Jagung 🌽',
      request: 'Hai! Tolong berikan aku 1 potong dari 4 potongan pizza (1/4 bagian)!',
      explanation: '1 potong terpilih dari total 4 potongan yang sama besar adalah 1/4.',
    },
    {
      guest: 'Kucing Belang',
      guestIcon: '🐱',
      totalSlices: 3,
      targetNumerator: 2,
      fractionLabel: '2/3 (Dua per Tiga)',
      foodType: 'Kue Pai Stroberi 🍓',
      request: 'Meow! Aku ingin 2 potong dari 3 potongan kue pai (2/3 bagian)!',
      explanation: '2 potong terpilih dari total 3 potongan sama besar adalah 2/3 bagian.',
    },
    {
      guest: 'Beruang Madu',
      guestIcon: '🐻',
      totalSlices: 2,
      targetNumerator: 1,
      fractionLabel: '1/2 (Setengah / Separuh)',
      foodType: 'Pizza Madu Roti Panggang 🍯',
      request: 'Halo kawan! Aku ingin separuh atau setengah (1/2 bagian) dari pizza ini!',
      explanation: '1 potong terpilih dari total 2 belahan sama besar adalah 1/2 (setengah).',
    },
    {
      guest: 'Rubah Cerdik',
      guestIcon: '🦊',
      totalSlices: 4,
      targetNumerator: 3,
      fractionLabel: '3/4 (Tiga per Empat)',
      foodType: 'Pizza Jamur Super 🍄',
      request: 'Aku sangat lapar! Berikan aku 3 potong dari 4 potongan pizza (3/4 bagian)!',
      explanation: '3 potong terpilih dari total 4 potongan sama besar adalah 3/4 bagian.',
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;

  React.useEffect(() => {
    setSelectedSlices([]);
    setFeedback(null);
  }, [round]);

  const handleToggleSlice = (index: number) => {
    sound.playPop();
    setSelectedSlices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSpeak = () => {
    sound.speak(`${current.guest} berkata: ${current.request}`);
  };

  const handleServe = () => {
    if (selectedSlices.length === 0) return;

    const isCorrect = selectedSlices.length === current.targetNumerator;
    if (isCorrect) {
      sound.playCelebration();
      const bonusStreak = (streak + 1) * 25;
      setScore((s) => s + 130 + bonusStreak);
      setStreak((st) => st + 1);
      setFeedback({
        isCorrect: true,
        text: `🎉 Yummy! ${current.guest} senang sekali menerima ${current.fractionLabel}! ${current.explanation} (+${130 + bonusStreak} Poin)`,
      });
      confetti({ particleCount: 60, spread: 70 });
    } else {
      sound.playIncorrect();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: `Kurang pas! Kamu memilih ${selectedSlices.length} potong, padahal diminta ${current.targetNumerator} potong (${current.fractionLabel}).`,
      });
    }

    setTimeout(() => {
      if (round < totalRounds && (isCorrect || hearts > 1)) {
        setRound((r) => r + 1);
      } else {
        const finalScore = score + (isCorrect ? 130 : 0);
        const stars = finalScore >= 400 ? 3 : finalScore >= 240 ? 2 : 1;
        onComplete(finalScore, stars);
      }
    }, 2000);
  };

  // Helper to generate SVG pie slices
  const renderSvgSlices = () => {
    const cx = 100;
    const cy = 100;
    const r = 85;
    const total = current.totalSlices;

    return Array.from({ length: total }).map((_, i) => {
      const startAngle = (i * (360 / total) - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * (360 / total) - 90) * (Math.PI / 180);
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      const isSelected = selectedSlices.includes(i);
      const d = total === 1
        ? `M ${cx},${cy} m -${r},0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
        : `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 0,1 ${x2},${y2} Z`;

      // Midpoint for topping icon
      const midAngle = ((i + 0.5) * (360 / total) - 90) * (Math.PI / 180);
      const mx = cx + (r * 0.58) * Math.cos(midAngle);
      const my = cy + (r * 0.58) * Math.sin(midAngle);

      return (
        <g
          key={i}
          onClick={() => handleToggleSlice(i)}
          className="cursor-pointer transition-transform duration-200 hover:opacity-90 active:scale-98"
        >
          <path
            d={d}
            fill={isSelected ? '#f59e0b' : '#fef3c7'}
            stroke="#b45309"
            strokeWidth="3"
            strokeLinejoin="round"
            className={isSelected ? 'filter drop-shadow-md' : ''}
          />
          {/* Crust Accent Line */}
          <path
            d={`M ${x1},${y1} A ${r},${r} 0 0,1 ${x2},${y2}`}
            fill="none"
            stroke="#92400e"
            strokeWidth="7"
          />
          {/* Slice center icon */}
          <text
            x={mx}
            y={my + 4}
            textAnchor="middle"
            className="select-none text-base font-black pointer-events-none"
          >
            {isSelected ? '✨' : '🍕'}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          {streak > 1 && (
            <div className="bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs px-2 py-0.5 rounded-xl flex items-center gap-1 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Streak x{streak}</span>
            </div>
          )}
          <div className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Pesanan {round}/{totalRounds}
        </span>
      </div>

      {/* Guest Request Dialog Card */}
      <div className="bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-lg space-y-4 text-center">
        <div className="flex items-center justify-between">
          <span className="bg-amber-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            Pecahan Bagian Makanan
          </span>
          <button
            onClick={handleSpeak}
            className="p-1.5 rounded-xl bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 cursor-pointer shadow-xs"
            title="Dengarkan Permintaan Tamu"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Guest Character & Speech */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/80 p-3.5 rounded-2xl border border-amber-200 text-left">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-xs shrink-0 animate-bounce">
            {current.guestIcon}
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-black text-amber-900">{current.guest}:</div>
            <div className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
              "{current.request}"
            </div>
            <div className="text-[11px] font-black text-amber-700 pt-0.5">
              Target: <span className="bg-amber-100 px-2 py-0.5 rounded-md">{current.fractionLabel}</span> ({current.foodType})
            </div>
          </div>
        </div>

        {/* Interactive Pizza Visual */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 max-w-xs sm:max-w-sm mx-auto shadow-inner space-y-2">
          <div className="text-xs font-bold text-slate-500">
            Ketuk potongan pizza untuk memilih atau membatalkan:
          </div>
          <div className="relative flex justify-center">
            <svg className="w-48 h-48 sm:w-56 sm:h-56 drop-shadow-md" viewBox="0 0 200 200">
              {renderSvgSlices()}
            </svg>
          </div>
          <div className="text-xs font-black text-slate-700 bg-amber-50 py-1.5 px-3 rounded-xl border border-amber-200 flex items-center justify-between">
            <span>Potongan Terpilih:</span>
            <span className="text-amber-800 text-sm">
              {selectedSlices.length} / {current.totalSlices} ({((selectedSlices.length / current.totalSlices) * 100).toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Serve Button */}
        <div className="pt-1">
          <button
            onClick={handleServe}
            disabled={selectedSlices.length === 0}
            className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${
              selectedSlices.length > 0
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Sajikan ke {current.guest}! 🍽️</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 12. DETEKTIF SUHU & TERMOMETER CUACA (THERMOMETER WEATHER LAB)
// ============================================================================
export const ThermometerWeatherLabGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [selectedDegree, setSelectedDegree] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      phenomenon: 'Titik Beku Es Batu 🧊',
      story: 'Air di dalam freezer kulkas membeku menjadi balok es padat. Pada suhu berapakah air mulai membeku?',
      targetTemp: 0,
      options: [0, 25, 37, 100],
      sceneIcon: '⛄',
      explanation: 'Air murni membeku menjadi es pada suhu 0 derajat Celcius (0°C).',
    },
    {
      phenomenon: 'Suhu Tubuh Manusia Sehat 🩺',
      story: 'Dokter memeriksa suhu tubuh Doni menggunakan termometer di kening. Doni sehat dan ceria. Berapa suhu tubuh normalnya?',
      targetTemp: 37,
      options: [15, 25, 37, 60],
      sceneIcon: '🧒',
      explanation: 'Suhu tubuh manusia normal dan sehat berada di kisaran 36°C sampai 37°C.',
    },
    {
      phenomenon: 'Titik Didih Air Mendidih 🫖',
      story: 'Ibu memasak air di atas kompor gas hingga bergolak panas dan mengeluarkan uap teko. Berapakah suhu air mendidih?',
      targetTemp: 100,
      options: [50, 75, 100, 150],
      sceneIcon: '☕',
      explanation: 'Air mendidih dan berubah menjadi uap panas pada suhu 100 derajat Celcius (100°C).',
    },
    {
      phenomenon: 'Suhu Ruangan Sejuk & Nyaman 🛋️',
      story: 'Di ruang kelas yang dipasang pendingin udara (AC), udara terasa sejuk dan sangat nyaman untuk belajar. Berapa suhunya?',
      targetTemp: 25,
      options: [0, 25, 45, 80],
      sceneIcon: '🏫',
      explanation: 'Suhu ruangan yang sejuk dan nyaman berkisar antara 22°C hingga 25°C.',
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;

  React.useEffect(() => {
    setSelectedDegree(null);
    setFeedback(null);
  }, [round]);

  const handleSpeak = () => {
    sound.speak(`${current.story}`);
  };

  const handleSelectTemp = (temp: number) => {
    if (selectedDegree !== null) return;
    setSelectedDegree(temp);

    const isCorrect = temp === current.targetTemp;
    if (isCorrect) {
      sound.playCorrect();
      const bonusStreak = (streak + 1) * 20;
      setScore((s) => s + 120 + bonusStreak);
      setStreak((st) => st + 1);
      setFeedback({
        isCorrect: true,
        text: `🌡️ Tepat sekali! ${current.explanation} (+${120 + bonusStreak} Poin)`,
      });
      confetti({ particleCount: 50, spread: 60 });
    } else {
      sound.playIncorrect();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: `Kurang tepat. ${current.explanation}`,
      });
    }

    setTimeout(() => {
      if (round < totalRounds && (isCorrect || hearts > 1)) {
        setRound((r) => r + 1);
      } else {
        const finalScore = score + (isCorrect ? 120 : 0);
        const stars = finalScore >= 350 ? 3 : finalScore >= 200 ? 2 : 1;
        onComplete(finalScore, stars);
      }
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          {streak > 1 && (
            <div className="bg-rose-100 border border-rose-300 text-rose-900 font-black text-xs px-2 py-0.5 rounded-xl flex items-center gap-1 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
              <span>Streak x{streak}</span>
            </div>
          )}
          <div className="bg-sky-50 border border-sky-200 text-sky-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Kasus {round}/{totalRounds}
        </span>
      </div>

      {/* Main Game Stage */}
      <div className="bg-gradient-to-b from-sky-50 via-cyan-50 to-rose-50 rounded-3xl p-5 sm:p-6 border-2 border-sky-200 shadow-lg space-y-4 text-center">
        <div className="flex items-center justify-between">
          <span className="bg-sky-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            Pengukuran Suhu (°C)
          </span>
          <button
            onClick={handleSpeak}
            className="p-1.5 rounded-xl bg-white border border-sky-200 text-sky-600 hover:bg-sky-50 cursor-pointer shadow-xs"
            title="Dengarkan Cerita Kasus"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Phenomenon Story Box */}
        <div className="bg-white/90 rounded-2xl p-4 border border-sky-200 text-left flex items-start gap-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-3xl shadow-xs shrink-0">
            {current.sceneIcon}
          </div>
          <div className="space-y-1">
            <span className="text-xs font-black text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md">
              {current.phenomenon}
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
              {current.story}
            </p>
          </div>
        </div>

        {/* Thermometer Visual representation */}
        <div className="bg-white rounded-2xl p-4 border-2 border-sky-100 flex items-center justify-center gap-8 max-w-sm mx-auto shadow-inner">
          {/* Vertical Thermometer Glass Tube */}
          <div className="relative w-10 h-44 bg-slate-100 rounded-full border-2 border-slate-300 p-1 flex flex-col justify-end items-center">
            {/* Liquid column */}
            <div
              style={{
                height: `${Math.max(12, Math.min(96, (current.targetTemp / 100) * 88 + 12))}%`,
              }}
              className="w-4 bg-gradient-to-t from-rose-600 via-rose-500 to-rose-400 rounded-full transition-all duration-700 shadow-sm"
            />
            {/* Bulb at bottom */}
            <div className="w-7 h-7 bg-rose-600 rounded-full absolute -bottom-1 shadow-md border-2 border-rose-700" />
          </div>

          {/* Markers */}
          <div className="text-left space-y-3 text-xs font-black text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-10 text-right text-rose-600 font-mono">100°C</span>
              <span className="text-[11px] text-slate-400">🔥 Air Mendidih</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 text-right text-amber-600 font-mono">37°C</span>
              <span className="text-[11px] text-slate-400">🩺 Tubuh Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 text-right text-teal-600 font-mono">25°C</span>
              <span className="text-[11px] text-slate-400">🛋️ Suhu Ruangan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 text-right text-sky-600 font-mono">0°C</span>
              <span className="text-[11px] text-slate-400">🧊 Titik Beku Es</span>
            </div>
          </div>
        </div>

        {/* Temperature Options */}
        <div className="space-y-2">
          <span className="text-xs font-black text-slate-600 block">
            Pilih Suhu yang Tepat dalam Derajat Celcius (°C):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {current.options.map((temp) => {
              const isSelected = selectedDegree === temp;
              const isCorrect = temp === current.targetTemp;

              let btnStyle = 'bg-white hover:bg-sky-50 border-slate-200 text-slate-800';
              if (selectedDegree !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 border-emerald-600 text-white ring-4 ring-emerald-300 scale-105';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 border-rose-600 text-white';
                } else {
                  btnStyle = 'opacity-40 bg-slate-100 border-slate-200 text-slate-400';
                }
              }

              return (
                <button
                  key={temp}
                  onClick={() => handleSelectTemp(temp)}
                  disabled={selectedDegree !== null}
                  className={`py-3.5 px-3 rounded-2xl font-black text-base border-2 shadow-xs transition-all transform cursor-pointer active:scale-95 flex items-center justify-center gap-1 font-mono ${btnStyle}`}
                >
                  <span>{temp}</span>
                  <span className="text-xs">°C</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};

export const RobotSpatialMazeGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [robotPos, setRobotPos] = useState({ r: 3, c: 0 }); // (row, col) in 4x4
  const [commands, setCommands] = useState<('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      start: { r: 3, c: 0 },
      target: { r: 1, c: 2 },
      targetIcon: '⭐',
      targetName: 'Bintang Emas',
      obstacles: [{ r: 2, c: 0 }, { r: 2, c: 1 }],
      hint: 'Maju 1 langkah ke atas, atau geser ke kanan lalu naik ke atas!',
      description: 'Program robot untuk menghindari bebatuan 🪨 dan mencapai Bintang Emas ⭐!',
      optimalLength: 4,
    },
    {
      start: { r: 3, c: 3 },
      target: { r: 0, c: 1 },
      targetIcon: '🔋',
      targetName: 'Baterai Turbo',
      obstacles: [{ r: 1, c: 2 }, { r: 2, c: 2 }],
      hint: 'Robot di pojok kanan bawah. Arahkan ke kiri lalu maju ke atas!',
      description: 'Robot butuh energi! Bantu robot mengambil Baterai Turbo 🔋!',
      optimalLength: 5,
    },
    {
      start: { r: 0, c: 0 },
      target: { r: 3, c: 3 },
      targetIcon: '🏆',
      targetName: 'Piala Juara',
      obstacles: [{ r: 1, c: 1 }, { r: 2, c: 2 }],
      hint: 'Jelajahi petak secara berbelok menuju pojok kanan bawah.',
      description: 'Arahkan Robot dari pojok kiri atas menuju Piala Juara 🏆!',
      optimalLength: 6,
    },
    {
      start: { r: 2, c: 1 },
      target: { r: 0, c: 3 },
      targetIcon: '🚀',
      targetName: 'Roket Angkasa',
      obstacles: [{ r: 1, c: 1 }, { r: 0, c: 2 }],
      hint: 'Perhatikan posisi roket di kanan atas. Gerak ke kanan lalu ke atas!',
      description: 'Waktunya meluncur! Arahkan robot ke Roket Angkasa 🚀!',
      optimalLength: 4,
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;

  // Reset robot position when round changes
  React.useEffect(() => {
    setRobotPos(current.start);
    setCommands([]);
    setFeedback(null);
    setIsRunning(false);
  }, [round]);

  const handleAddCommand = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (isRunning || commands.length >= 8) return;
    sound.playClick();
    setCommands((prev) => [...prev, dir]);
  };

  const handleClearCommands = () => {
    if (isRunning) return;
    sound.playClick();
    setCommands([]);
    setRobotPos(current.start);
    setFeedback(null);
  };

  const handleSpeakMission = () => {
    sound.speak(`${current.description}. Mulai dari baris ${current.start.r + 1}, kolom ${current.start.c + 1}.`);
  };

  const handleRunProgram = async () => {
    if (commands.length === 0 || isRunning) return;
    setIsRunning(true);
    setFeedback(null);

    let cur = { ...current.start };
    setRobotPos(cur);

    for (let i = 0; i < commands.length; i++) {
      await new Promise((res) => setTimeout(res, 450));
      const cmd = commands[i];
      let nextR = cur.r;
      let nextC = cur.c;

      if (cmd === 'UP') nextR = Math.max(0, cur.r - 1);
      if (cmd === 'DOWN') nextR = Math.min(3, cur.r + 1);
      if (cmd === 'LEFT') nextC = Math.max(0, cur.c - 1);
      if (cmd === 'RIGHT') nextC = Math.min(3, cur.c + 1);

      // Check obstacle hit
      const hitObstacle = current.obstacles.some((o) => o.r === nextR && o.c === nextC);
      if (hitObstacle) {
        sound.playIncorrect();
        setFeedback({
          isCorrect: false,
          text: '💥 Waduh! Robot menabrak batu rintangan 🪨! Coba ubah urutan arahnya.',
        });
        const nextHearts = hearts - 1;
        setHearts(nextHearts);
        setStreak(0);
        setIsRunning(false);
        setRobotPos({ r: nextR, c: nextC });
        return;
      }

      cur = { r: nextR, c: nextC };
      setRobotPos(cur);
      sound.playPop();
    }

    // Check if reached target
    const reachedTarget = cur.r === current.target.r && cur.c === current.target.c;
    if (reachedTarget) {
      sound.playCelebration();
      const bonusStreak = (streak + 1) * 20;
      setScore((s) => s + 150 + bonusStreak);
      setStreak((st) => st + 1);
      setFeedback({
        isCorrect: true,
        text: `🎉 Hebat! Robot berhasil mencapai ${current.targetName} ${current.targetIcon}! (+${150 + bonusStreak} Poin)`,
      });
      confetti({ particleCount: 60, spread: 70 });

      setTimeout(() => {
        if (round < totalRounds) {
          setRound((r) => r + 1);
        } else {
          const finalScore = score + 150 + bonusStreak;
          const stars = finalScore >= 450 ? 3 : finalScore >= 250 ? 2 : 1;
          onComplete(finalScore, stars);
        }
      }, 2000);
    } else {
      sound.playRetry();
      setFeedback({
        isCorrect: false,
        text: `Robot berhenti di petak lain. Target ${current.targetIcon} belum tercapai! Coba tambah atau ubah langkah.`,
      });
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setStreak(0);
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          {streak > 1 && (
            <div className="bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs px-2 py-0.5 rounded-xl flex items-center gap-1 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Streak x{streak}</span>
            </div>
          )}
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Ronde {round}/{totalRounds}
        </span>
      </div>

      {/* Main Board Stage */}
      <div className="bg-gradient-to-b from-sky-50 via-indigo-50 to-purple-50 rounded-3xl p-5 sm:p-6 border-2 border-indigo-200 shadow-lg space-y-4 text-center">
        <div className="flex items-center justify-between">
          <span className="bg-indigo-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            Orientasi Spasial & Logika Arah
          </span>
          <button
            onClick={handleSpeakMission}
            className="p-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 cursor-pointer shadow-xs"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-base sm:text-xl font-black text-slate-800">
          {current.description}
        </h2>

        {/* 4x4 Interactive Grid */}
        <div className="bg-white/90 rounded-2xl p-4 border-2 border-indigo-100 shadow-inner max-w-xs sm:max-w-sm mx-auto">
          <div className="grid grid-cols-4 gap-2 aspect-square">
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => {
                const isRobot = robotPos.r === r && robotPos.c === c;
                const isTarget = current.target.r === r && current.target.c === c;
                const isObstacle = current.obstacles.some((o) => o.r === r && o.c === c);

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`rounded-xl border-2 flex items-center justify-center text-2xl transition-all duration-300 relative ${
                      isRobot
                        ? 'bg-indigo-600 border-indigo-700 shadow-md scale-105 z-10'
                        : isTarget
                        ? 'bg-amber-100 border-amber-300 animate-bounce'
                        : isObstacle
                        ? 'bg-slate-300 border-slate-400'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {isRobot ? (
                      <span className="animate-pulse">🤖</span>
                    ) : isTarget ? (
                      <span>{current.targetIcon}</span>
                    ) : isObstacle ? (
                      <span>🪨</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300">
                        {r},{c}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Command Queue Bar */}
        <div className="bg-white/80 rounded-2xl p-3 border border-indigo-100 text-left space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Rencana Langkah Robot ({commands.length}/8):</span>
            <button
              onClick={handleClearCommands}
              disabled={isRunning || commands.length === 0}
              className="text-rose-600 hover:text-rose-700 font-bold text-[11px] cursor-pointer"
            >
              Hapus Semua 🔄
            </button>
          </div>
          <div className="flex items-center gap-1.5 min-h-[38px] p-1.5 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
            {commands.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                Tekan tombol panah di bawah untuk menambahkan arah langkah...
              </span>
            ) : (
              commands.map((cmd, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-indigo-100 border border-indigo-300 text-indigo-900 rounded-lg text-xs font-black shrink-0"
                >
                  {cmd === 'UP' && '⬆️ Maju'}
                  {cmd === 'DOWN' && '⬇️ Mundur'}
                  {cmd === 'LEFT' && '⬅️ Kiri'}
                  {cmd === 'RIGHT' && '➡️ Kanan'}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Direction Controls & Run Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="grid grid-cols-4 gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleAddCommand('UP')}
              disabled={isRunning || commands.length >= 8}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-indigo-50 border-2 border-indigo-200 font-black text-xs text-slate-800 shadow-xs active:scale-95 cursor-pointer"
            >
              ⬆️ Maju
            </button>
            <button
              onClick={() => handleAddCommand('DOWN')}
              disabled={isRunning || commands.length >= 8}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-indigo-50 border-2 border-indigo-200 font-black text-xs text-slate-800 shadow-xs active:scale-95 cursor-pointer"
            >
              ⬇️ Mundur
            </button>
            <button
              onClick={() => handleAddCommand('LEFT')}
              disabled={isRunning || commands.length >= 8}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-indigo-50 border-2 border-indigo-200 font-black text-xs text-slate-800 shadow-xs active:scale-95 cursor-pointer"
            >
              ⬅️ Kiri
            </button>
            <button
              onClick={() => handleAddCommand('RIGHT')}
              disabled={isRunning || commands.length >= 8}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-indigo-50 border-2 border-indigo-200 font-black text-xs text-slate-800 shadow-xs active:scale-95 cursor-pointer"
            >
              ➡️ Kanan
            </button>
          </div>

          <button
            onClick={handleRunProgram}
            disabled={isRunning || commands.length === 0}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${
              commands.length > 0 && !isRunning
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Jalankan Robot! 🚀</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 10. PENGUKURAN AJAIB JENGKAL & KLIP (JENGKAL MAGIC RULER GAME)
// ============================================================================
export const JengkalMagicRulerGame: React.FC<GameProps> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [placedUnits, setPlacedUnits] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const ROUNDS = [
    {
      item: '✏️',
      itemName: 'Pensil Warna Pelangi',
      unitType: 'clip',
      unitIcon: '📎',
      unitName: 'Klip Kertas',
      actualUnits: 5,
      options: [3, 4, 5, 6],
      question: 'Berapa banyak klip kertas 📎 yang dibutuhkan untuk mengukur panjang pensil ini?',
      explanation: 'Panjang pensil warna sama dengan 5 klip kertas berjejer pas!',
    },
    {
      item: '🥕',
      itemName: 'Wortel Kelinci Manis',
      unitType: 'hand',
      unitIcon: '🖐️',
      unitName: 'Jengkal Tangan',
      actualUnits: 3,
      options: [2, 3, 4, 5],
      question: 'Panjang wortel kelinci sama dengan berapa jengkal tangan 🖐️?',
      explanation: 'Panjang wortel setara dengan 3 jengkal tangan anak!',
    },
    {
      item: '📖',
      itemName: 'Buku Dongeng Bergambar',
      unitType: 'clip',
      unitIcon: '📎',
      unitName: 'Klip Kertas',
      actualUnits: 7,
      options: [5, 6, 7, 8],
      question: 'Susun klip kertas sampai ujung buku. Berapa panjang buku dongeng?',
      explanation: 'Panjang buku dongeng tepat sama dengan 7 klip kertas 📎!',
    },
    {
      item: '🥢',
      itemName: 'Sumpit Bambu Jepang',
      unitType: 'hand',
      unitIcon: '🖐️',
      unitName: 'Jengkal Tangan',
      actualUnits: 4,
      options: [2, 3, 4, 6],
      question: 'Berapa jengkal tangan 🖐️ panjang sumpit bambu ini?',
      explanation: 'Panjang sumpit bambu pas diukur dengan 4 jengkal tangan!',
    },
  ];

  const current = ROUNDS[(round - 1) % ROUNDS.length];
  const totalRounds = ROUNDS.length;

  React.useEffect(() => {
    setPlacedUnits(0);
    setSelectedAnswer(null);
    setFeedback(null);
  }, [round]);

  const handleAddUnit = () => {
    if (placedUnits >= 8) return;
    sound.playPop();
    setPlacedUnits((p) => p + 1);
  };

  const handleRemoveUnit = () => {
    if (placedUnits <= 0) return;
    sound.playClick();
    setPlacedUnits((p) => p - 1);
  };

  const handleSpeak = () => {
    sound.speak(`${current.question}. Benda yang diukur adalah ${current.itemName}.`);
  };

  const handleSelectAnswer = (ans: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(ans);

    const isCorrect = ans === current.actualUnits;
    if (isCorrect) {
      sound.playCorrect();
      const bonusStreak = (streak + 1) * 20;
      setScore((s) => s + 120 + bonusStreak);
      setStreak((st) => st + 1);
      setFeedback({
        isCorrect: true,
        text: `📏 Hebat! Benar sekali! ${current.explanation} (+${120 + bonusStreak} Poin)`,
      });
      confetti({ particleCount: 50, spread: 60 });
    } else {
      sound.playIncorrect();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: `Belum tepat. Coba susun alat ukurnya sampai pas di ujung benda. ${current.explanation}`,
      });
    }

    setTimeout(() => {
      if (round < totalRounds && (isCorrect || hearts > 1)) {
        setRound((r) => r + 1);
      } else {
        const finalScore = score + (isCorrect ? 120 : 0);
        const stars = finalScore >= 350 ? 3 : finalScore >= 200 ? 2 : 1;
        onComplete(finalScore, stars);
      }
    }, 1900);
  };

  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
          </div>
          {streak > 1 && (
            <div className="bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs px-2 py-0.5 rounded-xl flex items-center gap-1 animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Streak x{streak}</span>
            </div>
          )}
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>
        </div>

        <span className="text-xs font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
          Ronde {round}/{totalRounds}
        </span>
      </div>

      {/* Main Game Stage */}
      <div className="bg-gradient-to-b from-emerald-50 via-teal-50 to-amber-50 rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 shadow-lg space-y-5 text-center">
        <div className="flex items-center justify-between">
          <span className="bg-emerald-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
            Pengukuran Satuan Tak Baku
          </span>
          <button
            onClick={handleSpeak}
            className="p-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 cursor-pointer shadow-xs"
            title="Dengarkan Soal"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 className="text-base sm:text-xl font-black text-slate-800">
            {current.question}
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-1">
            Benda: <span className="text-emerald-700 font-black">{current.itemName}</span> {current.item}
          </p>
        </div>

        {/* Workbench Stage with Object and Interactive Ruler */}
        <div className="bg-white/90 rounded-2xl p-5 border-2 border-emerald-100 shadow-inner space-y-4">
          {/* Visual Object Display */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2">
              <span>Pangkal (Mulai)</span>
              <span>Ujung Benda</span>
            </div>
            <div className="h-16 sm:h-20 bg-amber-50 rounded-2xl border-2 border-amber-200 flex items-center px-4 relative overflow-hidden">
              <div
                style={{ width: `${(current.actualUnits / 8) * 100}%` }}
                className="h-10 sm:h-12 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-xl flex items-center justify-between px-3 shadow-sm border border-amber-500"
              >
                <span className="text-xl sm:text-2xl">{current.item}</span>
                <span className="text-xs sm:text-sm font-black text-white drop-shadow-xs">
                  {current.itemName}
                </span>
                <span className="text-xl sm:text-2xl">{current.item}</span>
              </div>
            </div>
          </div>

          {/* Non-standard Measuring Tape (Units Placed) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-2">
              <span>Alat Ukur: {current.unitName} ({current.unitIcon})</span>
              <span className="text-emerald-700 font-black">
                Tersusun: {placedUnits} {current.unitName}
              </span>
            </div>
            <div className="h-14 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex items-center px-4 gap-1 overflow-x-auto">
              {Array.from({ length: placedUnits }).map((_, i) => (
                <div
                  key={i}
                  style={{ width: `${(1 / 8) * 100}%` }}
                  className="h-10 bg-emerald-100 border-2 border-emerald-400 rounded-lg flex items-center justify-center text-lg font-black text-emerald-800 shadow-xs shrink-0 animate-in zoom-in-50"
                >
                  {current.unitIcon}
                </div>
              ))}
              {placedUnits === 0 && (
                <span className="text-xs text-slate-400 italic mx-auto">
                  Ketuk tombol "+ Tambah {current.unitIcon}" di bawah untuk menjejerkan alat ukur!
                </span>
              )}
            </div>
          </div>

          {/* Add/Remove Unit Controls */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={handleAddUnit}
              disabled={placedUnits >= 8}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs cursor-pointer active:scale-95"
            >
              + Tambah {current.unitIcon} ({current.unitName})
            </button>
            <button
              onClick={handleRemoveUnit}
              disabled={placedUnits <= 0}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 cursor-pointer active:scale-95"
            >
              - Kurangi
            </button>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-2">
          <span className="text-xs font-black text-slate-600 block">
            Pilih Jawaban Ukuran yang Tepat:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {current.options.map((opt) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt = opt === current.actualUnits;

              let btnStyle = 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-800';
              if (selectedAnswer !== null) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-500 border-emerald-600 text-white ring-4 ring-emerald-300 scale-105';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 border-rose-600 text-white';
                } else {
                  btnStyle = 'opacity-40 bg-slate-100 border-slate-200 text-slate-400';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectAnswer(opt)}
                  disabled={selectedAnswer !== null}
                  className={`py-3.5 px-4 rounded-2xl font-black text-base border-2 shadow-xs transition-all transform cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  <span className="text-xs">{current.unitIcon}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-black border animate-in zoom-in-95 duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};

