import React, { useState } from 'react';
import { sound } from '../../services/sound';
import {
  BookOpen,
  Sparkles,
  Zap,
  Volume2,
  Search,
  CheckCircle2,
  ChevronRight,
  Calculator,
  Layers,
  Scale,
  Percent,
  Shapes,
  Clock,
  BarChart3,
  Lightbulb,
  Compass,
  ArrowRight,
  RotateCcw,
  Sliders,
  HelpCircle,
} from 'lucide-react';

interface KnowledgeViewProps {
  onOpenTopicPractice?: (topicId: string) => void;
  onLaunchGame?: (gameId: string) => void;
}

type KnowledgeCategory =
  | 'all'
  | 'cambridge'
  | 'mental_math'
  | 'fractions'
  | 'geometry'
  | 'measurement'
  | 'algebra'
  | 'data';

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({
  onOpenTopicPractice,
  onLaunchGame,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');

  // Interactive Mental Math Hack 1: Multiply by 11
  const [numFor11, setNumFor11] = useState(43);
  // Interactive Mental Math Hack 2: Square numbers ending in 5
  const [numEnding5, setNumEnding5] = useState(35);
  // Interactive Bar Model Simulator
  const [barA, setBarA] = useState(60);
  const [barB, setBarB] = useState(40);
  // Interactive Fraction Visualizer
  const [fracNum, setFracNum] = useState(3);
  const [fracDenom, setFracDenom] = useState(4);
  // Interactive Geometry Calculator
  const [geoLength, setGeoLength] = useState(8);
  const [geoWidth, setGeoWidth] = useState(5);

  const CATEGORIES: { id: KnowledgeCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'Semua Materi', icon: '🌟' },
    { id: 'cambridge', label: 'Cambridge & TWM', icon: '🇬🇧' },
    { id: 'mental_math', label: 'Trik Mental Math', icon: '⚡' },
    { id: 'fractions', label: 'Pecahan & Desimal', icon: '🍕' },
    { id: 'geometry', label: 'Geometri & Spasial', icon: '📐' },
    { id: 'measurement', label: 'Pengukuran & Satuan', icon: '⏰' },
    { id: 'algebra', label: 'Aljabar & Timbangan', icon: '⚖️' },
    { id: 'data', label: 'Statistika & Data', icon: '📊' },
  ];

  // KNOWLEDGE ARTICLES & GUIDES DATA
  const ARTICLES = [
    // -------------------------------------------------------------
    // CAMBRIDGE & TWM
    // -------------------------------------------------------------
    {
      id: 'cambridge_bar_model',
      category: 'cambridge' as KnowledgeCategory,
      title: 'Metode Model Batang Cambridge (Bar Modeling)',
      subtitle: 'Memvisualisasikan Soal Cerita dengan Batang Terukur',
      gradeBadge: 'Cambridge Stage 2 - 6 / SD 2 - 6',
      icon: '📊',
      keyConcept: 'Bar Model mengubah teks narasi abstrak menjadi balok geometris konkret sehingga hubungan bagian-total (part-whole) dan perbandingan (comparison) terlihat jelas.',
      steps: [
        '1. Model Bagian-Total (Part-Whole): Batang utama merepresentasikan total, dipotong menjadi dua atau lebih segmen bagian.',
        '2. Model Perbandingan (Comparison): Dua batang sejajar bersisian untuk melihat siapa yang lebih panjang dan berapa selisih perbedaannya.',
        '3. Model Sebelum-Sesudah (Before & After): Menggambarkan perubahan jumlah ketika terjadi perpindahan atau penambahan objek.',
      ],
      interactiveType: 'bar_model',
      sampleProblem: 'Andi memiliki 60 kelereng. Budi memiliki 40 kelereng. Berapa total kelereng mereka dan berapa selisihnya?',
      relatedGameId: 'pan_balance_scale',
      relatedTopic: 'soal_cerita',
    },
    {
      id: 'cambridge_twm_framework',
      category: 'cambridge' as KnowledgeCategory,
      title: 'Kerangka Cambridge TWM (Thinking and Working Mathematically)',
      subtitle: '8 Karakter Berpikir Matematikawan Dunia',
      gradeBadge: 'Semua Jenjang / Cambridge Primary',
      icon: '🧠',
      keyConcept: 'Matematika bukan hanya menghafal rumus, melainkan cara bernalar, menyelidiki pola, membuat tebakan cerdas, dan membuktikan kebenarannya.',
      steps: [
        '🔍 Specialising: Menguji kasus-kasus atau contoh angka konkret terlebih dahulu.',
        '🌐 Generalising: Menemukan aturan atau rumus umum yang selalu berlaku untuk semua angka.',
        '💡 Conjecturing: Membuat dugaan atau hipotesis: "Apakah pola ini akan selalu menghasilkan angka genap?"',
        '🛡️ Convincing: Memberikan argumen logis dan pembuktian mengapa dugaan kita pasti benar.',
        '🏷️ Characterising & Classifying: Mengenali ciri khas bangun/bilangan lalu mengelompokkannya (seperti Diagram Carroll & Venn).',
        '⚙️ Critiquing & Improving: Membandingkan berbagai cara penyelesaian untuk menemukan strategi yang lebih efektif dan elegan.',
      ],
      interactiveType: 'none',
      relatedGameId: 'carroll_diagram',
      relatedTopic: 'logika',
    },
    {
      id: 'cambridge_ten_frame_bonds',
      category: 'cambridge' as KnowledgeCategory,
      title: 'Ten-Frames & Number Bonds (Ikatan Bilangan)',
      subtitle: 'Pondasi Berhitung Berbasis Puluhan',
      gradeBadge: 'Cambridge Stage 1 - 2 / SD 1 - 2',
      icon: '🔗',
      keyConcept: 'Bingkai 10 (Ten-frame) melatih mata anak mengenali kuantitas tanpa perlu menghitung satu per satu (subitizing). Ikatan bilangan (Number Bond) mengajarkan bahwa angka dapat dipecah dan digabung kembali.',
      steps: [
        'Ikatan 10: Pasangan sahabat 10 adalah (1+9), (2+8), (3+7), (4+6), (5+5).',
        'Teknik Jembatan 10: Untuk menghitung 8 + 5, pecah 5 menjadi 2 dan 3. (8 + 2 = 10, lalu 10 + 3 = 13).',
        'Dekomposisi Bilangan: 100 dapat dipecah menjadi 70 + 30 atau 85 + 15.',
      ],
      interactiveType: 'none',
      relatedGameId: 'number_bond',
      relatedTopic: 'penjumlahan',
    },

    // -------------------------------------------------------------
    // MENTAL MATH HACKS
    // -------------------------------------------------------------
    {
      id: 'hack_multiply_11',
      category: 'mental_math' as KnowledgeCategory,
      title: 'Trik Kilat Perkalian 11 (2-Digit)',
      subtitle: 'Jumlahkan dan Sisipkan di Tengah dalam 2 Detik!',
      gradeBadge: 'SD Kelas 3 - 6',
      icon: '⚡',
      keyConcept: 'Untuk mengalikan angka dua digit dengan 11, pisahkan kedua digit lalu selipkan hasil penjumlahannya di tengah-tengah.',
      steps: [
        'Contoh 1: 43 × 11. Pisahkan digit 4 dan 3. Jumlahkan: 4 + 3 = 7. Sisipkan: 4 [7] 3 = 473!',
        'Contoh 2: 75 × 11. Jumlahkan: 7 + 5 = 12. Simpan 1 ke digit depan: (7+1) [2] 5 = 825!',
      ],
      interactiveType: 'multiply_11',
      relatedGameId: 'quick_math',
      relatedTopic: 'perkalian',
    },
    {
      id: 'hack_square_ends_5',
      category: 'mental_math' as KnowledgeCategory,
      title: 'Trik Kuadrat Angka Berakhiran 5',
      subtitle: 'Hitung Kuadrat (35², 65², 85²) Tanpa Coretan!',
      gradeBadge: 'SD Kelas 4 - 6',
      icon: '✨',
      keyConcept: 'Kalikan angka puluhan dengan angka berikutnya (n × (n+1)), lalu tempelkan angka 25 di belakangnya.',
      steps: [
        'Contoh 1: 35². Angka puluhan adalah 3. Kalikan dengan kakaknya (3 × 4 = 12). Tempelkan 25 di belakang ➔ 1.225!',
        'Contoh 2: 75². Kalikan 7 × 8 = 56. Tempelkan 25 ➔ 5.625!',
        'Contoh 3: 95². Kalikan 9 × 10 = 90. Tempelkan 25 ➔ 9.025!',
      ],
      interactiveType: 'square_5',
      relatedGameId: 'quick_math',
      relatedTopic: 'perkalian',
    },
    {
      id: 'hack_finger_9',
      category: 'mental_math' as KnowledgeCategory,
      title: 'Trik Perkalian 9 dengan 10 Jari Tangan',
      subtitle: 'Sulap Jari Ajaib untuk Perkalian 9 × 1 sampai 9 × 10',
      gradeBadge: 'SD Kelas 2 - 4',
      icon: '🖐️',
      keyConcept: 'Buka kedua telapak tangan. Untuk menghitung 9 × n, lipat jari ke-n dari kiri. Jari di sebelah kiri lipatan adalah puluhan, jari di sebelah kanan adalah satuan!',
      steps: [
        'Contoh 1: 9 × 3. Lipat jari ke-3 (jari tengah tangan kiri).',
        'Di sebelah kiri lipatan ada 2 jari (puluhan = 20). Di sebelah kanan ada 7 jari (satuan = 7). Hasilnya = 27!',
        'Contoh 2: 9 × 7. Lipat jari telunjuk tangan kanan (jari ke-7). Di kiri ada 6 jari, di kanan ada 3 jari. Hasilnya = 63!',
      ],
      interactiveType: 'none',
      relatedGameId: 'quick_math',
      relatedTopic: 'perkalian',
    },

    // -------------------------------------------------------------
    // FRACTIONS & DECIMALS
    // -------------------------------------------------------------
    {
      id: 'fractions_trio_concept',
      category: 'fractions' as KnowledgeCategory,
      title: 'Trio Ekuivalen: Pecahan, Desimal, dan Persentase',
      subtitle: 'Memahami Tiga Wajah dari Nilai yang Sama',
      gradeBadge: 'Cambridge Stage 4 - 6 / SD 4 - 6',
      icon: '🍕',
      keyConcept: 'Pecahan biasa, pecahan desimal, dan persen adalah tiga bahasa berbeda untuk menyatakan proporsi bagian dari satu kesatuan utuh (100%).',
      steps: [
        '1/2 = 0,5 = 50% (Setengah)',
        '1/4 = 0,25 = 25% (Seperempat)',
        '3/4 = 0,75 = 75% (Tiga perempat)',
        '1/5 = 0,20 = 20% (Seperlima)',
        '1/10 = 0,10 = 10% (Sepersepuluh)',
      ],
      interactiveType: 'fraction_slicer',
      relatedGameId: 'fraction_decimal_percent',
      relatedTopic: 'pecahan',
    },
    {
      id: 'fractions_same_denominator',
      category: 'fractions' as KnowledgeCategory,
      title: 'Menyamakan Penyebut dengan KPK',
      subtitle: 'Kunci Sukses Menjumlah & Mengurang Pecahan Beda Penyebut',
      gradeBadge: 'SD Kelas 4 - 6',
      icon: '🍰',
      keyConcept: 'Pecahan tidak bisa langsung dijumlahkan jika ukurannya (penyebut) berbeda. Kita harus mencari KPK penyebut agar ukuran potongannya setara.',
      steps: [
        'Contoh: 1/2 + 1/3. Penyebutnya adalah 2 dan 3. KPK dari 2 dan 3 adalah 6.',
        'Ubah 1/2 menjadi 3/6 (kali 3). Ubah 1/3 menjadi 2/6 (kali 2).',
        'Jumlahkan pembilangnya: 3/6 + 2/6 = 5/6!',
      ],
      interactiveType: 'none',
      relatedGameId: 'cake_fraction_slicer',
      relatedTopic: 'pecahan',
    },

    // -------------------------------------------------------------
    // GEOMETRY & SHAPES
    // -------------------------------------------------------------
    {
      id: 'geometry_formulas_2d',
      category: 'geometry' as KnowledgeCategory,
      title: 'Panduan Lengkap Bangun Datar 2D (Luas & Keliling)',
      subtitle: 'Persegi, Persegi Panjang, Segitiga, dan Lingkaran',
      gradeBadge: 'SD Kelas 3 - 6',
      icon: '📐',
      keyConcept: 'Keliling adalah total panjang garis pembatas tepi bangun datar. Luas adalah besaran daerah bidang yang tertutup di dalamnya.',
      steps: [
        'Persegi: Keliling = 4 × s | Luas = s × s (s²)',
        'Persegi Panjang: Keliling = 2 × (p + l) | Luas = p × l',
        'Segitiga: Keliling = s1 + s2 + s3 | Luas = ½ × alas × tinggi',
        'Lingkaran: Keliling = 2 × π × r | Luas = π × r² (π = 22/7 atau 3,14)',
      ],
      interactiveType: 'geometry_calc',
      relatedGameId: 'geoboard_perimeter_area',
      relatedTopic: 'geometri',
    },
    {
      id: 'geometry_angles_guide',
      category: 'geometry' as KnowledgeCategory,
      title: 'Klasifikasi Sudut & Derajat Busur',
      subtitle: 'Sudut Lancip, Siku-Siku, Tumpul, dan Lurus',
      gradeBadge: 'Cambridge Stage 3 - 6 / SD 3 - 6',
      icon: '🧭',
      keyConcept: 'Sudut terbentuk dari dua garis lurus yang berpotongan di satu titik sudut (vertex). Diukur dalam satuan derajat (°).',
      steps: [
        'Sudut Lancip (Acute): Lebih kecil dari 90° (misal 30°, 45°, 60°).',
        'Sudut Siku-Siku (Right Angle): Tepat 90°, membentuk sudut tegak lurus L.',
        'Sudut Tumpul (Obtuse): Antara 90° sampai 180° (misal 120°, 150°).',
        'Sudut Lurus (Straight): Tepat 180°, membentuk garis lurus mendatar.',
        'Jumlah sudut dalam sebuah segitiga SELALU tepat 180°!',
      ],
      interactiveType: 'none',
      relatedGameId: 'angle_protractor_lab',
      relatedTopic: 'geometri',
    },

    // -------------------------------------------------------------
    // MEASUREMENT & UNITS
    // -------------------------------------------------------------
    {
      id: 'measurement_metric_staircase',
      category: 'measurement' as KnowledgeCategory,
      title: 'Tangga Konversi Satuan Metrik (km ➔ mm)',
      subtitle: 'Turun 1 Tangga Kali 10, Naik 1 Tangga Bagi 10',
      gradeBadge: 'SD Kelas 3 - 6',
      icon: '📏',
      keyConcept: 'Sistem metrik berbasis desimal (kelipatan 10). Menghafal urutan tangga memudahkan konversi jarak, massa, dan volume.',
      steps: [
        'Jembatan Keledai: Kucing Hitam Dalam Mobil Dambaan Cantik Manis.',
        'Urutan Panjang: km (kilometer) ➔ hm ➔ dam ➔ m (meter) ➔ dm ➔ cm ➔ mm.',
        'Turun 1 anak tangga = Kalikan 10 (tambah satu nol). Turun 3 tangga (km ke m) = × 1.000.',
        'Naik 1 anak tangga = Bagikan 10 (kurangi satu nol).',
      ],
      interactiveType: 'none',
      relatedGameId: 'weight_conversion_lift',
      relatedTopic: 'pengukuran',
    },
    {
      id: 'measurement_time_clock',
      category: 'measurement' as KnowledgeCategory,
      title: 'Membaca Jam Analog & Durasi Waktu',
      subtitle: 'Jarum Pendek, Jarum Panjang, dan Konversi Jam/Menit',
      gradeBadge: 'SD Kelas 1 - 5',
      icon: '⏰',
      keyConcept: 'Jarum pendek menunjukkan jam, jarum panjang menunjukkan menit. 1 putaran lingkaran jam adalah 60 menit atau 360 derajat.',
      steps: [
        'Setiap langkah 1 angka pada jarum panjang = 5 menit.',
        '1 Jam = 60 Menit | 1 Menit = 60 Detik | 1 Hari = 24 Jam.',
        'Menghitung Durasi: Waktu Tiba dikurangi Waktu Berangkat.',
      ],
      interactiveType: 'none',
      relatedGameId: 'time_duration_bus',
      relatedTopic: 'waktu',
    },

    // -------------------------------------------------------------
    // ALGEBRA & BALANCE
    // -------------------------------------------------------------
    {
      id: 'algebra_pan_balance',
      category: 'algebra' as KnowledgeCategory,
      title: 'Konsep Neraca Aljabar (Persamaan Seimbang)',
      subtitle: 'Apa yang Dilakukan di Kiri, Harus Dilakukan di Kanan',
      gradeBadge: 'Cambridge Stage 4 - 6 / SD 4 - 6',
      icon: '⚖️',
      keyConcept: 'Tanda sama dengan (=) ibarat titik tengah neraca yang seimbang. Jika sisi kiri ditambah atau dikurangi, sisi kanan wajib diperlakukan sama agar tetap seimbang.',
      steps: [
        'Persamaan: x + 5 = 12. Untuk mencari x, kurangi kedua sisi dengan 5.',
        'x + 5 - 5 = 12 - 5 ➔ x = 7!',
        'Persamaan: 3x = 15. Bagi kedua sisi dengan 3 ➔ x = 5!',
      ],
      interactiveType: 'none',
      relatedGameId: 'pan_balance_scale',
      relatedTopic: 'logika',
    },

    // -------------------------------------------------------------
    // DATA & STATISTICS
    // -------------------------------------------------------------
    {
      id: 'data_mean_median_mode',
      category: 'data' as KnowledgeCategory,
      title: 'Statistika Dasar: Mean, Median, dan Modus',
      subtitle: 'Tiga Ukuran Pemusatan Data yang Sangat Populer',
      gradeBadge: 'SD Kelas 5 - 6',
      icon: '📊',
      keyConcept: 'Data kuantitatif dapat diringkas melalui nilai rata-rata, nilai tengah, dan nilai yang paling sering muncul.',
      steps: [
        'Mean (Rata-rata): Jumlahkan seluruh nilai data, lalu bagi dengan banyaknya data.',
        'Median (Nilai Tengah): Urutkan data dari terkecil ke terbesar. Ambil data yang tepat berada di posisi tengah.',
        'Modus: Nilai atau kategori yang frekuensinya paling banyak muncul.',
      ],
      interactiveType: 'none',
      relatedGameId: 'mean_median_mode_detective',
      relatedTopic: 'data',
    },

    // -------------------------------------------------------------
    // MATERI TAMBAHAN: OPERASI CAMPURAN, FPB/KPK, BILANGAN NEGATIF, DLL
    // -------------------------------------------------------------
    {
      id: 'rules_kabataku_pemdas',
      category: 'mental_math' as KnowledgeCategory,
      title: 'Aturan Urutan Operasi Hitung (KABATAKU / PEMDAS)',
      subtitle: 'Kurung, Perkalian/Pembagian, lalu Penjumlahan/Pengurangan',
      gradeBadge: 'SD Kelas 3 - 6 / Cambridge Stage 3 - 6',
      icon: '⚡',
      keyConcept: 'Dalam satu kalimat matematika terdapat aturan baku prioritas agar hasil perhitungan selalu konsisten dan tidak ambigu di seluruh dunia.',
      steps: [
        '1. Kurung (): Segala operasi di dalam tanda kurung diselesaikan pertama kali.',
        '2. Kali (×) & Bagi (÷): Memiliki kekuatan setara, dikerjakan berurutan dari kiri ke kanan.',
        '3. Tambah (+) & Kurang (-): Memiliki kekuatan paling akhir, dikerjakan berurutan dari kiri ke kanan.',
        'Contoh jebakan: 5 + 4 × 3 = 5 + 12 = 17 (Bukan 9 × 3 = 27!).',
      ],
      interactiveType: 'none',
      sampleProblem: 'Hitunglah: 20 - 4 × (2 + 1) = ? Jawab: 20 - 4 × 3 = 20 - 12 = 8.',
      relatedGameId: 'order_of_operations_runner',
      relatedTopic: 'operasi_hitung',
    },
    {
      id: 'kpk_fpb_mastery',
      category: 'algebra' as KnowledgeCategory,
      title: 'Konsep FPB dan KPK (Pohon Faktor & Tabel Sawah)',
      subtitle: 'Pembagi Persekutuan Terbesar & Kelipatan Terkecil',
      gradeBadge: 'SD Kelas 4 - 6',
      icon: '🚀',
      keyConcept: 'KPK digunakan saat mencari waktu atau siklus bertemu bersama. FPB digunakan saat membagikan barang-barang ke dalam paket sama banyak tanpa sisa.',
      steps: [
        '1. Faktorisasi Prima: Uraikan bilangan menjadi perkalian bilangan prima (2, 3, 5, 7, 11...).',
        '2. Mencari FPB: Kalikan faktor prima yang SAMA dengan pangkat TERKECIL.',
        '3. Mencari KPK: Kalikan SEMUA faktor prima, jika ada yang sama ambil pangkat TERBESAR.',
        '4. Tips Soal Cerita: Kata kunci "dibagikan sama banyak" ➔ FPB. Kata kunci "bertemu setiap ... hari" ➔ KPK.',
      ],
      interactiveType: 'none',
      sampleProblem: 'Lampu A menyala tiap 4 detik, Lampu B tiap 6 detik. Kapan menyala bersama? KPK(4,6) = 12 detik!',
      relatedGameId: 'kpk_fpb_race',
      relatedTopic: 'fpb_kpk',
    },
    {
      id: 'negative_numbers_guide',
      category: 'algebra' as KnowledgeCategory,
      title: 'Bilangan Bulat Negatif & Garis Bilangan Berarah',
      subtitle: 'Suhu Di Bawah Nol, Kedalaman Laut, dan Arah Mundur',
      gradeBadge: 'SD Kelas 6 / Cambridge Stage 6',
      icon: '🚢',
      keyConcept: 'Bilangan negatif berada di sebelah kiri angka 0 pada garis bilangan horizontal, atau di bawah 0 pada termometer vertikal.',
      steps: [
        '1. Nilai Bilangan: Semakin ke kiri di garis bilangan, nilainya semakin kecil (-10 lebih kecil daripada -2).',
        '2. Penjumlahan & Pengurangan: Mengurangi bilangan positif sama dengan melangkah ke kiri. Mengurangi bilangan negatif sama dengan menambah (melangkah ke kanan: 5 - (-3) = 5 + 3 = 8).',
        '3. Perkalian & Pembagian: Positif × Negatif = Negatif. Negatif × Negatif = Positif!',
      ],
      interactiveType: 'none',
      sampleProblem: 'Suhu awal -3°C, kemudian naik 7°C. Suhu akhir = -3 + 7 = 4°C.',
      relatedGameId: 'negative_number_submarine',
      relatedTopic: 'bilangan_bulat',
    },
    {
      id: 'properties_commutative_associative',
      category: 'mental_math' as KnowledgeCategory,
      title: 'Trik Sifat Hitung Cepat: Komutatif, Asosiatif & Distributif',
      subtitle: 'Membalik & Mengelompokkan Angka untuk Berhitung Kilat',
      gradeBadge: 'SD Kelas 3 - 6',
      icon: '💡',
      keyConcept: 'Mengatur urutan perkalian dan penjumlahan dapat mengubah soal yang rumit menjadi perkalian angka 10, 100, atau 1.000 yang sangat mudah!',
      steps: [
        '1. Komutatif (Pertukaran): a + b = b + a, serta a × b = b × a.',
        '2. Asosiatif (Pengelompokan): (a × b) × c = a × (b × c). Contoh: 25 × 37 × 4 = (25 × 4) × 37 = 100 × 37 = 3.700!',
        '3. Distributif (Penyebaran): a × (b + c) = (a × b) + (a × c). Contoh: 6 × 98 = 6 × (100 - 2) = 600 - 12 = 588.',
      ],
      interactiveType: 'none',
      sampleProblem: 'Hitung cepat 125 × 49 × 8 = ? Pasangkan (125 × 8 = 1.000) × 49 = 49.000!',
      relatedGameId: 'quick_math',
      relatedTopic: 'operasi_hitung',
    },
    {
      id: 'circle_radius_area_mastery',
      category: 'geometry' as KnowledgeCategory,
      title: 'Eksplorasi Lingkaran: Konstanta Pi (π), Keliling & Luas',
      subtitle: 'Mengapa Nilai Pi Adalah 22/7 atau 3,14?',
      gradeBadge: 'SD Kelas 6 / Cambridge Stage 6',
      icon: '⭕',
      keyConcept: 'Konstanta Pi (π) adalah rasio perbandingan antara keliling lingkaran dengan diameternya, bernilai konstan sekitar 3,14159...',
      steps: [
        '1. Jari-jari (r) & Diameter (d): d = 2 × r. Jari-jari adalah jarak dari pusat ke tepi.',
        '2. Keliling Lingkaran (K): K = π × d atau K = 2 × π × r.',
        '3. Luas Lingkaran (L): L = π × r² (r kuadrat = r × r).',
        '4. Kapan pakai 22/7?: Gunakan 22/7 jika jari-jari kelipatan 7 (7, 14, 21, 28) agar mudah dicoret/dibagi. Jika bukan, gunakan 3,14.',
      ],
      interactiveType: 'none',
      sampleProblem: 'Lingkaran dengan r = 7 cm. Keliling = 2 × 22/7 × 7 = 44 cm. Luas = 22/7 × 7 × 7 = 154 cm².',
      relatedGameId: 'circle_geometry_lab',
      relatedTopic: 'geometri',
    },
    {
      id: 'debit_volume_measurement',
      category: 'measurement' as KnowledgeCategory,
      title: 'Pengukuran Debit, Volume, dan Waktu Aliran Air',
      subtitle: 'Memahami Kecepatan Pengisian Tangki Air',
      gradeBadge: 'SD Kelas 5 - 6',
      icon: '💧',
      keyConcept: 'Debit adalah banyaknya volume zat cair yang mengalir setiap satu satuan waktu tertentu (misal: liter/menit atau m³/detik).',
      steps: [
        '1. Segitiga Rumus V-D-W: Volume (V) berada di atas, Debit (D) dan Waktu (W) berada di bawah.',
        '2. Volume = Debit × Waktu (V = D × W).',
        '3. Debit = Volume ÷ Waktu (D = V ÷ W).',
        '4. Waktu = Volume ÷ Debit (W = V ÷ D).',
        '5. Konversi Satuan: 1 liter = 1 dm³ = 1.000 cm³ = 1.000 ml. 1 m³ = 1.000 liter.',
      ],
      interactiveType: 'none',
      sampleProblem: 'Pipa mengalirkan 10 liter/menit selama 5 menit. Volume air yang terkumpul = 10 × 5 = 50 liter.',
      relatedGameId: 'liquid_measuring_jug',
      relatedTopic: 'pengukuran',
    },
  ];

  // Filtered articles
  const filteredArticles = ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.keyConcept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSpeak = (text: string) => {
    sound.speak(text);
  };

  // Mental Math 1 Calculation
  const d1 = Math.floor(numFor11 / 10);
  const d2 = numFor11 % 10;
  const sumD = d1 + d2;
  const result11 = numFor11 * 11;

  // Mental Math 2 Calculation
  const tens5 = Math.floor(numEnding5 / 10);
  const prefix5 = tens5 * (tens5 + 1);
  const resultSq5 = numEnding5 * numEnding5;

  return (
    <div className="space-y-6 pb-24 sm:pb-8 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* 1. HERO HEADER: PUSAT PENGETAHUAN & KONSEP MATEMATIKA                     */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/30">
              <BookOpen className="w-4 h-4 text-amber-300" />
              Pusat Pengetahuan & Konsep
            </span>
            <span className="bg-amber-400 text-indigo-950 font-black px-2.5 py-1 rounded-full text-xs shadow-xs">
              Bebas Akses Terbuka
            </span>
            <span className="bg-blue-500/50 text-white font-extrabold px-2.5 py-1 rounded-full text-xs border border-white/20">
              Kurikulum Merdeka & Cambridge
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Pelajari Konsep, Pahami Cara Kerjanya 💡
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 font-medium leading-relaxed">
            Eksplorasi konsep matematika interaktif, metode Cambridge Thinking (TWM), trik berhitung cepat, dan visualisasi pemecahan soal tanpa rumus buta.
          </p>
        </div>

        {/* Decorative background vectors */}
        <div className="absolute right-4 -bottom-6 text-8xl opacity-15 select-none pointer-events-none hidden sm:block">
          📐
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & CATEGORY FILTER BAR                                           */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi (misal: Bar Model, Trik 11, Pecahan, Segitiga, Luas, Celcius)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-105'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE CONCEPT PLAYGROUNDS (HIGHLIGHTED)                          */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Laboratorium Konsep Interaktif
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">Coba Langsung & Ubah Angka</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PLAYGROUND 1: TRIK PERKALIAN 11 CEPAT */}
          <div className="bg-white rounded-3xl p-5 border-2 border-indigo-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                  ⚡
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Trik Kilat Perkalian 11</h3>
                  <p className="text-xs text-slate-500 font-bold">Sisipkan jumlah digit di tengah</p>
                </div>
              </div>
              <button
                onClick={() => handleSpeak(`Trik perkalian 11. Angka ${numFor11} dikali 11. Pisahkan digit ${d1} dan ${d2}, jumlahnya adalah ${sumD}. Hasil akhirnya adalah ${result11}`)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Dengarkan Suara"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-black text-slate-600">
                <span>Pilih Angka (10 - 89):</span>
                <span className="text-indigo-600 font-black text-sm">{numFor11}</span>
              </div>
              <input
                type="range"
                min="10"
                max="89"
                value={numFor11}
                onChange={(e) => setNumFor11(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Visual Formula Display */}
            <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-200 text-center space-y-2">
              <div className="text-xs font-bold text-indigo-900">
                Langkah: Pisahkan <span className="font-black text-indigo-700">{d1}</span> dan <span className="font-black text-indigo-700">{d2}</span>. Jumlahkan ({d1} + {d2} = {sumD}).
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-950 flex items-center justify-center gap-2">
                <span>{numFor11} × 11 =</span>
                <span className="text-emerald-600 bg-white px-3 py-1 rounded-xl shadow-xs border border-emerald-300 animate-pulse">
                  {result11}
                </span>
              </div>
            </div>
          </div>

          {/* PLAYGROUND 2: CAMBRIDGE BAR MODEL SIMULATOR */}
          <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                  📊
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Cambridge Bar Model Simulator</h3>
                  <p className="text-xs text-slate-500 font-bold">Model perbandingan dua kuantitas</p>
                </div>
              </div>
              <button
                onClick={() => handleSpeak(`Model batang perbandingan. Batang A bernilai ${barA}, Batang B bernilai ${barB}. Total kedua batang adalah ${barA + barB}, dan selisihnya adalah ${Math.abs(barA - barB)}`)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Dengarkan Suara"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Sliders for A and B */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-600">
              <div>
                <label className="block mb-1">Batang A: <span className="text-emerald-600 font-black">{barA}</span></label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={barA}
                  onChange={(e) => setBarA(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block mb-1">Batang B: <span className="text-blue-600 font-black">{barB}</span></label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={barB}
                  onChange={(e) => setBarB(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Visual Bars Rendering */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>Batang A ({barA})</span>
                  <span>{barA > barB ? `+${barA - barB} Lebih Banyak` : ''}</span>
                </div>
                <div className="w-full bg-slate-200 h-6 rounded-lg overflow-hidden flex">
                  <div
                    style={{ width: `${(barA / 100) * 100}%` }}
                    className="bg-emerald-500 h-full text-white text-[11px] font-black flex items-center justify-center transition-all"
                  >
                    {barA}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>Batang B ({barB})</span>
                  <span>{barB > barA ? `+${barB - barA} Lebih Banyak` : ''}</span>
                </div>
                <div className="w-full bg-slate-200 h-6 rounded-lg overflow-hidden flex">
                  <div
                    style={{ width: `${(barB / 100) * 100}%` }}
                    className="bg-blue-500 h-full text-white text-[11px] font-black flex items-center justify-center transition-all"
                  >
                    {barB}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-black pt-1 border-t border-slate-200 text-slate-800">
                <span>Total (A + B): <span className="text-emerald-700">{barA + barB}</span></span>
                <span>Selisih: <span className="text-rose-600">{Math.abs(barA - barB)}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. ARTICLES & CONCEPT GUIDES GRID                                        */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            Daftar Materi & Pengetahuan Matematika ({filteredArticles.length})
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Kategori: <span className="text-indigo-600 font-extrabold uppercase">{selectedCategory}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shrink-0">
                      {art.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {art.gradeBadge}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5 leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-500">{art.subtitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeak(`${art.title}. ${art.keyConcept}`)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 border border-slate-200 cursor-pointer transition-colors shrink-0"
                    title="Dengarkan Penjelasan"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Key Concept Box */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 text-xs font-medium text-slate-700 leading-relaxed">
                  <span className="font-black text-indigo-900 block mb-1">💡 Inti Konsep:</span>
                  {art.keyConcept}
                </div>

                {/* Steps / Rules */}
                <div className="space-y-1.5 pl-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                    Penjabaran & Aturan:
                  </span>
                  {art.steps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {art.relatedGameId && onLaunchGame && (
                  <button
                    onClick={() => onLaunchGame(art.relatedGameId)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-black cursor-pointer transition-transform active:scale-95"
                  >
                    <span>Mainkan Game Terkait</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {art.relatedTopic && onOpenTopicPractice && (
                  <button
                    onClick={() => onOpenTopicPractice(art.relatedTopic)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black cursor-pointer shadow-xs transition-transform active:scale-95"
                  >
                    <span>Latihan Soal</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
