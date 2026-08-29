import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, Trophy, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

export const OrderNumberTrainGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [targetOrder, setTargetOrder] = useState<number[]>([3, 7, 12, 18, 25]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [trainSlots, setTrainSlots] = useState<(number | null)[]>([null, null, null, null, null]);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const initGame = () => {
    const nums = [4, 9, 15, 22, 30];
    setTargetOrder(nums);
    setAvailableNumbers([...nums].sort(() => Math.random() - 0.5));
    setTrainSlots([null, null, null, null, null]);
    setFeedback(null);
    sound.speak('Susun angka-angka ini ke dalam gerbong kereta dari yang TERKECIL sampai TERBESAR!');
  };

  useEffect(() => {
    initGame();
  }, []);

  const handlePickNumber = (num: number) => {
    sound.playClick();
    const firstEmptyIndex = trainSlots.findIndex((s) => s === null);
    if (firstEmptyIndex !== -1) {
      const updatedSlots = [...trainSlots];
      updatedSlots[firstEmptyIndex] = num;
      setTrainSlots(updatedSlots);
      setAvailableNumbers((prev) => prev.filter((n) => n !== num));
    }
  };

  const handleRemoveSlot = (index: number) => {
    const num = trainSlots[index];
    if (num !== null) {
      sound.playClick();
      const updatedSlots = [...trainSlots];
      updatedSlots[index] = null;
      setTrainSlots(updatedSlots);
      setAvailableNumbers((prev) => [...prev, num]);
    }
  };

  const handleVerify = () => {
    const isFull = trainSlots.every((s) => s !== null);
    if (!isFull) {
      sound.playRetry();
      setFeedback('Isi semua gerbong kereta terlebih dahulu!');
      return;
    }

    const isCorrect = trainSlots.every((val, idx) => val === targetOrder[idx]);
    if (isCorrect) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 50, spread: 80 });
      setScore(100);
      setGameOver(true);
    } else {
      sound.playRetry();
      setFeedback('Urutan angka belum tepat dari terkecil ke terbesar. Yuk tata ulang gerbongnya!');
      sound.speak('Urutan angka belum tepat, coba susun lagi ya.');
    }
  };

  if (gameOver) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-blue-400 shadow-xl animate-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Masinis Angka Nusantara! 🚂✨</h3>
        <p className="text-slate-600 mb-4">Kereta api matematika siap berangkat dengan urutan bilangan yang sempurna!</p>
        <div className="flex justify-center gap-2 mb-6">
          <span className="text-4xl text-amber-400">★★★</span>
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP didapatkan!</p>
        <button
          onClick={() => onComplete(score, 3)}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow cursor-pointer"
        >
          Lanjut Petualangan 🌟
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-sky-100 via-blue-50 to-indigo-100 rounded-3xl p-6 border-4 border-blue-300 shadow-xl min-h-[480px] flex flex-col justify-between">
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
          <span>🚂</span>
          <span>Kereta Susun Angka</span>
          <button
            onClick={() => sound.speak('Susun angka ke gerbong kereta dari yang terkecil sampai terbesar!')}
            className="p-1.5 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <button onClick={onExit} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg">
          Tutup
        </button>
      </div>

      <div className="text-center my-2">
        <h3 className="text-base md:text-lg font-bold text-slate-800">
          Susun dari <span className="text-emerald-700 font-black">Terkecil</span> ke <span className="text-blue-700 font-black">Terbesar</span>!
        </h3>
      </div>

      {/* Train Carriages */}
      <div className="bg-white/90 p-4 rounded-3xl border border-blue-200 shadow flex items-center gap-2 overflow-x-auto my-3 pb-4">
        {/* Locomotive */}
        <div className="flex-shrink-0 w-16 h-20 bg-indigo-600 rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-md border-2 border-indigo-700">
          <span className="text-2xl">🚂</span>
          <span className="text-[10px]">Kepala</span>
        </div>

        {/* Carriages */}
        {trainSlots.map((val, idx) => (
          <div
            key={idx}
            onClick={() => handleRemoveSlot(idx)}
            className={`flex-shrink-0 w-16 h-20 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              val !== null
                ? 'bg-amber-400 border-amber-600 text-slate-900 shadow-md font-black text-2xl'
                : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {val !== null ? (
              <span>{val}</span>
            ) : (
              <span className="text-xs font-bold">Gerbong {idx + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* Available Number Cards */}
      <div className="bg-white/90 p-4 rounded-2xl border border-blue-200">
        <p className="text-xs font-bold text-slate-700 mb-2">Sentuh angka untuk dimasukkan ke gerbong:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {availableNumbers.map((num, i) => (
            <button
              key={i}
              onClick={() => handlePickNumber(num)}
              className="w-14 h-14 bg-gradient-to-b from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-2xl rounded-2xl shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          {availableNumbers.length === 0 && (
            <span className="text-xs text-slate-400 font-bold py-3">Semua angka sudah dimasukkan ke gerbong!</span>
          )}
        </div>
      </div>

      <div className="mt-2">
        {feedback && <p className="text-xs font-bold text-center mb-2 text-indigo-900 bg-amber-200 py-1 rounded-xl">{feedback}</p>}
        <button
          onClick={handleVerify}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Berangkatkan Kereta
        </button>
      </div>
    </div>
  );
};
