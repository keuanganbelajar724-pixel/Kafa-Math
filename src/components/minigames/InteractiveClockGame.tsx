import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, Trophy, Clock, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface ClockTask {
  hours: number;
  minutes: number;
  label: string;
}

export const InteractiveClockGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [userHour, setUserHour] = useState<number>(12);
  const [userMinute, setUserMinute] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const tasks: ClockTask[] = [
    { hours: 7, minutes: 0, label: 'Pukul 07:00 (Waktu Masuk Sekolah)' },
    { hours: 12, minutes: 30, label: 'Pukul 12:30 (Makan Siang)' },
    { hours: 4, minutes: 15, label: 'Pukul 04:15 (Bermain Sore)' },
  ];

  const currentTask = tasks[(round - 1) % tasks.length];

  const initRound = (r: number) => {
    const task = tasks[(r - 1) % tasks.length];
    setUserHour(12);
    setUserMinute(0);
    setFeedback(null);
    const text = `Atur jarum jam ke: ${task.label}`;
    sound.speak(text);
  };

  useEffect(() => {
    initRound(1);
  }, []);

  const handleVerify = () => {
    if (userHour === currentTask.hours && userMinute === currentTask.minutes) {
      sound.playCorrect();
      confetti({ particleCount: 45, spread: 70 });
      setScore((prev) => prev + 35);
      setFeedback('Hebat! Waktu pada jam sudah sangat tepat! ⏰✨');
      sound.speak('Hebat! Waktu pada jam sudah tepat!');

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
      setFeedback(`Saat ini jam ${userHour.toString().padStart(2, '0')}:${userMinute.toString().padStart(2, '0')}. Ayo sesuaikan lagi!`);
      sound.speak(`Coba perhatikan jarum jamnya lagi.`);
    }
  };

  if (gameOver) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-yellow-400 shadow-xl animate-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Penjaga Waktu Cilik! ⏰</h3>
        <p className="text-slate-600 mb-4">Kamu sangat mahir membaca jarum jam analog dan digital!</p>
        <div className="flex justify-center gap-2 mb-6">
          <span className="text-4xl text-amber-400">★★★</span>
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP Didapatkan!</p>
        <button
          onClick={() => onComplete(score, 3)}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md cursor-pointer"
        >
          Lanjut Petualangan 🌟
        </button>
      </div>
    );
  }

  // Calculate hand rotations
  const hourDeg = (userHour % 12) * 30 + userMinute * 0.5;
  const minuteDeg = userMinute * 6;

  return (
    <div className="bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-6 border-4 border-amber-300 shadow-xl min-h-[480px] flex flex-col justify-between">
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
          <Clock className="w-5 h-5 text-amber-600" />
          <span>Jam Interaktif ({round}/{tasks.length})</span>
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
          <h3 className="text-xl font-bold text-slate-800">{currentTask.label}</h3>
          <button
            onClick={() => sound.speak(`Atur jam ke ${currentTask.label}`)}
            className="p-1.5 bg-amber-200 text-amber-900 rounded-full hover:bg-amber-300"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clock Visual */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full bg-white border-8 border-amber-500 shadow-xl flex items-center justify-center">
          {/* Numbers around clock */}
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const radius = 65; // px from center
            const x = Math.round(radius * Math.cos(angle));
            const y = Math.round(radius * Math.sin(angle));
            return (
              <div
                key={num}
                className="absolute font-black text-xs md:text-sm text-slate-800 pointer-events-none"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                {num}
              </div>
            );
          })}

          {/* Hour Hand */}
          <div
            className="absolute w-2.5 h-14 bg-rose-600 rounded-full origin-bottom shadow transition-transform duration-200"
            style={{
              bottom: '50%',
              transform: `rotate(${hourDeg}deg)`,
            }}
          />

          {/* Minute Hand */}
          <div
            className="absolute w-1.5 h-20 bg-sky-600 rounded-full origin-bottom shadow transition-transform duration-200"
            style={{
              bottom: '50%',
              transform: `rotate(${minuteDeg}deg)`,
            }}
          />

          {/* Center Pin */}
          <div className="w-4 h-4 rounded-full bg-amber-600 border-2 border-white shadow z-10" />
        </div>

        {/* Digital Time Indicator */}
        <div className="mt-3 bg-slate-900 text-emerald-400 font-mono text-2xl font-black px-4 py-1.5 rounded-xl shadow border border-slate-700">
          {userHour.toString().padStart(2, '0')} : {userMinute.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Adjust Controls */}
      <div className="bg-white/90 p-3 rounded-2xl border border-amber-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Jarum Pendek (Jam):</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
              <button
                key={h}
                onClick={() => {
                  sound.playClick();
                  setUserHour(h);
                }}
                className={`w-6 h-6 rounded-lg text-xs font-bold cursor-pointer ${
                  userHour === h ? 'bg-rose-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Jarum Panjang (Menit):</span>
          <div className="flex gap-2">
            {[0, 15, 30, 45].map((m) => (
              <button
                key={m}
                onClick={() => {
                  sound.playClick();
                  setUserMinute(m);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  userMinute === m ? 'bg-sky-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                :{m.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="mt-2">
        {feedback && <p className="text-xs font-bold text-center mb-2 text-indigo-900 bg-amber-200 py-1 rounded-xl">{feedback}</p>}
        <button
          onClick={handleVerify}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Periksa Jam
        </button>
      </div>
    </div>
  );
};
