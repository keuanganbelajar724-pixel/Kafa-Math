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
  | 'grade1'
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

  // Interactive Ten-Frame Simulator (Kelas 1 SD)
  const [tenFrameCount, setTenFrameCount] = useState(6);
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

  // Interactive Analog Clock Simulator
  const [clockHour, setClockHour] = useState(7);
  const [clockMinute, setClockMinute] = useState(0);
  // Interactive Coin Cashier & Wallet
  const [cashierCoins, setCashierCoins] = useState<number[]>([1000, 500, 200]);
  // Interactive 2D Shape Explorer
  const [selectedShape, setSelectedShape] = useState<'lingkaran' | 'segitiga' | 'persegi' | 'persegi_panjang'>('segitiga');
  // Interactive Vedic Subtract 1000
  const [sub1000Num, setSub1000Num] = useState(364);
  // Interactive Multiplication Array Matrix
  const [arrayRows, setArrayRows] = useState(4);
  const [arrayCols, setArrayCols] = useState(6);
  // Interactive Celsius Thermometer Simulator
  const [labTemp, setLabTemp] = useState(25);

  const CATEGORIES: { id: KnowledgeCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'Semua Materi', icon: '🌟' },
    { id: 'grade1', label: 'Kelas 1 SD Ceria', icon: '🎒' },
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
    // KELAS 1 SD CERIA (FOUNDATION STAGE 1)
    // -------------------------------------------------------------
    {
      id: 'grade1_counting_objects',
      category: 'grade1' as KnowledgeCategory,
      title: 'Mengenal Angka 1-20 & Membilang Benda Konkret',
      subtitle: 'Membilang Benda Sekitar, Lambang & Nama Bilangan',
      gradeBadge: 'SD Kelas 1 / Cambridge Stage 1',
      icon: '🍎',
      keyConcept: 'Membilang adalah memasangkan setiap satu benda dengan satu nama bilangan secara berurutan. Angka melambangkan jumlah benda konkret.',
      steps: [
        '1. Korespondensi Satu-ke-Satu: Tunjuk satu benda sambil menyebut satu angka (1, 2, 3, 4, 5...).',
        '2. Lambang vs Nama Bilangan: Lambang adalah tulisan angka (contoh: "14"), nama bilangan adalah cara membacanya ("empat belas").',
        '3. Urutan Maju & Mundur: Maju bertambah satu (1, 2, 3...), mundur berkurang satu (10, 9, 8, 7...).',
        '4. Angka Nol (0): Melambangkan tidak ada benda sama sekali di dalam wadah.',
      ],
      interactiveType: 'none',
      sampleProblem: 'Ada 7 buah apel di keranjang 🍎🍎🍎🍎🍎🍎🍎. Tambah 1 apel lagi = 8 apel.',
      relatedGameId: 'farm_counting_bonds',
      relatedTopic: 'bilangan',
    },
    {
      id: 'grade1_number_bonds_10',
      category: 'grade1' as KnowledgeCategory,
      title: 'Teman Sepuluh (Number Bonds to 10)',
      subtitle: 'Rahasia Pasangan Angka Menuju 10 dengan Ten-Frame',
      gradeBadge: 'SD Kelas 1 / Cambridge Stage 1',
      icon: '🔟',
      keyConcept: 'Setiap bilangan 1 sampai 9 memiliki satu "teman setia" yang jika digabungkan akan selalu berjumlah tepat 10.',
      steps: [
        '1 + 9 = 10 (Satu berteman dengan Sembilan)',
        '2 + 8 = 10 (Dua berteman dengan Delapan)',
        '3 + 7 = 10 (Tiga berteman dengan Tujuh)',
        '4 + 6 = 10 (Empat berteman dengan Enam)',
        '5 + 5 = 10 (Lima berteman dengan Lima)',
        'Manfaat Rahasia: Jika menghitung 8 + 5, pecah 5 menjadi (2 + 3). Gabungkan 8 + 2 = 10, lalu 10 + 3 = 13!',
      ],
      interactiveType: 'none',
      sampleProblem: 'Aisyah punya 7 pensil. Berapa pensil lagi agar menjadi 10? Jawab: 3 pensil (karena 7 + 3 = 10).',
      relatedGameId: 'farm_counting_bonds',
      relatedTopic: 'ikatan_bilangan',
    },
    {
      id: 'grade1_comparing_more_less',
      category: 'grade1' as KnowledgeCategory,
      title: 'Perbandingan Kuantitas: Lebih Banyak, Lebih Sedikit, & Sama Banyak',
      subtitle: 'Memasangkan Benda dan Simbol >, <, =',
      gradeBadge: 'SD Kelas 1 / Cambridge Stage 1',
      icon: '⚖️',
      keyConcept: 'Untuk membandingkan dua kumpulan benda, pasangkan satu per satu. Benda yang memiliki sisa tanpa pasangan adalah kumpulan yang lebih banyak.',
      steps: [
        'Lebih Banyak (>): Jumlah benda di sebelah kiri lebih banyak daripada di kanan (misal 8 balon > 5 balon).',
        'Lebih Sedikit (<): Jumlah benda di sebelah kiri lebih sedikit daripada di kanan (misal 4 permen < 7 permen).',
        'Sama Banyak (=): Kedua kumpulan memiliki jumlah yang persis seimbang (misal 6 apel = 6 apel).',
        'Tips Lucu: Anggap tanda > dan < sebagai "Mulut Buaya yang Lapar", buaya selalu membuka mulut ke arah makanan yang LEBIH BANYAK!',
      ],
      interactiveType: 'none',
      sampleProblem: 'Kelereng Budi ada 9 butir, kelereng Edo ada 6 butir. Kelereng Budi LEBIH BANYAK daripada kelereng Edo (9 > 6).',
      relatedGameId: 'star_balance_compare',
      relatedTopic: 'perbandingan',
    },
    {
      id: 'grade1_addition_subtraction_concrete',
      category: 'grade1' as KnowledgeCategory,
      title: 'Penjumlahan & Pengurangan Maju-Mundur Garis Bilangan',
      subtitle: 'Menghitung dengan Jari, Garis Bilangan, dan Cerita Pendek',
      gradeBadge: 'SD Kelas 1 / Cambridge Stage 1',
      icon: '🐸',
      keyConcept: 'Penjumlahan adalah menggabungkan dua kelompok benda (melompat maju). Pengurangan adalah mengambil sebagian benda (melompat mundur).',
      steps: [
        'Penjumlahan (+): Mulai dari angka terbesar di dalam ingatan pikiran, lalu lanjutkan menghitung maju dengan jari.',
        'Pengurangan (-): Mulai dari angka awal, lalu hitung mundur sebanyak angka pengurang.',
        'Garis Bilangan: Melompat ke kanan = Bertambah (+). Melompat ke kiri = Berkurang (-).',
        'Soal Cerita: Kata "diberi lagi", "membeli lagi", "menetas" ➔ Tambah (+). Kata "dimakan", "hilang", "pecah", "diberikan" ➔ Kurang (-).',
      ],
      interactiveType: 'none',
      sampleProblem: 'Katak di angka 6 melompat maju 4 langkah. 6 + 4 = 10! Jika melompat mundur 2 langkah: 10 - 2 = 8.',
      relatedGameId: 'frog_jump_numberline',
      relatedTopic: 'operasi_hitung',
    },
    {
      id: 'grade1_shapes_around_us',
      category: 'grade1' as KnowledgeCategory,
      title: 'Mengenal Bentuk Bangun Datar di Sekitar Kita',
      subtitle: 'Lingkaran, Segitiga, Persegi, dan Persegi Panjang',
      gradeBadge: 'SD Kelas 1 / Cambridge Stage 1',
      icon: '🔶',
      keyConcept: 'Benda-benda di sekitar kita memiliki permukaan datar dengan bentuk tertentu yang mudah dikenali melalui tepi dan sudutnya.',
      steps: [
        'Lingkaran (Circle): Tidak memiliki sudut, sisinya melengkung mulus (contoh: uang koin, roda sepeda, piring makan, jam dinding).',
        'Segitiga (Triangle): Memiliki tepat 3 sisi lurus dan 3 sudut lancip (contoh: potongan pizza, atap rumah, rambu segitiga).',
        'Persegi (Square): Memiliki 4 sisi yang SAMA PANJANG dan 4 sudut siku-siku (contoh: ubin keramik, papan catur, origami).',
        'Persegi Panjang (Rectangle): Memiliki 4 sisi, di mana 2 sisi panjang berhadapan sama dan 2 sisi pendek berhadapan sama (contoh: buku tulis, layar HP, pintu kelas).',
      ],
      interactiveType: 'none',
      sampleProblem: 'Benda apakah yang berbentuk lingkaran di kamarmu? Jam dinding bulat dan tutup toples kue!',
      relatedGameId: 'geometry_builder',
      relatedTopic: 'geometri',
    },
    {
      id: 'grade1_time_daily_routine',
      category: 'grade1' as KnowledgeCategory,
      title: 'Mengenal Waktu Keseharian & Jam Bulat Tepat',
      subtitle: 'Pagi, Siang, Malam & Membaca Jarum Jam Analog',
      gradeBadge: 'SD Kelas 1 / Cambridge Stage 1',
      icon: '⏰',
      keyConcept: 'Waktu mengalir dari pagi (terbit matahari), siang (matahari tepat di atas), sore, hingga malam (gelap dan bintang muncul).',
      steps: [
        'Pagi Hari: Bangun tidur pukul 06.00, sarapan dan berangkat ke sekolah.',
        'Siang Hari: Pulang sekolah pukul 12.00, makan siang bersama keluarga.',
        'Malam Hari: Belajar pukul 19.00 dan tidur lelap pukul 20.30 atau 21.00.',
        'Membaca Jam Bulat: Jika jarum panjang menunjuk tepat ke angka 12, lihat angka yang ditunjuk jarum pendek (contoh: jarum pendek di 7 = pukul 07.00 tepat).',
      ],
      interactiveType: 'none',
      sampleProblem: 'Jarum pendek menunjuk angka 8, jarum panjang menunjuk angka 12. Pukul berapakah itu? Pukul 08.00 tepat!',
      relatedGameId: 'cat_castle_clock',
      relatedTopic: 'waktu',
    },
    {
      id: 'grade1_place_value_tens_ones',
      category: 'grade1' as KnowledgeCategory,
      title: 'Nilai Tempat: Puluhan dan Satuan Bilangan 11 - 20',
      subtitle: 'Memecah Bilangan Menjadi 1 Ikat Puluhan (10) dan Satuan Lepas',
      gradeBadge: 'SD Kelas 1 / Cambridge Stage 1',
      icon: '🧺',
      keyConcept: 'Setiap bilangan 2 angka memiliki nilai tempat. Angka di sebelah kiri adalah Puluhan (bernilai kelipatan 10), dan angka di sebelah kanan adalah Satuan.',
      steps: [
        '1. Konsep Ikat Lidi: 10 batang lidi diikat karet menjadi 1 ikat puluhan. 1 ikat bernilai 10.',
        '2. Membaca Bilangan 14: Terdiri dari 1 puluhan (10) dan 4 satuan (4). 10 + 4 = 14.',
        '3. Membaca Bilangan 17: 1 puluhan + 7 satuan = 17.',
        '4. Angka 20: Terdiri dari 2 ikat puluhan dan 0 satuan (20 = 2 puluhan + 0 satuan).',
      ],
      interactiveType: 'none',
      sampleProblem: 'Ada 1 keranjang berisi 10 jeruk dan 5 jeruk di luar keranjang. Total = 10 + 5 = 15 buah jeruk!',
      relatedGameId: 'fruit_store_place_value',
      relatedTopic: 'nilai_tempat',
    },
    {
      id: 'grade1_rupiah_coins',
      category: 'grade1' as KnowledgeCategory,
      title: 'Mengenal Uang Logam Rupiah & Berbelanja Pas',
      subtitle: 'Koin Rp 100, Rp 200, Rp 500, dan Rp 1.000',
      gradeBadge: 'SD Kelas 1 / Cambridge Stage 1',
      icon: '🪙',
      keyConcept: 'Uang logam digunakan untuk alat pembayaran jual beli sah di Indonesia. Nilai uang ditentukan oleh angka yang tertera di permukaan koin.',
      steps: [
        'Koin Rp 100: Pecahan koin logam terkecil yang sering digunakan untuk kembalian.',
        'Koin Rp 200: Sama nilainya dengan dua keping koin Rp 100 (100 + 100 = 200).',
        'Koin Rp 500: Bergambar bunga melati atau garuda emas.',
        'Koin Rp 1.000: Koin terbesar dengan angka seribu. Nilainya sama dengan dua keping Rp 500 (500 + 500 = 1.000).',
        'Tips Belanja: Beli permen Rp 300 dapat dibayar dengan 1 koin Rp 200 + 1 koin Rp 100.',
      ],
      interactiveType: 'none',
      sampleProblem: 'Rina membeli stiker seharga Rp 700. Rina membayar dengan sekeping Rp 500 dan sekeping Rp 200 (500 + 200 = 700).',
      relatedGameId: 'mini_market_coins',
      relatedTopic: 'uang',
    },
    {
      id: 'grade1_nonstandard_measurement',
      category: 'grade1' as KnowledgeCategory,
      title: 'Pengukuran Panjang dengan Satuan Tak Baku',
      subtitle: 'Mengukur Meja & Buku Menggunakan Jengkal Tangan dan Langkah Kaki',
      gradeBadge: 'SD Kelas 1 / Cambridge Stage 1',
      icon: '🖐️',
      keyConcept: 'Sebelum belajar sentimeter dan meter, kita dapat mengukur panjang benda menggunakan bagian tubuh kita atau benda-benda kecil di sekitar.',
      steps: [
        '1. Jengkal Tangan: Jarak antara ujung ibu jari dan ujung kelingking saat telapak tangan direntangkan.',
        '2. Hasta: Jarak dari siku tangan sampai ke ujung jari tengah.',
        '3. Depa: Rentangan kedua belah tangan lurus dari ujung jari kiri ke ujung jari kanan.',
        '4. Langkah Kaki: Jarak antara satu langkah kaki saat berjalan santai.',
        '5. Klip Kertas / Korek Api: Mengukur panjang pensil dengan menghitung berapa batang korek api yang berjejer sama panjang.',
      ],
      interactiveType: 'none',
      sampleProblem: 'Panjang buku gambar sama dengan 3 jengkal tangan Siti.',
      relatedGameId: 'weight_conversion_lift',
      relatedTopic: 'pengukuran',
    },
    {
      id: 'grade1_pictogram_charts',
      category: 'grade1' as KnowledgeCategory,
      title: 'Membaca Diagram Gambar Sederhana (Piktogram)',
      subtitle: 'Satu Simbol Gambar Mewakili Satu Benda Nyata',
      gradeBadge: 'SD Kelas 1 / Cambridge Stage 1',
      icon: '📊',
      keyConcept: 'Diagram gambar (piktogram) menyajikan data kumpulan benda menggunakan gambar lucu yang mudah dihitung anak-anak.',
      steps: [
        '1. Perhatikan Keterangan Kunci: Biasanya 1 gambar 🍎 mewakili 1 buah apel.',
        '2. Menghitung Baris: Hitung ada berapa gambar apel pada baris nama setiap anak.',
        '3. Membandingkan: Cari siapa yang memiliki gambar terbanyak atau paling sedikit.',
        '4. Menghitung Total: Jumlahkan seluruh gambar pada diagram untuk mengetahui total benda.',
      ],
      interactiveType: 'none',
      sampleProblem: 'Baris Ani ada 4 apel 🍎🍎🍎🍎, baris Budi ada 2 apel 🍎🍎. Ani punya 2 apel lebih banyak dari Budi.',
      relatedGameId: 'mean_median_mode_detective',
      relatedTopic: 'data',
    },
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
    {
      id: 'magic_nine_finger_trick',
      category: 'mental_math' as KnowledgeCategory,
      title: 'Trik Jari Ajaib Perkalian 9',
      subtitle: 'Menghitung Perkalian 9 dengan 10 Jari Tanpa Menghafal',
      gradeBadge: 'SD Kelas 2 - 4',
      icon: '🖐️',
      keyConcept: 'Cukup tekuk jari ke-N yang dikalikan dengan 9. Jari di sebelah kiri tekukan bernilai puluhan, dan jari di sebelah kanan bernilai satuan!',
      steps: [
        '1. Rentangkan kedua telapak tanganmu di depan wajah (kelingking kiri = 1, jempol kiri = 5, jempol kanan = 6, kelingking kanan = 10).',
        '2. Untuk 9 × 3: Tekuk jari ke-3 (jari tengah tangan kiri).',
        '3. Hitung jari di sebelah kiri tekukan: ada 2 jari berdiri (artinya 2 puluhan = 20).',
        '4. Hitung jari di sebelah kanan tekukan: ada 7 jari berdiri (artinya 7 satuan = 7).',
        '5. Gabungkan kedua nilai: 20 + 7 = 27! Hasil 9 × 3 = 27 secara instan!',
      ],
      interactiveType: 'none',
      sampleProblem: 'Hitung 9 × 7: Tekuk jari ke-7. Di kiri ada 6 jari (60), di kanan ada 3 jari (3). Hasil = 63!',
      relatedGameId: 'multiplication_mastery',
      relatedTopic: 'perkalian',
    },
    {
      id: 'vedic_subtraction_from_1000',
      category: 'mental_math' as KnowledgeCategory,
      title: 'Rahasia Menghitung Cepat 1.000 - ABC',
      subtitle: 'Trik Kilat Vedic: Semua Dari 9, Terakhir Dari 10',
      gradeBadge: 'SD Kelas 3 - 6',
      icon: '⚡',
      keyConcept: 'Tidak perlu meminjam berulang kali saat mengurangkan angka dari 1.000, 10.000, atau 100.000.',
      steps: [
        '1. Rumus Emas: Kurangi digit ratusan dari 9, digit puluhan dari 9, dan digit satuan terakhir dari 10.',
        '2. Contoh 1.000 - 364: Digit pertama = (9 - 3) = 6.',
        '3. Digit kedua = (9 - 6) = 3.',
        '4. Digit ketiga (paling kanan) = (10 - 4) = 6.',
        '5. Gabungkan langsung menjadi jawaban: 636! Selesai dalam 2 detik tanpa coret-coretan!',
      ],
      interactiveType: 'none',
      sampleProblem: 'Hitung cepat 1.000 - 582: (9-5=4), (9-8=1), (10-2=8) -> Jawabannya adalah 418!',
      relatedGameId: 'quick_math',
      relatedTopic: 'pengurangan',
    },
    {
      id: 'calendar_days_months_guide',
      category: 'grade1' as KnowledgeCategory,
      title: 'Mengenal Hari, Pekan, Bulan, & Kalender',
      subtitle: 'Memahami Siklus 7 Hari dan Trik Tulang Sendi Jari Jumlah Hari',
      gradeBadge: 'SD Kelas 1 - 3',
      icon: '📅',
      keyConcept: 'Satu minggu memiliki 7 hari berulang, dan 1 tahun memiliki 12 bulan dengan jumlah hari 30 atau 31 (Februari 28/29).',
      steps: [
        '1. Nama 7 Hari: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu. Hari setelah Minggu adalah Senin kembali.',
        '2. Trik Sendi Tulang Tangan: Kepalkan tangan. Tulang menonjol bernilai 31 hari (Jan, Mar, Mei, Jul, Agu, Okt, Des). Celah lembah bernilai 30 hari (Februari 28/29 hari).',
        '3. Hubungan Waktu: 1 minggu = 7 hari, 1 bulan ≈ 4 minggu, 1 tahun = 12 bulan (365 hari / 366 hari tahun kabisat).',
      ],
      interactiveType: 'none',
      sampleProblem: 'Jika hari ini adalah hari Rabu, hari apakah 3 hari yang akan datang? Rabu -> Kamis (1), Jumat (2), Sabtu (3). Jawabannya: Sabtu!',
      relatedGameId: 'time_duration_bus',
      relatedTopic: 'waktu',
    },
    {
      id: 'spatial_orientation_grid',
      category: 'grade1' as KnowledgeCategory,
      title: 'Orientasi Spasial: Arah, Posisi, & Petak Koordinat',
      subtitle: 'Kiri, Kanan, Depan, Belakang, dan Membaca Peta Petak',
      gradeBadge: 'SD Kelas 1 - 2 / Stage 1',
      icon: '🧭',
      keyConcept: 'Memahami arah relatif dari sudut pandang kita sangat penting untuk bernavigasi dan mengenal geometri ruang.',
      steps: [
        '1. Tangan Kanan & Kiri: Tangan kanan adalah tangan yang biasa kita gunakan untuk bersalaman dan makan sopan.',
        '2. Atas & Bawah: Atas mengarah ke langit/kepala, bawah mengarah ke lantai/tanah.',
        '3. Petak Labirin: Melangkah di atas petak kotak dapat diuraikan menjadi beberapa langkah geser ke samping (kiri/kanan) lalu maju/mundur.',
      ],
      interactiveType: 'none',
      sampleProblem: 'Robot di petak (1,1) ingin ke petak (1,3). Robot harus melangkah 2 kotak ke arah KANAN.',
      relatedGameId: 'robot_spatial_maze',
      relatedTopic: 'geometri',
    },
    {
      id: 'balance_scale_weight_concept',
      category: 'grade1' as KnowledgeCategory,
      title: 'Konsep Timbangan Dua Lengan (Ringan vs Berat)',
      subtitle: 'Memahami Berat Benda & Keseimbangan Aljabar Sederhana',
      gradeBadge: 'SD Kelas 1 - 3',
      icon: '⚖️',
      keyConcept: 'Mangkuk timbangan yang turun berarti LEBIH BERAT. Mangkuk yang terangkat berarti LEBIH RINGAN. Posisi datar berarti SAMA BERAT.',
      steps: [
        '1. Lebih Berat: Gravitasi menarik benda berbobot lebih besar ke bawah.',
        '2. Lebih Ringan: Beban yang lebih enteng akan terangkat ke atas.',
        '3. Seimbang: Jika timbangan sejajar lurus, artinya berat di sisi kiri sama persis dengan berat di sisi kanan.',
      ],
      interactiveType: 'none',
      sampleProblem: '1 Semangka membuat timbangan seimbang dengan 4 Jeruk. Berapakah jeruk yang sama beratnya dengan 2 Semangka? 4 × 2 = 8 Jeruk!',
      relatedGameId: 'star_balance_compare',
      relatedTopic: 'pengukuran',
    },
    {
      id: 'simple_fractions_real_world',
      category: 'fractions' as KnowledgeCategory,
      title: 'Pecahan Sederhana: Membagi Adil (1/2, 1/3, 1/4)',
      subtitle: 'Pembilang (Bagian Diambil) dan Penyebut (Total Seluruh Potongan)',
      gradeBadge: 'SD Kelas 1 - 3',
      icon: '🍕',
      keyConcept: 'Pecahan melambangkan bagian dari satu kesatuan utuh yang dipotong sama besar. Pembagian harus adil agar ukurannya tepat.',
      steps: [
        '1. Pembilang (angka atas): Menunjukkan berapa banyak potongan yang kita ambil atau arsir.',
        '2. Penyebut (angka bawah): Menunjukkan berapa total potongan yang ada saat satu benda utuh dipotong sama rata.',
        '3. 1/2 (Setengah): Benda dipotong menjadi 2 bagian sama besar, kita mengambil 1 bagian.',
        '4. 1/4 (Seperempat): Benda dipotong menjadi 4 bagian sama besar, kita mengambil 1 bagian. 2/4 nilainya sama dengan 1/2!',
      ],
      interactiveType: 'none',
      sampleProblem: 'Ibu memotong 1 kue bolu menjadi 4 potong sama besar. Budi memakan 3 potong. Pecahan kue yang dimakan Budi adalah 3/4 bagian.',
      relatedGameId: 'pizza_fraction_party',
      relatedTopic: 'pecahan',
    },
    {
      id: 'temperature_celsius_scale',
      category: 'measurement' as KnowledgeCategory,
      title: 'Skala Suhu Celcius (°C) & Fenomena Nyata',
      subtitle: 'Memahami Titik Beku Es 0°C, Suhu Tubuh 37°C, dan Air Mendidih 100°C',
      gradeBadge: 'SD Kelas 1 - 4',
      icon: '🌡️',
      keyConcept: 'Suhu mengukur derajat panas atau dinginnya suatu benda dalam satuan derajat Celcius (°C). Termometer bekerja memanfaatkan pemuaian cairan raksa atau alkohol.',
      steps: [
        '1. 0°C (Titik Beku): Air murni berubah membeku menjadi es batu padat.',
        '2. 20°C - 25°C (Suhu Ruangan): Suhu sejuk dan nyaman saat berada di dalam rumah atau kelas.',
        '3. 36°C - 37°C (Suhu Tubuh Manusia): Tubuh anak sehat normal berada pada rentang ini. Jika mencapai 38°C ke atas, tubuh sedang demam.',
        '4. 100°C (Titik Didih): Air mendidih bergolak di atas kompor dan berubah menjadi uap air.',
      ],
      interactiveType: 'none',
      sampleProblem: 'Rina mengukur es teh manis di gelas yang penuh es batu. Jarum termometer kemungkinan besar menunjukkan suhu sekitar 0°C - 4°C.',
      relatedGameId: 'thermometer_weather_lab',
      relatedTopic: 'pengukuran',
    },
    {
      id: 'commutative_associative_laws',
      category: 'algebra' as KnowledgeCategory,
      title: 'Sifat Komutatif (Tukar) & Asosiatif (Kelompok)',
      subtitle: 'Mempermudah Perhitungan Cepat Tanpa Mengubah Hasil Akhir',
      gradeBadge: 'SD Kelas 2 - 5',
      icon: '🔄',
      keyConcept: 'Pada penjumlahan dan perkalian, membalik urutan angka (komutatif) atau mengelompokkan angka terlebih dahulu (asosiatif) tidak akan mengubah hasil jawaban.',
      steps: [
        '1. Komutatif Penjumlahan: a + b = b + a (Contoh: 17 + 8 = 8 + 17 = 25).',
        '2. Komutatif Perkalian: a × b = b × a (Contoh: 4 × 9 = 9 × 4 = 36). Menghafal tabel perkalian jadi 50% lebih ringan!',
        '3. Asosiatif: (a + b) + c = a + (b + c). Contoh: 25 + 38 + 75. Kelompokkan (25 + 75) = 100 dulu, lalu + 38 = 138 instan!',
      ],
      interactiveType: 'none',
      sampleProblem: 'Hitung cepat 4 × 19 × 25: Tukar urutan menjadi (4 × 25) × 19 = 100 × 19 = 1.900!',
      relatedGameId: 'mental_addition_race',
      relatedTopic: 'aljabar',
    },
    {
      id: 'bar_charts_and_pictograms',
      category: 'data' as KnowledgeCategory,
      title: 'Membaca Diagram Batang & Piktogram Simbol',
      subtitle: 'Visualisasi Data Statistik Sederhana untuk Pengambilan Keputusan',
      gradeBadge: 'SD Kelas 1 - 4',
      icon: '📊',
      keyConcept: 'Diagram batang menyajikan data dalam bentuk balok tegak atau mendatar, sedangkan piktogram menyajikan data menggunakan gambar atau ikon representasi.',
      steps: [
        '1. Sumbu Horizontal & Vertikal: Sumbu bawah biasanya menunjukkan nama kategori, dan sumbu tegak menunjukkan angka frekuensi/jumlah.',
        '2. Skala Angka: Perhatikan apakah setiap garis naik 1, 2, 5, atau 10 angka.',
        '3. Kunci Simbol Piktogram: Selalu periksa keterangan di pojok diagram (contoh: 1 gambar 🍎 = 5 buah apel asli).',
      ],
      interactiveType: 'none',
      sampleProblem: 'Jika 1 bintang melambangkan 10 siswa yang gemar matematika, maka 3 bintang melambangkan 3 × 10 = 30 siswa.',
      relatedGameId: 'carroll_diagram',
      relatedTopic: 'statistika',
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

          {/* PLAYGROUND 3: KELAS 1 TEN-FRAME & TEMAN 10 SIMULATOR */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
                  🔟
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Laboratorium Kotak Sepuluh (Ten-Frame) & Teman 10
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    Eksplorasi visual pasangan bilangan menuju 10 untuk Kelas 1 SD
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  handleSpeak(
                    `Teman sepuluh. Angka ${tenFrameCount} ditambah ${
                      10 - tenFrameCount
                    } sama dengan 10. Pasangan dari ${tenFrameCount} adalah ${10 - tenFrameCount}.`
                  )
                }
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Dengarkan Suara"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Tap Number Selector 1 to 9 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-slate-600">
                <span>Pilih Jumlah Apel Merah (1 - 9):</span>
                <span className="text-amber-700 font-black text-sm">{tenFrameCount} Apel</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button
                    key={n}
                    onClick={() => setTenFrameCount(n)}
                    className={`flex-1 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      tenFrameCount === n
                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                        : 'bg-slate-100 hover:bg-amber-50 text-slate-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual 10-Frame (2 rows x 5 cols) */}
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="grid grid-cols-5 gap-2 w-full max-w-sm">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const isRed = idx < tenFrameCount;
                  return (
                    <div
                      key={idx}
                      className={`h-12 rounded-xl flex items-center justify-center text-xl font-black border-2 transition-all ${
                        isRed
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                          : 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                      }`}
                    >
                      {isRed ? '🍎' : '🍏'}
                    </div>
                  );
                })}
              </div>

              {/* Equation Result */}
              <div className="text-center sm:text-right space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-slate-800">
                  <span className="text-rose-600">{tenFrameCount}</span>
                  {' + '}
                  <span className="text-emerald-600">{10 - tenFrameCount}</span>
                  {' = '}
                  <span className="text-amber-600 bg-white px-2.5 py-0.5 rounded-xl border border-amber-300 shadow-xs">
                    10
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-600">
                  Teman 10 dari <span className="text-rose-600 font-black">{tenFrameCount}</span> adalah{' '}
                  <span className="text-emerald-600 font-black">{10 - tenFrameCount}</span>!
                </p>
                <div className="text-[11px] text-slate-500">
                  {tenFrameCount} Apel Merah 🍎 + {10 - tenFrameCount} Apel Hijau 🍏 = 10 Apel Penuh
                </div>
              </div>
            </div>
          </div>

          {/* PLAYGROUND 4: LABORATORIUM JAM ANALOG & DIGITAL INTERAKTIF */}
          <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                  ⏰
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Laboratorium Jam Analog & Digital</h3>
                  <p className="text-xs text-slate-500 font-bold">Membaca jarum jam dan menit secara visual</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const minStr = clockMinute === 0 ? 'tepat' : clockMinute === 30 ? 'setengah ' + ((clockHour % 12) + 1) : `lewat ${clockMinute} menit`;
                  handleSpeak(`Pukul ${clockHour} ${minStr}. Jarum pendek di angka ${clockHour}, jarum panjang di menit ${clockMinute}.`);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Dengarkan Suara Jam"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Analog Clock & Digital Readout Layout */}
            <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 flex flex-col sm:flex-row items-center justify-around gap-4">
              {/* SVG Clock */}
              <div className="relative">
                <svg className="w-36 h-36 drop-shadow-sm" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="#ffffff" stroke="#9333ea" strokeWidth="6" />
                  {/* Clock numbers */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                    const angle = (num * 30 - 90) * (Math.PI / 180);
                    const x = 100 + 68 * Math.cos(angle);
                    const y = 100 + 68 * Math.sin(angle) + 5;
                    return (
                      <text key={num} x={x} y={y} textAnchor="middle" className="font-black text-[14px] fill-slate-700 select-none">
                        {num}
                      </text>
                    );
                  })}
                  {/* Center Dot */}
                  <circle cx="100" cy="100" r="6" fill="#6b21a8" />
                  {/* Hour Hand */}
                  {(() => {
                    const hAngle = ((clockHour % 12) * 30 + (clockMinute / 60) * 30 - 90) * (Math.PI / 180);
                    const hx = 100 + 45 * Math.cos(hAngle);
                    const hy = 100 + 45 * Math.sin(hAngle);
                    return <line x1="100" y1="100" x2={hx} y2={hy} stroke="#6b21a8" strokeWidth="6" strokeLinecap="round" />;
                  })()}
                  {/* Minute Hand */}
                  {(() => {
                    const mAngle = (clockMinute * 6 - 90) * (Math.PI / 180);
                    const mx = 100 + 68 * Math.cos(mAngle);
                    const my = 100 + 68 * Math.sin(mAngle);
                    return <line x1="100" y1="100" x2={mx} y2={my} stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />;
                  })()}
                </svg>
              </div>

              {/* Digital & Spoken Info */}
              <div className="text-center sm:text-left space-y-2">
                <div className="bg-slate-900 text-emerald-400 font-mono text-2xl font-black px-4 py-2 rounded-xl inline-block shadow-inner">
                  {String(clockHour).padStart(2, '0')}:{String(clockMinute).padStart(2, '0')}
                </div>
                <div className="text-xs font-bold text-purple-900">
                  {clockMinute === 0 && `Pukul ${clockHour}.00 Tepat`}
                  {clockMinute === 30 && `Pukul Setengah ${clockHour === 12 ? 1 : clockHour + 1}`}
                  {clockMinute === 15 && `Pukul ${clockHour} Lewat Seperempat (15 menit)`}
                  {clockMinute === 45 && `Pukul ${clockHour} Lewat 45 Menit`}
                </div>
                <div className="text-[11px] text-slate-500">
                  🟣 Jarum Pendek: <span className="font-bold text-purple-700">Jam {clockHour}</span><br />
                  🌸 Jarum Panjang: <span className="font-bold text-pink-600">Menit {clockMinute}</span>
                </div>
              </div>
            </div>

            {/* Controls for Hour & Minute */}
            <div className="space-y-2 text-xs font-bold">
              <div className="flex items-center justify-between text-slate-600">
                <span>Pilih Jam (1 - 12):</span>
                <span className="text-purple-700 font-black">{clockHour}</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={clockHour}
                onChange={(e) => setClockHour(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-slate-500 mr-1">Menit:</span>
                {[0, 15, 30, 45].map((m) => (
                  <button
                    key={m}
                    onClick={() => setClockMinute(m)}
                    className={`flex-1 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      clockMinute === m
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-purple-50 text-slate-700'
                    }`}
                  >
                    :{String(m).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PLAYGROUND 5: KASIR & DOMPET KOIN RUPIAH */}
          <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                  🪙
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Kasir & Dompet Koin Rupiah</h3>
                  <p className="text-xs text-slate-500 font-bold">Simulasi menghitung kombinasi uang koin</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const total = cashierCoins.reduce((a, b) => a + b, 0);
                  handleSpeak(`Total uang di kasir koin adalah Rp ${total.toLocaleString('id-ID')}. Terdiri dari ${cashierCoins.length} keping koin.`);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Dengarkan Total Uang"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Total Balance Card */}
            {(() => {
              const totalMoney = cashierCoins.reduce((a, b) => a + b, 0);
              return (
                <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 text-center space-y-2">
                  <div className="text-xs font-bold text-emerald-800">
                    Total Koin Terkumpul:
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-950 flex items-center justify-center gap-1.5">
                    <span>Rp</span>
                    <span className="bg-white px-3 py-0.5 rounded-xl shadow-xs border border-emerald-300">
                      {totalMoney.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">
                    {totalMoney >= 4000
                      ? '🛒 Bisa membeli Buku Tulis & Pensil Warna! 📓'
                      : totalMoney >= 2000
                      ? '🧃 Bisa membeli Susu Kotak Stroberi! 🍓'
                      : totalMoney >= 1000
                      ? '🍫 Bisa membeli Kue Coklat Lezat!'
                      : totalMoney >= 500
                      ? '🍭 Bisa membeli Permen Lolipop Ceria!'
                      : 'Kumpulkan koin lagi untuk membeli jajanan!'}
                  </div>
                </div>
              );
            })()}

            {/* Tap to Add Coins */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Ketuk untuk Tambah Koin:</span>
                <button
                  onClick={() => setCashierCoins([])}
                  className="text-rose-600 hover:text-rose-700 text-[11px] font-bold cursor-pointer"
                >
                  Kosongkan 🔄
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[100, 200, 500, 1000].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      sound.playCoin();
                      setCashierCoins((prev) => [...prev, val]);
                    }}
                    className="py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 font-black text-xs text-amber-900 shadow-xs cursor-pointer active:scale-95 flex flex-col items-center"
                  >
                    <span>+Rp</span>
                    <span>{val}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Coin Tray (Display of coins) */}
            <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200 flex flex-wrap items-center gap-1.5 min-h-[44px] max-h-24 overflow-y-auto">
              {cashierCoins.length === 0 ? (
                <span className="text-xs text-slate-400 italic mx-auto">
                  Dompet kosong. Ketuk tombol koin di atas untuk mengisi!
                </span>
              ) : (
                cashierCoins.map((val, idx) => (
                  <span
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setCashierCoins((prev) => prev.filter((_, i) => i !== idx));
                    }}
                    className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[11px] border border-amber-600 cursor-pointer hover:bg-rose-400 hover:text-white transition-all"
                    title="Ketuk untuk membuang koin ini"
                  >
                    Rp {val} ✕
                  </span>
                ))
              )}
            </div>
          </div>

          {/* PLAYGROUND 6: EKSPLORASI BANGUN DATAR 2D */}
          <div className="bg-white rounded-3xl p-5 border-2 border-sky-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-sm">
                  🔷
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Eksplorasi Bangun Datar 2D</h3>
                  <p className="text-xs text-slate-500 font-bold">Identifikasi sisi, titik sudut, dan sifatnya</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const shapeNames: Record<string, string> = {
                    segitiga: 'Segitiga memiliki 3 sisi dan 3 titik sudut.',
                    persegi: 'Persegi memiliki 4 sisi sama panjang dan 4 sudut siku-siku.',
                    persegi_panjang: 'Persegi panjang memiliki 4 sisi dengan 2 pasang sisi sejajar sama panjang.',
                    lingkaran: 'Lingkaran memiliki 1 sisi lengkung dan tidak memiliki titik sudut.',
                  };
                  handleSpeak(shapeNames[selectedShape]);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Dengarkan Sifat Bangun"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Shape Buttons */}
            <div className="grid grid-cols-4 gap-1.5 text-xs font-black">
              {[
                { id: 'segitiga', label: 'Segitiga 🔺' },
                { id: 'persegi', label: 'Persegi ⏹️' },
                { id: 'persegi_panjang', label: 'P. Panjang 🔲' },
                { id: 'lingkaran', label: 'Lingkaran ⭕' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedShape(s.id as any);
                  }}
                  className={`py-1.5 px-2 rounded-xl border transition-all cursor-pointer text-center truncate ${
                    selectedShape === s.id
                      ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                      : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* SVG Visual & Properties Display */}
            <div className="bg-sky-50/70 rounded-2xl p-4 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-28 h-28 flex items-center justify-center bg-white rounded-2xl border border-sky-100 shadow-xs">
                {selectedShape === 'segitiga' && (
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <polygon points="50,15 15,85 85,85" fill="#bae6fd" stroke="#0284c7" strokeWidth="4" />
                    <circle cx="50" cy="15" r="4" fill="#ef4444" />
                    <circle cx="15" cy="85" r="4" fill="#ef4444" />
                    <circle cx="85" cy="85" r="4" fill="#ef4444" />
                  </svg>
                )}
                {selectedShape === 'persegi' && (
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <rect x="20" y="20" width="60" height="60" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="4" />
                    <circle cx="20" cy="20" r="4" fill="#ef4444" />
                    <circle cx="80" cy="20" r="4" fill="#ef4444" />
                    <circle cx="80" cy="80" r="4" fill="#ef4444" />
                    <circle cx="20" cy="80" r="4" fill="#ef4444" />
                  </svg>
                )}
                {selectedShape === 'persegi_panjang' && (
                  <svg className="w-24 h-16" viewBox="0 0 120 80">
                    <rect x="15" y="15" width="90" height="50" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="4" />
                    <circle cx="15" cy="15" r="4" fill="#ef4444" />
                    <circle cx="105" cy="15" r="4" fill="#ef4444" />
                    <circle cx="105" cy="65" r="4" fill="#ef4444" />
                    <circle cx="15" cy="65" r="4" fill="#ef4444" />
                  </svg>
                )}
                {selectedShape === 'lingkaran' && (
                  <svg className="w-20 h-20" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="#bae6fd" stroke="#0284c7" strokeWidth="4" />
                    <circle cx="50" cy="50" r="3" fill="#0284c7" />
                  </svg>
                )}
              </div>

              {/* Specs Table */}
              <div className="text-left space-y-1 text-xs text-slate-700 flex-1">
                {selectedShape === 'segitiga' && (
                  <>
                    <div className="font-black text-sky-950 text-sm">Segitiga (Triangle)</div>
                    <div>📐 Jumlah Sisi: <span className="font-black text-sky-700">3 Sisi Lurus</span></div>
                    <div>🔴 Titik Sudut: <span className="font-black text-rose-600">3 Titik Sudut</span></div>
                    <div>🏠 Contoh Nyata: Atap rumah, potongan pizza, rambu lalu lintas</div>
                  </>
                )}
                {selectedShape === 'persegi' && (
                  <>
                    <div className="font-black text-sky-950 text-sm">Persegi (Square)</div>
                    <div>📐 Jumlah Sisi: <span className="font-black text-sky-700">4 Sisi Sama Panjang</span></div>
                    <div>🔴 Titik Sudut: <span className="font-black text-rose-600">4 Sudut Siku-siku (90°)</span></div>
                    <div>🏠 Contoh Nyata: Ubin lantai, papan catur, jendela persegi</div>
                  </>
                )}
                {selectedShape === 'persegi_panjang' && (
                  <>
                    <div className="font-black text-sky-950 text-sm">Persegi Panjang (Rectangle)</div>
                    <div>📐 Jumlah Sisi: <span className="font-black text-sky-700">4 Sisi (2 Panjang & 2 Lebar)</span></div>
                    <div>🔴 Titik Sudut: <span className="font-black text-rose-600">4 Sudut Siku-siku (90°)</span></div>
                    <div>🏠 Contoh Nyata: Pintu kamar, buku tulis, layar televisi</div>
                  </>
                )}
                {selectedShape === 'lingkaran' && (
                  <>
                    <div className="font-black text-sky-950 text-sm">Lingkaran (Circle)</div>
                    <div>📐 Jumlah Sisi: <span className="font-black text-sky-700">1 Sisi Lengkung</span></div>
                    <div>🔴 Titik Sudut: <span className="font-black text-rose-600">0 (Tidak Memiliki Sudut)</span></div>
                    <div>🏠 Contoh Nyata: Roda sepeda, koin rupiah, jam dinding bundar</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* PLAYGROUND 7: TRIK VEDIC PENGURANGAN 1.000 KILAT */}
          <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-sm">
                  ⚡
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Trik Kilat Pengurangan 1.000 - ABC</h3>
                  <p className="text-xs text-slate-500 font-bold">Semua dari 9, angka terakhir dari 10 (Vedic Math)</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const r = 1000 - sub1000Num;
                  handleSpeak(`Seribu dikurang ${sub1000Num} sama dengan ${r}. Caranya: digit pertama sembilan kurang ${Math.floor(sub1000Num/100)}, digit kedua sembilan kurang ${Math.floor((sub1000Num%100)/10)}, dan digit terakhir sepuluh kurang ${sub1000Num%10}.`);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Dengarkan Trik"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Pilih Angka Pengurang (100 - 899):</span>
                <span className="text-rose-600 font-black text-sm">{sub1000Num}</span>
              </div>
              <input
                type="range"
                min="101"
                max="899"
                value={sub1000Num}
                onChange={(e) => setSub1000Num(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Step-by-step Vedic Display */}
            {(() => {
              const c1 = Math.floor(sub1000Num / 100);
              const c2 = Math.floor((sub1000Num % 100) / 10);
              const c3 = sub1000Num % 10;
              const a1 = 9 - c1;
              const a2 = 9 - c2;
              const a3 = 10 - c3;
              const finalAns = 1000 - sub1000Num;

              return (
                <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200 text-center space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs font-black text-rose-950">
                    <div className="bg-white p-2 rounded-xl border border-rose-200 shadow-2xs">
                      (9 - {c1}) = <span className="text-rose-600">{a1}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-rose-200 shadow-2xs">
                      (9 - {c2}) = <span className="text-rose-600">{a2}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-rose-200 shadow-2xs">
                      (10 - {c3}) = <span className="text-rose-600">{a3}</span>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center justify-center gap-2 pt-1">
                    <span>1.000 - {sub1000Num} =</span>
                    <span className="text-emerald-600 bg-white px-3 py-1 rounded-xl shadow-xs border border-emerald-300 animate-pulse">
                      {finalAns}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* PLAYGROUND 8: MATRIKS KISI PERKALIAN ARRAY */}
          <div className="bg-white rounded-3xl p-5 border-2 border-indigo-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                  ✨
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Matriks Kisi Perkalian Array</h3>
                  <p className="text-xs text-slate-500 font-bold">Membuktikan baris × kolom dan sifat komutatif</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleSpeak(`${arrayRows} baris dikali ${arrayCols} kolom sama dengan ${arrayRows * arrayCols}. Nilai ini sama persis dengan ${arrayCols} dikali ${arrayRows}.`);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Dengarkan Penjelasan Matriks"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Sliders for Rows & Columns */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Jumlah Baris (↕):</span>
                  <span className="text-indigo-700 font-black">{arrayRows}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={arrayRows}
                  onChange={(e) => setArrayRows(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Jumlah Kolom (↔):</span>
                  <span className="text-indigo-700 font-black">{arrayCols}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={arrayCols}
                  onChange={(e) => setArrayCols(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Dot Array Visual Box */}
            <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-200 flex flex-col items-center justify-center gap-3 overflow-x-auto">
              <div
                className="grid gap-1.5 p-2 bg-white rounded-xl shadow-xs border border-indigo-100"
                style={{
                  gridTemplateColumns: `repeat(${arrayCols}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: arrayRows * arrayCols }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-xs flex items-center justify-center text-[10px] text-white font-bold animate-in zoom-in-75 duration-150"
                  >
                    ★
                  </div>
                ))}
              </div>

              {/* Math Equation & Commutative Law */}
              <div className="text-center space-y-1">
                <div className="text-base sm:text-lg font-black text-indigo-950">
                  {arrayRows} × {arrayCols} = <span className="text-emerald-600 font-extrabold">{arrayRows * arrayCols}</span>
                </div>
                <div className="text-[11px] font-bold text-slate-500">
                  🔄 Sifat Komutatif: {arrayRows} × {arrayCols} = {arrayCols} × {arrayRows} = {arrayRows * arrayCols}
                </div>
              </div>
            </div>
          </div>

          {/* PLAYGROUND 9: SIMULATOR SKALA TERMOMETER CELCIUS */}
          <div className="bg-white rounded-3xl p-5 border-2 border-teal-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black text-sm">
                  🌡️
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Simulator Skala Suhu Celcius (°C)</h3>
                  <p className="text-xs text-slate-500 font-bold">Mengamati pemuaian zat cair & efek suhu nyata</p>
                </div>
              </div>
              <button
                onClick={() => {
                  let condition = 'sejuk nyaman';
                  if (labTemp <= 0) condition = 'sangat dingin membeku';
                  else if (labTemp <= 18) condition = 'dingin pegunungan';
                  else if (labTemp <= 28) condition = 'sejuk nyaman suhu ruangan';
                  else if (labTemp <= 38) condition = 'hangat dan mendekati suhu tubuh manusia';
                  else condition = 'sangat panas mendekati titik didih air';
                  handleSpeak(`Suhu ${labTemp} derajat Celcius. Kondisinya ${condition}.`);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Dengarkan Suhu"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Geser Pengukur Suhu (-5°C s.d. 105°C):</span>
                <span className="text-teal-700 font-black text-base font-mono">{labTemp}°C</span>
              </div>
              <input
                type="range"
                min="-5"
                max="105"
                value={labTemp}
                onChange={(e) => setLabTemp(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Visual Glass Thermometer & Context Card */}
            <div className="bg-teal-50/70 rounded-2xl p-4 border border-teal-200 flex flex-col sm:flex-row items-center justify-around gap-4">
              {/* Thermometer Tube */}
              <div className="relative w-9 h-36 bg-slate-100 rounded-full border-2 border-slate-300 p-1 flex flex-col justify-end items-center shadow-inner">
                <div
                  style={{
                    height: `${Math.max(8, Math.min(94, ((labTemp + 5) / 110) * 86 + 8))}%`,
                  }}
                  className={`w-4 rounded-full transition-all duration-300 shadow-sm ${
                    labTemp <= 0
                      ? 'bg-sky-500'
                      : labTemp <= 25
                      ? 'bg-teal-500'
                      : labTemp <= 38
                      ? 'bg-amber-500'
                      : 'bg-rose-600'
                  }`}
                />
                <div
                  className={`w-6 h-6 rounded-full absolute -bottom-1 shadow-md border-2 ${
                    labTemp <= 0
                      ? 'bg-sky-500 border-sky-600'
                      : labTemp <= 25
                      ? 'bg-teal-500 border-teal-600'
                      : labTemp <= 38
                      ? 'bg-amber-500 border-amber-600'
                      : 'bg-rose-600 border-rose-700'
                  }`}
                />
              </div>

              {/* Status Explanation Card */}
              <div className="text-center sm:text-left space-y-1.5 flex-1">
                {labTemp <= 0 ? (
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-black text-xs inline-block">
                      🧊 Titik Beku / Di Bawah Nol
                    </span>
                    <div className="text-xs text-slate-700 font-bold">
                      Air membeku menjadi es batu! Gunakan jaket tebal, sarung tangan, dan penutup telinga. ⛄
                    </div>
                  </div>
                ) : labTemp <= 18 ? (
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-black text-xs inline-block">
                      🧥 Udara Dingin Sejuk
                    </span>
                    <div className="text-xs text-slate-700 font-bold">
                      Suhu khas daerah puncak pegunungan di pagi hari. Nyaman memakai sweater hangat.
                    </div>
                  </div>
                ) : labTemp <= 27 ? (
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-black text-xs inline-block">
                      🛋️ Suhu Ruangan Nyaman
                    </span>
                    <div className="text-xs text-slate-700 font-bold">
                      Suhu ideal untuk belajar di kelas atau kamar tidur dengan AC sejuk. Pakaian santai.
                    </div>
                  </div>
                ) : labTemp <= 38 ? (
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-black text-xs inline-block">
                      🩺 Suhu Tubuh / Terik Pantai
                    </span>
                    <div className="text-xs text-slate-700 font-bold">
                      Suhu tubuh manusia normal berada di kisaran 36.5°C - 37.2°C. Cuaca cerah di pantai!
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-xs inline-block">
                      🔥 Sangat Panas / Mendidih
                    </span>
                    <div className="text-xs text-slate-700 font-bold">
                      Air mendidih mengeluarkan uap panas pada 100°C. Jangan disentuh tanpa pelindung tangan!
                    </div>
                  </div>
                )}

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold">Pintasan Cepat:</span>
                  {[
                    { label: '0°C (Es)', temp: 0 },
                    { label: '25°C (Kamar)', temp: 25 },
                    { label: '37°C (Tubuh)', temp: 37 },
                    { label: '100°C (Didih)', temp: 100 },
                  ].map((p) => (
                    <button
                      key={p.temp}
                      onClick={() => setLabTemp(p.temp)}
                      className="px-2 py-0.5 rounded-lg bg-white border border-teal-200 hover:bg-teal-100 text-[11px] font-black text-teal-900 cursor-pointer shadow-2xs"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
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
