import React, { useState, useEffect } from 'react';
import { sound } from '../../../services/sound';
import {
  Sparkles,
  Volume2,
  Filter,
  RotateCcw,
  CheckCircle2,
  Calculator,
  Layers,
  Scale,
  Percent,
  Shapes,
  Clock,
  BarChart3,
  Lightbulb,
  Compass,
} from 'lucide-react';

export type LabCategory = 'all' | 'fractions' | 'geometry' | 'measurement' | 'mental' | 'cambridge' | 'data';

interface KnowledgeLabsCatalogProps {
  highlightedLabId: string | null;
}

export const KnowledgeLabsCatalog: React.FC<KnowledgeLabsCatalogProps> = ({
  highlightedLabId,
}) => {
  const [labFilter, setLabFilter] = useState<LabCategory>('all');

  useEffect(() => {
    if (highlightedLabId) {
      setLabFilter('all');
    }
  }, [highlightedLabId]);

  // Lab 01: Trik 11
  const [numFor11, setNumFor11] = useState(43);
  // Lab 02: Bar Model
  const [barA, setBarA] = useState(60);
  const [barB, setBarB] = useState(40);
  // Lab 03: Ten-Frame
  const [tenFrameCount, setTenFrameCount] = useState(6);
  // Lab 04: Kuadrat 5
  const [numEnding5, setNumEnding5] = useState(35);
  // Lab 05: Pecahan
  const [fracNum, setFracNum] = useState(3);
  const [fracDenom, setFracDenom] = useState(4);
  // Lab 06: Geometri Luas
  const [geoLength, setGeoLength] = useState(8);
  const [geoWidth, setGeoWidth] = useState(5);
  // Lab 07: Jam Analog
  const [clockHour, setClockHour] = useState(7);
  const [clockMinute, setClockMinute] = useState(0);
  // Lab 08: Dompet Koin Kasir
  const [cashierCoins, setCashierCoins] = useState<number[]>([1000, 500, 200]);
  // Lab 09: Porogapit
  const [porogapitDividend, setPorogapitDividend] = useState(75);
  const [porogapitDivisor, setPorogapitDivisor] = useState(3);
  // Lab 10: Pohon Faktor & KPK
  const [kpkNumA, setKpkNumA] = useState(12);
  const [kpkNumB, setKpkNumB] = useState(18);
  // Lab 11: Array Matriks
  const [arrayRows, setArrayRows] = useState(4);
  const [arrayCols, setArrayCols] = useState(6);
  // Lab 12: Tangga Satuan Metrik
  const [metricLadderType, setMetricLadderType] = useState<'panjang' | 'massa'>('panjang');
  const [metricValue, setMetricValue] = useState(5);
  const [metricFromUnit, setMetricFromUnit] = useState('m');
  const [metricToUnit, setMetricToUnit] = useState('cm');
  // Lab 13: Busur Derajat Sudut
  const [angleDegrees, setAngleDegrees] = useState(60);
  // Lab 14: Statistika Cilik
  const [statNumbers, setStatNumbers] = useState<number[]>([4, 7, 7, 9, 13]);
  // Lab 15: Segitiga JKW
  const [jkwMode, setJkwMode] = useState<'jarak' | 'kecepatan' | 'waktu'>('jarak');
  const [jkwDistance, setJkwDistance] = useState(120);
  const [jkwSpeed, setJkwSpeed] = useState(60);
  const [jkwTime, setJkwTime] = useState(2);
  // Lab 16: Pembagian Pecahan Visual
  const [divPizzas, setDivPizzas] = useState(3);
  const [divSliceDenom, setDivSliceDenom] = useState(2);
  // Lab 17: Teorema Pythagoras
  const [pythPreset, setPythPreset] = useState<'3_4_5' | '6_8_10' | '5_12_13'>('3_4_5');
  // Lab 18: Simetri Lipat & Putar
  const [symShape, setSymShape] = useState<'persegi' | 'persegi_panjang' | 'segitiga' | 'lingkaran'>('persegi');
  const [symAngle, setSymAngle] = useState(0);

  const handleSpeak = (text: string) => {
    sound.speak(text);
  };

  // Lab 01 calculations
  const d1 = Math.floor(numFor11 / 10);
  const d2 = numFor11 % 10;
  const sumD = d1 + d2;
  const result11 = numFor11 * 11;

  // Lab 04 calculations
  const tens5 = Math.floor(numEnding5 / 10);
  const prefix5 = tens5 * (tens5 + 1);
  const resultSq5 = numEnding5 * numEnding5;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Category Filter Chips */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1 shrink-0 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Kategori:
        </span>
        {[
          { id: 'all', label: 'Semua Lab (18)' },
          { id: 'fractions', label: '🍕 Pecahan & Persen' },
          { id: 'geometry', label: '📐 Geometri, Sudut & Pythagoras' },
          { id: 'measurement', label: '⏰ Jam, Satuan & Kecepatan' },
          { id: 'mental', label: '⚡ Trik Hitung Cepat' },
          { id: 'cambridge', label: '🇬🇧 Cambridge TWM' },
          { id: 'data', label: '📊 Statistika & Kasir' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              sound.playClick();
              setLabFilter(f.id as LabCategory);
            }}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-black border transition-all cursor-pointer whitespace-nowrap ${
              labFilter === f.id
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs scale-105'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 18 Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LAB 16: PEMBAGIAN PECAHAN VISUAL */}
        {(labFilter === 'all' || labFilter === 'fractions') && (
          <div
            id="lab_fraction_division"
            className={`bg-white rounded-3xl p-5 border-2 shadow-xs space-y-4 transition-all ${
              highlightedLabId === 'fraction_division'
                ? 'border-indigo-500 ring-4 ring-indigo-100'
                : 'border-pink-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-pink-100 text-pink-800 font-black text-xs">
                  🍕 Lab 16
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Pembagian Pecahan Visual (Pizza Slicer)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Mengapa membagi pecahan menghasilkan jumlah lebih banyak?
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const total = divPizzas * divSliceDenom;
                  handleSpeak(`${divPizzas} loyang pizza utuh dibagi ke potongan 1 per ${divSliceDenom}. Total potongan yang dihasilkan adalah ${total} potong.`);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-pink-600 transition-colors cursor-pointer"
                title="Dengarkan Penjelasan"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Jumlah Pizza Utuh: <span className="text-pink-700 font-black">{divPizzas} loyang</span></label>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={divPizzas}
                  onChange={(e) => setDivPizzas(Number(e.target.value))}
                  className="w-full accent-pink-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block mb-1">Ukuran Potong: <span className="text-purple-700 font-black">1/{divSliceDenom}</span></label>
                <div className="grid grid-cols-3 gap-1">
                  {[2, 3, 4].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDivSliceDenom(d)}
                      className={`py-1 rounded-xl text-xs font-black border cursor-pointer ${
                        divSliceDenom === d
                          ? 'bg-purple-600 text-white border-purple-700'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      1/{d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-200 space-y-3">
              <div className="flex items-center justify-around flex-wrap gap-2">
                {Array.from({ length: divPizzas }).map((_, pIdx) => (
                  <div key={pIdx} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-amber-200 border-2 border-amber-400 relative overflow-hidden flex items-center justify-center shadow-xs">
                      {Array.from({ length: divSliceDenom }).map((_, sIdx) => {
                        const angle = (360 / divSliceDenom) * sIdx;
                        return (
                          <div
                            key={sIdx}
                            style={{ transform: `rotate(${angle}deg)` }}
                            className="absolute w-0.5 h-7 bg-amber-700/60 top-0 origin-bottom"
                          />
                        );
                      })}
                      <span className="text-xs">🍕</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">Pizza #{pIdx + 1}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white p-3 rounded-xl border border-pink-200 text-center space-y-1">
                <span className="text-xs font-bold text-slate-600">
                  Operasi: {divPizzas} ÷ (1/{divSliceDenom}) = {divPizzas} × {divSliceDenom}/1
                </span>
                <div className="text-2xl font-black text-pink-700 font-mono">
                  = {divPizzas * divSliceDenom} Potong Pizza!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAB 17: TEOREMA PYTHAGORAS */}
        {(labFilter === 'all' || labFilter === 'geometry') && (
          <div
            id="lab_pythagoras"
            className={`bg-white rounded-3xl p-5 border-2 shadow-xs space-y-4 transition-all ${
              highlightedLabId === 'pythagoras'
                ? 'border-indigo-500 ring-4 ring-indigo-100'
                : 'border-indigo-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-indigo-100 text-indigo-800 font-black text-xs">
                  📐 Lab 17
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Teorema Pythagoras Segitiga (a² + b² = c²)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Tripel Pythagoras Bilangan Bulat Siku-Siku
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const vals = pythPreset === '3_4_5' ? [3, 4, 5] : pythPreset === '6_8_10' ? [6, 8, 10] : [5, 12, 13];
                  handleSpeak(`Teorema Pythagoras. Sisi alas ${vals[0]}, tinggi ${vals[1]}, maka sisi miringnya adalah ${vals[2]}.`);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Dengarkan Penjelasan"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: '3_4_5', label: 'Tripel (3, 4, 5)' },
                { id: '6_8_10', label: 'Tripel (6, 8, 10)' },
                { id: '5_12_13', label: 'Tripel (5, 12, 13)' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPythPreset(p.id as any)}
                  className={`py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    pythPreset === p.id
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {(() => {
              const [a, b, c] =
                pythPreset === '3_4_5' ? [3, 4, 5] : pythPreset === '6_8_10' ? [6, 8, 10] : [5, 12, 13];
              return (
                <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-200 space-y-2 text-xs">
                  <div className="flex items-center justify-around text-center">
                    <div className="bg-white p-2 rounded-xl border border-indigo-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-bold">Alas (a)</span>
                      <span className="font-mono text-base font-black text-indigo-700">{a}</span>
                      <span className="text-[10px] text-slate-500 block font-bold">a² = {a * a}</span>
                    </div>
                    <span className="text-lg font-black text-indigo-400">+</span>
                    <div className="bg-white p-2 rounded-xl border border-indigo-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-bold">Tinggi (b)</span>
                      <span className="font-mono text-base font-black text-indigo-700">{b}</span>
                      <span className="text-[10px] text-slate-500 block font-bold">b² = {b * b}</span>
                    </div>
                    <span className="text-lg font-black text-indigo-400">=</span>
                    <div className="bg-white p-2 rounded-xl border border-emerald-300 shadow-2xs ring-2 ring-emerald-100">
                      <span className="text-[10px] text-emerald-600 block font-black">Hipotenusa (c)</span>
                      <span className="font-mono text-base font-black text-emerald-700">{c}</span>
                      <span className="text-[10px] text-emerald-600 block font-black">c² = {c * c}</span>
                    </div>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100 text-center font-semibold text-slate-700">
                    {a * a} + {b * b} = <strong>{c * c}</strong>. Sisi miring = √{c * c} = <strong className="text-emerald-700">{c}</strong>!
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* LAB 18: SIMETRI LIPAT & PUTAR */}
        {(labFilter === 'all' || labFilter === 'geometry') && (
          <div
            id="lab_symmetry"
            className={`bg-white rounded-3xl p-5 border-2 shadow-xs space-y-4 transition-all ${
              highlightedLabId === 'symmetry'
                ? 'border-indigo-500 ring-4 ring-indigo-100'
                : 'border-teal-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-teal-100 text-teal-800 font-black text-xs">
                  🦋 Lab 18
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Simetri Lipat & Putar Bangun Datar
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Eksplorasi Sumbu Lipatan & Tingkat Putar 360°
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const counts =
                    symShape === 'persegi'
                      ? 'Persegi memiliki 4 simetri lipat dan 4 simetri putar.'
                      : symShape === 'persegi_panjang'
                      ? 'Persegi panjang memiliki 2 simetri lipat dan 2 simetri putar.'
                      : symShape === 'segitiga'
                      ? 'Segitiga sama sisi memiliki 3 simetri lipat dan 3 simetri putar.'
                      : 'Lingkaran memiliki simetri lipat dan putar tak terhingga.';
                  handleSpeak(counts);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                title="Dengarkan Penjelasan"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1 text-xs">
              {[
                { id: 'persegi', label: 'Persegi' },
                { id: 'persegi_panjang', label: 'P. Panjang' },
                { id: 'segitiga', label: 'Segitiga' },
                { id: 'lingkaran', label: 'Lingkaran' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSymShape(s.id as any);
                    setSymAngle(0);
                  }}
                  className={`py-1 rounded-xl font-bold border transition-all cursor-pointer ${
                    symShape === s.id
                      ? 'bg-teal-600 text-white border-teal-700'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-white relative">
              <div
                style={{ transform: `rotate(${symAngle}deg)` }}
                className="transition-transform duration-300 flex items-center justify-center my-3 relative"
              >
                {symShape === 'persegi' && (
                  <div className="w-20 h-20 bg-teal-400/80 rounded-sm border-2 border-teal-300 flex items-center justify-center" />
                )}
                {symShape === 'persegi_panjang' && (
                  <div className="w-28 h-16 bg-teal-400/80 rounded-sm border-2 border-teal-300 flex items-center justify-center" />
                )}
                {symShape === 'segitiga' && (
                  <div className="w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[60px] border-b-teal-400" />
                )}
                {symShape === 'lingkaran' && (
                  <div className="w-20 h-20 bg-teal-400/80 rounded-full border-2 border-teal-300 flex items-center justify-center" />
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setSymAngle((prev) => (prev + 90) % 360)}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Putar 90° (Saat ini: {symAngle}°)</span>
                </button>
              </div>
            </div>

            <div className="bg-teal-50/80 p-3 rounded-2xl border border-teal-200 text-xs font-semibold text-teal-950 flex justify-between">
              <span>
                Simetri Lipat: <strong className="text-teal-800">{symShape === 'persegi' ? '4' : symShape === 'persegi_panjang' ? '2' : symShape === 'segitiga' ? '3' : 'Tak Terhingga (∞)'}</strong>
              </span>
              <span>
                Simetri Putar: <strong className="text-teal-800">{symShape === 'persegi' ? '4' : symShape === 'persegi_panjang' ? '2' : symShape === 'segitiga' ? '3' : 'Tak Terhingga (∞)'}</strong>
              </span>
            </div>
          </div>
        )}

        {/* LAB 13: BUSUR DERAJAT */}
        {(labFilter === 'all' || labFilter === 'geometry') && (
          <div
            id="lab_angle_protractor"
            className={`bg-white rounded-3xl p-5 border-2 shadow-xs space-y-4 transition-all ${
              highlightedLabId === 'angle_protractor'
                ? 'border-indigo-500 ring-4 ring-indigo-100'
                : 'border-cyan-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-cyan-100 text-cyan-800 font-black text-xs">
                  🧭 Lab 13
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Busur Derajat Sudut Interaktif (0° - 180°)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Lancip, Siku-Siku (90°), Tumpul, & Lurus
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const type =
                    angleDegrees < 90
                      ? 'Sudut Lancip'
                      : angleDegrees === 90
                      ? 'Sudut Siku-Siku tegak lurus'
                      : angleDegrees < 180
                      ? 'Sudut Tumpul'
                      : 'Sudut Lurus';
                  handleSpeak(`Besar sudut ${angleDegrees} derajat. Termasuk jenis ${type}.`);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-cyan-600 transition-colors cursor-pointer"
                title="Dengarkan Penjelasan"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-black text-slate-700">
                <span>Putar Sudut Busur:</span>
                <span className="text-cyan-700 font-mono text-base font-black bg-cyan-50 px-2 py-0.5 rounded-lg border border-cyan-200">
                  {angleDegrees}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={angleDegrees}
                onChange={(e) => setAngleDegrees(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-white relative overflow-hidden">
              <svg viewBox="0 0 200 110" className="w-48 h-28 overflow-visible">
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100 Z"
                  fill="rgba(255,255,255,0.05)"
                  stroke="#06b6d4"
                  strokeWidth="2"
                />
                <line x1="100" y1="100" x2="180" y2="100" stroke="#f59e0b" strokeWidth="3" />
                {(() => {
                  const rad = (angleDegrees * Math.PI) / 180;
                  const x = 100 + 80 * Math.cos(-rad);
                  const y = 100 + 80 * Math.sin(-rad);
                  return (
                    <>
                      <line x1="100" y1="100" x2={x} y2={y} stroke="#38bdf8" strokeWidth="3" />
                      <circle cx={x} cy={y} r="4" fill="#38bdf8" />
                    </>
                  );
                })()}
                <circle cx="100" cy="100" r="4" fill="#fbbf24" />
              </svg>

              <div className="text-center mt-2 space-y-1">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                    angleDegrees < 90
                      ? 'bg-amber-400 text-amber-950'
                      : angleDegrees === 90
                      ? 'bg-emerald-400 text-emerald-950 ring-2 ring-emerald-300'
                      : angleDegrees < 180
                      ? 'bg-purple-400 text-purple-950'
                      : 'bg-rose-400 text-rose-950'
                  }`}
                >
                  {angleDegrees < 90
                    ? '📐 Sudut Lancip (Acute)'
                    : angleDegrees === 90
                    ? '🎯 Sudut Siku-Siku (Right Angle 90°)'
                    : angleDegrees < 180
                    ? '🪓 Sudut Tumpul (Obtuse)'
                    : '📏 Sudut Lurus (Straight 180°)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* LAB 14: STATISTIKA CILIK */}
        {(labFilter === 'all' || labFilter === 'data') && (
          <div
            id="lab_mean_median_mode"
            className={`bg-white rounded-3xl p-5 border-2 shadow-xs space-y-4 transition-all ${
              highlightedLabId === 'mean_median_mode'
                ? 'border-indigo-500 ring-4 ring-indigo-100'
                : 'border-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-xs">
                  📊 Lab 14
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Statistika Cilik (Mean, Median, Modus)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Pusat Nilai Rata-rata, Tengah & Terbanyak
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const sum = statNumbers.reduce((a, b) => a + b, 0);
                  const mean = (sum / statNumbers.length).toFixed(1);
                  handleSpeak(`Nilai rata-rata adalah ${mean}. Median nilai tengah adalah ${[...statNumbers].sort((a,b)=>a-b)[2]}.`);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                title="Dengarkan Penjelasan"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-slate-700">
                <span>Ubah 5 Angka Data:</span>
                <button
                  onClick={() => setStatNumbers([4, 7, 7, 9, 13])}
                  className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Reset Angka
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {statNumbers.map((num, idx) => (
                  <div key={idx} className="bg-slate-50 p-2 rounded-2xl border border-slate-200 text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">D{idx + 1}</span>
                    <div className="font-mono font-black text-slate-900 text-base">{num}</div>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          const next = [...statNumbers];
                          next[idx] = Math.max(1, next[idx] - 1);
                          setStatNumbers(next);
                        }}
                        className="w-5 h-5 rounded-md bg-slate-200 hover:bg-slate-300 font-black text-xs text-slate-700 cursor-pointer flex items-center justify-center"
                      >
                        -
                      </button>
                      <button
                        onClick={() => {
                          const next = [...statNumbers];
                          next[idx] = Math.min(20, next[idx] + 1);
                          setStatNumbers(next);
                        }}
                        className="w-5 h-5 rounded-md bg-indigo-100 hover:bg-indigo-200 font-black text-xs text-indigo-700 cursor-pointer flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {(() => {
              const sorted = [...statNumbers].sort((a, b) => a - b);
              const sum = statNumbers.reduce((a, b) => a + b, 0);
              const mean = (sum / statNumbers.length).toFixed(1);
              const median = sorted[Math.floor(sorted.length / 2)];

              const freq: Record<number, number> = {};
              statNumbers.forEach((n) => (freq[n] = (freq[n] || 0) + 1));
              let maxFreq = 0;
              let modeVal: number | null = null;
              Object.entries(freq).forEach(([k, v]) => {
                if (v > maxFreq) {
                  maxFreq = v;
                  modeVal = Number(k);
                }
              });
              const hasMode = maxFreq > 1;

              return (
                <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 space-y-2 text-xs">
                  <div className="text-slate-600 font-semibold">
                    Urutan Data: <strong className="font-mono text-emerald-800">{sorted.join(' , ')}</strong>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] font-black text-slate-400 block uppercase">Mean (Rata-rata)</span>
                      <span className="text-base font-black text-emerald-700 font-mono">{mean}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] font-black text-slate-400 block uppercase">Median (Tengah)</span>
                      <span className="text-base font-black text-indigo-700 font-mono">{median}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] font-black text-slate-400 block uppercase">Modus (Terbanyak)</span>
                      <span className="text-base font-black text-purple-700 font-mono">
                        {hasMode ? modeVal : 'Semua sama'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* LAB 15: SEGITIGA JKW */}
        {(labFilter === 'all' || labFilter === 'measurement') && (
          <div
            id="lab_jkw_speed"
            className={`bg-white rounded-3xl p-5 border-2 shadow-xs space-y-4 transition-all ${
              highlightedLabId === 'jkw_speed'
                ? 'border-indigo-500 ring-4 ring-indigo-100'
                : 'border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-amber-100 text-amber-800 font-black text-xs">
                  🚗 Lab 15
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Segitiga Rumus J-K-W (Jarak, Kecepatan, Waktu)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-bold">
                    Trik Menghitung Kecepatan Kendaraan
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (jkwMode === 'jarak') {
                    handleSpeak(`Mencari Jarak. Kecepatan ${jkwSpeed} km per jam dikali waktu ${jkwTime} jam sama dengan ${jkwSpeed * jkwTime} km.`);
                  } else if (jkwMode === 'kecepatan') {
                    handleSpeak(`Mencari Kecepatan. Jarak ${jkwDistance} km dibagi waktu ${jkwTime} jam sama dengan ${jkwDistance / jkwTime} km per jam.`);
                  } else {
                    handleSpeak(`Mencari Waktu. Jarak ${jkwDistance} km dibagi kecepatan ${jkwSpeed} km per jam sama dengan ${(jkwDistance / jkwSpeed).toFixed(1)} jam.`);
                  }
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                title="Dengarkan Penjelasan"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'jarak', label: 'Cari Jarak (J)' },
                { id: 'kecepatan', label: 'Cari Kecepatan (K)' },
                { id: 'waktu', label: 'Cari Waktu (W)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setJkwMode(m.id as any)}
                  className={`py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    jkwMode === m.id
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="bg-amber-50/90 p-4 rounded-2xl border border-amber-200 text-center space-y-1">
              <div className="text-2xl font-black text-amber-950 font-mono">
                {jkwMode === 'jarak' && `${jkwSpeed * jkwTime} km`}
                {jkwMode === 'kecepatan' && `${(jkwDistance / jkwTime).toFixed(1)} km/jam`}
                {jkwMode === 'waktu' && `${(jkwDistance / jkwSpeed).toFixed(1)} jam`}
              </div>
            </div>
          </div>
        )}

        {/* LAB 01: TRIK 11 */}
        {(labFilter === 'all' || labFilter === 'mental') && (
          <div
            id="lab_multiply_11"
            className="bg-white rounded-3xl p-5 border-2 border-indigo-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                  ⚡
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Lab 01: Trik Kilat Perkalian 11</h3>
                  <p className="text-xs text-slate-500 font-bold">Sisipkan jumlah digit di tengah</p>
                </div>
              </div>
              <button
                onClick={() => handleSpeak(`Trik perkalian 11. Angka ${numFor11} dikali 11. Hasil akhirnya adalah ${result11}`)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                title="Dengarkan Suara"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

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

            <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-200 text-center space-y-2">
              <div className="text-2xl font-black text-indigo-950 flex items-center justify-center gap-2">
                <span>{numFor11} × 11 =</span>
                <span className="text-emerald-600 bg-white px-3 py-1 rounded-xl shadow-xs border border-emerald-300 font-mono">
                  {result11}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* LAB 02: BAR MODEL */}
        {(labFilter === 'all' || labFilter === 'cambridge') && (
          <div
            id="lab_bar_model"
            className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                  📊
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Lab 02: Cambridge Bar Model</h3>
                  <p className="text-xs text-slate-500 font-bold">Model perbandingan dua kuantitas</p>
                </div>
              </div>
            </div>

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

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
              <div className="w-full bg-slate-200 h-6 rounded-lg overflow-hidden flex">
                <div
                  style={{ width: `${(barA / 100) * 100}%` }}
                  className="bg-emerald-500 h-full text-white text-[11px] font-black flex items-center justify-center transition-all"
                >
                  {barA}
                </div>
              </div>
              <div className="w-full bg-slate-200 h-6 rounded-lg overflow-hidden flex">
                <div
                  style={{ width: `${(barB / 100) * 100}%` }}
                  className="bg-blue-500 h-full text-white text-[11px] font-black flex items-center justify-center transition-all"
                >
                  {barB}
                </div>
              </div>
              <div className="text-center pt-1 text-xs font-bold text-slate-700">
                Total A + B = <span className="font-black text-indigo-700 font-mono">{barA + barB}</span> | Selisih = <span className="font-black text-rose-600 font-mono">{Math.abs(barA - barB)}</span>
              </div>
            </div>
          </div>
        )}

        {/* LAB 03: TEN-FRAME */}
        {(labFilter === 'all' || labFilter === 'cambridge') && (
          <div
            id="lab_ten_frame"
            className="bg-white rounded-3xl p-5 border-2 border-orange-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-orange-100 text-orange-800 font-black text-xs">
                  🔟 Lab 03
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Ten-Frame (Bingkai 10)</h3>
                  <p className="text-[11px] text-slate-500 font-bold">Pondasi Teman Sepuluh SD 1</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-black text-slate-600">
                <span>Isi Kotak (1 - 10):</span>
                <span className="text-orange-600 font-black text-sm">{tenFrameCount}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={tenFrameCount}
                onChange={(e) => setTenFrameCount(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-5 gap-2 p-3 bg-orange-50/50 rounded-2xl border border-orange-200">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-12 rounded-xl flex items-center justify-center font-black text-lg transition-all border ${
                    i < tenFrameCount
                      ? 'bg-orange-500 text-white border-orange-600 shadow-xs scale-95'
                      : 'bg-white text-slate-300 border-slate-200 border-dashed'
                  }`}
                >
                  {i < tenFrameCount ? '🍎' : ''}
                </div>
              ))}
            </div>

            <div className="bg-orange-50 rounded-2xl p-3 border border-orange-200 text-center text-xs font-bold text-orange-950">
              Teman Sepuluh: <span className="text-orange-700 font-black">{tenFrameCount}</span> + <span className="text-emerald-700 font-black">{10 - tenFrameCount}</span> = 10!
            </div>
          </div>
        )}

        {/* LAB 04: KUADRAT AKHIRAN 5 */}
        {(labFilter === 'all' || labFilter === 'mental') && (
          <div
            id="lab_square_5"
            className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-xs">
                  ✨ Lab 04
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Kuadrat Angka Berakhiran 5</h3>
                  <p className="text-[11px] text-slate-500 font-bold">Puluhan × Kakaknya, tempel 25</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[15, 25, 35, 45, 65, 75, 85, 95].map((val) => (
                <button
                  key={val}
                  onClick={() => setNumEnding5(val)}
                  className={`px-3 py-1 rounded-xl text-xs font-black border cursor-pointer ${
                    numEnding5 === val
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 text-center space-y-2">
              <div className="text-xs font-semibold text-emerald-900">
                {tens5} × ({tens5} + 1) = <strong className="text-emerald-800">{prefix5}</strong>, lalu tempelkan <strong className="text-emerald-800">25</strong>!
              </div>
              <div className="text-2xl font-black text-emerald-950 flex items-center justify-center gap-2">
                <span>{numEnding5}² =</span>
                <span className="text-emerald-700 bg-white px-3 py-1 rounded-xl shadow-xs border border-emerald-300 font-mono">
                  {resultSq5}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* LAB 05: VISUALISASI PECAHAN */}
        {(labFilter === 'all' || labFilter === 'fractions') && (
          <div
            id="lab_fractions"
            className="bg-white rounded-3xl p-5 border-2 border-pink-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-black text-sm">
                  🍕
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Lab 05: Visualisasi Pecahan & Persen</h3>
                  <p className="text-xs text-slate-500 font-bold">Potongan pizza dan bar proporsi</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-600">
              <div>
                <label className="block mb-1">Pembilang: <span className="text-pink-600 font-black">{fracNum}</span></label>
                <input
                  type="range"
                  min="1"
                  max={fracDenom}
                  value={fracNum}
                  onChange={(e) => setFracNum(Number(e.target.value))}
                  className="w-full accent-pink-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block mb-1">Penyebut: <span className="text-purple-600 font-black">{fracDenom}</span></label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={fracDenom}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFracDenom(val);
                    if (fracNum > val) setFracNum(val);
                  }}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex h-8 w-full bg-slate-200 rounded-xl overflow-hidden p-1 gap-1">
                {Array.from({ length: fracDenom }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-lg transition-all ${
                      i < fracNum ? 'bg-pink-500 shadow-xs' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <div className="bg-pink-50/80 rounded-2xl p-3 border border-pink-200 text-center text-xs font-bold text-pink-950 flex items-center justify-around">
                <div>Pecahan: <span className="font-black text-pink-700 font-mono text-sm">{fracNum}/{fracDenom}</span></div>
                <div>Desimal: <span className="font-black text-purple-700 font-mono text-sm">{(fracNum / fracDenom).toFixed(2)}</span></div>
                <div>Persen: <span className="font-black text-emerald-700 font-mono text-sm">{Math.round((fracNum / fracDenom) * 100)}%</span></div>
              </div>
            </div>
          </div>
        )}

        {/* LAB 06: GEOMETRI BANGUN DATAR */}
        {(labFilter === 'all' || labFilter === 'geometry') && (
          <div
            id="lab_geometry_calc"
            className="bg-white rounded-3xl p-5 border-2 border-indigo-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-indigo-100 text-indigo-800 font-black text-xs">
                  📐 Lab 06
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Geometri Luas & Keliling Persegi Panjang</h3>
                  <p className="text-[11px] text-slate-500 font-bold">Panjang × Lebar & 2 × (P + L)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Panjang: {geoLength} cm</label>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={geoLength}
                  onChange={(e) => setGeoLength(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block mb-1">Lebar: {geoWidth} cm</label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={geoWidth}
                  onChange={(e) => setGeoWidth(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-200 grid grid-cols-2 gap-3 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Luas (p × l)</span>
                <span className="text-lg font-black text-indigo-700 font-mono">{geoLength * geoWidth} cm²</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-indigo-200 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Keliling 2×(p+l)</span>
                <span className="text-lg font-black text-emerald-700 font-mono">{2 * (geoLength + geoWidth)} cm</span>
              </div>
            </div>
          </div>
        )}

        {/* LAB 07: JAM ANALOG */}
        {(labFilter === 'all' || labFilter === 'measurement') && (
          <div
            id="lab_clock"
            className="bg-white rounded-3xl p-5 border-2 border-blue-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-blue-100 text-blue-800 font-black text-xs">
                  ⏰ Lab 07
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Jam Analog & Digital Interaktif</h3>
                  <p className="text-[11px] text-slate-500 font-bold">Membaca jarum jam dan menit</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Jam: {clockHour}</label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={clockHour}
                  onChange={(e) => setClockHour(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block mb-1">Menit: {clockMinute}</label>
                <input
                  type="range"
                  min="0"
                  max="55"
                  step="5"
                  value={clockMinute}
                  onChange={(e) => setClockMinute(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center gap-6 text-white">
              <div className="w-20 h-20 rounded-full border-2 border-white/40 relative flex items-center justify-center">
                <div
                  style={{ transform: `rotate(${((clockHour % 12) + clockMinute / 60) * 30}deg)` }}
                  className="w-1 h-6 bg-amber-400 absolute bottom-10 origin-bottom rounded-full"
                />
                <div
                  style={{ transform: `rotate(${clockMinute * 6}deg)` }}
                  className="w-0.5 h-8 bg-sky-400 absolute bottom-10 origin-bottom rounded-full"
                />
                <div className="w-2 h-2 rounded-full bg-white z-10" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-black block">Jam Digital</span>
                <span className="text-2xl font-black font-mono tracking-wider text-emerald-400">
                  {String(clockHour).padStart(2, '0')}:{String(clockMinute).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* LAB 08: DOMPET KOIN KASIR */}
        {(labFilter === 'all' || labFilter === 'data') && (
          <div
            id="lab_coin_cashier"
            className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-amber-100 text-amber-800 font-black text-xs">
                  🪙 Lab 08
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Dompet Koin & Kasir Rupiah</h3>
                  <p className="text-[11px] text-slate-500 font-bold">Membayar Pas dan Kembalian</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[100, 200, 500, 1000].map((val) => (
                <button
                  key={val}
                  onClick={() => setCashierCoins((prev) => [...prev, val])}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-black text-amber-900 cursor-pointer shadow-2xs"
                >
                  + Rp {val}
                </button>
              ))}
              <button
                onClick={() => setCashierCoins([])}
                className="px-2 py-1 rounded-xl text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
              >
                Kosongkan
              </button>
            </div>

            <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Total Uang di Dompet:</span>
              <span className="text-xl font-black text-amber-800 font-mono">
                Rp {cashierCoins.reduce((a, b) => a + b, 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}

        {/* LAB 09: POROGAPIT 4 LANGKAH */}
        {(labFilter === 'all' || labFilter === 'mental') && (
          <div
            id="lab_porogapit"
            className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-purple-100 text-purple-800 font-black text-xs">
                  ➗ Lab 09
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Pembagian Bersusun Porogapit</h3>
                  <p className="text-[11px] text-slate-500 font-bold">Bagi ➔ Kali ➔ Kurang ➔ Turun</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Angka Dibagi: {porogapitDividend}</label>
                <input
                  type="range"
                  min="20"
                  max="150"
                  step="5"
                  value={porogapitDividend}
                  onChange={(e) => setPorogapitDividend(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block mb-1">Angka Pembagi: {porogapitDivisor}</label>
                <input
                  type="range"
                  min="2"
                  max="9"
                  value={porogapitDivisor}
                  onChange={(e) => setPorogapitDivisor(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-purple-50/80 p-3 rounded-2xl border border-purple-200 text-center space-y-1">
              <span className="text-xs font-semibold text-purple-900">
                {porogapitDividend} ÷ {porogapitDivisor} =
              </span>
              <div className="text-xl font-black text-purple-950 font-mono">
                {Math.floor(porogapitDividend / porogapitDivisor)} sisa {porogapitDividend % porogapitDivisor}
              </div>
            </div>
          </div>
        )}

        {/* LAB 10: POHON FAKTOR & KPK/FPB */}
        {(labFilter === 'all' || labFilter === 'mental') && (
          <div
            id="lab_prime_factors"
            className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-xs">
                  🌳 Lab 10
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Pohon Faktor & KPK / FPB</h3>
                  <p className="text-[11px] text-slate-500 font-bold">Faktorisasi Bilangan Prima</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Angka A: {kpkNumA}</label>
                <input
                  type="range"
                  min="4"
                  max="36"
                  value={kpkNumA}
                  onChange={(e) => setKpkNumA(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block mb-1">Angka B: {kpkNumB}</label>
                <input
                  type="range"
                  min="4"
                  max="36"
                  value={kpkNumB}
                  onChange={(e) => setKpkNumB(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {(() => {
              const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
              const fpb = gcd(kpkNumA, kpkNumB);
              const kpk = (kpkNumA * kpkNumB) / fpb;
              return (
                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">FPB (Bagi Rata)</span>
                    <span className="text-base font-black text-emerald-700 font-mono">{fpb}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">KPK (Jadwal Bareng)</span>
                    <span className="text-base font-black text-indigo-700 font-mono">{kpk}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* LAB 11: ARRAY MATRIKS PERKALIAN */}
        {(labFilter === 'all' || labFilter === 'mental') && (
          <div
            id="lab_multiplication_array"
            className="bg-white rounded-3xl p-5 border-2 border-teal-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-teal-100 text-teal-800 font-black text-xs">
                  🧱 Lab 11
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Array Matriks Perkalian</h3>
                  <p className="text-[11px] text-slate-500 font-bold">Baris × Kolom = Total Benda</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Baris: {arrayRows}</label>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={arrayRows}
                  onChange={(e) => setArrayRows(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block mb-1">Kolom: {arrayCols}</label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={arrayCols}
                  onChange={(e) => setArrayCols(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col items-center gap-1.5 overflow-x-auto">
              {Array.from({ length: arrayRows }).map((_, r) => (
                <div key={r} className="flex gap-1.5">
                  {Array.from({ length: arrayCols }).map((_, c) => (
                    <div
                      key={c}
                      className="w-5 h-5 rounded-md bg-teal-500 border border-teal-600 shadow-2xs"
                    />
                  ))}
                </div>
              ))}
              <div className="pt-2 text-xs font-black text-slate-800">
                {arrayRows} baris × {arrayCols} kolom = <span className="text-teal-700 font-mono text-sm">{arrayRows * arrayCols}</span>
              </div>
            </div>
          </div>
        )}

        {/* LAB 12: TANGGA SATUAN METRIK */}
        {(labFilter === 'all' || labFilter === 'measurement') && (
          <div
            id="lab_metric_ladder"
            className="bg-white rounded-3xl p-5 border-2 border-sky-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-sky-100 text-sky-800 font-black text-xs">
                  🪜 Lab 12
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Tangga Satuan Metrik 7 Tingkat</h3>
                  <p className="text-[11px] text-slate-500 font-bold">Turun ×10, Naik ÷10 (Sistem Desimal)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Nilai:</span>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={metricValue}
                  onChange={(e) => setMetricValue(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 font-black text-slate-800 text-center"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Dari:</span>
                <select
                  value={metricFromUnit}
                  onChange={(e) => setMetricFromUnit(e.target.value)}
                  className="w-full py-1.5 px-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs"
                >
                  {['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Ke:</span>
                <select
                  value={metricToUnit}
                  onChange={(e) => setMetricToUnit(e.target.value)}
                  className="w-full py-1.5 px-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-xs"
                >
                  {['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {(() => {
              const ladder = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
              const diff = ladder.indexOf(metricToUnit) - ladder.indexOf(metricFromUnit);
              const multiplier = Math.pow(10, Math.abs(diff));
              const res = diff >= 0 ? metricValue * multiplier : metricValue / multiplier;
              return (
                <div className="bg-sky-50/80 p-3 rounded-2xl border border-sky-200 text-center font-bold text-xs text-sky-950">
                  {metricValue} {metricFromUnit} = <span className="font-black text-sky-800 font-mono text-sm">{res.toLocaleString('id-ID')} {metricToUnit}</span>
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                    {diff > 0 ? `Turun ${diff} tangga (kalikan ${multiplier})` : diff < 0 ? `Naik ${Math.abs(diff)} tangga (bagi ${multiplier})` : 'Tingkat sama'}
                  </span>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
