import React, { useState, useEffect } from 'react';
import { ChildProfile, LearningPhase } from '../types';
import { GradeMathEngine, GradeLevel } from '../services/gradeMathEngine';
import { sound } from '../services/sound';
import {
  Trophy,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Printer,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Award,
  FileCheck,
  Bookmark,
  ChevronRight,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface Props {
  activeProfile: ChildProfile;
  onClose: () => void;
  onRewardXP: (xp: number, coins: number) => void;
}

interface ExamQuestion {
  id: string;
  number: number;
  type: 'single_choice' | 'multi_choice' | 'number_input' | 'true_false';
  text: string;
  stimulus?: string; // Story / Context / Tabel
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  topic: string;
  strand: string;
  points: number;
}

export const ExamSimulationModal: React.FC<Props> = ({ activeProfile, onClose, onRewardXP }) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(() => {
    if (activeProfile.grade.includes('PAUD')) return 0;
    if (activeProfile.grade.includes('Kelas 1')) return 1;
    if (activeProfile.grade.includes('Kelas 2')) return 2;
    if (activeProfile.grade.includes('Kelas 3')) return 3;
    if (activeProfile.grade.includes('Kelas 4')) return 4;
    if (activeProfile.grade.includes('Kelas 5')) return 5;
    if (activeProfile.grade.includes('Kelas 6')) return 6;
    return 3;
  });

  const [examState, setExamState] = useState<'intro' | 'running' | 'result'>('intro');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 mins
  const [timedMode, setTimedMode] = useState<boolean>(true);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Generate Questions tailored to the selected Grade Level & ANBK Standards
  const buildExamQuestions = (gradeLevel: number): ExamQuestion[] => {
    const list: ExamQuestion[] = [];
    const totalQ = 10;

    for (let i = 1; i <= totalQ; i++) {
      const gq = GradeMathEngine.generateQuestion((gradeLevel === 0 ? 1 : gradeLevel) as GradeLevel);
      
      // Rotate question types for realistic ANBK feel
      if (i % 4 === 1) {
        // Single choice
        list.push({
          id: `eq_${i}`,
          number: i,
          type: 'single_choice',
          text: gq.question,
          stimulus: `Literasi Numerasi Kontekstual - Soal No. ${i}`,
          options: gq.options,
          correctAnswer: gq.correctAnswer,
          explanation: gq.explanation,
          topic: gq.topicTitle,
          strand: gq.category,
          points: 10,
        });
      } else if (i % 4 === 2) {
        // True / False
        const isActuallyTrue = Math.random() > 0.4;
        const statementText = isActuallyTrue
          ? `Pernyataan: Nilai dari ${gq.question} adalah sama dengan ${gq.correctAnswer}.`
          : `Pernyataan: Nilai dari ${gq.question} adalah sama dengan ${parseInt(gq.correctAnswer, 10) + 2 || '99'}.`;

        list.push({
          id: `eq_${i}`,
          number: i,
          type: 'true_false',
          text: statementText,
          stimulus: `Analisis Fakta & Pernyataan Matematika`,
          options: ['Benar', 'Salah'],
          correctAnswer: isActuallyTrue ? 'Benar' : 'Salah',
          explanation: `Hasil sebenarnya: ${gq.question} = ${gq.correctAnswer}. Maka pernyataan ini bernilai ${isActuallyTrue ? 'BENAR' : 'SALAH'}.`,
          topic: gq.topicTitle,
          strand: gq.category,
          points: 10,
        });
      } else if (i % 4 === 3) {
        // Number Input
        list.push({
          id: `eq_${i}`,
          number: i,
          type: 'number_input',
          text: `${gq.question} (Tuliskan hanya angka hasil akhir)`,
          stimulus: `Isian Singkat Numerasi`,
          correctAnswer: gq.correctAnswer.replace(/[^0-9.-]/g, '') || gq.correctAnswer,
          explanation: gq.explanation,
          topic: gq.topicTitle,
          strand: gq.category,
          points: 10,
        });
      } else {
        // Standard Multiple Choice with context
        list.push({
          id: `eq_${i}`,
          number: i,
          type: 'single_choice',
          text: gq.question,
          stimulus: `Aplikasi Pemecahan Masalah Matematika SD`,
          options: gq.options,
          correctAnswer: gq.correctAnswer,
          explanation: gq.explanation,
          topic: gq.topicTitle,
          strand: gq.category,
          points: 10,
        });
      }
    }
    return list;
  };

  const handleStartExam = () => {
    sound.playClick();
    const qList = buildExamQuestions(selectedGrade);
    setQuestions(qList);
    setUserAnswers({});
    setFlagged({});
    setCurrentIndex(0);
    setTimeLeft(timedMode ? 600 : 0); // 10 minutes
    setExamState('running');
  };

  // Timer countdown
  useEffect(() => {
    if (examState !== 'running' || !timedMode) return;
    if (timeLeft <= 0) {
      handleFinishExam();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [examState, timedMode, timeLeft]);

  const handleSelectAnswer = (ans: any) => {
    sound.playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: ans,
    }));
  };

  const handleToggleFlag = () => {
    sound.playClick();
    setFlagged((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleFinishExam = () => {
    sound.playFanfare();
    setExamState('result');

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const userAns = userAnswers[idx];
      if (typeof q.correctAnswer === 'string' && typeof userAns === 'string') {
        if (userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
          correctCount++;
        }
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    const xpGained = finalScore * 2;
    const coinsGained = Math.round(finalScore / 4);
    onRewardXP(xpGained, coinsGained);
  };

  // Compute final statistics
  const calculateResults = () => {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    questions.forEach((q, idx) => {
      const userAns = userAnswers[idx];
      if (!userAns) {
        unansweredCount++;
      } else if (
        typeof q.correctAnswer === 'string' &&
        typeof userAns === 'string' &&
        userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      ) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    let gradePredicate = 'Sangat Memuaskan (A)';
    if (score < 60) gradePredicate = 'Perlu Pendalaman (D)';
    else if (score < 75) gradePredicate = 'Cukup / Berkembang (C)';
    else if (score < 90) gradePredicate = 'Baik & Cakap (B)';

    return {
      score,
      correctCount,
      wrongCount,
      unansweredCount,
      gradePredicate,
    };
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const results = examState === 'result' ? calculateResults() : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-4xl w-full border-4 border-amber-300 shadow-2xl flex flex-col my-auto max-h-[96vh] overflow-hidden print:max-h-none print:border-none print:shadow-none">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-4 text-white flex items-center justify-between shadow-md print:hidden flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner border border-white/30">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">Simulasi Ujian & ANBK Numerasi SD</h2>
                <span className="text-[10px] font-black bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Standar Nasional
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Latihan Tryout Ujian Sekolah Resmi & Asesmen Kompetensi Minimum (AKM)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 1. INTRO / CONFIGURATION VIEW */}
        {/* ========================================================================= */}
        {examState === 'intro' && (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <div className="inline-block p-4 rounded-3xl bg-blue-100 text-blue-700 text-5xl mb-3 shadow-inner">
                  🎯
                </div>
                <h3 className="text-2xl font-black text-slate-800">Pilih Paket Ujian & Jenjang Kelas</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Uji pemahaman matematikamu dengan format soal resmi AKM (Pilihan Ganda, Isian Singkat, dan Analisis Fakta).
                </p>
              </div>

              {/* Grade Selection */}
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  Pilih Jenjang Tryout:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { lvl: 1, label: 'Kelas 1 SD', icon: '🌱', desc: 'Bilangan 1-20 & Bentuk' },
                    { lvl: 2, label: 'Kelas 2 SD', icon: '🌿', desc: 'Penjumlahan, Pengurangan & Uang' },
                    { lvl: 3, label: 'Kelas 3 SD', icon: '⭐', desc: 'Perkalian, Pembagian & Pecahan' },
                    { lvl: 4, label: 'Kelas 4 SD', icon: '🚀', desc: 'Porogapit, Sudut, KPK/FPB' },
                    { lvl: 5, label: 'Kelas 5 SD', icon: '💎', desc: 'Pecahan Desimal & Bangun Ruang' },
                    { lvl: 6, label: 'Kelas 6 SD', icon: '👑', desc: 'Bilangan Bulat, Lingkaran, Data' },
                  ].map((g) => (
                    <button
                      key={g.lvl}
                      onClick={() => {
                        sound.playClick();
                        setSelectedGrade(g.lvl);
                      }}
                      className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                        selectedGrade === g.lvl
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-2 ring-blue-300'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xl mb-1">{g.icon}</div>
                      <div className="font-black text-xs sm:text-sm">{g.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options (Timer, etc.) */}
              <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" /> Mode Waktu (Timer 10 Menit)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Melatih kecepatan dan ketepatan seperti ujian sekolah sebenarnya.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={timedMode}
                  onChange={(e) => setTimedMode(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartExam}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base rounded-2xl shadow-md transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Mulai Kerjakan Tryout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. RUNNING EXAM VIEW */}
        {/* ========================================================================= */}
        {examState === 'running' && currentQ && (
          <div className="flex flex-col flex-1 overflow-hidden bg-slate-50">
            {/* Top Exam Status Bar */}
            <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-blue-100 text-blue-800 px-3 py-1 rounded-xl">
                  Soal No. {currentIndex + 1} dari {questions.length}
                </span>
                <span className="text-xs text-slate-500 font-bold hidden sm:inline">
                  {currentQ.strand} • {currentQ.topic}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {timedMode && (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${
                    timeLeft < 120 ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse' : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}>
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Sisa Waktu: {formatTimer(timeLeft)}</span>
                  </div>
                )}

                <button
                  onClick={handleToggleFlag}
                  className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                    flagged[currentIndex]
                      ? 'bg-amber-100 border-amber-400 text-amber-900'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{flagged[currentIndex] ? 'Ragu-ragu ✓' : 'Ragu-ragu'}</span>
                </button>
              </div>
            </div>

            {/* Main Question Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Question & Options Area */}
              <div className="lg:col-span-3 space-y-4">
                {/* Stimulus Context Box */}
                {currentQ.stimulus && (
                  <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs font-bold text-blue-900">
                    📖 {currentQ.stimulus}
                  </div>
                )}

                {/* Question Statement */}
                <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs">
                  <h3 className="text-base sm:text-lg font-black text-slate-800 leading-relaxed">
                    {currentQ.text}
                  </h3>

                  {/* Options: Multiple Choice */}
                  {currentQ.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      {currentQ.options.map((opt, idx) => {
                        const isSelected = userAnswers[currentIndex] === opt;
                        const optionLetters = ['A', 'B', 'C', 'D'];
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectAnswer(opt)}
                            className={`p-4 rounded-2xl text-left border-2 font-bold text-sm transition-all cursor-pointer flex items-center gap-3 ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-sm ring-2 ring-blue-300'
                                : 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                            }`}>
                              {optionLetters[idx] || idx + 1}
                            </span>
                            <span className="flex-1">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Number Input Option */}
                  {currentQ.type === 'number_input' && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 max-w-sm">
                      <label className="text-xs font-bold text-slate-600 block mb-2">Ketik Jawaban Angka:</label>
                      <input
                        type="text"
                        value={userAnswers[currentIndex] || ''}
                        onChange={(e) => handleSelectAnswer(e.target.value)}
                        placeholder="Contoh: 45"
                        className="w-full px-4 py-3 bg-white border-2 border-blue-400 rounded-xl font-black text-lg text-slate-800 outline-none shadow-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentIndex(Math.max(0, currentIndex - 1));
                    }}
                    disabled={currentIndex === 0}
                    className="px-4 py-2.5 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-black rounded-2xl border border-slate-300 cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Soal Sebelumnya
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        setCurrentIndex(currentIndex + 1);
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xs cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm"
                    >
                      <span>Soal Berikutnya</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishExam}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-md cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai & Kumpulkan Ujian</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Question Number Grid Navigation Sidebar */}
              <div className="bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-xs h-fit space-y-3">
                <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  LEMBAR JAWABAN (LJK):
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = userAnswers[idx] !== undefined && userAnswers[idx] !== '';
                    const isCurrent = idx === currentIndex;
                    const isFlag = flagged[idx];

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playClick();
                          setCurrentIndex(idx);
                        }}
                        className={`h-10 rounded-xl font-black text-xs relative flex items-center justify-center transition-all cursor-pointer border ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300 scale-105'
                            : isFlag
                            ? 'bg-amber-100 text-amber-900 border-amber-400'
                            : isAnswered
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                        }`}
                      >
                        {idx + 1}
                        {isFlag && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[10px] text-slate-500 font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-500 rounded-md" /> Sudah Dijawab
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-amber-100 border border-amber-400 rounded-md" /> Ragu-ragu
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-slate-100 border border-slate-300 rounded-md" /> Belum Dijawab
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. EXAM RESULT & REPORT CARD */}
        {/* ========================================================================= */}
        {examState === 'result' && results && (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50">
            {/* Score Showcase Hero */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white text-center shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold text-amber-200 border border-white/20">
                  Laporan Hasil Ujian & Tryout Standar Kurikulum Merdeka
                </div>

                <div className="text-6xl sm:text-7xl font-black text-yellow-300 tracking-tight">
                  {results.score}
                  <span className="text-2xl sm:text-3xl text-white/80 font-bold">/100</span>
                </div>

                <div className="text-lg sm:text-xl font-bold">{results.gradePredicate}</div>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <span className="bg-emerald-500/30 border border-emerald-400/50 px-3 py-1 rounded-xl text-xs font-bold">
                    ✓ Benar: {results.correctCount} Soal
                  </span>
                  <span className="bg-rose-500/30 border border-rose-400/50 px-3 py-1 rounded-xl text-xs font-bold">
                    ✕ Salah: {results.wrongCount} Soal
                  </span>
                  <span className="bg-slate-500/30 border border-slate-400/50 px-3 py-1 rounded-xl text-xs font-bold">
                    - Kosong: {results.unansweredCount} Soal
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCertificate(true)}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xs cursor-pointer flex items-center gap-2 text-xs sm:text-sm"
                >
                  <Award className="w-4 h-4" />
                  <span>Lihat & Cetak Sertifikat Kelulusan 📜</span>
                </button>
              </div>

              <button
                onClick={handleStartExam}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Coba Ujian Lain
              </button>
            </div>

            {/* Detailed Question Review List */}
            <div className="space-y-4">
              <h4 className="font-black text-slate-800 text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Pembahasan Lengkap & Kunci Jawaban Soal</span>
              </h4>

              {questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect =
                  typeof q.correctAnswer === 'string' &&
                  typeof userAns === 'string' &&
                  userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                return (
                  <div
                    key={q.id}
                    className={`bg-white p-5 rounded-3xl border-2 shadow-xs space-y-3 ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-white ${
                          isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-500">{q.topic}</span>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isCorrect ? '✓ Benar' : '✕ Belum Tepat'}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-800 leading-relaxed">{q.text}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 font-bold block">Jawaban Kamu:</span>
                        <span className={`font-black ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {userAns || '(Tidak dijawab)'}
                        </span>
                      </div>
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-emerald-800 font-bold block">Kunci Jawaban Benar:</span>
                        <span className="font-black text-emerald-800">{q.correctAnswer}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                      <span className="font-bold block text-amber-800">💡 Penjelasan & Cara Hitung:</span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. PRINTABLE / DOWNLOADABLE CERTIFICATE MODAL */}
        {/* ========================================================================= */}
        {showCertificate && results && (
          <div className="fixed inset-0 z-60 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
            <div className="bg-white rounded-3xl max-w-2xl w-full border-8 border-amber-400 p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden print:border-8 print:border-amber-400 print:shadow-none">
              {/* Seal & Watermark */}
              <div className="absolute top-4 right-4 text-7xl opacity-10 pointer-events-none">🏆</div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-md">
                    📐
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide">
                      PIAGAM PRESTASI MATEMATIKA
                    </h3>
                    <p className="text-xs text-amber-800 font-bold tracking-widest uppercase">
                      KAFA MATH INDONESIA • KURIKULUM MERDEKA
                    </p>
                  </div>
                </div>

                <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full my-3" />

                <p className="text-xs text-slate-600">Diberikan dengan bangga kepada:</p>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 underline decoration-amber-400 decoration-4 underline-offset-8">
                  {activeProfile.name}
                </h2>

                <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                  Telah berhasil menyelesaikan simulasi Ujian Tryout & Asesmen Kompetensi Numerasi{' '}
                  <span className="font-bold text-slate-800">Kelas {selectedGrade} SD</span> dengan hasil evaluasi:
                </p>

                <div className="my-4 inline-block bg-amber-50 border-2 border-amber-400 px-6 py-3 rounded-2xl">
                  <span className="text-xs font-bold text-amber-800 uppercase block">NILAI AKHIR</span>
                  <span className="text-4xl font-black text-amber-600">{results.score} / 100</span>
                  <span className="text-xs font-bold text-slate-700 block mt-0.5">{results.gradePredicate}</span>
                </div>

                <div className="flex justify-between items-end pt-6 text-left border-t border-slate-200 text-xs text-slate-500">
                  <div>
                    <div>Tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</div>
                    <div>Verifikasi: Standar Kemendikbudristek</div>
                  </div>
                  <div className="text-center">
                    <div className="font-black text-slate-800 text-sm">Tim Kurikulum KafaMath</div>
                    <div className="text-[10px] text-emerald-600 font-bold">✓ Terverifikasi Resmi</div>
                  </div>
                </div>

                {/* Print & Close Buttons */}
                <div className="flex justify-center gap-3 pt-6 print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-md cursor-pointer flex items-center gap-2 text-xs"
                  >
                    <Printer className="w-4 h-4" /> Cetak Sertifikat
                  </button>
                  <button
                    onClick={() => setShowCertificate(false)}
                    className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black rounded-2xl cursor-pointer text-xs"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
