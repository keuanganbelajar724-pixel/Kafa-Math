import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Volume2, ArrowRight } from 'lucide-react';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface Question {
  text: string;
  options: number[];
  answer: number;
}

export const MakanKerupukGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [bitesLeft, setBitesLeft] = useState(5); // 5 bites to finish kerupuk
  const [currentQ, setCurrentQ] = useState<Question>({ text: '5 + 3', options: [7, 8, 9, 10], answer: 8 });
  const [feedback, setFeedback] = useState<string>('Jawab soal dengan benar agar KAFA melahap kerupuk!');
  const [isWon, setIsWon] = useState(false);
  const [chewAnimation, setChewAnimation] = useState(false);
  const [score, setScore] = useState(0);

  const generateQ = (): Question => {
    const ops = ['+', '-', 'x'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 9) + 2;
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
      a = Math.floor(Math.random() * 5) + 2;
      b = Math.floor(Math.random() * 5) + 1;
      ans = a * b;
      text = `${a} × ${b} = ?`;
    }

    const wrong1 = ans + (Math.random() > 0.5 ? 1 : 2);
    const wrong2 = Math.max(1, ans - (Math.random() > 0.5 ? 1 : 2));
    const wrong3 = ans + 3;
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
      setChewAnimation(true);
      setTimeout(() => setChewAnimation(false), 800);

      const nextBites = bitesLeft - 1;
      setBitesLeft(nextBites);
      setScore((prev) => prev + 20);

      if (nextBites <= 0) {
        setIsWon(true);
        sound.playFanfare();
        confetti({ particleCount: 80, spread: 70 });
        setFeedback('HOREE! Kerupuk habis dimakan! Kamu Juara Makan Kerupuk! 🥇');
      } else {
        setFeedback(`KRUNCH! Gigitan lezat! Sisa ${nextBites} gigitan lagi! 😋`);
        setCurrentQ(generateQ());
      }
    } else {
      sound.playRetry();
      setFeedback('Aduh, belum tepat! KAFA belum bisa menggigit, coba lagi ya 😊');
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-400 via-orange-400 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-2xl border-4 border-white flex flex-col items-center max-w-xl mx-auto my-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-white/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍘</span>
          <div>
            <h2 className="text-lg sm:text-xl font-black">Lomba Makan Kerupuk Matematika</h2>
            <p className="text-xs text-amber-100 font-semibold">Tiap jawaban benar = 1 gigitan kerupuk!</p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 font-black text-sm cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Visual Arena: Kerupuk Hanging from a String */}
      <div className="w-full bg-white/15 backdrop-blur-md rounded-3xl p-5 flex flex-col items-center relative overflow-hidden border border-white/30 my-2 min-h-[220px] justify-between">
        {/* String from above */}
        <div className="w-1 bg-white/80 h-14" />

        {/* Kerupuk with bite states */}
        <div className="relative">
          <div
            className={`w-28 h-28 rounded-full bg-amber-100 border-4 border-amber-300 shadow-lg flex items-center justify-center text-5xl transition-all transform ${
              chewAnimation ? 'scale-90 rotate-6' : 'hover:scale-105'
            }`}
          >
            {bitesLeft >= 5 && '🍘'}
            {bitesLeft === 4 && '🥯'}
            {bitesLeft === 3 && '🥐'}
            {bitesLeft === 2 && '🍪'}
            {bitesLeft === 1 && '🍤'}
            {bitesLeft <= 0 && '✨'}
          </div>
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
            {bitesLeft} Gigitan
          </span>
        </div>

        {/* Mascot biting below */}
        <div
          className={`text-6xl transition-transform mt-3 ${
            chewAnimation ? 'scale-125 translate-y-[-10px] animate-bounce' : ''
          }`}
        >
          {chewAnimation ? '🦊😋' : '🦊'}
        </div>
      </div>

      {/* Feedback text */}
      <p className="text-xs sm:text-sm font-black text-amber-950 bg-white/90 px-4 py-2 rounded-2xl my-2 shadow-xs text-center">
        {feedback}
      </p>

      {/* Win State or Question Options */}
      {isWon ? (
        <div className="w-full text-center space-y-4 my-2">
          <div className="text-5xl animate-bounce">🏆</div>
          <p className="text-lg font-black text-white">Kerupuk Berhasil Dihabiskan!</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setBitesLeft(5);
                setIsWon(false);
                setScore(0);
                setCurrentQ(generateQ());
                setFeedback('Ayo mulai gigitan pertama!');
              }}
              className="px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Main Lagi
            </button>
            <button
              onClick={() => onComplete(score + 50, 3)}
              className="px-6 py-2.5 rounded-2xl bg-white text-orange-600 font-black text-sm shadow-md hover:bg-amber-50 cursor-pointer flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-500" /> Selesai & Ambil Reward (+{score + 50} XP)
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-3 mt-1">
          {/* Question Display */}
          <div className="bg-white rounded-2xl p-4 text-center text-slate-800 shadow-md">
            <span className="text-xs font-bold text-slate-500 block">Selesaikan untuk Menggigit:</span>
            <span className="text-2xl sm:text-3xl font-black text-orange-600">{currentQ.text}</span>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="py-3 px-4 bg-white hover:bg-amber-50 text-slate-800 hover:text-orange-600 font-black text-xl rounded-2xl shadow-md border-2 border-white/60 transition-transform active:scale-95 cursor-pointer"
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
