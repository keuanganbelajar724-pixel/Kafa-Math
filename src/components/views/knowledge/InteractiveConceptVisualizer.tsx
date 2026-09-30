import React, { useState } from 'react';
import { sound } from '../../../services/sound';
import { Sparkles, RotateCcw, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface InteractiveConceptVisualizerProps {
  articleId: string;
}

export const InteractiveConceptVisualizer: React.FC<InteractiveConceptVisualizerProps> = ({ articleId }) => {
  // 1. Ten-Frame State
  const [tenFrameCount, setTenFrameCount] = useState<number>(7);

  // 2. Porogapit Step State
  const [porogapitStep, setPorogapitStep] = useState<number>(1);

  // 3. Fraction Pizza Slices
  const [fractionDenom, setFractionDenom] = useState<number>(4);
  const [fractionNum, setFractionNum] = useState<number>(3);

  // 4. Bar Model Parts
  const [barPartA, setBarPartA] = useState<number>(15);
  const [barPartB, setBarPartB] = useState<number>(25);

  // 5. Metric Step
  const [selectedMetric, setSelectedMetric] = useState<string>('m');

  // 6. Clock Time
  const [clockHour, setClockHour] = useState<number>(3);
  const [clockMinute, setClockMinute] = useState<number>(15);

  // 7. Factor Tree Number
  const [factorNum, setFactorNum] = useState<24 | 36>(24);

  // 8. Angle Degrees
  const [angleDegrees, setAngleDegrees] = useState<number>(60);

  // 9. Submarine Integer Depth
  const [submarineDepth, setSubmarineDepth] = useState<number>(-3);

  // 10. Area & Perimeter Grid
  const [gridWidth, setGridWidth] = useState<number>(6);
  const [gridHeight, setGridHeight] = useState<number>(4);

  // 11. Balance Scale Algebra
  const [scaleAddend, setScaleAddend] = useState<number>(4);
  const [scaleTarget, setScaleTarget] = useState<number>(10);
  const [scaleSolved, setScaleSolved] = useState<boolean>(false);

  // 12. Bar Chart & Mean
  const [barFruitApples, setBarFruitApples] = useState<number>(6);
  const [barFruitOranges, setBarFruitOranges] = useState<number>(4);
  const [barFruitBananas, setBarFruitBananas] = useState<number>(8);

  // 13. Area Model Multiplication
  const [areaTensA, setAreaTensA] = useState<number>(10);
  const [areaOnesA, setAreaOnesA] = useState<number>(4);
  const [areaTensB, setAreaTensB] = useState<number>(10);
  const [areaOnesB, setAreaOnesB] = useState<number>(2);

  // 14. Equivalent Fractions
  const [equivMultiplier, setEquivMultiplier] = useState<number>(2);

  // 15. Thermometer Temperature
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(25);

  // 16. Rupiah Cashier & Change
  const [cashierPrice, setCashierPrice] = useState<number>(14000);
  const [cashierPayment, setCashierPayment] = useState<number>(20000);

  // 17. Place Value Base-10 Blocks
  const [placeValThousands, setPlaceValThousands] = useState<number>(2);
  const [placeValHundreds, setPlaceValHundreds] = useState<number>(4);
  const [placeValTens, setPlaceValTens] = useState<number>(5);
  const [placeValUnits, setPlaceValUnits] = useState<number>(8);

  // 18. Percentage & Discount
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [originalPrice, setOriginalPrice] = useState<number>(80000);

  // 1. TEN-FRAME VISUALIZER
  if (articleId.includes('ten_frame') || articleId.includes('number_bonds') || articleId.includes('counting')) {
    const friendTo10 = 10 - tenFrameCount;
    return (
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/20 rounded-2xl p-4 border-2 border-amber-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-amber-300">
          <span className="flex items-center gap-1.5">
            <span>🔟</span>
            <span>Simulator Interaktif: Ten-Frame & Teman Sepuluh</span>
          </span>
          <span className="bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-300/30">
            {tenFrameCount} + {friendTo10} = 10
          </span>
        </div>

        {/* 2x5 Grid */}
        <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto p-2.5 bg-slate-950/70 rounded-2xl border-2 border-amber-500/50">
          {Array.from({ length: 10 }).map((_, i) => {
            const isFilled = i < tenFrameCount;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTenFrameCount(i + 1 === tenFrameCount ? i : i + 1);
                }}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-2xl transition-all cursor-pointer border-2 ${
                  isFilled
                    ? 'bg-amber-500 border-yellow-200 shadow-md scale-102'
                    : 'bg-slate-900 border-dashed border-slate-700 hover:border-slate-500'
                }`}
              >
                {isFilled ? '🍎' : ''}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
          <span>Ketuk kotak untuk menambah/mengurangi apel.</span>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setTenFrameCount(5);
            }}
            className="text-amber-300 hover:text-white underline font-bold cursor-pointer"
          >
            Reset (5)
          </button>
        </div>
      </div>
    );
  }

  // 2. POROGAPIT VISUALIZER (Pembagian Bersusun 72 : 3)
  if (articleId.includes('porogapit') || articleId.includes('pembagian')) {
    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-cyan-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-cyan-300">
          <span className="flex items-center gap-1.5">
            <span>➗</span>
            <span>Simulator Interaktif: Langkah Porogapit (72 : 3)</span>
          </span>
          <span className="bg-cyan-500/20 px-2.5 py-0.5 rounded-lg border border-cyan-400/40 font-mono">
            Hasil: 24
          </span>
        </div>

        {/* Step-by-step chalkboard */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 font-mono text-center flex flex-col items-center">
          <div className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
            {porogapitStep >= 2 ? '2' : ''}
            {porogapitStep >= 4 ? '4' : ''}
          </div>
          <div className="w-24 h-0.5 bg-amber-400 my-1" />
          <div className="text-xl font-bold flex items-center gap-2">
            <span className="text-cyan-400">3</span>
            <span>)</span>
            <span className="text-white">7 2</span>
          </div>

          {porogapitStep >= 2 && (
            <div className="text-sm text-slate-400 mt-2">
              <span className="text-rose-400 block">- 6</span>
              <div className="w-16 h-px bg-slate-600 my-0.5 mx-auto" />
              <span className="text-amber-300 font-bold">1 2</span>
            </div>
          )}

          {porogapitStep >= 4 && (
            <div className="text-sm text-slate-400 mt-1">
              <span className="text-rose-400 block">- 1 2</span>
              <div className="w-16 h-px bg-slate-600 my-0.5 mx-auto" />
              <span className="text-emerald-400 font-black">0 (Selesai!)</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-300">
            {porogapitStep === 1 && 'Langkah 1: Bagi angka depan 7 : 3 = 2 sisa 1.'}
            {porogapitStep === 2 && 'Langkah 2: Kalikan 2 x 3 = 6, lalu kurangkan (7 - 6 = 1).'}
            {porogapitStep === 3 && 'Langkah 3: Turunkan angka 2 menjadi 12.'}
            {porogapitStep === 4 && 'Langkah 4: Bagi 12 : 3 = 4, kalikan 4 x 3 = 12, sisa 0!'}
          </span>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setPorogapitStep((prev) => (prev >= 4 ? 1 : prev + 1));
            }}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs cursor-pointer flex items-center gap-1 shadow-md shrink-0"
          >
            <span>{porogapitStep >= 4 ? 'Ulangi' : 'Langkah Maju'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 3. BAR MODEL VISUALIZER
  if (articleId.includes('bar_model') || articleId.includes('aljabar')) {
    const whole = barPartA + barPartB;
    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-indigo-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-indigo-300">
          <span className="flex items-center gap-1.5">
            <span>📊</span>
            <span>Visual Bar Model: Part-Whole</span>
          </span>
          <span className="text-amber-300 font-mono">
            {barPartA} + {barPartB} = {whole}
          </span>
        </div>

        {/* Visual Bar representation */}
        <div className="space-y-2">
          {/* Whole Bar */}
          <div className="w-full h-9 rounded-xl bg-indigo-600 border border-indigo-300 flex items-center justify-center font-black text-sm text-white shadow-md">
            Keseluruhan (Whole): {whole}
          </div>

          {/* Parts Bar */}
          <div className="flex gap-1.5 w-full">
            <div
              className="h-10 rounded-xl bg-emerald-600 border border-emerald-300 flex items-center justify-center font-black text-xs text-white transition-all shadow-md"
              style={{ flex: barPartA }}
            >
              Bagian A: {barPartA}
            </div>
            <div
              className="h-10 rounded-xl bg-amber-600 border border-yellow-300 flex items-center justify-center font-black text-xs text-white transition-all shadow-md"
              style={{ flex: barPartB }}
            >
              Bagian B: {barPartB}
            </div>
          </div>
        </div>

        {/* Sliders to experiment */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Ubah Bagian A ({barPartA}):</label>
            <input
              type="range"
              min="5"
              max="40"
              value={barPartA}
              onChange={(e) => setBarPartA(Number(e.target.value))}
              className="w-full cursor-pointer accent-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Ubah Bagian B ({barPartB}):</label>
            <input
              type="range"
              min="5"
              max="40"
              value={barPartB}
              onChange={(e) => setBarPartB(Number(e.target.value))}
              className="w-full cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>
    );
  }

  // 4. PECAHAN PIZZA VISUALIZER
  if (articleId.includes('pecahan') || articleId.includes('fractions')) {
    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-rose-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-rose-300">
          <span className="flex items-center gap-1.5">
            <span>🍕</span>
            <span>Simulator Pecahan Bagian Lingkaran</span>
          </span>
          <span className="bg-rose-500/20 px-2.5 py-0.5 rounded-lg border border-rose-400/40 text-amber-300 font-mono">
            {fractionNum} / {fractionDenom}
          </span>
        </div>

        {/* Slices representation */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: fractionDenom }).map((_, idx) => {
              const isActive = idx < fractionNum;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setFractionNum(idx + 1 === fractionNum ? idx : idx + 1);
                  }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all cursor-pointer border-2 ${
                    isActive
                      ? 'bg-rose-500 border-yellow-200 shadow-md scale-105'
                      : 'bg-slate-900 border-dashed border-slate-700 text-slate-600'
                  }`}
                >
                  {isActive ? '🍕' : '⚪'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Denominator selectors */}
        <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
          <span>Pilih Penyebut:</span>
          <div className="flex gap-1.5">
            {[2, 3, 4, 6, 8].map((den) => (
              <button
                key={den}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setFractionDenom(den);
                  setFractionNum(Math.min(fractionNum, den));
                }}
                className={`px-2.5 py-1 rounded-lg font-black text-xs cursor-pointer border ${
                  fractionDenom === den
                    ? 'bg-rose-500 text-white border-rose-300'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                /{den}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 5. TANGGA SATUAN METRIK (km - mm)
  if (articleId.includes('satuan') || articleId.includes('metrik') || articleId.includes('ladder')) {
    const steps = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-emerald-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-emerald-300">
          <span className="flex items-center gap-1.5">
            <span>📏</span>
            <span>Tangga Satuan Panjang Metrik</span>
          </span>
          <span className="text-amber-300 text-[11px]">
            Turun 1 Tangga x10 • Naik 1 Tangga :10
          </span>
        </div>

        {/* 7-Step Staircase */}
        <div className="flex items-end justify-between gap-1 h-28 pt-2 px-1">
          {steps.map((st, idx) => {
            const isSelected = selectedMetric === st;
            const height = 30 + idx * 10;
            return (
              <button
                key={st}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedMetric(st);
                }}
                className={`flex-1 rounded-t-xl transition-all cursor-pointer flex flex-col items-center justify-end pb-1.5 border-t-2 border-x-2 ${
                  isSelected
                    ? 'bg-emerald-500 border-yellow-200 text-amber-950 font-black shadow-lg scale-105'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
                style={{ height: `${height}%` }}
              >
                <span className="text-xs font-black">{st}</span>
              </button>
            );
          })}
        </div>

        <div className="text-center text-xs text-emerald-200 font-bold bg-emerald-950/60 p-2 rounded-xl border border-emerald-500/30">
          Satuan Terpilih: <span className="text-yellow-300 font-black uppercase">{selectedMetric}</span>
          {selectedMetric === 'km' && ' ➔ 1 km = 1.000 m (Turun 3 tangga, x10 x10 x10)'}
          {selectedMetric === 'm' && ' ➔ 1 m = 100 cm (Turun 2 tangga, x100)'}
          {selectedMetric === 'cm' && ' ➔ 1 cm = 10 mm (Turun 1 tangga, x10)'}
          {selectedMetric === 'mm' && ' ➔ 10 mm = 1 cm (Naik 1 tangga, :10)'}
        </div>
      </div>
    );
  }

  // 6. JAM ANALOG VISUALIZER
  if (articleId.includes('jam') || articleId.includes('waktu') || articleId.includes('clock')) {
    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-yellow-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-yellow-300">
          <span className="flex items-center gap-1.5">
            <span>⏰</span>
            <span>Jam Analog Interaktif</span>
          </span>
          <span className="text-amber-300 font-mono text-sm bg-black/50 px-2.5 py-0.5 rounded-lg border border-yellow-400/30">
            {String(clockHour).padStart(2, '0')}:{String(clockMinute).padStart(2, '0')}
          </span>
        </div>

        {/* Sliders for Hour & Minute */}
        <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Jarum Jam (Pendek): {clockHour}</label>
            <input
              type="range"
              min="1"
              max="12"
              value={clockHour}
              onChange={(e) => setClockHour(Number(e.target.value))}
              className="w-full cursor-pointer accent-amber-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Jarum Menit (Panjang): {clockMinute}</label>
            <input
              type="range"
              min="0"
              max="55"
              step="5"
              value={clockMinute}
              onChange={(e) => setClockMinute(Number(e.target.value))}
              className="w-full cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        <div className="text-center text-xs text-amber-200 bg-amber-950/60 p-2 rounded-xl border border-amber-500/30">
          Waktu: Pukul {clockHour} lebih {clockMinute} menit ({clockMinute === 0 ? 'Tepat' : clockMinute === 30 ? 'Setengah' : `${clockMinute} Menit`})
        </div>
      </div>
    );
  }

  // 7. POHON FAKTOR & FPB KPK VISUALIZER
  if (articleId.includes('faktor') || articleId.includes('fpb') || articleId.includes('kpk')) {
    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-emerald-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-emerald-300">
          <span className="flex items-center gap-1.5">
            <span>🌳</span>
            <span>Simulator Pohon Faktor & Faktorisasi Prima</span>
          </span>
          <div className="flex gap-1.5">
            {[24, 36].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setFactorNum(num as 24 | 36);
                }}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-black cursor-pointer border ${
                  factorNum === num
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Angka {num}
              </button>
            ))}
          </div>
        </div>

        {/* Tree Branch Diagram */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-amber-950 font-black text-lg flex items-center justify-center shadow-md">
            {factorNum}
          </div>
          <div className="text-xs text-slate-500 my-0.5">╱ &nbsp; ╲</div>

          {factorNum === 24 ? (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-8">
                <span className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-300 shadow-md">
                  2
                </span>
                <span className="w-9 h-9 rounded-xl bg-slate-800 text-amber-300 font-black text-sm flex items-center justify-center border border-slate-600">
                  12
                </span>
              </div>
              <div className="text-xs text-slate-500 ml-16">╱ &nbsp; ╲</div>
              <div className="flex items-center justify-center gap-6 ml-16">
                <span className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-300 shadow-md">
                  2
                </span>
                <span className="w-9 h-9 rounded-xl bg-slate-800 text-amber-300 font-black text-sm flex items-center justify-center border border-slate-600">
                  6
                </span>
              </div>
              <div className="text-xs text-slate-500 ml-28">╱ &nbsp; ╲</div>
              <div className="flex items-center justify-center gap-6 ml-28">
                <span className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-300 shadow-md">
                  2
                </span>
                <span className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-300 shadow-md">
                  3
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-8">
                <span className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-300 shadow-md">
                  2
                </span>
                <span className="w-9 h-9 rounded-xl bg-slate-800 text-amber-300 font-black text-sm flex items-center justify-center border border-slate-600">
                  18
                </span>
              </div>
              <div className="text-xs text-slate-500 ml-16">╱ &nbsp; ╲</div>
              <div className="flex items-center justify-center gap-6 ml-16">
                <span className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-300 shadow-md">
                  2
                </span>
                <span className="w-9 h-9 rounded-xl bg-slate-800 text-amber-300 font-black text-sm flex items-center justify-center border border-slate-600">
                  9
                </span>
              </div>
              <div className="text-xs text-slate-500 ml-28">╱ &nbsp; ╲</div>
              <div className="flex items-center justify-center gap-6 ml-28">
                <span className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-300 shadow-md">
                  3
                </span>
                <span className="w-9 h-9 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center ring-2 ring-emerald-300 shadow-md">
                  3
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-emerald-200 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/30">
          Faktorisasi Prima {factorNum}:{' '}
          <span className="font-mono text-yellow-300 font-black">
            {factorNum === 24 ? '2 × 2 × 2 × 3 = 2³ × 3' : '2 × 2 × 3 × 3 = 2² × 3²'}
          </span>
          <span className="block text-[11px] text-slate-400 mt-0.5">
            Lingkaran hijau adalah bilangan prima (ujung ranting daun).
          </span>
        </div>
      </div>
    );
  }

  // 8. BUSUR DERAJAT & SUDUT VISUALIZER
  if (articleId.includes('sudut') || articleId.includes('busur') || articleId.includes('angle')) {
    const angleType =
      angleDegrees < 90
        ? 'Sudut Lancip (< 90°)'
        : angleDegrees === 90
        ? 'Sudut Siku-Siku (= 90°)'
        : angleDegrees < 180
        ? 'Sudut Tumpul (> 90°)'
        : 'Sudut Lurus (= 180°)';

    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-indigo-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-indigo-300">
          <span className="flex items-center gap-1.5">
            <span>📐</span>
            <span>Simulator Busur Derajat Sudut</span>
          </span>
          <span className="bg-indigo-500/20 px-2.5 py-0.5 rounded-lg border border-indigo-400/40 text-amber-300 font-mono text-sm">
            {angleDegrees}°
          </span>
        </div>

        {/* Protractor Arc Drawing */}
        <div className="relative h-28 bg-slate-900 rounded-xl border border-slate-700 flex items-end justify-center overflow-hidden">
          {/* Semicircle protractor outline */}
          <div className="w-48 h-24 rounded-t-full border-2 border-dashed border-indigo-400/50 relative">
            <span className="absolute left-1 bottom-1 text-[9px] text-slate-500">180°</span>
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-amber-400 font-bold">90°</span>
            <span className="absolute right-1 bottom-1 text-[9px] text-slate-500">0°</span>

            {/* Arm pointer */}
            <div
              className="absolute bottom-0 right-1/2 w-20 h-1 bg-yellow-400 origin-right transition-transform duration-200 shadow-md"
              style={{ transform: `rotate(${-angleDegrees}deg)` }}
            />
          </div>
          {/* Base baseline */}
          <div className="absolute bottom-0 inset-x-8 h-1 bg-slate-500" />
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">
            Geser Sudut: <span className="text-white font-bold">{angleDegrees}°</span>
          </label>
          <input
            type="range"
            min="10"
            max="180"
            step="5"
            value={angleDegrees}
            onChange={(e) => setAngleDegrees(Number(e.target.value))}
            className="w-full cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="text-center text-xs text-indigo-200 bg-indigo-950/60 p-2 rounded-xl border border-indigo-500/30">
          Jenis Sudut: <span className="text-yellow-300 font-black">{angleType}</span>
        </div>
      </div>
    );
  }

  // 9. GARIS BILANGAN KAPAL SELAM (BILANGAN NEGATIF)
  if (articleId.includes('negatif') || articleId.includes('bulat') || articleId.includes('submarin')) {
    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-cyan-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-cyan-300">
          <span className="flex items-center gap-1.5">
            <span>⚓</span>
            <span>Garis Bilangan: Permukaan Laut & Kedalaman</span>
          </span>
          <span className="bg-cyan-500/20 px-2.5 py-0.5 rounded-lg border border-cyan-400/40 font-mono text-sm">
            {submarineDepth > 0 ? `+${submarineDepth}` : submarineDepth} meter
          </span>
        </div>

        {/* Sea Level Visual */}
        <div className="h-32 rounded-xl bg-gradient-to-b from-sky-400/20 via-blue-600/30 to-blue-950 border border-cyan-500/40 relative flex flex-col justify-between p-2 overflow-hidden">
          {/* Sky (+5 to +1) */}
          <div className="text-[11px] text-sky-200 flex items-center justify-between">
            <span>☁️ Langit (Positif +)</span>
            {submarineDepth > 0 && (
              <span className="text-2xl animate-bounce">🦅</span>
            )}
          </div>

          {/* Sea level 0 line */}
          <div className="w-full border-b-2 border-dashed border-cyan-300 flex items-center justify-between text-[10px] text-cyan-200 px-1">
            <span>🌊 Permukaan Laut = 0</span>
            {submarineDepth === 0 && (
              <span className="text-xl">⛵ Di Atas Air</span>
            )}
          </div>

          {/* Underwater (-1 to -5) */}
          <div className="text-[11px] text-blue-300 flex items-center justify-between">
            <span>🐠 Bawah Laut (Negatif -)</span>
            {submarineDepth < 0 && (
              <span className="text-2xl animate-pulse">🚢 Kapal Selam</span>
            )}
          </div>
        </div>

        {/* Slider -5 to +5 */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
            <span>-5 (Dalam)</span>
            <span>0 (Laut)</span>
            <span>+5 (Tinggi)</span>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            value={submarineDepth}
            onChange={(e) => setSubmarineDepth(Number(e.target.value))}
            className="w-full cursor-pointer accent-cyan-500"
          />
        </div>

        <div className="text-center text-xs text-cyan-200 bg-cyan-950/60 p-2 rounded-xl border border-cyan-500/30">
          Posisi:{' '}
          <span className="text-yellow-300 font-black">
            {submarineDepth > 0
              ? `${submarineDepth} meter di atas permukaan laut (Bilangan Bulat Positif)`
              : submarineDepth === 0
              ? 'Tepat di permukaan laut (Titik Netral 0)'
              : `${Math.abs(submarineDepth)} meter di bawah permukaan laut (Bilangan Bulat Negatif)`}
          </span>
        </div>
      </div>
    );
  }

  // 10. LUAS & KELILING PERSEGI PANJANG (AREA & PERIMETER GRID)
  if (articleId.includes('luas') || articleId.includes('keliling') || articleId.includes('geometri')) {
    const area = gridWidth * gridHeight;
    const perimeter = 2 * (gridWidth + gridHeight);

    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-emerald-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-emerald-300">
          <span className="flex items-center gap-1.5">
            <span>🟩</span>
            <span>Simulator Kisi Luas vs Keliling</span>
          </span>
          <div className="flex gap-2 text-xs">
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-400/40 text-emerald-300 font-mono">
              Luas: {area} kotak²
            </span>
            <span className="bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-400/40 text-amber-300 font-mono">
              Keliling: {perimeter} pagar
            </span>
          </div>
        </div>

        {/* Visual Dynamic Grid */}
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex flex-col items-center justify-center overflow-x-auto min-h-[140px]">
          <div
            className="p-1 bg-emerald-950/70 border-2 border-yellow-300 rounded-lg shadow-lg grid gap-1 transition-all"
            style={{
              gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: area }).map((_, idx) => (
              <div
                key={idx}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-sm bg-emerald-500 border border-emerald-300/40 flex items-center justify-center text-[10px] font-bold text-emerald-950 shadow-inner"
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Sliders for Width & Height */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">
              Panjang (p): <span className="text-white font-bold">{gridWidth} kotak</span>
            </label>
            <input
              type="range"
              min="2"
              max="8"
              value={gridWidth}
              onChange={(e) => setGridWidth(Number(e.target.value))}
              className="w-full cursor-pointer accent-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">
              Lebar (l): <span className="text-white font-bold">{gridHeight} kotak</span>
            </label>
            <input
              type="range"
              min="2"
              max="6"
              value={gridHeight}
              onChange={(e) => setGridHeight(Number(e.target.value))}
              className="w-full cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        <div className="text-center text-xs text-emerald-200 bg-emerald-950/60 p-2 rounded-xl border border-emerald-500/30">
          <span>Rumus: </span>
          <span className="text-yellow-300 font-bold">Luas = {gridWidth} × {gridHeight} = {area}</span>
          <span className="mx-2">•</span>
          <span className="text-amber-300 font-bold">Keliling = 2 × ({gridWidth} + {gridHeight}) = {perimeter}</span>
        </div>
      </div>
    );
  }

  // 11. TIMBANGAN ALJABAR SEIMBANG (PAN BALANCE SCALE EQUATION)
  if (articleId.includes('timbangan') || articleId.includes('aljabar') || articleId.includes('persamaan')) {
    const hiddenX = scaleTarget - scaleAddend;

    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-amber-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-amber-300">
          <span className="flex items-center gap-1.5">
            <span>⚖️</span>
            <span>Simulator Neraca Timbangan Aljabar (X + A = B)</span>
          </span>
          <span className="bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-400/40 text-yellow-300 font-mono">
            {scaleSolved ? `X = ${hiddenX} koin` : `X + ${scaleAddend} = ${scaleTarget}`}
          </span>
        </div>

        {/* Balance Scale Illustration */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
          {/* Fulcrum and Beam */}
          <div className="w-48 sm:w-60 h-2 bg-amber-400 rounded-full relative mb-3 flex justify-between items-center px-4">
            {/* Center Pivot */}
            <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-12 border-b-amber-500" />

            {/* Left Pan */}
            <div className="flex flex-col items-center gap-1 mt-4">
              <div className="flex items-center gap-1 bg-amber-950/80 px-2 py-1 rounded-xl border border-amber-500/50 shadow-md">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                  {scaleSolved ? hiddenX : 'X'}
                </span>
                {!scaleSolved && (
                  <span className="text-xs text-amber-300 font-black">+ {scaleAddend} 🪙</span>
                )}
              </div>
              <span className="text-[10px] text-slate-400">Piringan Kiri</span>
            </div>

            {/* Right Pan */}
            <div className="flex flex-col items-center gap-1 mt-4">
              <div className="flex items-center gap-1 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-500/50 shadow-md">
                <span className="text-xs text-yellow-300 font-black">
                  {scaleSolved ? `${hiddenX} 🪙` : `${scaleTarget} 🪙`}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Piringan Kanan</span>
            </div>
          </div>

          {/* Action to solve balance */}
          <button
            type="button"
            onClick={() => {
              sound.playCorrect();
              setScaleSolved(!scaleSolved);
            }}
            className="mt-3 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-amber-950 font-black text-xs cursor-pointer shadow-md transition-transform active:scale-95"
          >
            {scaleSolved ? 'Kembalikan Timbangan (Reset)' : `⚖️ Angkat ${scaleAddend} Koin dari Kedua Sisi!`}
          </button>
        </div>

        <div className="text-center text-xs text-amber-200 bg-amber-950/60 p-2 rounded-xl border border-amber-500/30">
          {scaleSolved ? (
            <span className="text-emerald-300 font-black">
              Hore! Piringan kiri dan kanan sama-sama dikurangi {scaleAddend} koin ➔ Nilai X = {hiddenX} koin!
            </span>
          ) : (
            <span>
              Timbangan seimbang sempurna jika kedua sisi dikurangi angka yang sama: <strong className="text-yellow-300">X = {scaleTarget} - {scaleAddend} = {hiddenX}</strong>
            </span>
          )}
        </div>
      </div>
    );
  }

  // 12. DIAGRAM BATANG & RATA-RATA STATISTIK (BAR CHART & MEAN)
  if (articleId.includes('diagram') || articleId.includes('batang') || articleId.includes('statistika') || articleId.includes('mean')) {
    const totalFruits = barFruitApples + barFruitOranges + barFruitBananas;
    const meanValue = (totalFruits / 3).toFixed(1);

    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-indigo-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-indigo-300">
          <span className="flex items-center gap-1.5">
            <span>📊</span>
            <span>Simulator Diagram Batang & Nilai Rata-rata</span>
          </span>
          <span className="bg-indigo-500/20 px-2 py-0.5 rounded-lg border border-indigo-400/40 text-yellow-300 font-mono">
            Mean (Rata-rata): {meanValue} buah
          </span>
        </div>

        {/* Bar Chart Bars */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 h-36 flex items-end justify-around gap-4 px-6">
          {/* Apples Bar */}
          <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-xs font-black text-rose-300">{barFruitApples}</span>
            <div
              className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-xl transition-all duration-300 shadow-md border-t-2 border-rose-300"
              style={{ height: `${(barFruitApples / 10) * 80}%` }}
            />
            <span className="text-xs font-black">🍎 Apel</span>
          </div>

          {/* Oranges Bar */}
          <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-xs font-black text-amber-300">{barFruitOranges}</span>
            <div
              className="w-full bg-gradient-to-t from-orange-600 to-amber-400 rounded-t-xl transition-all duration-300 shadow-md border-t-2 border-amber-300"
              style={{ height: `${(barFruitOranges / 10) * 80}%` }}
            />
            <span className="text-xs font-black">🍊 Jeruk</span>
          </div>

          {/* Bananas Bar */}
          <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-xs font-black text-yellow-300">{barFruitBananas}</span>
            <div
              className="w-full bg-gradient-to-t from-yellow-600 to-yellow-300 rounded-t-xl transition-all duration-300 shadow-md border-t-2 border-yellow-200"
              style={{ height: `${(barFruitBananas / 10) * 80}%` }}
            />
            <span className="text-xs font-black">🍌 Pisang</span>
          </div>
        </div>

        {/* Fruit Controls */}
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div>
            <label className="text-slate-400 block mb-0.5">Apel: {barFruitApples}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={barFruitApples}
              onChange={(e) => setBarFruitApples(Number(e.target.value))}
              className="w-full cursor-pointer accent-rose-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-0.5">Jeruk: {barFruitOranges}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={barFruitOranges}
              onChange={(e) => setBarFruitOranges(Number(e.target.value))}
              className="w-full cursor-pointer accent-orange-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-0.5">Pisang: {barFruitBananas}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={barFruitBananas}
              onChange={(e) => setBarFruitBananas(Number(e.target.value))}
              className="w-full cursor-pointer accent-yellow-500"
            />
          </div>
        </div>

        <div className="text-center text-xs text-indigo-200 bg-indigo-950/60 p-2 rounded-xl border border-indigo-500/30">
          Total Buah: <strong className="text-white">{totalFruits}</strong> • Rata-rata per jenis:{' '}
          <strong className="text-yellow-300">{totalFruits} ÷ 3 = {meanValue} buah</strong>
        </div>
      </div>
    );
  }

  // 13. PERKALIAN MODEL LUAS KISI 4 ZONA (AREA MODEL MULTIPLICATION)
  if (articleId.includes('model_luas') || articleId.includes('perkalian_model') || articleId.includes('area_model')) {
    const zoneA = areaTensA * areaTensB; // 10 x 10 = 100
    const zoneB = areaTensA * areaOnesB; // 10 x 2 = 20
    const zoneC = areaOnesA * areaTensB; // 4 x 10 = 40
    const zoneD = areaOnesA * areaOnesB; // 4 x 2 = 8
    const totalProd = zoneA + zoneB + zoneC + zoneD;

    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-purple-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-purple-300">
          <span className="flex items-center gap-1.5">
            <span>🔲</span>
            <span>Simulator Perkalian Model Luas (Area Model)</span>
          </span>
          <span className="bg-purple-500/20 px-2.5 py-0.5 rounded-lg border border-purple-400/40 text-yellow-300 font-mono">
            {areaTensA + areaOnesA} × {areaTensB + areaOnesB} = {totalProd}
          </span>
        </div>

        {/* 4-Zone Area Grid */}
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 flex flex-col items-center">
          <div className="grid grid-cols-2 gap-2 max-w-xs w-full text-center font-mono">
            {/* Zone A: 10 x 10 */}
            <div className="p-3 rounded-xl bg-indigo-600/70 border border-indigo-400 flex flex-col items-center justify-center">
              <span className="text-[10px] text-indigo-200">{areaTensA} × {areaTensB}</span>
              <span className="text-base font-black text-white">{zoneA}</span>
            </div>

            {/* Zone B: 10 x OnesB */}
            <div className="p-3 rounded-xl bg-emerald-600/70 border border-emerald-400 flex flex-col items-center justify-center">
              <span className="text-[10px] text-emerald-200">{areaTensA} × {areaOnesB}</span>
              <span className="text-base font-black text-white">{zoneB}</span>
            </div>

            {/* Zone C: OnesA x 10 */}
            <div className="p-3 rounded-xl bg-amber-600/70 border border-amber-400 flex flex-col items-center justify-center">
              <span className="text-[10px] text-amber-200">{areaOnesA} × {areaTensB}</span>
              <span className="text-base font-black text-white">{zoneC}</span>
            </div>

            {/* Zone D: OnesA x OnesB */}
            <div className="p-3 rounded-xl bg-rose-600/70 border border-rose-400 flex flex-col items-center justify-center">
              <span className="text-[10px] text-rose-200">{areaOnesA} × {areaOnesB}</span>
              <span className="text-base font-black text-white">{zoneD}</span>
            </div>
          </div>
        </div>

        {/* Digit Adjusters */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">
              Angka Pertama Satuan (10 + {areaOnesA}):
            </label>
            <input
              type="range"
              min="1"
              max="9"
              value={areaOnesA}
              onChange={(e) => setAreaOnesA(Number(e.target.value))}
              className="w-full cursor-pointer accent-purple-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">
              Angka Kedua Satuan (10 + {areaOnesB}):
            </label>
            <input
              type="range"
              min="1"
              max="9"
              value={areaOnesB}
              onChange={(e) => setAreaOnesB(Number(e.target.value))}
              className="w-full cursor-pointer accent-pink-500"
            />
          </div>
        </div>

        <div className="text-center text-xs text-purple-200 bg-purple-950/60 p-2 rounded-xl border border-purple-500/30 font-mono">
          Jumlah: {zoneA} + {zoneB} + {zoneC} + {zoneD} = <strong className="text-yellow-300 font-black">{totalProd}</strong>
        </div>
      </div>
    );
  }

  // 14. PECAHAN SENILAI INTERAKTIF (EQUIVALENT FRACTIONS: 1/2 = 2/4 = 3/6 = 4/8)
  if (articleId.includes('senilai') || articleId.includes('equivalent') || articleId.includes('pecahan_senilai')) {
    const num = 1 * equivMultiplier;
    const den = 2 * equivMultiplier;

    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-cyan-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-cyan-300">
          <span className="flex items-center gap-1.5">
            <span>🍕</span>
            <span>Simulator Pecahan Senilai (Nilai Sama, Irisan Beda)</span>
          </span>
          <span className="bg-cyan-500/20 px-2.5 py-0.5 rounded-lg border border-cyan-400/40 text-yellow-300 font-mono text-sm">
            1/2 = {num}/{den} ({(0.5 * 100)}%)
          </span>
        </div>

        {/* Dual Visual Fraction Bars */}
        <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-700">
          {/* Base Fraction 1/2 */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-bold">
              <span>Pecahan Asal: 1/2</span>
              <span>1 dari 2 bagian (50%)</span>
            </div>
            <div className="h-7 w-full bg-slate-800 rounded-lg overflow-hidden border border-slate-600 flex">
              <div className="w-1/2 h-full bg-cyan-500 border-r border-cyan-300 flex items-center justify-center text-xs font-black text-slate-950 shadow-inner">
                1/2
              </div>
              <div className="w-1/2 h-full bg-slate-800" />
            </div>
          </div>

          {/* Scaled Equivalent Fraction */}
          <div>
            <div className="flex justify-between text-[11px] text-amber-300 mb-1 font-bold">
              <span>Pecahan Senilai: {num}/{den} (Dikalikan {equivMultiplier})</span>
              <span>{num} dari {den} bagian (50%)</span>
            </div>
            <div className="h-7 w-full bg-slate-800 rounded-lg overflow-hidden border border-slate-600 flex">
              {Array.from({ length: den }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-full border-r border-slate-900 flex items-center justify-center text-[10px] font-black ${
                    idx < num
                      ? 'bg-amber-400 text-amber-950 shadow-inner'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                  style={{ width: `${100 / den}%` }}
                >
                  1/{den}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Multiplier Selector */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-400 font-medium">Pilih Faktor Pengali (k):</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setEquivMultiplier(k);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  equivMultiplier === k
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ×{k} ({k}/{k * 2})
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-cyan-200 bg-cyan-950/60 p-2 rounded-xl border border-cyan-500/30">
          Kesimpulan: Luas bidang berwarna <strong className="text-yellow-300">persis sama (50%)</strong>! Pembilang dan penyebut dikalikan angka yang sama.
        </div>
      </div>
    );
  }

  // 15. TERMOMETER SUHU & DERAJAT CELSIUS
  if (articleId.includes('suhu') || articleId.includes('termometer') || articleId.includes('celsius')) {
    const tempState =
      temperatureCelsius < 0
        ? '❄️ Di Bawah Titik Beku (Es Padat & Sangat Dingin)'
        : temperatureCelsius === 0
        ? '🧊 Titik Beku Air / Es Mulai Mencair (0°C)'
        : temperatureCelsius <= 25
        ? '🏠 Suhu Ruangan Nyaman & Sejuk'
        : temperatureCelsius <= 37
        ? '🌡️ Suhu Tubuh Manusia Normal (36,5°C - 37°C)'
        : temperatureCelsius < 100
        ? '☀️ Air Hangat Menuju Panas'
        : '🔥 Titik Didih Air Murni Mendidih (100°C)';

    const mercuryHeight = Math.max(5, Math.min(100, ((temperatureCelsius + 10) / 110) * 100));

    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-rose-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-rose-300">
          <span className="flex items-center gap-1.5">
            <span>🌡️</span>
            <span>Simulator Termometer Suhu (°Celsius)</span>
          </span>
          <span className="bg-rose-500/20 px-2.5 py-0.5 rounded-lg border border-rose-400/40 text-yellow-300 font-mono text-sm">
            {temperatureCelsius}°C
          </span>
        </div>

        {/* Thermometer Tube Visual */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center justify-center gap-6">
          {/* The Tube */}
          <div className="relative w-8 h-40 bg-slate-800 rounded-full border-2 border-slate-600 flex flex-col justify-end p-1 overflow-hidden shadow-inner">
            <div
              className={`w-full rounded-full transition-all duration-300 ${
                temperatureCelsius < 0
                  ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                  : temperatureCelsius <= 37
                  ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                  : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
              }`}
              style={{ height: `${mercuryHeight}%` }}
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-col gap-1.5 text-xs">
            {[
              { val: -10, label: '❄️ -10°C (Kutub Es)' },
              { val: 0, label: '🧊 0°C (Titik Beku)' },
              { val: 25, label: '🏠 25°C (Suhu Ruang)' },
              { val: 37, label: '🌡️ 37°C (Suhu Tubuh)' },
              { val: 100, label: '🔥 100°C (Air Mendidih)' },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTemperatureCelsius(p.val);
                }}
                className={`px-3 py-1 rounded-xl text-left font-bold cursor-pointer transition-all border ${
                  temperatureCelsius === p.val
                    ? 'bg-rose-500 text-white border-rose-300 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature Range Slider */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
            <span>-10°C (Beku)</span>
            <span>0°C</span>
            <span>37°C</span>
            <span>100°C (Didih)</span>
          </div>
          <input
            type="range"
            min="-10"
            max="100"
            value={temperatureCelsius}
            onChange={(e) => setTemperatureCelsius(Number(e.target.value))}
            className="w-full cursor-pointer accent-rose-500"
          />
        </div>

        <div className="text-center text-xs text-rose-200 bg-rose-950/60 p-2 rounded-xl border border-rose-500/30">
          Kondisi: <strong className="text-yellow-300">{tempState}</strong>
        </div>
      </div>
    );
  }

  // 16. SIMULATOR KASIR UANG RUPIAH & KEMBALIAN
  if (articleId.includes('uang') || articleId.includes('rupiah') || articleId.includes('kembalian')) {
    const changeAmount = Math.max(0, cashierPayment - cashierPrice);

    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-emerald-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-emerald-300">
          <span className="flex items-center gap-1.5">
            <span>💵</span>
            <span>Simulator Kasir Cilik & Uang Kembalian</span>
          </span>
          <span className="bg-emerald-500/20 px-2.5 py-0.5 rounded-lg border border-emerald-400/40 text-yellow-300 font-mono text-sm">
            Kembalian: Rp {changeAmount.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Register Display */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Harga Belanja</span>
            <span className="text-sm sm:text-base font-black text-rose-300">
              Rp {cashierPrice.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Uang Pembayaran</span>
            <span className="text-sm sm:text-base font-black text-emerald-300">
              Rp {cashierPayment.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40">
            <span className="text-[10px] text-amber-300 block font-bold uppercase">Uang Kembalian</span>
            <span className="text-sm sm:text-base font-black text-yellow-300">
              Rp {changeAmount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Change breakdown notes preview */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Uang Kembalian Terdiri Dari:</span>
          {changeAmount >= 10000 && (
            <span className="px-2 py-0.5 rounded bg-purple-900/80 text-purple-200 border border-purple-400 text-[10px] font-black">
              Rp 10.000 (Ungu)
            </span>
          )}
          {changeAmount % 10000 >= 5000 && (
            <span className="px-2 py-0.5 rounded bg-amber-900/80 text-amber-200 border border-amber-400 text-[10px] font-black">
              Rp 5.000 (Cokelat)
            </span>
          )}
          {changeAmount % 5000 >= 2000 && (
            <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 border border-slate-400 text-[10px] font-black">
              Rp 2.000 (Abu-abu)
            </span>
          )}
          {changeAmount % 2000 >= 1000 && (
            <span className="px-2 py-0.5 rounded bg-yellow-900/80 text-yellow-200 border border-yellow-400 text-[10px] font-black">
              Rp 1.000 (Koin/Kertas)
            </span>
          )}
          {changeAmount === 0 && (
            <span className="text-emerald-400 text-xs font-bold">Uang Pas! Tidak ada kembalian.</span>
          )}
        </div>

        {/* Quick Purchase Choices */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400">Harga:</span>
            {[7000, 14000, 28000, 45000].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCashierPrice(p);
                  if (cashierPayment < p) {
                    setCashierPayment(p <= 10000 ? 10000 : p <= 20000 ? 20000 : 50000);
                  }
                }}
                className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                  cashierPrice === p
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Rp {p.toLocaleString('id-ID')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400">Bayar:</span>
            {[10000, 20000, 50000, 100000].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  sound.playCoin();
                  setCashierPayment(b);
                }}
                disabled={b < cashierPrice}
                className={`px-2 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                  b < cashierPrice
                    ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-600'
                    : cashierPayment === b
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Rp {b.toLocaleString('id-ID')}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-emerald-200 bg-emerald-950/60 p-2 rounded-xl border border-emerald-500/30">
          Rumus: <strong className="text-yellow-300">Rp {cashierPayment.toLocaleString('id-ID')} - Rp {cashierPrice.toLocaleString('id-ID')} = Rp {changeAmount.toLocaleString('id-ID')}</strong>
        </div>
      </div>
    );
  }

  // 17. SIMULATOR NILAI TEMPAT & BALOK BASIS 10 (PLACE VALUE)
  if (articleId.includes('nilai_tempat') || articleId.includes('bilangan_cacah') || articleId.includes('ribuan')) {
    const totalVal =
      placeValThousands * 1000 +
      placeValHundreds * 100 +
      placeValTens * 10 +
      placeValUnits;

    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-indigo-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-indigo-300">
          <span className="flex items-center gap-1.5">
            <span>🧱</span>
            <span>Simulator Nilai Tempat & Notasi Panjang</span>
          </span>
          <span className="bg-indigo-500/20 px-2.5 py-0.5 rounded-lg border border-indigo-400/40 text-yellow-300 font-mono text-sm">
            {totalVal.toLocaleString('id-ID')}
          </span>
        </div>

        {/* 4 Place Value Columns */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 grid grid-cols-4 gap-2 text-center">
          {/* Ribuan */}
          <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/40 space-y-1">
            <span className="text-[10px] text-purple-300 font-bold uppercase block">Ribuan</span>
            <div className="text-xl font-black text-white">{placeValThousands}</div>
            <div className="text-xs text-purple-300 font-mono font-bold">
              = {(placeValThousands * 1000).toLocaleString('id-ID')}
            </div>
            <input
              type="range"
              min="0"
              max="9"
              value={placeValThousands}
              onChange={(e) => setPlaceValThousands(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Ratusan */}
          <div className="p-2.5 rounded-xl bg-blue-950/50 border border-blue-500/40 space-y-1">
            <span className="text-[10px] text-blue-300 font-bold uppercase block">Ratusan</span>
            <div className="text-xl font-black text-white">{placeValHundreds}</div>
            <div className="text-xs text-blue-300 font-mono font-bold">
              = {placeValHundreds * 100}
            </div>
            <input
              type="range"
              min="0"
              max="9"
              value={placeValHundreds}
              onChange={(e) => setPlaceValHundreds(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Puluhan */}
          <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 space-y-1">
            <span className="text-[10px] text-emerald-300 font-bold uppercase block">Puluhan</span>
            <div className="text-xl font-black text-white">{placeValTens}</div>
            <div className="text-xs text-emerald-300 font-mono font-bold">
              = {placeValTens * 10}
            </div>
            <input
              type="range"
              min="0"
              max="9"
              value={placeValTens}
              onChange={(e) => setPlaceValTens(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Satuan */}
          <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40 space-y-1">
            <span className="text-[10px] text-amber-300 font-bold uppercase block">Satuan</span>
            <div className="text-xl font-black text-white">{placeValUnits}</div>
            <div className="text-xs text-amber-300 font-mono font-bold">
              = {placeValUnits}
            </div>
            <input
              type="range"
              min="0"
              max="9"
              value={placeValUnits}
              onChange={(e) => setPlaceValUnits(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="text-center text-xs text-indigo-200 bg-indigo-950/60 p-2 rounded-xl border border-indigo-500/30 font-mono">
          Bentuk Panjang:{' '}
          <strong className="text-yellow-300">
            {(placeValThousands * 1000).toLocaleString('id-ID')} + {placeValHundreds * 100} + {placeValTens * 10} + {placeValUnits} = {totalVal.toLocaleString('id-ID')}
          </strong>
        </div>
      </div>
    );
  }

  // 18. SIMULATOR PERSENTASE & DISKON TOKO
  if (articleId.includes('persen') || articleId.includes('diskon')) {
    const discountAmount = (discountPercent / 100) * originalPrice;
    const finalPrice = originalPrice - discountAmount;

    return (
      <div className="bg-slate-950/80 rounded-2xl p-4 border-2 border-pink-400/40 text-white space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-pink-300">
          <span className="flex items-center gap-1.5">
            <span>🏷️</span>
            <span>Simulator Diskon Belanja (%)</span>
          </span>
          <span className="bg-pink-500/20 px-2.5 py-0.5 rounded-lg border border-pink-400/40 text-yellow-300 font-mono text-sm">
            Hemat: Rp {discountAmount.toLocaleString('id-ID')} ({discountPercent}%)
          </span>
        </div>

        {/* Price & Discount Bar */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">Harga Asli:</span>
              <span className="text-base font-bold text-slate-300 line-through">
                Rp {originalPrice.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-400 block font-bold">Harga Bayar Akhir:</span>
              <span className="text-xl font-black text-emerald-300">
                Rp {finalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Graphical Proportion Bar */}
          <div className="h-6 w-full bg-slate-800 rounded-xl overflow-hidden border border-slate-600 flex">
            <div
              className="h-full bg-emerald-500 flex items-center justify-center text-[10px] font-black text-slate-950 transition-all duration-300"
              style={{ width: `${100 - discountPercent}%` }}
            >
              Bayar {100 - discountPercent}%
            </div>
            <div
              className="h-full bg-rose-500 flex items-center justify-center text-[10px] font-black text-white transition-all duration-300"
              style={{ width: `${discountPercent}%` }}
            >
              Diskon {discountPercent}%
            </div>
          </div>

          {/* Quick Discount Presets */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">Pilih Diskon:</span>
            <div className="flex gap-1.5">
              {[10, 20, 25, 50, 75].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setDiscountPercent(d);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                    discountPercent === d
                      ? 'bg-pink-500 text-white font-black shadow-xs scale-105'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {d}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-pink-200 bg-pink-950/60 p-2 rounded-xl border border-pink-500/30">
          Potongan = ({discountPercent}/100) × Rp {originalPrice.toLocaleString('id-ID')} = <strong className="text-rose-300">Rp {discountAmount.toLocaleString('id-ID')}</strong> • Bayar = <strong className="text-emerald-300 font-bold">Rp {finalPrice.toLocaleString('id-ID')}</strong>
        </div>
      </div>
    );
  }

  return null;
};
