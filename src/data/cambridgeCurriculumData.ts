import {
  PrimaryStage,
  MathDomain,
  TWMStrand,
  QuestionCognitiveType,
  ThinkingQuestionType,
  QuestionItem,
  DiagnosticAssessment,
} from '../types';

export interface StageInfo {
  stage: PrimaryStage;
  name: string;
  subtitle: string;
  approxAge: string;
  gradeEquivalent: string;
  phaseId: 'fondasi' | 'fase_a' | 'fase_b' | 'fase_c';
  focus: string;
  icon: string;
  color: string;
}

export const PRIMARY_STAGES: StageInfo[] = [
  {
    stage: 1,
    name: 'Stage 1: Foundation',
    subtitle: 'Mengenal Bilangan & Bentuk Dasar',
    approxAge: '~5 Tahun (PAUD/TK)',
    gradeEquivalent: 'PAUD/TK & Transisi SD',
    phaseId: 'fondasi',
    focus: 'Number sense, visual counting, ten-frames, comparing quantities, 2D/3D shapes, simple spatial patterns.',
    icon: '🌱',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    stage: 2,
    name: 'Stage 2: Building Fluency',
    subtitle: 'Kefasihan Berhitung & Pola Hubungan',
    approxAge: '~6-7 Tahun (SD Kelas 1)',
    gradeEquivalent: 'SD Kelas 1',
    phaseId: 'fase_a',
    focus: 'Place value to 100, number bonds, addition & subtraction strategies, simple arrays, measurement in non-standard/standard units.',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    stage: 3,
    name: 'Stage 3: Developing Strategies',
    subtitle: 'Strategi Mental & Pengenalan Pecahan',
    approxAge: '~7-8 Tahun (SD Kelas 2)',
    gradeEquivalent: 'SD Kelas 2',
    phaseId: 'fase_a',
    focus: 'Mental math strategies, multiplication as arrays/groups, division as sharing, unit fractions (1/2, 1/4), bar models, pictograms & tables.',
    icon: '🧠',
    color: 'from-amber-500 to-orange-600',
  },
  {
    stage: 4,
    name: 'Stage 4: Deepening Understanding',
    subtitle: 'Pemahaman Mendalam & Penalaran',
    approxAge: '~8-9 Tahun (SD Kelas 3)',
    gradeEquivalent: 'SD Kelas 3',
    phaseId: 'fase_b',
    focus: 'Place value to 10,000, equivalent fractions, multi-digit operations, perimeter & area, 24h clock, bar charts, multi-step problem solving.',
    icon: '🔍',
    color: 'from-violet-500 to-purple-600',
  },
  {
    stage: 5,
    name: 'Stage 5: Reasoning & Connections',
    subtitle: 'Penalaran Matematis & Hubungan Konsep',
    approxAge: '~9-10 Tahun (SD Kelas 4 & 5)',
    gradeEquivalent: 'SD Kelas 4 - 5',
    phaseId: 'fase_b',
    focus: 'Fractions to decimals, percentages, prime & composite, angles, coordinates, line graphs, probability chance scale, algebraic thinking.',
    icon: '🌐',
    color: 'from-pink-500 to-rose-600',
  },
  {
    stage: 6,
    name: 'Stage 6: Advanced Primary Thinking',
    subtitle: 'Pemecahan Masalah Tingkat Lanjut',
    approxAge: '~10-11 Tahun (SD Kelas 6)',
    gradeEquivalent: 'SD Kelas 6',
    phaseId: 'fase_c',
    focus: 'Ratio & proportion, complex multi-step real world quests, algebraic expressions, circle properties, mean/median/mode, multi-strategy synthesis.',
    icon: '👑',
    color: 'from-indigo-600 to-violet-700',
  },
];

export const MATH_DOMAINS: { id: MathDomain; title: string; englishTitle: string; icon: string; description: string }[] = [
  {
    id: 'number',
    title: 'Bilangan & Operasi',
    englishTitle: 'Number',
    icon: '🔢',
    description: 'Counting, place value, estimation, operations, fractions, decimals, percentages, and ratio.',
  },
  {
    id: 'geometry_measure',
    title: 'Geometri & Pengukuran',
    englishTitle: 'Geometry & Measure',
    icon: '📐',
    description: '2D/3D shapes, angles, symmetry, position, perimeter, area, volume, time, mass, and capacity.',
  },
  {
    id: 'statistics_probability',
    title: 'Statistika & Peluang',
    englishTitle: 'Statistics & Probability',
    icon: '📊',
    description: 'Data collection, pictograms, bar charts, line graphs, interpretation, and chance events.',
  },
];

// Rich Cambridge-Inspired Thinking Questions Bank
export const THINKING_QUESTIONS_BANK: QuestionItem[] = [
  // ==================== STAGE 1: FOUNDATION ====================
  {
    id: 'thk_s1_wodb_1',
    stage: 1,
    domain: 'number',
    cognitiveType: 'reasoning',
    thinkingType: 'which_one_doesnt_belong',
    phase: 'fondasi',
    grade: 'Stage 1 (PAUD/TK)',
    topicId: 'st1_number_sense',
    topicTitle: 'Number Sense & Comparison',
    competency: 'Mengidentifikasi karakteristik bilangan dari berbagai perspektif',
    difficulty: 1,
    question: 'Manakah angka yang TIDAK COCOK dengan yang lain? (Which one does not belong?)',
    englishQuestion: 'Which number does NOT belong with the others?',
    contextStory: 'Kafa melihat 4 kartu angka di atas meja. Setiap angka memiliki alasan unik tersendiri!',
    options: ['3', '6', '9', '10'],
    correctAnswer: '10',
    acceptedAnswers: ['3', '6', '9', '10'], // In WODB any valid justification is accepted!
    wodbItems: [
      { id: '3', label: 'Angka 3', value: '3', reason: 'Satu-satunya angka yang hanya tersusun dari garis lengkung sederhana / kelipatan ganjil terkecil.' },
      { id: '6', label: 'Angka 6', value: '6', reason: 'Satu-satunya angka genap satu digit di kelompok ini.' },
      { id: '9', label: 'Angka 9', value: '9', reason: 'Satu-satunya angka satu digit yang merupakan kuadrat (3 × 3).' },
      { id: '10', label: 'Angka 10', value: '10', reason: 'Satu-satunya angka DUA DIGIT (puluhan), sedangkan yang lain satu digit!' },
    ],
    reasoningOptions: [
      'Karena 10 adalah bilangan dua digit (puluhan), sedangkan yang lain satu digit!',
      'Karena 6 adalah satu-satunya bilangan genap 1-digit.',
      'Karena 10 bukan kelipatan 3.',
      'Karena 3 adalah angka terkecil.',
    ],
    explanation: 'Dalam matematika "Which One Doesn\'t Belong?", setiap pilihan bisa benar jika kamu punya alasan logis! Paling populer adalah 10 karena satu-satunya angka dua digit.',
    englishExplanation: 'In "Which One Doesn\'t Belong?", every answer can be valid with clear mathematical justification! 10 is special because it is the only 2-digit number.',
    hint1: 'Perhatikan jumlah digit pada masing-masing angka.',
    hint2: 'Coba lihat: 3, 6, 9 semuanya satu digit. Bagaimana dengan 10?',
    hint3: 'Angka 10 adalah bilangan 2 digit (ada angka 1 dan 0).',
    twmStrand: 'characterising',
  },
  {
    id: 'thk_s1_est_1',
    stage: 1,
    domain: 'number',
    cognitiveType: 'concept',
    thinkingType: 'estimation',
    phase: 'fondasi',
    grade: 'Stage 1 (PAUD/TK)',
    topicId: 'st1_estimation',
    topicTitle: 'Estimation Mountain',
    competency: 'Membuat perkiraan jumlah wajar (Reasonable estimation)',
    difficulty: 1,
    question: 'Lihat toples permen ini. Kira-kira ada berapa permen di dalam toples tanpa harus menghitung satu per satu?',
    englishQuestion: 'Look at this jar. About how many candies are inside without counting each one?',
    visualType: 'objects',
    visualData: { count: 12, item: '🍬', arrangement: 'jar' },
    options: ['Sekitar 10 butir', 'Sekitar 50 butir', 'Sekitar 100 butir', 'Sekitar 500 butir'],
    correctAnswer: 'Sekitar 10 butir',
    explanation: 'Toples kecil ini berisi segenggam permen. 12 permen paling mendekati perkiraan wajar "sekitar 10 butir". 50 dan 100 terlalu banyak untuk toples sekecil ini!',
    englishExplanation: 'The jar holds a small handful. 12 candies is closest to the reasonable estimate of "about 10". 50 or 100 would overflow.',
    hint1: 'Toples ini tidak terlalu besar, permen tidak sampai menumpuk ratusan.',
    hint2: 'Bandingkan dengan jari kedua tanganmu (ada 10 jari). Permen ini mirip banyaknya dengan 10 jari.',
    hint3: 'Pilihan paling masuk akal adalah sekitar 10 butir.',
    twmStrand: 'conjecturing',
  },
  {
    id: 'thk_s1_geo_pattern',
    stage: 1,
    domain: 'geometry_measure',
    cognitiveType: 'problem_solving',
    thinkingType: 'pattern_rule',
    phase: 'fondasi',
    grade: 'Stage 1 (PAUD/TK)',
    topicId: 'st1_shape_patterns',
    topicTitle: 'Pattern Lab: Shape Sequences',
    competency: 'Mengenali pola berulang dan menjelaskan aturannya',
    difficulty: 1,
    question: 'Perhatikan pola kalung manik-manik: 🔴 🔵 🔴 🔵 🔴 ... Bentuk berikutnya dan apa aturannya?',
    englishQuestion: 'Notice the necklace pattern: 🔴 🔵 🔴 🔵 🔴 ... What comes next, and what is the rule?',
    options: ['🔵 (Aturan: Merah lalu Biru berulang)', '🔴 (Aturan: Selalu Merah)', '🟡 (Aturan: Warna baru)', '🟢 (Aturan: Acak)'],
    correctAnswer: '🔵 (Aturan: Merah lalu Biru berulang)',
    explanation: 'Pola ini memiliki unit berulang [Merah, Biru]. Setelah merah, selalu diikuti oleh biru!',
    englishExplanation: 'This pattern repeats the unit [Red, Blue]. After red, blue always follows!',
    hint1: 'Sebutkan warnanya dengan suara keras: Merah, Biru, Merah, Biru, Merah...',
    hint2: 'Warna apa yang selalu datang setelah Merah?',
    hint3: 'Setelah Merah adalah Biru (🔵).',
    twmStrand: 'generalising',
  },

  // ==================== STAGE 2: BUILDING FLUENCY ====================
  {
    id: 'thk_s2_strat_add',
    stage: 2,
    domain: 'number',
    cognitiveType: 'reasoning',
    thinkingType: 'multiple_strategies',
    phase: 'fase_a',
    grade: 'Stage 2 (SD Kelas 1)',
    topicId: 'st2_mental_addition',
    topicTitle: 'Mental Math Arena: Multiple Strategies',
    competency: 'Membandingkan strategi berhitung cepat 28 + 15',
    difficulty: 2,
    question: 'Kafa ingin menghitung 28 + 15 di dalam kepala. Manakah strategi yang paling cerdas?',
    englishQuestion: 'Kafa wants to solve 28 + 15 mentally. Which strategy is efficient?',
    strategies: [
      { id: 'strat_make_ten', name: 'Strategi A (Make a Ten)', steps: '28 + 2 = 30, lalu 30 + 13 = 43', isOptimal: true },
      { id: 'strat_split_place', name: 'Strategi B (Split Tens & Ones)', steps: '(20 + 10) + (8 + 5) = 30 + 13 = 43', isOptimal: true },
      { id: 'strat_count_one', name: 'Strategi C (Counting on by 1s)', steps: '28 + 1 + 1 + 1... sebanyak 15 kali', isOptimal: false },
    ],
    options: [
      'Strategi A: 28 + 2 = 30, lalu 30 + 13 = 43',
      'Strategi B: (20 + 10) + (8 + 5) = 43',
      'Keduanya (A dan B) adalah strategi mental yang sangat hebat!',
      'Hanya boleh menghitung dengan jari satu per satu',
    ],
    correctAnswer: 'Keduanya (A dan B) adalah strategi mental yang sangat hebat!',
    explanation: 'Dalam matematika tingkat internasional, tidak hanya ada satu cara! Menggenapkan ke puluhan (Make a ten) dan memecah puluhan/satuan keduanya sangat efisien daripada menghitung satu per satu.',
    englishExplanation: 'In mathematics, multiple strategies can be valid and efficient! Making a ten (28+2=30) and partitioning into tens and ones are both powerful mental strategies.',
    hint1: 'Lihat bagaimana 28 sangat dekat dengan angka 30 (cukup tambah 2).',
    hint2: 'Memecah angka menjadi puluhan dan satuan juga memudahkan berhitung.',
    hint3: 'Baik strategi Make a Ten maupun Pemecahan Nilai Tempat sangat dianjurkan!',
    twmStrand: 'critiquing',
  },
  {
    id: 'thk_s2_mistake_1',
    stage: 2,
    domain: 'number',
    cognitiveType: 'reasoning',
    thinkingType: 'find_the_mistake',
    phase: 'fase_a',
    grade: 'Stage 2 (SD Kelas 1)',
    topicId: 'st2_math_detective',
    topicTitle: 'Math Detective: Spot the Error',
    competency: 'Menganalisis kekeliruan konsep nilai tempat dalam penjumlahan',
    difficulty: 2,
    mistakeContext: {
      studentName: 'Budi',
      initialClaim: '37 + 28 = 55',
      errorLocation: 'Lupa menambahkan 1 puluhan dari simpanan (7 + 8 = 15)',
      correctFix: '37 + 28 = 65',
    },
    question: 'Detektif Matematika: Budi menulis di papan tulis "37 + 28 = 55". Di manakah letak kesalahan Budi?',
    englishQuestion: 'Math Detective: Budi wrote "37 + 28 = 55". Where did Budi make a mistake?',
    options: [
      'Budi lupa menjumlahkan 1 puluhan dari hasil simpanan 7 + 8 = 15',
      'Budi salah menjumlahkan 7 + 8 menjadi 12',
      '30 + 20 seharusnya hasilnya 40',
      'Budi sudah benar, jawabannya memang 55',
    ],
    correctAnswer: 'Budi lupa menjumlahkan 1 puluhan dari hasil simpanan 7 + 8 = 15',
    explanation: '7 + 8 = 15 (5 satuan, simpan 1 puluhan). Kemudian 1 puluhan + 3 puluhan + 2 puluhan = 6 puluhan. Jadi jawaban seharusnya 65, bukan 55!',
    englishExplanation: '7 + 8 = 15 (5 ones and 1 ten regrouped). 1 ten + 3 tens + 2 tens = 6 tens. The correct answer is 65, not 55!',
    hint1: 'Coba hitung 7 + 8 terlebih dahulu. Apakah ada angka yang harus disimpan ke puluhan?',
    hint2: '7 + 8 = 15. Ada angka 1 puluhan yang harus ditambahkan ke 30 + 20.',
    hint3: '50 + 15 = 65.',
    twmStrand: 'critiquing',
  },
  {
    id: 'thk_s2_bar_model_1',
    stage: 2,
    domain: 'number',
    cognitiveType: 'problem_solving',
    thinkingType: 'bar_model',
    phase: 'fase_a',
    grade: 'Stage 2 (SD Kelas 1)',
    topicId: 'st2_bar_models',
    topicTitle: 'Visual Bar Model: Part-Whole',
    competency: 'Menggunakan bar model untuk menyelesaikan masalah selisih',
    difficulty: 2,
    question: 'Sebuah pita panjangnya 18 cm dipotong menjadi 2 bagian. Bagian pertama 11 cm. Berapa panjang potongan pita kedua (?) ?',
    englishQuestion: 'A ribbon is 18 cm long. It is cut into 2 pieces. The first piece is 11 cm. What is the length of the second piece (?) ?',
    visualType: 'bar_model',
    barModelData: {
      whole: 18,
      parts: [
        { label: 'Potongan 1', value: 11 },
        { label: 'Potongan 2', value: '?', isUnknown: true },
      ],
    },
    options: ['7 cm', '8 cm', '9 cm', '29 cm'],
    correctAnswer: '7 cm',
    explanation: 'Dalam model bar part-whole: Keseluruhan (18) = Bagian 1 (11) + Bagian 2 (?). Maka Bagian 2 = 18 - 11 = 7 cm.',
    englishExplanation: 'In a part-whole bar model: Whole (18) = Part 1 (11) + Part 2 (?). So Part 2 = 18 - 11 = 7 cm.',
    hint1: 'Total panjangnya adalah 18 cm.',
    hint2: 'Gunakan operasi pengurangan: 18 - 11.',
    hint3: '18 - 11 = 7 cm.',
    twmStrand: 'specialising',
  },

  // ==================== STAGE 3: DEVELOPING STRATEGIES ====================
  {
    id: 'thk_s3_always_1',
    stage: 3,
    domain: 'number',
    cognitiveType: 'reasoning',
    thinkingType: 'always_sometimes_never',
    phase: 'fase_a',
    grade: 'Stage 3 (SD Kelas 2)',
    topicId: 'st3_properties_of_numbers',
    topicTitle: 'Reasoning Engine: Always, Sometimes, or Never?',
    competency: 'Mengevaluasi pernyataan sifat bilangan genap dan ganjil',
    difficulty: 2,
    question: 'Pernyataan: "Bilangan GENAP ditambah bilangan GENAP hasilnya selalu GENAP." Apakah pernyataan ini...',
    englishQuestion: 'Statement: "An EVEN number + an EVEN number is ALWAYS EVEN." Is this statement...',
    options: ['ALWAYS (Selalu Benar)', 'SOMETIMES (Kadang-kadang Benar)', 'NEVER (Tidak Pernah Benar)'],
    correctAnswer: 'ALWAYS (Selalu Benar)',
    reasoningOptions: [
      'Karena setiap bilangan genap bisa berpasangan 2-2. Dua pasang digabung selalu tetap berpasangan sempurna.',
      'Contohnya: 4 + 6 = 10, 8 + 2 = 10, 12 + 4 = 16. Semuanya habis dibagi 2.',
      'Bentuk aljabar: 2m + 2n = 2(m + n), selalu kelipatan 2.',
    ],
    explanation: 'SELALU BENAR (ALWAYS)! Bilangan genap adalah kelipatan 2. Dua kelompok yang berpasangan dua-dua bila digabungkan akan selalu menghasilkan kelompok yang berpasangan dua-dua tanpa sisa.',
    englishExplanation: 'ALWAYS! Even numbers are divisible by 2 with no remainder. Combining two sets of pairs always results in paired numbers with no remainder.',
    hint1: 'Coba beberapa contoh: 2 + 4 = 6 (genap), 6 + 6 = 12 (genap), 10 + 8 = 18 (genap).',
    hint2: 'Apakah kamu bisa menemukan SATU saja contoh yang menghasilkan ganjil?',
    hint3: 'Tidak ada contoh ganjil, jadi jawabannya adalah ALWAYS (Selalu).',
    twmStrand: 'generalising',
  },
  {
    id: 'thk_s3_frac_compare',
    stage: 3,
    domain: 'number',
    cognitiveType: 'concept',
    thinkingType: 'how_do_you_know',
    phase: 'fase_a',
    grade: 'Stage 3 (SD Kelas 2)',
    topicId: 'st3_fractions_reasoning',
    topicTitle: 'Fraction Lab: Conceptual Thinking',
    competency: 'Membandingkan pecahan berpenyebut sama & menjelaskan alasan logis',
    difficulty: 2,
    question: 'Mana yang lebih besar: 1/2 pizza atau 1/4 pizza berukuran sama? Dan BAGAIMANA KAMU TAHU (How do you know)?',
    englishQuestion: 'Which is larger: 1/2 of a pizza or 1/4 of the same pizza? And HOW DO YOU KNOW?',
    visualType: 'fraction_pie',
    visualData: { numerator: 1, denominator: 2 },
    options: [
      '1/2 lebih besar, karena pizza hanya dibagi 2 potong sehingga setiap potong lebih besar daripada jika dibagi 4 potong.',
      '1/4 lebih besar, karena angka 4 lebih besar dari angka 2.',
      'Keduanya sama besar karena pembilangnya sama-sama 1.',
      'Tergantung rasa pizzanya.',
    ],
    correctAnswer: '1/2 lebih besar, karena pizza hanya dibagi 2 potong sehingga setiap potong lebih besar daripada jika dibagi 4 potong.',
    explanation: 'Penyebut pecahan menunjukkan berapa banyak bagian yang dipotong. Semakin sedikit potongan yang dibuat (2 potong vs 4 potong), semakin besar ukuran tiap potongannya!',
    englishExplanation: 'The denominator shows how many equal shares. Dividing into fewer shares (2 instead of 4) means each slice is significantly bigger!',
    hint1: 'Bayangkan kamu membagi kue dengan 1 teman (berdua) vs membagi dengan 3 teman (berempat). Kapan potonganmu lebih besar?',
    hint2: 'Membagi 2 menghasilkan potongan separuh besar.',
    hint3: '1/2 jauh lebih besar daripada 1/4.',
    twmStrand: 'convincing',
  },
  {
    id: 'thk_s3_open_ended_1',
    stage: 3,
    domain: 'number',
    cognitiveType: 'problem_solving',
    thinkingType: 'open_ended',
    phase: 'fase_a',
    grade: 'Stage 3 (SD Kelas 2)',
    topicId: 'st3_open_ended',
    topicTitle: 'Open-Ended Thinking: Target 24',
    competency: 'Menemukan berbagai kombinasi operasi untuk menghasilkan bilangan target 24',
    difficulty: 2,
    question: 'Tantangan Terbuka: Temukan kombinasi angka yang menghasilkan nilai tepat 24!',
    englishQuestion: 'Open-Ended Challenge: Which of these combinations successfully equals 24?',
    options: [
      '12 + 12 = 24 dan 3 × 8 = 24 dan 30 - 6 = 24',
      '4 × 6 = 24 dan 20 + 4 = 24 dan 48 ÷ 2 = 24',
      'Semua kombinasi di atas benar dan bernilai 24!',
      'Hanya ada 1 cara untuk membuat angka 24',
    ],
    correctAnswer: 'Semua kombinasi di atas benar dan bernilai 24!',
    acceptedAnswers: ['Semua kombinasi di atas benar dan bernilai 24!'],
    explanation: 'Luar biasa! Dalam matematika terbuka, angka 24 dapat dibentuk dengan banyak cara: penjumlahan (12+12), perkalian (3×8 atau 4×6), pengurangan (30-6), maupun pembagian (48÷2).',
    englishExplanation: 'Great thinking! Open-ended mathematics shows 24 can be decomposed in countless ways: 12+12, 3x8, 4x6, 30-6, and 48/2.',
    hint1: 'Cek 12 + 12 = 24. Benar!',
    hint2: 'Cek 3 × 8 = 24 dan 4 × 6 = 24. Benar!',
    hint3: 'Semua cara tersebut sah dan benar.',
    twmStrand: 'specialising',
  },

  // ==================== STAGE 4: DEEPENING UNDERSTANDING ====================
  {
    id: 'thk_s4_algebra_box',
    stage: 4,
    domain: 'number',
    cognitiveType: 'reasoning',
    thinkingType: 'pattern_rule',
    phase: 'fase_b',
    grade: 'Stage 4 (SD Kelas 3)',
    topicId: 'st4_algebraic_thinking',
    topicTitle: 'Algebraic Thinking: Mystery Box',
    competency: 'Menentukan nilai variabel tidak diketahui dalam persamaan seimbang',
    difficulty: 3,
    question: 'Jika: □ + □ + 14 = 30. Berapakah nilai dari satu kotak (□)?',
    englishQuestion: 'If: □ + □ + 14 = 30. What is the value of one box (□)?',
    options: ['8', '16', '7', '10'],
    correctAnswer: '8',
    explanation: 'Langkah berpikir aljabar: 1) Kurangkan 14 dari kedua sisi: 30 - 14 = 16. 2) Dua kotak bernilai 16 (□ + □ = 16). 3) Maka satu kotak bernilai 16 ÷ 2 = 8. Cek: 8 + 8 + 14 = 30 (Tepat!).',
    englishExplanation: 'Algebraic steps: 1) Subtract 14 from both sides: 30 - 14 = 16. 2) Two boxes equal 16 (2 x □ = 16). 3) One box = 16 / 2 = 8. Check: 8 + 8 + 14 = 30 (Correct!).',
    hint1: 'Kira-kira berapa sisa angka jika 14 dikeluarkan dari 30?',
    hint2: '30 - 14 = 16. Angka 16 ini adalah gabungan dari 2 kotak kembar.',
    hint3: 'Bagi 16 dengan 2: 16 ÷ 2 = 8.',
    twmStrand: 'characterising',
  },
  {
    id: 'thk_s4_geom_symmetry',
    stage: 4,
    domain: 'geometry_measure',
    cognitiveType: 'concept',
    thinkingType: 'how_do_you_know',
    phase: 'fase_b',
    grade: 'Stage 4 (SD Kelas 3)',
    topicId: 'st4_geometry_island',
    topicTitle: 'Geometry Island: Lines of Symmetry',
    competency: 'Menentukan jumlah garis simetri lipat pada persegi',
    difficulty: 2,
    question: 'Berapa banyak garis simetri lipat yang dimiliki oleh sebuah PERSEGI (Square)?',
    englishQuestion: 'How many lines of symmetry does a SQUARE have?',
    visualType: 'shapes',
    visualData: { shape: 'square', lines: 4 },
    options: ['4 Garis Simetri (Vertikal, Horisontal, dan 2 Diagonal)', '2 Garis Simetri saja', '1 Garis Simetri saja', '8 Garis Simetri'],
    correctAnswer: '4 Garis Simetri (Vertikal, Horisontal, dan 2 Diagonal)',
    explanation: 'Persegi memiliki 4 garis simetri lipat: 1 tegak lurus (vertikal), 1 mendatar (horisontal), dan 2 garis miring menyilang dari sudut ke sudut (diagonal). Jika dilipat di garis tersebut, kedua belahan akan saling menutupi pas!',
    englishExplanation: 'A square has 4 lines of symmetry: 1 vertical, 1 horizontal, and 2 diagonal lines from corner to corner. Folding along any of these leaves identical matching halves!',
    hint1: 'Coba bayangkan melipat kertas persegi dari atas ke bawah, lalu kiri ke kanan.',
    hint2: 'Apakah persegi juga bisa dilipat menyilang dari sudut ke sudut?',
    hint3: 'Bisa! 2 lipatan lurus + 2 lipatan menyilang = 4 garis simetri.',
    twmStrand: 'characterising',
  },
  {
    id: 'thk_s4_data_bar',
    stage: 4,
    domain: 'statistics_probability',
    cognitiveType: 'problem_solving',
    thinkingType: 'standard',
    phase: 'fase_b',
    grade: 'Stage 4 (SD Kelas 3)',
    topicId: 'st4_data_detective',
    topicTitle: 'Data Detective: Bar Chart Reading',
    competency: 'Membaca dan membandingkan selisih data dari diagram batang',
    difficulty: 2,
    question: 'Data peminjaman buku perpustakaan sekolah: Senin: 15 buku, Selasa: 25 buku, Rabu: 40 buku, Kamis: 20 buku. Berapa buku LEBIH BANYAK yang dipinjam pada hari Rabu dibanding hari Senin?',
    englishQuestion: 'Library books borrowed: Monday: 15, Tuesday: 25, Wednesday: 40, Thursday: 20. How many MORE books were borrowed on Wednesday than on Monday?',
    options: ['25 buku', '15 buku', '40 buku', '55 buku'],
    correctAnswer: '25 buku',
    explanation: 'Pertanyaan "berapa lebih banyak" menanyakan selisih: Hari Rabu (40) - Hari Senin (15) = 25 buku lebih banyak!',
    englishExplanation: '"How many more" requires finding the difference: Wednesday (40) - Monday (15) = 25 more books!',
    hint1: 'Cari angka untuk hari Rabu (40).',
    hint2: 'Cari angka untuk hari Senin (15).',
    hint3: 'Kurangkan: 40 - 15 = 25.',
    twmStrand: 'specialising',
  },

  // ==================== STAGE 5: REASONING & CONNECTIONS ====================
  {
    id: 'thk_s5_multi_step',
    stage: 5,
    domain: 'number',
    cognitiveType: 'problem_solving',
    thinkingType: 'standard',
    phase: 'fase_b',
    grade: 'Stage 5 (SD Kelas 4-5)',
    topicId: 'st5_real_world_quests',
    topicTitle: 'Math Quest: Real-World Multi-Step Journey',
    competency: 'Menyelesaikan masalah keuangan bertahap dalam konteks perjalanan',
    difficulty: 3,
    question: 'Kafa memiliki uang saku Rp 50.000. Ia membeli 3 buah buku cerita anak seharga Rp 12.000 per buku. Berapa sisa uang saku Kafa sekarang?',
    englishQuestion: 'Kafa has Rp 50,000 allowance. He buys 3 story books at Rp 12,000 each. How much money does Kafa have left?',
    options: ['Rp 14.000', 'Rp 36.000', 'Rp 24.000', 'Rp 12.000'],
    correctAnswer: 'Rp 14.000',
    explanation: 'Langkah 1: Total belanja = 3 × Rp 12.000 = Rp 36.000. Langkah 2: Sisa uang = Rp 50.000 - Rp 36.000 = Rp 14.000.',
    englishExplanation: 'Step 1: Total spent = 3 x Rp 12,000 = Rp 36,000. Step 2: Remaining money = Rp 50,000 - Rp 36,000 = Rp 14,000.',
    hint1: 'Hitung dulu total harga untuk 3 buku: 3 × 12.000.',
    hint2: '3 × 12.000 = 36.000.',
    hint3: 'Kurangkan uang mula-mula dengan total belanja: 50.000 - 36.000 = 14.000.',
    twmStrand: 'specialising',
  },
  {
    id: 'thk_s5_prob_bag',
    stage: 5,
    domain: 'statistics_probability',
    cognitiveType: 'concept',
    thinkingType: 'how_do_you_know',
    phase: 'fase_b',
    grade: 'Stage 5 (SD Kelas 4-5)',
    topicId: 'st5_probability_mountain',
    topicTitle: 'Probability Mountain: Likelihood & Chances',
    competency: 'Menganalisis kemungkinan kejadian acak dari kumpulan bola warna',
    difficulty: 3,
    question: 'Di dalam kantong rahasia terdapat: 6 kelereng Merah, 2 kelereng Biru, dan 1 kelereng Kuning. Jika kamu mengambil 1 kelereng secara acak tanpa melihat, manakah warna yang PALING MUNGKIN (Most Likely) terambil?',
    englishQuestion: 'Inside a bag there are: 6 Red, 2 Blue, and 1 Yellow marbles. If you draw 1 without looking, which color is MOST LIKELY to be picked?',
    options: [
      'Merah (karena jumlah kelereng merah paling banyak, yaitu 6 dari 9)',
      'Kuning (karena kuning warna paling terang)',
      'Semua warna memiliki peluang sama besar',
      'Biru (karena kelereng biru ada di tengah)',
    ],
    correctAnswer: 'Merah (karena jumlah kelereng merah paling banyak, yaitu 6 dari 9)',
    explanation: 'Peluang kelereng Merah adalah 6/9, Biru 2/9, dan Kuning 1/9. Karena proporsi merah paling dominan (6 dari 9 kelereng), maka kelereng merah adalah yang PALING MUNGKIN terambil!',
    englishExplanation: 'Red probability is 6/9, Blue 2/9, Yellow 1/9. Since red has the largest share (6 out of 9), red is most likely!',
    hint1: 'Bandingkan jumlah masing-masing warna: Merah (6), Biru (2), Kuning (1).',
    hint2: 'Warna dengan jumlah terbanyak memiliki kesempatan terbesar untuk terambil.',
    hint3: 'Merah ada 6 butir, paling banyak.',
    twmStrand: 'convincing',
  },

  // ==================== STAGE 6: ADVANCED PRIMARY THINKING ====================
  {
    id: 'thk_s6_olympiad_legs',
    stage: 6,
    domain: 'number',
    cognitiveType: 'problem_solving',
    thinkingType: 'open_ended',
    phase: 'fase_c',
    grade: 'Stage 6 (SD Kelas 6)',
    topicId: 'st6_logic_lab',
    topicTitle: 'Brain Lab: Non-Routine Problem Solving',
    competency: 'Menyelesaikan teka-teki logika kombinasi kaki hewan',
    difficulty: 4,
    question: 'Tantangan Olimpiade Cilik: Di sebuah peternakan ada Ayam (berkaki 2) dan Kambing (berkaki 4). Jumlah kepala ada 10 hewan, dan total kaki seluruhnya ada 28 kaki. Berapa banyak ayam dan kambing di peternakan itu?',
    englishQuestion: 'Brain Lab Challenge: On a farm there are Chickens (2 legs) and Goats (4 legs). There are 10 heads and 28 legs altogether. How many chickens and goats are there?',
    options: [
      '6 Ayam dan 4 Kambing',
      '5 Ayam dan 5 Kambing',
      '4 Ayam dan 6 Kambing',
      '7 Ayam dan 3 Kambing',
    ],
    correctAnswer: '6 Ayam dan 4 Kambing',
    explanation: 'Strategi Pengandaian: 1) Jika semua 10 hewan adalah ayam, kakinya = 10 × 2 = 20 kaki. 2) Selisih kaki = 28 - 20 = 8 kaki lebih banyak. 3) Setiap kambing menyumbang 2 kaki ekstra (4 - 2 = 2). 4) Jumlah kambing = 8 ÷ 2 = 4 ekor kambing. 5) Jumlah ayam = 10 - 4 = 6 ekor ayam! Cek: (6 × 2) + (4 × 4) = 12 + 16 = 28 kaki! Tepat!',
    englishExplanation: 'Supposition Strategy: 1) If all 10 were chickens: 10 x 2 = 20 legs. 2) Extra legs = 28 - 20 = 8 legs. 3) Each goat adds 2 extra legs (4 - 2 = 2). 4) Goats = 8 / 2 = 4 goats. 5) Chickens = 10 - 4 = 6 chickens! Check: (6x2) + (4x4) = 12 + 16 = 28 legs! Perfect!',
    hint1: 'Coba uji opsi A: 6 Ayam (6×2=12 kaki) + 4 Kambing (4×4=16 kaki). Berapa 12 + 16?',
    hint2: '12 + 16 = 28 kaki! Dan 6 + 4 = 10 kepala.',
    hint3: 'Pilihan 6 Ayam dan 4 Kambing memenuhi kedua syarat dengan tepat.',
    twmStrand: 'conjecturing',
  },
  {
    id: 'thk_s6_ratio_recipe',
    stage: 6,
    domain: 'number',
    cognitiveType: 'concept',
    thinkingType: 'standard',
    phase: 'fase_c',
    grade: 'Stage 6 (SD Kelas 6)',
    topicId: 'st6_ratio_proportion',
    topicTitle: 'Grand Challenge: Ratio & Proportion',
    competency: 'Menerapkan konsep rasio dan proporsi dalam resep kue',
    difficulty: 3,
    question: 'Untuk membuat 12 potong kue bolu dibutuhkan 200 gram tepung terigu. Jika Ibu ingin membuat 36 potong kue bolu untuk acara sekolah, berapa gram tepung terigu yang dibutuhkan?',
    englishQuestion: 'To bake 12 cupcakes requires 200 grams of flour. If you want to bake 36 cupcakes, how many grams of flour are needed?',
    options: ['600 gram', '400 gram', '800 gram', '500 gram'],
    correctAnswer: '600 gram',
    explanation: 'Rasio proporsional: 36 kue adalah 3 kali lipat dari 12 kue (36 ÷ 12 = 3). Maka tepung yang dibutuhkan juga 3 kali lipat: 3 × 200 gram = 600 gram!',
    englishExplanation: 'Proportional reasoning: 36 cupcakes is 3 times 12 cupcakes (36 / 12 = 3). Therefore, flour needed is also 3 times: 3 x 200 g = 600 grams!',
    hint1: 'Berapa kali lipat kue yang ingin dibuat? (36 dibanding 12)',
    hint2: '36 ÷ 12 = 3 kali lipat.',
    hint3: 'Kalikan tepung terigu dengan 3: 200 × 3 = 600 gram.',
    twmStrand: 'generalising',
  },
];

// Helper: Calculate diagnostic result and stage placement based on answers
export function evaluateDiagnosticTest(
  answers: { questionId: string; isCorrect: boolean; domain?: MathDomain; cognitiveType?: QuestionCognitiveType }[]
): DiagnosticAssessment {
  let numCorrect = 0;
  let numTotal = answers.length || 1;

  let domainScores = {
    number: { correct: 0, total: 0 },
    geometry_measure: { correct: 0, total: 0 },
    statistics_probability: { correct: 0, total: 0 },
  };

  let cogScores = {
    fluency: { correct: 0, total: 0 },
    concept: { correct: 0, total: 0 },
    reasoning: { correct: 0, total: 0 },
    problem_solving: { correct: 0, total: 0 },
  };

  answers.forEach((ans) => {
    if (ans.isCorrect) numCorrect++;

    const dom = ans.domain || 'number';
    domainScores[dom].total++;
    if (ans.isCorrect) domainScores[dom].correct++;

    const cog = ans.cognitiveType || 'concept';
    cogScores[cog].total++;
    if (ans.isCorrect) cogScores[cog].correct++;
  });

  const getPercent = (c: number, t: number) => (t > 0 ? Math.round((c / t) * 100) : 75);

  const accuracy = Math.round((numCorrect / numTotal) * 100);

  // Stage Placement Logic
  let recommendedStage: PrimaryStage = 1;
  if (accuracy >= 85) recommendedStage = 5;
  else if (accuracy >= 70) recommendedStage = 4;
  else if (accuracy >= 55) recommendedStage = 3;
  else if (accuracy >= 40) recommendedStage = 2;
  else recommendedStage = 1;

  const stageObj = PRIMARY_STAGES.find((s) => s.stage === recommendedStage) || PRIMARY_STAGES[0];

  const numberSenseScore = getPercent(domainScores.number.correct, domainScores.number.total);
  const geometryMeasureScore = getPercent(domainScores.geometry_measure.correct, domainScores.geometry_measure.total);
  const statsProbScore = getPercent(domainScores.statistics_probability.correct, domainScores.statistics_probability.total);

  const fluencyScore = getPercent(cogScores.fluency.correct, cogScores.fluency.total);
  const conceptScore = getPercent(cogScores.concept.correct, cogScores.concept.total);
  const reasoningScore = getPercent(cogScores.reasoning.correct, cogScores.reasoning.total);
  const problemSolvingScore = getPercent(cogScores.problem_solving.correct, cogScores.problem_solving.total);

  const strengths: string[] = [];
  const developingAreas: string[] = [];

  if (numberSenseScore >= 70) strengths.push('Strong in Number Sense & Calculations');
  else developingAreas.push('Focus on Number Relationships & Mental Math');

  if (geometryMeasureScore >= 70) strengths.push('Good Spatial & Geometric Visualization');
  else developingAreas.push('Needs Practice in Measurement & Shapes');

  if (reasoningScore >= 70) strengths.push('Excellent Mathematical Reasoning ("How do you know?")');
  else developingAreas.push('Practice Explaining Strategies & Reasoning');

  if (problemSolvingScore >= 70) strengths.push('Great Multi-Step Problem Solving');
  else developingAreas.push('Practice Real-World Word Problems');

  return {
    stage: recommendedStage,
    overallLevelName: `${stageObj.name} (${stageObj.approxAge})`,
    numberSenseScore,
    geometryMeasureScore,
    statsProbScore,
    fluencyScore,
    conceptScore,
    reasoningScore,
    problemSolvingScore,
    strengths,
    developingAreas,
    recommendedPath: [
      `Dunia Petualangan: ${stageObj.name}`,
      'Latihan Berpikir: Multiple Strategies & Math Detective',
      'Eksplorasi Konsep: Bar Models & Pattern Lab',
    ],
    completedDate: new Date().toISOString().split('T')[0],
  };
}
