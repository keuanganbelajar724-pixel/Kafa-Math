import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw } from 'lucide-react';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface Question {
  text: string;
  options: number[];
  answer: number;
}

export const TarikTambangGame: React.FC<Props> = ({ onComplete, onExit }) => {
  // ropePosition: 0 is center, -100 is opponent win, +100 is player win
  const [ropePosition, setRopePosition] = useState(0);
  const [currentQ, setCurrentQ] = useState<Question>({ text: '7 + 6', options: [11, 12, 13, 14], answer: 13 });
  const [feedback, setFeedback] = useState<string>('Tarik tambang! Jawab cepat & benar agar tim KAFA menang!');
  const [isWon, setIsWon] = useState(false);
  const [score, setScore] = useState(0);

  const generateQ = (): Question => {
    const ops = ['+', '-', 'x'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 12) + 3;
    let b = Math.floor(Math.random() * 9) + 2;
    let ans = 0;
    let text = '';

    if (op === '+') {
      ans = a + b;
      text = `${a} + ${b} = ?`;
    } else if (op === '-') {
      if (a < b) [a, b] = [b, a];
      ans = a - b;
      text = `${a} - ${b} = ?`;
    } else {
      a = Math.floor(Math.random() * 6) + 2;
      b = Math.floor(Math.random() * 5) + 1;
      ans = a * b;
      text = `${a} × ${b} = ?`;
    }

    const wrong1 = ans + (Math.random() > 0.5 ? 1 : 2);
    const wrong2 = Math.max(1, ans - (Math.random() > 0.5 ? 1 : 2));
    const wrong3 = ans + 4;
    const opts = Array.from(new Set([ans, wrong1, wrong2, wrong3])).sort(() => Math.random() - 0.5);

    return { text, options: opts.slice(0, 4), answer: ans };
  };

  useEffect(() => {
    setCurrentQ(generateQ());
  }, []);

  const handleAnswer = (val: number) => {
    if (isWon) return;

    if (val === currentQ.answer) {
      sound.playCorrect();
      sound.playPop();

      const newPos = ropePosition + 35;
      setRopePosition(newPos);
      setScore((prev) => prev + 25);

      if (newPos >= 70) {
        setIsWon(true);
        sound.playFanfare();
        confetti({ particleCount: 90, spread: 80 });
        setFeedback('LUAR BIASA! Tim KAFA memenangkan Tarik Tambang! 🏆');
      } else {
        setFeedback('HEBATT! Tambang ditarik kuat ke arah kita! Teruskan! 💪');
        setCurrentQ(generateQ());
      }
    } else {
      sound.playRetry();
      // slight pull from opponent
      setRopePosition((prev) => Math.max(-60, prev - 15));
      setFeedback('Aduh salah! Lawan menarik sedikit, ayo fokus dan tarik kembali! ⚡');
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-500 via-indigo-600 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-2xl border-4 border-white flex flex-col items-center max-w-xl mx-auto my-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-white/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🪢</span>
          <div>
            <h2 className="text-lg sm:text-xl font-black">Lomba Tarik Tambang Matematika</h2>
            <p className="text-xs text-blue-200 font-semibold">Tarik pita merah melewati batas kemenangan!</p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 font-black text-sm cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Arena Tarik Tambang Visual */}
      <div className="w-full bg-slate-800/80 rounded-3xl p-5 border border-white/20 relative overflow-hidden min-h-[200px] flex flex-col justify-between my-2 shadow-inner">
        {/* Teams and Rope */}
        <div className="flex items-center justify-between relative z-10">
          {/* Opponent Team (Left) */}
          <div className="flex flex-col items-center">
            <span className="text-4xl">🐻🦁</span>
            <span className="text-[11px] font-bold text-rose-300 mt-1">Tim Beruang</span>
          </div>

          {/* Player Team (Right) */}
          <div className="flex flex-col items-center">
            <span className="text-4xl">🦊🐰</span>
            <span className="text-[11px] font-black text-emerald-300 mt-1">Tim KAFA (Kamu)</span>
          </div>
        </div>

        {/* Rope Line with Marker */}
        <div className="relative w-full h-8 flex items-center my-4">
          {/* Neutral center line */}
          <div className="absolute left-1/2 -top-3 bottom-0 w-0.5 bg-yellow-400/60 border-l border-dashed border-yellow-300" />

          {/* Thick Rope */}
          <div className="w-full h-3 bg-amber-700 rounded-full border border-amber-900 shadow-inner" />

          {/* Red Ribbon Indicator (Moves with ropePosition: -100 to 100) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
            style={{ left: `calc(50% + ${ropePosition * 1.5}px)` }}
          >
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md flex items-center justify-center text-xs font-black animate-pulse">
              🚩
            </div>
          </div>
        </div>

        {/* Win boundaries */}
        <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
          <span>← Batas Lawan</span>
          <span className="text-yellow-300">Garis Tengah</span>
          <span className="text-emerald-400">Batas Menang Kamu →</span>
        </div>
      </div>

      {/* Feedback text */}
      <p className="text-xs sm:text-sm font-black text-slate-900 bg-white/95 px-4 py-2 rounded-2xl my-2 shadow-xs text-center">
        {feedback}
      </p>

      {/* Victory or Question Interface */}
      {isWon ? (
        <div className="w-full text-center space-y-4 my-2">
          <div className="text-5xl animate-bounce">🏆🎉</div>
          <p className="text-lg font-black text-white">Selamat! Tim KAFA Juara Tarik Tambang!</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setRopePosition(0);
                setIsWon(false);
                setScore(0);
                setCurrentQ(generateQ());
                setFeedback('Ayo mulai ronde baru!');
              }}
              className="px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Main Lagi
            </button>
            <button
              onClick={() => onComplete(score + 60, 3)}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-900 font-black text-sm shadow-md hover:from-emerald-300 hover:to-teal-300 cursor-pointer flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4" /> Ambil Hadiah (+{score + 60} XP)
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-3 mt-1">
          {/* Question Box */}
          <div className="bg-white rounded-2xl p-4 text-center text-slate-800 shadow-md">
            <span className="text-xs font-bold text-slate-500 block">Jawab untuk Menarik Tambang:</span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-600">{currentQ.text}</span>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="py-3 px-4 bg-white hover:bg-blue-50 text-slate-900 hover:text-indigo-600 font-black text-xl rounded-2xl shadow-md border-2 border-white/60 transition-transform active:scale-95 cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
