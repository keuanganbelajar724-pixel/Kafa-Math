import React, { useState, useEffect, useMemo } from 'react';
import {
  ChildProfile,
  WorkbookOperation,
  WorkbookDifficulty,
  GeneratedMathQuestion,
  WorkbookSavedAnswer,
  MistakeItem,
} from '../../types';
import { MathQuestionGenerator } from '../../services/mathQuestionGenerator';
import {
  loadWorkbookAnswers,
  saveWorkbookAnswer,
  loadMistakes,
  saveMistake,
  resolveMistake,
  loadFocusMode,
  saveFocusMode,
} from '../../services/storage';
import { sound } from '../../services/sound';
import { WorkbookCard } from './WorkbookCard';
import { BigKeypad } from './BigKeypad';
import { StepByStepModal } from './StepByStepModal';
import { PrintableWorksheetModal } from './PrintableWorksheetModal';
import { MistakesReviewModal } from './MistakesReviewModal';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Printer,
  Sparkles,
  Focus,
  Keyboard,
  AlertCircle,
  Trophy,
  CheckCircle2,
  Filter,
  Check,
  Award,
} from 'lucide-react';

interface DigitalWorkbookViewProps {
  activeProfile: ChildProfile;
  onRewardXP: (xp: number, coins: number) => void;
  onAskAITutor: (question: GeneratedMathQuestion) => void;
  defaultOperation?: WorkbookOperation;
}

const OPERATIONS_CONFIG: { id: WorkbookOperation; label: string; icon: string; color: string }[] = [
  { id: 'penjumlahan', label: 'Penjumlahan', icon: '➕', color: 'text-emerald-600' },
  { id: 'pengurangan', label: 'Pengurangan', icon: '➖', color: 'text-rose-600' },
  { id: 'perkalian', label: 'Perkalian', icon: '✖️', color: 'text-amber-600' },
  { id: 'pembagian', label: 'Pembagian', icon: '➗', color: 'text-blue-600' },
  { id: 'campuran', label: 'Campuran', icon: '🧩', color: 'text-purple-600' },
  { id: 'cerita', label: 'Soal Cerita', icon: '📖', color: 'text-orange-600' },
  { id: 'nilai_tempat', label: 'Nilai Tempat', icon: '🔢', color: 'text-indigo-600' },
  { id: 'pecahan', label: 'Pecahan', icon: '🍕', color: 'text-red-500' },
  { id: 'pengukuran', label: 'Pengukuran', icon: '📏', color: 'text-teal-600' },
  { id: 'waktu', label: 'Waktu & Jam', icon: '⏰', color: 'text-sky-600' },
  { id: 'uang', label: 'Uang Rupiah', icon: '💰', color: 'text-yellow-600' },
  { id: 'geometri', label: 'Geometri', icon: '📐', color: 'text-pink-600' },
  { id: 'data', label: 'Data & Tabel', icon: '📊', color: 'text-violet-600' },
  { id: 'pola', label: 'Pola Bilangan', icon: '📈', color: 'text-cyan-600' },
  { id: 'logika', label: 'Logika Angka', icon: '🧠', color: 'text-amber-700' },
];

export const DigitalWorkbookView: React.FC<DigitalWorkbookViewProps> = ({
  activeProfile,
  onRewardXP,
  onAskAITutor,
  defaultOperation = 'penjumlahan',
}) => {
  // Navigation & Filter States
  const [selectedOperation, setSelectedOperation] = useState<WorkbookOperation>(defaultOperation);
  const [difficulty, setDifficulty] = useState<WorkbookDifficulty>('mudah');
  const [pageNumber, setPageNumber] = useState(1);
  const totalPages = 100; // 100 pages = 1000 questions per category!

  // Grade mapping
  const gradeLevelNumber = useMemo(() => {
    if (activeProfile.grade.includes('PAUD') || activeProfile.grade.includes('TK')) return 0;
    const match = activeProfile.grade.match(/\d+/);
    return match ? Number(match[0]) : 2;
  }, [activeProfile.grade]);

  const [selectedGrade, setSelectedGrade] = useState<number>(gradeLevelNumber);

  // Focus mode & Keypad
  const [focusMode, setFocusMode] = useState<boolean>(() => loadFocusMode());
  const [showKeypad, setShowKeypad] = useState(false);
  const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(null);

  // Modals
  const [activeStepQuestion, setActiveStepQuestion] = useState<GeneratedMathQuestion | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showMistakesModal, setShowMistakesModal] = useState(false);

  // Data
  const [pageQuestions, setPageQuestions] = useState<GeneratedMathQuestion[]>([]);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, WorkbookSavedAnswer>>({});
  const [mistakesList, setMistakesList] = useState<MistakeItem[]>([]);
  const [seedKey, setSeedKey] = useState(0);

  // Load saved answers & mistakes on mount or profile change
  useEffect(() => {
    const answers = loadWorkbookAnswers(activeProfile.id);
    setSavedAnswers(answers);
    const mistakes = loadMistakes(activeProfile.id);
    setMistakesList(mistakes);
  }, [activeProfile.id]);

  // Generate 10 questions for current page and operation
  useEffect(() => {
    const qs = MathQuestionGenerator.generatePageQuestions(
      selectedOperation,
      difficulty,
      selectedGrade,
      pageNumber,
      10,
      seedKey
    );
    setPageQuestions(qs);
  }, [selectedOperation, difficulty, selectedGrade, pageNumber, seedKey]);

  // Calculate Page Completion
  const pageAnsweredCount = useMemo(() => {
    return pageQuestions.filter((q) => savedAnswers[q.id]?.isAnswered).length;
  }, [pageQuestions, savedAnswers]);

  const pageCorrectCount = useMemo(() => {
    return pageQuestions.filter((q) => savedAnswers[q.id]?.isCorrect).length;
  }, [pageQuestions, savedAnswers]);

  const isPageComplete = pageQuestions.length > 0 && pageAnsweredCount === pageQuestions.length;

  // Handle saving an answer
  const handleSaveAnswer = (questionId: string, answerVal: string, isCorrect: boolean) => {
    const newAnswer: WorkbookSavedAnswer = {
      questionId,
      userAnswer: answerVal,
      isCorrect,
      isAnswered: true,
      attempts: (savedAnswers[questionId]?.attempts || 0) + 1,
      timestamp: Date.now(),
    };

    const updated = saveWorkbookAnswer(activeProfile.id, newAnswer);
    setSavedAnswers(updated);

    const targetQ = pageQuestions.find((q) => q.id === questionId);

    if (isCorrect) {
      onRewardXP(10, 2); // 10 XP + 2 Coins
      // If was previously in mistake bank, auto-resolve
      if (targetQ) {
        const resolvedList = resolveMistake(activeProfile.id, targetQ.id);
        setMistakesList(resolvedList);
      }
    } else {
      // Save to mistake bank
      if (targetQ) {
        const updatedMistakes = saveMistake(activeProfile.id, targetQ, answerVal);
        setMistakesList(updatedMistakes);
      }
    }
  };

  // Handle Similar Question generation
  const handleSimilarQuestion = (original: GeneratedMathQuestion, index: number) => {
    const similar = MathQuestionGenerator.generateSimilarQuestion(original);
    setPageQuestions((prev) => {
      const copy = [...prev];
      copy[index] = similar;
      return copy;
    });
  };

  // Toggle Focus Mode
  const handleToggleFocus = () => {
    const next = !focusMode;
    setFocusMode(next);
    saveFocusMode(next);
  };

  // Reset / Randomize current page
  const handleRegeneratePage = () => {
    sound.playClick();
    setSeedKey((prev) => prev + 1);
  };

  return (
    <div className={`space-y-5 pb-28 sm:pb-16 ${focusMode ? 'bg-amber-50/20 pt-2' : ''}`}>
      {/* 1. DIGITAL WORKBOOK HERO HEADER */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl border-3 border-white/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-black tracking-wide border border-white/30 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-yellow-300" />
                BUKU LATIHAN MATEMATIKA DIGITAL
              </span>
              <span className="bg-amber-950/40 text-amber-200 px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                {selectedGrade === 0 ? 'PAUD/TK' : `Kelas ${selectedGrade} SD`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Ayo Berhitung! 📘
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-semibold mt-0.5">
              "Buku latihan matematika yang tidak pernah habis" • Kerjakan, simpan, dan kuasai!
            </p>
          </div>

          {/* Quick Stats on Header */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <div className="bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-xs font-black flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span>{pageCorrectCount} / 10 Benar</span>
            </div>

            <button
              onClick={() => setShowMistakesModal(true)}
              className="bg-black/25 hover:bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              title="Lihat Soal yang Perlu Diulang"
            >
              <AlertCircle className="w-4 h-4 text-rose-300" />
              <span>Bank Salah ({mistakesList.filter((m) => !m.resolved).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY & OPERATION FILTER BAR (Scrollable pills) */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border-2 border-amber-200 shadow-xs space-y-3">
        {/* Operation Carousel / Grid */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {OPERATIONS_CONFIG.map((op) => {
            const isSelected = selectedOperation === op.id;
            return (
              <button
                key={op.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedOperation(op.id);
                  setPageNumber(1);
                }}
                className={`px-3.5 py-2 rounded-2xl font-black text-xs flex items-center gap-2 flex-shrink-0 transition-all cursor-pointer border-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-600 shadow-md scale-[1.02]'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-base">{op.icon}</span>
                <span>{op.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grade & Difficulty Dual Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Grade Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-1">Tingkat:</span>
            {[
              { level: 0, label: 'PAUD' },
              { level: 1, label: 'Kls 1' },
              { level: 2, label: 'Kls 2' },
              { level: 3, label: 'Kls 3' },
              { level: 4, label: 'Kls 4' },
              { level: 5, label: 'Kls 5' },
              { level: 6, label: 'Kls 6' },
            ].map((g) => (
              <button
                key={g.level}
                onClick={() => {
                  sound.playClick();
                  setSelectedGrade(g.level);
                  setPageNumber(1);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedGrade === g.level
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Difficulty Segmented Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
            <span className="text-[11px] font-bold text-slate-400 px-2">Kesulitan:</span>
            {(['mudah', 'sedang', 'sulit'] as WorkbookDifficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  sound.playClick();
                  setDifficulty(d);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                  difficulty === d
                    ? d === 'mudah'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : d === 'sedang'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d === 'mudah' ? '🟢 Mudah' : d === 'sedang' ? '🟡 Sedang' : '🔴 Sulit'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. WORKBOOK PAGE CONTROLS & NAVIGATION BAR */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Action Utilities (Soal Baru, Cetak, Fokus, Keypad) */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <button
            onClick={handleRegeneratePage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 cursor-pointer transition-all active:scale-95"
            title="Buat 10 soal acak baru di halaman ini"
          >
            <RotateCw className="w-3.5 h-3.5 text-orange-600" />
            <span>Soal Baru</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 cursor-pointer transition-all active:scale-95"
            title="Pratinjau Lembar Kerja Siap Cetak atau Simpan PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Halaman</span>
          </button>

          <button
            onClick={handleToggleFocus}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
              focusMode
                ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title="Sembunyikan gangguan untuk latihan serius"
          >
            <Focus className="w-3.5 h-3.5" />
            <span>Mode Fokus {focusMode ? 'Aktif' : ''}</span>
          </button>

          <button
            onClick={() => setShowKeypad(!showKeypad)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
              showKeypad
                ? 'bg-indigo-500 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title="Buka Papan Angka Besar"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keypad Angka</span>
          </button>
        </div>

        {/* Center/Right: Page Navigator [← Halaman X / 100 →] */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            disabled={pageNumber <= 1}
            onClick={() => {
              sound.playClick();
              setPageNumber((prev) => Math.max(1, prev - 1));
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 cursor-pointer transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <div className="text-center">
            <span className="text-sm sm:text-base font-black text-slate-800 block">
              Halaman {pageNumber} / {totalPages}
            </span>
            <span className="text-[10px] font-bold text-orange-600">
              {pageNumber * 10} / 1000 Soal Tersedia
            </span>
          </div>

          <button
            disabled={pageNumber >= totalPages}
            onClick={() => {
              sound.playClick();
              setPageNumber((prev) => Math.min(totalPages, prev + 1));
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl text-xs font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white cursor-pointer transition-all active:scale-95 shadow-xs"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. PAGE PROGRESS BAR */}
      <div className="bg-white rounded-2xl p-3 border border-amber-200 shadow-2xs">
        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
          <span>Kemajuan Halaman {pageNumber}</span>
          <span className="font-black text-orange-600">
            {pageAnsweredCount} / 10 Soal Dikerjakan ({pageCorrectCount} Benar)
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(pageAnsweredCount / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* 5. CELEBRATION BANNER IF PAGE COMPLETED */}
      {isPageComplete && (
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 rounded-3xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-white animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
              🎉
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">
                Halaman {pageNumber} Selesai Dikerjakan!
              </h3>
              <p className="text-xs text-emerald-100 font-semibold">
                Skor Halaman: {pageCorrectCount * 10} / 100 Nilai • Kamu meraih bonus +20 XP!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playCorrect();
              setPageNumber((prev) => Math.min(totalPages, prev + 1));
            }}
            className="py-3 px-6 bg-white hover:bg-emerald-50 text-emerald-700 font-black text-sm rounded-2xl shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-2"
          >
            <span>Lanjut ke Halaman {pageNumber + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6. THE 10-SOAL GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pageQuestions.map((q, idx) => (
          <WorkbookCard
            key={q.id}
            question={q}
            index={idx}
            savedAnswer={savedAnswers[q.id]}
            onSaveAnswer={handleSaveAnswer}
            onSimilarQuestion={handleSimilarQuestion}
            onOpenSteps={(selectedQ) => setActiveStepQuestion(selectedQ)}
            onFocusInput={(id) => setFocusedQuestionId(id)}
            isFocused={focusedQuestionId === q.id}
          />
        ))}
      </div>

      {/* 7. ON-SCREEN BIG KEYPAD (Fixed / floating at bottom when enabled) */}
      {showKeypad && (
        <div className="fixed bottom-20 right-4 z-40 animate-in slide-in-from-bottom-5">
          <BigKeypad
            onKeyPress={(char) => {
              if (focusedQuestionId) {
                // Find input in DOM and append
                const cardEl = document.getElementById(`workbook-card-${focusedQuestionId}`);
                if (cardEl) {
                  const inputEl = cardEl.querySelector('input');
                  if (inputEl) {
                    inputEl.value = (inputEl.value || '') + char;
                    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }
              }
            }}
            onBackspace={() => {
              if (focusedQuestionId) {
                const cardEl = document.getElementById(`workbook-card-${focusedQuestionId}`);
                if (cardEl) {
                  const inputEl = cardEl.querySelector('input');
                  if (inputEl && inputEl.value.length > 0) {
                    inputEl.value = inputEl.value.slice(0, -1);
                    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }
              }
            }}
            onSubmit={() => {
              if (focusedQuestionId) {
                const cardEl = document.getElementById(`workbook-card-${focusedQuestionId}`);
                if (cardEl) {
                  const formEl = cardEl.querySelector('form');
                  if (formEl) {
                    formEl.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  }
                }
              }
            }}
            onClose={() => setShowKeypad(false)}
          />
        </div>
      )}

      {/* MODAL: Step By Step Math Explanation */}
      {activeStepQuestion && (
        <StepByStepModal
          question={activeStepQuestion}
          childName={activeProfile.name}
          onAskAITutor={() => {
            const q = activeStepQuestion;
            setActiveStepQuestion(null);
            onAskAITutor(q);
          }}
          onClose={() => setActiveStepQuestion(null)}
        />
      )}

      {/* MODAL: Printable Worksheet */}
      {showPrintModal && (
        <PrintableWorksheetModal
          questions={pageQuestions}
          topicTitle={
            OPERATIONS_CONFIG.find((op) => op.id === selectedOperation)?.label || 'Matematika'
          }
          gradeLabel={selectedGrade === 0 ? 'PAUD/TK' : `Kelas ${selectedGrade} SD`}
          pageNumber={pageNumber}
          childName={activeProfile.name}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* MODAL: Mistakes Bank Review */}
      {showMistakesModal && (
        <MistakesReviewModal
          mistakes={mistakesList}
          childName={activeProfile.name}
          onResolveMistake={(mistakeId) => {
            const updated = resolveMistake(activeProfile.id, mistakeId);
            setMistakesList(updated);
          }}
          onRewardBonusXP={(xp) => {
            onRewardXP(xp, 1);
          }}
          onClose={() => setShowMistakesModal(false)}
        />
      )}
    </div>
  );
};
