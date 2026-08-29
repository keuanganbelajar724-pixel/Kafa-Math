export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 0; // 0 for PAUD/TK

export interface GradeQuestion {
  id: string;
  grade: GradeLevel;
  gradeLabel: string;
  topicTitle: string;
  category: string;
  question: string;
  questionDisplay?: {
    type?: 'math' | 'visual' | 'equation' | 'geometry';
    mainText: string;
    subText?: string;
    formula?: string;
    icon?: string;
  };
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  difficulty: 1 | 2 | 3;
}

export class GradeMathEngine {
  public static getGradeLabel(grade: GradeLevel): string {
    if (grade === 0) return 'PAUD / TK';
    return `Kelas ${grade} SD`;
  }

  public static getGradeCurriculumTopics(grade: GradeLevel): string[] {
    switch (grade) {
      case 0:
        return ['Mencacah Benda (1-10)', 'Perbandingan Ukuran', 'Pola Warna & Bentuk'];
      case 1:
        return [
          'Penjumlahan & Pengurangan 1-20',
          'Nilai Tempat (Puluhan & Satuan)',
          'Membandingkan Bilangan (>, <, =)',
          'Membaca Jam Analog',
        ];
      case 2:
        return [
          'Penjumlahan Bersusun Hingga 100',
          'Pengurangan Meminjam Hingga 100',
          'Konsep Perkalian (Penjumlahan Berulang)',
          'Konsep Pembagian (Pengurangan Berulang)',
          'Uang Rupiah & Kembalian',
          'Ciri Bangun Datar (Sisi & Sudut)',
        ];
      case 3:
        return [
          'Tabel Perkalian 1-10 & Ratusan',
          'Pembagian Bersusun Sederhana',
          'Pecahan Visual Dasar (1/2, 1/4, 3/4)',
          'Keliling Persegi & Persegi Panjang',
          'Konversi Satuan Waktu & Panjang',
        ];
      case 4:
        return [
          'KPK & FPB Bilangan',
          'Pecahan Senilai & Desimal Dasar',
          'Luas Persegi, Persegi Panjang & Segitiga',
          'Jenis Sudut (Lancip, Siku, Tumpul)',
          'Membaca Diagram Batang Data',
        ];
      case 5:
        return [
          'Pecahan Beda Penyebut (+ dan -)',
          'Perkalian & Pembagian Pecahan/Desimal',
          'Perbandingan & Skala Peta',
          'Volume Kubus & Balok (cm³ & Liter)',
          'Rata-rata Hitung (Mean Data)',
        ];
      case 6:
        return [
          'Operasi Bilangan Bulat Negatif',
          'Keliling & Luas Lingkaran (π = 22/7 & 3,14)',
          'Volume Tabung & Prisma',
          'Persentase Diskon & Aritmatika Sosial',
          'Statistika (Mean, Median, Modus)',
        ];
      default:
        return ['Aritmatika Matematika'];
    }
  }

  public static generateQuestion(grade: GradeLevel = 2): GradeQuestion {
    const id = `gq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    switch (grade) {
      case 0:
        return this.generatePAUDQuestion(id);
      case 1:
        return this.generateGrade1Question(id);
      case 2:
        return this.generateGrade2Question(id);
      case 3:
        return this.generateGrade3Question(id);
      case 4:
        return this.generateGrade4Question(id);
      case 5:
        return this.generateGrade5Question(id);
      case 6:
        return this.generateGrade6Question(id);
      default:
        return this.generateGrade2Question(id);
    }
  }

  // ==================== PAUD / TK ====================
  private static generatePAUDQuestion(id: string): GradeQuestion {
    const type = Math.floor(Math.random() * 3);
    if (type === 0) {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 4) + 1;
      const ans = a + b;
      const fruits = ['🍎 Apel', '🍌 Pisang', '🍊 Jeruk', '🍓 Stroberi'];
      const fruit = fruits[Math.floor(Math.random() * fruits.length)];
      return {
        id,
        grade: 0,
        gradeLabel: 'PAUD / TK',
        topicTitle: 'Mencacah Benda Ceria',
        category: 'Berhitung Dasar',
        question: `Ada ${a} buah ${fruit} di piring, ditambah ${b} buah lagi. Berapa jumlah semua buah?`,
        questionDisplay: {
          mainText: `${a} + ${b} = ?`,
          subText: `Hitung ${fruit}`,
          icon: '🍎',
        },
        options: this.shuffleOptions([ans.toString(), (ans + 1).toString(), Math.max(1, ans - 1).toString(), (ans + 2).toString()]),
        correctAnswer: ans.toString(),
        explanation: `${a} ditambah ${b} hasilnya adalah ${ans}.`,
        hint: `Coba hitung maju dari ${a} sebanyak ${b} langkah.`,
        difficulty: 1,
      };
    } else if (type === 1) {
      const a = Math.floor(Math.random() * 5) + 4;
      const b = Math.floor(Math.random() * 3) + 1;
      const ans = a - b;
      return {
        id,
        grade: 0,
        gradeLabel: 'PAUD / TK',
        topicTitle: 'Pengurangan Sederhana',
        category: 'Pengurangan',
        question: `Ada ${a} burung di pohon, lalu terbang ${b} ekor. Berapa sisa burung di pohon?`,
        questionDisplay: {
          mainText: `${a} - ${b} = ?`,
          subText: 'Sisa burung',
          icon: '🐦',
        },
        options: this.shuffleOptions([ans.toString(), (ans + 1).toString(), Math.max(1, ans - 1).toString(), (ans + 2).toString()]),
        correctAnswer: ans.toString(),
        explanation: `${a} dikurangi ${b} bersisa ${ans}.`,
        hint: `Hitung mundur dari ${a} sebanyak ${b} kali.`,
        difficulty: 1,
      };
    } else {
      const a = Math.floor(Math.random() * 8) + 1;
      const b = Math.floor(Math.random() * 8) + 1;
      let symbol = '=';
      if (a > b) symbol = 'Lebih Banyak (>)';
      else if (a < b) symbol = 'Lebih Sedikit (<)';
      else symbol = 'Sama Banyak (=)';

      return {
        id,
        grade: 0,
        gradeLabel: 'PAUD / TK',
        topicTitle: 'Perbandingan Banyak Benda',
        category: 'Perbandingan',
        question: `Bandingkan jumlah: ${a} Bintang ... ${b} Bintang. Manakah yang benar?`,
        questionDisplay: {
          mainText: `${a} ⭐ ... ${b} ⭐`,
          subText: 'Bandingkan jumlahnya',
          icon: '⭐',
        },
        options: this.shuffleOptions(['Lebih Banyak (>)', 'Lebih Sedikit (<)', 'Sama Banyak (=)']),
        correctAnswer: symbol,
        explanation: `Karena ${a} ${a > b ? 'lebih besar dari' : a < b ? 'lebih kecil dari' : 'sama dengan'} ${b}, maka jawabannya adalah ${symbol}.`,
        hint: `Lihat angka mana yang lebih besar nilainya.`,
        difficulty: 1,
      };
    }
  }

  // ==================== KELAS 1 SD ====================
  private static generateGrade1Question(id: string): GradeQuestion {
    const type = Math.floor(Math.random() * 4);

    if (type === 0) {
      // Penjumlahan 1-20
      const a = Math.floor(Math.random() * 10) + 6;
      const b = Math.floor(Math.random() * 8) + 3;
      const ans = a + b;
      return {
        id,
        grade: 1,
        gradeLabel: 'Kelas 1 SD',
        topicTitle: 'Penjumlahan Bilangan 1-20',
        category: 'Aritmatika',
        question: `Berapa hasil dari ${a} + ${b}?`,
        questionDisplay: {
          mainText: `${a} + ${b} = ?`,
          icon: '➕',
        },
        options: this.shuffleOptions([ans.toString(), (ans + 1).toString(), (ans - 1).toString(), (ans + 2).toString()]),
        correctAnswer: ans.toString(),
        explanation: `${a} + ${b} = ${ans}.`,
        hint: `Simpan angka ${a} di kepala, lalu hitung maju ${b} jari.`,
        difficulty: 1,
      };
    } else if (type === 1) {
      // Pengurangan 1-20
      const a = Math.floor(Math.random() * 9) + 11; // 11-19
      const b = Math.floor(Math.random() * 8) + 3;
      const ans = a - b;
      return {
        id,
        grade: 1,
        gradeLabel: 'Kelas 1 SD',
        topicTitle: 'Pengurangan Bilangan 1-20',
        category: 'Aritmatika',
        question: `Berapa hasil dari ${a} - ${b}?`,
        questionDisplay: {
          mainText: `${a} - ${b} = ?`,
          icon: '➖',
        },
        options: this.shuffleOptions([ans.toString(), (ans + 1).toString(), Math.max(1, ans - 1).toString(), (ans + 2).toString()]),
        correctAnswer: ans.toString(),
        explanation: `${a} - ${b} = ${ans}.`,
        hint: `Hitung mundur dari ${a} sebanyak ${b} langkah.`,
        difficulty: 1,
      };
    } else if (type === 2) {
      // Nilai Tempat Puluhan & Satuan
      const num = Math.floor(Math.random() * 15) + 11; // 11-25
      const puluhan = Math.floor(num / 10);
      const satuan = num % 10;
      return {
        id,
        grade: 1,
        gradeLabel: 'Kelas 1 SD',
        topicTitle: 'Nilai Tempat Puluhan & Satuan',
        category: 'Bilangan Cacah',
        question: `Bilangan ${num} terdiri dari berapa puluhan dan satuan?`,
        questionDisplay: {
          mainText: `Bilangan ${num}`,
          subText: '... puluhan + ... satuan',
          icon: '📦',
        },
        options: this.shuffleOptions([
          `${puluhan} puluhan + ${satuan} satuan`,
          `${satuan} puluhan + ${puluhan} satuan`,
          `${puluhan + 1} puluhan + ${satuan} satuan`,
          `${puluhan} puluhan + ${satuan + 2} satuan`,
        ]),
        correctAnswer: `${puluhan} puluhan + ${satuan} satuan`,
        explanation: `Angka depan (${puluhan}) adalah puluhan bernilai ${puluhan * 10}, dan angka belakang (${satuan}) adalah satuan.`,
        hint: `Angka di depan adalah puluhan, angka di belakang adalah satuan.`,
        difficulty: 2,
      };
    } else {
      // Jam pas
      const hour = Math.floor(Math.random() * 11) + 1;
      return {
        id,
        grade: 1,
        gradeLabel: 'Kelas 1 SD',
        topicTitle: 'Membaca Jam Analog',
        category: 'Waktu',
        question: `Jarum pendek menunjuk angka ${hour} dan jarum panjang menunjuk angka 12. Pukul berapakah itu?`,
        questionDisplay: {
          mainText: `⏰ Jam ${hour}:00`,
          subText: 'Jarum panjang di angka 12',
          icon: '⏰',
        },
        options: this.shuffleOptions([
          `Pukul ${hour < 10 ? '0' + hour : hour}.00`,
          `Pukul ${hour < 10 ? '0' + hour : hour}.30`,
          `Pukul ${(hour % 12) + 1 < 10 ? '0' + ((hour % 12) + 1) : (hour % 12) + 1}.00`,
          `Pukul 12.0${hour}`,
        ]),
        correctAnswer: `Pukul ${hour < 10 ? '0' + hour : hour}.00`,
        explanation: `Jika jarum panjang tepat menunjuk angka 12, maka waktu menunjukkan tepat pukul ${hour}.00.`,
        hint: `Jarum pendek menunjukkan jam, jika jarum panjang di 12 artinya tepat menit 00.`,
        difficulty: 1,
      };
    }
  }

  // ==================== KELAS 2 SD ====================
  private static generateGrade2Question(id: string): GradeQuestion {
    const type = Math.floor(Math.random() * 4);

    if (type === 0) {
      // Penjumlahan Bersusun Menyimpan (hingga 100)
      const a = Math.floor(Math.random() * 40) + 25;
      const b = Math.floor(Math.random() * 35) + 18;
      const ans = a + b;
      return {
        id,
        grade: 2,
        gradeLabel: 'Kelas 2 SD',
        topicTitle: 'Penjumlahan Bersusun Menyimpan',
        category: 'Operasi Bilangan',
        question: `Berapakah hasil dari ${a} + ${b}?`,
        questionDisplay: {
          mainText: `${a} + ${b} = ?`,
          subText: 'Hitung bersusun dengan teliti',
          icon: '➕',
        },
        options: this.shuffleOptions([ans.toString(), (ans + 10).toString(), (ans - 10).toString(), (ans + 1).toString()]),
        correctAnswer: ans.toString(),
        explanation: `Jumlahkan satuan: ${(a % 10)} + ${(b % 10)} = ${(a % 10) + (b % 10)}. Lalu jumlahkan puluhannya, diperoleh ${ans}.`,
        hint: `Jumlahkan satuan terlebih dahulu, jangan lupa menyimpan 1 jika hasilnya 10 atau lebih.`,
        difficulty: 2,
      };
    } else if (type === 1) {
      // Konsep Perkalian sebagai Penjumlahan Berulang
      const a = Math.floor(Math.random() * 4) + 2; // misal 3
      const b = Math.floor(Math.random() * 5) + 3; // misal 4
      const ans = a * b;
      const repeated = Array(a).fill(b).join(' + ');
      return {
        id,
        grade: 2,
        gradeLabel: 'Kelas 2 SD',
        topicTitle: 'Konsep Perkalian Dasar',
        category: 'Perkalian',
        question: `Bentuk perkalian ${a} × ${b} sama dengan penjumlahan berulang...`,
        questionDisplay: {
          mainText: `${a} × ${b} = ?`,
          subText: `${a} kali angka ${b}`,
          icon: '✖️',
        },
        options: this.shuffleOptions([
          `${repeated} = ${ans}`,
          `${Array(b).fill(a).join(' + ')} = ${ans}`,
          `${repeated} = ${ans + a}`,
          `${a} + ${b} = ${a + b}`,
        ]),
        correctAnswer: `${repeated} = ${ans}`,
        explanation: `${a} × ${b} artinya angka ${b} dijumlahkan sebanyak ${a} kali (${repeated} = ${ans}).`,
        hint: `Angka pertama adalah berapa kali jumlahnya, angka kedua adalah bilangan yang dijumlahkan.`,
        difficulty: 2,
      };
    } else if (type === 2) {
      // Pecahan Uang Rupiah
      const harga = (Math.floor(Math.random() * 5) + 3) * 1000; // Rp3.000 - Rp7.000
      const bayar = 10000;
      const kembalian = bayar - harga;
      return {
        id,
        grade: 2,
        gradeLabel: 'Kelas 2 SD',
        topicTitle: 'Uang Rupiah & Kembalian',
        category: 'Uang',
        question: `Budi membeli buku tulis seharga Rp${harga.toLocaleString('id-ID')} dan membayar dengan uang Rp10.000. Berapa uang kembalian yang diterima Budi?`,
        questionDisplay: {
          mainText: `Rp10.000 - Rp${harga.toLocaleString('id-ID')}`,
          subText: 'Hitung uang kembalian kasir',
          icon: '💵',
        },
        options: this.shuffleOptions([
          `Rp${kembalian.toLocaleString('id-ID')}`,
          `Rp${(kembalian + 1000).toLocaleString('id-ID')}`,
          `Rp${(kembalian - 1000).toLocaleString('id-ID')}`,
          `Rp${(kembalian + 2000).toLocaleString('id-ID')}`,
        ]),
        correctAnswer: `Rp${kembalian.toLocaleString('id-ID')}`,
        explanation: `Uang kembalian = Rp10.000 - Rp${harga.toLocaleString('id-ID')} = Rp${kembalian.toLocaleString('id-ID')}.`,
        hint: `Kurangi uang yang dibayarkan dengan harga barang.`,
        difficulty: 2,
      };
    } else {
      // Ciri Bangun Datar
      const shapes = [
        { name: 'Segitiga', sisi: 3, sudut: 3 },
        { name: 'Persegi', sisi: 4, sudut: 4 },
        { name: 'Segi lima', sisi: 5, sudut: 5 },
      ];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      return {
        id,
        grade: 2,
        gradeLabel: 'Kelas 2 SD',
        topicTitle: 'Ciri Bangun Datar',
        category: 'Geometri',
        question: `Berapa banyak sisi dan titik sudut yang dimiliki oleh bangun datar ${shape.name}?`,
        questionDisplay: {
          mainText: `Bangun ${shape.name}`,
          subText: 'Hitung sisi & sudut',
          icon: '📐',
        },
        options: this.shuffleOptions([
          `${shape.sisi} sisi dan ${shape.sudut} sudut`,
          `${shape.sisi + 1} sisi dan ${shape.sudut} sudut`,
          `${shape.sisi} sisi dan ${shape.sudut - 1} sudut`,
          `2 sisi dan 2 sudut`,
        ]),
        correctAnswer: `${shape.sisi} sisi dan ${shape.sudut} sudut`,
        explanation: `Bangun datar ${shape.name} memiliki ${shape.sisi} sisi ruas garis dan ${shape.sudut} titik sudut.`,
        hint: `Hitung setiap garis lurus dan pojok lancipnya.`,
        difficulty: 1,
      };
    }
  }

  // ==================== KELAS 3 SD ====================
  private static generateGrade3Question(id: string): GradeQuestion {
    const type = Math.floor(Math.random() * 4);

    if (type === 0) {
      // Perkalian 2 digit x 1 digit
      const a = Math.floor(Math.random() * 15) + 12; // 12-26
      const b = Math.floor(Math.random() * 6) + 4; // 4-9
      const ans = a * b;
      return {
        id,
        grade: 3,
        gradeLabel: 'Kelas 3 SD',
        topicTitle: 'Perkalian Puluhan Bersusun',
        category: 'Perkalian',
        question: `Hitunglah hasil dari ${a} × ${b} = ...`,
        questionDisplay: {
          mainText: `${a} × ${b} = ?`,
          subText: 'Gunakan perkalian bersusun',
          icon: '✖️',
        },
        options: this.shuffleOptions([ans.toString(), (ans + b).toString(), (ans - b).toString(), (ans + 10).toString()]),
        correctAnswer: ans.toString(),
        explanation: `${a} × ${b} = ${(a % 10) * b} + ${(Math.floor(a / 10) * 10) * b} = ${ans}.`,
        hint: `Kalikan satuan (${a % 10} × ${b}), lalu kalikan puluhan (${Math.floor(a / 10) * 10} × ${b}), kemudian jumlahkan.`,
        difficulty: 2,
      };
    } else if (type === 1) {
      // Pembagian Sederhana
      const div = Math.floor(Math.random() * 6) + 3; // 3-8
      const ans = Math.floor(Math.random() * 9) + 4; // 4-12
      const total = div * ans;
      return {
        id,
        grade: 3,
        gradeLabel: 'Kelas 3 SD',
        topicTitle: 'Pembagian Bilangan Cacah',
        category: 'Pembagian',
        question: `Ibu membagikan ${total} permen sama rata kepada ${div} orang anak. Berapa permen yang didapat setiap anak?`,
        questionDisplay: {
          mainText: `${total} : ${div} = ?`,
          subText: 'Bagi sama rata',
          icon: '➗',
        },
        options: this.shuffleOptions([ans.toString(), (ans + 1).toString(), Math.max(1, ans - 1).toString(), (ans + 2).toString()]),
        correctAnswer: ans.toString(),
        explanation: `${total} dibagi ${div} sama dengan ${ans}, karena ${ans} × ${div} = ${total}.`,
        hint: `Pikirkan angka berapa yang jika dikalikan ${div} menghasilkan ${total}.`,
        difficulty: 2,
      };
    } else if (type === 2) {
      // Pecahan Sederhana
      const penyebut = [2, 3, 4, 6, 8][Math.floor(Math.random() * 5)];
      const pembilang = 1;
      return {
        id,
        grade: 3,
        gradeLabel: 'Kelas 3 SD',
        topicTitle: 'Pecahan Sederhana',
        category: 'Pecahan',
        question: `Sebuah martabak dipotong menjadi ${penyebut} bagian sama besar. Rina memakan 1 bagian. Berapa bagian yang dimakan Rina dalam bentuk pecahan?`,
        questionDisplay: {
          mainText: `1 dari ${penyebut} potong martabak`,
          subText: 'Bentuk pecahan',
          icon: '🍕',
        },
        options: this.shuffleOptions([`1/${penyebut}`, `${penyebut}/1`, `1/${penyebut + 1}`, `${penyebut - 1}/${penyebut}`]),
        correctAnswer: `1/${penyebut}`,
        explanation: `1 bagian yang dimakan menjadi pembilang (atas), dan total ${penyebut} bagian menjadi penyebut (bawah), ditulis 1/${penyebut}.`,
        hint: `Bagian yang diambil di atas (pembilang), jumlah seluruh potongan di bawah (penyebut).`,
        difficulty: 1,
      };
    } else {
      // Keliling Persegi Panjang
      const p = Math.floor(Math.random() * 6) + 6; // 6-11
      const l = Math.floor(Math.random() * 4) + 3; // 3-6
      const k = 2 * (p + l);
      return {
        id,
        grade: 3,
        gradeLabel: 'Kelas 3 SD',
        topicTitle: 'Keliling Persegi Panjang',
        category: 'Geometri & Pengukuran',
        question: `Sebuah buku memiliki panjang ${p} cm dan lebar ${l} cm. Berapakah keliling buku tersebut?`,
        questionDisplay: {
          mainText: `Panjang = ${p} cm, Lebar = ${l} cm`,
          subText: 'Rumus: 2 × (Panjang + Lebar)',
          icon: '📏',
        },
        options: this.shuffleOptions([`${k} cm`, `${p * l} cm`, `${k + 4} cm`, `${p + l} cm`]),
        correctAnswer: `${k} cm`,
        explanation: `Keliling = 2 × (p + l) = 2 × (${p} + ${l}) = 2 × ${p + l} = ${k} cm.`,
        hint: `Jumlahkan panjang dan lebar lalu kalikan dengan 2.`,
        difficulty: 2,
      };
    }
  }

  // ==================== KELAS 4 SD ====================
  private static generateGrade4Question(id: string): GradeQuestion {
    const type = Math.floor(Math.random() * 4);

    if (type === 0) {
      // KPK & FPB
      const pairs = [
        { a: 4, b: 6, kpk: 12, fpb: 2 },
        { a: 6, b: 8, kpk: 24, fpb: 2 },
        { a: 6, b: 9, kpk: 18, fpb: 3 },
        { a: 8, b: 12, kpk: 24, fpb: 4 },
        { a: 12, b: 15, kpk: 60, fpb: 3 },
        { a: 10, b: 15, kpk: 30, fpb: 5 },
      ];
      const selected = pairs[Math.floor(Math.random() * pairs.length)];
      const askKPK = Math.random() > 0.5;
      const ans = askKPK ? selected.kpk : selected.fpb;
      return {
        id,
        grade: 4,
        gradeLabel: 'Kelas 4 SD',
        topicTitle: askKPK ? 'KPK (Kelipatan Persekutuan Terkecil)' : 'FPB (Faktor Persekutuan Terbesar)',
        category: 'Bilangan',
        question: `Berapakah ${askKPK ? 'KPK' : 'FPB'} dari bilangan ${selected.a} dan ${selected.b}?`,
        questionDisplay: {
          mainText: `${askKPK ? 'KPK' : 'FPB'} (${selected.a}, ${selected.b}) = ?`,
          icon: '🔢',
        },
        options: this.shuffleOptions([ans.toString(), (ans + 2).toString(), Math.max(1, ans - 2).toString(), (selected.a * selected.b).toString()]),
        correctAnswer: ans.toString(),
        explanation: askKPK
          ? `Kelipatan ${selected.a} = ${selected.a}, ${selected.a * 2}, ... dan kelipatan ${selected.b} = ${selected.b}, ${selected.b * 2}, ... KPK terkecil yang sama adalah ${selected.kpk}.`
          : `Faktor terbesar yang dapat membagi ${selected.a} dan ${selected.b} adalah ${selected.fpb}.`,
        hint: askKPK ? `Cari angka terkecil yang bisa dibagi habis oleh ${selected.a} dan ${selected.b}.` : `Cari angka pembagi terbesar yang bisa membagi kedua angka tersebut.`,
        difficulty: 2,
      };
    } else if (type === 1) {
      // Pecahan Senilai & Desimal
      const fracts = [
        { frac: '1/2', dec: '0,5' },
        { frac: '1/4', dec: '0,25' },
        { frac: '3/4', dec: '0,75' },
        { frac: '1/5', dec: '0,2' },
        { frac: '2/5', dec: '0,4' },
      ];
      const selected = fracts[Math.floor(Math.random() * fracts.length)];
      return {
        id,
        grade: 4,
        gradeLabel: 'Kelas 4 SD',
        topicTitle: 'Pecahan Biasa ke Bentuk Desimal',
        category: 'Pecahan',
        question: `Bentuk desimal dari pecahan ${selected.frac} adalah...`,
        questionDisplay: {
          mainText: `${selected.frac} = ... (desimal)`,
          icon: '✨',
        },
        options: this.shuffleOptions([selected.dec, '0,15', '0,8', '1,2']),
        correctAnswer: selected.dec,
        explanation: `Untuk mengubah ${selected.frac} ke desimal, bagi pembilang dengan penyebut, hasilnya adalah ${selected.dec}.`,
        hint: `Ubah penyebut menjadi per sepuluh atau per seratus.`,
        difficulty: 2,
      };
    } else if (type === 2) {
      // Luas Persegi & Persegi Panjang
      const isSquare = Math.random() > 0.5;
      if (isSquare) {
        const s = Math.floor(Math.random() * 6) + 5; // 5-10
        const luas = s * s;
        return {
          id,
          grade: 4,
          gradeLabel: 'Kelas 4 SD',
          topicTitle: 'Luas Persegi',
          category: 'Geometri',
          question: `Sebuah ubin berbentuk persegi memiliki panjang sisi ${s} cm. Berapakah luas ubin tersebut?`,
          questionDisplay: {
            mainText: `Sisi (s) = ${s} cm`,
            subText: 'Rumus Luas = sisi × sisi',
            icon: '⏹️',
          },
          options: this.shuffleOptions([`${luas} cm²`, `${s * 4} cm²`, `${luas + 10} cm²`, `${(s + 2) * s} cm²`]),
          correctAnswer: `${luas} cm²`,
          explanation: `Luas persegi = s × s = ${s} × ${s} = ${luas} cm².`,
          hint: `Kalikan panjang sisi dengan sisi itu sendiri.`,
          difficulty: 2,
        };
      } else {
        const p = Math.floor(Math.random() * 6) + 8;
        const l = Math.floor(Math.random() * 4) + 4;
        const luas = p * l;
        return {
          id,
          grade: 4,
          gradeLabel: 'Kelas 4 SD',
          topicTitle: 'Luas Persegi Panjang',
          category: 'Geometri',
          question: `Sebuah papan tulis berukuran panjang ${p} dm dan lebar ${l} dm. Berapakah luas papan tulis tersebut?`,
          questionDisplay: {
            mainText: `p = ${p} dm, l = ${l} dm`,
            subText: 'Rumus Luas = p × l',
            icon: '▭',
          },
          options: this.shuffleOptions([`${luas} dm²`, `${2 * (p + l)} dm²`, `${luas + 6} dm²`, `${(p + 2) * l} dm²`]),
          correctAnswer: `${luas} dm²`,
          explanation: `Luas persegi panjang = p × l = ${p} × ${l} = ${luas} dm².`,
          hint: `Kalikan panjang dengan lebarnya.`,
          difficulty: 2,
        };
      }
    } else {
      // Sudut
      const angleTypes = [
        { name: 'Sudut Lancip', deg: '45°', desc: 'Besarnya kurang dari 90°' },
        { name: 'Sudut Siku-Siku', deg: '90°', desc: 'Besarnya tepat 90° (membentuk tegak lurus)' },
        { name: 'Sudut Tumpul', deg: '120°', desc: 'Besarnya lebih dari 90° dan kurang dari 180°' },
      ];
      const selected = angleTypes[Math.floor(Math.random() * angleTypes.length)];
      return {
        id,
        grade: 4,
        gradeLabel: 'Kelas 4 SD',
        topicTitle: 'Mengenal Jenis-Jenis Sudut',
        category: 'Geometri',
        question: `Sudut yang memiliki besar ${selected.deg} disebut sebagai...`,
        questionDisplay: {
          mainText: `Besar Sudut = ${selected.deg}`,
          subText: selected.desc,
          icon: '📐',
        },
        options: this.shuffleOptions(['Sudut Lancip', 'Sudut Siku-Siku', 'Sudut Tumpul', 'Sudut Lurus']),
        correctAnswer: selected.name,
        explanation: `${selected.name} memiliki besar ${selected.deg}. Sudut lancip (<90°), siku-siku (90°), dan tumpul (>90°).`,
        hint: `Ingat patokan sudut siku-siku adalah 90 derajat.`,
        difficulty: 1,
      };
    }
  }

  // ==================== KELAS 5 SD ====================
  private static generateGrade5Question(id: string): GradeQuestion {
    const type = Math.floor(Math.random() * 4);

    if (type === 0) {
      // Pecahan Penjumlahan Beda Penyebut: 1/2 + 1/3 = 5/6, 1/4 + 1/2 = 3/4, 2/3 + 1/6 = 5/6
      const problems = [
        { q: '1/2 + 1/3', ans: '5/6', exp: 'Samakan penyebut ke 6: 3/6 + 2/6 = 5/6' },
        { q: '1/4 + 1/2', ans: '3/4', exp: 'Samakan penyebut ke 4: 1/4 + 2/4 = 3/4' },
        { q: '2/5 + 1/2', ans: '9/10', exp: 'Samakan penyebut ke 10: 4/10 + 5/10 = 9/10' },
        { q: '3/4 - 1/2', ans: '1/4', exp: 'Samakan penyebut ke 4: 3/4 - 2/4 = 1/4' },
        { q: '2/3 - 1/6', ans: '1/2', exp: 'Samakan penyebut ke 6: 4/6 - 1/6 = 3/6 = 1/2' },
      ];
      const selected = problems[Math.floor(Math.random() * problems.length)];
      return {
        id,
        grade: 5,
        gradeLabel: 'Kelas 5 SD',
        topicTitle: 'Operasi Pecahan Beda Penyebut',
        category: 'Pecahan Lanjutan',
        question: `Berapakah hasil dari ${selected.q}?`,
        questionDisplay: {
          mainText: `${selected.q} = ?`,
          subText: 'Samakan penyebut menggunakan KPK',
          icon: '½',
        },
        options: this.shuffleOptions([selected.ans, '2/5', '4/6', '7/12']),
        correctAnswer: selected.ans,
        explanation: selected.exp,
        hint: `Cari KPK dari kedua penyebut untuk menyamakannya terlebih dahulu.`,
        difficulty: 3,
      };
    } else if (type === 1) {
      // Skala & Perbandingan Peta
      const jarakPeta = Math.floor(Math.random() * 4) + 3; // 3-6 cm
      const skala = 500000; // 1 : 500.000 (1 cm = 5 km)
      const km = jarakPeta * 5;
      return {
        id,
        grade: 5,
        gradeLabel: 'Kelas 5 SD',
        topicTitle: 'Skala & Jarak Sebenarnya',
        category: 'Perbandingan',
        question: `Pada peta berskala 1 : 500.000, jarak kota A ke kota B adalah ${jarakPeta} cm. Berapakah jarak sebenarnya kedua kota tersebut?`,
        questionDisplay: {
          mainText: `Skala = 1 : 500.000`,
          subText: `Jarak pada peta = ${jarakPeta} cm`,
          icon: '🗺️',
        },
        options: this.shuffleOptions([`${km} km`, `${km * 10} km`, `${km / 2} km`, `${km + 5} km`]),
        correctAnswer: `${km} km`,
        explanation: `Jarak sebenarnya = Jarak Peta × Skala = ${jarakPeta} × 500.000 cm = ${jarakPeta * 500000} cm = ${km} km.`,
        hint: `Ingat 100.000 cm = 1 km. Jadi 500.000 cm = 5 km per cm peta.`,
        difficulty: 2,
      };
    } else if (type === 2) {
      // Volume Kubus & Balok
      const isCube = Math.random() > 0.5;
      if (isCube) {
        const s = [3, 4, 5, 6, 8][Math.floor(Math.random() * 5)];
        const vol = s * s * s;
        return {
          id,
          grade: 5,
          gradeLabel: 'Kelas 5 SD',
          topicTitle: 'Volume Kubus',
          category: 'Bangun Ruang',
          question: `Sebuah bak mandi berbentuk kubus memiliki rusuk panjang ${s} dm. Berapakah volume air dalam bak mandi tersebut (dalam liter)?`,
          questionDisplay: {
            mainText: `Rusuk kubus (s) = ${s} dm`,
            subText: '1 dm³ = 1 Liter (Rumus: s³)',
            icon: '🧊',
          },
          options: this.shuffleOptions([`${vol} Liter`, `${s * s * 6} Liter`, `${vol + 20} Liter`, `${s * 12} Liter`]),
          correctAnswer: `${vol} Liter`,
          explanation: `Volume kubus = s × s × s = ${s}³ = ${vol} dm³ = ${vol} Liter.`,
          hint: `Rumus volume kubus adalah sisi dipangkatkan tiga (s × s × s).`,
          difficulty: 2,
        };
      } else {
        const p = 8;
        const l = 5;
        const t = 4;
        const vol = p * l * t;
        return {
          id,
          grade: 5,
          gradeLabel: 'Kelas 5 SD',
          topicTitle: 'Volume Balok',
          category: 'Bangun Ruang',
          question: `Sebuah balok memiliki panjang ${p} cm, lebar ${l} cm, dan tinggi ${t} cm. Berapakah volume balok tersebut?`,
          questionDisplay: {
            mainText: `p = ${p} cm, l = ${l} cm, t = ${t} cm`,
            subText: 'Rumus V = p × l × t',
            icon: '📦',
          },
          options: this.shuffleOptions([`${vol} cm³`, `${vol / 2} cm³`, `${2 * (p * l + p * t + l * t)} cm³`, `${vol + 20} cm³`]),
          correctAnswer: `${vol} cm³`,
          explanation: `Volume balok = p × l × t = ${p} × ${l} × ${t} = ${vol} cm³.`,
          hint: `Kalikan ketiga dimensi: panjang × lebar × tinggi.`,
          difficulty: 2,
        };
      }
    } else {
      // Mean (Rata-rata)
      const data = [70, 80, 90, 80];
      const sum = data.reduce((a, b) => a + b, 0);
      const avg = sum / data.length;
      return {
        id,
        grade: 5,
        gradeLabel: 'Kelas 5 SD',
        topicTitle: 'Nilai Rata-rata (Mean Data)',
        category: 'Statistika',
        question: `Nilai ulangan matematika Budi adalah 70, 80, 90, dan 80. Berapakah nilai rata-rata ulangan Budi?`,
        questionDisplay: {
          mainText: `Data: 70, 80, 90, 80`,
          subText: 'Rata-rata = Jumlah Data ÷ Banyak Data',
          icon: '📊',
        },
        options: this.shuffleOptions([avg.toString(), (avg + 5).toString(), (avg - 5).toString(), '85']),
        correctAnswer: avg.toString(),
        explanation: `Rata-rata = (70 + 80 + 90 + 80) ÷ 4 = ${sum} ÷ 4 = ${avg}.`,
        hint: `Jumlahkan semua nilai lalu bagi dengan banyaknya ulangan (4).`,
        difficulty: 2,
      };
    }
  }

  // ==================== KELAS 6 SD ====================
  private static generateGrade6Question(id: string): GradeQuestion {
    const type = Math.floor(Math.random() * 4);

    if (type === 0) {
      // Bilangan Bulat Negatif
      const subType = Math.floor(Math.random() * 3);
      if (subType === 0) {
        const a = -(Math.floor(Math.random() * 9) + 4); // -4 to -12
        const b = Math.floor(Math.random() * 15) + 6;
        const ans = a + b;
        return {
          id,
          grade: 6,
          gradeLabel: 'Kelas 6 SD',
          topicTitle: 'Operasi Bilangan Bulat Negatif',
          category: 'Bilangan Bulat',
          question: `Berapakah hasil dari (${a}) + ${b}?`,
          questionDisplay: {
            mainText: `(${a}) + ${b} = ?`,
            subText: 'Garis bilangan bulat',
            icon: '➖',
          },
          options: this.shuffleOptions([ans.toString(), (-ans).toString(), (ans + 4).toString(), (ans - 4).toString()]),
          correctAnswer: ans.toString(),
          explanation: `(${a}) + ${b} = ${b} - ${Math.abs(a)} = ${ans}.`,
          hint: `Ibaratkan memiliki hutang ${Math.abs(a)} dibayar ${b}.`,
          difficulty: 2,
        };
      } else {
        const a = -(Math.floor(Math.random() * 6) + 3);
        const b = Math.floor(Math.random() * 6) + 3;
        const ans = a * b;
        return {
          id,
          grade: 6,
          gradeLabel: 'Kelas 6 SD',
          topicTitle: 'Perkalian Bilangan Bulat Negatif',
          category: 'Bilangan Bulat',
          question: `Berapakah hasil dari (${a}) × ${b}?`,
          questionDisplay: {
            mainText: `(${a}) × ${b} = ?`,
            subText: 'Negatif × Positif = Negatif',
            icon: '✖️',
          },
          options: this.shuffleOptions([ans.toString(), (-ans).toString(), (ans - 5).toString(), (-(ans + 5)).toString()]),
          correctAnswer: ans.toString(),
          explanation: `Bilangan negatif dikalikan bilangan positif hasilnya selalu negatif: (${a}) × ${b} = ${ans}.`,
          hint: `Kalikan angkanya seperti biasa, lalu beri tanda minus (-) di depannya.`,
          difficulty: 2,
        };
      }
    } else if (type === 1) {
      // Keliling & Luas Lingkaran (π = 22/7)
      const r = [7, 14, 21][Math.floor(Math.random() * 3)];
      const askArea = Math.random() > 0.5;
      if (askArea) {
        const luas = (22 / 7) * r * r;
        return {
          id,
          grade: 6,
          gradeLabel: 'Kelas 6 SD',
          topicTitle: 'Luas Lingkaran (π = 22/7)',
          category: 'Geometri Lingkaran',
          question: `Sebuah taman berbentuk lingkaran memiliki jari-jari (r) = ${r} cm. Berapakah luas taman tersebut? (Gunakan π = 22/7)`,
          questionDisplay: {
            mainText: `Jari-jari (r) = ${r} cm`,
            subText: 'Rumus Luas = π × r²',
            icon: '⭕',
          },
          options: this.shuffleOptions([`${luas} cm²`, `${luas / 2} cm²`, `${2 * (22 / 7) * r} cm²`, `${luas + 44} cm²`]),
          correctAnswer: `${luas} cm²`,
          explanation: `Luas = π × r² = (22/7) × ${r} × ${r} = ${luas} cm².`,
          hint: `Gunakan rumus π × r × r dengan π = 22/7.`,
          difficulty: 3,
        };
      } else {
        const keliling = 2 * (22 / 7) * r;
        return {
          id,
          grade: 6,
          gradeLabel: 'Kelas 6 SD',
          topicTitle: 'Keliling Lingkaran',
          category: 'Geometri Lingkaran',
          question: `Berapakah keliling roda sepeda dengan jari-jari ${r} cm? (Gunakan π = 22/7)`,
          questionDisplay: {
            mainText: `Jari-jari (r) = ${r} cm`,
            subText: 'Rumus Keliling = 2 × π × r',
            icon: '🚲',
          },
          options: this.shuffleOptions([`${keliling} cm`, `${keliling * 2} cm`, `${keliling - 22} cm`, `${(22 / 7) * r * r} cm`]),
          correctAnswer: `${keliling} cm`,
          explanation: `Keliling = 2 × π × r = 2 × (22/7) × ${r} = ${keliling} cm.`,
          hint: `Keliling lingkaran adalah 2 kali π dikali jari-jari.`,
          difficulty: 3,
        };
      }
    } else if (type === 2) {
      // Diskon & Aritmatika Sosial
      const hargaAwal = [50000, 80000, 100000, 120000][Math.floor(Math.random() * 4)];
      const diskonPersen = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
      const potongan = (diskonPersen / 100) * hargaAwal;
      const hargaBayar = hargaAwal - potongan;
      return {
        id,
        grade: 6,
        gradeLabel: 'Kelas 6 SD',
        topicTitle: 'Aritmatika Sosial: Diskon Belanja',
        category: 'Persentase',
        question: `Sebuah sepatu seharga Rp${hargaAwal.toLocaleString('id-ID')} mendapat diskon ${diskonPersen}%. Berapakah harga yang harus dibayar setelah diskon?`,
        questionDisplay: {
          mainText: `Harga: Rp${hargaAwal.toLocaleString('id-ID')}`,
          subText: `Diskon ${diskonPersen}%`,
          icon: '🏷️',
        },
        options: this.shuffleOptions([
          `Rp${hargaBayar.toLocaleString('id-ID')}`,
          `Rp${potongan.toLocaleString('id-ID')}`,
          `Rp${(hargaBayar + 10000).toLocaleString('id-ID')}`,
          `Rp${(hargaBayar - 5000).toLocaleString('id-ID')}`,
        ]),
        correctAnswer: `Rp${hargaBayar.toLocaleString('id-ID')}`,
        explanation: `Potongan diskon = ${diskonPersen}% × Rp${hargaAwal.toLocaleString('id-ID')} = Rp${potongan.toLocaleString('id-ID')}. Harga bayar = Rp${hargaAwal.toLocaleString('id-ID')} - Rp${potongan.toLocaleString('id-ID')} = Rp${hargaBayar.toLocaleString('id-ID')}.`,
        hint: `Hitung besar potongan harga terlebih dahulu, lalu kurangkan dari harga awal.`,
        difficulty: 3,
      };
    } else {
      // Modus & Median Data
      return {
        id,
        grade: 6,
        gradeLabel: 'Kelas 6 SD',
        topicTitle: 'Modus & Median Statistika',
        category: 'Statistika',
        question: `Diberikan data nilai: 6, 7, 7, 8, 8, 8, 9, 10. Nilai yang paling sering muncul (Modus) dari data tersebut adalah...`,
        questionDisplay: {
          mainText: `Data: 6, 7, 7, 8, 8, 8, 9, 10`,
          subText: 'Tentukan Modus (nilai terbanyak)',
          icon: '📈',
        },
        options: this.shuffleOptions(['8', '7', '9', '6']),
        correctAnswer: '8',
        explanation: `Modus adalah nilai dengan frekuensi kemunculan terbanyak. Angka 8 muncul sebanyak 3 kali, lebih banyak dari angka lainnya.`,
        hint: `Cari angka yang ditulis paling banyak di dalam daftar data tersebut.`,
        difficulty: 1,
      };
    }
  }

  private static shuffleOptions(options: string[]): string[] {
    const unique = Array.from(new Set(options));
    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unique[i], unique[j]] = [unique[j], unique[i]];
    }
    return unique;
  }
}
