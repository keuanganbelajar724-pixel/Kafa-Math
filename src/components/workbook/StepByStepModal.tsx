import React from 'react';
import { GeneratedMathQuestion } from '../../types';
import { X, Sparkles, CheckCircle2, Bot, Lightbulb } from 'lucide-react';
import { VerticalMathCard } from './VerticalMathCard';

interface StepByStepModalProps {
  question: GeneratedMathQuestion;
  childName: string;
  onAskAITutor: () => void;
  onClose: () => void;
}

export const StepByStepModal: React.FC<StepByStepModalProps> = ({
  question,
  childName,
  onAskAITutor,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 border-3 border-amber-300 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
              💡
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
                Langkah Demi Langkah
              </h3>
              <span className="text-[11px] font-bold text-orange-600">
                {question.category} • {question.subCategory}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Review & Vertical Display */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1">
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Soal:</p>
            <p className="text-base sm:text-lg font-black text-slate-900 mt-1">
              {question.question}
            </p>

            {question.verticalFormat && (
              <div className="flex justify-center mt-2">
                <VerticalMathCard data={question.verticalFormat} />
              </div>
            )}
          </div>

          {/* Hint */}
          {question.hint && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex items-start gap-2.5">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-blue-900 block">Petunjuk Kunci:</span>
                <p className="text-xs text-blue-800 font-medium mt-0.5">{question.hint}</p>
              </div>
            </div>
          )}

          {/* Step-by-Step Sequence */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Cara Menyelesaikannya:
            </h4>
            <div className="space-y-2">
              {question.stepByStepSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium"
                >
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 leading-relaxed">{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Answer Reveal Box */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs sm:text-sm font-black text-emerald-900">
                Jawaban yang benar:
              </span>
            </div>
            <span className="text-lg sm:text-xl font-black text-emerald-700 px-3 py-1 bg-white rounded-xl border border-emerald-200 shadow-2xs">
              {question.answer}
            </span>
          </div>
        </div>

        {/* Footer Actions: Socratic AI & Close */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onAskAITutor}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>Tanya Tutor AI Kaka (Penjelasan Interaktif)</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
