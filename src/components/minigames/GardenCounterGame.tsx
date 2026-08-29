import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, Trophy, Sparkles, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface GardenTask {
  itemEmoji: string;
  itemName: string;
  count: number;
}

export const GardenCounterGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [clickedItems, setClickedItems] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const tasks: GardenTask[] = [
    { itemEmoji: '🥭', itemName: 'Mangga Manis', count: 5 },
    { itemEmoji: '🍍', itemName: 'Nanas Madu', count: 7 },
    { itemEmoji: '🍉', itemName: 'Semangka Segar', count: 6 },
    { itemEmoji: '🍌', itemName: 'Pisang Raja', count: 8 },
  ];

  const currentTask = tasks[(round - 1) % tasks.length];

  const initRound = (r: number) => {
    const task = tasks[(r - 1) % tasks.length];
    setUserCount(0);
    setClickedItems([]);
    setFeedback(null);
    const prompt = `Hitung berapa banyak ${task.itemName} di kebun!`;
    sound.speak(prompt);
  };

  useEffect(() => {
    initRound(1);
  }, []);

  const handleItemClick = (index: number) => {
    sound.playClick();
    if (clickedItems.includes(index)) {
      setClickedItems((prev) => prev.filter((i) => i !== index));
      setUserCount((prev) => Math.max(0, prev - 1));
    } else {
      setClickedItems((prev) => [...prev, index]);
      setUserCount((prev) => prev + 1);
    }
  };

  const handleVerify = () => {
    if (userCount === currentTask.count) {
      sound.playCorrect();
      confetti({ particleCount: 45, spread: 70 });
      setScore((prev) => prev + 25);
      setFeedback(`Hebat! Ada tepat ${currentTask.count} buah ${currentTask.itemName}! 🍎✨`);
      sound.speak(`Hebat! Hitunganmu tepat sekali!`);

      setTimeout(() => {
        if (round >= tasks.length) {
          setGameOver(true);
          sound.playFanfare();
        } else {
          setRound((prev) => prev + 1);
          initRound(round + 1);
        }
      }, 1400);
    } else {
      sound.playRetry();
      setFeedback(`Kamu menghitung ${userCount} buah. Coba sentuh satu per satu buahnya lagi!`);
      sound.speak(`Ayo kita hitung bersama.`);
    }
  };

  if (gameOver) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-emerald-400 shadow-xl animate-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Petani Cilik Juara! 🌾</h3>
        <p className="text-slate-600 mb-4">Kamu sangat teliti menghitung hasil panen di kebun buah!</p>
        <div className="flex justify-center gap-2 mb-6">
          <span className="text-4xl text-amber-400">★★★</span>
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP didapatkan!</p>
        <button
          onClick={() => onComplete(score, 3)}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-md cursor-pointer"
        >
          Lanjut Petualangan 🌟
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-emerald-100 via-teal-50 to-emerald-200 rounded-3xl p-6 border-4 border-emerald-300 shadow-xl min-h-[480px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
          <span className="text-xl">🌳</span>
          <span>Kebun Berhitung ({round}/{tasks.length})</span>
          <button
            onClick={() => sound.speak(`Hitung berapa banyak ${currentTask.itemName} di kebun!`)}
            className="p-1.5 bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200"
          >
            <Volume2 className="w-4 h-4" />
          </button>
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

      <div className="text-center my-2">
        <h3 className="text-xl font-bold text-slate-800">
          Sentuh & Hitung Semua <span className="text-emerald-700 font-black">{currentTask.itemName}</span>!
        </h3>
        <p className="text-xs text-slate-600">Klik buah untuk memberi tanda centang.</p>
      </div>

      {/* Garden Grid */}
      <div className="bg-emerald-600/10 p-6 rounded-3xl border-2 border-emerald-300/60 my-2 flex flex-wrap justify-center gap-4 items-center">
        {Array.from({ length: currentTask.count }).map((_, idx) => {
          const isSelected = clickedItems.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleItemClick(idx)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center text-4xl md:text-5xl shadow-md transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-amber-300 border-4 border-amber-500 scale-110 rotate-3 shadow-lg'
                  : 'bg-white/90 hover:bg-white hover:scale-105 border-2 border-emerald-200'
              }`}
            >
              <span>{currentTask.itemEmoji}</span>
              {isSelected && <span className="text-xs font-black text-amber-900 absolute -bottom-1">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Counter and Submit */}
      <div>
        <div className="text-center mb-3">
          <span className="text-xs font-bold text-slate-600 block mb-1">Jumlah Buah Terhitung:</span>
          <span className="text-3xl font-black text-emerald-700 bg-white px-6 py-1 rounded-xl shadow-inner border border-emerald-200 inline-block">
            {userCount}
          </span>
        </div>

        {feedback && <p className="text-xs font-bold text-center mb-2 text-indigo-900 bg-amber-200 py-1 rounded-xl">{feedback}</p>}

        <button
          onClick={handleVerify}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Selesai Menghitung
        </button>
      </div>
    </div>
  );
};
