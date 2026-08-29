import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, Trophy, Sparkles, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface FractionTask {
  numerator: number;
  denominator: number;
  foodName: string;
}

export const FractionPizzaGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [selectedSlices, setSelectedSlices] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const tasks: FractionTask[] = [
    { numerator: 1, denominator: 2, foodName: 'Martabak Manis Coklat' },
    { numerator: 3, denominator: 4, foodName: 'Pizza Keju Nusantara' },
    { numerator: 2, denominator: 5, foodName: 'Kue Lapis Legit' },
    { numerator: 5, denominator: 8, foodName: 'Martabak Telur Spesial' },
  ];

  const currentTask = tasks[(round - 1) % tasks.length];

  const initRound = (r: number) => {
    const task = tasks[(r - 1) % tasks.length];
    setSelectedSlices(new Array(task.denominator).fill(false));
    setFeedback(null);
    const prompt = `Warnai ${task.numerator}/${task.denominator} bagian dari ${task.foodName}!`;
    sound.speak(prompt);
  };

  useEffect(() => {
    initRound(1);
  }, []);

  const toggleSlice = (index: number) => {
    sound.playClick();
    setSelectedSlices((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const activeCount = selectedSlices.filter(Boolean).length;

  const handleVerify = () => {
    if (activeCount === currentTask.numerator) {
      sound.playCorrect();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setScore((prev) => prev + 30);
      setFeedback(`Hebat! Kamu telah memilih ${currentTask.numerator}/${currentTask.denominator} bagian dengan tepat! 🎉`);
      sound.speak(`Hebat! Jawabanmu tepat sekali!`);

      setTimeout(() => {
        if (round >= tasks.length) {
          setGameOver(true);
          sound.playFanfare();
        } else {
          setRound((prev) => prev + 1);
          initRound(round + 1);
        }
      }, 1500);
    } else if (activeCount < currentTask.numerator) {
      sound.playRetry();
      setFeedback(`Kamu baru memilih ${activeCount} potong. Butuh ${currentTask.numerator} potong ya!`);
      sound.speak(`Masih kurang potongannya.`);
    } else {
      sound.playRetry();
      setFeedback(`Kamu memilih ${activeCount} potong. Itu kebanyakan, hanya perlu ${currentTask.numerator} potong.`);
      sound.speak(`Kebanyakan potongannya.`);
    }
  };

  if (gameOver) {
    const stars = 3;
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-orange-400 shadow-xl animate-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Master Pecahan Nusantara!</h3>
        <p className="text-slate-600 mb-4">Kamu sangat memahami pembilang dan penyebut pada pecahan!</p>
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="text-4xl text-amber-400">
              ★
            </span>
          ))}
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP Didapatkan!</p>
        <button
          onClick={() => onComplete(score, stars)}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105"
        >
          Lanjut Petualangan 🚀
        </button>
      </div>
    );
  }

  const { numerator, denominator, foodName } = currentTask;

  return (
    <div className="bg-gradient-to-b from-orange-100 via-amber-50 to-orange-200 rounded-3xl p-6 border-4 border-orange-300 shadow-xl min-h-[480px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-sm md:text-base">🍕 Pecahan Martabak ({round}/{tasks.length})</span>
          <button
            onClick={() => sound.speak(`Warnai ${numerator}/${denominator} bagian dari ${foodName}!`)}
            className="p-1.5 bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 cursor-pointer"
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

      {/* Center Prompt */}
      <div className="text-center my-2">
        <h3 className="text-lg md:text-xl font-bold text-slate-800">
          Warnai <span className="text-2xl text-orange-600 font-black underline">{numerator}/{denominator}</span> bagian dari {foodName}!
        </h3>
        <p className="text-xs text-slate-600">Klik / sentuh potongan kue untuk mewarnainya.</p>
      </div>

      {/* Interactive Pie / Bar Slices */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-amber-200 border-4 border-amber-600 shadow-xl flex items-center justify-center overflow-hidden">
          {/* Radial visual slices */}
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1 p-1">
            {selectedSlices.map((selected, idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => toggleSlice(idx)}
                  className={`transition-all duration-200 flex items-center justify-center font-bold text-sm cursor-pointer border border-amber-500/30 ${
                    selected ? 'bg-orange-500 text-white scale-[0.98] shadow-inner' : 'bg-amber-100 hover:bg-amber-300 text-amber-900'
                  }`}
                  style={{ minHeight: '60px' }}
                >
                  {selected ? '🍫 Terisi' : 'Potong'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current status display */}
        <div className="mt-4 flex items-center gap-4 bg-white/90 px-6 py-2 rounded-2xl shadow-sm border border-orange-200">
          <div className="text-center">
            <span className="text-xs text-slate-500 block">Pilihanmu:</span>
            <span className="text-2xl font-black text-orange-600">
              {activeCount} / {denominator}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <span className="text-xs text-slate-500 block">Target:</span>
            <span className="text-2xl font-black text-emerald-600">
              {numerator} / {denominator}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback and verification */}
      <div>
        {feedback && (
          <p className="text-xs md:text-sm font-bold text-center mb-3 text-indigo-900 bg-amber-200/90 py-1.5 px-4 rounded-xl">
            {feedback}
          </p>
        )}
        <button
          onClick={handleVerify}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Periksa Jawaban
        </button>
      </div>
    </div>
  );
};
