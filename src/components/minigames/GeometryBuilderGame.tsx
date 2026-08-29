import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, Trophy, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

export const GeometryBuilderGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [placedRoof, setPlacedRoof] = useState<boolean>(false);
  const [placedWall, setPlacedWall] = useState<boolean>(false);
  const [placedDoor, setPlacedDoor] = useState<boolean>(false);
  const [placedWindow, setPlacedWindow] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    sound.speak('Ayo bangun rumah adat dengan memasang bentuk segitiga, persegi, dan persegi panjang!');
  }, []);

  const handlePlace = (shape: string) => {
    sound.playClick();
    if (shape === 'triangle') setPlacedRoof(true);
    if (shape === 'square') setPlacedWall(true);
    if (shape === 'rect') setPlacedDoor(true);
    if (shape === 'circle') setPlacedWindow(true);
  };

  const isComplete = placedRoof && placedWall && placedDoor && placedWindow;

  const handleFinish = () => {
    if (isComplete) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 50, spread: 80 });
      setScore(100);
      setGameOver(true);
    } else {
      sound.playRetry();
      setFeedback('Rumah belum lengkap! Pasang semua bagian bentuk geometrinya ya!');
    }
  };

  if (gameOver) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-teal-400 shadow-xl animate-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Arsitek Geometri Hebat! 🏠✨</h3>
        <p className="text-slate-600 mb-4">Kamu berhasil menyusun bentuk segitiga, persegi, persegi panjang, dan lingkaran!</p>
        <div className="flex justify-center gap-2 mb-6">
          <span className="text-4xl text-amber-400">★★★</span>
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP didapatkan!</p>
        <button
          onClick={() => onComplete(score, 3)}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-2xl shadow cursor-pointer"
        >
          Lanjut Petualangan 🌟
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-teal-100 via-emerald-50 to-teal-200 rounded-3xl p-6 border-4 border-teal-300 shadow-xl min-h-[480px] flex flex-col justify-between">
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
          <span>🏠</span>
          <span>Bangun Rumah Geometri</span>
          <button
            onClick={() => sound.speak('Ayo pasang semua bentuk geometri ke dalam gambar rumah!')}
            className="p-1.5 bg-teal-100 text-teal-800 rounded-full hover:bg-teal-200"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <button onClick={onExit} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg">
          Tutup
        </button>
      </div>

      <div className="text-center my-2">
        <h3 className="text-lg font-bold text-slate-800">Sentuh bentuk geometri untuk memasangnya ke pondasi rumah!</h3>
      </div>

      {/* House Canvas */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="w-56 h-56 bg-white rounded-3xl border-4 border-dashed border-teal-400 p-4 relative flex flex-col items-center justify-center shadow-inner">
          {/* Roof (Triangle) */}
          <div
            className={`w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[50px] transition-all duration-300 ${
              placedRoof ? 'border-b-amber-500 scale-100 opacity-100' : 'border-b-slate-200 opacity-40'
            }`}
          />

          {/* Wall (Square) */}
          <div
            className={`w-32 h-28 relative flex items-center justify-center transition-all duration-300 ${
              placedWall ? 'bg-teal-600 border-2 border-teal-700' : 'bg-slate-200 border-2 border-dashed border-slate-300'
            }`}
          >
            {/* Window (Circle) */}
            <div
              className={`w-7 h-7 rounded-full absolute top-2 transition-all ${
                placedWindow ? 'bg-amber-300 border-2 border-amber-500 shadow' : 'bg-slate-300 border border-slate-400 opacity-50'
              }`}
            />

            {/* Door (Rectangle) */}
            <div
              className={`w-8 h-14 absolute bottom-0 transition-all ${
                placedDoor ? 'bg-rose-700 border border-rose-900 rounded-t' : 'bg-slate-300 border border-slate-400 opacity-50'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Shapes Selector */}
      <div className="bg-white/90 p-4 rounded-2xl border border-teal-200">
        <p className="text-xs font-bold text-slate-700 mb-2">Bahan Bangunan Geometri:</p>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handlePlace('triangle')}
            className={`p-2 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
              placedRoof ? 'bg-amber-100 border-amber-400 opacity-50' : 'bg-amber-50 hover:bg-amber-100 border-amber-300'
            }`}
          >
            <span className="text-2xl">🔺</span>
            <span className="text-xs font-bold text-amber-900">Atap (Segitiga)</span>
          </button>

          <button
            onClick={() => handlePlace('square')}
            className={`p-2 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
              placedWall ? 'bg-teal-100 border-teal-400 opacity-50' : 'bg-teal-50 hover:bg-teal-100 border-teal-300'
            }`}
          >
            <span className="text-2xl">🟦</span>
            <span className="text-xs font-bold text-teal-900">Dinding (Persegi)</span>
          </button>

          <button
            onClick={() => handlePlace('rect')}
            className={`p-2 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
              placedDoor ? 'bg-rose-100 border-rose-400 opacity-50' : 'bg-rose-50 hover:bg-rose-100 border-rose-300'
            }`}
          >
            <span className="text-2xl">🚪</span>
            <span className="text-xs font-bold text-rose-900">Pintu (Persegi Pjg)</span>
          </button>

          <button
            onClick={() => handlePlace('circle')}
            className={`p-2 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
              placedWindow ? 'bg-sky-100 border-sky-400 opacity-50' : 'bg-sky-50 hover:bg-sky-100 border-sky-300'
            }`}
          >
            <span className="text-2xl">🟡</span>
            <span className="text-xs font-bold text-sky-900">Jendela (Lingkaran)</span>
          </button>
        </div>
      </div>

      <div className="mt-2">
        {feedback && <p className="text-xs font-bold text-center mb-2 text-rose-700 bg-rose-100 py-1 rounded-xl">{feedback}</p>}
        <button
          onClick={handleFinish}
          className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-2xl shadow cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Selesaikan Bangunan
        </button>
      </div>
    </div>
  );
};
