import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import {
  ArrowRight,
  Volume2,
  Globe,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Rocket,
  Anchor,
  Compass,
  CircleDot,
  BarChart,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PackGameProps {
  gameId: string;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

// =========================================================================
// 1. PETUALANGAN OPERASI KABATAKU / PEMDAS (Order of Operations Runner)
// =========================================================================
export const OrderOfOperationsRunnerGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [step, setStep] = useState<'priority' | 'final'>('priority');
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);

  const MISSIONS = [
    {
      expression: '5 + 4 × 3',
      priorityQuestion: 'Operasi manakah yang WAJIB dihitung lebih dahulu?',
      priorityChoices: ['5 + 4 (Penjumlahan)', '4 × 3 (Perkalian)'],
      priorityCorrect: '4 × 3 (Perkalian)',
      simplified: '5 + 12',
      finalQuestion: 'Berapa hasil akhir dari 5 + 12?',
      finalChoices: [17, 27, 12, 19],
      finalCorrect: 17,
      explanation: 'Sesuai aturan KABATAKU / PEMDAS, perkalian (4 × 3 = 12) didahulukan daripada penjumlahan. Hasil = 5 + 12 = 17.',
    },
    {
      expression: '(10 - 4) × 6',
      priorityQuestion: 'Operasi manakah yang WAJIB dihitung lebih dahulu?',
      priorityChoices: ['(10 - 4) di dalam Kurung', '4 × 6 Perkalian'],
      priorityCorrect: '(10 - 4) di dalam Kurung',
      simplified: '6 × 6',
      finalQuestion: 'Berapa hasil akhir dari 6 × 6?',
      finalChoices: [36, 24, 60, 48],
      finalCorrect: 36,
      explanation: 'Tanda kurung selalu memiliki prioritas tertinggi! Hitung (10 - 4 = 6) terlebih dahulu, lalu kalikan 6 × 6 = 36.',
    },
    {
      expression: '24 - 16 ÷ 4',
      priorityQuestion: 'Operasi manakah yang WAJIB dihitung lebih dahulu?',
      priorityChoices: ['24 - 16 (Pengurangan)', '16 ÷ 4 (Pembagian)'],
      priorityCorrect: '16 ÷ 4 (Pembagian)',
      simplified: '24 - 4',
      finalQuestion: 'Berapa hasil akhir dari 24 - 4?',
      finalChoices: [20, 2, 8, 16],
      finalCorrect: 20,
      explanation: 'Pembagian lebih kuat dari pengurangan. Hitung 16 ÷ 4 = 4 terlebih dahulu. Maka 24 - 4 = 20.',
    },
    {
      expression: '8 + 2 × (9 - 5)',
      priorityQuestion: 'Operasi manakah yang paling pertama dihitung?',
      priorityChoices: ['8 + 2 (Penjumlahan)', '(9 - 5) di dalam kurung'],
      priorityCorrect: '(9 - 5) di dalam kurung',
      simplified: '8 + 2 × 4 = 8 + 8',
      finalQuestion: 'Berapa hasil akhir dari 8 + (2 × 4)?',
      finalChoices: [16, 40, 24, 18],
      finalCorrect: 16,
      explanation: 'Kurung (9 - 5 = 4) dahulu, lalu kalikan 2 × 4 = 8, terakhir jumlahkan 8 + 8 = 16.',
    },
  ];

  const mission = MISSIONS[missionIdx];

  useEffect(() => {
    setIsSuccess(false);
    setStep('priority');
    setSelectedAnswer(null);
  }, [missionIdx]);

  const handlePrioritySelect = (choice: string) => {
    if (isSuccess) return;
    sound.playClick();
    setSelectedAnswer(choice);

    if (choice === mission.priorityCorrect) {
      sound.playCorrect();
      setTimeout(() => {
        setStep('final');
        setSelectedAnswer(null);
      }, 600);
    } else {
      sound.playRetry();
    }
  };

  const handleFinalSelect = (choice: number) => {
    if (isSuccess) return;
    sound.playClick();
    setSelectedAnswer(choice);

    if (choice === mission.finalCorrect) {
      sound.playCorrect();
      setIsSuccess(true);
      setScore((prev) => prev + 150);
      confetti({ particleCount: 30, spread: 60 });
    } else {
      sound.playRetry();
    }
  };

  const nextMission = () => {
    sound.playClick();
    if (missionIdx < MISSIONS.length - 1) {
      setMissionIdx(missionIdx + 1);
    } else {
      onComplete(score + 150, 3);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg">
              Petualangan Operasi KABATAKU (PEMDAS)
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Soal {missionIdx + 1} dari {MISSIONS.length} • Prioritas Berhitung SD
            </p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="text-xs font-black px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
        >
          Keluar
        </button>
      </div>

      {/* Main Expression Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white text-center shadow-md">
        <span className="text-xs font-black uppercase tracking-wider text-amber-200 block mb-1">
          SOAL OPERASI HITUNG
        </span>
        <div className="text-3xl sm:text-4xl font-black font-mono tracking-widest">
          {mission.expression}
        </div>
      </div>

      {/* Step 1: Prioritas */}
      {step === 'priority' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="text-center">
            <span className="text-xs font-black text-amber-600 uppercase bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Langkah 1: Tentukan Prioritas
            </span>
            <p className="text-sm font-extrabold text-slate-800 mt-2">
              {mission.priorityQuestion}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {mission.priorityChoices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handlePrioritySelect(choice)}
                className={`p-4 rounded-2xl border-2 font-black text-sm text-left transition-all cursor-pointer ${
                  selectedAnswer === choice
                    ? choice === mission.priorityCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-rose-50 border-rose-500 text-rose-800 animate-shake'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-800'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Final Calculation */}
      {step === 'final' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="text-center">
            <span className="text-xs font-black text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Langkah 2: Selesaikan Hasil Akhir
            </span>
            <p className="text-xs text-slate-500 font-bold mt-1">Bentuk sederhana: {mission.simplified}</p>
            <p className="text-sm font-extrabold text-slate-800 mt-2">
              {mission.finalQuestion}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {mission.finalChoices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleFinalSelect(choice)}
                className={`p-4 rounded-2xl border-2 font-black text-lg text-center transition-all cursor-pointer ${
                  selectedAnswer === choice
                    ? choice === mission.finalCorrect
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : 'bg-rose-50 border-rose-500 text-rose-800 animate-shake'
                    : 'bg-slate-50 border-slate-200 hover:border-emerald-400 text-slate-800'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Tepat Sekali! +150 Poin</span>
          </div>
          <p className="text-xs text-emerald-800 font-medium">{mission.explanation}</p>
          <button
            onClick={nextMission}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{missionIdx < MISSIONS.length - 1 ? 'Soal Berikutnya' : 'Selesai & Rayakan!'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. BALAPAN ROKET FPB & KPK (KPK & FPB Rocket Race)
// =========================================================================
export const KpkFpbRocketRaceGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rocketProgress, setRocketProgress] = useState(15);
  const [selectedVal, setSelectedVal] = useState<number | null>(null);

  const MISSIONS = [
    {
      type: 'FPB',
      numbers: [12, 18],
      question: 'Berapakah FPB (Faktor Persekutuan Terbesar) dari 12 dan 18?',
      options: [4, 6, 3, 2],
      correct: 6,
      hint: 'Faktor 12 = 1, 2, 3, 4, 6, 12. Faktor 18 = 1, 2, 3, 6, 9, 18. Faktor yang sama dan terbesar adalah 6.',
    },
    {
      type: 'KPK',
      numbers: [4, 6],
      question: 'Berapakah KPK (Kelipatan Persekutuan Terkecil) dari 4 dan 6?',
      options: [12, 24, 18, 10],
      correct: 12,
      hint: 'Kelipatan 4 = 4, 8, 12, 16... Kelipatan 6 = 6, 12, 18... Kelipatan pertama yang sama adalah 12.',
    },
    {
      type: 'FPB',
      numbers: [20, 30],
      question: 'Berapakah FPB dari 20 dan 30?',
      options: [5, 10, 2, 15],
      correct: 10,
      hint: 'Angka terbesar yang dapat membagi 20 dan 30 sekaligus adalah 10.',
    },
    {
      type: 'KPK',
      numbers: [6, 8],
      question: 'Berapakah KPK dari 6 dan 8?',
      options: [24, 48, 16, 32],
      correct: 24,
      hint: 'Kelipatan 6 = 6, 12, 18, 24... Kelipatan 8 = 8, 16, 24... Yang sama terkecil adalah 24.',
    },
  ];

  const mission = MISSIONS[missionIdx];

  useEffect(() => {
    setIsSuccess(false);
    setSelectedVal(null);
  }, [missionIdx]);

  const handleSelect = (val: number) => {
    if (isSuccess) return;
    sound.playClick();
    setSelectedVal(val);

    if (val === mission.correct) {
      sound.playCorrect();
      setIsSuccess(true);
      setScore((prev) => prev + 150);
      setRocketProgress((prev) => Math.min(100, prev + 25));
      confetti({ particleCount: 30, spread: 60 });
    } else {
      sound.playRetry();
    }
  };

  const nextMission = () => {
    sound.playClick();
    if (missionIdx < MISSIONS.length - 1) {
      setMissionIdx(missionIdx + 1);
    } else {
      onComplete(score + 150, 3);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Rocket className="w-6 h-6 text-indigo-600" />
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg">
              Balapan Roket FPB & KPK
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Level {missionIdx + 1} dari {MISSIONS.length} • Meluncurkan Roket ke Antariksa
            </p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="text-xs font-black px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
        >
          Keluar
        </button>
      </div>

      {/* Rocket Flight Track Visual */}
      <div className="bg-slate-900 rounded-2xl p-4 relative overflow-hidden border border-slate-800">
        <div className="flex justify-between text-[11px] font-black text-slate-400 mb-2">
          <span>BUMI 🌍</span>
          <span>ORBIT 🛰️</span>
          <span>BULAN 🌕</span>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 relative">
          <div
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${rocketProgress}%` }}
          />
        </div>
        <div
          className="text-2xl absolute top-7 transition-all duration-700 pointer-events-none"
          style={{ left: `calc(${rocketProgress}% - 14px)` }}
        >
          🚀
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-200 text-center space-y-2">
        <span className="text-xs font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-full uppercase">
          Misi: {mission.type}
        </span>
        <h4 className="text-base sm:text-lg font-black text-slate-900">
          {mission.question}
        </h4>
        <div className="flex justify-center gap-3 pt-1">
          {mission.numbers.map((n, i) => (
            <span
              key={i}
              className="w-12 h-12 rounded-2xl bg-white border-2 border-indigo-300 font-black text-xl text-indigo-900 flex items-center justify-center shadow-xs"
            >
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {mission.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className={`p-4 rounded-2xl border-2 font-black text-xl text-center transition-all cursor-pointer ${
              selectedVal === opt
                ? opt === mission.correct
                  ? 'bg-emerald-500 border-emerald-600 text-white'
                  : 'bg-rose-50 border-rose-500 text-rose-800 animate-shake'
                : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800 shadow-xs'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Roket Melaju Kencang! +150 Poin</span>
          </div>
          <p className="text-xs text-emerald-800 font-medium">{mission.hint}</p>
          <button
            onClick={nextMission}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{missionIdx < MISSIONS.length - 1 ? 'Misi Roket Berikutnya' : 'Misi Sukses Selesai!'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 3. KAPAL SELAM BILANGAN BULAT NEGATIF (Negative Number Submarine)
// =========================================================================
export const NegativeSubmarineGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [subDepth, setSubDepth] = useState(-10); // current depth
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const MISSIONS = [
    {
      start: -10,
      action: 'menyelam turun 5 meter lagi',
      change: -5,
      target: -15,
      question: 'Kapal selam berada pada kedalaman -10m. Jika menyelam turun 5m lagi (-10 + (-5)), di kedalaman berapakah kapal sekarang?',
      choices: [-15, -5, 5, -12],
      explanation: 'Turun ke bawah menambah nilai minus: -10 - 5 = -15 meter.',
    },
    {
      start: -18,
      action: 'naik ke atas 8 meter menuju permukaan',
      change: 8,
      target: -10,
      question: 'Kapal berada di -18m. Jika kapal naik 8m (-18 + 8), di manakah posisinya sekarang?',
      choices: [-10, -26, 10, -8],
      explanation: 'Naik ke arah permukaan menambah nilai positif: -18 + 8 = -10 meter.',
    },
    {
      start: -5,
      action: 'naik 5 meter hingga tepat di permukaan laut',
      change: 5,
      target: 0,
      question: 'Kapal di -5m. Naik 5m (-5 + 5), berapa angka kedalaman di permukaan air?',
      choices: [0, -10, 1, 5],
      explanation: 'Tepat di permukaan laut bernilai 0: -5 + 5 = 0 meter.',
    },
    {
      start: -8,
      action: 'suhu air turun dari -2°C menjadi turun 4°C lebih dingin',
      change: -4,
      target: -6,
      question: 'Suhu awal air -2°C. Suhu lalu turun 4°C (-2 - 4). Berapa suhu akhir air laut?',
      choices: [-6, 2, -2, -8],
      explanation: 'Mengurangkan bilangan negatif: -2 - 4 = -6°C.',
    },
  ];

  const mission = MISSIONS[missionIdx];

  useEffect(() => {
    setSubDepth(mission.start);
    setIsSuccess(false);
    setSelectedChoice(null);
  }, [missionIdx]);

  const handleSelect = (choice: number) => {
    if (isSuccess) return;
    sound.playClick();
    setSelectedChoice(choice);

    if (choice === mission.target) {
      sound.playCorrect();
      setIsSuccess(true);
      setSubDepth(mission.target);
      setScore((prev) => prev + 150);
      confetti({ particleCount: 30, spread: 60 });
    } else {
      sound.playRetry();
    }
  };

  const nextMission = () => {
    sound.playClick();
    if (missionIdx < MISSIONS.length - 1) {
      setMissionIdx(missionIdx + 1);
    } else {
      onComplete(score + 150, 3);
    }
  };

  // calculate visual position (0m to -25m mapped to top 10% to 90%)
  const depthPercent = Math.min(90, Math.max(10, Math.abs(subDepth) * 3.5));

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Anchor className="w-6 h-6 text-cyan-600" />
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg">
              Kapal Selam Bilangan Bulat Negatif
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Level {missionIdx + 1} dari {MISSIONS.length} • Operasi Bilangan Negatif
            </p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="text-xs font-black px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
        >
          Keluar
        </button>
      </div>

      {/* Ocean Depth Visual */}
      <div className="h-44 bg-gradient-to-b from-sky-400 via-blue-700 to-indigo-950 rounded-2xl relative overflow-hidden border border-blue-600 p-3 flex flex-col justify-between">
        {/* Depth Markings */}
        <div className="flex items-center justify-between text-[11px] font-black text-white/80 border-b border-white/20 pb-1">
          <span>0m (Permukaan Air) 🌊</span>
          <span>Kedalaman Saat Ini: {subDepth}m</span>
        </div>

        {/* Animated Submarine */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-700 flex items-center gap-2 pointer-events-none"
          style={{ top: `${depthPercent}%` }}
        >
          <span className="text-3xl filter drop-shadow-md">🚢</span>
          <span className="bg-black/60 text-cyan-300 text-xs font-mono font-black px-2 py-0.5 rounded-md border border-cyan-400/40">
            {subDepth}m
          </span>
        </div>

        <div className="text-[10px] font-black text-indigo-300 flex justify-between">
          <span>-10m Zona Karang 🐠</span>
          <span>-20m Palung Laut Gelap 🦑</span>
        </div>
      </div>

      {/* Mission Story Box */}
      <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 text-center space-y-1">
        <span className="text-xs font-black text-sky-800 uppercase tracking-wider">
          INSTRUKSI NAVIGASI
        </span>
        <p className="text-sm font-extrabold text-slate-900">{mission.question}</p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {mission.choices.map((c) => (
          <button
            key={c}
            onClick={() => handleSelect(c)}
            className={`p-4 rounded-2xl border-2 font-black text-lg text-center transition-all cursor-pointer ${
              selectedChoice === c
                ? c === mission.target
                  ? 'bg-cyan-500 border-cyan-600 text-white'
                  : 'bg-rose-50 border-rose-500 text-rose-800 animate-shake'
                : 'bg-slate-50 border-slate-200 hover:border-cyan-400 text-slate-800 shadow-xs'
            }`}
          >
            {c} meter
          </button>
        ))}
      </div>

      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Navigasi Sukses! +150 Poin</span>
          </div>
          <p className="text-xs text-emerald-800 font-medium">{mission.explanation}</p>
          <button
            onClick={nextMission}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{missionIdx < MISSIONS.length - 1 ? 'Misi Berikutnya' : 'Selesai & Rayakan!'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 4. LABORATORIUM LINGKARAN & PI (π) (Circle Geometry Lab)
// =========================================================================
export const CircleGeometryLabGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedVal, setSelectedVal] = useState<number | null>(null);

  const MISSIONS = [
    {
      r: 7,
      d: 14,
      type: 'Keliling',
      question: 'Sebuah lingkaran memiliki jari-jari (r) = 7 cm. Gunakan π = 22/7. Berapakah Keliling lingkaran tersebut? (Rumus: K = 2 × π × r)',
      choices: [44, 22, 154, 88],
      correct: 44,
      explanation: 'K = 2 × (22/7) × 7 = 2 × 22 = 44 cm.',
    },
    {
      r: 7,
      d: 14,
      type: 'Luas',
      question: 'Sebuah lingkaran memiliki jari-jari (r) = 7 cm. Gunakan π = 22/7. Berapakah Luas lingkaran tersebut? (Rumus: L = π × r²)',
      choices: [154, 44, 196, 77],
      correct: 154,
      explanation: 'L = (22/7) × 7 × 7 = 22 × 7 = 154 cm².',
    },
    {
      r: 10,
      d: 20,
      type: 'Keliling',
      question: 'Sebuah roda sepeda berdiameter (d) = 20 cm (r = 10 cm). Gunakan π = 3,14. Berapa kelilingnya? (Rumus: K = π × d)',
      choices: [62.8, 31.4, 314, 628],
      correct: 62.8,
      explanation: 'K = 3,14 × 20 = 62,8 cm.',
    },
    {
      r: 10,
      d: 20,
      type: 'Luas',
      question: 'Sebuah pizza bundar memiliki jari-jari r = 10 cm. Gunakan π = 3,14. Berapakah Luas permukaan pizza? (Rumus: L = π × r²)',
      choices: [314, 62.8, 157, 31.4],
      correct: 314,
      explanation: 'L = 3,14 × 10 × 10 = 314 cm².',
    },
  ];

  const mission = MISSIONS[missionIdx];

  useEffect(() => {
    setIsSuccess(false);
    setSelectedVal(null);
  }, [missionIdx]);

  const handleSelect = (val: number) => {
    if (isSuccess) return;
    sound.playClick();
    setSelectedVal(val);

    if (val === mission.correct) {
      sound.playCorrect();
      setIsSuccess(true);
      setScore((prev) => prev + 150);
      confetti({ particleCount: 30, spread: 60 });
    } else {
      sound.playRetry();
    }
  };

  const nextMission = () => {
    sound.playClick();
    if (missionIdx < MISSIONS.length - 1) {
      setMissionIdx(missionIdx + 1);
    } else {
      onComplete(score + 150, 3);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CircleDot className="w-6 h-6 text-rose-500" />
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg">
              Laboratorium Lingkaran & Pi (π)
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Level {missionIdx + 1} dari {MISSIONS.length} • Luas & Keliling Bangun Datar
            </p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="text-xs font-black px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
        >
          Keluar
        </button>
      </div>

      {/* Interactive Circle Visualizer */}
      <div className="bg-rose-50/60 rounded-2xl p-6 border border-rose-200 flex flex-col items-center justify-center relative">
        <div className="w-36 h-36 rounded-full border-4 border-rose-500 bg-white flex items-center justify-center relative shadow-sm">
          {/* Radius line */}
          <div className="w-18 h-0.5 bg-rose-600 absolute right-1/2 origin-right" />
          <div className="w-2.5 h-2.5 rounded-full bg-rose-600 z-10" />
          <span className="absolute top-12 text-[11px] font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
            r = {mission.r} cm
          </span>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs font-black text-slate-700">
          <span>Jari-jari (r): {mission.r} cm</span>
          <span>•</span>
          <span>Diameter (d): {mission.d} cm</span>
        </div>
      </div>

      {/* Question */}
      <div className="text-center space-y-1">
        <span className="text-xs font-black text-rose-600 uppercase bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
          Hitung {mission.type} Lingkaran
        </span>
        <p className="text-sm font-extrabold text-slate-900 pt-1">{mission.question}</p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {mission.choices.map((c) => (
          <button
            key={c}
            onClick={() => handleSelect(c)}
            className={`p-4 rounded-2xl border-2 font-black text-lg text-center transition-all cursor-pointer ${
              selectedVal === c
                ? c === mission.correct
                  ? 'bg-rose-500 border-rose-600 text-white'
                  : 'bg-rose-50 border-rose-500 text-rose-800 animate-shake'
                : 'bg-white border-slate-200 hover:border-rose-400 text-slate-800 shadow-xs'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Kalkulasi Geometri Tepat! +150 Poin</span>
          </div>
          <p className="text-xs text-emerald-800 font-medium">{mission.explanation}</p>
          <button
            onClick={nextMission}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{missionIdx < MISSIONS.length - 1 ? 'Soal Lingkaran Berikutnya' : 'Selesai & Rayakan!'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 5. DETEKTIF DATA: MEAN, MEDIAN, MODUS (Data Detective)
// =========================================================================
export const MeanMedianDetectiveGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedVal, setSelectedVal] = useState<number | null>(null);

  const MISSIONS = [
    {
      data: [6, 7, 7, 8, 9],
      type: 'MODUS',
      question: 'Kumpulan nilai: 6, 7, 7, 8, 9. Manakah MODUS (nilai yang paling sering muncul)?',
      choices: [7, 6, 8, 9],
      correct: 7,
      explanation: 'Angka 7 muncul sebanyak 2 kali (paling sering), sedangkan angka lainnya hanya muncul 1 kali.',
    },
    {
      data: [5, 6, 8, 9, 10],
      type: 'MEDIAN',
      question: 'Data terurut: 5, 6, 8, 9, 10. Berapakah MEDIAN (nilai tengahnya)?',
      choices: [8, 6, 9, 7.6],
      correct: 8,
      explanation: 'Terdapat 5 angka. Angka tepat di urutan ke-3 (tengah) adalah 8.',
    },
    {
      data: [4, 6, 8, 10],
      type: 'MEAN (Rata-rata)',
      question: 'Data nilai: 4, 6, 8, 10. Berapakah MEAN (rata-rata hitungnya)? (Rumus: Total Jumlah ÷ Banyak Data)',
      choices: [7, 8, 6, 28],
      correct: 7,
      explanation: 'Total = 4 + 6 + 8 + 10 = 28. Banyak data = 4. Maka Mean = 28 ÷ 4 = 7.',
    },
    {
      data: [8, 9, 9, 10],
      type: 'MEDIAN',
      question: 'Data genap: 8, 9, 9, 10. Berapakah Median (rata-rata dari dua angka tengah 9 dan 9)?',
      choices: [9, 8.5, 9.5, 10],
      correct: 9,
      explanation: 'Dua angka tengah adalah 9 dan 9. (9 + 9) ÷ 2 = 9.',
    },
  ];

  const mission = MISSIONS[missionIdx];

  useEffect(() => {
    setIsSuccess(false);
    setSelectedVal(null);
  }, [missionIdx]);

  const handleSelect = (val: number) => {
    if (isSuccess) return;
    sound.playClick();
    setSelectedVal(val);

    if (val === mission.correct) {
      sound.playCorrect();
      setIsSuccess(true);
      setScore((prev) => prev + 150);
      confetti({ particleCount: 30, spread: 60 });
    } else {
      sound.playRetry();
    }
  };

  const nextMission = () => {
    sound.playClick();
    if (missionIdx < MISSIONS.length - 1) {
      setMissionIdx(missionIdx + 1);
    } else {
      onComplete(score + 150, 3);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xl max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BarChart className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg">
              Detektif Data: Mean, Median & Modus
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Level {missionIdx + 1} dari {MISSIONS.length} • Statistika Deskriptif SD
            </p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="text-xs font-black px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
        >
          Keluar
        </button>
      </div>

      {/* Data Cards Visualization */}
      <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200 text-center space-y-3">
        <span className="text-xs font-black bg-purple-600 text-white px-2.5 py-0.5 rounded-full uppercase">
          KASUS DETEKTIF: {mission.type}
        </span>
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          {mission.data.map((num, i) => (
            <div
              key={i}
              className="w-12 h-14 rounded-2xl bg-white border-2 border-purple-300 font-black text-2xl text-purple-950 flex flex-col items-center justify-center shadow-xs"
            >
              <span>{num}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Question */}
      <p className="text-center font-extrabold text-sm sm:text-base text-slate-900">
        {mission.question}
      </p>

      {/* Choices */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {mission.choices.map((c) => (
          <button
            key={c}
            onClick={() => handleSelect(c)}
            className={`p-4 rounded-2xl border-2 font-black text-xl text-center transition-all cursor-pointer ${
              selectedVal === c
                ? c === mission.correct
                  ? 'bg-purple-600 border-purple-700 text-white'
                  : 'bg-rose-50 border-rose-500 text-rose-800 animate-shake'
                : 'bg-white border-slate-200 hover:border-purple-400 text-slate-800 shadow-xs'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Analisis Detektif Akurat! +150 Poin</span>
          </div>
          <p className="text-xs text-emerald-800 font-medium">{mission.explanation}</p>
          <button
            onClick={nextMission}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{missionIdx < MISSIONS.length - 1 ? 'Kasus Data Berikutnya' : 'Selesai & Rayakan!'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
