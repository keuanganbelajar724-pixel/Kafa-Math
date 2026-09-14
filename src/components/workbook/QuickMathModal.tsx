import React, { useState, useEffect } from 'react';
import { ChildProfile, GeneratedMathQuestion } from '../../types';
import { MathQuestionGenerator } from '../../services/mathQuestionGenerator';
import { loadQuickMathBest, saveQuickMathBest } from '../../services/storage';
import { sound } from '../../services/sound';
import { X, Zap, Trophy, Timer, RotateCcw, Check, Sparkles } from 'lucide-react';

interface QuickMathModalProps {
  activeProfile: ChildProfile;
  onClose: () => void;
  onRewardXP: (xp: number, coins: number) => void;
}

export const QuickMathModal: React.FC<QuickMathModalProps> = ({
  activeProfile,
  onClose,
  onRewardXP,
}) => {
  const [duration, setDuration] = useState<30 | 60 | 120>(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState<GeneratedMathQuestion | null>(null);
  const [inputVal, setInputVal] = useState('');

  // Load high score
  useEffect(() => {
    const best = loadQuickMathBest(activeProfile.id, duration);
    setBestScore(best);
  }, [activeProfile.id, duration]);

  // Timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const generateNextQuestion = () => {
    const ops = ['penjumlahan', 'pengurangan', 'perkalian'] as const;
    const op = ops[Math.floor(Math.random() * ops.length)];
    const q = MathQuestionGenerator.generateSingleQuestion(
      op,
      2,
      'mudah',
      2,
      1,
      Date.now() + Math.random()
    );
    setCurrentQuestion(q);
    setInputVal('');
  };

  const handleStartGame = () => {
    sound.playClick();
    setScore(0);
    setWrongCount(0);
    setTimeLeft(duration);
    setIsPlaying(true);
    generateNextQuestion();
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    sound.playCelebration();
    saveQuickMathBest(activeProfile.id, duration, score);
    setBestScore((prev) => Math.max(prev, score));
    onRewardXP(score * 5, Math.floor(score / 2));
  };

  const handleCheckAnswer = (val: string) => {
    if (!currentQuestion) return;
    if (val.trim() === currentQuestion.answer.trim()) {
      sound.playCorrect();
      setScore((prev) => prev + 1);
      generateNextQuestion();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border-3 border-amber-300 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl">
              ⚡
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">
                Quick Math Kilat
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Jawab sebanyak mungkin sebelum waktu habis!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isPlaying ? (
          /* Start Screen */
          <div className="py-6 space-y-5 text-center">
            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wider block">
                Pilih Durasi Waktu:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([30, 60, 120] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer border-2 ${
                      duration === d
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {d} Detik
                  </button>
                ))}
              </div>
            </div>

            {/* Best Score Banner */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Trophy className="w-5 h-5 text-amber-600" />
                <span>Rekor Terbaik ({duration}s):</span>
              </div>
              <span className="text-xl font-black text-amber-700">{bestScore} Soal</span>
            </div>

            {/* Last Game Stats if any */}
            {score > 0 && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800">
                Selesai! Kamu menjawab {score} soal benar dalam {duration} detik 🎉
              </div>
            )}

            <button
              onClick={handleStartGame}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-lg rounded-2xl shadow-lg cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>Mulai Tantangan!</span>
            </button>
          </div>
        ) : (
          /* Active Game Screen */
          <div className="py-6 space-y-5">
            {/* Top Stat row: Timer & Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-xl font-black text-sm">
                <Timer className="w-4 h-4 animate-spin" />
                <span>{timeLeft} dtk</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-black text-sm">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Skor: {score}</span>
              </div>
            </div>

            {/* Big Calculation Card */}
            {currentQuestion && (
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-amber-300 text-center space-y-3">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-wider">
                  {currentQuestion.numberSentence || currentQuestion.question}
                </div>

                <div className="pt-2">
                  <input
                    type="number"
                    autoFocus
                    value={inputVal}
                    onChange={(e) => {
                      setInputVal(e.target.value);
                      handleCheckAnswer(e.target.value);
                    }}
                    placeholder="?"
                    className="w-36 text-center py-3 bg-white rounded-2xl border-3 border-orange-400 font-black text-3xl outline-none text-slate-800 shadow-xs"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
