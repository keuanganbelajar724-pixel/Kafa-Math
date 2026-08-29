import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, Trophy, BarChart2, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

export const BarChartCollectorGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [data, setData] = useState<{ label: string; emoji: string; count: number; target: number }[]>([
    { label: 'Durian', emoji: '🍈', count: 0, target: 4 },
    { label: 'Manggis', emoji: '🟣', count: 0, target: 6 },
    { label: 'Rambutan', emoji: '🔴', count: 0, target: 3 },
  ]);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    sound.speak('Kumpulkan data buah panen dan buat tinggi diagram batangnya sesuai target!');
  }, []);

  const adjustCount = (index: number, delta: number) => {
    sound.playClick();
    setData((prev) => {
      const updated = [...prev];
      updated[index].count = Math.max(0, Math.min(8, updated[index].count + delta));
      return updated;
    });
  };

  const handleVerify = () => {
    const allMatch = data.every((d) => d.count === d.target);
    if (allMatch) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 50, spread: 75 });
      setScore(120);
      setGameOver(true);
    } else {
      sound.playRetry();
      setFeedback('Tinggi diagram batang belum sesuai dengan target panen. Coba periksa lagi!');
      sound.speak('Tinggi diagram batang belum sesuai.');
    }
  };

  if (gameOver) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-indigo-400 shadow-xl animate-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Ahli Statistika Cilik! 📊🚀</h3>
        <p className="text-slate-600 mb-4">Kamu berhasil membuat diagram batang data panen Nusantara dengan tepat!</p>
        <div className="flex justify-center gap-2 mb-6">
          <span className="text-4xl text-amber-400">★★★</span>
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP didapatkan!</p>
        <button
          onClick={() => onComplete(score, 3)}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow cursor-pointer"
        >
          Lanjut Petualangan 🌟
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-50 to-blue-100 rounded-3xl p-6 border-4 border-indigo-300 shadow-xl min-h-[480px] flex flex-col justify-between">
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
          <BarChart2 className="w-5 h-5 text-indigo-600" />
          <span>Diagram Batang Panen</span>
          <button
            onClick={() => sound.speak('Buat tinggi batang diagram sesuai target panen: Durian 4, Manggis 6, Rambutan 3!')}
            className="p-1.5 bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <button onClick={onExit} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg">
          Tutup
        </button>
      </div>

      <div className="text-center my-2">
        <h3 className="text-sm md:text-base font-bold text-slate-800">
          Target Panen: <span className="text-indigo-700">Durian = 4</span>, <span className="text-purple-700">Manggis = 6</span>, <span className="text-rose-700">Rambutan = 3</span>
        </h3>
      </div>

      {/* Bar Chart Visual */}
      <div className="bg-white/95 p-4 rounded-3xl border border-indigo-200 shadow-md flex justify-around items-end h-52 my-2 relative">
        {/* Y-axis grid markers */}
        <div className="absolute left-2 top-2 bottom-6 flex flex-col justify-between text-[10px] text-slate-400 font-bold pointer-events-none">
          <span>8</span>
          <span>6</span>
          <span>4</span>
          <span>2</span>
          <span>0</span>
        </div>

        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 z-10">
            <span className="font-bold text-xs text-indigo-900">{item.count} Buah</span>
            <div className="w-16 md:w-20 bg-slate-100 rounded-t-xl h-36 flex items-end p-1 shadow-inner border border-slate-200">
              <div
                className={`w-full rounded-t-lg transition-all duration-300 ${
                  idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-purple-600' : 'bg-rose-500'
                }`}
                style={{ height: `${(item.count / 8) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => adjustCount(idx, -1)}
                className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 text-xs"
              >
                -
              </button>
              <span className="text-xl">{item.emoji}</span>
              <button
                onClick={() => adjustCount(idx, 1)}
                className="w-6 h-6 rounded-lg bg-indigo-500 hover:bg-indigo-600 font-bold text-white text-xs"
              >
                +
              </button>
            </div>
            <span className="text-xs font-bold text-slate-700">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-2">
        {feedback && <p className="text-xs font-bold text-center mb-2 text-indigo-900 bg-amber-200 py-1 rounded-xl">{feedback}</p>}
        <button
          onClick={handleVerify}
          className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl shadow cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Cocokkan Data Diagram
        </button>
      </div>
    </div>
  );
};
