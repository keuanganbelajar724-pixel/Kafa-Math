import React, { useState } from 'react';
import { ChildProfile, WorkbookOperation, WorkbookDifficulty, GeneratedMathQuestion } from '../../types';
import { InteractivePracticeSession } from '../workbook/InteractivePracticeSession';
import { DigitalWorkbookView } from '../workbook/DigitalWorkbookView';
import { SkillCard } from '../ui/SkillCard';
import { sound } from '../../services/sound';
import {
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  Filter,
  CheckCircle2,
  FileText,
  Clock,
  Target,
  Printer,
  ChevronRight,
} from 'lucide-react';

interface PracticeViewProps {
  activeProfile: ChildProfile;
  onRewardXP: (xp: number, coins: number) => void;
  onAskAITutor: (question: GeneratedMathQuestion) => void;
  onOpenExamMode?: () => void;
  onOpenQuickMath?: () => void;
  onOpenMistakes?: () => void;
  onOpenWorksheets?: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  activeProfile,
  onRewardXP,
  onAskAITutor,
  onOpenExamMode,
  onOpenQuickMath,
  onOpenMistakes,
  onOpenWorksheets,
}) => {
  // Practice Modes: 'directory' | 'session' | 'workbook'
  const [viewMode, setViewMode] = useState<'directory' | 'session' | 'workbook'>('directory');
  const [selectedOperation, setSelectedOperation] = useState<WorkbookOperation>('penjumlahan');
  const [selectedGrade, setSelectedGrade] = useState<number>(() => {
    if (activeProfile.grade.includes('PAUD') || activeProfile.grade.includes('TK')) return 0;
    const match = activeProfile.grade.match(/\d+/);
    return match ? Number(match[0]) : 2;
  });
  const [difficulty, setDifficulty] = useState<WorkbookDifficulty>('sedang');
  const [tabFilter, setTabFilter] = useState<'all' | 'recommended'>('all');

  // Math Skills Catalog
  const ALL_SKILLS: {
    id: WorkbookOperation;
    title: string;
    desc: string;
    icon: string;
    difficulty: 'easy' | 'medium' | 'challenge';
    questionCount: number;
    progress: number;
    recommended?: boolean;
  }[] = [
    {
      id: 'penjumlahan',
      title: 'Penjumlahan',
      desc: 'Penjumlahan mendatar & bersusun dengan teknik menyimpan.',
      icon: '➕',
      difficulty: 'easy',
      questionCount: 10,
      progress: 92,
      recommended: true,
    },
    {
      id: 'pengurangan',
      title: 'Pengurangan',
      desc: 'Pengurangan bersusun dan teknik meminjam nilai puluhan.',
      icon: '➖',
      difficulty: 'easy',
      questionCount: 10,
      progress: 78,
    },
    {
      id: 'perkalian',
      title: 'Perkalian',
      desc: 'Tabel perkalian dasar 1-10 hingga perkalian puluhan bersusun.',
      icon: '✖️',
      difficulty: 'medium',
      questionCount: 15,
      progress: 61,
      recommended: true,
    },
    {
      id: 'pembagian',
      title: 'Pembagian',
      desc: 'Pembagian fakta dasar dan porogapit bersusun.',
      icon: '➗',
      difficulty: 'challenge',
      questionCount: 10,
      progress: 42,
    },
    {
      id: 'cerita',
      title: 'Soal Cerita',
      desc: 'Penerapan matematika sehari-hari dengan penalaran narasi.',
      icon: '📖',
      difficulty: 'medium',
      questionCount: 10,
      progress: 70,
      recommended: true,
    },
    {
      id: 'pecahan',
      title: 'Pecahan',
      desc: 'Pecahan senilai, bar model, dan visual irisan kue.',
      icon: '🍕',
      difficulty: 'medium',
      questionCount: 10,
      progress: 65,
      recommended: true,
    },
    {
      id: 'geometri',
      title: 'Geometri & Bangun',
      desc: 'Mengenal sifat bangun datar, ruang, dan sudut.',
      icon: '📐',
      difficulty: 'easy',
      questionCount: 10,
      progress: 80,
    },
    {
      id: 'waktu',
      title: 'Waktu & Jam',
      desc: 'Membaca jam analog dan digital, serta durasi aktivitas.',
      icon: '⏰',
      difficulty: 'easy',
      questionCount: 10,
      progress: 85,
    },
    {
      id: 'uang',
      title: 'Uang Rupiah',
      desc: 'Menghitung nilai uang Rupiah dan uang kembalian belanja.',
      icon: '💰',
      difficulty: 'medium',
      questionCount: 10,
      progress: 88,
    },
    {
      id: 'logika',
      title: 'Logika & Angka',
      desc: 'Teka-teki bilangan dan penalaran pola aljabar awal.',
      icon: '🧩',
      difficulty: 'challenge',
      questionCount: 10,
      progress: 58,
    },
    {
      id: 'data',
      title: 'Data & Tabel',
      desc: 'Membaca turus, tabel frekuensi, dan diagram batang.',
      icon: '📊',
      difficulty: 'easy',
      questionCount: 10,
      progress: 75,
    },
  ];

  // Handler to launch single-question interactive practice
  const handleStartSession = (opId: WorkbookOperation) => {
    setSelectedOperation(opId);
    setViewMode('session');
  };

  // If in interactive session mode
  if (viewMode === 'session') {
    return (
      <InteractivePracticeSession
        operation={selectedOperation}
        gradeLevel={selectedGrade}
        difficulty={difficulty}
        activeProfile={activeProfile}
        totalQuestionsCount={10}
        onBack={() => setViewMode('directory')}
        onRewardXP={onRewardXP}
        onOpenMistakes={onOpenMistakes}
        onSwitchToWorkbookGrid={() => setViewMode('workbook')}
      />
    );
  }

  // If in digital workbook (10 questions per page) mode
  if (viewMode === 'workbook') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200">
          <button
            onClick={() => setViewMode('directory')}
            className="text-xs font-black text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <span>← Kembali ke Menu Latihan</span>
          </button>
          <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Mode Buku Latihan (10 Soal per Halaman)
          </span>
        </div>
        <DigitalWorkbookView
          activeProfile={activeProfile}
          onRewardXP={onRewardXP}
          onAskAITutor={onAskAITutor}
          defaultOperation={selectedOperation}
        />
      </div>
    );
  }

  const displayedSkills =
    tabFilter === 'recommended'
      ? ALL_SKILLS.filter((s) => s.recommended)
      : ALL_SKILLS;

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      {/* 1. Header Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 rounded-full text-xs font-black flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                PRACTICE & WORKBOOK
              </span>
              <span className="text-xs font-extrabold text-slate-500">
                {selectedGrade === 0 ? 'PAUD/TK' : `Kelas ${selectedGrade} SD`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pilih materi yang ingin kamu latih. 📚
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              "Choose a skill to practice" • Asah penguasaan konsep matematika secara bertahap.
            </p>
          </div>

          {/* Quick Mode Buttons (Interactive vs Workbook 10 Soal) */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('workbook');
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-black text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>📘 Buka Buku Latihan (Grid 10 Soal)</span>
            </button>
          </div>
        </div>

        {/* Grade Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-slate-100 mt-5 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 mr-2 flex-shrink-0">Tingkat:</span>
          {[
            { level: 0, label: 'Semua' },
            { level: 1, label: 'Kelas 1' },
            { level: 2, label: 'Kelas 2' },
            { level: 3, label: 'Kelas 3' },
            { level: 4, label: 'Kelas 4' },
            { level: 5, label: 'Kelas 5' },
            { level: 6, label: 'Kelas 6' },
          ].map((item) => (
            <button
              key={item.level}
              onClick={() => {
                sound.playClick();
                setSelectedGrade(item.level);
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs flex-shrink-0 transition-all cursor-pointer border ${
                selectedGrade === item.level
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Tabs: Recommended vs All Skills */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setTabFilter('all');
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer ${
              tabFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Semua Materi (All Skills)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTabFilter('recommended');
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              tabFilter === 'recommended'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Rekomendasi (Recommended)</span>
          </button>
        </div>

        <span className="text-xs font-bold text-slate-400 hidden sm:inline">
          {displayedSkills.length} Materi Tersedia
        </span>
      </div>

      {/* 3. Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedSkills.map((skill) => (
          <SkillCard
            key={skill.id}
            icon={skill.icon}
            title={skill.title}
            desc={skill.desc}
            difficulty={skill.difficulty}
            questionCount={skill.questionCount}
            progress={skill.progress}
            onClick={() => handleStartSession(skill.id)}
          />
        ))}
      </div>

      {/* 4. Quick Assessment Hub (Exam, Quick Math, Mistakes, Worksheets) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3 mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black text-slate-900">
            Fitur Latihan Tambahan & Evaluasi
          </h3>
          <span className="text-xs font-bold text-slate-400">Siap Ujian & Berhitung Kilat</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {onOpenExamMode && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenExamMode();
              }}
              className="p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-left transition-all active:scale-95 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-lg mb-2">
                📝
              </div>
              <span className="font-extrabold text-xs text-slate-800 block">Simulasi Ujian</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">10-50 Soal & Skor Nilai</span>
            </button>
          )}

          {onOpenQuickMath && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenQuickMath();
              }}
              className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all active:scale-95 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg mb-2">
                ⚡
              </div>
              <span className="font-extrabold text-xs text-slate-800 block">Quick Math</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Tantangan Waktu 60 Detik</span>
            </button>
          )}

          {onOpenMistakes && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenMistakes();
              }}
              className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-left transition-all active:scale-95 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-lg mb-2">
                🎯
              </div>
              <span className="font-extrabold text-xs text-slate-800 block">Bank Kesalahan</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Ulangi Soal Belum Tepat</span>
            </button>
          )}

          {onOpenWorksheets && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenWorksheets();
              }}
              className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all active:scale-95 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg mb-2">
                🖨️
              </div>
              <span className="font-extrabold text-xs text-slate-800 block">Lembar Kerja Cetak</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">PDF Siap Print A4</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
