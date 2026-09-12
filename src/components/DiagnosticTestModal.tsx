import React, { useState } from 'react';
import { ChildProfile, LearningPhase, PrimaryStage, MathDomain, QuestionCognitiveType } from '../types';
import { sound } from '../services/sound';
import { PRIMARY_STAGES, evaluateDiagnosticTest } from '../data/cambridgeCurriculumData';
import { Sparkles, CheckCircle2, Trophy, ArrowRight, BrainCircuit, X, Star, Compass, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  childProfile: ChildProfile;
  onComplete: (recommendedPhase: LearningPhase, score: number, stage?: PrimaryStage, assessment?: any) => void;
  onClose: () => void;
}

interface DiagnosticQuestion {
  id: number;
  question: string;
  englishQuestion?: string;
  options: string[];
  correctAnswer: string;
  domain: MathDomain;
  cognitiveType: QuestionCognitiveType;
  skillLabel: string;
  targetStage: PrimaryStage;
}

const ADAPTIVE_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    question: 'Berapa banyak buah apel ini: 🍎🍎🍎🍎 + 🍎🍎🍎 ?',
    englishQuestion: 'How many apples altogether: 🍎🍎🍎🍎 + 🍎🍎🍎 ?',
    options: ['5', '6', '7', '8'],
    correctAnswer: '7',
    domain: 'number',
    cognitiveType: 'fluency',
    skillLabel: 'Visual Counting & Addition',
    targetStage: 1,
  },
  {
    id: 2,
    question: 'Manakah bangun datar yang memiliki tepat 3 sisi lurus dan 3 sudut?',
    englishQuestion: 'Which 2D shape has exactly 3 straight sides and 3 corners?',
    options: ['Segitiga (Triangle)', 'Persegi (Square)', 'Lingkaran (Circle)', 'Persegi Panjang (Rectangle)'],
    correctAnswer: 'Segitiga (Triangle)',
    domain: 'geometry_measure',
    cognitiveType: 'concept',
    skillLabel: '2D Shape Properties',
    targetStage: 1,
  },
  {
    id: 3,
    question: 'Berapakah nilai tempat angka 4 pada bilangan 48?',
    englishQuestion: 'What is the place value of digit 4 in the number 48?',
    options: ['4 Puluhan (40)', '4 Satuan (4)', '4 Ratusan (400)', '8 Puluhan'],
    correctAnswer: '4 Puluhan (40)',
    domain: 'number',
    cognitiveType: 'concept',
    skillLabel: 'Place Value to 100',
    targetStage: 2,
  },
  {
    id: 4,
    question: 'Manakah cara mental paling efisien untuk menghitung 29 + 16?',
    englishQuestion: 'Which is the most efficient mental strategy for 29 + 16?',
    options: ['(29 + 1) = 30, lalu 30 + 15 = 45', 'Hitung dengan jari 16 kali', '29 + 10 = 39 saja', 'Tidak bisa dihitung di kepala'],
    correctAnswer: '(29 + 1) = 30, lalu 30 + 15 = 45',
    domain: 'number',
    cognitiveType: 'reasoning',
    skillLabel: 'Mental Addition Strategies',
    targetStage: 2,
  },
  {
    id: 5,
    question: 'Perhatikan pola angka ini: 5, 10, 15, 20, ... Berapakah angka berikutnya dan aturannya?',
    englishQuestion: 'Look at the sequence: 5, 10, 15, 20, ... What is the next number and rule?',
    options: ['25 (Aturan: Tambah 5)', '30 (Aturan: Kali 2)', '21 (Aturan: Tambah 1)', '24 (Aturan: Tambah 4)'],
    correctAnswer: '25 (Aturan: Tambah 5)',
    domain: 'number',
    cognitiveType: 'concept',
    skillLabel: 'Number Patterns & Sequences',
    targetStage: 2,
  },
  {
    id: 6,
    question: 'Ibu memotong kue lapis menjadi 4 potong sama besar. Budi memakan 1 potong. Berapa bagian kue yang dimakan Budi?',
    englishQuestion: 'A cake is cut into 4 equal slices. Budi eats 1 slice. What fraction did Budi eat?',
    options: ['1/4 bagian', '1/2 bagian', '3/4 bagian', '4/1 bagian'],
    correctAnswer: '1/4 bagian',
    domain: 'number',
    cognitiveType: 'concept',
    skillLabel: 'Unit Fractions (1/4)',
    targetStage: 3,
  },
  {
    id: 7,
    question: 'Berapakah hasil perkalian 7 × 8?',
    englishQuestion: 'What is 7 × 8?',
    options: ['48', '54', '56', '64'],
    correctAnswer: '56',
    domain: 'number',
    cognitiveType: 'fluency',
    skillLabel: 'Multiplication Tables Fluency',
    targetStage: 3,
  },
  {
    id: 8,
    question: 'Jam dinding menunjukkan jarum pendek di angka 3 dan jarum panjang di angka 12. Pukul berapakah itu?',
    englishQuestion: 'A clock has short hand at 3 and long hand at 12. What time is it?',
    options: ['Pukul 03.00', 'Pukul 12.03', 'Pukul 03.12', 'Pukul 06.00'],
    correctAnswer: 'Pukul 03.00',
    domain: 'geometry_measure',
    cognitiveType: 'fluency',
    skillLabel: 'Time Telling (O\'clock)',
    targetStage: 3,
  },
  {
    id: 9,
    question: 'Manakah pecahan yang SENILAI (equivalent) dengan 1/2?',
    englishQuestion: 'Which fraction is EQUIVALENT to 1/2?',
    options: ['2/4', '2/5', '3/8', '1/3'],
    correctAnswer: '2/4',
    domain: 'number',
    cognitiveType: 'concept',
    skillLabel: 'Equivalent Fractions',
    targetStage: 4,
  },
  {
    id: 10,
    question: 'Sebuah persegi memiliki panjang sisi 6 cm. Berapakah KELILING persegi tersebut?',
    englishQuestion: 'A square has sides of 6 cm. What is its PERIMETER?',
    options: ['24 cm (4 × 6)', '36 cm (6 × 6)', '12 cm (6 + 6)', '18 cm'],
    correctAnswer: '24 cm (4 × 6)',
    domain: 'geometry_measure',
    cognitiveType: 'problem_solving',
    skillLabel: 'Perimeter of 2D Shapes',
    targetStage: 4,
  },
  {
    id: 11,
    question: 'Dalam kantong ada 8 bola Merah dan 2 bola Biru. Jika diambil 1 bola tanpa melihat, kejadian manakah yang PALING MUNGKIN (Most Likely)?',
    englishQuestion: 'A bag has 8 Red and 2 Blue balls. Which event is MOST LIKELY when drawing 1 ball?',
    options: ['Terambil bola Merah', 'Terambil bola Biru', 'Peluang keduanya sama', 'Pasti terambil bola Biru'],
    correctAnswer: 'Terambil bola Merah',
    domain: 'statistics_probability',
    cognitiveType: 'reasoning',
    skillLabel: 'Probability & Chance Likelihood',
    targetStage: 5,
  },
  {
    id: 12,
    question: 'Tantangan Pemecahan Masalah: Kafa memiliki uang Rp 20.000. Membeli 2 buku masing-masing Rp 7.000. Berapa sisa uang Kafa?',
    englishQuestion: 'Kafa has Rp 20,000. He buys 2 books at Rp 7,000 each. How much money remains?',
    options: ['Rp 6.000', 'Rp 14.000', 'Rp 8.000', 'Rp 5.000'],
    correctAnswer: 'Rp 6.000',
    domain: 'number',
    cognitiveType: 'problem_solving',
    skillLabel: 'Multi-Step Real World Problem',
    targetStage: 5,
  },
];

export const DiagnosticTestModal: React.FC<Props> = ({ childProfile, onComplete, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; isCorrect: boolean; domain: MathDomain; cognitiveType: QuestionCognitiveType }[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);

  const currentQ = ADAPTIVE_DIAGNOSTIC_QUESTIONS[currentIdx];

  const handleSelectOption = (opt: string) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);
    sound.playClick();

    const isCorrect = opt === currentQ.correctAnswer;
    const newRecord = {
      questionId: `diag_${currentQ.id}`,
      isCorrect,
      domain: currentQ.domain,
      cognitiveType: currentQ.cognitiveType,
    };

    const nextAnswers = [...userAnswers, newRecord];
    setUserAnswers(nextAnswers);

    setTimeout(() => {
      setSelectedOpt(null);
      if (currentIdx < ADAPTIVE_DIAGNOSTIC_QUESTIONS.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        // Evaluate Diagnostic Assessment
        const assessment = evaluateDiagnosticTest(nextAnswers);
        setAssessmentResult(assessment);
        setIsFinished(true);
        sound.playFanfare();
        confetti({ particleCount: 70, spread: 80 });
      }
    }, 400);
  };

  const handleApplyPlacement = () => {
    sound.playClick();
    if (!assessmentResult) return;

    // Map recommended stage to appropriate LearningPhase
    let phase = LearningPhase.FASE_A;
    if (assessmentResult.stage === 1) phase = LearningPhase.PONDASI;
    else if (assessmentResult.stage <= 3) phase = LearningPhase.FASE_A;
    else if (assessmentResult.stage <= 5) phase = LearningPhase.FASE_B;
    else phase = LearningPhase.FASE_C;

    onComplete(phase, assessmentResult.conceptScore, assessmentResult.stage, assessmentResult);
  };

  if (isFinished && assessmentResult) {
    const stageData = PRIMARY_STAGES.find((s) => s.stage === assessmentResult.stage) || PRIMARY_STAGES[0];

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-center border-4 border-amber-400 shadow-2xl animate-in zoom-in my-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-xl border-4 border-white mb-4">
            🎓
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            Your Math Explorer Level
          </div>

          <h2 className="text-2xl font-black text-slate-800">{stageData.name}</h2>
          <p className="text-sm font-semibold text-slate-500 mt-0.5">{stageData.subtitle} • {stageData.approxAge}</p>

          {/* 4 Cognitive Radar Bars */}
          <div className="bg-slate-50 rounded-2xl p-4 my-5 border border-slate-200 text-left space-y-2.5">
            <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <BrainCircuit className="w-4 h-4 text-orange-500" />
              Profil Berpikir Matematika:
            </p>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>💡 Concept (Pemahaman Konsep)</span>
                <span className="text-orange-600">{assessmentResult.conceptScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${assessmentResult.conceptScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>⚡ Fluency (Kefasihan Berhitung)</span>
                <span className="text-blue-600">{assessmentResult.fluencyScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${assessmentResult.fluencyScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>🧠 Reasoning (Penalaran & Alasan)</span>
                <span className="text-purple-600">{assessmentResult.reasoningScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${assessmentResult.reasoningScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>🎯 Problem Solving (Pemecahan Masalah)</span>
                <span className="text-emerald-600">{assessmentResult.problemSolvingScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${assessmentResult.problemSolvingScore}%` }} />
              </div>
            </div>
          </div>

          {/* Strengths & Recommendation */}
          <div className="text-left bg-amber-50 rounded-2xl p-3.5 border border-amber-200 mb-5 text-xs">
            <p className="font-black text-amber-900 mb-1 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-600" />
              Kekuatan Utama:
            </p>
            <p className="text-amber-800 font-medium">
              {assessmentResult.strengths[0] || 'Kesiapan belajar yang sangat baik!'}
            </p>
            <p className="font-black text-amber-900 mt-2 mb-0.5">Rekomendasi Petualangan:</p>
            <p className="text-slate-600">
              {assessmentResult.developingAreas[0] || 'Lanjut berlatih di jalur personal.'}
            </p>
          </div>

          <button
            onClick={handleApplyPlacement}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base active:scale-98"
          >
            <span>Mulai Petualangan {stageData.name}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIdx + 1) / ADAPTIVE_DIAGNOSTIC_QUESTIONS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border-4 border-orange-400 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-black text-orange-600 uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              Math Adventure Diagnostic
            </span>
            <span>{currentIdx + 1} / {ADAPTIVE_DIAGNOSTIC_QUESTIONS.length}</span>
          </div>
          <div className="w-full h-2.5 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Skill Tag */}
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold mb-3">
          {currentQ.skillLabel}
        </div>

        {/* Question Text */}
        <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 mb-5 min-h-[90px] flex flex-col justify-center">
          <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
            {currentQ.question}
          </h3>
          {currentQ.englishQuestion && (
            <p className="text-xs text-slate-500 font-medium italic mt-1">
              {currentQ.englishQuestion}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOpt === opt;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                disabled={selectedOpt !== null}
                className={`w-full p-3.5 rounded-2xl text-left font-bold text-sm sm:text-base transition-all border-2 flex items-center justify-between active:scale-98 ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-600 shadow-md'
                    : 'bg-white hover:bg-orange-50 text-slate-700 border-slate-200 hover:border-orange-300'
                }`}
              >
                <span>{opt}</span>
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-black">
                  {String.fromCharCode(65 + idx)}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 mt-4 font-medium">
          💡 Jawablah dengan santai dan jujur untuk menemukan level petualanganmu!
        </p>
      </div>
    </div>
  );
};
