import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, RefreshCw, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface Balloon {
  id: number;
  value: number;
  isCorrect: boolean;
  color: string;
  x: number;
  speed: number;
}

export const CatchNumberGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [targetSum, setTargetSum] = useState<number>(10);
  const [questionText, setQuestionText] = useState<string>('Pilih balon yang bernilai 10!');
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const colors = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-sky-500', 'bg-purple-500'];

  const initRound = (r: number) => {
    const target = r * 2 + 5; // e.g. 7, 9, 11, 13, 15
    setTargetSum(target);
    const text = `Tangkap balon yang menghasilkan angka ${target}!`;
    setQuestionText(text);
    sound.speak(text);

    const newBalloons: Balloon[] = [];
    // Correct balloon
    newBalloons.push({
      id: 1,
      value: target,
      isCorrect: true,
      color: colors[0],
      x: 20,
      speed: 1,
    });

    // 3 distractor balloons
    for (let i = 2; i <= 4; i++) {
      let offset = (i - 2) * 2 - 3;
      if (offset === 0) offset = 4;
      newBalloons.push({
        id: i,
        value: Math.max(1, target + offset),
        isCorrect: false,
        color: colors[i % colors.length],
        x: 20 + i * 20,
        speed: 1,
      });
    }

    setBalloons(newBalloons.sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  useEffect(() => {
    initRound(1);
  }, []);

  const handlePop = (b: Balloon) => {
    if (b.isCorrect) {
      sound.playCorrect();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      setScore((prev) => prev + 25);
      setFeedback('Hebat! Balonmu tepat sekali! 🎉');
      sound.speak('Hebat! Balonmu tepat sekali!');

      setTimeout(() => {
        if (round >= 5) {
          setGameOver(true);
          sound.playFanfare();
        } else {
          setRound((prev) => prev + 1);
          initRound(round + 1);
        }
      }, 1200);
    } else {
      sound.playRetry();
      setFeedback(`Belum tepat, itu ${b.value}. Cari angka ${targetSum} yuk!`);
      sound.speak(`Belum tepat, itu ${b.value}. Cari angka ${targetSum} yuk!`);
    }
  };

  if (gameOver) {
    const stars = score >= 100 ? 3 : score >= 75 ? 2 : 1;
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-emerald-400 shadow-xl animate-in fade-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Petualangan Balon Selesai!</h3>
        <p className="text-slate-600 mb-4">Kamu berhasil menangkap angka dengan jeli!</p>
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-4xl ${i < stars ? 'text-amber-400' : 'text-slate-200'}`}>
              ★
            </span>
          ))}
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP didapatkan!</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onComplete(score, stars)}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105"
          >
            Lanjut Petualangan ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-sky-400 via-sky-300 to-indigo-200 rounded-3xl p-6 relative overflow-hidden min-h-[460px] flex flex-col justify-between border-4 border-sky-300 shadow-xl">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sky-800 text-sm md:text-base">🎈 Balon Hitung (Ronde {round}/5)</span>
          <button
            onClick={() => sound.speak(questionText)}
            className="p-1.5 bg-sky-100 text-sky-700 hover:bg-sky-200 rounded-full cursor-pointer"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs md:text-sm">
            ⭐ {score} XP
          </span>
          <button onClick={onExit} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg">
            Tutup
          </button>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="text-center my-3">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 bg-white/80 inline-block px-6 py-2 rounded-2xl shadow-sm">
          {questionText}
        </h2>
        {feedback && (
          <p className="mt-2 font-bold text-sm md:text-base text-indigo-900 bg-amber-200/90 inline-block px-4 py-1 rounded-xl animate-fade-in">
            {feedback}
          </p>
        )}
      </div>

      {/* Floating Balloons Area */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 justify-items-center">
        {balloons.map((b) => (
          <button
            key={b.id}
            onClick={() => handlePop(b)}
            className={`w-24 h-32 md:w-28 md:h-36 rounded-full text-white font-black text-3xl md:text-4xl shadow-xl flex flex-col items-center justify-center transform hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer ${b.color} relative border-2 border-white/40`}
          >
            <span>{b.value}</span>
            <div className="w-1 h-6 bg-white/70 absolute -bottom-6"></div>
          </button>
        ))}
      </div>

      {/* Bottom Hint */}
      <div className="text-center text-xs md:text-sm font-semibold text-slate-800 bg-white/60 py-1.5 rounded-xl">
        💡 Klik balon yang memiliki angka yang tepat untuk meletuskannya!
      </div>
    </div>
  );
};
