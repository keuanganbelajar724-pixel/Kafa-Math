import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, Trophy, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface MathRaceQuestion {
  q: string;
  options: number[];
  answer: number;
}

export const RacingMathGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [distance, setDistance] = useState<number>(0); // 0 to 100%
  const [rivalDistance, setRivalDistance] = useState<number>(0);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const questions: MathRaceQuestion[] = [
    { q: '6 + 7 = ?', options: [12, 13, 14, 15], answer: 13 },
    { q: '15 - 8 = ?', options: [6, 7, 8, 9], answer: 7 },
    { q: '4 × 3 = ?', options: [10, 12, 14, 16], answer: 12 },
    { q: '9 + 9 = ?', options: [16, 17, 18, 19], answer: 18 },
    { q: '20 - 6 = ?', options: [12, 13, 14, 15], answer: 14 },
  ];

  const currentQ = questions[currentIdx];

  // Rival moves forward slowly
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setRivalDistance((prev) => {
        if (prev >= 100) return 100;
        return prev + 1.5;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [gameOver]);

  const handleAnswer = (val: number) => {
    if (val === currentQ.answer) {
      sound.playCorrect();
      setScore((prev) => prev + 20);
      const newDist = distance + 20;
      setDistance(newDist);
      setFeedback('Jawaban benar! Perahumu melaju cepat! ⛵💨');

      if (newDist >= 100 || currentIdx >= questions.length - 1) {
        setGameOver(true);
        sound.playFanfare();
        confetti({ particleCount: 50, spread: 70 });
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    } else {
      sound.playRetry();
      setFeedback('Ups, belum tepat! Ayo coba periksa kembali!');
    }
  };

  if (gameOver) {
    const isWinner = distance >= rivalDistance;
    const stars = isWinner ? 3 : 2;
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-cyan-400 shadow-xl animate-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{isWinner ? 'Juara 1 Balap Perahu! 🏆' : 'Balapan Selesai! 🎉'}</h3>
        <p className="text-slate-600 mb-4">Kamu berlayar dengan sangat lincah menaklukkan gelombang matematika!</p>
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-4xl ${i < stars ? 'text-amber-400' : 'text-slate-200'}`}>
              ★
            </span>
          ))}
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP didapatkan!</p>
        <button
          onClick={() => onComplete(score, stars)}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105"
        >
          Lanjut Berlayar 🌊
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-sky-400 via-cyan-300 to-blue-500 rounded-3xl p-6 border-4 border-cyan-300 shadow-xl min-h-[480px] flex flex-col justify-between text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>Balap Perahu Nusantara</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs">
            ⭐ {score} XP
          </span>
          <button onClick={onExit} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg">
            Tutup
          </button>
        </div>
      </div>

      {/* Race Track Canvas */}
      <div className="bg-blue-600/30 backdrop-blur p-4 rounded-2xl border-2 border-white/50 space-y-4 my-2">
        {/* Your Boat */}
        <div>
          <div className="flex justify-between text-xs font-bold text-white mb-1">
            <span>Kapalmu ⛵</span>
            <span>{Math.round(distance)}%</span>
          </div>
          <div className="h-7 bg-blue-950/40 rounded-full p-1 relative overflow-hidden border border-white/30">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300 relative flex items-center justify-end pr-1"
              style={{ width: `${Math.max(8, distance)}%` }}
            >
              <span className="text-sm">⛵</span>
            </div>
          </div>
        </div>

        {/* Rival Boat */}
        <div>
          <div className="flex justify-between text-xs font-bold text-white/80 mb-1">
            <span>Kapal Teman 🚤</span>
            <span>{Math.round(rivalDistance)}%</span>
          </div>
          <div className="h-7 bg-blue-950/40 rounded-full p-1 relative overflow-hidden border border-white/30">
            <div
              className="h-full bg-rose-400 rounded-full transition-all duration-300 relative flex items-center justify-end pr-1"
              style={{ width: `${Math.max(8, rivalDistance)}%` }}
            >
              <span className="text-sm">🚤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="bg-white/95 rounded-2xl p-4 text-center shadow-lg border-2 border-cyan-200">
        <div className="flex justify-center items-center gap-2 mb-2">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">{currentQ.q}</h2>
          <button
            onClick={() => sound.speak(`Berapa hasil dari ${currentQ.q}?`)}
            className="p-1.5 bg-cyan-100 text-cyan-800 rounded-full hover:bg-cyan-200 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {feedback && <p className="text-xs font-bold text-indigo-900 bg-amber-200/90 py-1 px-3 rounded-lg mb-3">{feedback}</p>}

        <div className="grid grid-cols-2 gap-3">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="py-3 bg-gradient-to-b from-sky-100 to-sky-200 hover:from-cyan-400 hover:to-cyan-500 hover:text-white font-black text-xl text-sky-900 rounded-2xl shadow border-2 border-sky-300 active:scale-95 transition-all cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
