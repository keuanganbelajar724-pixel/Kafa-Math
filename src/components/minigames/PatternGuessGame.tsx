import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, Trophy, Sparkles, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface PatternQuestion {
  sequence: string[];
  options: string[];
  correct: string;
  explanation: string;
}

export const PatternGuessGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const patterns: PatternQuestion[] = [
    {
      sequence: ['🍎', '🍌', '🍎', '🍌', '❓'],
      options: ['🍎', '🍌', '🍇', '🍉'],
      correct: '🍎',
      explanation: 'Polanya adalah Apel lalu Pisang selang-seling. Jadi berikutnya adalah Apel!',
    },
    {
      sequence: ['2', '4', '6', '8', '❓'],
      options: ['9', '10', '11', '12'],
      correct: '10',
      explanation: 'Polanya bertambah 2 setiap langkah (+2). 8 + 2 = 10!',
    },
    {
      sequence: ['🔴', '🔵', '🔵', '🔴', '🔵', '❓'],
      options: ['🔴', '🔵', '🟡', '🟢'],
      correct: '🔵',
      explanation: 'Polanya adalah 1 Merah lalu 2 Biru berulang. Setelah 1 Biru kedua, lengkaplah jadi Biru!',
    },
  ];

  const currentP = patterns[(round - 1) % patterns.length];

  const initRound = (r: number) => {
    setFeedback(null);
    sound.speak('Perhatikan pola dan pilih simbol atau angka yang tepat untuk tanda tanya!');
  };

  useEffect(() => {
    initRound(1);
  }, []);

  const handleSelect = (opt: string) => {
    if (opt === currentP.correct) {
      sound.playCorrect();
      confetti({ particleCount: 45, spread: 70 });
      setScore((prev) => prev + 35);
      setFeedback(`Hebat! ${currentP.explanation} 🎉`);
      sound.speak('Hebat! Jawabanmu tepat!');

      setTimeout(() => {
        if (round >= patterns.length) {
          setGameOver(true);
          sound.playFanfare();
        } else {
          setRound((prev) => prev + 1);
          initRound(round + 1);
        }
      }, 1500);
    } else {
      sound.playRetry();
      setFeedback('Ups, belum tepat. Amati urutan dari awal lagi yuk!');
      sound.speak('Belum tepat, coba lagi ya.');
    }
  };

  if (gameOver) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-purple-400 shadow-xl animate-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Master Pola Nusantara! 🌳✨</h3>
        <p className="text-slate-600 mb-4">Kamu sangat cerdik membaca logika dan urutan pola matematika!</p>
        <div className="flex justify-center gap-2 mb-6">
          <span className="text-4xl text-amber-400">★★★</span>
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP didapatkan!</p>
        <button
          onClick={() => onComplete(score, 3)}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl shadow cursor-pointer"
        >
          Lanjut Petualangan 🌟
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-purple-100 via-fuchsia-50 to-indigo-100 rounded-3xl p-6 border-4 border-purple-300 shadow-xl min-h-[480px] flex flex-col justify-between">
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
          <span>🧩</span>
          <span>Tebak Pola ({round}/{patterns.length})</span>
          <button
            onClick={() => sound.speak('Lanjutkan urutan pola dengan memilih simbol yang benar!')}
            className="p-1.5 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full text-xs">
            ⭐ {score} XP
          </span>
          <button onClick={onExit} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg">
            Tutup
          </button>
        </div>
      </div>

      <div className="text-center my-3">
        <h3 className="text-lg md:text-xl font-bold text-slate-800">Apa simbol selanjutnya untuk melengkapi pola ini?</h3>
      </div>

      {/* Pattern Display */}
      <div className="bg-white/95 p-6 rounded-3xl border-2 border-purple-200 shadow-md flex justify-center items-center gap-3 flex-wrap my-4">
        {currentP.sequence.map((item, idx) => (
          <div
            key={idx}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-sm ${
              item === '❓' ? 'bg-amber-300 text-amber-900 animate-pulse border-2 border-amber-500' : 'bg-purple-50 text-purple-900 border border-purple-200'
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Options */}
      <div>
        <p className="text-xs font-bold text-slate-700 text-center mb-2">Pilih Jawaban:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {currentP.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              className="py-3 bg-white hover:bg-purple-500 hover:text-white text-purple-900 font-black text-2xl rounded-2xl border-2 border-purple-300 shadow cursor-pointer transition-all active:scale-95 flex items-center justify-center"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {feedback && <p className="text-xs font-bold text-center mt-3 text-indigo-900 bg-amber-200 py-1.5 px-3 rounded-xl">{feedback}</p>}
    </div>
  );
};
