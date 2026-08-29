import React, { useState, useEffect } from 'react';
import { QuestionItem } from '../types';
import { sound } from '../services/sound';
import { Volume2, Lightbulb, Bot, CheckCircle, XCircle, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  question: QuestionItem;
  childName: string;
  onAnswerCorrect: (xpReward: number, coinReward: number) => void;
  onAnswerIncorrect: () => void;
  onAskAITutor: (q: QuestionItem) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<Props> = ({
  question,
  childName,
  onAnswerCorrect,
  onAnswerIncorrect,
  onAskAITutor,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0); // 0: none, 1: hint1, 2: hint2, 3: hint3
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  useEffect(() => {
    // Speak question upon opening
    sound.speak(question.audioPrompt || question.question);
  }, [question]);

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isAnswered) return;

    setIsAnswered(true);
    const correct = selectedOption.trim() === question.correctAnswer.trim();
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      sound.playCoin();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      const msg = 'Jawabanmu benar! Luar biasa! 🎉';
      setFeedbackMessage(msg);
      sound.speak(msg);
    } else {
      sound.playRetry();
      const msg = 'Belum tepat. Coba periksa petunjuk atau hitung kembali yuk! ✨';
      setFeedbackMessage(msg);
      sound.speak(msg);
      onAnswerIncorrect();
    }
  };

  const handleNext = () => {
    if (isCorrect) {
      onAnswerCorrect(20, 10);
    } else {
      onClose();
    }
  };

  const unlockNextHint = () => {
    sound.playClick();
    const nextLevel = Math.min(3, hintLevel + 1);
    setHintLevel(nextLevel);
    let hintText = '';
    if (nextLevel === 1) hintText = question.hint1;
    if (nextLevel === 2) hintText = question.hint2;
    if (nextLevel === 3) hintText = question.hint3;
    sound.speak(`Petunjuk tingkat ${nextLevel}: ${hintText}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-1.5 rounded-xl text-lg font-bold">🎯</span>
            <div>
              <h3 className="font-black text-sm md:text-base leading-tight">{question.topicTitle}</h3>
              <p className="text-[11px] text-amber-100 font-medium">{question.competency}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Question Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Story context badge */}
          {question.contextStory && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 font-medium flex items-start gap-2">
              <span className="text-base">📖</span>
              <span>{question.contextStory}</span>
            </div>
          )}

          {/* Question Text with Voice Read button */}
          <div className="flex items-start justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
              {question.question}
            </h2>
            <button
              onClick={() => sound.speak(question.audioPrompt || question.question)}
              className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl cursor-pointer flex-shrink-0 transition-transform active:scale-90"
              title="Dengarkan Soal"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Visual representations (Objects, Fruit visualizer, etc.) */}
          {question.visualType === 'objects' && question.visualData && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-wrap justify-center gap-3">
              {question.visualData.count ? (
                Array.from({ length: question.visualData.count }).map((_, i) => (
                  <span key={i} className="text-3xl md:text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                    {question.visualData.emoji}
                  </span>
                ))
              ) : question.visualData.groupA ? (
                <div className="flex justify-around w-full items-center">
                  <div className="text-center bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                    <span className="text-xs font-bold text-slate-700 block mb-1">Kelompok A ({question.visualData.groupA.count})</span>
                    <div className="flex gap-1 text-2xl">
                      {Array.from({ length: question.visualData.groupA.count }).map((_, i) => (
                        <span key={i}>{question.visualData.groupA.emoji}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-slate-400 font-bold text-sm">VS</div>
                  <div className="text-center bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                    <span className="text-xs font-bold text-slate-700 block mb-1">Kelompok B ({question.visualData.groupB.count})</span>
                    <div className="flex gap-1 text-2xl">
                      {Array.from({ length: question.visualData.groupB.count }).map((_, i) => (
                        <span key={i}>{question.visualData.groupB.emoji}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let btnStyle = 'bg-white border-2 border-slate-200 hover:border-amber-400 text-slate-800';

              if (isSelected) {
                btnStyle = 'bg-amber-100 border-2 border-amber-500 text-amber-950 shadow-md scale-[1.01]';
              }

              if (isAnswered) {
                if (opt.trim() === question.correctAnswer.trim()) {
                  btnStyle = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black shadow-md';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-100 border-2 border-rose-400 text-rose-950 opacity-80';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`p-3.5 rounded-2xl font-bold text-base md:text-lg transition-all cursor-pointer text-left flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isSelected && !isAnswered && <span className="w-3 h-3 rounded-full bg-amber-500"></span>}
                  {isAnswered && opt.trim() === question.correctAnswer.trim() && (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  )}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                </button>
              );
            })}
          </div>

          {/* 3-Level Hint System */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Sistem Petunjuk ({hintLevel}/3)</span>
              </div>
              <div className="flex items-center gap-2">
                {hintLevel < 3 && (
                  <button
                    onClick={unlockNextHint}
                    className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-2.5 py-1 rounded-xl cursor-pointer transition-colors"
                  >
                    Buka Petunjuk {hintLevel + 1} 💡
                  </button>
                )}
                <button
                  onClick={() => onAskAITutor(question)}
                  className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-2.5 py-1 rounded-xl cursor-pointer flex items-center gap-1"
                >
                  <Bot className="w-3.5 h-3.5" /> Tanya Kaka AI
                </button>
              </div>
            </div>

            {/* Hint disclosures */}
            {hintLevel >= 1 && (
              <div className="text-xs bg-amber-100/70 p-2.5 rounded-xl text-amber-900 border border-amber-200 animate-in fade-in">
                <strong>💡 Petunjuk 1:</strong> {question.hint1}
              </div>
            )}
            {hintLevel >= 2 && (
              <div className="text-xs bg-orange-100/70 p-2.5 rounded-xl text-orange-950 border border-orange-200 animate-in fade-in">
                <strong>💡 Petunjuk 2 (Contoh):</strong> {question.hint2}
              </div>
            )}
            {hintLevel >= 3 && (
              <div className="text-xs bg-purple-100/70 p-2.5 rounded-xl text-purple-950 border border-purple-200 animate-in fade-in">
                <strong>💡 Petunjuk 3 (Langkah):</strong> {question.hint3}
              </div>
            )}
          </div>

          {/* Explanation if answered */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl border text-sm font-medium ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
              <div className="font-bold mb-1 flex items-center gap-2">
                {isCorrect ? '🎉 ' + feedbackMessage : '💡 ' + feedbackMessage}
              </div>
              <p className="text-xs text-slate-700 mt-1">
                <strong>Penjelasan:</strong> {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-sm hover:bg-slate-100 cursor-pointer"
          >
            Batal
          </button>

          {!isAnswered ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedOption}
              className={`px-6 py-2.5 rounded-2xl font-bold text-sm md:text-base flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                selectedOption
                  ? 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" /> Periksa Jawaban
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm md:text-base rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              {isCorrect ? 'Ambil Reward (+20 XP)' : 'Coba Lagi Nanti'} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
