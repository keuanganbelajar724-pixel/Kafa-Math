import React, { useState } from 'react';
import { ChildProfile, LearningPhase } from '../types';
import { sound } from '../services/sound';
import { Sparkles, CheckCircle2, Trophy, ArrowRight, BrainCircuit, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  childProfile: ChildProfile;
  onComplete: (recommendedPhase: LearningPhase, score: number) => void;
  onClose: () => void;
}

interface DiagnosticQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  targetPhase: LearningPhase;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    question: 'Berapakah jumlah 4 buah jeruk + 3 buah jeruk?',
    options: ['5', '6', '7', '8'],
    correctAnswer: '7',
    targetPhase: LearningPhase.PONDASI,
  },
  {
    id: 2,
    question: 'Berapakah hasil dari 14 + 15?',
    options: ['27', '28', '29', '30'],
    correctAnswer: '29',
    targetPhase: LearningPhase.FASE_A,
  },
  {
    id: 3,
    question: 'Berapakah hasil perkalian 6 × 7?',
    options: ['36', '42', '48', '54'],
    correctAnswer: '42',
    targetPhase: LearningPhase.FASE_B,
  },
  {
    id: 4,
    question: 'Manakah pecahan yang senilai dengan 1/2?',
    options: ['2/4', '2/5', '3/8', '1/4'],
    correctAnswer: '2/4',
    targetPhase: LearningPhase.FASE_B,
  },
  {
    id: 5,
    question: 'Berapakah 25% dari 200?',
    options: ['25', '50', '75', '100'],
    correctAnswer: '50',
    targetPhase: LearningPhase.FASE_C,
  },
];

export const DiagnosticTestModal: React.FC<Props> = ({ childProfile, onComplete, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [id: number]: string }>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [resultPhase, setResultPhase] = useState<LearningPhase>(LearningPhase.FASE_A);
  const [finalScore, setFinalScore] = useState<number>(0);

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIdx];

  const handleSelectOption = (opt: string) => {
    sound.playClick();
    const updated = { ...answers, [currentQ.id]: opt };
    setAnswers(updated);

    if (currentIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Evaluate test
      let score = 0;
      DIAGNOSTIC_QUESTIONS.forEach((q) => {
        if (updated[q.id] === q.correctAnswer) {
          score += 20;
        }
      });
      setFinalScore(score);

      let phase = LearningPhase.PONDASI;
      if (score >= 80) phase = LearningPhase.FASE_C;
      else if (score >= 60) phase = LearningPhase.FASE_B;
      else if (score >= 40) phase = LearningPhase.FASE_A;

      setResultPhase(phase);
      setIsFinished(true);
      sound.playFanfare();
      confetti({ particleCount: 60, spread: 75 });
    }
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center border-4 border-amber-400 shadow-2xl animate-in zoom-in">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-3 animate-bounce" />
          <h3 className="text-xl font-black text-slate-800">Tes Penempatan Selesai! 🎉</h3>
          <p className="text-xs text-slate-600 mt-1 mb-4">
            Kerja bagus <strong className="text-slate-900">{childProfile.name}</strong>! Skor kamu: {finalScore}/100.
          </p>

          <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl mb-6 text-left">
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700 block">
              Rekomendasi Level Belajar:
            </span>
            <h4 className="text-lg font-black text-amber-950 mt-0.5">{resultPhase}</h4>
            <p className="text-xs text-amber-800 mt-1">
              Jalur petualangan telah disesuaikan agar materi terasa seru, menantang, dan pas dengan kemampuanmu!
            </p>
          </div>

          <button
            onClick={() => onComplete(resultPhase, finalScore)}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105"
          >
            Mulai Belajar di Level Ini 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-indigo-300 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" />
            <h3 className="font-black text-sm md:text-base">
              Tes Diagnostik Cepat (Soal {currentIdx + 1}/{DIAGNOSTIC_QUESTIONS.length})
            </h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer">
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 w-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question content */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
            {currentQ.question}
          </h2>

          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                className="w-full p-3.5 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 border-2 border-slate-200 rounded-2xl font-bold text-base text-slate-800 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <span>{opt}</span>
                <span className="text-xs text-slate-400">Pilih</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
