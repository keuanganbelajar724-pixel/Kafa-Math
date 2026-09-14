import React, { useState, useEffect } from 'react';
import { ChildProfile, GeneratedMathQuestion, ExamSessionResult, WorkbookOperation } from '../../types';
import { MathQuestionGenerator } from '../../services/mathQuestionGenerator';
import { saveExamResult } from '../../services/storage';
import { sound } from '../../services/sound';
import { X, Clock, CheckCircle2, AlertCircle, Trophy, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { VerticalMathCard } from './VerticalMathCard';

interface ExamModeModalProps {
  activeProfile: ChildProfile;
  onClose: () => void;
  onRewardXP: (xp: number, coins: number) => void;
}

export const ExamModeModal: React.FC<ExamModeModalProps> = ({
  activeProfile,
  onClose,
  onRewardXP,
}) => {
  // Setup state vs In-Exam state vs Result state
  const [phase, setPhase] = useState<'setup' | 'testing' | 'finished'>('setup');
  const [questionCount, setQuestionCount] = useState<10 | 20 | 30 | 50>(10);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(0); // 0 = untimed
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  // Testing states
  const [questions, setQuestions] = useState<GeneratedMathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<number>(0);

  // Result state
  const [examResult, setExamResult] = useState<ExamSessionResult | null>(null);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'testing' || timeLimitMinutes === 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, timeLimitMinutes]);

  const handleStartExam = () => {
    sound.playClick();
    const ops: WorkbookOperation[] = [
      'penjumlahan',
      'pengurangan',
      'perkalian',
      'pembagian',
      'campuran',
      'cerita',
      'nilai_tempat',
      'pola',
    ];

    const generated: GeneratedMathQuestion[] = [];
    for (let i = 0; i < questionCount; i++) {
      const op = ops[i % ops.length];
      const q = MathQuestionGenerator.generateSingleQuestion(
        op,
        4,
        'sedang',
        2,
        i + 1,
        Date.now() + i
      );
      generated.push(q);
    }

    setQuestions(generated);
    setUserAnswers({});
    setCurrentIndex(0);
    setStartTime(Date.now());
    if (timeLimitMinutes > 0) {
      setSecondsRemaining(timeLimitMinutes * 60);
    }
    setPhase('testing');
  };

  const handleFinishExam = () => {
    sound.playCelebration();
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    let correct = 0;
    let wrong = 0;
    const categoryStats: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q, idx) => {
      const userAns = (userAnswers[idx] || '').trim().toLowerCase();
      const correctAns = q.answer.trim().toLowerCase();

      const isMatch =
        userAns === correctAns ||
        (q.acceptedAnswers &&
          q.acceptedAnswers.some((a) => a.trim().toLowerCase() === userAns));

      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { correct: 0, total: 0 };
      }
      categoryStats[q.category].total += 1;

      if (isMatch) {
        correct++;
        categoryStats[q.category].correct += 1;
      } else {
        wrong++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);

    // Analyze strongest and needs practice
    let strongest = 'Aritmatika Dasar';
    let needsPractice = 'Soal Cerita & Logika';
    let highestAcc = -1;
    let lowestAcc = 999;

    Object.entries(categoryStats).forEach(([cat, st]) => {
      const acc = st.correct / st.total;
      if (acc > highestAcc) {
        highestAcc = acc;
        strongest = cat;
      }
      if (acc < lowestAcc) {
        lowestAcc = acc;
        needsPractice = cat;
      }
    });

    const resultObj: ExamSessionResult = {
      id: `exam_${Date.now()}`,
      profileId: activeProfile.id,
      date: new Date().toLocaleDateString('id-ID'),
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: wrong,
      score,
      timeSpentSeconds: timeSpent,
      strongestTopic: strongest,
      needsPracticeTopic: needsPractice,
    };

    saveExamResult(activeProfile.id, resultObj);
    setExamResult(resultObj);
    setPhase('finished');

    // Award XP
    onRewardXP(score, Math.round(score / 10));
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-3 border-amber-300 shadow-2xl relative my-auto max-h-[92vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-xl">
              📝
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">
                Simulasi Ujian Matematika SD
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Uji kemampuan dan raih nilai terbaikmu!
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

        {/* PHASE 1: SETUP */}
        {phase === 'setup' && (
          <div className="py-6 space-y-6">
            {/* Question Count Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                Pilih Jumlah Soal:
              </label>
              <div className="grid grid-cols-4 gap-3">
                {([10, 20, 30, 50] as const).map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-3 rounded-2xl font-black text-sm transition-all cursor-pointer border-2 ${
                      questionCount === cnt
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02]'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {cnt} Soal
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Limit Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                Batas Waktu (Timer):
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: 0, label: 'Tanpa Waktu' },
                  { value: 10, label: '10 Menit' },
                  { value: 15, label: '15 Menit' },
                  { value: 30, label: '30 Menit' },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTimeLimitMinutes(t.value)}
                    className={`py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
                      timeLimitMinutes === t.value
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02]'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Information Notice */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Ketentuan Ujian:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                <li>Soal mencakup operasi hitung, cerita, dan pola bilangan.</li>
                <li>Jawaban dapat diperbaiki kapan saja sebelum tombol selesai ditekan.</li>
                <li>Setelah selesai, kamu akan menerima nilai dan analisis kekuatan materi.</li>
              </ul>
            </div>

            <button
              onClick={handleStartExam}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base rounded-2xl shadow-lg cursor-pointer transition-transform active:scale-95"
            >
              Mulai Ujian Sekarang 🚀
            </button>
          </div>
        )}

        {/* PHASE 2: TESTING */}
        {phase === 'testing' && currentQ && (
          <div className="py-4 space-y-4 flex-1 flex flex-col justify-between">
            {/* Top Exam Info Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold">
              <span className="text-slate-500">
                Soal {currentIndex + 1} dari {questions.length}
              </span>
              {timeLimitMinutes > 0 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-black">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>
              )}
            </div>

            {/* Current Question Display */}
            <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  {currentQ.subCategory}
                </span>
                <span className="text-xs font-bold text-slate-400">#Nomor {currentIndex + 1}</span>
              </div>

              <p className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                {currentQ.question}
              </p>

              {currentQ.verticalFormat && (
                <div className="flex justify-center my-2">
                  <VerticalMathCard data={currentQ.verticalFormat} />
                </div>
              )}

              {/* Input */}
              <div className="pt-2">
                <input
                  type="text"
                  value={userAnswers[currentIndex] || ''}
                  onChange={(e) =>
                    setUserAnswers((prev) => ({ ...prev, [currentIndex]: e.target.value }))
                  }
                  placeholder="Ketik jawabanmu..."
                  className="w-full px-4 py-3 bg-white rounded-2xl border-2 border-slate-300 focus:border-blue-500 font-black text-lg outline-none"
                />
              </div>
            </div>

            {/* Question Quick Jump Grid */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {questions.map((_, idx) => {
                const isAnswered = Boolean(userAnswers[idx]?.trim());
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-8 h-8 rounded-xl font-black text-xs flex-shrink-0 cursor-pointer transition-all border ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs scale-110'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Navigation & Submit Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="flex items-center gap-1 px-5 py-2.5 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md"
                >
                  <span>Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinishExam}
                  className="flex items-center gap-1 px-6 py-2.5 rounded-2xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai & Kumpulkan</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* PHASE 3: RESULT & REPORT */}
        {phase === 'finished' && examResult && (
          <div className="py-5 space-y-5 text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 mx-auto flex items-center justify-center text-4xl shadow-md">
              🏆
            </div>

            <div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-800">
                Nilai Ujian Kamu:
              </h4>
              <div className="text-5xl font-black text-blue-600 mt-1">
                {examResult.score} <span className="text-lg text-slate-400 font-bold">/ 100</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-left">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-[11px] font-bold text-emerald-600 block">Benar:</span>
                <span className="text-lg font-black text-emerald-800">
                  {examResult.correctAnswers} Soal
                </span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
                <span className="text-[11px] font-bold text-rose-600 block">Salah / Lewat:</span>
                <span className="text-lg font-black text-rose-800">
                  {examResult.wrongAnswers} Soal
                </span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
                <span className="text-[11px] font-bold text-blue-600 block">Waktu Selesai:</span>
                <span className="text-lg font-black text-blue-800">
                  {Math.round(examResult.timeSpentSeconds / 60)} mnt {examResult.timeSpentSeconds % 60} dtk
                </span>
              </div>
            </div>

            {/* Analysis Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Materi Terkuat:</span>
                <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                  ✓ {examResult.strongestTopic}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Materi Perlu Latihan:</span>
                <span className="font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                  ⚡ {examResult.needsPracticeTopic}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setPhase('setup')}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl cursor-pointer"
              >
                Ujian Lagi
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer"
              >
                Tutup & Simpan Hasil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
