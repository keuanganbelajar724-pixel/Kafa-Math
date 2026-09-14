import {
  GeneratedMathQuestion,
  WorkbookOperation,
  WorkbookDifficulty,
  InternalDifficultyLevel,
  VerticalMathFormat,
} from '../types';

// Natural Indonesian Story Templates
const INDONESIAN_NAMES = [
  'Ahmad', 'Siti', 'Budi', 'Rina', 'Edo', 'Aisyah', 'Yusuf', 'Dewi',
  'Dimas', 'Lani', 'Dayu', 'Beni', 'Udin', 'Putri', 'Rizky', 'Fajar'
];

const STORY_ITEMS = [
  { singular: 'buku', plural: 'buku', verbBuy: 'membeli', verbGive: 'memberikan', container: 'rak' },
  { singular: 'pensil', plural: 'pensil', verbBuy: 'membeli', verbGive: 'meminjamkan', container: 'kotak pensil' },
  { singular: 'apel', plural: 'apel', verbBuy: 'memetik', verbGive: 'memberikan', container: 'keranjang' },
  { singular: 'kelereng', plural: 'kelereng', verbBuy: 'mengumpulkan', verbGive: 'memberikan', container: 'kantong' },
  { singular: 'permen', plural: 'permen', verbBuy: 'membeli', verbGive: 'membagikan', container: 'toples' },
  { singular: 'stiker', plural: 'stiker', verbBuy: 'mengoleksi', verbGive: 'menempelkan', container: 'buku stiker' },
  { singular: 'roti', plural: 'roti', verbBuy: 'membuat', verbGive: 'menghidangkan', container: 'piring' },
  { singular: 'jeruk', plural: 'jeruk', verbBuy: 'membeli di pasar', verbGive: 'membagikan', container: 'kotak buah' },
];

export class MathQuestionGenerator {
  private static recentHashes = new Set<string>();

  // Convert UI difficulty to internal 1-10 level
  public static mapDifficultyToInternal(
    difficulty: WorkbookDifficulty,
    gradeLevel: number = 2
  ): InternalDifficultyLevel {
    const base = Math.min(10, Math.max(1, gradeLevel + 1));
    if (difficulty === 'mudah') {
      return Math.max(1, (base - 1)) as InternalDifficultyLevel;
    } else if (difficulty === 'sedang') {
      return Math.min(10, base) as InternalDifficultyLevel;
    } else {
      return Math.min(10, (base + 2)) as InternalDifficultyLevel;
    }
  }

  // Generate a batch of N validated questions (e.g. 10 questions per page)
  public static generatePageQuestions(
    operation: WorkbookOperation,
    difficulty: WorkbookDifficulty,
    gradeLevel: number,
    pageNumber: number,
    count: number = 10,
    seedOffset: number = 0
  ): GeneratedMathQuestion[] {
    const questions: GeneratedMathQuestion[] = [];
    const internalLevel = this.mapDifficultyToInternal(difficulty, gradeLevel);

    for (let i = 0; i < count; i++) {
      const qNum = (pageNumber - 1) * count + i + 1;
      let attempts = 0;
      let q: GeneratedMathQuestion | null = null;

      while (attempts < 10) {
        q = this.generateSingleQuestion(operation, internalLevel, difficulty, gradeLevel, qNum, seedOffset + i);
        if (q && this.validateQuestion(q)) {
          break;
        }
        attempts++;
      }

      if (q) {
        questions.push(q);
      }
    }

    return questions;
  }

  // Generate similar question with same concept but altered deterministic numbers
  public static generateSimilarQuestion(original: GeneratedMathQuestion): GeneratedMathQuestion {
    const newSeed = Math.floor(Math.random() * 10000);
    let attempts = 0;
    while (attempts < 10) {
      const candidate = this.generateSingleQuestion(
        original.operation,
        original.difficultyLevel,
        original.difficultyLabel,
        original.gradeLevel,
        1,
        newSeed + attempts
      );
      if (candidate.answer !== original.answer && this.validateQuestion(candidate)) {
        return {
          ...candidate,
          id: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        };
      }
      attempts++;
    }
    return original;
  }

  // Main Generator switch
  public static generateSingleQuestion(
    operation: WorkbookOperation,
    internalLevel: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    gradeLevel: number,
    questionNumber: number,
    seed: number = 0
  ): GeneratedMathQuestion {
    const id = `wq_${operation}_g${gradeLevel}_lvl${internalLevel}_${Date.now()}_${seed}_${Math.random().toString(36).substring(2, 6)}`;

    switch (operation) {
      case 'penjumlahan':
        return this.generateAddition(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'pengurangan':
        return this.generateSubtraction(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'perkalian':
        return this.generateMultiplication(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'pembagian':
        return this.generateDivision(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'campuran':
        return this.generateMixedOperation(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'cerita':
        return this.generateStoryProblem(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'nilai_tempat':
        return this.generatePlaceValue(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'pecahan':
        return this.generateFractions(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'pengukuran':
        return this.generateMeasurement(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'waktu':
        return this.generateTime(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'uang':
        return this.generateMoney(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'geometri':
        return this.generateGeometry(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'data':
        return this.generateData(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'pola':
        return this.generatePattern(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      case 'logika':
        return this.generateLogic(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
      default:
        return this.generateAddition(id, internalLevel, difficultyLabel, gradeLevel, questionNumber);
    }
  }

  // 1. PENJUMLAHAN
  private static generateAddition(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    let a = 0;
    let b = 0;

    if (level <= 2) {
      // Basic 1-20 (No carry)
      a = Math.floor(Math.random() * 9) + 1;
      b = Math.floor(Math.random() * (9 - (a % 10))) + 1;
      if (a + b < 5) b += 5;
    } else if (level <= 4) {
      // 2-digit, minimal carry (e.g. 23 + 45)
      a = Math.floor(Math.random() * 40) + 11;
      b = Math.floor(Math.random() * 40) + 11;
    } else if (level <= 6) {
      // 2-digit with carry (e.g. 47 + 68)
      a = Math.floor(Math.random() * 60) + 25;
      b = Math.floor(Math.random() * 60) + 18;
    } else if (level <= 8) {
      // 3-digit with carry (e.g. 145 + 278)
      a = Math.floor(Math.random() * 400) + 115;
      b = Math.floor(Math.random() * 400) + 115;
    } else {
      // 3-4 digit advanced (e.g. 587 + 769)
      a = Math.floor(Math.random() * 700) + 350;
      b = Math.floor(Math.random() * 600) + 250;
    }

    const answer = a + b;
    const numberSentence = `${a} + ${b}`;
    const hash = `add_${a}_${b}`;

    // Step-by-step
    const aOnes = a % 10;
    const bOnes = b % 10;
    const onesSum = aOnes + bOnes;
    const carry = onesSum >= 10 ? Math.floor(onesSum / 10) : 0;
    const aTens = Math.floor((a % 100) / 10);
    const bTens = Math.floor((b % 100) / 10);
    const tensSum = aTens + bTens + carry;

    const steps: string[] = [
      `1. Jumlahkan angka satuan: ${aOnes} + ${bOnes} = ${onesSum}. ${carry > 0 ? `Tulis angka ${onesSum % 10}, simpan ${carry} di atas puluhan.` : `Tulis angka ${onesSum}.`}`,
      `2. Jumlahkan angka puluhan${carry > 0 ? ` (+ simpanan ${carry})` : ''}: ${aTens} + ${bTens}${carry > 0 ? ` + ${carry}` : ''} = ${tensSum}.`,
      `3. Hasil akhir: ${a} + ${b} = ${answer}.`
    ];

    const verticalFormat: VerticalMathFormat = {
      operand1: a,
      operand2: b,
      operator: '+',
      steps,
    };

    return {
      id,
      hash,
      operation: 'penjumlahan',
      category: 'Aritmatika',
      subCategory: level <= 3 ? 'Penjumlahan Dasar' : 'Penjumlahan Bersusun Menyimpan',
      gradeLevel: grade,
      difficultyLevel: level,
      difficultyLabel,
      question: `Hitunglah hasil dari ${numberSentence}!`,
      numberSentence,
      answer: String(answer),
      explanation: `Langkah: ${a} + ${b} = ${answer}. Mulai dengan menjumlahkan digit satuan paling kanan, lalu simpan jika melebihi 9.`,
      stepByStepSteps: steps,
      hint: `Coba jumlahkan digit satuan (${aOnes} + ${bOnes}) terlebih dahulu.`,
      verticalFormat,
      tags: ['penjumlahan', 'bersusun', 'aritmatika'],
    };
  }

  // 2. PENGURANGAN
  private static generateSubtraction(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    let a = 0;
    let b = 0;

    if (level <= 2) {
      // Under 20, no borrowing
      a = Math.floor(Math.random() * 10) + 10;
      b = Math.floor(Math.random() * (a % 10 + 1));
      if (b === 0) b = 1;
    } else if (level <= 4) {
      // 2-digit without borrowing (e.g. 58 - 23)
      const tensA = Math.floor(Math.random() * 5) + 4;
      const tensB = Math.floor(Math.random() * (tensA - 1)) + 1;
      const onesA = Math.floor(Math.random() * 5) + 4;
      const onesB = Math.floor(Math.random() * onesA) + 1;
      a = tensA * 10 + onesA;
      b = tensB * 10 + onesB;
    } else if (level <= 6) {
      // 2-digit WITH borrowing (e.g. 83 - 27)
      a = Math.floor(Math.random() * 50) + 40; // 40-89
      const onesA = a % 10;
      const onesB = Math.min(9, onesA + Math.floor(Math.random() * 4) + 2); // onesB > onesA
      const tensB = Math.floor(Math.random() * (Math.floor(a / 10) - 1)) + 1;
      b = tensB * 10 + onesB;
      if (b >= a) b = a - 15;
    } else {
      // 3-digit with borrowing (e.g. 342 - 168)
      a = Math.floor(Math.random() * 600) + 250;
      b = Math.floor(Math.random() * (a - 100)) + 60;
    }

    const answer = a - b;
    const numberSentence = `${a} - ${b}`;
    const hash = `sub_${a}_${b}`;

    const aOnes = a % 10;
    const bOnes = b % 10;
    const needsBorrow = aOnes < bOnes;

    const steps: string[] = [
      needsBorrow
        ? `1. Karena ${aOnes} lebih kecil dari ${bOnes}, pinjam 1 dari puluhan menjadi ${aOnes + 10}. Hitung ${aOnes + 10} - ${bOnes} = ${aOnes + 10 - bOnes}.`
        : `1. Kurangkan angka satuan: ${aOnes} - ${bOnes} = ${aOnes - bOnes}.`,
      `2. Kurangkan angka puluhan yang tersisa.`,
      `3. Hasil akhir: ${a} - ${b} = ${answer}.`
    ];

    const verticalFormat: VerticalMathFormat = {
      operand1: a,
      operand2: b,
      operator: '-',
      steps,
    };

    return {
      id,
      hash,
      operation: 'pengurangan',
      category: 'Aritmatika',
      subCategory: needsBorrow ? 'Pengurangan Meminjam' : 'Pengurangan Tanpa Meminjam',
      gradeLevel: grade,
      difficultyLevel: level,
      difficultyLabel,
      question: `Berapakah hasil dari ${numberSentence}?`,
      numberSentence,
      answer: String(answer),
      explanation: `Langkah: ${a} - ${b} = ${answer}.${needsBorrow ? ' Ingat untuk meminjam 1 puluhan (bernilai 10) jika angka atas lebih kecil.' : ''}`,
      stepByStepSteps: steps,
      hint: needsBorrow ? `Perhatikan angka satuan: pinjam 1 dari puluhan.` : `Kurangkan angka satuan terlebih dahulu.`,
      verticalFormat,
      tags: ['pengurangan', 'bersusun', 'meminjam'],
    };
  }

  // 3. PERKALIAN
  private static generateMultiplication(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    let a = 0;
    let b = 0;

    if (level <= 2) {
      // Basic 1-5 times table
      a = Math.floor(Math.random() * 5) + 1;
      b = Math.floor(Math.random() * 9) + 1;
    } else if (level <= 4) {
      // 6-9 times table (e.g. 6 x 7, 8 x 9)
      a = Math.floor(Math.random() * 4) + 6;
      b = Math.floor(Math.random() * 8) + 2;
    } else if (level <= 6) {
      // 2-digit x 1-digit (e.g. 23 × 4, 45 × 6)
      a = Math.floor(Math.random() * 40) + 12;
      b = Math.floor(Math.random() * 7) + 3;
    } else if (level <= 8) {
      // 3-digit x 1-digit (e.g. 125 × 6, 214 × 7)
      a = Math.floor(Math.random() * 200) + 110;
      b = Math.floor(Math.random() * 6) + 4;
    } else {
      // 2-digit x 2-digit (e.g. 24 × 15, 36 × 25)
      a = Math.floor(Math.random() * 35) + 15;
      b = Math.floor(Math.random() * 20) + 12;
    }

    const answer = a * b;
    const numberSentence = `${a} × ${b}`;
    const hash = `mul_${a}_${b}`;

    const steps: string[] = [
      `1. Konsep perkalian adalah penjumlahan berulang atau mengalikan dari digit satuan ke puluhan.`,
      `2. Hitung: ${a} × ${b} = ${answer}.`,
      `3. Hasil kali adalah ${answer}.`
    ];

    const verticalFormat: VerticalMathFormat = {
      operand1: a,
      operand2: b,
      operator: '×',
      steps,
    };

    return {
      id,
      hash,
      operation: 'perkalian',
      category: 'Aritmatika',
      subCategory: a > 10 ? 'Perkalian Bersusun' : 'Tabel Perkalian Dasar',
      gradeLevel: grade,
      difficultyLevel: level,
      difficultyLabel,
      question: `Hitunglah hasil dari ${numberSentence}!`,
      numberSentence,
      answer: String(answer),
      explanation: `${a} × ${b} = ${answer}.`,
      stepByStepSteps: steps,
      hint: a <= 10 ? `Gunakan hafalan tabel perkalian ${a} atau ${b}.` : `Kalikan ${b} dengan angka satuan ${a % 10}, lalu kalikan dengan puluhannya.`,
      verticalFormat,
      tags: ['perkalian', 'bersusun', 'tabel_perkalian'],
    };
  }

  // 4. PEMBAGIAN
  private static generateDivision(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    let divisor = 2;
    let quotient = 2;

    if (level <= 3) {
      // Exact single digit division from multiplication table
      divisor = Math.floor(Math.random() * 8) + 2;
      quotient = Math.floor(Math.random() * 9) + 2;
    } else if (level <= 6) {
      // 2-digit divided by 1-digit (e.g. 84 ÷ 4, 96 ÷ 8, 75 ÷ 5)
      divisor = Math.floor(Math.random() * 6) + 3;
      quotient = Math.floor(Math.random() * 15) + 11;
    } else if (level <= 8) {
      // 3-digit divided by 1-digit (e.g. 144 ÷ 12, 192 ÷ 6, 245 ÷ 5)
      divisor = Math.floor(Math.random() * 7) + 3;
      quotient = Math.floor(Math.random() * 35) + 20;
    } else {
      // Porogapit 3-digit divided by 2-digit (e.g. 360 ÷ 15)
      divisor = Math.floor(Math.random() * 12) + 11;
      quotient = Math.floor(Math.random() * 20) + 12;
    }

    const dividend = divisor * quotient;
    const answer = quotient;
    const numberSentence = `${dividend} ÷ ${divisor}`;
    const hash = `div_${dividend}_${divisor}`;

    const steps: string[] = [
      `1. Cari angka yang jika dikalikan ${divisor} menghasilkan ${dividend}.`,
      `2. Pembagian bersusun (porogapit): ${dividend} ÷ ${divisor} = ${quotient}.`,
      `3. Karena ${quotient} × ${divisor} = ${dividend}, maka sisa pembagian adalah 0. Jawaban: ${quotient}.`
    ];

    const verticalFormat: VerticalMathFormat = {
      operand1: dividend,
      operand2: divisor,
      operator: '÷',
      steps,
    };

    return {
      id,
      hash,
      operation: 'pembagian',
      category: 'Aritmatika',
      subCategory: dividend > 100 ? 'Pembagian Porogapit' : 'Pembagian Dasar',
      gradeLevel: grade,
      difficultyLevel: level,
      difficultyLabel,
      question: `Berapakah hasil bagi dari ${numberSentence}?`,
      numberSentence,
      answer: String(answer),
      explanation: `${dividend} ÷ ${divisor} = ${quotient} (karena ${divisor} × ${quotient} = ${dividend}).`,
      stepByStepSteps: steps,
      hint: `Ingat kebalikan perkalian: ... × ${divisor} = ${dividend}.`,
      verticalFormat,
      tags: ['pembagian', 'porogapit', 'aritmatika'],
    };
  }

  // 5. OPERASI CAMPURAN
  private static generateMixedOperation(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    let questionText = '';
    let answer = 0;
    let steps: string[] = [];

    if (level <= 4) {
      // Addition and Subtraction together: A + B - C
      const a = Math.floor(Math.random() * 30) + 15;
      const b = Math.floor(Math.random() * 25) + 10;
      const c = Math.floor(Math.random() * 20) + 5;
      answer = a + b - c;
      questionText = `${a} + ${b} - ${c}`;
      steps = [
        `1. Kerjakan dari kiri ke kanan: ${a} + ${b} = ${a + b}.`,
        `2. Lanjutkan pengurangan: ${a + b} - ${c} = ${answer}.`
      ];
    } else if (level <= 7) {
      // Multiplication before addition: A + B × C
      const a = Math.floor(Math.random() * 20) + 5;
      const b = Math.floor(Math.random() * 7) + 3;
      const c = Math.floor(Math.random() * 8) + 2;
      answer = a + (b * c);
      questionText = `${a} + (${b} × ${c})`;
      steps = [
        `1. Ingat aturan urutan operasi (KABATAKU): Perkalian harus dihitung lebih dulu.`,
        `2. Hitung perkalian: ${b} × ${c} = ${b * c}.`,
        `3. Tambahkan: ${a} + ${b * c} = ${answer}.`
      ];
    } else {
      // Mixed with brackets & division: (A + B) ÷ C
      const c = Math.floor(Math.random() * 5) + 2;
      const quotient = Math.floor(Math.random() * 10) + 5;
      const sum = c * quotient;
      const a = Math.floor(Math.random() * (sum - 4)) + 2;
      const b = sum - a;
      answer = quotient;
      questionText = `(${a} + ${b}) ÷ ${c}`;
      steps = [
        `1. Operasi di dalam kurung harus dikerjakan paling pertama: ${a} + ${b} = ${sum}.`,
        `2. Bagi hasil kurung dengan ${c}: ${sum} ÷ ${c} = ${answer}.`
      ];
    }

    return {
      id,
      hash: `mix_${questionText}`,
      operation: 'campuran',
      category: 'Aritmatika',
      subCategory: 'Operasi Hitung Campuran',
      gradeLevel: grade,
      difficultyLevel: level,
      difficultyLabel,
      question: `Hitunglah hasil dari: ${questionText}`,
      numberSentence: questionText,
      answer: String(answer),
      explanation: `Urutan pengerjaan KABATAKU: Kurung → Kali/Bagi → Tambah/Kurang. Hasil = ${answer}.`,
      stepByStepSteps: steps,
      hint: `Perhatikan tanda kurung dan dahulukan operasi yang lebih kuat.`,
      tags: ['campuran', 'kabataku', 'urutan_operasi'],
    };
  }

  // 6. SOAL CERITA (Story Problems with Natural Indonesian Contexts)
  private static generateStoryProblem(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    const name = INDONESIAN_NAMES[Math.floor(Math.random() * INDONESIAN_NAMES.length)];
    const friendName = INDONESIAN_NAMES.filter(n => n !== name)[Math.floor(Math.random() * (INDONESIAN_NAMES.length - 1))];
    const item = STORY_ITEMS[Math.floor(Math.random() * STORY_ITEMS.length)];

    const problemTypes = ['tambah', 'kurang', 'kali', 'bagi'];
    const selectedType = problemTypes[Math.floor(Math.random() * (level > 4 ? 4 : 2))];

    let question = '';
    let answer = 0;
    let steps: string[] = [];

    if (selectedType === 'tambah') {
      const q1 = Math.floor(Math.random() * 20 * level) + 12;
      const q2 = Math.floor(Math.random() * 15 * level) + 8;
      answer = q1 + q2;
      question = `${name} memiliki ${q1} ${item.plural} di dalam ${item.container}. Hari ini ${name} ${item.verbBuy} lagi sebanyak ${q2} ${item.plural}. Berapa jumlah seluruh ${item.plural} milik ${name} sekarang?`;
      steps = [
        `Jumlah awal ${item.plural} = ${q1}`,
        `Tambahan yang didapat = ${q2}`,
        `Operasi: ${q1} + ${q2} = ${answer} ${item.plural}.`
      ];
    } else if (selectedType === 'kurang') {
      const q1 = Math.floor(Math.random() * 25 * level) + 25;
      const q2 = Math.floor(Math.random() * (q1 - 5)) + 6;
      answer = q1 - q2;
      question = `${name} memiliki ${q1} ${item.plural}. Ia ${item.verbGive} sebanyak ${q2} ${item.plural} kepada ${friendName}. Berapa sisa ${item.plural} milik ${name} sekarang?`;
      steps = [
        `Jumlah awal ${item.plural} = ${q1}`,
        `Jumlah yang diberikan = ${q2}`,
        `Operasi pengurangan: ${q1} - ${q2} = ${answer} ${item.plural}.`
      ];
    } else if (selectedType === 'kali') {
      const containers = Math.floor(Math.random() * 6) + 3;
      const perContainer = Math.floor(Math.random() * 8) + 4;
      answer = containers * perContainer;
      question = `Ibu meletakkan ${item.plural} ke dalam ${containers} ${item.container}. Jika setiap ${item.container} berisi tepat ${perContainer} ${item.plural}, berapa jumlah seluruh ${item.plural} tersebut?`;
      steps = [
        `Banyak wadah = ${containers}`,
        `Isi per wadah = ${perContainer}`,
        `Operasi perkalian: ${containers} × ${perContainer} = ${answer} ${item.plural}.`
      ];
    } else {
      // Bagi rata
      const friends = Math.floor(Math.random() * 4) + 3;
      const perFriend = Math.floor(Math.random() * 7) + 3;
      const total = friends * perFriend;
      answer = perFriend;
      question = `${name} memiliki ${total} ${item.plural} yang akan dibagikan sama rata kepada ${friends} orang temannya. Berapa banyak ${item.plural} yang diterima oleh setiap anak?`;
      steps = [
        `Total ${item.plural} = ${total}`,
        `Jumlah teman = ${friends} orang`,
        `Operasi pembagian rata: ${total} ÷ ${friends} = ${answer} ${item.plural}.`
      ];
    }

    return {
      id,
      hash: `story_${name}_${item.singular}_${answer}`,
      operation: 'cerita',
      category: 'Soal Cerita',
      subCategory: 'Cerita Kehidupan Sehari-hari',
      gradeLevel: grade,
      difficultyLevel: level,
      difficultyLabel,
      question,
      answer: String(answer),
      explanation: steps.join(' '),
      stepByStepSteps: steps,
      hint: `Baca soal dengan teliti dan tentukan apakah jumlahnya bertambah, berkurang, dikali, atau dibagi.`,
      tags: ['soal_cerita', 'literasi_numerasi', 'kontekstual'],
    };
  }

  // 7. NILAI TEMPAT
  private static generatePlaceValue(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    const val = level <= 3
      ? Math.floor(Math.random() * 90) + 10
      : level <= 6
      ? Math.floor(Math.random() * 900) + 100
      : Math.floor(Math.random() * 9000) + 1000;

    const places = val >= 1000 ? ['ribuan', 'ratusan', 'puluhan', 'satuan'] : val >= 100 ? ['ratusan', 'puluhan', 'satuan'] : ['puluhan', 'satuan'];
    const chosenPlace = places[Math.floor(Math.random() * places.length)];

    let targetDigit = 0;
    let actualValue = 0;
    const str = String(val);

    if (chosenPlace === 'ribuan') {
      targetDigit = Number(str[0]);
      actualValue = targetDigit * 1000;
    } else if (chosenPlace === 'ratusan') {
      targetDigit = Number(str[str.length - 3]);
      actualValue = targetDigit * 100;
    } else if (chosenPlace === 'puluhan') {
      targetDigit = Number(str[str.length - 2]);
      actualValue = targetDigit * 10;
    } else {
      targetDigit = Number(str[str.length - 1]);
      actualValue = targetDigit;
    }

    const isAskingValue = Math.random() > 0.5;
    const question = isAskingValue
      ? `Berapakah nilai angka ${targetDigit} pada bilangan ${val}?`
      : `Pada bilangan ${val}, angka berapakah yang menempati nilai tempat ${chosenPlace}?`;

    const answer = isAskingValue ? String(actualValue) : String(targetDigit);

    const steps = [
      `1. Uraikan bilangan ${val}:`,
      val >= 1000 ? `- Ribuan: ${str[0]} (nilainya ${Number(str[0]) * 1000})` : '',
      val >= 100 ? `- Ratusan: ${str[str.length - 3]} (nilainya ${Number(str[str.length - 3]) * 100})` : '',
      `- Puluhan: ${str[str.length - 2]} (nilainya ${Number(str[str.length - 2]) * 10})`,
      `- Satuan: ${str[str.length - 1]} (nilainya ${Number(str[str.length - 1])})`,
      `2. Jadi jawabannya adalah ${answer}.`
    ].filter(Boolean);

    return {
      id,
      hash: `place_${val}_${chosenPlace}_${isAskingValue}`,
      operation: 'nilai_tempat',
      category: 'Bilangan',
      subCategory: 'Nilai Tempat & Nilai Angka',
      gradeLevel: grade,
      difficultyLevel: level,
      difficultyLabel,
      question,
      answer,
      explanation: `Pada bilangan ${val}, angka ${targetDigit} menempati nilai tempat ${chosenPlace} dengan nilai ${actualValue}.`,
      stepByStepSteps: steps,
      hint: `Perhatikan posisi letak angka dari sebelah kanan (satuan, puluhan, ratusan, ribuan).`,
      tags: ['nilai_tempat', 'puluhan', 'ratusan', 'ribuan'],
    };
  }

  // 8. PECAHAN
  private static generateFractions(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    if (level <= 3) {
      // Visual pizza / pie part: e.g. "Sebuah pizza dipotong 4 bagian sama besar. Jika dimakan 1 potong, berapa bagian yang dimakan?"
      const totalParts = [2, 3, 4, 6, 8][Math.floor(Math.random() * 5)];
      const taken = Math.floor(Math.random() * (totalParts - 1)) + 1;
      const question = `Sebuah kue tart dipotong menjadi ${totalParts} bagian sama besar. Lani memakan ${taken} bagian. Berapa bagian kue yang telah dimakan Lani? (Tulis dalam pecahan, misal 1/2)`;
      return {
        id,
        hash: `frac_tart_${taken}_${totalParts}`,
        operation: 'pecahan',
        category: 'Pecahan',
        subCategory: 'Mengenal Pecahan Dasar',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question,
        answer: `${taken}/${totalParts}`,
        acceptedAnswers: [`${taken}/${totalParts}`, `${taken} / ${totalParts}`],
        explanation: `Bagian yang dimakan adalah pembilang (${taken}) dan total seluruh potongan adalah penyebut (${totalParts}), sehingga pecahannya adalah ${taken}/${totalParts}.`,
        stepByStepSteps: [
          `1. Pembilang = jumlah potongan yang diambil = ${taken}.`,
          `2. Penyebut = jumlah seluruh potongan sama besar = ${totalParts}.`,
          `3. Pecahan = ${taken}/${totalParts}.`
        ],
        hint: `Tulis bagian yang dimakan di atas (pembilang) dan total potongan di bawah (penyebut).`,
        tags: ['pecahan', 'visual_pizza', 'pembilang_penyebut'],
      };
    } else {
      // Penjumlahan pecahan penyebut sama
      const denom = [4, 5, 6, 8, 10][Math.floor(Math.random() * 5)];
      const num1 = Math.floor(Math.random() * (denom - 2)) + 1;
      const num2 = Math.floor(Math.random() * (denom - num1)) + 1;
      const ansNum = num1 + num2;
      const question = `Hitunglah hasil penjumlahan pecahan: ${num1}/${denom} + ${num2}/${denom} = ... (Tulis misal 3/5)`;
      return {
        id,
        hash: `frac_add_${num1}_${num2}_${denom}`,
        operation: 'pecahan',
        category: 'Pecahan',
        subCategory: 'Penjumlahan Pecahan Penyebut Sama',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question,
        answer: `${ansNum}/${denom}`,
        acceptedAnswers: [`${ansNum}/${denom}`, `${ansNum} / ${denom}`],
        explanation: `Karena penyebut sudah sama (${denom}), cukup jumlahkan pembilangnya: ${num1} + ${num2} = ${ansNum}. Hasilnya ${ansNum}/${denom}.`,
        stepByStepSteps: [
          `1. Karena penyebutnya sama (${denom}), penyebut tetap ${denom}.`,
          `2. Jumlahkan pembilang: ${num1} + ${num2} = ${ansNum}.`,
          `3. Hasil pecahan = ${ansNum}/${denom}.`
        ],
        hint: `Jumlahkan hanya angka bagian atas (pembilang). Angka bawah tetap sama.`,
        tags: ['pecahan', 'penjumlahan_pecahan'],
      };
    }
  }

  // 9. PENGUKURAN
  private static generateMeasurement(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    const types = ['panjang', 'berat', 'volume'];
    const chosen = types[Math.floor(Math.random() * types.length)];

    if (chosen === 'panjang') {
      const m = Math.floor(Math.random() * 8) + 2;
      const cm = m * 100;
      return {
        id,
        hash: `meas_m_cm_${m}`,
        operation: 'pengukuran',
        category: 'Pengukuran',
        subCategory: 'Konversi Panjang (m ke cm)',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question: `Panjang pita hiasan adalah ${m} meter. Berapa panjang pita tersebut dalam satuan centimeter (cm)?`,
        answer: String(cm),
        explanation: `1 meter = 100 centimeter. Maka ${m} m = ${m} × 100 = ${cm} cm.`,
        stepByStepSteps: [
          `1. Ingat rumus tangga satuan panjang: 1 meter = 100 cm.`,
          `2. Kalikan nilai meter dengan 100: ${m} × 100 = ${cm}.`,
          `3. Hasil = ${cm} cm.`
        ],
        hint: `Ingat bahwa 1 meter = 100 cm. Kalikan dengan 100.`,
        tags: ['pengukuran', 'satuan_panjang', 'meter_cm'],
      };
    } else if (chosen === 'berat') {
      const kg = Math.floor(Math.random() * 6) + 2;
      const gram = kg * 1000;
      return {
        id,
        hash: `meas_kg_gram_${kg}`,
        operation: 'pengukuran',
        category: 'Pengukuran',
        subCategory: 'Konversi Berat (kg ke gram)',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question: `Ibu membeli ${kg} kilogram gula pasir. Berapa gram berat gula pasir tersebut?`,
        answer: String(gram),
        explanation: `1 kilogram = 1.000 gram. Maka ${kg} kg = ${kg} × 1.000 = ${gram} gram.`,
        stepByStepSteps: [
          `1. Satuan berat: 1 kg = 1.000 gram.`,
          `2. Hitung: ${kg} × 1.000 = ${gram}.`,
          `3. Hasil = ${gram} gram.`
        ],
        hint: `1 kg sama dengan 1.000 gram.`,
        tags: ['pengukuran', 'satuan_berat', 'kg_gram'],
      };
    } else {
      const L = Math.floor(Math.random() * 5) + 1;
      const mL = L * 1000;
      return {
        id,
        hash: `meas_L_mL_${L}`,
        operation: 'pengukuran',
        category: 'Pengukuran',
        subCategory: 'Konversi Volume (Liter ke mL)',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question: `Sebuah teko berisi ${L} liter air sirup. Berapa mililiter (mL) volume air sirup dalam teko?`,
        answer: String(mL),
        explanation: `1 Liter = 1.000 mL. Jadi ${L} L = ${L} × 1.000 = ${mL} mL.`,
        stepByStepSteps: [
          `1. 1 Liter = 1.000 mL.`,
          `2. Kalikan: ${L} × 1.000 = ${mL}.`,
          `3. Hasil = ${mL} mL.`
        ],
        hint: `1 Liter = 1.000 mililiter.`,
        tags: ['pengukuran', 'volume', 'liter_ml'],
      };
    }
  }

  // 10. WAKTU
  private static generateTime(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    if (level <= 3) {
      // Reading simple o'clock or half past
      const hours = Math.floor(Math.random() * 11) + 1;
      const formatted = hours < 10 ? `0${hours}.00` : `${hours}.00`;
      return {
        id,
        hash: `time_clock_${hours}`,
        operation: 'waktu',
        category: 'Waktu',
        subCategory: 'Membaca Jam Analog & Digital',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question: `Jika jarum pendek jam menunjuk tepat ke angka ${hours} dan jarum panjang menunjuk tepat ke angka 12, jam berapakah itu? (Tulis format angka jam, misal ${hours})`,
        answer: String(hours),
        acceptedAnswers: [String(hours), formatted, `jam ${hours}`, `pukul ${hours}`],
        explanation: `Jarum pendek menunjukkan jam (${hours}) dan jarum panjang di angka 12 menunjukkan menit 00. Maka pukul ${formatted}.`,
        stepByStepSteps: [
          `1. Jarum pendek menunjuk jam = ${hours}.`,
          `2. Jarum panjang di 12 = tepat menit ke-00.`,
          `3. Waktu = pukul ${formatted} (atau jam ${hours}).`
        ],
        hint: `Jarum pendek menunjuk angka jam.`,
        tags: ['waktu', 'jam_analog', 'membaca_jam'],
      };
    } else {
      // Duration
      const startHour = Math.floor(Math.random() * 4) + 7; // 7 to 10
      const durationHours = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const endHour = startHour + durationHours;
      return {
        id,
        hash: `time_duration_${startHour}_${endHour}`,
        operation: 'waktu',
        category: 'Waktu',
        subCategory: 'Menghitung Durasi Waktu',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question: `Budi mulai belajar kelompok pukul 0${startHour}.00 dan selesai pukul ${endHour < 10 ? '0' + endHour : endHour}.00. Berapa jam lama Budi belajar kelompok?`,
        answer: String(durationHours),
        acceptedAnswers: [String(durationHours), `${durationHours} jam`],
        explanation: `Lama kegiatan = waktu selesai - waktu mulai: ${endHour} - ${startHour} = ${durationHours} jam.`,
        stepByStepSteps: [
          `1. Waktu selesai = pukul ${endHour}.00.`,
          `2. Waktu mulai = pukul ${startHour}.00.`,
          `3. Selisih = ${endHour} - ${startHour} = ${durationHours} jam.`
        ],
        hint: `Kurangkan jam selesai dengan jam mulai.`,
        tags: ['waktu', 'durasi_kegiatan', 'selisih_jam'],
      };
    }
  }

  // 11. UANG RUPIAH
  private static generateMoney(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    const items = [
      { name: 'buku tulis', price: 5000 },
      { name: 'pensil warna', price: 4000 },
      { name: 'penghapus', price: 2000 },
      { name: 'penggaris', price: 3000 },
      { name: 'kotak bekal', price: 10000 },
      { name: 'botol minum', price: 12000 },
    ];

    const it1 = items[Math.floor(Math.random() * items.length)];
    const it2 = items.filter(i => i.name !== it1.name)[Math.floor(Math.random() * (items.length - 1))];

    const isKembalian = level > 3;

    if (isKembalian) {
      const totalPrice = it1.price + it2.price;
      const payMoney = totalPrice <= 10000 ? 10000 : 20000;
      const change = payMoney - totalPrice;
      return {
        id,
        hash: `money_change_${totalPrice}_${payMoney}`,
        operation: 'uang',
        category: 'Aritmatika Sosial',
        subCategory: 'Uang Kembalian Belanja',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question: `Rina membeli 1 ${it1.name} seharga Rp${it1.price.toLocaleString('id-ID')} dan 1 ${it2.name} seharga Rp${it2.price.toLocaleString('id-ID')}. Jika Rina membayar dengan selembar uang Rp${payMoney.toLocaleString('id-ID')}, berapa uang kembalian yang diterima Rina? (Tulis hanya angka, misal ${change})`,
        answer: String(change),
        acceptedAnswers: [String(change), `Rp${change}`, `Rp ${change}`, `Rp${change.toLocaleString('id-ID')}`],
        explanation: `Total belanja = Rp${it1.price.toLocaleString('id-ID')} + Rp${it2.price.toLocaleString('id-ID')} = Rp${totalPrice.toLocaleString('id-ID')}. Uang kembalian = Rp${payMoney.toLocaleString('id-ID')} - Rp${totalPrice.toLocaleString('id-ID')} = Rp${change.toLocaleString('id-ID')}.`,
        stepByStepSteps: [
          `1. Hitung total belanja: Rp${it1.price.toLocaleString('id-ID')} + Rp${it2.price.toLocaleString('id-ID')} = Rp${totalPrice.toLocaleString('id-ID')}.`,
          `2. Kurangkan uang pembayaran: Rp${payMoney.toLocaleString('id-ID')} - Rp${totalPrice.toLocaleString('id-ID')} = Rp${change.toLocaleString('id-ID')}.`,
          `3. Uang kembalian = Rp${change.toLocaleString('id-ID')}.`
        ],
        hint: `Cari total belanja terlebih dahulu, lalu kurangkan dari uang yang dibayarkan.`,
        tags: ['uang', 'rupiah', 'belanja', 'kembalian'],
      };
    } else {
      const total = it1.price + it2.price;
      return {
        id,
        hash: `money_total_${total}`,
        operation: 'uang',
        category: 'Aritmatika Sosial',
        subCategory: 'Total Harga Belanja',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question: `Budi membeli ${it1.name} seharga Rp${it1.price.toLocaleString('id-ID')} dan ${it2.name} seharga Rp${it2.price.toLocaleString('id-ID')}. Berapakah total belanja yang harus dibayar Budi? (Tulis hanya angka, misal ${total})`,
        answer: String(total),
        acceptedAnswers: [String(total), `Rp${total}`, `Rp ${total}`, `Rp${total.toLocaleString('id-ID')}`],
        explanation: `Total belanja = Rp${it1.price.toLocaleString('id-ID')} + Rp${it2.price.toLocaleString('id-ID')} = Rp${total.toLocaleString('id-ID')}.`,
        stepByStepSteps: [
          `1. Harga barang 1 = Rp${it1.price.toLocaleString('id-ID')}.`,
          `2. Harga barang 2 = Rp${it2.price.toLocaleString('id-ID')}.`,
          `3. Jumlahkan keduanya: ${it1.price} + ${it2.price} = ${total}.`
        ],
        hint: `Jumlahkan harga kedua barang tersebut.`,
        tags: ['uang', 'rupiah', 'total_belanja'],
      };
    }
  }

  // 12. GEOMETRI
  private static generateGeometry(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    if (level <= 3) {
      // Identifying shape sides / corners
      const shapes = [
        { name: 'segitiga', sides: 3, angles: 3 },
        { name: 'persegi', sides: 4, angles: 4 },
        { name: 'persegi panjang', sides: 4, angles: 4 },
        { name: 'segi lima (pentagon)', sides: 5, angles: 5 },
        { name: 'segi enam (heksagon)', sides: 6, angles: 6 },
      ];
      const s = shapes[Math.floor(Math.random() * shapes.length)];
      return {
        id,
        hash: `geom_sides_${s.name}`,
        operation: 'geometri',
        category: 'Geometri',
        subCategory: 'Ciri Bangun Datar',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question: `Berapa banyak sisi yang dimiliki oleh bangun datar ${s.name}?`,
        answer: String(s.sides),
        explanation: `Bangun datar ${s.name} memiliki ${s.sides} sisi dan ${s.angles} sudut.`,
        stepByStepSteps: [
          `1. Bangun datar ${s.name} tersusun dari garis-garis sisi.`,
          `2. Hitung jumlah sisi yang membatasi bangun: ada ${s.sides} sisi.`
        ],
        hint: `Ingat bentuk dari ${s.name} dan hitung garis tepinya.`,
        tags: ['geometri', 'sisi_bangun', 'sudut'],
      };
    } else {
      // Keliling or Luas Persegi / Persegi Panjang
      const isLuas = level > 5;
      if (isLuas) {
        const p = Math.floor(Math.random() * 8) + 4;
        const l = Math.floor(Math.random() * 5) + 2;
        const area = p * l;
        return {
          id,
          hash: `geom_area_${p}_${l}`,
          operation: 'geometri',
          category: 'Geometri',
          subCategory: 'Luas Persegi Panjang',
          gradeLevel: grade,
          difficultyLevel: level,
          difficultyLabel,
          question: `Sebuah kebun berbentuk persegi panjang memiliki panjang ${p} meter dan lebar ${l} meter. Berapakah luas kebun tersebut dalam satuan meter persegi (m²)?`,
          answer: String(area),
          explanation: `Rumus Luas persegi panjang = panjang × lebar = ${p} × ${l} = ${area} m².`,
          stepByStepSteps: [
            `1. Rumus Luas = p × l`,
            `2. Masukkan angka: ${p} × ${l} = ${area}.`,
            `3. Luas = ${area} m².`
          ],
          hint: `Gunakan rumus luas = panjang dikali lebar.`,
          tags: ['geometri', 'luas', 'persegi_panjang'],
        };
      } else {
        const s = Math.floor(Math.random() * 10) + 3;
        const keliling = 4 * s;
        return {
          id,
          hash: `geom_perimeter_sq_${s}`,
          operation: 'geometri',
          category: 'Geometri',
          subCategory: 'Keliling Persegi',
          gradeLevel: grade,
          difficultyLevel: level,
          difficultyLabel,
          question: `Sebuah papan catur berbentuk persegi memiliki panjang sisi ${s} cm. Berapakah keliling papan catur tersebut?`,
          answer: String(keliling),
          explanation: `Keliling persegi = 4 × sisi = 4 × ${s} = ${keliling} cm.`,
          stepByStepSteps: [
            `1. Persegi memiliki 4 sisi yang sama panjang.`,
            `2. Rumus Keliling = 4 × s = 4 × ${s} = ${keliling}.`,
            `3. Keliling = ${keliling} cm.`
          ],
          hint: `Jumlahkan keempat sisinya (sisi + sisi + sisi + sisi) atau 4 × sisi.`,
          tags: ['geometri', 'keliling', 'persegi'],
        };
      }
    }
  }

  // 13. DATA & STATISTIK SEDERHANA
  private static generateData(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    const hobbies = [
      { name: 'Membaca', count: Math.floor(Math.random() * 6) + 4 },
      { name: 'Menggambar', count: Math.floor(Math.random() * 6) + 3 },
      { name: 'Bermain Bola', count: Math.floor(Math.random() * 8) + 5 },
      { name: 'Berenang', count: Math.floor(Math.random() * 5) + 2 },
    ];

    const mostPopular = hobbies.reduce((prev, current) => (prev.count > current.count ? prev : current));
    const totalStudents = hobbies.reduce((sum, h) => sum + h.count, 0);

    const askTotal = Math.random() > 0.5;

    if (askTotal) {
      return {
        id,
        hash: `data_total_${totalStudents}`,
        operation: 'data',
        category: 'Statistika & Data',
        subCategory: 'Membaca Tabel Data',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question: `Data hobi siswa kelas 3: Membaca (${hobbies[0].count} anak), Menggambar (${hobbies[1].count} anak), Bermain Bola (${hobbies[2].count} anak), dan Berenang (${hobbies[3].count} anak). Berapa jumlah total seluruh siswa yang didata?`,
        answer: String(totalStudents),
        explanation: `Jumlah total siswa = ${hobbies[0].count} + ${hobbies[1].count} + ${hobbies[2].count} + ${hobbies[3].count} = ${totalStudents} siswa.`,
        stepByStepSteps: [
          `1. Jumlahkan data setiap kelompok:`,
          `   ${hobbies[0].count} + ${hobbies[1].count} + ${hobbies[2].count} + ${hobbies[3].count} = ${totalStudents}.`,
          `2. Total seluruh siswa adalah ${totalStudents}.`
        ],
        hint: `Jumlahkan semua angka anak pada masing-masing hobi.`,
        tags: ['data', 'tabel', 'penjumlahan_data'],
      };
    } else {
      return {
        id,
        hash: `data_max_${mostPopular.count}`,
        operation: 'data',
        category: 'Statistika & Data',
        subCategory: 'Nilai Tertinggi Data',
        gradeLevel: grade,
        difficultyLevel: level,
        difficultyLabel,
        question: `Data jumlah tabungan: Andi (Rp${hobbies[0].count * 1000}), Budi (Rp${hobbies[1].count * 1000}), Cici (Rp${hobbies[2].count * 1000}), Doni (Rp${hobbies[3].count * 1000}). Berapa rupiah tabungan yang paling banyak? (Tulis angka, misal ${mostPopular.count * 1000})`,
        answer: String(mostPopular.count * 1000),
        explanation: `Tabungan terbanyak adalah Rp${(mostPopular.count * 1000).toLocaleString('id-ID')}.`,
        stepByStepSteps: [
          `1. Bandingkan angka tabungan keempat anak.`,
          `2. Nilai terbesar adalah ${mostPopular.count * 1000}.`
        ],
        hint: `Cari angka terbesar dari data di atas.`,
        tags: ['data', 'terbanyak', 'maksimum'],
      };
    }
  }

  // 14. POLA BILANGAN
  private static generatePattern(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    const stepOptions = [2, 3, 4, 5, 10];
    const step = stepOptions[Math.floor(Math.random() * (level > 4 ? stepOptions.length : 3))];
    const start = Math.floor(Math.random() * 10) + 1;

    const n1 = start;
    const n2 = start + step;
    const n3 = start + 2 * step;
    const n4 = start + 3 * step;
    const missing = start + 4 * step;

    return {
      id,
      hash: `pat_${n1}_${step}`,
      operation: 'pola',
      category: 'Pola & Logika',
      subCategory: 'Pola Bilangan Loncat',
      gradeLevel: grade,
      difficultyLevel: level,
      difficultyLabel,
      question: `Perhatikan barisan bilangan berikut: ${n1}, ${n2}, ${n3}, ${n4}, ... Berapakah angka selanjutnya?`,
      answer: String(missing),
      explanation: `Pola bilangan ini bertambah ${step} pada setiap langkah (${n1} + ${step} = ${n2}, ${n2} + ${step} = ${n3}, ...). Maka angka berikutnya adalah ${n4} + ${step} = ${missing}.`,
      stepByStepSteps: [
        `1. Cari selisih antara dua angka berurutan: ${n2} - ${n1} = ${step}.`,
        `2. Periksa pola berikutnya: ${n3} - ${n2} = ${step} (pola bertambah +${step}).`,
        `3. Hitung angka selanjutnya: ${n4} + ${step} = ${missing}.`
      ],
      hint: `Hitung selisih antara angka pertama dan kedua. Tambahkan selisih itu ke angka terakhir.`,
      tags: ['pola_bilangan', 'barisan_angka', 'kelipatan'],
    };
  }

  // 15. LOGIKA MATEMATIKA
  private static generateLogic(
    id: string,
    level: InternalDifficultyLevel,
    difficultyLabel: WorkbookDifficulty,
    grade: number,
    num: number
  ): GeneratedMathQuestion {
    const mystery = Math.floor(Math.random() * 20) + 10;
    const addVal = Math.floor(Math.random() * 10) + 5;
    const result = mystery + addVal;

    return {
      id,
      hash: `logic_myst_${mystery}_${addVal}`,
      operation: 'logika',
      category: 'Teka-Teki Logika',
      subCategory: 'Tebak Angka Misterius',
      gradeLevel: grade,
      difficultyLevel: level,
      difficultyLabel,
      question: `Aku adalah sebuah bilangan rahasia. Jika aku ditambah dengan ${addVal}, hasilnya menjadi ${result}. Bilangan berapakah aku?`,
      answer: String(mystery),
      explanation: `Untuk mencari bilangan mula-mula, kurangkan hasil akhir dengan penambah: ${result} - ${addVal} = ${mystery}.`,
      stepByStepSteps: [
        `1. Kalimat matematika: Bilangan rahasia + ${addVal} = ${result}.`,
        `2. Kebalikan dari penjumlahan adalah pengurangan: ${result} - ${addVal} = ${mystery}.`,
        `3. Jadi bilangan rahasia tersebut adalah ${mystery}.`
      ],
      hint: `Gunakan cara mundur: kurangkan ${result} dengan ${addVal}.`,
      tags: ['logika', 'aljabar_dasar', 'tebak_angka'],
    };
  }

  // VALIDATION ENGINE (Ensures validity, no NaN, non-negative basic answers, correct math)
  public static validateQuestion(q: GeneratedMathQuestion): boolean {
    if (!q.question || q.question.trim().length === 0) return false;
    if (!q.answer || q.answer.trim().length === 0) return false;
    if (q.question.includes('NaN') || q.answer.includes('NaN')) return false;
    if (q.question.includes('undefined') || q.answer.includes('undefined')) return false;

    // Check deterministic answer correctness for arithmetic operations
    if (q.operation === 'penjumlahan' || q.operation === 'pengurangan' || q.operation === 'perkalian' || q.operation === 'pembagian') {
      if (q.verticalFormat) {
        const op1 = Number(q.verticalFormat.operand1);
        const op2 = Number(q.verticalFormat.operand2);
        const ans = Number(q.answer);

        if (isNaN(op1) || isNaN(op2) || isNaN(ans)) return false;

        if (q.verticalFormat.operator === '+' && op1 + op2 !== ans) return false;
        if (q.verticalFormat.operator === '-' && op1 - op2 !== ans) return false;
        if (q.verticalFormat.operator === '×' && op1 * op2 !== ans) return false;
        if (q.verticalFormat.operator === '÷' && (op2 === 0 || Math.floor(op1 / op2) !== ans)) return false;
      }
    }

    return true;
  }
}
