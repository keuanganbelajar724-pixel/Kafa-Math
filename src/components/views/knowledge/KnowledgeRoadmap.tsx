import React, { useState } from 'react';
import { sound } from '../../../services/sound';
import {
  KNOWLEDGE_ARTICLES,
  KnowledgeArticle,
} from '../../../data/knowledgeArticlesData';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Trophy,
  Target,
  Compass,
  Play,
  RotateCcw,
  Zap,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';

interface KnowledgeRoadmapProps {
  activeGrade?: number;
  onOpenLab: (labId: string) => void;
  onLaunchGame?: (gameId: string) => void;
  onOpenTopicPractice?: (topicId: string) => void;
  onSelectArticle?: (article: KnowledgeArticle) => void;
  masteredArticleIds?: string[];
  onRewardXP?: (xp: number, reason: string) => void;
}

interface RoadmapPhase {
  id: string;
  gradeNum?: number;
  stageGroup: 'fase_a' | 'fase_b' | 'fase_c' | 'cambridge';
  stageName: string;
  gradeBadge: string;
  age: string;
  title: string;
  desc: string;
  icon: string;
  accentColor: string;
  lightBg: string;
  borderAccent: string;
  milestones: string[];
  keyLabId: string;
  keyLabName: string;
  gameId: string;
  gameName: string;
  topicId: string;
  articleIds: string[];
}

const PHASES: RoadmapPhase[] = [
  {
    id: 'phase_1',
    gradeNum: 1,
    stageGroup: 'fase_a',
    stageName: 'Fase A1',
    gradeBadge: 'SD Kelas 1',
    age: 'Usia 6 - 7 Tahun',
    title: 'Pondasi Angka & Benda Konkret',
    desc: 'Membangun kepekaan bilangan (Number Sense), membilang satu-ke-satu dengan benda nyata, pasangan angka 10, serta pengenalan bangun datar dan waktu harian.',
    icon: '🍎',
    accentColor: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50/70',
    borderAccent: 'border-amber-200 hover:border-amber-400',
    milestones: [
      'Membilang benda konkret 1-20 secara urut maju dan mundur',
      'Memahami Teman Sepuluh (Number Bonds to 10) dengan Ten-Frame',
      'Perbandingan kuantitas (Lebih Banyak >, Lebih Sedikit <, Sama =)',
      'Penjumlahan & Pengurangan dasar dengan garis bilangan',
      'Mengenal bentuk lingkaran, segitiga, persegi, dan persegi panjang',
      'Membaca jam analog bulat (jarum panjang di 12) & rutinitas harian',
    ],
    keyLabId: 'ten_frame',
    keyLabName: 'Lab 03: Ten-Frame Simulator',
    gameId: 'farm_counting_bonds',
    gameName: 'Farm Counting Bonds',
    topicId: 'bilangan',
    articleIds: [
      'grade1_counting_objects',
      'grade1_number_bonds_10',
      'grade1_comparing_quantities',
      'grade1_basic_shapes',
      'grade1_analog_clock_intro',
    ],
  },
  {
    id: 'phase_2',
    gradeNum: 2,
    stageGroup: 'fase_a',
    stageName: 'Fase A2',
    gradeBadge: 'SD Kelas 2',
    age: 'Usia 7 - 8 Tahun',
    title: 'Nilai Tempat & Eksplorasi Kuantitas',
    desc: 'Memahami bahwa angka ditentukan oleh posisinya (Ratusan, Puluhan, Satuan), pola bilangan melompat, pengenalan koin rupiah, dan pengukuran jengkal/hasta.',
    icon: '🧺',
    accentColor: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50/70',
    borderAccent: 'border-emerald-200 hover:border-emerald-400',
    milestones: [
      'Memecah bilangan 3-digit ke Ratusan, Puluhan, dan Satuan',
      'Pola bilangan loncat 2, loncat 5, dan loncat 10',
      'Pengukuran panjang tak baku (jengkal, depa, hasta, langkah)',
      'Mengenal uang koin dan kertas rupiah serta belanja pas',
      'Membaca piktogram sederhana (1 gambar = 1 benda)',
      'Keseimbangan timbangan dua lengan (berat vs ringan)',
    ],
    keyLabId: 'coin_cashier',
    keyLabName: 'Lab 08: Dompet Koin Kasir',
    gameId: 'fruit_store_place_value',
    gameName: 'Fruit Store Place Value',
    topicId: 'nilai_tempat',
    articleIds: [
      'nilai_tempat_ratusan',
      'pola_bilangan_loncat',
      'pengukuran_panjang_tak_baku',
      'uang_rupiah_koin_belanja',
      'diagram_gambar_piktogram',
    ],
  },
  {
    id: 'phase_3',
    gradeNum: 3,
    stageGroup: 'fase_b',
    stageName: 'Fase B1',
    gradeBadge: 'SD Kelas 3',
    age: 'Usia 8 - 9 Tahun',
    title: 'Konsep Perkalian & Visual Pecahan',
    desc: 'Beralih dari penjumlahan berulang ke pemahaman matriks baris-kolom perkalian, pembagian adil merata, pecahan bagian dari utuh, dan durasi menit.',
    icon: '🍕',
    accentColor: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50/70',
    borderAccent: 'border-blue-200 hover:border-blue-400',
    milestones: [
      'Perkalian sebagai matriks baris × kolom (Array Matrix)',
      'Trik jari sakti perkalian 9 dan tabel perkalian 1 s/d 10',
      'Mengenal pecahan 1/2, 1/3, 1/4 sebagai bagian adil dari benda utuh',
      'Membaca jam analog dengan skala interval 5 menit & menghitung durasi',
      'Sifat komutatif (a × b = b × a) dan asosiatif berhitung cepat',
      'Aturan KABATAKU / PEMDAS sederhana (kali/bagi lebih kuat dari tambah/kurang)',
    ],
    keyLabId: 'multiplication_array',
    keyLabName: 'Lab 11: Array Matriks Perkalian',
    gameId: 'pizza_fraction_party',
    gameName: 'Pizza Fraction Party',
    topicId: 'perkalian',
    articleIds: [
      'perkalian_matriks_array',
      'trik_jari_perkalian_9',
      'pecahan_pizza_bagian',
      'jam_analog_durasi_menit',
      'sifat_komutatif_perkalian',
    ],
  },
  {
    id: 'phase_4',
    gradeNum: 4,
    stageGroup: 'fase_b',
    stageName: 'Fase B2',
    gradeBadge: 'SD Kelas 4',
    age: 'Usia 9 - 10 Tahun',
    title: 'Porogapit, Keliling-Luas & Sudut',
    desc: 'Menguasai pembagian bersusun 4 langkah (Porogapit), luas dan keliling bangun datar, klasifikasi sudut busur derajat, serta pecahan senilai.',
    icon: '📐',
    accentColor: 'from-violet-500 to-purple-600',
    lightBg: 'bg-violet-50/70',
    borderAccent: 'border-violet-200 hover:border-violet-400',
    milestones: [
      'Langkah berulang Porogapit: Bagi ➔ Kali ➔ Kurang ➔ Turunkan',
      'Rumus keliling & luas persegi, persegi panjang, dan segitiga',
      'Pengukuran sudut dengan busur derajat (Lancip <90°, Siku 90°, Tumpul >90°)',
      'Pecahan senilai, menyederhanakan pecahan, dan pecahan desimal awal',
      'Membaca dan membuat diagram batang horizontal & vertikal',
      'Trik cepat perkalian 11 dan kuadrat angka berakhiran 5',
    ],
    keyLabId: 'angle_protractor',
    keyLabName: 'Lab 13: Busur Sudut Interaktif',
    gameId: 'angle_protractor_lab',
    gameName: 'Angle Protractor Lab',
    topicId: 'geometri',
    articleIds: [
      'porogapit_bersusun',
      'keliling_luas_persegi',
      'busur_derajat_sudut',
      'pecahan_senilai_sederhana',
      'diagram_batang_data',
    ],
  },
  {
    id: 'phase_5',
    gradeNum: 5,
    stageGroup: 'fase_c',
    stageName: 'Fase C1',
    gradeBadge: 'SD Kelas 5',
    age: 'Usia 10 - 11 Tahun',
    title: 'FPB, KPK, Satuan Metrik & Debit',
    desc: 'Membongkar rahasia bilangan prima dengan pohon faktor, konversi 7 tingkat satuan metrik desimal, segitiga rumus kecepatan (JKW) dan debit air.',
    icon: '🚀',
    accentColor: 'from-sky-500 to-cyan-600',
    lightBg: 'bg-sky-50/70',
    borderAccent: 'border-sky-200 hover:border-sky-400',
    milestones: [
      'Faktorisasi prima, menentukan FPB (bagi rata) dan KPK (jadwal bersama)',
      'Tangga 7 tingkat konversi satuan panjang (km ➔ mm) dan massa (kg ➔ mg)',
      'Segitiga ajaib J-K-W (Jarak, Kecepatan, dan Waktu perjalanan)',
      'Segitiga rumus V-D-W (Volume, Debit, dan Waktu aliran cairan)',
      'Operasi penjumlahan & pengurangan pecahan beda penyebut (KPK / Butterfly)',
      'Skala peta dan denah (Rasio jarak peta vs jarak sebenarnya)',
    ],
    keyLabId: 'prime_factors',
    keyLabName: 'Lab 10: Pohon Faktor & KPK/FPB',
    gameId: 'factor_tree_lab',
    gameName: 'Factor Tree Lab',
    topicId: 'fpb_kpk',
    articleIds: [
      'faktor_prima_faktorisasi',
      'fpb_kpk_cerita',
      'tangga_satuan_metrik',
      'segitiga_jkw_kecepatan',
      'segitiga_vdw_debit',
      'metode_kupu_kupu_pecahan',
    ],
  },
  {
    id: 'phase_6',
    gradeNum: 6,
    stageGroup: 'fase_c',
    stageName: 'Fase C2',
    gradeBadge: 'SD Kelas 6',
    age: 'Usia 11 - 12 Tahun',
    title: 'Statistika, Aljabar & Diskon Kasir',
    desc: 'Puncak kemahiran matematika SD: penyelesaian persamaan aljabar neraca, konsep Mean-Median-Modus, bilangan bulat negatif garis bilangan, dan lingkaran (π).',
    icon: '🏷️',
    accentColor: 'from-rose-500 to-pink-600',
    lightBg: 'bg-rose-50/70',
    borderAccent: 'border-rose-200 hover:border-rose-400',
    milestones: [
      'Statistika cilik: Menghitung Mean (rata-rata), Median (nilai tengah), Modus',
      'Aljabar neraca seimbang (Prinsip perlakuan adil di kiri dan kanan)',
      'Konsep bilangan bulat negatif (garis bilangan, suhu es bawah nol, kapal selam)',
      'Misteri konstanta Pi (π ≈ 22/7 atau 3,14), keliling dan luas lingkaran',
      'Trik kilat mental math diskon persentase kasir supermarket (10%, 20%, 25%, 50%)',
      'Trio ekuivalen: konversi luwes Pecahan ↔ Desimal ↔ Persentase',
    ],
    keyLabId: 'mean_median_mode',
    keyLabName: 'Lab 14: Statistika Cilik Visualizer',
    gameId: 'mean_median_mode_detective',
    gameName: 'Mean Median Mode Detective',
    topicId: 'statistika',
    articleIds: [
      'statistika_mean_median_modus',
      'aljabar_neraca',
      'lingkaran_pi',
      'bilangan_bulat_negatif',
      'trik_diskon_kasir',
      'perkalian_desimal_koma',
    ],
  },
  {
    id: 'phase_cambridge',
    stageGroup: 'cambridge',
    stageName: 'Cambridge Primary',
    gradeBadge: 'Stage 1 - 6 Global',
    age: 'TWM Framework',
    title: 'Cambridge Thinking & Working Mathematically',
    desc: 'Metode penalaran matematis standar internasional: Singapore Bar Modeling untuk soal cerita kata rumit, investigasi pola, konjektur, dan pembuktian logis.',
    icon: '🇬🇧',
    accentColor: 'from-indigo-600 to-blue-700',
    lightBg: 'bg-indigo-50/70',
    borderAccent: 'border-indigo-200 hover:border-indigo-400',
    milestones: [
      'Singapore Bar Modeling (Model Part-Whole, Comparison, & Before-After)',
      'Specialising: Menguji kasus-kasus angka konkret terlebih dahulu',
      'Generalising: Menemukan rumus/aturan umum yang berlaku untuk semua angka',
      'Conjecturing & Convincing: Merumuskan hipotesis dan membuktikannya secara logis',
      'Characterising & Classifying: Mengelompokkan bangun dengan Diagram Carroll & Venn',
      'Critiquing: Menilai dan membandingkan strategi penyelesaian yang paling efisien',
    ],
    keyLabId: 'bar_model',
    keyLabName: 'Lab 02: Bar Model Simulator',
    gameId: 'pan_balance_scale',
    gameName: 'Pan Balance Algebra',
    topicId: 'soal_cerita',
    articleIds: [
      'cambridge_twm_bar_model',
      'cambridge_conjecturing_convincing',
      'cambridge_venn_carroll',
      'metode_singapura_before_after',
    ],
  },
];

type FilterTab = 'all' | 'fase_a' | 'fase_b' | 'fase_c' | 'cambridge';

export const KnowledgeRoadmap: React.FC<KnowledgeRoadmapProps> = ({
  activeGrade,
  onOpenLab,
  onLaunchGame,
  onOpenTopicPractice,
  onSelectArticle,
  masteredArticleIds = [],
  onRewardXP,
}) => {
  const [filterGroup, setFilterGroup] = useState<FilterTab>('all');

  // Completed phases tracking in localStorage
  const [completedPhases, setCompletedPhases] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kafa_completed_phases');
      return saved ? JSON.parse(saved) : ['phase_1'];
    } catch {
      return ['phase_1'];
    }
  });

  // Completed milestone items tracking in localStorage
  const [completedMilestones, setCompletedMilestones] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kafa_completed_milestones');
      return saved ? JSON.parse(saved) : ['phase_1_0', 'phase_1_1'];
    } catch {
      return ['phase_1_0', 'phase_1_1'];
    }
  });

  const togglePhaseCompletion = (phase: RoadmapPhase) => {
    sound.playClick();
    const isNowCompleted = !completedPhases.includes(phase.id);

    setCompletedPhases((prev) => {
      const next = isNowCompleted
        ? [...prev, phase.id]
        : prev.filter((id) => id !== phase.id);
      try {
        localStorage.setItem('kafa_completed_phases', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    if (isNowCompleted) {
      sound.playPowerUp();
      sound.playStarGain();
      if (onRewardXP) {
        onRewardXP(50, `Tuntas ${phase.stageName}: ${phase.title}`);
      }
    }
  };

  const toggleMilestone = (phaseId: string, mIdx: number) => {
    sound.playClick();
    const key = `${phaseId}_${mIdx}`;
    setCompletedMilestones((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      try {
        localStorage.setItem('kafa_completed_milestones', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Filtered phases
  const displayedPhases = PHASES.filter((phase) => {
    if (filterGroup === 'all') return true;
    return phase.stageGroup === filterGroup;
  });

  const progressPercent = Math.round((completedPhases.length / PHASES.length) * 100);

  // Article dictionary for fast lookup
  const articleMap = React.useMemo(() => {
    const map = new Map<string, KnowledgeArticle>();
    KNOWLEDGE_ARTICLES.forEach((art) => map.set(art.id, art));
    return map;
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ROADMAP HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-indigo-500/30 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-indigo-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Compass className="w-3.5 h-3.5" />
              Alur Belajar Terstruktur
            </span>
            <span className="bg-white/10 text-indigo-200 text-xs font-bold px-2.5 py-1 rounded-full border border-white/15">
              Kurikulum Merdeka & Cambridge TWM
            </span>
            <span className="bg-emerald-500/30 text-emerald-300 font-extrabold px-2.5 py-1 rounded-full text-xs border border-emerald-400/30">
              7 Fase Pembelajaran Terarah
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
            Peta Perjalanan Matematika: Dari Fondasi Menuju Juara 🏆
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed font-medium">
            Ikuti alur tahapan pembelajaran di bawah ini. Tiap jenjang dirancang secara progresif: pelajari modul konsepnya, uji di simulator lab interaktif, lalu taklukkan tantangan gamenya!
          </p>

          {/* Progress Tracker */}
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 max-w-lg space-y-2 pt-3">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-indigo-200 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-300" />
                Capaian Fase Belajar:
              </span>
              <span className="text-amber-300 font-mono text-sm">
                {completedPhases.length} dari {PHASES.length} Fase Selesai ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Ambient decorative elements */}
        <div className="absolute right-4 bottom-2 text-7xl opacity-15 select-none pointer-events-none hidden sm:block">
          🗺️
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Semua 7 Fase' },
          { id: 'fase_a', label: 'Fase A (Kelas 1 - 2)' },
          { id: 'fase_b', label: 'Fase B (Kelas 3 - 4)' },
          { id: 'fase_c', label: 'Fase C (Kelas 5 - 6)' },
          { id: 'cambridge', label: 'Cambridge TWM' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setFilterGroup(tab.id as FilterTab);
            }}
            className={`px-3.5 py-2 rounded-2xl font-black text-xs whitespace-nowrap cursor-pointer transition-all border ${
              filterGroup === tab.id
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TIMELINE / PHASES LIST */}
      <div className="space-y-5">
        {displayedPhases.map((phase) => {
          const isCompleted = completedPhases.includes(phase.id);
          const phaseMilestonesChecked = phase.milestones.filter((_, idx) =>
            completedMilestones.includes(`${phase.id}_${idx}`)
          ).length;

          // Lookup article objects for this phase
          const phaseArticles = phase.articleIds
            .map((id) => articleMap.get(id))
            .filter((art): art is KnowledgeArticle => Boolean(art));

          return (
            <div
              key={phase.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all shadow-xs hover:shadow-md ${
                isCompleted
                  ? 'border-emerald-300 bg-emerald-50/15'
                  : phase.borderAccent
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Left Header & Details */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-black text-white px-3 py-1 rounded-xl bg-gradient-to-r ${phase.accentColor}`}
                    >
                      {phase.stageName}
                    </span>
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                      {phase.gradeBadge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/50">
                      {phase.age}
                    </span>
                    {activeGrade && phase.gradeNum === activeGrade && (
                      <span className="text-xs font-black text-amber-900 bg-amber-300 border border-amber-400 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-2xs animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                        Rekomendasi Jenjangmu
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Tuntas (+50 XP)
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3.5">
                    <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-slate-50 border border-slate-200 shrink-0">
                      {phase.icon}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                        {phase.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                        {phase.desc}
                      </p>
                    </div>
                  </div>

                  {/* MODUL MATERI & BUKU KONSEP TERKAIT */}
                  {phaseArticles.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                          Modul Pengetahuan & Teori Konsep:
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {phaseArticles.length} Modul
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {phaseArticles.map((art) => {
                          const isArtMastered = masteredArticleIds.includes(art.id);

                          return (
                            <button
                              key={art.id}
                              onClick={() => {
                                sound.playClick();
                                if (onSelectArticle) {
                                  onSelectArticle(art);
                                }
                              }}
                              className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left cursor-pointer transition-all active:scale-98 group"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-lg shrink-0">{art.icon}</span>
                                <div className="truncate">
                                  <div className="text-xs font-black text-slate-800 group-hover:text-indigo-900 truncate">
                                    {art.title}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-bold truncate">
                                    {art.subtitle}
                                  </div>
                                </div>
                              </div>
                              <div className="shrink-0 flex items-center gap-1">
                                {isArtMastered ? (
                                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black">
                                    ✓
                                  </span>
                                ) : (
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Milestones Checklist */}
                  <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                        Target Capaian Kompetensi Siswa:
                      </span>
                      <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        {phaseMilestonesChecked} / {phase.milestones.length} Tercapai
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                      {phase.milestones.map((m, mIdx) => {
                        const isMChecked = completedMilestones.includes(`${phase.id}_${mIdx}`);

                        return (
                          <div
                            key={mIdx}
                            onClick={() => toggleMilestone(phase.id, mIdx)}
                            className={`flex items-start gap-2 p-2 rounded-xl border cursor-pointer select-none transition-all ${
                              isMChecked
                                ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                                : 'bg-white border-slate-200/70 hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isMChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                            )}
                            <span className={`leading-snug text-xs ${isMChecked ? 'font-bold' : ''}`}>
                              {m}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Action Box */}
                <div className="lg:w-64 flex flex-col justify-between shrink-0 space-y-3 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-5 border-slate-200">
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                      Aktivitas Pembelajaran:
                    </span>

                    {/* Button to open linked lab */}
                    <button
                      onClick={() => onOpenLab(phase.keyLabId)}
                      className="w-full flex items-center justify-between gap-2 p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-black cursor-pointer transition-all active:scale-95 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="truncate">{phase.keyLabName}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    {/* Button to launch related game */}
                    {onLaunchGame && (
                      <button
                        onClick={() => onLaunchGame(phase.gameId)}
                        className="w-full flex items-center justify-between gap-2 p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-black cursor-pointer transition-all active:scale-95 shadow-2xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Play className="w-4 h-4 text-purple-600 shrink-0" />
                          <span className="truncate">{phase.gameName}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    )}

                    {/* Button to practice questions */}
                    {onOpenTopicPractice && (
                      <button
                        onClick={() => onOpenTopicPractice(phase.topicId)}
                        className="w-full flex items-center justify-between gap-2 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer transition-all active:scale-95 shadow-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Target className="w-4 h-4 shrink-0" />
                          <span>Latihan Soal Fase Ini</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    )}
                  </div>

                  {/* Mark as Completed Toggle */}
                  <div className="pt-2">
                    <button
                      onClick={() => togglePhaseCompletion(phase)}
                      className={`w-full py-2.5 px-3 rounded-2xl text-xs font-black border flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Fase Selesai (+50 XP) ✓</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 text-slate-400" />
                          <span>Tandai Selesai Fase Ini</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
