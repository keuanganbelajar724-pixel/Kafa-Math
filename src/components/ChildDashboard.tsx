import React, { useState } from 'react';
import { ChildProfile, MapNode } from '../types';
import {
  CURRICULUM_TOPICS,
  ALL_GRADE_METADATA,
  getTopicsByGrade,
  getGradeFromProfile,
  GradeCurriculumInfo,
} from '../data/curriculumData';
import { ALL_ACHIEVEMENTS } from '../data/achievementsData';
import { AdventureMap } from './AdventureMap';
import { sound } from '../services/sound';
import {
  Sparkles,
  Gamepad2,
  Map,
  Trophy,
  Play,
  CheckCircle2,
  Star,
  Flame,
  ChevronRight,
  Award,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkle,
  Check,
  Compass,
  ArrowRight,
  Globe2,
} from 'lucide-react';
import { FirebaseSyncPanel } from './FirebaseSyncPanel';

interface Props {
  activeProfile: ChildProfile;
  onSelectNode: (node: MapNode) => void;
  onLaunchMinigame: (gameId: string) => void;
  onStartQuickQuestion: (topicId: string) => void;
  onOpenShop: () => void;
  onOpenDiagnostic: () => void;
  onOpenMathLab?: () => void;
  onOpenExamSimulation?: () => void;
  onOpenMathDuel?: () => void;
  onOpenFormulaHandbook?: () => void;
  onOpenWorksheets?: () => void;
  onChangeGrade?: (gradeLevel: number) => void;
}

export const ChildDashboard: React.FC<Props> = ({
  activeProfile,
  onSelectNode,
  onLaunchMinigame,
  onStartQuickQuestion,
  onOpenShop,
  onOpenDiagnostic,
  onOpenMathLab,
  onOpenExamSimulation,
  onOpenMathDuel,
  onOpenFormulaHandbook,
  onOpenWorksheets,
  onChangeGrade,
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'games' | 'curriculum' | 'tools' | 'achievements'>('map');
  const [gameFilter, setGameFilter] = useState<'all' | 'monster' | 'adventure' | 'action' | 'classic' | 'kls1' | 'kls2' | 'kls3' | 'kls4' | 'kls5' | 'kls6' | 'pondasi'>('all');

  // Active grade level number (0..6)
  const currentGradeNum = getGradeFromProfile(activeProfile.grade);
  const [selectedCurriculumGrade, setSelectedCurriculumGrade] = useState<number>(currentGradeNum);

  const activeGradeMeta: GradeCurriculumInfo = ALL_GRADE_METADATA[currentGradeNum] || ALL_GRADE_METADATA[1];
  const viewingGradeMeta: GradeCurriculumInfo = ALL_GRADE_METADATA[selectedCurriculumGrade] || ALL_GRADE_METADATA[currentGradeNum];

  // Topics for the currently viewed grade in Curriculum tab
  const gradeTopics = getTopicsByGrade(selectedCurriculumGrade);

  const handleGradeSelect = (gradeLevel: number) => {
    sound.playClick();
    setSelectedCurriculumGrade(gradeLevel);
    if (onChangeGrade) {
      onChangeGrade(gradeLevel);
    }
  };

  const minigames = [
    // Featured Hero Action Battle Game
    {
      id: 'math_vs_monster',
      title: 'Pendekar Math vs Monster',
      desc: 'Aksi pertarungan seru real-time! Tembakkan senjata matematika ke monster dan kalahkan Raja Golem!',
      icon: '⚔️',
      color: 'from-red-500 via-orange-600 to-amber-700',
      category: 'monster',
      gradeBadge: 'Kelas 1 - 6 SD & PAUD',
      tag: 'Aksi Real-Time 🔥',
      isNew: true,
      featured: true,
      gradeLevel: [0, 1, 2, 3, 4, 5, 6],
    },
    // Epic Space Action Explorer
    {
      id: 'space_explorer',
      title: 'Penjelajah Antariksa Garuda',
      desc: 'Kendalikan roket antariksa, tembak asteroid dan kalahkan Induk Alien sebelum tertabrak!',
      icon: '🚀',
      color: 'from-violet-600 via-cyan-600 to-slate-950',
      category: 'adventure',
      gradeBadge: 'Kelas 1 - 6 SD & PAUD',
      tag: 'Aksi Antariksa ☄️',
      isNew: true,
      featured: true,
      gradeLevel: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      id: 'temple_escape',
      title: 'Ekspedisi Candi Matematika',
      desc: 'Petualangan RPG jelajah 5 ruang candi kuno & bos golem batu',
      icon: '🏛️',
      color: 'from-amber-600 via-orange-600 to-stone-800',
      category: 'adventure',
      gradeBadge: 'Kelas 1 - 6 SD',
      tag: 'Mode RPG',
      isNew: true,
      gradeLevel: [1, 2, 3, 4, 5, 6],
    },
    {
      id: 'pirate_voyage',
      title: 'Bajak Laut Samudra Bahari',
      desc: 'Arungi 7 samudra Nusantara, tembak meriam & cari peti harta karun',
      icon: '⛵',
      color: 'from-sky-500 via-blue-600 to-indigo-800',
      category: 'adventure',
      gradeBadge: 'Kelas 1 - 6 SD',
      tag: 'Petualangan Laut',
      isNew: true,
      gradeLevel: [1, 2, 3, 4, 5, 6],
    },
    {
      id: 'tower_defense',
      title: 'Petualangan Math vs Zombi & Monster',
      desc: 'Tembak ketapel sakti hadapi gelombang zombi berjalan di padang rumput!',
      icon: '🧟‍♂️',
      color: 'from-emerald-500 via-teal-600 to-amber-900',
      category: 'monster',
      gradeBadge: 'Kelas 1 - 6 SD & PAUD',
      tag: 'Aksi Zombi Seru 🧟',
      isNew: true,
      featured: true,
      gradeLevel: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      id: 'jungle_safari',
      title: 'Safari Rimba Satwa Langka',
      desc: 'Selamatkan orangutan, komodo & harimau dengan jembatan matematika',
      icon: '🦧',
      color: 'from-lime-500 via-emerald-600 to-teal-800',
      category: 'adventure',
      gradeBadge: 'Kelas 1 - 6 SD',
      tag: 'Ekspedisi Hutan',
      isNew: true,
      gradeLevel: [1, 2, 3, 4, 5, 6],
    },
    {
      id: 'minecart_rush',
      title: 'Kereta Tambang Gua Emas',
      desc: 'Pacu gerbong tambang bawah tanah dan geser rel cepat sebelum tertabrak',
      icon: '🛒',
      color: 'from-yellow-500 via-amber-600 to-stone-900',
      category: 'adventure',
      gradeBadge: 'Kelas 1 - 6 SD',
      tag: 'Aksi Cepat',
      isNew: true,
      gradeLevel: [1, 2, 3, 4, 5, 6],
    },
    {
      id: 'warung_rupiah',
      title: 'Warung Kasir Rupiah',
      desc: 'Hitung belanja martabak, bakso & uang kembalian pecahan Rupiah',
      icon: '🏪',
      color: 'from-emerald-400 to-teal-500',
      category: 'classic',
      gradeBadge: 'Kelas 1 - 3 SD',
      tag: 'Uang Rupiah',
      gradeLevel: [1, 2, 3],
    },
    {
      id: 'fraction_pizza',
      title: 'Pecahan Martabak & Pizza',
      desc: 'Warnai potongan loyang pizza & martabak manis',
      icon: '🍕',
      color: 'from-orange-400 to-rose-500',
      category: 'classic',
      gradeBadge: 'Kelas 3 - 5 SD',
      tag: 'Pecahan',
      gradeLevel: [3, 4, 5],
    },
    {
      id: 'racing_math',
      title: 'Balap Perahu Kilat Bahari',
      desc: 'Pacu perahu motor cepat dengan ketepatan berhitung',
      icon: '🚤',
      color: 'from-sky-400 to-blue-600',
      category: 'classic',
      gradeBadge: 'Kelas 2 - 5 SD',
      tag: 'Aritmatika',
      gradeLevel: [2, 3, 4, 5],
    },
    {
      id: 'clock_master',
      title: 'Jam Analog Interaktif',
      desc: 'Atur jarum jam waktu sekolah, mengaji & bermain',
      icon: '⏰',
      color: 'from-yellow-400 to-amber-500',
      category: 'classic',
      gradeBadge: 'Kelas 1 - 3 SD',
      tag: 'Waktu & Jam',
      gradeLevel: [1, 2, 3],
    },
    {
      id: 'catch_numbers',
      title: 'Tangkap Angka Jatuh',
      desc: 'Latih kelipatan & bilangan dengan keranjang lincah',
      icon: '🍎',
      color: 'from-amber-400 to-orange-500',
      category: 'classic',
      gradeBadge: 'PAUD - Kelas 2 SD',
      tag: 'Bilangan',
      gradeLevel: [0, 1, 2],
    },
    {
      id: 'garden_counter',
      title: 'Kebun Buah Berhitung',
      desc: 'Petik mangga, apel & pisang tropis Nusantara',
      icon: '🌳',
      color: 'from-emerald-500 to-green-600',
      category: 'classic',
      gradeBadge: 'PAUD / TK - Kls 1',
      tag: 'Mencacah',
      gradeLevel: [0, 1],
    },
    {
      id: 'balance_scale',
      title: 'Timbangan Neraca Seimbang',
      desc: 'Seimbangkan kilogram beban & anak timbangan',
      icon: '⚖️',
      color: 'from-cyan-400 to-teal-500',
      category: 'classic',
      gradeBadge: 'Kelas 2 - 4 SD',
      tag: 'Pengukuran',
      gradeLevel: [2, 3, 4],
    },
    {
      id: 'geometry_builder',
      title: 'Bangun Datar Arsitek',
      desc: 'Susun bentuk segitiga, persegi & trapesium rumah adat',
      icon: '📐',
      color: 'from-indigo-400 to-purple-600',
      category: 'classic',
      gradeBadge: 'Kelas 1 - 4 SD',
      tag: 'Geometri',
      gradeLevel: [1, 2, 3, 4],
    },
    {
      id: 'pattern_guess',
      title: 'Tebak Pola Warna Batik',
      desc: 'Lanjutkan rangkaian motif batik dan warna ceria',
      icon: '🎨',
      color: 'from-pink-400 to-rose-600',
      category: 'classic',
      gradeBadge: 'PAUD - Kelas 2 SD',
      tag: 'Pola',
      gradeLevel: [0, 1, 2],
    },
  ];

  const filteredGames = minigames.filter((g) => {
    if (gameFilter === 'all') return true;
    if (gameFilter === 'monster') return g.category === 'monster';
    if (gameFilter === 'adventure') return g.category === 'adventure' || g.category === 'monster';
    if (gameFilter === 'action') return g.isNew === true;
    if (gameFilter === 'classic') return g.category === 'classic';
    if (gameFilter === 'pondasi') return g.gradeLevel?.includes(0);
    if (gameFilter === 'kls1') return g.gradeLevel?.includes(1);
    if (gameFilter === 'kls2') return g.gradeLevel?.includes(2);
    if (gameFilter === 'kls3') return g.gradeLevel?.includes(3);
    if (gameFilter === 'kls4') return g.gradeLevel?.includes(4);
    if (gameFilter === 'kls5') return g.gradeLevel?.includes(5);
    if (gameFilter === 'kls6') return g.gradeLevel?.includes(6);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. PROMINENT GRADE SELECTOR & CURRICULUM BANNER ("SETTING DI DEPAN/AWAL") */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/60 via-orange-50/40 to-transparent rounded-full pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black bg-amber-500 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> Pilih Jenjang Kelas & Kurikulum
              </span>
              <span className="text-xs font-bold text-slate-500">
                Standar Kurikulum Merdeka
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <span>Kurikulum Aktif:</span>
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {activeGradeMeta.label}
              </span>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl">
                {activeGradeMeta.phaseLabel}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {activeGradeMeta.description}
            </p>
          </div>

          {/* Quick Level Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setActiveTab('curriculum');
                setSelectedCurriculumGrade(currentGradeNum);
              }}
              className="text-xs font-black bg-amber-100 hover:bg-amber-200 text-amber-950 px-3.5 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 border border-amber-300"
            >
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span>Lihat {activeGradeMeta.totalChapters} Bab Terstruktur</span>
            </button>
            <button
              onClick={onOpenDiagnostic}
              className="text-xs font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 border border-indigo-200"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Tes Penempatan Level 📝</span>
            </button>
          </div>
        </div>

        {/* 7 GRADE SELECTION BUTTONS (PAUD, KLS 1, 2, 3, 4, 5, 6) */}
        <div className="mt-4">
          <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
            <span>KLIK UNTUK MENGGANTI KELAS MATEMATIKA:</span>
            <span className="text-orange-600 font-extrabold">Semua materi kelas 1 s/d 6 tersedia lengkap!</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { level: 0, label: 'PAUD / TK', icon: '🍎', sub: 'Fondasi 4-6 Thn' },
              { level: 1, label: 'Kelas 1 SD', icon: '🌱', sub: 'Fase A • 6 Bab' },
              { level: 2, label: 'Kelas 2 SD', icon: '🌿', sub: 'Fase A • 6 Bab' },
              { level: 3, label: 'Kelas 3 SD', icon: '⭐', sub: 'Fase B • 6 Bab' },
              { level: 4, label: 'Kelas 4 SD', icon: '🚀', sub: 'Fase B • 6 Bab' },
              { level: 5, label: 'Kelas 5 SD', icon: '💎', sub: 'Fase C • 6 Bab' },
              { level: 6, label: 'Kelas 6 SD', icon: '👑', sub: 'Fase C • 6 Bab' },
            ].map((g) => {
              const isCurrent = currentGradeNum === g.level;
              return (
                <button
                  key={g.level}
                  onClick={() => handleGradeSelect(g.level)}
                  className={`p-2.5 sm:p-3 rounded-2xl font-black text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between border-2 ${
                    isCurrent
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white border-orange-600 shadow-md scale-[1.03] ring-2 ring-orange-300'
                      : 'bg-slate-50 hover:bg-amber-50/60 text-slate-700 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{g.icon}</span>
                    {isCurrent && (
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-white font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Aktif
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black leading-tight">{g.label}</div>
                    <div className={`text-[10px] font-medium leading-tight mt-0.5 ${isCurrent ? 'text-amber-100' : 'text-slate-400'}`}>
                      {g.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO STATUS & PROGRESS BANNER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-8xl opacity-15 pointer-events-none">🏝️</div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl sm:text-5xl border-2 border-white/40 shadow-inner">
              {activeProfile.avatar || '🦊'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">{activeProfile.name}</h2>
                <span className="text-xs font-bold bg-white/25 px-2.5 py-0.5 rounded-full border border-white/30">
                  Level {activeProfile.level}
                </span>
                <span className="text-xs font-extrabold bg-amber-950/40 text-amber-200 px-2.5 py-0.5 rounded-full">
                  {activeGradeMeta.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 mt-1 font-semibold">
                Petualangan Matematika Nusantara • Siap taklukkan soal tantangan!
              </p>

              {/* Stats pill bar */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur px-3 py-1 rounded-xl text-xs font-bold">
                  <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>{activeProfile.streak} Hari Berturut-turut</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur px-3 py-1 rounded-xl text-xs font-bold">
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>{activeProfile.xp} XP</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur px-3 py-1 rounded-xl text-xs font-bold">
                  <span className="text-sm">🪙</span>
                  <span>{activeProfile.coins} Koin</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 self-start sm:self-auto">
            <button
              onClick={() => onLaunchMinigame('math_vs_monster')}
              className="px-4 py-2.5 bg-white hover:bg-amber-50 text-orange-600 font-black rounded-2xl shadow-md transition-transform hover:scale-105 cursor-pointer flex items-center gap-2 text-xs sm:text-sm"
            >
              <Play className="w-4 h-4 fill-orange-600" /> Main Math vs Monster 🔥
            </button>
            <button
              onClick={() => onLaunchMinigame('space_explorer')}
              className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-900 text-cyan-300 font-black rounded-2xl shadow-md transition-transform hover:scale-105 cursor-pointer flex items-center gap-2 text-xs sm:text-sm border border-cyan-400/40"
            >
              <span className="text-base">🚀</span> Penjelajah Antariksa
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2.5 FITUR UNGGULAN & ALAT BANTU MATEMATIKA INTERAKTIF                    */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <div>
              <h3 className="font-black text-slate-800 text-sm sm:text-base">
                Pusat Fitur Unggulan Matematika
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Alat peraga visual, simulasi ujian ANBK, duel kecepatan, dan kamus rumus lengkap.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Lab Alat Peraga */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenMathLab?.();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-2 border-purple-200 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform shadow-xs">
              🔬
            </div>
            <div className="font-black text-xs sm:text-sm text-purple-950">
              Lab Alat Peraga
            </div>
            <div className="text-[10px] text-purple-700 font-medium mt-0.5 leading-tight">
              6 Alat Visual Interaktif
            </div>
          </button>

          {/* 2. Simulasi Ujian & ANBK */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenExamSimulation?.();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 hover:from-blue-100 hover:to-sky-100 border-2 border-blue-200 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform shadow-xs">
              📝
            </div>
            <div className="font-black text-xs sm:text-sm text-blue-950">
              Tryout & ANBK SD
            </div>
            <div className="text-[10px] text-blue-700 font-medium mt-0.5 leading-tight">
              AKM + Cetak Sertifikat 📜
            </div>
          </button>

          {/* 3. Arena Duel 1 vs 1 */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenMathDuel?.();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 hover:from-rose-100 hover:to-orange-100 border-2 border-rose-200 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform shadow-xs">
              ⚔️
            </div>
            <div className="font-black text-xs sm:text-sm text-rose-950">
              Arena Duel 1v1
            </div>
            <div className="text-[10px] text-rose-700 font-medium mt-0.5 leading-tight">
              Split-Screen & vs Bot 🤖
            </div>
          </button>

          {/* 4. Kamus Rumus & Trik Kilat */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenFormulaHandbook?.();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-2 border-amber-200 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform shadow-xs">
              📚
            </div>
            <div className="font-black text-xs sm:text-sm text-amber-950">
              Kamus Rumus SD
            </div>
            <div className="text-[10px] text-amber-800 font-medium mt-0.5 leading-tight">
              Rumus + Trik Mental Math ⚡
            </div>
          </button>

          {/* 5. Generator Lembar Kerja PDF */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenWorksheets?.();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform shadow-xs">
              🖨️
            </div>
            <div className="font-black text-xs sm:text-sm text-emerald-950">
              Lembar Kerja PDF
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5 leading-tight">
              Soal Cetak Siap Print 📄
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. NAVIGATION TABS (Peta, Arena Game, Kurikulum Terstruktur, Prestasi)   */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <div className="flex gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('map');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Map className="w-4 h-4" /> Peta Petualangan
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('games');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'games'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Gamepad2 className="w-4 h-4" /> Arena Game ({minigames.length})
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('curriculum');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer relative ${
              activeTab === 'curriculum'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Materi Terstruktur SD 1-6
            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
              Lengkap
            </span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('tools');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'tools'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Layers className="w-4 h-4" /> Lab & Alat Bantu
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('achievements');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Trophy className="w-4 h-4" /> Piala & Prestasi
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('cloud-leaderboard');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'cloud-leaderboard'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Globe2 className="w-4 h-4 text-emerald-600" /> Peringkat & Cloud
          </button>
        </div>

        <button
          onClick={onOpenShop}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-2xl text-xs shadow-xs cursor-pointer flex-shrink-0"
        >
          <span className="text-base">🛒</span> Toko Kostum
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT: Map */}
      {/* ========================================================================= */}
      {activeTab === 'map' && (
        <AdventureMap
          activeProfile={activeProfile}
          onSelectNode={onSelectNode}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: Structured Curriculum (Kelas 1 s/d 6 SD Terstruktur Lengkap) */}
      {/* ========================================================================= */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          {/* Grade Selector Switcher within Curriculum Tab */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  <span>Struktur Kurikulum Matematika Terpadu</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Menampilkan silabus resmi & capaian pembelajaran Kurikulum Merdeka per jenjang kelas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Pilih Jenjang:</span>
                <div className="flex gap-1 overflow-x-auto pb-1">
                  {[0, 1, 2, 3, 4, 5, 6].map((lvl) => {
                    const isSelected = selectedCurriculumGrade === lvl;
                    const meta = ALL_GRADE_METADATA[lvl];
                    return (
                      <button
                        key={lvl}
                        onClick={() => {
                          sound.playClick();
                          setSelectedCurriculumGrade(lvl);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {meta.icon} {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Banner of Currently Viewed Grade */}
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${viewingGradeMeta.color} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{viewingGradeMeta.icon}</span>
                  <div>
                    <h4 className="font-black text-lg sm:text-xl leading-tight">
                      {viewingGradeMeta.label} — {viewingGradeMeta.phaseLabel}
                    </h4>
                    <p className="text-xs text-white/90 mt-0.5">{viewingGradeMeta.description}</p>
                  </div>
                </div>
              </div>

              {currentGradeNum !== selectedCurriculumGrade ? (
                <button
                  onClick={() => handleGradeSelect(selectedCurriculumGrade)}
                  className="px-3.5 py-2 bg-white text-slate-800 hover:bg-amber-50 rounded-xl text-xs font-black shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
                >
                  Jadikan Profil Aktif 🎯
                </button>
              ) : (
                <span className="text-xs bg-black/20 text-white font-bold px-3 py-1.5 rounded-xl self-start sm:self-auto border border-white/20">
                  ✓ Profil Kamu Sekarang
                </span>
              )}
            </div>
          </div>

          {/* Structured Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gradeTopics.map((topic, index) => {
              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-orange-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
                          {topic.icon}
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
                            {topic.strand || 'Matematika'}
                          </span>
                          <h4 className="font-black text-slate-800 text-base mt-0.5 leading-snug">
                            {topic.title}
                          </h4>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                        Bab {topic.chapterNumber || index + 1}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                      {topic.description}
                    </p>

                    {/* Learning Objective */}
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 space-y-1">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Capaian Pembelajaran:</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-4">{topic.competency}</p>
                    </div>

                    {/* Key Concepts Tags */}
                    {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                      <div className="mt-3">
                        <div className="text-[10px] font-bold text-slate-400 mb-1">KONSEP KUNCI:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {topic.keyConcepts.map((concept, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md"
                            >
                              • {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: Quick Practice & Related Games */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => onStartQuickQuestion(topic.id)}
                      className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-2xl shadow-xs cursor-pointer flex items-center justify-center gap-2 text-xs transition-transform hover:scale-[1.01]"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Latihan Soal Interaktif Bab Ini</span>
                    </button>

                    {topic.recommendedGames && topic.recommendedGames.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">Mainkan Game:</span>
                        <div className="flex gap-1 overflow-x-auto scrollbar-none">
                          {topic.recommendedGames.map((gId) => (
                            <button
                              key={gId}
                              onClick={() => onLaunchMinigame(gId)}
                              className="text-[10px] font-bold bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                            >
                              🎮 {gId === 'math_vs_monster' ? 'Math vs Monster' : gId === 'space_explorer' ? 'Antariksa' : gId}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: Arena Game */}
      {/* ========================================================================= */}
      {activeTab === 'games' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-slate-200">
            <div>
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-orange-500" />
                <span>Arena Mini Game Edukasi Matematika ({filteredGames.length} Game)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pilih game favoritmu, kumpulkan koin & XP untuk naik level!
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'all', label: 'Semua Game' },
                { id: 'action', label: 'Aksi Baru 🔥' },
                { id: 'monster', label: 'Monster Battle ⚔️' },
                { id: 'adventure', label: 'Petualangan 🗺️' },
                { id: 'classic', label: 'Asah Otak 🧠' },
                { id: 'kls1', label: 'Kls 1' },
                { id: 'kls2', label: 'Kls 2' },
                { id: 'kls3', label: 'Kls 3' },
                { id: 'kls4', label: 'Kls 4' },
                { id: 'kls5', label: 'Kls 5' },
                { id: 'kls6', label: 'Kls 6' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setGameFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    gameFilter === f.id
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map((g) => (
              <div
                key={g.id}
                onClick={() => {
                  sound.playClick();
                  onLaunchMinigame(g.id);
                }}
                className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-orange-400 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              >
                {g.isNew && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider animate-pulse">
                    Baru! 🔥
                  </div>
                )}

                <div>
                  <div className="flex items-start gap-3.5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${g.color} flex items-center justify-center text-3xl shadow-md flex-shrink-0 group-hover:scale-110 transition-transform text-white`}>
                      {g.icon}
                    </div>
                    <div className="pr-8">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {g.gradeBadge}
                        </span>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md">
                          {g.tag}
                        </span>
                      </div>
                      <h4 className="font-black text-sm sm:text-base text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">
                        {g.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-3 leading-relaxed">{g.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    + Hadiah XP & Koin
                  </span>
                  <button className="text-xs font-bold text-orange-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Mainkan <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: Tools & Laboratory Hub                                     */}
      {/* ========================================================================= */}
      {activeTab === 'tools' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center text-2xl">
                🧪
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  Laboratorium & Alat Bantu Matematika Lengkap
                </h3>
                <p className="text-xs text-slate-500">
                  Alat interaktif untuk memahami konsep abstrak menjadi nyata, visual, dan mudah dipahami.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {/* Tool 1: Garis Bilangan */}
              <div
                onClick={() => onOpenMathLab?.()}
                className="p-5 rounded-3xl bg-slate-50 hover:bg-purple-50/50 border-2 border-slate-200 hover:border-purple-300 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📏</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm group-hover:text-purple-700">
                      Garis Bilangan Lompat Katak
                    </h4>
                    <span className="text-[10px] text-purple-600 font-bold bg-purple-100 px-2 py-0.5 rounded-md">
                      SD 1-3 • Operasi Hitung
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Visualisasikan penjumlahan dan pengurangan dengan lompatan katak interaktif pada garis bilangan.
                </p>
              </div>

              {/* Tool 2: Blok Dienes */}
              <div
                onClick={() => onOpenMathLab?.()}
                className="p-5 rounded-3xl bg-slate-50 hover:bg-purple-50/50 border-2 border-slate-200 hover:border-purple-300 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🧱</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm group-hover:text-purple-700">
                      Blok Dienes Nilai Tempat
                    </h4>
                    <span className="text-[10px] text-purple-600 font-bold bg-purple-100 px-2 py-0.5 rounded-md">
                      SD 1-4 • Ratusan, Puluhan, Satuan
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Pecah dan gabungkan blok kubus ratusan, batang puluhan, dan keping satuan secara interaktif.
                </p>
              </div>

              {/* Tool 3: Visualizer Pecahan */}
              <div
                onClick={() => onOpenMathLab?.()}
                className="p-5 rounded-3xl bg-slate-50 hover:bg-purple-50/50 border-2 border-slate-200 hover:border-purple-300 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🍕</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm group-hover:text-purple-700">
                      Visualizer Pecahan & Pizza
                    </h4>
                    <span className="text-[10px] text-purple-600 font-bold bg-purple-100 px-2 py-0.5 rounded-md">
                      SD 3-6 • Pecahan Senilai
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Bandingkan potongan pecahan pizza atau balok pecahan untuk membuktikan pecahan senilai.
                </p>
              </div>

              {/* Tool 4: Porogapit Solver */}
              <div
                onClick={() => onOpenMathLab?.()}
                className="p-5 rounded-3xl bg-slate-50 hover:bg-purple-50/50 border-2 border-slate-200 hover:border-purple-300 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">➗</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm group-hover:text-purple-700">
                      Porogapit Solver Step-by-Step
                    </h4>
                    <span className="text-[10px] text-purple-600 font-bold bg-purple-100 px-2 py-0.5 rounded-md">
                      SD 3-6 • Pembagian Bersusun
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Pelajari alur pembagian bersusun langkah demi langkah lengkap dengan animasi panah dan sisa.
                </p>
              </div>

              {/* Tool 5: Timbangan Aljabar */}
              <div
                onClick={() => onOpenMathLab?.()}
                className="p-5 rounded-3xl bg-slate-50 hover:bg-purple-50/50 border-2 border-slate-200 hover:border-purple-300 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">⚖️</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm group-hover:text-purple-700">
                      Timbangan Aljabar (Cari Nilai X)
                    </h4>
                    <span className="text-[10px] text-purple-600 font-bold bg-purple-100 px-2 py-0.5 rounded-md">
                      SD 4-6 • Fondasi Aljabar
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Seimbangkan kedua lengan timbangan untuk menemukan nilai kotak rahasia X secara intuitif.
                </p>
              </div>

              {/* Tool 6: Busur Derajat Interaktif */}
              <div
                onClick={() => onOpenMathLab?.()}
                className="p-5 rounded-3xl bg-slate-50 hover:bg-purple-50/50 border-2 border-slate-200 hover:border-purple-300 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📐</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm group-hover:text-purple-700">
                      Busur Derajat Interaktif
                    </h4>
                    <span className="text-[10px] text-purple-600 font-bold bg-purple-100 px-2 py-0.5 rounded-md">
                      SD 4-6 • Pengukuran Sudut
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Putar lengan sudut, ukur derajatnya secara langsung, dan kenali sudut lancip, siku-siku, atau tumpul.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => onOpenMathLab?.()}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-md transition-transform hover:scale-105 cursor-pointer flex items-center gap-2 text-sm"
              >
                <span>Buka Laboratorium Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: Achievements */}
      {/* ========================================================================= */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Koleksi Lencana & Prestasi ({activeProfile.achievements.length}/{ALL_ACHIEVEMENTS.length})</span>
            </h3>
            <button
              onClick={onOpenShop}
              className="text-xs bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
            >
              Kunjungi Toko Hadiah 🪙
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_ACHIEVEMENTS.map((ach) => {
              const isUnlocked = activeProfile.achievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-3xl border-2 flex items-start gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-white border-amber-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${isUnlocked ? 'bg-amber-100' : 'bg-slate-200 grayscale'}`}>
                    {ach.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-800">{ach.title}</h4>
                      {isUnlocked && <span className="text-xs text-emerald-600 font-bold">✓</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{ach.description}</p>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-2">
                      + {ach.xpReward} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB CONTENT: Cloud Leaderboard & Firebase Sync                            */}
      {/* ========================================================================= */}
      {activeTab === 'cloud-leaderboard' && (
        <div className="space-y-4">
          <FirebaseSyncPanel
            profiles={[activeProfile]}
            activeProfile={activeProfile}
            parentSettings={{
              parentPin: '1234',
              dailyTimeLimitMinutes: 15,
              dailyScreenTimeMinutes: 15,
              soundEffects: true,
              bgMusic: true,
              voiceOverEnabled: true,
              speechRate: 1,
              speechSpeed: 1,
              notifyDailyGoal: true,
              theme: 'light',
            }}
            onSyncProfiles={() => {}}
            onSyncSettings={() => {}}
          />
        </div>
      )}
    </div>
  );
};
