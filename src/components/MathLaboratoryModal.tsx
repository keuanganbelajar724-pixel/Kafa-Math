import React, { useState } from 'react';
import { sound } from '../services/sound';
import {
  Sparkles,
  X,
  Layers,
  Divide,
  Compass,
  Scale,
  Hash,
  Play,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Calculator,
  ChevronRight,
  Info,
} from 'lucide-react';

interface Props {
  onClose: () => void;
  initialTool?: 'number_line' | 'place_value' | 'fractions' | 'porogapit' | 'balance' | 'protractor';
}

export const MathLaboratoryModal: React.FC<Props> = ({ onClose, initialTool = 'number_line' }) => {
  const [activeTool, setActiveTool] = useState<'number_line' | 'place_value' | 'fractions' | 'porogapit' | 'balance' | 'protractor'>(initialTool);

  // -------------------------------------------------------------
  // TOOL 1: NUMBER LINE STATE
  // -------------------------------------------------------------
  const [nlStart, setNlStart] = useState<number>(3);
  const [nlJump, setNlJump] = useState<number>(4);
  const [nlOperation, setNlOperation] = useState<'+' | '-'>('+');
  const [nlAnimatedStep, setNlAnimatedStep] = useState<number>(0);
  const nlResult = nlOperation === '+' ? nlStart + nlJump : nlStart - nlJump;

  // -------------------------------------------------------------
  // TOOL 2: PLACE VALUE BLOCKS STATE (Base-10)
  // -------------------------------------------------------------
  const [thousands, setThousands] = useState<number>(1);
  const [hundreds, setHundreds] = useState<number>(2);
  const [tens, setTens] = useState<number>(3);
  const [units, setUnits] = useState<number>(5);
  const totalPlaceValue = thousands * 1000 + hundreds * 100 + tens * 10 + units;

  // -------------------------------------------------------------
  // TOOL 3: FRACTION VISUALIZER
  // -------------------------------------------------------------
  const [fracNum1, setFracNum1] = useState<number>(1);
  const [fracDen1, setFracDen1] = useState<number>(2);
  const [fracNum2, setFracNum2] = useState<number>(2);
  const [fracDen2, setFracDen2] = useState<number>(4);
  const [fracViewMode, setFracViewMode] = useState<'pizza' | 'bar'>('pizza');

  // -------------------------------------------------------------
  // TOOL 4: POROGAPIT & LONG MULTIPLICATION STEP SOLVER
  // -------------------------------------------------------------
  const [solverDividend, setSolverDividend] = useState<number>(756);
  const [solverDivisor, setSolverDivisor] = useState<number>(4);
  const [solverMode, setSolverMode] = useState<'division' | 'multiplication'>('division');
  const [multNum1, setMultNum1] = useState<number>(48);
  const [multNum2, setMultNum2] = useState<number>(23);
  const [solverStepIndex, setSolverStepIndex] = useState<number>(0);

  // Compute Porogapit steps
  const computePorogapitSteps = (dividend: number, divisor: number) => {
    if (divisor <= 0 || dividend < 0) return [];
    const divStr = dividend.toString();
    const steps: { title: string; desc: string; quotientSoFar: string; currentWorking: string; remainder: number }[] = [];
    
    let currentPart = 0;
    let quotient = '';
    
    for (let i = 0; i < divStr.length; i++) {
      currentPart = currentPart * 10 + parseInt(divStr[i], 10);
      const qDigit = Math.floor(currentPart / divisor);
      const product = qDigit * divisor;
      const rem = currentPart - product;
      quotient += qDigit.toString();

      steps.push({
        title: `Langkah ${i + 1}: Perhatikan digit ke-${i + 1} (${divStr[i]})`,
        desc: `Bagi ${currentPart} dengan ${divisor} → Menghasilkan ${qDigit} (karena ${qDigit} × ${divisor} = ${product}). Sisa: ${currentPart} - ${product} = ${rem}.`,
        quotientSoFar: quotient,
        currentWorking: `${currentPart} - ${product} = ${rem}`,
        remainder: rem,
      });

      currentPart = rem;
    }
    return steps;
  };

  const porogapitSteps = computePorogapitSteps(solverDividend, solverDivisor);

  // -------------------------------------------------------------
  // TOOL 5: BALANCE ALGEBRA SCALE
  // -------------------------------------------------------------
  const [leftXCount, setLeftXCount] = useState<number>(1);
  const [leftWeights, setLeftWeights] = useState<number>(4);
  const [rightWeights, setRightWeights] = useState<number>(10);
  const xValue = leftXCount > 0 ? (rightWeights - leftWeights) / leftXCount : 0;
  const isBalanced = leftXCount * xValue + leftWeights === rightWeights && xValue > 0 && Number.isInteger(xValue);

  // -------------------------------------------------------------
  // TOOL 6: PROTRACTOR & ANGLE CLASSIFIER
  // -------------------------------------------------------------
  const [angleDegrees, setAngleDegrees] = useState<number>(60);

  const getAngleCategory = (deg: number) => {
    if (deg === 0) return { name: 'Sudut Nol (0°)', desc: 'Dua kaki sudut berhimpit lurus sempurna.', color: 'text-slate-600', icon: '📏' };
    if (deg < 90) return { name: 'Sudut Lancip (Acute)', desc: 'Besar sudut antara 0° dan 90° (runcing). Contoh: ujung potongan pizza, atap lancip.', color: 'text-emerald-600', icon: '📐' };
    if (deg === 90) return { name: 'Sudut Siku-Siku (Right Angle)', desc: 'Tepat 90° tegak lurus sempurna! Contoh: sudut meja, sudut buku, sudut dinding.', color: 'text-blue-600', icon: '🔲' };
    if (deg < 180) return { name: 'Sudut Tumpul (Obtuse)', desc: 'Besar sudut antara 90° dan 180° (terbuka lebar). Contoh: gunting terbuka lebar, atap rumah joglo.', color: 'text-orange-600', icon: '⛺' };
    if (deg === 180) return { name: 'Sudut Lurus (Straight)', desc: 'Tepat 180° membentuk satu garis lurus datar.', color: 'text-indigo-600', icon: '➖' };
    return { name: 'Sudut Refleks (Reflex)', desc: 'Besar sudut lebih dari 180° sampai kurang dari 360°.', color: 'text-purple-600', icon: '🔄' };
  };

  const angleInfo = getAngleCategory(angleDegrees);

  const toolsList = [
    { id: 'number_line', name: 'Garis Bilangan', icon: '📏', desc: 'Loncat penjumlahan, pengurangan, bilangan negatif', badge: 'Kls 1-6' },
    { id: 'place_value', name: 'Blok Nilai Tempat', icon: '🧱', desc: 'Satuan, puluhan, ratusan, ribuan Dienes blocks', badge: 'Kls 1-4' },
    { id: 'fractions', name: 'Visualizer Pecahan', icon: '🍕', desc: 'Bandingkan pecahan, pizza & balok senilai', badge: 'Kls 3-6' },
    { id: 'porogapit', name: 'Solver Bersusun', icon: '➗', desc: 'Bagi bersusun (Porogapit) & perkalian langkah demi langkah', badge: 'Kls 3-6' },
    { id: 'balance', name: 'Timbangan Aljabar', icon: '⚖️', desc: 'Temukan nilai misteri X dengan neraca seimbang', badge: 'Kls 4-6' },
    { id: 'protractor', name: 'Busur & Sudut', icon: '📐', desc: 'Ukur derajat, sudut lancip, siku-siku & tumpul', badge: 'Kls 3-6' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full border-4 border-amber-300 shadow-2xl flex flex-col my-auto max-h-[96vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-amber-600 p-4 text-white flex items-center justify-between shadow-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner border border-white/30">
              🧪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">Laboratorium Alat Peraga Matematika Digital</h2>
                <span className="text-[10px] font-black bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Interaktif
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Eksplorasi konsep matematika secara visual, langsung sentuh & manipulasi angka!
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

        {/* Navigation Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex gap-1.5 overflow-x-auto scrollbar-none flex-shrink-0">
          {toolsList.map((t) => {
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTool(t.id as any);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-black text-xs transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
                }`}
              >
                <span className="text-base">{t.icon}</span>
                <span>{t.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {t.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
          {/* ============================================================== */}
          {/* TOOL 1: INTERACTIVE NUMBER LINE */}
          {/* ============================================================== */}
          {activeTool === 'number_line' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                      <span className="text-xl">📏</span> Garis Bilangan Berloncat
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visualisasikan proses penjumlahan (loncat maju ke kanan) dan pengurangan (loncat mundur ke kiri).
                    </p>
                  </div>

                  {/* Math Formula Card */}
                  <div className="bg-emerald-50 border-2 border-emerald-300 px-4 py-2 rounded-2xl text-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                      Operasi Hitung:
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-700">
                      {nlStart} {nlOperation} {nlJump} = {nlResult}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Titik Awal Bilangan:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="-5"
                        max="15"
                        value={nlStart}
                        onChange={(e) => setNlStart(parseInt(e.target.value, 10))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <span className="font-black text-sm text-slate-800 w-8 text-center bg-white px-1.5 py-0.5 rounded-lg border border-slate-300">
                        {nlStart}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Jenis Operasi:</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNlOperation('+')}
                        className={`flex-1 py-1.5 rounded-xl font-black text-xs cursor-pointer transition-all ${
                          nlOperation === '+' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                        }`}
                      >
                        + Tambah (Maju ➡️)
                      </button>
                      <button
                        onClick={() => setNlOperation('-')}
                        className={`flex-1 py-1.5 rounded-xl font-black text-xs cursor-pointer transition-all ${
                          nlOperation === '-' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                        }`}
                      >
                        - Kurang (Mundur ⬅️)
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Besar Loncat:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={nlJump}
                        onChange={(e) => setNlJump(parseInt(e.target.value, 10))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <span className="font-black text-sm text-slate-800 w-8 text-center bg-white px-1.5 py-0.5 rounded-lg border border-slate-300">
                        {nlJump}
                      </span>
                    </div>
                  </div>
                </div>

                {/* The Visual Interactive Number Line Canvas */}
                <div className="p-4 bg-slate-900 rounded-3xl text-white overflow-x-auto shadow-inner my-4">
                  <div className="min-w-[650px] py-8 px-4 relative">
                    {/* Horizontal Main Line */}
                    <div className="h-1.5 bg-slate-600 w-full rounded-full relative my-10 flex items-center justify-between">
                      {/* Arrow Left */}
                      <div className="absolute -left-2 w-3 h-3 border-t-2 border-l-2 border-slate-400 -rotate-45" />
                      {/* Arrow Right */}
                      <div className="absolute -right-2 w-3 h-3 border-t-2 border-r-2 border-slate-400 rotate-45" />

                      {/* Tick Marks from -5 to 20 */}
                      {Array.from({ length: 26 }, (_, i) => i - 5).map((num) => {
                        const isStart = num === nlStart;
                        const isEnd = num === nlResult;
                        const isZero = num === 0;
                        const isPassed =
                          nlOperation === '+'
                            ? num >= nlStart && num <= nlResult
                            : num <= nlStart && num >= nlResult;

                        return (
                          <div key={num} className="relative flex flex-col items-center flex-1">
                            {/* Tick Pin */}
                            <div
                              className={`w-0.5 ${
                                isStart || isEnd
                                  ? 'h-6 bg-yellow-400'
                                  : isZero
                                  ? 'h-5 bg-cyan-400'
                                  : 'h-3 bg-slate-500'
                              } transition-all`}
                            />

                            {/* Label */}
                            <span
                              className={`text-[11px] font-black mt-2 transition-all ${
                                isStart
                                  ? 'text-yellow-300 scale-125 bg-yellow-500/20 px-1 rounded-sm'
                                  : isEnd
                                  ? 'text-emerald-400 scale-125 bg-emerald-500/20 px-1 rounded-sm'
                                  : isZero
                                  ? 'text-cyan-300 font-extrabold'
                                  : 'text-slate-400'
                              }`}
                            >
                              {num}
                            </span>

                            {/* Start Frog / Rabbit Pointer */}
                            {isStart && (
                              <div className="absolute -top-10 flex flex-col items-center animate-bounce">
                                <span className="text-xl">🐸</span>
                                <span className="text-[9px] font-bold text-yellow-300 bg-yellow-900/60 px-1 rounded-sm">Awal</span>
                              </div>
                            )}

                            {/* End Destination Pin */}
                            {isEnd && !isStart && (
                              <div className="absolute -top-10 flex flex-col items-center animate-pulse">
                                <span className="text-xl">🚩</span>
                                <span className="text-[9px] font-bold text-emerald-300 bg-emerald-900/60 px-1 rounded-sm">Hasil</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Arc Jump Arc Visualization */}
                    <div className="text-center text-xs text-amber-300 font-bold mt-2">
                      ✨ Mulai dari angka <span className="text-yellow-300 font-black">{nlStart}</span>, lalu{' '}
                      {nlOperation === '+' ? 'melompat ke kanan (+)' : 'melompat mundur ke kiri (-)'} sebanyak{' '}
                      <span className="text-yellow-300 font-black">{nlJump} langkah</span> hingga mendarat di{' '}
                      <span className="text-emerald-400 font-black">{nlResult}</span>!
                    </div>
                  </div>
                </div>

                {/* Quick Examples */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-slate-500">Coba Soal Cepat:</span>
                  {[
                    { s: 2, op: '+', j: 5 },
                    { s: 8, op: '-', j: 3 },
                    { s: -2, op: '+', j: 6 },
                    { s: 5, op: '-', j: 7 },
                  ].map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.playClick();
                        setNlStart(ex.s);
                        setNlOperation(ex.op as any);
                        setNlJump(ex.j);
                      }}
                      className="text-xs font-bold bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-slate-200"
                    >
                      {ex.s} {ex.op} {ex.j} = ?
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TOOL 2: BASE-10 PLACE VALUE BLOCKS */}
          {/* ============================================================== */}
          {activeTool === 'place_value' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                      <span className="text-xl">🧱</span> Blok Nilai Tempat (Dienes Base-10)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pahami nilai ribuan, ratusan, puluhan, dan satuan dengan balok konkret.
                    </p>
                  </div>

                  {/* Total Value Display */}
                  <div className="bg-amber-50 border-2 border-amber-300 px-5 py-2.5 rounded-2xl text-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
                      Total Nilai Bilangan:
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-600">
                      {totalPlaceValue.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Place Value Breakdown Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  {/* Ribuan */}
                  <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-900">RIBUAN (1000)</span>
                      <span className="text-xl">📦</span>
                    </div>
                    <div className="my-2">
                      <div className="text-2xl font-black text-purple-700">{thousands}</div>
                      <div className="text-[11px] text-purple-600 font-bold">= {thousands * 1000}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setThousands(Math.max(0, thousands - 1))}
                        className="w-8 h-8 rounded-xl bg-white text-purple-800 font-black border border-purple-300 hover:bg-purple-100 cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setThousands(Math.min(9, thousands + 1))}
                        className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black hover:bg-purple-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Ratusan */}
                  <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-900">RATUSAN (100)</span>
                      <span className="text-xl">🟦</span>
                    </div>
                    <div className="my-2">
                      <div className="text-2xl font-black text-blue-700">{hundreds}</div>
                      <div className="text-[11px] text-blue-600 font-bold">= {hundreds * 100}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setHundreds(Math.max(0, hundreds - 1))}
                        className="w-8 h-8 rounded-xl bg-white text-blue-800 font-black border border-blue-300 hover:bg-blue-100 cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setHundreds(Math.min(9, hundreds + 1))}
                        className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Puluhan */}
                  <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-900">PULUHAN (10)</span>
                      <span className="text-xl">🎋</span>
                    </div>
                    <div className="my-2">
                      <div className="text-2xl font-black text-emerald-700">{tens}</div>
                      <div className="text-[11px] text-emerald-600 font-bold">= {tens * 10}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTens(Math.max(0, tens - 1))}
                        className="w-8 h-8 rounded-xl bg-white text-emerald-800 font-black border border-emerald-300 hover:bg-emerald-100 cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setTens(Math.min(9, tens + 1))}
                        className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Satuan */}
                  <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-orange-900">SATUAN (1)</span>
                      <span className="text-xl">🟧</span>
                    </div>
                    <div className="my-2">
                      <div className="text-2xl font-black text-orange-700">{units}</div>
                      <div className="text-[11px] text-orange-600 font-bold">= {units * 1}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setUnits(Math.max(0, units - 1))}
                        className="w-8 h-8 rounded-xl bg-white text-orange-800 font-black border border-orange-300 hover:bg-orange-100 cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setUnits(Math.min(9, units + 1))}
                        className="w-8 h-8 rounded-xl bg-orange-600 text-white font-black hover:bg-orange-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Form Sentence */}
                <div className="p-4 bg-slate-900 rounded-2xl text-white my-3">
                  <div className="text-xs text-slate-400 font-bold mb-1">BENTUK PANJANG (EXPANDED FORM):</div>
                  <div className="text-sm sm:text-base font-black text-yellow-300">
                    {totalPlaceValue} = ({thousands} × 1000) + ({hundreds} × 100) + ({tens} × 10) + ({units} × 1)
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    = {thousands * 1000} + {hundreds * 100} + {tens * 10} + {units}
                  </div>
                </div>

                {/* Reset & Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setThousands(0);
                      setHundreds(0);
                      setTens(0);
                      setUnits(0);
                    }}
                    className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Kosongkan (0)
                  </button>
                  <button
                    onClick={() => {
                      setThousands(2);
                      setHundreds(4);
                      setTens(5);
                      setUnits(8);
                    }}
                    className="text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Contoh: 2.458
                  </button>
                  <button
                    onClick={() => {
                      setThousands(1);
                      setHundreds(0);
                      setTens(3);
                      setUnits(5);
                    }}
                    className="text-xs font-bold bg-blue-100 hover:bg-blue-200 text-blue-900 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Contoh: 1.035
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TOOL 3: FRACTIONS VISUALIZER */}
          {/* ============================================================== */}
          {activeTool === 'fractions' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                      <span className="text-xl">🍕</span> Visualizer Pecahan Senilai & Perbandingan
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Bandingkan 2 pecahan untuk melihat apakah senilai (=), lebih besar (&gt;), atau lebih kecil (&lt;).
                    </p>
                  </div>

                  {/* Mode switcher */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFracViewMode('pizza')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                        fracViewMode === 'pizza' ? 'bg-orange-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      🍕 Pizza Lingkaran
                    </button>
                    <button
                      onClick={() => setFracViewMode('bar')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                        fracViewMode === 'bar' ? 'bg-orange-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      🍫 Balok Cokelat
                    </button>
                  </div>
                </div>

                {/* Compare Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  {/* Fraction 1 */}
                  <div className="bg-orange-50/70 p-4 rounded-3xl border-2 border-orange-200 flex flex-col items-center">
                    <span className="text-xs font-black text-orange-900 mb-2">PECAHAN PERTAMA (A)</span>
                    <div className="flex items-center gap-3 mb-4">
                      {/* Fraction Box */}
                      <div className="flex flex-col items-center bg-white px-4 py-2 rounded-2xl border-2 border-orange-300 shadow-xs">
                        <input
                          type="number"
                          min="1"
                          max={fracDen1}
                          value={fracNum1}
                          onChange={(e) => setFracNum1(Math.max(1, Math.min(fracDen1, parseInt(e.target.value, 10) || 1)))}
                          className="w-12 text-center font-black text-2xl text-orange-600 border-b-2 border-orange-400 outline-none"
                        />
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={fracDen1}
                          onChange={(e) => {
                            const newDen = Math.max(1, Math.min(12, parseInt(e.target.value, 10) || 1));
                            setFracDen1(newDen);
                            if (fracNum1 > newDen) setFracNum1(newDen);
                          }}
                          className="w-12 text-center font-black text-2xl text-slate-800 outline-none"
                        />
                      </div>

                      <div className="text-xs font-bold text-slate-600">
                        <div>Pembilang: <span className="text-orange-600 font-black">{fracNum1}</span></div>
                        <div>Penyebut: <span className="text-slate-800 font-black">{fracDen1}</span></div>
                        <div className="text-slate-400 mt-1">= {(fracNum1 / fracDen1).toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Visual Slices */}
                    <div className="w-40 h-40 relative rounded-full border-4 border-orange-400 bg-orange-100 flex items-center justify-center overflow-hidden shadow-inner">
                      {/* Slices representation */}
                      {Array.from({ length: fracDen1 }).map((_, idx) => {
                        const isColored = idx < fracNum1;
                        const angle = 360 / fracDen1;
                        return (
                          <div
                            key={idx}
                            className={`absolute w-full h-full ${
                              isColored ? 'bg-orange-500 opacity-80' : 'bg-transparent'
                            }`}
                            style={{
                              clipPath: fracDen1 === 1 ? 'none' : `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%)`,
                              transform: `rotate(${idx * angle}deg)`,
                            }}
                          />
                        );
                      })}
                      <div className="relative z-10 font-black text-lg bg-white/90 px-2 py-1 rounded-xl shadow-xs text-orange-950">
                        {fracNum1}/{fracDen1}
                      </div>
                    </div>
                  </div>

                  {/* Fraction 2 */}
                  <div className="bg-sky-50/70 p-4 rounded-3xl border-2 border-sky-200 flex flex-col items-center">
                    <span className="text-xs font-black text-sky-900 mb-2">PECAHAN KEDUA (B)</span>
                    <div className="flex items-center gap-3 mb-4">
                      {/* Fraction Box */}
                      <div className="flex flex-col items-center bg-white px-4 py-2 rounded-2xl border-2 border-sky-300 shadow-xs">
                        <input
                          type="number"
                          min="1"
                          max={fracDen2}
                          value={fracNum2}
                          onChange={(e) => setFracNum2(Math.max(1, Math.min(fracDen2, parseInt(e.target.value, 10) || 1)))}
                          className="w-12 text-center font-black text-2xl text-sky-600 border-b-2 border-sky-400 outline-none"
                        />
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={fracDen2}
                          onChange={(e) => {
                            const newDen = Math.max(1, Math.min(12, parseInt(e.target.value, 10) || 1));
                            setFracDen2(newDen);
                            if (fracNum2 > newDen) setFracNum2(newDen);
                          }}
                          className="w-12 text-center font-black text-2xl text-slate-800 outline-none"
                        />
                      </div>

                      <div className="text-xs font-bold text-slate-600">
                        <div>Pembilang: <span className="text-sky-600 font-black">{fracNum2}</span></div>
                        <div>Penyebut: <span className="text-slate-800 font-black">{fracDen2}</span></div>
                        <div className="text-slate-400 mt-1">= {(fracNum2 / fracDen2).toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Visual Slices */}
                    <div className="w-40 h-40 relative rounded-full border-4 border-sky-400 bg-sky-100 flex items-center justify-center overflow-hidden shadow-inner">
                      {Array.from({ length: fracDen2 }).map((_, idx) => {
                        const isColored = idx < fracNum2;
                        const angle = 360 / fracDen2;
                        return (
                          <div
                            key={idx}
                            className={`absolute w-full h-full ${
                              isColored ? 'bg-sky-500 opacity-80' : 'bg-transparent'
                            }`}
                            style={{
                              clipPath: fracDen2 === 1 ? 'none' : `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%)`,
                              transform: `rotate(${idx * angle}deg)`,
                            }}
                          />
                        );
                      })}
                      <div className="relative z-10 font-black text-lg bg-white/90 px-2 py-1 rounded-xl shadow-xs text-sky-950">
                        {fracNum2}/{fracDen2}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison Result Banner */}
                {(() => {
                  const val1 = fracNum1 / fracDen1;
                  const val2 = fracNum2 / fracDen2;
                  const isEquivalent = Math.abs(val1 - val2) < 0.0001;

                  return (
                    <div
                      className={`p-4 rounded-2xl text-center border-2 ${
                        isEquivalent
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : val1 > val2
                          ? 'bg-orange-50 border-orange-300 text-orange-950'
                          : 'bg-sky-50 border-sky-300 text-sky-950'
                      }`}
                    >
                      <div className="text-xl font-black flex items-center justify-center gap-3">
                        <span>{fracNum1}/{fracDen1}</span>
                        <span className="text-2xl font-extrabold px-3 py-1 bg-white rounded-xl shadow-xs border">
                          {isEquivalent ? '=' : val1 > val2 ? '>' : '<'}
                        </span>
                        <span>{fracNum2}/{fracDen2}</span>
                      </div>
                      <p className="text-xs font-bold mt-1">
                        {isEquivalent
                          ? '🎉 Keduanya adalah PECAHAN SENILAI (Besar potongannya sama persis)!'
                          : val1 > val2
                          ? `Pecahan ${fracNum1}/${fracDen1} LEBIH BESAR daripada ${fracNum2}/${fracDen2}.`
                          : `Pecahan ${fracNum1}/${fracDen1} LEBIH KECIL daripada ${fracNum2}/${fracDen2}.`}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TOOL 4: POROGAPIT & LONG SOLVER */}
          {/* ============================================================== */}
          {activeTool === 'porogapit' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                      <span className="text-xl">➗</span> Solver Pembagian Bersusun (Porogapit)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pelajari rumus sakti: 1. Bagi ➔ 2. Kali ➔ 3. Kurang ➔ 4. Turunkan angka berikutnya!
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Soal:</span>
                    <input
                      type="number"
                      min="10"
                      max="9999"
                      value={solverDividend}
                      onChange={(e) => {
                        setSolverDividend(parseInt(e.target.value, 10) || 10);
                        setSolverStepIndex(0);
                      }}
                      className="w-20 px-2.5 py-1.5 bg-slate-50 border-2 border-amber-300 rounded-xl font-black text-sm text-center outline-none"
                    />
                    <span className="font-black text-slate-400">÷</span>
                    <input
                      type="number"
                      min="2"
                      max="20"
                      value={solverDivisor}
                      onChange={(e) => {
                        setSolverDivisor(parseInt(e.target.value, 10) || 2);
                        setSolverStepIndex(0);
                      }}
                      className="w-16 px-2.5 py-1.5 bg-slate-50 border-2 border-amber-300 rounded-xl font-black text-sm text-center outline-none"
                    />
                  </div>
                </div>

                {/* Porogapit Step Player */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                  {/* Traditional Porogapit Visual Canvas */}
                  <div className="bg-slate-900 text-white p-5 rounded-3xl flex flex-col items-center justify-center font-mono">
                    <div className="text-xs text-slate-400 font-sans font-bold mb-4">SIMBOL POROGAPIT</div>
                    
                    {/* Quotient (Atas) */}
                    <div className="text-3xl font-black text-yellow-300 tracking-widest pl-12 mb-1">
                      {Math.floor(solverDividend / solverDivisor)}
                    </div>

                    {/* Main Porogapit Housing */}
                    <div className="flex items-center text-3xl font-black">
                      <span className="text-cyan-400 pr-3">{solverDivisor}</span>
                      <div className="border-t-4 border-l-4 border-white pl-4 pr-6 py-2 rounded-tl-xl text-white tracking-widest">
                        {solverDividend}
                      </div>
                    </div>

                    {/* Remainder info */}
                    <div className="mt-4 text-xs font-sans text-slate-400">
                      Sisa Akhir: <span className="text-emerald-400 font-bold">{solverDividend % solverDivisor}</span>
                    </div>
                  </div>

                  {/* Step by step narrative explanation */}
                  <div className="md:col-span-2 space-y-2">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                      LANGKAH PENGERJAAN URUT:
                    </div>

                    {porogapitSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border-2 transition-all ${
                          idx === solverStepIndex
                            ? 'bg-amber-50 border-amber-400 shadow-sm'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-900">{step.title}</span>
                          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                            Hasil Sementara: {step.quotientSoFar}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-slate-500">Contoh Latihan:</span>
                  {[
                    { d: 756, v: 4 },
                    { d: 840, v: 5 },
                    { d: 936, v: 3 },
                    { d: 525, v: 5 },
                    { d: 948, v: 6 },
                  ].map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.playClick();
                        setSolverDividend(ex.d);
                        setSolverDivisor(ex.v);
                      }}
                      className="text-xs font-bold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 px-3 py-1.5 rounded-xl cursor-pointer border border-slate-200"
                    >
                      {ex.d} ÷ {ex.v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TOOL 5: BALANCE ALGEBRA SCALE */}
          {/* ============================================================== */}
          {activeTool === 'balance' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                      <span className="text-xl">⚖️</span> Timbangan Neraca Persamaan Matematika
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Seimbangkan neraca untuk menemukan nilai kotak misteri (X).
                    </p>
                  </div>

                  <div className="bg-indigo-50 border-2 border-indigo-200 px-4 py-2 rounded-2xl text-center">
                    <span className="text-[10px] font-extrabold uppercase text-indigo-800 block">Persamaan:</span>
                    <span className="text-lg font-black text-indigo-700">
                      {leftXCount > 0 ? `${leftXCount}X + ` : ''}{leftWeights} kg = {rightWeights} kg
                    </span>
                  </div>
                </div>

                {/* Scale Visual */}
                <div className="p-6 bg-slate-900 rounded-3xl text-white my-4 relative overflow-hidden flex flex-col items-center">
                  <div className="w-full max-w-lg">
                    {/* Beam balance */}
                    <div className="relative flex justify-between items-center my-8">
                      {/* Fulcrum (Penyangga) */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-4 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[45px] border-b-amber-500" />
                      
                      {/* Cross Beam */}
                      <div
                        className="w-full h-3 bg-amber-400 rounded-full shadow-lg transition-transform duration-500"
                        style={{
                          transform: isBalanced
                            ? 'rotate(0deg)'
                            : leftXCount * xValue + leftWeights > rightWeights
                            ? 'rotate(-5deg)'
                            : 'rotate(5deg)',
                        }}
                      />
                    </div>

                    {/* Pans / Piringan */}
                    <div className="grid grid-cols-2 gap-8 text-center mt-2">
                      {/* Left Pan */}
                      <div className="bg-slate-800/80 p-4 rounded-2xl border-2 border-indigo-400/50 flex flex-col items-center">
                        <span className="text-xs font-bold text-indigo-300 mb-2">Piringan Kiri</span>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {Array.from({ length: leftXCount }).map((_, i) => (
                            <div key={i} className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md">
                              📦 X
                            </div>
                          ))}
                          {Array.from({ length: Math.min(leftWeights, 15) }).map((_, i) => (
                            <div key={i} className="w-7 h-7 bg-amber-400 text-slate-900 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs">
                              1
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-slate-300 font-bold mt-2">
                          Total: {leftXCount > 0 ? `${leftXCount}X + ` : ''}{leftWeights} kg
                        </div>
                      </div>

                      {/* Right Pan */}
                      <div className="bg-slate-800/80 p-4 rounded-2xl border-2 border-amber-400/50 flex flex-col items-center">
                        <span className="text-xs font-bold text-amber-300 mb-2">Piringan Kanan</span>
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {Array.from({ length: Math.min(rightWeights, 15) }).map((_, i) => (
                            <div key={i} className="w-7 h-7 bg-amber-400 text-slate-900 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs">
                              1
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-slate-300 font-bold mt-2">Total: {rightWeights} kg</div>
                      </div>
                    </div>
                  </div>

                  {/* Solution Reveal */}
                  <div className="mt-6 p-3 bg-slate-800 rounded-2xl border border-slate-700 text-center w-full max-w-md">
                    <span className="text-xs text-slate-400 font-bold block">Hasil Nilai X (Kotak Misteri):</span>
                    <span className="text-2xl font-black text-emerald-400">
                      {isBalanced ? `X = ${xValue} kg 🎉` : `X = ${xValue.toFixed(2)} kg`}
                    </span>
                    <div className="text-[11px] text-slate-300 mt-1">
                      Cara hitung: {leftXCount}X = {rightWeights} - {leftWeights} = {rightWeights - leftWeights} ➔ X = {rightWeights - leftWeights} ÷ {leftXCount} = {xValue}
                    </div>
                  </div>
                </div>

                {/* Adjustments */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Jumlah Kotak X di Kiri:</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setLeftXCount(Math.max(1, leftXCount - 1))} className="px-2.5 py-1 bg-white border rounded-lg font-black">-</button>
                      <span className="font-black text-sm flex-1 text-center">{leftXCount}</span>
                      <button onClick={() => setLeftXCount(Math.min(5, leftXCount + 1))} className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-black">+</button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Beban Tambahan Kiri (kg):</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setLeftWeights(Math.max(0, leftWeights - 1))} className="px-2.5 py-1 bg-white border rounded-lg font-black">-</button>
                      <span className="font-black text-sm flex-1 text-center">{leftWeights} kg</span>
                      <button onClick={() => setLeftWeights(Math.min(20, leftWeights + 1))} className="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-black">+</button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block mb-1">Beban Kanan (kg):</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setRightWeights(Math.max(1, rightWeights - 1))} className="px-2.5 py-1 bg-white border rounded-lg font-black">-</button>
                      <span className="font-black text-sm flex-1 text-center">{rightWeights} kg</span>
                      <button onClick={() => setRightWeights(Math.min(30, rightWeights + 1))} className="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-black">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TOOL 6: PROTRACTOR & ANGLE CLASSIFIER */}
          {/* ============================================================== */}
          {activeTool === 'protractor' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                      <span className="text-xl">📐</span> Busur Derajat & Klasifikasi Sudut
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Geser jarum sudut busur derajat untuk mengenali sudut lancip, siku-siku, dan tumpul.
                    </p>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-300 px-5 py-2 rounded-2xl text-center">
                    <span className="text-[10px] font-extrabold uppercase text-purple-800 block">Besar Sudut:</span>
                    <span className="text-2xl font-black text-purple-700">{angleDegrees}°</span>
                  </div>
                </div>

                {/* Protractor Canvas Visual */}
                <div className="p-6 bg-slate-900 rounded-3xl text-white my-4 flex flex-col items-center justify-center relative">
                  <div className="w-72 h-36 relative border-t-[8px] border-l-[8px] border-r-[8px] border-cyan-400 rounded-t-full bg-cyan-950/40 flex items-end justify-center shadow-inner overflow-hidden mb-6">
                    {/* Radial lines every 30 deg */}
                    {[0, 30, 45, 60, 90, 120, 135, 150, 180].map((deg) => (
                      <div
                        key={deg}
                        className="absolute bottom-0 left-1/2 w-0.5 h-full origin-bottom bg-cyan-500/30"
                        style={{ transform: `rotate(${deg - 90}deg)` }}
                      >
                        <span className="text-[8px] text-cyan-300 font-bold block pt-1 -rotate-90">
                          {deg}°
                        </span>
                      </div>
                    ))}

                    {/* Needle ray */}
                    <div
                      className="absolute bottom-0 left-1/2 w-1.5 h-32 bg-yellow-400 origin-bottom shadow-lg rounded-t-full transition-transform duration-300"
                      style={{ transform: `rotate(${angleDegrees - 90}deg)` }}
                    >
                      <div className="w-3 h-3 bg-yellow-300 rounded-full -top-1 -left-0.5 absolute shadow-md" />
                    </div>

                    {/* Baseline */}
                    <div className="absolute bottom-0 w-full h-1 bg-cyan-400" />
                    {/* Pivot center */}
                    <div className="w-4 h-4 rounded-full bg-yellow-400 absolute bottom-0 z-10 -mb-2 shadow-md" />
                  </div>

                  {/* Classification Card */}
                  <div className="p-4 rounded-2xl bg-slate-800 border-2 border-slate-700 w-full max-w-md text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-2xl">{angleInfo.icon}</span>
                      <h4 className={`text-lg font-black ${angleInfo.color}`}>{angleInfo.name}</h4>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{angleInfo.desc}</p>
                  </div>
                </div>

                {/* Slider */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600">Geser untuk Mengubah Derajat Sudut:</span>
                    <span className="text-sm font-black text-purple-700">{angleDegrees}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={angleDegrees}
                    onChange={(e) => setAngleDegrees(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                    <span>0° (Nol)</span>
                    <span>45° (Lancip)</span>
                    <span>90° (Siku-Siku)</span>
                    <span>135° (Tumpul)</span>
                    <span>180° (Lurus)</span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-slate-500">Pilih Cepat:</span>
                  {[30, 45, 60, 90, 120, 150, 180].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => {
                        sound.playClick();
                        setAngleDegrees(deg);
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all border ${
                        angleDegrees === deg
                          ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                          : 'bg-slate-100 hover:bg-purple-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
