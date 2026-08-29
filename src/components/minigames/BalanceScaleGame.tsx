import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, Trophy, Scale, CheckCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

export const BalanceScaleGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(8); // kg
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const targets = [
    { weight: 6, label: '1 Keranjang Buah Semangka (6 kg)' },
    { weight: 9, label: '1 Peti Buah Durian Manis (9 kg)' },
    { weight: 12, label: '1 Karung Beras Pandan Wangi (12 kg)' },
  ];

  const currentTarget = targets[(round - 1) % targets.length];

  const initRound = (r: number) => {
    const t = targets[(r - 1) % targets.length];
    setTargetWeight(t.weight);
    setCurrentWeight(0);
    setFeedback(null);
    sound.speak(`Seimbangkan timbangan dengan beban ${t.weight} kilogram!`);
  };

  useEffect(() => {
    initRound(1);
  }, []);

  const addWeight = (w: number) => {
    sound.playClick();
    setCurrentWeight((prev) => prev + w);
  };

  const resetWeights = () => {
    sound.playClick();
    setCurrentWeight(0);
  };

  const handleVerify = () => {
    if (currentWeight === targetWeight) {
      sound.playCorrect();
      confetti({ particleCount: 45, spread: 70 });
      setScore((prev) => prev + 35);
      setFeedback('Luar biasa! Timbangan tepat seimbang! ⚖️✨');
      sound.speak('Luar biasa! Timbangan seimbang!');

      setTimeout(() => {
        if (round >= targets.length) {
          setGameOver(true);
          sound.playFanfare();
        } else {
          setRound((prev) => prev + 1);
          initRound(round + 1);
        }
      }, 1400);
    } else if (currentWeight < targetWeight) {
      sound.playRetry();
      const diff = targetWeight - currentWeight;
      setFeedback(`Masih kurang ${diff} kg lagi. Tambahkan anak timbangan yuk!`);
      sound.speak(`Masih kurang bebannya.`);
    } else {
      sound.playRetry();
      const excess = currentWeight - targetWeight;
      setFeedback(`Kelebihan ${excess} kg. Kurangi beban agar seimbang!`);
      sound.speak(`Kelebihan bebannya.`);
    }
  };

  if (gameOver) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-cyan-400 shadow-xl animate-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Ahli Timbangan Nusantara! ⚖️</h3>
        <p className="text-slate-600 mb-4">Kamu sangat mahir menyeimbangkan neraca dan satuan kilogram!</p>
        <div className="flex justify-center gap-2 mb-6">
          <span className="text-4xl text-amber-400">★★★</span>
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP didapatkan!</p>
        <button
          onClick={() => onComplete(score, 3)}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-2xl shadow cursor-pointer"
        >
          Lanjut Petualangan 🌟
        </button>
      </div>
    );
  }

  // Calculate scale tilt angle
  const diff = currentWeight - targetWeight;
  const tiltAngle = Math.max(-15, Math.min(15, diff * 3));

  return (
    <div className="bg-gradient-to-b from-cyan-100 via-sky-50 to-blue-100 rounded-3xl p-6 border-4 border-cyan-300 shadow-xl min-h-[480px] flex flex-col justify-between">
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
          <Scale className="w-5 h-5 text-cyan-600" />
          <span>Timbangan Neraca ({round}/{targets.length})</span>
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
        <div className="flex justify-center items-center gap-2">
          <h3 className="text-lg md:text-xl font-bold text-slate-800">
            Seimbangkan beban: <span className="text-cyan-700 font-black">{currentTarget.label}</span>
          </h3>
          <button
            onClick={() => sound.speak(`Seimbangkan timbangan dengan beban ${targetWeight} kilogram!`)}
            className="p-1.5 bg-cyan-100 text-cyan-800 rounded-full hover:bg-cyan-200"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Balance Scale */}
      <div className="flex flex-col items-center justify-center my-4">
        <div className="w-64 md:w-80 h-32 relative flex flex-col items-center justify-center">
          {/* Central Fulcrum */}
          <div className="w-4 h-20 bg-slate-700 rounded-t-lg z-10" />
          <div className="w-16 h-4 bg-slate-800 rounded-full z-10" />

          {/* Tilting Beam */}
          <div
            className="absolute top-8 w-60 md:w-72 h-3 bg-amber-600 rounded-full flex justify-between items-center px-4 transition-transform duration-300 shadow-md"
            style={{ transform: `rotate(${tiltAngle}deg)` }}
          >
            {/* Left Pan (Target) */}
            <div className="relative -bottom-12 flex flex-col items-center">
              <div className="w-1 h-8 bg-slate-500" />
              <div className="w-20 h-10 bg-slate-300 rounded-b-2xl border-2 border-slate-400 flex items-center justify-center shadow-md font-black text-sm text-slate-800">
                📦 {targetWeight} kg
              </div>
            </div>

            {/* Right Pan (User Weights) */}
            <div className="relative -bottom-12 flex flex-col items-center">
              <div className="w-1 h-8 bg-slate-500" />
              <div className="w-20 h-10 bg-cyan-200 rounded-b-2xl border-2 border-cyan-400 flex items-center justify-center shadow-md font-black text-sm text-cyan-900">
                ⚖️ {currentWeight} kg
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weights Options */}
      <div className="bg-white/90 p-4 rounded-2xl border border-cyan-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-700">Pilih Anak Timbangan:</span>
          <button onClick={resetWeights} className="text-xs text-rose-600 font-bold flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Kosongkan
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '+ 1 kg', w: 1 },
            { label: '+ 2 kg', w: 2 },
            { label: '+ 3 kg', w: 3 },
            { label: '+ 5 kg', w: 5 },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => addWeight(item.w)}
              className="py-2.5 bg-cyan-100 hover:bg-cyan-500 hover:text-white text-cyan-900 font-black rounded-xl border border-cyan-300 transition-all cursor-pointer text-sm"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="mt-2">
        {feedback && <p className="text-xs font-bold text-center mb-2 text-indigo-900 bg-amber-200 py-1 rounded-xl">{feedback}</p>}
        <button
          onClick={handleVerify}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-2xl shadow cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Cek Keseimbangan
        </button>
      </div>
    </div>
  );
};
