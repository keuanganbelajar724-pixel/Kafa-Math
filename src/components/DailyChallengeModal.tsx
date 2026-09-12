import React, { useState, useEffect } from 'react';
import { ChildProfile, QuestionItem } from '../types';
import { generateQuestion } from '../services/questionEngine';
import { sound } from '../services/sound';
import { KafaMascot } from './KafaMascot';
import confetti from 'canvas-confetti';
import {
  Flame,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Volume2,
  Trophy,
  Coins,
  Sparkles,
  Bot,
} from 'lucide-react';

interface Props {
  activeProfile: ChildProfile;
  onComplete: (xp: number, coins: number) => void;
  onAskAITutor: (q: QuestionItem) => void;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<Props> = ({
  activeProfile,
  onComplete,
  onAskAITutor,
  onClose,
}) => {
  const TOTAL = 10;
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const list: QuestionItem[] = [];
    for (let i = 0; i < TOTAL; i++) {
      list.push(generateQuestion(activeProfile.phase as any, undefined, 2));
    }
    setQuestions(list);
  }, [activeProfile.phase]);

  const currentQ = questions[index];

  useEffect(() => {
    if (currentQ && !isFinished) {
      sound.speak(currentQ.audioPrompt || currentQ.question);
      setSelectedOpt('');
      setIsAnswered(false);
      setIsCorrect(false);
    }
  }, [index, questions, isFinished]);

  if (!currentQ && !isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 text-center border-4 border-amber-300">
          <div className="animate-spin text-3xl mb-2">🔥</div>
          <p className="font-black text-slate-800">Menyiapkan Tantangan Harian...</p>
        </div>
      </div>
    );
  }

  const handleCheck = () => {
    if (!selectedOpt || isAnswered) return;
    setIsAnswered(true);
    const correct = selectedOpt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      sound.playCoin();
      setCorrectCount((prev) => prev + 1);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } else {
      sound.playRetry();
      sound.speak('Coba perhatikan penjelasannya ya 😊');
    }
  };

  const handleNext = () => {
    if (index + 1 < TOTAL) {
      setIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90 });
      // Rewards: +50 XP and +20 Coins
      onComplete(50, 20);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-orange-400 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 p-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold">
              🔥
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">Daily Math Challenge</h3>
              <p className="text-xs text-amber-100 font-semibold">Tantangan Harian 10 Soal Beruntun</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 font-black text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isFinished ? (
          <div className="p-6 text-center space-y-6 overflow-y-auto">
            <div className="text-6xl animate-bounce">🔥🏅</div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                Tantangan Harian Selesai!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
                Selamat, {activeProfile.name}!
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Kamu menjawab <strong>{correctCount} dari {TOTAL}</strong> soal dengan benar!
              </p>
            </div>

            {/* Rewards Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border-2 border-amber-200 grid grid-cols-2 gap-3 max-w-xs mx-auto">
              <div className="bg-white p-3 rounded-xl text-center border border-amber-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 block">Bonus XP</span>
                <span className="text-2xl font-black text-orange-600">+50 XP</span>
              </div>
              <div className="bg-white p-3 rounded-xl text-center border border-amber-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 block">Koin KAFA</span>
                <span className="text-2xl font-black text-amber-600">+20 🪙</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              Kembali ke Home 🚀
            </button>
          </div>
        ) : (
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Soal {index + 1} dari {TOTAL}</span>
              <span className="text-emerald-600">{correctCount} Benar</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-rose-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((index + 1) / TOTAL) * 100}%` }}
              />
            </div>

            {/* Question Box */}
            <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-black text-slate-800 leading-snug">{currentQ.question}</h2>
                <button
                  onClick={() => sound.speak(currentQ.audioPrompt || currentQ.question)}
                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-xl cursor-pointer"
                  title="Dengarkan Soal"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {currentQ.options.map((opt, i) => {
                  const isSel = selectedOpt === opt;
                  let style = 'bg-slate-50 hover:bg-amber-50 border-2 border-slate-200 text-slate-800';
                  if (isSel) style = 'bg-amber-100 border-2 border-amber-500 text-amber-950 font-black shadow-xs';
                  if (isAnswered) {
                    if (opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase()) {
                      style = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black';
                    } else if (isSel && !isCorrect) {
                      style = 'bg-rose-100 border-2 border-rose-400 text-rose-950';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => {
                        sound.playClick();
                        setSelectedOpt(opt);
                      }}
                      className={`p-3.5 rounded-xl font-bold text-left flex items-center justify-between cursor-pointer transition-all ${style}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase() && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {isAnswered && (
              <div className={`p-3 rounded-2xl text-xs font-medium ${isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
                <strong>{isCorrect ? '🎉 Benar!' : '💡 Penjelasan:'}</strong> {currentQ.explanation}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Tutup
              </button>

              {!isAnswered ? (
                <button
                  onClick={handleCheck}
                  disabled={!selectedOpt}
                  className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
                    selectedOpt
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Periksa Jawaban
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
