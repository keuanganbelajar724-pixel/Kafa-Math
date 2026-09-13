import React from 'react';
import { ChildProfile, MapNode } from '../../types';
import { KafaMascot } from '../KafaMascot';
import { getGradeFromProfile, ALL_GRADE_METADATA } from '../../data/curriculumData';
import { sound } from '../../services/sound';
import {
  Play,
  Flame,
  Star,
  Coins,
  Trophy,
  Sparkles,
  Gamepad2,
  MapPin,
  Compass,
  ArrowRight,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

interface HomeViewProps {
  activeProfile: ChildProfile;
  onContinueLearning: () => void;
  onOpenDailyChallenge: () => void;
  onNavigateTab: (tab: 'home' | 'map' | 'game' | 'progress' | 'profile') => void;
  onLaunchMinigame: (gameId: string) => void;
  onStartQuickQuestion: (topicId: string) => void;
  onChangeGrade: (gradeLevel: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  activeProfile,
  onContinueLearning,
  onOpenDailyChallenge,
  onNavigateTab,
  onLaunchMinigame,
  onStartQuickQuestion,
  onChangeGrade,
}) => {
  const currentGradeNum = getGradeFromProfile(activeProfile.grade);
  const activeGradeMeta = ALL_GRADE_METADATA[currentGradeNum] || ALL_GRADE_METADATA[1];

  // Calculate daily progress (e.g., target 10 questions)
  const dailyTarget = 10;
  const todayDone = activeProfile.dailyQuestionsDone || 0;
  const progressPercent = Math.min(100, Math.round((todayDone / dailyTarget) * 100));

  // Calculate level progress (e.g., 100 XP per level)
  const xpInCurrentLevel = activeProfile.xp % 100;

  // Curated featured mini-games
  const featuredGames = [
    {
      id: 'venn_diagram_sorter',
      title: 'Studio Diagram Venn',
      desc: 'Kelompokkan bilangan & bangun ke irisan A ∩ B!',
      icon: '📊',
      color: 'from-violet-600 to-indigo-600',
      tag: 'Diagram Venn ⭕',
    },
    {
      id: 'geoboard_perimeter_area',
      title: 'Studio Geoboard Karet',
      desc: 'Regangkan karet ukur Luas petak & Keliling!',
      icon: '📐',
      color: 'from-emerald-600 to-teal-600',
      tag: 'Papan Geoboard 🟩',
    },
    {
      id: 'pan_balance_scale',
      title: 'Neraca Aljabar & Massa',
      desc: 'Seimbangkan piring neraca dengan anak timbangan!',
      icon: '⚖️',
      color: 'from-amber-500 to-yellow-600',
      tag: 'Neraca Seimbang ⚖️',
    },
    {
      id: 'angle_protractor_lab',
      title: 'Lab Busur Derajat Sudut',
      desc: 'Putar busur ukur sudut lancip, siku-siku, & tumpul!',
      icon: '🧭',
      color: 'from-cyan-500 to-teal-600',
      tag: 'Busur Sudut 📐',
    },
    {
      id: 'liquid_measuring_jug',
      title: 'Takaran Gelas Ukur',
      desc: 'Tuang & ukur cairan mL & Liter!',
      icon: '🧪',
      color: 'from-cyan-500 to-blue-600',
      tag: 'Volume mL & L 💧',
    },
    {
      id: 'barchart_builder',
      title: 'Studio Diagram Batang',
      desc: 'Sentuh & naikkan batang data turus!',
      icon: '📊',
      color: 'from-indigo-500 to-purple-600',
      tag: 'Diagram Batang 📈',
    },
    {
      id: 'number_line_frog',
      title: 'Lompat Kodok Garis Bilangan',
      desc: 'Sentuh & lompat menembus 10 & 20!',
      icon: '🐸',
      color: 'from-emerald-500 to-teal-600',
      tag: 'Garis Bilangan 🪷',
    },
    {
      id: 'tangram_symmetry',
      title: 'Studio Cermin Simetri',
      desc: 'Sentuh kotak cermin melengkapi kupu-kupu & robot!',
      icon: '🪞',
      color: 'from-pink-500 to-rose-600',
      tag: 'Simetri Lipat 🦋',
    },
    {
      id: 'place_value_blocks',
      title: 'Blok Nilai Tempat',
      desc: 'Manipulatif Dienes Blocks & Regrouping!',
      icon: '🪵',
      color: 'from-amber-500 to-orange-600',
      tag: 'Dienes Blocks 🧱',
    },
    {
      id: 'ruler_measurement',
      title: 'Penggaris Geser',
      desc: 'Geser penggaris & ukur benda nyata!',
      icon: '📏',
      color: 'from-cyan-500 to-teal-600',
      tag: 'Penggaris 📐',
    },
    {
      id: 'cake_fraction_slicer',
      title: 'Bagi & Potong Kue',
      desc: 'Sentuh pisau & bagi kue pecahan!',
      icon: '🍰',
      color: 'from-rose-500 to-pink-600',
      tag: 'Cambridge 🇬🇧 Sentuh',
    },
    {
      id: 'draw_line_match',
      title: 'Tarik Garis Mencocokkan',
      desc: 'Sentuh & tarik garis pasangannya!',
      icon: '✏️',
      color: 'from-indigo-500 to-purple-600',
      tag: 'Tarik Garis ✍️',
    },
    {
      id: 'makan_kerupuk',
      title: 'Makan Kerupuk',
      desc: 'Lomba makan kerupuk khas 17-an!',
      icon: '🍘',
      color: 'from-amber-400 to-orange-500',
      tag: 'Tradisional 🇮🇩',
    },
    {
      id: 'tarik_tambang',
      title: 'Tarik Tambang',
      desc: 'Tarik tambang seru bareng tim KAFA!',
      icon: '🪢',
      color: 'from-blue-500 to-indigo-600',
      tag: 'Duel Tim 🏆',
    },
    {
      id: 'math_vs_monster',
      title: 'Pendekar vs Monster',
      desc: 'Pertarungan seru tembak monster angka!',
      icon: '⚔️',
      color: 'from-red-500 to-rose-600',
      tag: 'Aksi Seru 🔥',
    },
    {
      id: 'racing_math',
      title: 'Balap Mobil Matematika',
      desc: 'Pacu kecepatan kendaraanmu!',
      icon: '🏎️',
      color: 'from-emerald-500 to-teal-600',
      tag: 'Balapan 🏁',
    },
    {
      id: 'warung_rupiah',
      title: 'Kasir Warung Rupiah',
      desc: 'Belanja dan hitung uang kembalian!',
      icon: '🏪',
      color: 'from-purple-500 to-indigo-600',
      tag: 'Uang Rupiah 💰',
    },
  ];

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* 1. Playful Hero Greeting Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border-3 border-white/40">
        {/* Playful Floating Decors */}
        <div className="absolute -right-8 -top-8 text-8xl opacity-15 pointer-events-none select-none">
          🏝️
        </div>
        <div className="absolute right-20 -bottom-10 text-7xl opacity-15 pointer-events-none select-none">
          ⭐
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-3">
            {/* Top Tagline & Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide border border-white/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                KAFA MATH • "Belajar Matematika, Main Sambil Hebat!"
              </span>
              <span className="bg-amber-950/40 text-amber-200 px-3 py-1 rounded-full text-xs font-extrabold">
                {activeGradeMeta.label}
              </span>
            </div>

            {/* Greeting Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Selamat datang, {activeProfile.name}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 font-semibold mt-1 max-w-xl">
                Siap memulai petualangan seru hari ini? Taklukkan tantangan matematika dan kumpulkan koin emas!
              </p>
            </div>

            {/* Game Stats Bar: Streak, XP, Coins, Stars */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap pt-1">
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-xs font-black border border-white/20">
                <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
                <span>{activeProfile.streak} Hari Streak 🔥</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-xs font-black border border-white/20">
                <span className="text-amber-300 text-sm">🪙</span>
                <span>{activeProfile.coins} Koin KAFA</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-xs font-black border border-white/20">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>{activeProfile.completedNodes.length * 3} Bintang</span>
              </div>
            </div>
          </div>

          {/* Large Interactive Mascot on Right */}
          <div className="self-center md:self-auto flex-shrink-0">
            <KafaMascot
              mood="cheering"
              customMessage={`Halo ${activeProfile.name}! Yuk kita lanjut belajar, aku temani kamu berpetualang!`}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* 2. Big Action Hub: "LANJUT BELAJAR" & Level Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main CTA Card: "LANJUT BELAJAR" */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border-3 border-amber-300 shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-4 h-4" /> Petualangan Matematika
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">
                Level {activeProfile.level} • {activeGradeMeta.phaseLabel}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Selesaikan tantangan untuk membuka pos berikutnya di peta!
              </p>
            </div>

            <div className="text-right self-start sm:self-auto">
              <span className="text-xs font-bold text-slate-400 block">Kemajuan Level</span>
              <span className="text-lg font-black text-amber-600">
                {xpInCurrentLevel} / 100 XP
              </span>
            </div>
          </div>

          {/* Level Progress Bar: [██████░░░░] */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${Math.max(8, xpInCurrentLevel)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1">
              <span>Level {activeProfile.level}</span>
              <span>Level {activeProfile.level + 1} (Tingkat Berikutnya)</span>
            </div>
          </div>

          {/* Big Prominent Action Button: LANJUT BELAJAR */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onContinueLearning();
              }}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base sm:text-lg rounded-2xl shadow-lg flex items-center justify-center gap-3 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95 group"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
              <span>▶ LANJUT BELAJAR</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('map');
              }}
              className="py-4 px-5 bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Buka Peta Dunia</span>
            </button>
          </div>
        </div>

        {/* Daily Math Challenge Card */}
        <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col justify-between space-y-4 border-2 border-orange-400 relative overflow-hidden">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" /> Harian
              </span>
              <span className="text-xs font-black text-yellow-200">+20 Koin 🪙</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black mt-2">🔥 Daily Math Challenge</h3>
            <p className="text-xs text-amber-100 font-medium">
              Selesaikan 10 soal kilat hari ini untuk raih bonus <strong>+50 XP</strong> dan <strong>+20 Koin</strong>!
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-xs rounded-2xl p-3 border border-white/20">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span>Target Harian</span>
              <span>{todayDone} / {dailyTarget} Soal</span>
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenDailyChallenge();
            }}
            className="w-full py-3 bg-white hover:bg-amber-50 text-orange-600 font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Mulai Tantangan Hari Ini</span>
          </button>
        </div>
      </div>

      {/* 3. Grade & Curriculum Quick Selector Bar */}
      <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm sm:text-base font-black text-slate-800">
              Pilih Tingkat Belajar Matematika:
            </h3>
          </div>
          <span className="text-xs font-bold text-orange-600 hidden sm:inline">
            Tersedia PAUD hingga Kelas 6 SD Lengkap!
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { level: 0, label: 'PAUD/TK', icon: '🍎' },
            { level: 1, label: 'Kelas 1', icon: '🌱' },
            { level: 2, label: 'Kelas 2', icon: '🌿' },
            { level: 3, label: 'Kelas 3', icon: '⭐' },
            { level: 4, label: 'Kelas 4', icon: '🚀' },
            { level: 5, label: 'Kelas 5', icon: '💎' },
            { level: 6, label: 'Kelas 6', icon: '👑' },
          ].map((item) => {
            const isCurrent = currentGradeNum === item.level;
            return (
              <button
                key={item.level}
                onClick={() => onChangeGrade(item.level)}
                className={`p-2.5 rounded-2xl text-center font-black text-xs transition-all cursor-pointer border-2 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-600 shadow-md scale-[1.03]'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-lg block mb-0.5">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Featured Mini Games Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-orange-600" />
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              🎮 Arena Mini Game Pilihan
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('game')}
            className="text-xs font-black text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Game</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {featuredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                sound.playClick();
                onLaunchMinigame(game.id);
              }}
              className="bg-white rounded-3xl p-4 border-2 border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-2xs">
                    {game.icon}
                  </div>
                  <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    {game.tag}
                  </span>
                </div>
                <h4 className="font-black text-slate-800 text-sm group-hover:text-orange-600 transition-colors">
                  {game.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug">
                  {game.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-orange-600">
                <span>Main Sekarang</span>
                <Play className="w-3.5 h-3.5 fill-orange-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Rekomendasi Latihan (Adaptive Learning Highlights) */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <div>
              <h3 className="font-black text-slate-800 text-sm sm:text-base">
                Rekomendasi Latihan Hari Ini
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Disesuaikan untuk mengasah kemampuan {activeGradeMeta.label}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('progress')}
            className="text-xs font-black text-orange-600 hover:text-orange-700 cursor-pointer"
          >
            Lihat Statistik
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: 'Operasi Hitung Kilat',
              desc: 'Asah ketangkasan tambah dan kurang cepat.',
              icon: '⚡',
              topicId: 'fase_a_penjumlahan',
            },
            {
              title: 'Pola Bilangan & Angka',
              desc: 'Tebak urutan dan kelipatan angka tersembunyi.',
              icon: '🔢',
              topicId: 'fondasi_angka',
            },
            {
              title: 'Soal Cerita Sehari-hari',
              desc: 'Latihan logika belanja dan pembagian adil.',
              icon: '📖',
              topicId: 'fase_a_uang_waktu',
            },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playClick();
                onStartQuickQuestion(item.topicId);
              }}
              className="p-4 rounded-2xl bg-white hover:bg-amber-100/50 border-2 border-amber-200 text-left transition-all cursor-pointer flex items-center justify-between group shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-slate-800">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
