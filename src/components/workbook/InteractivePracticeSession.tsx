import React, { useState, useEffect, useRef } from 'react';
import {
  ChildProfile,
  WorkbookOperation,
  GeneratedMathQuestion,
  WorkbookDifficulty,
} from '../../types';
import { MathQuestionGenerator } from '../../services/mathQuestionGenerator';
import { sound } from '../../services/sound';
import { NumericKeypad } from '../ui/NumericKeypad';
import { VerticalMathCard } from './VerticalMathCard';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  Home,
  Lightbulb,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractivePracticeSessionProps {
  operation: WorkbookOperation;
  gradeLevel: number;
  difficulty: WorkbookDifficulty;
  activeProfile: ChildProfile;
  totalQuestionsCount?: number;
  onBack: () => void;
  onRewardXP: (xp: number, coins: number) => void;
  onOpenMistakes?: () => void;
  onSwitchToWorkbookGrid?: () => void;
}

export const InteractivePracticeSession: React.FC<InteractivePracticeSessionProps> = ({
  operation,
  gradeLevel,
  difficulty,
  activeProfile,
  totalQuestionsCount = 10,
  onBack,
  onRewardXP,
  onOpenMistakes,
  onSwitchToWorkbookGrid,
}) => {
  const [questions, setQuestions] = useState<GeneratedMathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [status, setStatus] = useState<'answering' | 'correct' | 'incorrect'>('answering');
  const [feedbackHint, setFeedbackHint] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate question batch on start
  useEffect(() => {
    const qs = MathQuestionGenerator.generatePageQuestions(
      operation,
      difficulty,
      gradeLevel,
      1,
      totalQuestionsCount,
      Date.now()
    );
    setQuestions(qs);
    setCurrentIndex(0);
    setInputValue('');
    setStatus('answering');
    setFeedbackHint('');
    setShowHint(false);
    setCorrectCount(0);
    setSessionCompleted(false);
  }, [operation, difficulty, gradeLevel, totalQuestionsCount]);

  const currentQ = questions[currentIndex];

  // Auto-focus input for physical keyboard users
  useEffect(() => {
    if (status === 'answering' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, status]);

  const operationTitles: Record<WorkbookOperation, string> = {
    penjumlahan: 'Penjumlahan',
    pengurangan: 'Pengurangan',
    perkalian: 'Perkalian',
    pembagian: 'Pembagian',
    campuran: 'Operasi Campuran',
    cerita: 'Soal Cerita',
    nilai_tempat: 'Nilai Tempat',
    pecahan: 'Pecahan',
    pengukuran: 'Pengukuran',
    waktu: 'Waktu & Jam',
    uang: 'Uang Rupiah',
    geometri: 'Geometri',
    data: 'Data & Tabel',
    pola: 'Pola Bilangan',
    logika: 'Logika Angka',
  };

  const handleDigit = (digit: string) => {
    if (status === 'correct') return;
    if (inputValue.length < 12) {
      setInputValue((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (status === 'correct') return;
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleSubmitAnswer = () => {
    if (!currentQ || !inputValue.trim() || status === 'correct') return;

    const cleanInput = inputValue.trim().toLowerCase();
    const cleanAnswer = String(currentQ.answer || '').trim().toLowerCase();

    const isMatch =
      cleanInput === cleanAnswer ||
      (currentQ.acceptedAnswers &&
        currentQ.acceptedAnswers.map((a) => a.trim().toLowerCase()).includes(cleanInput));

    if (isMatch) {
      sound.playCorrect();
      setStatus('correct');
      setCorrectCount((prev) => prev + 1);
      onRewardXP(10, 1);

      // Confetti burst
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { y: 0.65 },
      });

      // Advance after a brief delay
      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
          setInputValue('');
          setStatus('answering');
          setFeedbackHint('');
          setShowHint(false);
        } else {
          // Finished all questions in session
          setSessionCompleted(true);
          sound.playCelebration();
          confetti({ particleCount: 80, spread: 90 });
        }
      }, 1200);
    } else {
      sound.playIncorrect();
      setStatus('incorrect');

      // Adaptive hint from the generated question
      if (currentQ.hint) {
        setFeedbackHint(currentQ.hint);
      } else if (currentQ.verticalFormat) {
        setFeedbackHint('Coba periksa lagi angka satuannya dan simpanan puluhan.');
      } else {
        setFeedbackHint('Belum tepat. Coba hitung pelan-pelan sekali lagi.');
      }
    }
  };

  const handleTryAgain = () => {
    sound.playClick();
    setStatus('answering');
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRestart = () => {
    sound.playClick();
    const qs = MathQuestionGenerator.generatePageQuestions(
      operation,
      difficulty,
      gradeLevel,
      1,
      totalQuestionsCount,
      Date.now()
    );
    setQuestions(qs);
    setCurrentIndex(0);
    setInputValue('');
    setStatus('answering');
    setFeedbackHint('');
    setShowHint(false);
    setCorrectCount(0);
    setSessionCompleted(false);
  };

  // -------------------------------------------------------------
  // RESULT SCREEN (When 10 questions are finished)
  // -------------------------------------------------------------
  if (sessionCompleted) {
    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100;
    const earnedXP = correctCount * 10;

    return (
      <div className="max-w-2xl mx-auto py-6 px-4 space-y-6 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-5">
          {/* Trophy & Title */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-amber-50 text-amber-500 border-2 border-amber-200 flex items-center justify-center text-5xl shadow-sm">
            🎉
          </div>

          <div>
            <span className="text-xs font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Great work!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Latihan Selesai!
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Kamu telah menyelesaikan sesi latihan {operationTitles[operation]} dengan luar biasa!
            </p>
          </div>

          {/* Stats Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 block">Skor Benar</span>
              <span className="text-lg font-black text-slate-900">
                {correctCount} / {questions.length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="text-[11px] font-semibold text-emerald-600 block">Akurasi</span>
              <span className="text-lg font-black text-emerald-700">{accuracy}%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-center">
              <span className="text-[11px] font-semibold text-amber-600 block">Bonus XP</span>
              <span className="text-lg font-black text-amber-700">+{earnedXP} XP</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-center">
              <span className="text-[11px] font-semibold text-rose-600 block">Streak</span>
              <span className="text-lg font-black text-rose-700">🔥 +1 Hari</span>
            </div>
          </div>

          {/* Diagnostic Strengths & Needs Practice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                MATERI YANG SUDAH KUAT
              </span>
              <p className="text-sm font-bold text-slate-800">
                ✓ {operationTitles[operation]}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Pemahaman konsep dan ketelitian kamu sudah sangat baik!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
              <span className="text-xs font-black text-amber-800 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                PERLU LATIHAN
              </span>
              <p className="text-sm font-bold text-slate-800">
                → {operation === 'perkalian' ? 'Pembagian' : operation === 'penjumlahan' ? 'Pengurangan' : 'Soal Cerita'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Coba latihan topik terkait untuk mengimbangi kemampuanmu.
              </p>
            </div>
          </div>

          {/* Action Buttons: [ LATIHAN LAGI ] [ REVIEW KESALAHAN ] [ KEMBALI KE HOME ] */}
          <div className="space-y-2.5 pt-4">
            <button
              onClick={handleRestart}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>LATIHAN LAGI</span>
            </button>

            {onOpenMistakes && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenMistakes();
                }}
                className="w-full py-3 px-6 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-extrabold text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>REVIEW KESALAHAN</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onBack();
              }}
              className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>KEMBALI KE HOME</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback if questions are generating
  if (!currentQ) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 font-bold text-sm">Menyiapkan soal latihan seru untukmu...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE QUESTION SCREEN
  // -------------------------------------------------------------
  const isTextProblem =
    currentQ.category === 'cerita' ||
    operation === 'cerita' ||
    operation === 'geometri' ||
    operation === 'waktu' ||
    operation === 'uang' ||
    operation === 'pengukuran' ||
    operation === 'data' ||
    operation === 'logika' ||
    operation === 'nilai_tempat' ||
    (currentQ.question && currentQ.question.length > 25);

  return (
    <div className="max-w-2xl mx-auto py-3 sm:py-4 px-3 sm:px-4 space-y-4">
      {/* Top Bar: Navigation & Progress */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-black text-xs sm:text-sm cursor-pointer active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>← {operationTitles[operation]}</span>
        </button>

        <div className="flex items-center gap-3 flex-1 max-w-xs justify-end">
          <div className="w-full text-right space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>
                Soal {currentIndex + 1} dari {questions.length}
              </span>
              <span className="font-extrabold text-emerald-600">{correctCount} Benar</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {onSwitchToWorkbookGrid && (
            <button
              onClick={onSwitchToWorkbookGrid}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600 cursor-pointer hidden sm:inline whitespace-nowrap"
              title="Ganti ke Tampilan Buku Latihan (10 Soal/Hal)"
            >
              Grid 10 Soal
            </button>
          )}
        </div>
      </div>

      {/* Main Question Card (Large Typography & Rich Visual Layout) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden transition-all duration-300">
        {/* Header Badges inside Card */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider text-slate-400 uppercase">
              QUESTION {currentIndex + 1}
            </span>
            {currentQ.subCategory && (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {currentQ.subCategory}
              </span>
            )}
          </div>
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            +10 XP
          </span>
        </div>

        {/* Question Presentation */}
        <div className="my-4 flex flex-col items-center justify-center min-h-[140px]">
          {currentQ.verticalFormat ? (
            /* Vertical Math presentation (for addition/subtraction/multiplication) */
            <div className="my-2 scale-110 sm:scale-125">
              <VerticalMathCard data={currentQ.verticalFormat} />
            </div>
          ) : isTextProblem ? (
            /* Text or Story Problem Card */
            <div className="w-full bg-amber-50/70 p-5 rounded-2xl border border-amber-200 text-left space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-amber-800">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span className="uppercase tracking-wider">
                  {currentQ.subCategory || 'Pertanyaan'}
                </span>
              </div>
              <p className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </p>
            </div>
          ) : (
            /* Large Horizontal Arithmetic Display (e.g. 15 + 27 = ...) */
            <div className="text-center py-4 space-y-2">
              <span className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight block">
                {currentQ.numberSentence
                  ? `${currentQ.numberSentence} = ...`
                  : currentQ.question}
              </span>
            </div>
          )}
        </div>

        {/* Interactive Answer Box (Supports both physical keyboard and touch keypad) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitAnswer();
          }}
          className="max-w-xs mx-auto my-3 text-center"
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              inputMode="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Jawaban..."
              disabled={status === 'correct'}
              className={`w-full h-16 rounded-2xl border-2 text-center font-black text-3xl outline-none transition-all ${
                status === 'correct'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : status === 'incorrect'
                  ? 'bg-rose-50 border-rose-400 text-rose-700'
                  : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-500 focus:bg-white shadow-inner'
              }`}
            />
          </div>
        </form>

        {/* Feedback states: Correct banner */}
        {status === 'correct' && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in zoom-in-95">
            <span className="text-base font-black text-emerald-700 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ✓ Hebat sekali! Benar! (+10 XP)
            </span>
          </div>
        )}

        {/* Feedback states: Incorrect banner */}
        {status === 'incorrect' && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2 animate-in shake">
            <div className="text-sm font-black text-rose-700 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Belum tepat.</span>
            </div>
            <p className="text-xs text-rose-600 font-medium">
              {feedbackHint || 'Coba periksa kembali perhitunganmu.'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTryAgain}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-xs"
              >
                COBA LAGI
              </button>
              {currentQ.hint && (
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Petunjuk</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Optional Hint Dropdown */}
        {showHint && currentQ.hint && (
          <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold text-left">
            💡 <strong>Petunjuk:</strong> {currentQ.hint}
          </div>
        )}
      </div>

      {/* Touch-Friendly Keypad */}
      {status !== 'correct' && (
        <div className="pt-1">
          <NumericKeypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            onSubmit={handleSubmitAnswer}
            submitDisabled={!inputValue.trim()}
            allowSlash={operation === 'pecahan'}
          />
        </div>
      )}
    </div>
  );
};
