import React, { useState } from 'react';
import { sound } from '../../../services/sound';
import {
  Zap,
  Volume2,
  Sparkles,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Calculator,
  RefreshCw,
} from 'lucide-react';

interface MentalMathHacksViewProps {
  onLaunchGame?: (gameId: string) => void;
}

export const MentalMathHacksView: React.FC<MentalMathHacksViewProps> = ({
  onLaunchGame,
}) => {
  // Hack 1: Multiply by 11
  const [num11, setNum11] = useState(43);
  const d1 = Math.floor(num11 / 10);
  const d2 = num11 % 10;
  const sumD = d1 + d2;
  const result11 = num11 * 11;

  // Hack 2: Square ending in 5
  const [numSq5, setNumSq5] = useState(35);
  const tens5 = Math.floor(numSq5 / 10);
  const prefix5 = tens5 * (tens5 + 1);
  const resultSq5 = numSq5 * numSq5;

  // Hack 3: Vedic subtract from 1000
  const [subNum, setSubNum] = useState(364);
  const subDigit1 = 9 - Math.floor(subNum / 100);
  const subDigit2 = 9 - (Math.floor(subNum / 10) % 10);
  const subDigit3 = 10 - (subNum % 10);
  const resultSub = 1000 - subNum;

  // Hack 4: Percent Reversal (x% of y = y% of x)
  const [revX, setRevX] = useState(16);
  const [revY, setRevY] = useState(50);

  // Hack 5: Multiply by 5
  const [mul5Num, setMul5Num] = useState(48);

  // Hack 6: Finger 9 Multiplier
  const [nineFactor, setNineFactor] = useState(7);

  const handleSpeak = (text: string) => {
    sound.speak(text);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-6 sm:p-7 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/30">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              Buku Rumus & Trik Berhitung Sakti
            </span>
            <span className="bg-yellow-300 text-amber-950 font-black px-2.5 py-0.5 rounded-full text-xs">
              Mental Math Hacks
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
            Berhitung di Luar Kepala Tanpa Coretan Pensil ⚡
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
            Kumpulan rahasia dan jalan pintas matematikawan dunia. Cukup pahami logikanya sekali, kamu bisa menjawab soal hitungan rumit dalam 2 detik!
          </p>
        </div>

        <div className="absolute right-4 bottom-2 text-7xl opacity-20 select-none pointer-events-none hidden sm:block">
          ⚡
        </div>
      </div>

      {/* GRID OF INTERACTIVE HACKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* HACK 1: PERKALIAN 11 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-base">
                11
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Trik Kilat Perkalian 11
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  Sisipkan jumlah digit di tengah
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSpeak(`Trik perkalian 11. Angka ${num11} dikali 11. Pisahkan digit ${d1} dan ${d2}. Jumlahnya adalah ${sumD}. Hasil akhirnya adalah ${result11}`)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-black text-slate-700">
              <span>Ubah Angka (10 - 89):</span>
              <span className="text-indigo-600 font-mono text-sm font-black">{num11}</span>
            </div>
            <input
              type="range"
              min={10}
              max={89}
              value={num11}
              onChange={(e) => setNum11(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-200 text-center space-y-2">
            <div className="text-xs font-semibold text-indigo-900">
              Pisahkan <strong className="text-indigo-700">{d1}</strong> dan <strong className="text-indigo-700">{d2}</strong> ➔ Jumlahkan ({d1} + {d2} = {sumD}).
            </div>
            <div className="text-2xl font-black text-indigo-950 flex items-center justify-center gap-2">
              <span>{num11} × 11 =</span>
              <span className="text-emerald-700 bg-white px-3 py-1 rounded-xl shadow-xs border border-emerald-300 font-mono">
                {result11}
              </span>
            </div>
          </div>
        </div>

        {/* HACK 2: KUADRAT AKHIRAN 5 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-base">
                5²
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Trik Kuadrat Angka Berakhiran 5
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  Puluhan × Kakaknya, lalu tempel 25
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSpeak(`Kuadrat angka ${numSq5}. Puluhannya adalah ${tens5}. Kalikan dengan kakaknya ${tens5 + 1}, hasilnya ${prefix5}. Tempelkan 25 di belakang, maka jawabannya adalah ${resultSq5}`)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-black text-slate-700">
              <span>Pilih Angka:</span>
              <span className="text-emerald-600 font-mono text-sm font-black">{numSq5}</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[15, 25, 35, 45, 65, 75, 85, 95].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    sound.playClick();
                    setNumSq5(val);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    numSq5 === val
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 text-center space-y-2">
            <div className="text-xs font-semibold text-emerald-900">
              {tens5} × ({tens5} + 1) = <strong className="text-emerald-800">{prefix5}</strong>, lalu tempelkan <strong className="text-emerald-800">25</strong> di belakang!
            </div>
            <div className="text-2xl font-black text-emerald-950 flex items-center justify-center gap-2">
              <span>{numSq5}² =</span>
              <span className="text-emerald-700 bg-white px-3 py-1 rounded-xl shadow-xs border border-emerald-300 font-mono">
                {resultSq5}
              </span>
            </div>
          </div>
        </div>

        {/* HACK 3: VEDIC SUBTRACT FROM 1000 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-purple-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-base">
                1k
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Pengurangan Kilat dari 1.000 (Vedic)
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  Semua kurangi 9, digit terakhir kurangi 10
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSpeak(`Pengurangan 1000 dikurang ${subNum}. Digit pertama 9 dikurang ${Math.floor(subNum/100)} sama dengan ${subDigit1}. Digit kedua 9 dikurang ${Math.floor(subNum/10)%10} sama dengan ${subDigit2}. Digit terakhir 10 dikurang ${subNum%10} sama dengan ${subDigit3}. Hasilnya adalah ${resultSub}`)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-black text-slate-700">
              <span>Angka Pengurang:</span>
              <span className="text-purple-600 font-mono text-sm font-black">{subNum}</span>
            </div>
            <input
              type="range"
              min={101}
              max={999}
              value={subNum}
              onChange={(e) => setSubNum(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-200 text-center space-y-2">
            <div className="text-xs font-semibold text-purple-900">
              [9 - {Math.floor(subNum / 100)} = <strong>{subDigit1}</strong>] &nbsp;
              [9 - {Math.floor(subNum / 10) % 10} = <strong>{subDigit2}</strong>] &nbsp;
              [10 - {subNum % 10} = <strong>{subDigit3}</strong>]
            </div>
            <div className="text-2xl font-black text-purple-950 flex items-center justify-center gap-2">
              <span>1.000 - {subNum} =</span>
              <span className="text-purple-700 bg-white px-3 py-1 rounded-xl shadow-xs border border-purple-300 font-mono">
                {resultSub}
              </span>
            </div>
          </div>
        </div>

        {/* HACK 4: REVERSIBLE PERCENTAGES */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-base">
                %
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Trik Persentase Dibalik (x% of y = y% of x)
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  Balik posisinya agar jadi kelipatan mudah!
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSpeak(`${revX} persen dari ${revY} sama dengan ${revY} persen dari ${revX}. Karena ${revY} persen adalah setengah, maka setengah dari ${revX} adalah ${(revX * revY) / 100}.`)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
            <div>
              <label className="block mb-1">Persen: {revX}%</label>
              <input
                type="range"
                min={4}
                max={40}
                step={2}
                value={revX}
                onChange={(e) => setRevX(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
            <div>
              <label className="block mb-1">Dari Angka: {revY}</label>
              <select
                value={revY}
                onChange={(e) => setRevY(Number(e.target.value))}
                className="w-full p-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs"
              >
                <option value={50}>50 (Setengah)</option>
                <option value={25}>25 (Seperempat)</option>
                <option value={10}>10 (Sepersepuluh)</option>
                <option value={20}>20 (Seperlima)</option>
              </select>
            </div>
          </div>

          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 text-center space-y-2">
            <div className="text-xs font-semibold text-amber-900">
              Hitung <strong className="text-rose-600">{revX}% dari {revY}</strong> terasa sulit? Balik menjadi: <strong className="text-emerald-700">{revY}% dari {revX}</strong>!
            </div>
            <div className="text-2xl font-black text-amber-950 flex items-center justify-center gap-2">
              <span>Hasil =</span>
              <span className="text-emerald-700 bg-white px-3 py-1 rounded-xl shadow-xs border border-emerald-300 font-mono">
                {(revX * revY) / 100}
              </span>
            </div>
          </div>
        </div>

        {/* HACK 5: PERKALIAN 5 (BAGI 2 LALU KALI 10) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-rose-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-base">
                ×5
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Trik Cepat Perkalian 5
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  Bagi 2 lalu kalikan 10 (Tambah angka 0)
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSpeak(`Perkalian 5. ${mul5Num} dikali 5. Bagi dua angka ${mul5Num} menjadi ${mul5Num / 2}, lalu kalikan 10 menjadi ${mul5Num * 5}.`)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-black text-slate-700">
              <span>Pilih Angka Genap (10 - 98):</span>
              <span className="text-rose-600 font-mono text-sm font-black">{mul5Num}</span>
            </div>
            <input
              type="range"
              min={10}
              max={98}
              step={2}
              value={mul5Num}
              onChange={(e) => setMul5Num(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          <div className="bg-rose-50/80 rounded-2xl p-4 border border-rose-200 text-center space-y-2">
            <div className="text-xs font-semibold text-rose-900">
              Langkah: ({mul5Num} ÷ 2) = <strong className="text-rose-800">{mul5Num / 2}</strong> ➔ Tambah angka nol di belakang!
            </div>
            <div className="text-2xl font-black text-rose-950 flex items-center justify-center gap-2">
              <span>{mul5Num} × 5 =</span>
              <span className="text-emerald-700 bg-white px-3 py-1 rounded-xl shadow-xs border border-emerald-300 font-mono">
                {mul5Num * 5}
              </span>
            </div>
          </div>
        </div>

        {/* HACK 6: JARI AJAIB PERKALIAN 9 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-base">
                🖐️
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Trik Jari Ajaib Perkalian 9
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  Lipat jari ke-n: Kiri puluhan, Kanan satuan
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSpeak(`Perkalian 9 kali ${nineFactor}. Lipat jari ke ${nineFactor}. Di sebelah kiri ada ${nineFactor - 1} jari bernilai puluhan. Di sebelah kanan ada ${10 - nineFactor} jari bernilai satuan. Hasilnya adalah ${9 * nineFactor}.`)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-black text-slate-700">
              <span>Pilih Pengali 9 × [n]:</span>
              <span className="text-sky-600 font-mono text-sm font-black">9 × {nineFactor}</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    sound.playClick();
                    setNineFactor(n);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    nineFactor === n
                      ? 'bg-sky-600 text-white border-sky-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-sky-50/80 rounded-2xl p-4 border border-sky-200 text-center space-y-2">
            <div className="text-xs font-semibold text-sky-900">
              Jari kiri = <strong className="text-sky-800">{nineFactor - 1} puluhan ({ (nineFactor - 1) * 10 })</strong> | Jari kanan = <strong className="text-sky-800">{10 - nineFactor} satuan</strong>
            </div>
            <div className="text-2xl font-black text-sky-950 flex items-center justify-center gap-2">
              <span>9 × {nineFactor} =</span>
              <span className="text-emerald-700 bg-white px-3 py-1 rounded-xl shadow-xs border border-emerald-300 font-mono">
                {9 * nineFactor}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
