import React, { useState } from 'react';
import { sound } from '../services/sound';
import {
  BookOpen,
  Sparkles,
  Zap,
  Box,
  Shapes,
  Calculator,
  Search,
  X,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const FormulaHandbookModal: React.FC<Props> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | '2d' | '3d' | 'arithmetic' | 'tricks' | 'fraction'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const formulaData = [
    // ---------------- BANGUN DATAR (2D) ----------------
    {
      id: 'persegi',
      category: '2d',
      title: 'Persegi (Square)',
      icon: '⬛',
      badge: 'Kelas 1-4 SD',
      formulas: [
        { name: 'Luas (L)', formula: 'L = s × s = s²', desc: 's = panjang sisi persegi' },
        { name: 'Keliling (K)', formula: 'K = 4 × s', desc: 'Jumlahkan keempat sisinya' },
      ],
      example: 'Jika sisi = 6 cm, maka Luas = 6 × 6 = 36 cm² dan Keliling = 4 × 6 = 24 cm.',
      tip: 'Semua 4 sisinya sama panjang dan memiliki 4 sudut siku-siku (90°).',
    },
    {
      id: 'persegi_panjang',
      category: '2d',
      title: 'Persegi Panjang (Rectangle)',
      icon: '▭',
      badge: 'Kelas 2-4 SD',
      formulas: [
        { name: 'Luas (L)', formula: 'L = p × l', desc: 'p = panjang, l = lebar' },
        { name: 'Keliling (K)', formula: 'K = 2 × (p + l)', desc: '2 kali jumlah panjang dan lebar' },
      ],
      example: 'Jika p = 8 cm dan l = 5 cm, maka Luas = 8 × 5 = 40 cm², Keliling = 2 × (8 + 5) = 26 cm.',
      tip: 'Sisi-sisi yang berhadapan sejajar dan sama panjang.',
    },
    {
      id: 'segitiga',
      category: '2d',
      title: 'Segitiga (Triangle)',
      icon: '📐',
      badge: 'Kelas 3-5 SD',
      formulas: [
        { name: 'Luas (L)', formula: 'L = ½ × a × t', desc: 'a = alas, t = tinggi tegak lurus' },
        { name: 'Keliling (K)', formula: 'K = s₁ + s₂ + s₃', desc: 'Jumlahkan ketiga panjang sisinya' },
      ],
      example: 'Jika alas = 10 cm dan tinggi = 6 cm, maka Luas = ½ × 10 × 6 = 30 cm².',
      tip: 'Total ketiga sudut dalam segitiga selalu berjumlah tepat 180°!',
    },
    {
      id: 'lingkaran',
      category: '2d',
      title: 'Lingkaran (Circle)',
      icon: '⭕',
      badge: 'Kelas 6 SD',
      formulas: [
        { name: 'Luas (L)', formula: 'L = π × r² = ¼ × π × d²', desc: 'r = jari-jari, d = diameter (2r)' },
        { name: 'Keliling (K)', formula: 'K = 2 × π × r = π × d', desc: 'π = ²²∕₇ (jika r kelipatan 7) atau 3,14' },
      ],
      example: 'Jika jari-jari r = 7 cm, maka Luas = ²²∕₇ × 7 × 7 = 154 cm², Keliling = 2 × ²²∕₇ × 7 = 44 cm.',
      tip: 'Jari-jari (r) adalah setengah dari diameter (d = 2r).',
    },
    {
      id: 'jajar_genjang',
      category: '2d',
      title: 'Jajar Genjang (Parallelogram)',
      icon: '▰',
      badge: 'Kelas 4-5 SD',
      formulas: [
        { name: 'Luas (L)', formula: 'L = a × t', desc: 'a = alas, t = tinggi tegak lurus' },
        { name: 'Keliling (K)', formula: 'K = 2 × (a + b)', desc: 'Jumlah seluruh sisi miring dan alas' },
      ],
      example: 'Jika alas = 12 cm dan tinggi = 5 cm, maka Luas = 12 × 5 = 60 cm².',
      tip: 'Tinggi harus selalu garis tegak lurus dengan alas, bukan sisi miringnya.',
    },
    {
      id: 'trapesium',
      category: '2d',
      title: 'Trapesium (Trapezoid)',
      icon: '⏢',
      badge: 'Kelas 4-5 SD',
      formulas: [
        { name: 'Luas (L)', formula: 'L = ½ × (a + b) × t', desc: 'a, b = sisi sejajar, t = tinggi' },
        { name: 'Keliling (K)', formula: 'K = Jumlah seluruh 4 sisi', desc: 'K = a + b + c + d' },
      ],
      example: 'Jika sisi sejajar a = 6 cm, b = 10 cm, dan t = 4 cm, maka L = ½ × (6 + 10) × 4 = 32 cm².',
      tip: 'Jumlahkan sisi sejajar atas dan bawah terlebih dahulu sebelum dikali tinggi.',
    },

    // ---------------- BANGUN RUANG (3D) ----------------
    {
      id: 'kubus',
      category: '3d',
      title: 'Kubus (Cube)',
      icon: '🧊',
      badge: 'Kelas 4-6 SD',
      formulas: [
        { name: 'Volume (V)', formula: 'V = s × s × s = s³', desc: 's = panjang rusuk kubus' },
        { name: 'Luas Permukaan (LP)', formula: 'LP = 6 × s²', desc: 'Memiliki 6 sisi persegi sama besar' },
      ],
      example: 'Jika rusuk s = 5 cm, maka V = 5 × 5 × 5 = 125 cm³ dan LP = 6 × (5 × 5) = 150 cm².',
      tip: 'Kubus memiliki 6 sisi, 12 rusuk sama panjang, dan 8 titik sudut.',
    },
    {
      id: 'balok',
      category: '3d',
      title: 'Balok (Rectangular Prism)',
      icon: '📦',
      badge: 'Kelas 4-6 SD',
      formulas: [
        { name: 'Volume (V)', formula: 'V = p × l × t', desc: 'p = panjang, l = lebar, t = tinggi' },
        { name: 'Luas Permukaan (LP)', formula: 'LP = 2 × (p·l + p·t + l·t)', desc: 'Jumlah luas 6 bidang sisi' },
      ],
      example: 'Jika p = 8, l = 4, t = 3 cm, maka V = 8 × 4 × 3 = 96 cm³.',
      tip: 'Balok memiliki 3 pasang sisi yang sama bentuk dan ukurannya.',
    },
    {
      id: 'tabung',
      category: '3d',
      title: 'Tabung (Cylinder)',
      icon: '🛢️',
      badge: 'Kelas 6 SD',
      formulas: [
        { name: 'Volume (V)', formula: 'V = π × r² × t', desc: 'Luas alas lingkaran × tinggi' },
        { name: 'Luas Permukaan (LP)', formula: 'LP = 2 × π × r × (r + t)', desc: '2 tutup lingkaran + selimut' },
      ],
      example: 'Jika r = 7 cm, t = 10 cm, maka V = ²²∕₇ × 7 × 7 × 10 = 1.540 cm³.',
      tip: 'Alas dan tutup tabung berbentuk lingkaran yang kongruen (sama dan sebangun).',
    },

    // ---------------- ARITMATIKA & PENGUKURAN ----------------
    {
      id: 'kecepatan',
      category: 'arithmetic',
      title: 'Kecepatan, Jarak, & Waktu',
      icon: '🏎️',
      badge: 'Kelas 5 SD',
      formulas: [
        { name: 'Kecepatan (v)', formula: 'v = s ÷ t', desc: 'v = kecepatan (km/jam), s = jarak, t = waktu' },
        { name: 'Jarak (s)', formula: 's = v × t', desc: 'Kecepatan dikalikan waktu tempuh' },
        { name: 'Waktu (t)', formula: 't = s ÷ v', desc: 'Jarak dibagi kecepatan' },
      ],
      example: 'Mobil menempuh jarak 120 km dalam waktu 2 jam, maka kecepatannya = 120 ÷ 2 = 60 km/jam.',
      tip: 'Ingat segitiga ajaib J-K-W (Jarak di puncak, Kecepatan & Waktu di bawah).',
    },
    {
      id: 'debit',
      category: 'arithmetic',
      title: 'Debit Air & Aliran',
      icon: '🚰',
      badge: 'Kelas 5 SD',
      formulas: [
        { name: 'Debit (D)', formula: 'D = V ÷ t', desc: 'V = volume air (liter), t = waktu (menit/detik)' },
        { name: 'Volume (V)', formula: 'V = D × t', desc: 'Debit dikali waktu' },
        { name: 'Waktu (t)', formula: 't = V ÷ D', desc: 'Volume dibagi debit aliran' },
      ],
      example: 'Keran mengalirkan 60 liter air dalam waktu 3 menit, maka Debit = 60 ÷ 3 = 20 liter/menit.',
      tip: '1 liter = 1 dm³ = 1.000 cm³ = 1.000 ml.',
    },
    {
      id: 'skala',
      category: 'arithmetic',
      title: 'Skala Peta Nusantara',
      icon: '🗺️',
      badge: 'Kelas 5 SD',
      formulas: [
        { name: 'Skala (S)', formula: 'S = JP ÷ JS', desc: 'JP = Jarak Peta (cm), JS = Jarak Sebenarnya (cm)' },
        { name: 'Jarak Sebenarnya (JS)', formula: 'JS = JP ÷ S', desc: 'Jangan lupa ubah cm ke km (bagi 100.000)' },
        { name: 'Jarak Peta (JP)', formula: 'JP = JS × S', desc: 'Jarak sebenarnya dikali skala' },
      ],
      example: 'Skala 1 : 1.000.000, jika JP = 3 cm, maka JS = 3 × 1.000.000 cm = 3.000.000 cm = 30 km.',
      tip: 'Konversi satuan: 1 km = 100.000 cm.',
    },

    // ---------------- PECAHAN, KPK & FPB ----------------
    {
      id: 'kpk_fpb',
      category: 'fraction',
      title: 'KPK dan FPB',
      icon: '🌳',
      badge: 'Kelas 4-5 SD',
      formulas: [
        { name: 'KPK (Kelipatan Persekutuan Terkecil)', formula: 'Semua faktor prima pangkat terbesar', desc: 'Digunakan saat menyamakan penyebut pecahan & jadwal ronda' },
        { name: 'FPB (Faktor Persekutuan Terbesar)', formula: 'Faktor prima yang sama pangkat terkecil', desc: 'Digunakan saat menyederhanakan pecahan & membagi bingkisan sama rata' },
      ],
      example: 'KPK dari 12 & 18: 12=2²×3, 18=2×3² ➔ KPK = 2²×3² = 36. FPB = 2×3 = 6.',
      tip: 'KPK selalu LEBIH BESAR atau sama dengan angka, FPB selalu LEBIH KECIL atau sama.',
    },
    {
      id: 'operasi_pecahan',
      category: 'fraction',
      title: 'Operasi Pecahan Lengkap',
      icon: '🥧',
      badge: 'Kelas 4-6 SD',
      formulas: [
        { name: 'Penjumlahan / Pengurangan', formula: 'a/b + c/d = (a·d + b·c) / (b·d)', desc: 'Samakan penyebut terlebih dahulu menggunakan KPK!' },
        { name: 'Perkalian Pecahan', formula: 'a/b × c/d = (a × c) / (b × d)', desc: 'Atas kali atas, bawah kali bawah' },
        { name: 'Pembagian Pecahan', formula: 'a/b ÷ c/d = a/b × d/c', desc: 'Balik pecahan kedua lalu kalikan!' },
      ],
      example: '⅔ ÷ ⁴∕₅ = ⅔ × ⁵∕₄ = ¹⁰∕₁₂ = ⁵∕₆.',
      tip: 'Bagi pecahan ➔ Balik pecahan kedua & ubah tanda bagi jadi kali!',
    },

    // ---------------- TRIK CEPAT MENTAL MATH (MAGIC HACKS) ----------------
    {
      id: 'trik_perkalian_9',
      category: 'tricks',
      title: 'Trik Jari Ajaib Perkalian 9',
      icon: '🖐️',
      badge: 'Trik Kilat',
      formulas: [
        { name: 'Metode 10 Jari Tangan', formula: 'Lipat jari ke-n yang dikalikan dengan 9', desc: 'Jumlah jari di kiri lipatan = Puluhan, jumlah jari di kanan = Satuan' },
      ],
      example: '9 × 4: Buka 10 jari, lipat jari ke-4. Di kiri ada 3 jari (30), di kanan ada 6 jari (6). Hasilnya = 36!',
      tip: 'Jumlah angka hasil perkalian 9 selalu berjumlah 9 (misal: 3+6=9, 4+5=9, 7+2=9).',
    },
    {
      id: 'trik_kuadrat_5',
      category: 'tricks',
      title: 'Trik Kuadrat Cepat Akhiran 5',
      icon: '⚡',
      badge: 'Trik Kilat',
      formulas: [
        { name: 'Rumus Kuadrat Angka Berakhiran 5', formula: '(Puluhan × (Puluhan + 1)) disambung "25"', desc: 'Hitung dalam 1 detik di kepala!' },
      ],
      example: '35²: Angka depannya 3. Kalikan 3 × (3+1) = 3 × 4 = 12. Sambung dengan 25 ➔ Hasilnya 1.225!',
      tip: 'Coba 65² ➔ 6 × 7 = 42 disambung 25 ➔ 4.225. Cepat sekali bukan?',
    },
    {
      id: 'trik_perkalian_11',
      category: 'tricks',
      title: 'Trik Perkalian 11 Dua Digit',
      icon: '🪄',
      badge: 'Trik Kilat',
      formulas: [
        { name: 'Sisipkan Jumlah Dua Angka di Tengah', formula: 'ab × 11 = a [a + b] b', desc: 'Buka kedua angka, sisipkan jumlahnya di tengah' },
      ],
      example: '45 × 11: Buka angka 4 dan 5 (4 _ 5). Jumlahkan 4 + 5 = 9. Sisipkan di tengah ➔ 495!',
      tip: 'Jika jumlahnya lebih dari 10 (misal 57×11 ➔ 5+7=12), simpan 1 ke angka depan ➔ (5+1) 2 7 = 627.',
    },
    {
      id: 'trik_bagi_5',
      category: 'tricks',
      title: 'Trik Pembagian 5 Kilat',
      icon: '🚀',
      badge: 'Trik Kilat',
      formulas: [
        { name: 'Kali 2 lalu Geser Koma 1 Digit', formula: 'Angka ÷ 5 = (Angka × 2) ÷ 10', desc: 'Mengalikan 2 jauh lebih cepat daripada membagi 5' },
      ],
      example: '140 ÷ 5: Kalikan 140 × 2 = 280. Geser koma 1 digit ke kiri ➔ 28. Selesai!',
      tip: '215 ÷ 5: 215 × 2 = 430 ➔ Bagi 10 = 43!',
    },
  ];

  const filtered = formulaData.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q) ||
        item.tip.toLowerCase().includes(q) ||
        item.formulas.some((f) => f.name.toLowerCase().includes(q) || f.formula.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full border-4 border-amber-300 shadow-2xl flex flex-col my-auto max-h-[96vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 text-white flex items-center justify-between shadow-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner border border-white/30">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">Kamus Rumus & Trik Cepat Matematika</h2>
                <span className="text-[10px] font-black bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  SD 1-6 Lengkap
                </span>
              </div>
              <p className="text-xs text-amber-100">
                Koleksi rumus matematika bergambar, contoh soal, dan trik berhitung cepat mental math.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between flex-shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari rumus (misal: lingkaran, debit, trik 9)..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-2xl border border-slate-300 text-xs font-bold text-slate-800 outline-none shadow-2xs"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Semua Rumus', icon: '📖' },
              { id: '2d', label: 'Bangun Datar', icon: '📐' },
              { id: '3d', label: 'Bangun Ruang', icon: '📦' },
              { id: 'arithmetic', label: 'Kecepatan & Skala', icon: '🏎️' },
              { id: 'fraction', label: 'Pecahan, KPK/FPB', icon: '🥧' },
              { id: 'tricks', label: 'Trik Mental Math ⚡', icon: '🪄' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(cat.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs whitespace-nowrap cursor-pointer transition-all ${
                  activeCategory === cat.id
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white hover:bg-orange-50 text-slate-700 border border-slate-200'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Formula Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-base">{item.title}</h4>
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.2 rounded-md">
                          {item.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Formulas List */}
                  <div className="space-y-2 my-3">
                    {item.formulas.map((f, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="text-[11px] font-bold text-slate-500">{f.name}:</div>
                        <div className="text-base sm:text-lg font-black text-amber-700 tracking-wide font-mono mt-0.5">
                          {f.formula}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium mt-0.5">{f.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Example Box */}
                  <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-1">
                    <span className="font-bold text-blue-900 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Contoh Soal & Penerapan:
                    </span>
                    <p className="leading-relaxed pl-4">{item.example}</p>
                  </div>
                </div>

                {/* Quick Tip / Hack */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-amber-900 bg-amber-50/60 p-2.5 rounded-xl">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Tips Cepat: </span>
                    <span>{item.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-base font-bold">Tidak ada rumus yang cocok dengan pencarian "{searchQuery}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
