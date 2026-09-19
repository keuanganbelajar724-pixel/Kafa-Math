import React from 'react';
import { ChildProfile, WorkbookOperation } from '../../types';
import { sound } from '../../services/sound';
import { StatCard } from '../ui/StatCard';
import {
  Play,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Gamepad2,
  ChevronRight,
  FileText,
  Compass,
  GraduationCap,
  Lightbulb,
  Layers,
} from 'lucide-react';

interface HomeViewProps {
  activeProfile: ChildProfile;
  onContinueLearning: () => void;
  onOpenDailyChallenge: () => void;
  onNavigateTab: (tab: 'home' | 'theory' | 'game' | 'workbook' | 'map') => void;
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
  onNavigateTab,
  onLaunchMinigame,
  onChangeGrade,
  onOpenWorksheets,
}) => {
  // Accuracy score
  const accuracyScore = 87;

  // Grade Curriculum Breakdown
  const GRADE_CURRICULA = [
    {
      grade: 1,
      name: 'SD Kelas 1',
      stage: 'Cambridge Stage 1',
      icon: '🎒',
      focus: 'Fondasi Angka 1-20, Penjumlahan, Pengurangan & Pola Bentuk',
      color: 'from-sky-50 to-blue-50 border-sky-200 text-sky-900',
      activeColor: 'bg-sky-600 text-white border-sky-700 shadow-sm',
    },
    {
      grade: 2,
      name: 'SD Kelas 2',
      stage: 'Cambridge Stage 2',
      icon: '📐',
      focus: 'Nilai Tempat Ratusan, Penjumlahan Bersusun & Ukuran Panjang',
      color: 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900',
      activeColor: 'bg-emerald-600 text-white border-emerald-700 shadow-sm',
    },
    {
      grade: 3,
      name: 'SD Kelas 3',
      stage: 'Cambridge Stage 3',
      icon: '✖️',
      focus: 'Tabel Perkalian, Pembagian, Pecahan Sederhana & Jam Analog',
      color: 'from-amber-50 to-yellow-50 border-amber-200 text-amber-900',
      activeColor: 'bg-amber-600 text-white border-amber-700 shadow-sm',
    },
    {
      grade: 4,
      name: 'SD Kelas 4',
      stage: 'Cambridge Stage 4',
      icon: '🍕',
      focus: 'Pecahan Senilai, FPB & KPK, Luas & Keliling Bangun Datar',
      color: 'from-purple-50 to-indigo-50 border-purple-200 text-purple-900',
      activeColor: 'bg-purple-600 text-white border-purple-700 shadow-sm',
    },
    {
      grade: 5,
      name: 'SD Kelas 5',
      stage: 'Cambridge Stage 5',
      icon: '📦',
      focus: 'Pecahan Campuran, Desimal, Persentase, Skala & Volume Balok',
      color: 'from-rose-50 to-pink-50 border-rose-200 text-rose-900',
      activeColor: 'bg-rose-600 text-white border-rose-700 shadow-sm',
    },
    {
      grade: 6,
      name: 'SD Kelas 6',
      stage: 'Cambridge Stage 6',
      icon: '📊',
      focus: 'Bilangan Bulat Negatif, Lingkaran, Aljabar Awal & Mean/Median',
      color: 'from-teal-50 to-cyan-50 border-teal-200 text-teal-900',
      activeColor: 'bg-teal-600 text-white border-teal-700 shadow-sm',
    },
  ];

  // 10 Math Skills Catalog
  const MATH_SKILLS: {
    id: WorkbookOperation;
    title: string;
    icon: string;
    desc: string;
  }[] = [
    { id: 'penjumlahan', title: 'Penjumlahan', icon: '➕', desc: 'Simpan & Mental Math' },
    { id: 'pengurangan', title: 'Pengurangan', icon: '➖', desc: 'Teknik Meminjam' },
    { id: 'perkalian', title: 'Perkalian', icon: '✖️', desc: 'Tabel & Bersusun' },
    { id: 'pembagian', title: 'Pembagian', icon: '➗', desc: 'Porogapit & Bagi Rata' },
    { id: 'pecahan', title: 'Pecahan', icon: '🍕', desc: 'Senilai & Desimal' },
    { id: 'geometri', title: 'Geometri', icon: '📐', desc: 'Luas, Keliling & Sudut' },
    { id: 'waktu', title: 'Waktu & Durasi', icon: '⏰', desc: 'Jam Analog & Kalender' },
    { id: 'uang', title: 'Uang Rupiah', icon: '💰', desc: 'Kasir & Kembalian' },
    { id: 'logika', title: 'Logika & Aljabar', icon: '🧩', desc: 'Neraca Timbangan' },
    { id: 'data', title: 'Statistika & Data', icon: '📊', desc: 'Diagram, Mean & Median' },
  ];

  // Curated featured games
  const featuredGames = [
    {
      id: 'abacus_soroban',
      title: 'Sempoa Soroban Jepang',
      desc: 'Geser manik atas bernilai 5 dan manik bawah bernilai 1!',
      icon: '🧮',
      tag: 'Cambridge 🇬🇧',
    },
    {
      id: 'cake_fraction_slicer',
      title: 'Bagi & Potong Kue',
      desc: 'Sentuh pisau & potong kue sesuai pecahan yang diminta!',
      icon: '🍰',
      tag: 'Pecahan 🍕',
    },
    {
      id: 'pan_balance_scale',
      title: 'Neraca Aljabar',
      desc: 'Seimbangkan piring neraca dengan anak timbangan!',
      icon: '⚖️',
      tag: 'Timbangan ⚖️',
    },
    {
      id: 'geoboard_perimeter_area',
      title: 'Geoboard Virtual',
      desc: 'Regangkan karet untuk ukur luas dan keliling bangun datar!',
      icon: '📐',
      tag: 'Geometri 📐',
    },
  ];

  const currentGradeNum = parseInt(activeProfile.grade.replace(/[^0-9]/g, '')) || 2;

  return (
    <div className="space-y-6 pb-24 sm:pb-8 animate-in fade-in duration-200">
      {/* 1. UNIVERSAL WELCOME HEADER (Tanpa Streak, Terbuka untuk Semua) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Akses Terbuka & Gratis
            </span>
            <span className="text-slate-400 text-xs font-bold">•</span>
            <span className="text-slate-500 text-xs font-bold">
              Kurikulum Merdeka & Cambridge Primary
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Modul Belajar Matematika Bebas 📐
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-0.5">
            Jelajahi materi konsep, trik berhitung cepat, dan 50+ game edukasi interaktif.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-2xs">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Jenjang: {activeProfile.grade}</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('map');
            }}
            className="px-3.5 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Peta Petualangan</span>
          </button>
        </div>
      </div>

      {/* 2. OPEN PLATFORM HERO PORTAL (Bebas Belajar, Bukan Streak) */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-emerald-400/30">
        {/* Soft decorative background circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-xl" />
        <div className="absolute right-32 -bottom-16 w-60 h-60 rounded-full bg-white/5 pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide border border-white/25 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                MODUL BELAJAR TERBUKA
              </span>
              <span className="text-emerald-100 text-xs font-bold">
                Semua Materi & Game Siap Dimainkan Kapan Saja
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight text-white">
              Pahami Konsepnya, Mainkan Gamenya!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-xl">
              Tidak ada batasan akun atau kuota harian. Pilih jenjang kelas di bawah ini, pelajari trik berhitung cepat dan metode Cambridge TWM, lalu uji kemampuanmu dengan game interaktif!
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateTab('theory');
                }}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Materi & Konsep (Knowledge Hub)</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateTab('game');
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500/80 hover:bg-emerald-400 text-white font-black text-xs sm:text-sm border border-white/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>50+ Game Edukasi</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateTab('workbook');
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm border border-emerald-600 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Latihan Soal</span>
              </button>

              {onOpenWorksheets && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenWorksheets();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-black text-xs sm:text-sm border border-white/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-emerald-300" />
                  <span>Lembar Kerja PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Side Visual Badge */}
          <div className="hidden lg:flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 w-44">
            <span className="text-4xl mb-1">🎓</span>
            <span className="text-xs font-extrabold text-emerald-200">Jenjang Saat Ini</span>
            <span className="text-lg font-black text-white">{activeProfile.grade}</span>
            <span className="text-[10px] text-white/70 mt-1">Ganti kapan saja di bawah</span>
          </div>
        </div>
      </div>

      {/* 3. JENJANG BELAJAR YANG BAGUS (PILIH KELAS 1 - 6 SD SECARA BEBAS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Pilih Jenjang Belajar Matematika
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Klik kelas untuk langsung menyesuaikan materi & soal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GRADE_CURRICULA.map((item) => {
            const isCurrent = currentGradeNum === item.grade;
            return (
              <div
                key={item.grade}
                onClick={() => {
                  sound.playClick();
                  onChangeGrade(item.grade);
                }}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isCurrent
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                          {item.name}
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full">
                              Aktif
                            </span>
                          )}
                        </h3>
                        <span className="text-[11px] font-bold text-slate-500">
                          {item.stage}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                    {item.focus}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-black">
                  <span className={isCurrent ? 'text-emerald-700' : 'text-slate-500'}>
                    {isCurrent ? '✓ Jenjang Terpilih' : 'Pilih Jenjang Ini'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      onChangeGrade(item.grade);
                      onNavigateTab('workbook');
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-800 text-[11px] font-extrabold transition-colors flex items-center gap-1"
                  >
                    <span>Latihan Soal</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. OPEN STATS SUMMARY (Materi, Games, Soal, Akurasi) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<Lightbulb className="w-5 h-5 text-indigo-600" />}
          label="Materi & Konsep"
          value="20+ Panduan"
          highlightColor="blue"
          subtext="Cambridge & Mental Math"
        />

        <StatCard
          icon={<Gamepad2 className="w-5 h-5 text-purple-600" />}
          label="Bank Game Edukasi"
          value="50+ Game"
          highlightColor="purple"
          subtext="Semua Siap Dimainkan"
        />

        <StatCard
          icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
          label="Topik Latihan"
          value="10 Kategori"
          highlightColor="green"
          subtext="Kelas 1 sampai 6 SD"
        />

        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-sky-600" />}
          label="Akurasi Pemahaman"
          value={`${accuracyScore}%`}
          highlightColor="blue"
          subtext="Sangat Baik & Konsisten"
        />
      </div>

      {/* 5. KNOWLEDGE HUB SPOTLIGHT: PUSAT PENGETAHUAN & TEORI */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 border border-indigo-700/50">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-indigo-950 font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              KNOWLEDGE HUB 💡
            </span>
            <span className="text-indigo-200 text-xs font-bold">
              Metode Cambridge TWM & Mental Math
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Pusat Pengetahuan & Konsep Matematika
          </h3>
          <p className="text-xs sm:text-sm text-indigo-200 font-medium">
            Pelajari metode Cambridge Bar Model, trik kilat perkalian 11 & kuadrat angka, garis bilangan bulat negatif, rumus luas bangun datar, dan tangga konversi satuan metrik!
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onNavigateTab('theory');
          }}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-900 font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Eksplorasi Materi & Konsep</span>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </button>
      </div>

      {/* 6. MATH SKILLS CATALOG (10 TOPIK KURIKULUM) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider">
            10 TOPIK MATEMATIKA KURIKULUM SD
          </h3>
          <button
            onClick={() => onNavigateTab('workbook')}
            className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Semua Latihan</span>
            <ChevronRight className="w-4 h-4" />
          </button>
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
                  Latihan
                </span>
              </div>
              <div>
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-600 transition-colors block">
                  {skill.title}
                </span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  {skill.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 7. FEATURED INTERACTIVE GAMES */}
      <div className="bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-purple-600" />
            <h3 className="font-black text-slate-900 text-sm sm:text-base">
              Game Matematika Pilihan (Dari 50+ Game)
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('game')}
            className="text-xs font-black text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Game</span>
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
                <span>Mainkan Sekarang</span>
                <Play className="w-3.5 h-3.5 fill-purple-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

