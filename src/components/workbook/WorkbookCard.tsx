import React, { useState, useEffect } from 'react';
import { GeneratedMathQuestion, WorkbookSavedAnswer } from '../../types';
import { VerticalMathCard } from './VerticalMathCard';
import { Check, X, RotateCcw, Lightbulb, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { sound } from '../../services/sound';

interface WorkbookCardProps {
  question: GeneratedMathQuestion;
  index: number;
  savedAnswer?: WorkbookSavedAnswer;
  onSaveAnswer: (questionId: string, answer: string, isCorrect: boolean) => void;
  onSimilarQuestion: (original: GeneratedMathQuestion, index: number) => void;
  onOpenSteps: (question: GeneratedMathQuestion) => void;
  onFocusInput?: (questionId: string) => void;
  isFocused?: boolean;
}

export const WorkbookCard: React.FC<WorkbookCardProps> = ({
  question,
  index,
  savedAnswer,
  onSaveAnswer,
  onSimilarQuestion,
  onOpenSteps,
  onFocusInput,
  isFocused,
}) => {
  const [inputVal, setInputVal] = useState(savedAnswer?.userAnswer || '');
  const [submitted, setSubmitted] = useState(savedAnswer?.isAnswered || false);
  const [isCorrect, setIsCorrect] = useState(savedAnswer?.isCorrect || false);

  // Sync with saved answer prop
  useEffect(() => {
    if (savedAnswer) {
      setInputVal(savedAnswer.userAnswer);
      setSubmitted(savedAnswer.isAnswered);
      setIsCorrect(savedAnswer.isCorrect);
    } else {
      setInputVal('');
      setSubmitted(false);
      setIsCorrect(false);
    }
  }, [savedAnswer, question.id]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const cleanInput = inputVal.trim().toLowerCase();
    const cleanCorrect = question.answer.trim().toLowerCase();

    // Check against accepted answers
    let correct = cleanInput === cleanCorrect;
    if (!correct && question.acceptedAnswers) {
      correct = question.acceptedAnswers.some(
        (ans) => ans.trim().toLowerCase() === cleanInput
      );
    }

    setSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }

    onSaveAnswer(question.id, inputVal.trim(), correct);
  };

  const handleRetry = () => {
    setInputVal('');
    setSubmitted(false);
    setIsCorrect(false);
    sound.playClick();
  };

  return (
    <div
      id={`workbook-card-${question.id}`}
      className={`relative rounded-3xl p-4 sm:p-5 transition-all flex flex-col justify-between border-3 ${
        submitted && isCorrect
          ? 'bg-emerald-50/80 border-emerald-400 shadow-md'
          : submitted && !isCorrect
          ? 'bg-rose-50/70 border-rose-300 shadow-sm'
          : isFocused
          ? 'bg-white border-orange-400 ring-4 ring-orange-100 shadow-lg'
          : 'bg-white border-slate-200/90 hover:border-amber-300 shadow-xs hover:shadow-md'
      }`}
    >
      {/* Top Card Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-orange-700 font-black text-xs flex items-center justify-center border border-orange-200">
              #{index + 1}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {question.subCategory}
            </span>
          </div>

          {/* Auto-save & Status indicator */}
          {submitted && (
            <span
              className={`text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                isCorrect
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+10 XP ✓ Benar</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Coba Lagi</span>
                </>
              )}
            </span>
          )}
        </div>

        {/* Question Text / Visual */}
        <div className="py-2">
          <p className="text-sm sm:text-base font-black text-slate-900 leading-snug">
            {question.question}
          </p>

          {/* Vertical Math Display if applicable */}
          {question.verticalFormat && (
            <div className="flex justify-center my-2">
              <VerticalMathCard data={question.verticalFormat} />
            </div>
          )}
        </div>
      </div>

      {/* Input Form & Action Bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputVal}
              disabled={submitted && isCorrect}
              onFocus={() => {
                if (onFocusInput) onFocusInput(question.id);
              }}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (submitted && !isCorrect) {
                  setSubmitted(false);
                }
              }}
              placeholder="Tulis jawaban..."
              className={`w-full px-3.5 py-2.5 rounded-2xl font-black text-base sm:text-lg text-slate-800 border-2 transition-all outline-none ${
                submitted && isCorrect
                  ? 'bg-emerald-100/50 border-emerald-400 text-emerald-900 cursor-not-allowed'
                  : submitted && !isCorrect
                  ? 'bg-rose-50 border-rose-400 text-rose-900'
                  : 'bg-slate-50 focus:bg-white border-slate-300 focus:border-orange-500'
              }`}
            />
          </div>

          {/* Check / Submit Button */}
          {(!submitted || !isCorrect) ? (
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="py-2.5 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 text-white font-black text-sm cursor-pointer disabled:cursor-not-allowed transition-all active:scale-95 shadow-xs flex items-center justify-center"
              title="Periksa Jawaban"
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-xs">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
          )}
        </form>

        {/* Action Buttons: Soal Serupa, Langkah, Coba Lagi */}
        <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onSimilarQuestion(question, index);
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-orange-600 p-1 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors flex items-center gap-1"
              title="Buat angka baru dengan pola yang sama"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Soal Serupa</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenSteps(question);
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 p-1 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors flex items-center gap-1"
              title="Lihat cara dan langkah mengerjakan"
            >
              <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
              <span>Langkah</span>
            </button>
          </div>

          {submitted && !isCorrect && (
            <button
              type="button"
              onClick={handleRetry}
              className="text-[11px] font-black text-rose-600 hover:text-rose-700 bg-rose-100/80 hover:bg-rose-200 px-2 py-0.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Ulangi</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
