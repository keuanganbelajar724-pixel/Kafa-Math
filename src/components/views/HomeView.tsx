import React from 'react';
import { ChildProfile, WorkbookOperation } from '../../types';
import { getLevelInfo } from '../../services/storage';
import { sound } from '../../services/sound';
import { StatCard } from '../ui/StatCard';
import { ProgressBar } from '../ui/ProgressBar';
import {
  Play,
  Flame,
  Star,
  Trophy,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Gamepad2,
  ChevronRight,
  Target,
  FileText,
  Clock,
  Printer,
  Compass,
} from 'lucide-react';

interface HomeViewProps {
  activeProfile: ChildProfile;
  onContinueLearning: () => void;
  onOpenDailyChallenge: () => void;
  onNavigateTab: (tab: 'home' | 'workbook' | 'map' | 'game' | 'progress' | 'profile') => void;
  onLaunchMinigame: (gameId: string) => void;
  onStartQuickQuestion: (topicId: string) => void;
  onChangeGrade: (gradeLevel: number) => void;
  onOpenExamMode?: () => void;
  onOpenQuickMath?: () => void;
  onOpenMistakes?: () => void;
  onOpenWorksheets?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  activeProfile,
  onContinueLearning,
  onOpenDailyChallenge,
  onNavigateTab,
  onLaunchMinigame,
  onStartQuickQuestion,
  onChangeGrade,
  onOpenExamMode,
  onOpenQuickMath,
  onOpenMistakes,
  onOpenWorksheets,
}) => {
  const levelInfo = getLevelInfo(activeProfile.xp);

  // Daily target: 10 questions to keep streak
  const dailyTarget = 10;
  const todayDone = Math.min(dailyTarget, activeProfile.dailyQuestionsDone || 6);
  const dailyProgress = Math.round((todayDone / dailyTarget) * 100);

  // Accuracy calculation or standard default
  const accuracyScore = 87;

  // Last practiced topic
  const lastTopicName = 'Perkalian';
  const lastTopicProgress = 68;

  // 10 Math Skills Catalog
  const MATH_SKILLS: {
    id: WorkbookOperation;
    title: string;
    icon: string;
    progress: number;
  }[] = [
    { id: 'penjumlahan', title: 'Penjumlahan', icon: '➕', progress: 92 },
    { id: 'pengurangan', title: 'Pengurangan', icon: '➖', progress: 78 },
    { id: 'perkalian', title: 'Perkalian', icon: '✖️', progress: 61 },
    { id: 'pembagian', title: 'Pembagian', icon: '➗', progress: 42 },
    { id: 'pecahan', title: 'Pecahan', icon: '🍕', progress: 65 },
    { id: 'geometri', title: 'Geometri', icon: '📐', progress: 80 },
    { id: 'waktu', title: 'Waktu', icon: '⏰', progress: 85 },
    { id: 'uang', title: 'Uang', icon: '💰', progress: 88 },
    { id: 'logika', title: 'Logika', icon: '🧩', progress: 58 },
    { id: 'data', title: 'Data', icon: '📊', progress: 75 },
  ];

  // Curated featured games
  const featuredGames = [
    {
      id: 'cake_fraction_slicer',
      title: 'Bagi & Potong Kue',
      desc: 'Sentuh pisau & potong kue sesuai pecahan!',
      icon: '🍰',
      tag: 'Pecahan 🍕',
    },
    {
      id: 'geoboard_perimeter_area',
      title: 'Geoboard Karet',
      desc: 'Regangkan karet untuk ukur luas dan keliling!',
      icon: '📐',
      tag: 'Geometri 📐',
    },
    {
      id: 'pan_balance_scale',
      title: 'Neraca Aljabar',
      desc: 'Seimbangkan piring neraca dengan anak timbangan!',
      icon: '⚖️',
      tag: 'Timbangan ⚖️',
    },
    {
      id: 'warung_rupiah',
      title: 'Kasir Warung Rupiah',
      desc: 'Belanja dan hitung uang kembalian belanja!',
      icon: '🏪',
      tag: 'Uang Rupiah 💰',
    },
  ];

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      {/* 1. HEADER: Halo, [Nama]! 👋 & Siap latihan matematika hari ini? */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Halo, {activeProfile.name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-0.5">
            Siap latihan matematika hari ini?
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black">
            {activeProfile.grade}
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('map');
            }}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Peta Petualangan</span>
          </button>
        </div>
      </div>

      {/* 2. HERO CARD: Misi Hari Ini (Main Visual Focus) */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-[0_12px_40px_rgba(22,163,74,0.22)] relative overflow-hidden border border-emerald-400/40">
        {/* Soft decorative background circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-xl" />
        <div className="absolute right-32 -bottom-16 w-60 h-60 rounded-full bg-white/5 pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide border border-white/25 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-yellow-300" />
                MISI HARI INI
              </span>
              <span className="text-emerald-100 text-xs font-bold">
                +50 XP Bonus Menanti
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight text-white">
              10 soal untuk menjaga streak kamu.
            </h2>

            {/* Progress: 6 / 10 with clean bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-bold text-emerald-100">
                <span>Progress:</span>
                <span className="text-white font-extrabold text-sm">
                  {todayDone} / {dailyTarget} Soal Selesai
                </span>
              </div>
              <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="bg-yellow-300 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${dailyProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Big CTA: [ LANJUTKAN ] */}
          <div className="flex-shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('workbook');
              }}
              className="w-full md:w-auto px-8 py-4 bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 font-black text-base sm:text-lg rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5"
            >
              <Play className="w-5 h-5 fill-emerald-600" />
              <span>LANJUTKAN</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. QUICK STATS (Compact Stat Cards below Hero) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<Star className="w-5 h-5 text-amber-500 fill-amber-400" />}
          label="Total XP"
          value={`${activeProfile.xp.toLocaleString()} XP`}
          highlightColor="amber"
          subtext={`Menuju Lv.${levelInfo.level + 1}`}
        />

        <StatCard
          icon={<Flame className="w-5 h-5 text-rose-500 fill-rose-500" />}
          label="Streak Latihan"
          value={`${activeProfile.streak} Hari`}
          highlightColor="rose"
          subtext="Tetap konsisten!"
        />

        <StatCard
          icon={<Trophy className="w-5 h-5 text-emerald-600" />}
          label="Level Kamu"
          value={`Level ${levelInfo.level}`}
          highlightColor="green"
          subtext={levelInfo.title}
        />

        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-sky-600" />}
          label="Akurasi Jawaban"
          value={`${accuracyScore}%`}
          highlightColor="blue"
          subtext="Sangat Baik"
        />
      </div>

      {/* 4. CONTINUE LEARNING CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-2xl flex-shrink-0">
            📘
          </div>
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Lanjutkan Belajar
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">{lastTopicName}</h3>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {lastTopicProgress}% Selesai
              </span>
            </div>
            <div className="w-48 sm:w-64 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${lastTopicProgress}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onNavigateTab('workbook');
          }}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <span>LANJUTKAN →</span>
        </button>
      </div>

      {/* 5. RECOMMENDED PRACTICE: ✨ Rekomendasi Untukmu */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Rekomendasi Untukmu
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('workbook')}
            className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Semua Latihan</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Penjumlahan */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black">
                  ➕
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Mudah
                </span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900">Penjumlahan</h4>
              <p className="text-xs text-slate-500 mt-1">10 soal latihan teknik menyimpan & berhitung cepat.</p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('workbook');
              }}
              className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              <span>Mulai Latihan (10 Soal)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Perkalian */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-amber-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-black">
                  ✖️
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Sedang
                </span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900">Perkalian</h4>
              <p className="text-xs text-slate-500 mt-1">15 soal tabel perkalian dasar dan bersusun.</p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('workbook');
              }}
              className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-amber-600 hover:text-amber-700 cursor-pointer"
            >
              <span>Mulai Latihan (15 Soal)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Soal Cerita */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-sky-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl font-black">
                  📖
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  Sedang
                </span>
              </div>
              <h4 className="font-extrabold text-base text-slate-900">Soal Cerita</h4>
              <p className="text-xs text-slate-500 mt-1">10 soal cerita kontekstual kehidupan sehari-hari.</p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('workbook');
              }}
              className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-sky-600 hover:text-sky-700 cursor-pointer"
            >
              <span>Mulai Latihan (10 Soal)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. MATH SKILLS GRID (MATERI MATEMATIKA) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider">
            MATERI MATEMATIKA
          </h3>
          <span className="text-xs font-bold text-slate-400">10 Topik Kurikulum SD</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {MATH_SKILLS.map((skill) => (
            <button
              key={skill.id}
              onClick={() => {
                sound.playClick();
                onNavigateTab('workbook');
              }}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/80 hover:border-emerald-300 hover:shadow-sm text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {skill.icon}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {skill.progress}%
                </span>
              </div>
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                {skill.title}
              </span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 7. QUICK ACCESS TO MINI-GAMES & ASSESSMENT MODES */}
      <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-purple-600" />
            <h3 className="font-black text-slate-900 text-sm sm:text-base">
              Game Matematika Pilihan
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('game')}
            className="text-xs font-black text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Game Center</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                sound.playClick();
                onLaunchMinigame(game.id);
              }}
              className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {game.tag}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-purple-600 transition-colors">
                  {game.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{game.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-purple-600">
                <span>Mainkan</span>
                <Play className="w-3.5 h-3.5 fill-purple-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
