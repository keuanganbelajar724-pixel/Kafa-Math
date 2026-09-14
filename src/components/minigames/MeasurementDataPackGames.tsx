import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, X, Compass, Clock, Gauge, Scale, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PackGameProps {
  gameId: string;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

// ==========================================
// 11. COMPASS BEARINGS (Kompas 8 Arah Angin)
// ==========================================
export const CompassBearingsGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const DIRECTIONS = [
    { label: 'Utara (N)', angle: 0 },
    { label: 'Timur Laut (NE)', angle: 45 },
    { label: 'Timur (E)', angle: 90 },
    { label: 'Tenggara (SE)', angle: 135 },
    { label: 'Selatan (S)', angle: 180 },
    { label: 'Barat Daya (SW)', angle: 225 },
    { label: 'Barat (W)', angle: 270 },
    { label: 'Barat Laut (NW)', angle: 315 },
  ];

  const MISSIONS = [
    { targetAngle: 90, targetLabel: 'Timur (90°)', desc: 'Putar jarum kompas berlayar menuju TIMUR (sudut siku-siku 90° searah jarum jam)!' },
    { targetAngle: 180, targetLabel: 'Selatan (180°)', desc: 'Putar jarum kompas berlayar menuju SELATAN (setengah putaran 180°)!' },
    { targetAngle: 315, targetLabel: 'Barat Laut (315°)', desc: 'Arahkan kapal ke BARAT LAUT (sudut 315°)!' },
  ];

  const mission = MISSIONS[missionIdx];

  const rotateTo = (deg: number) => {
    if (isSuccess) return;
    sound.playClick();
    setCurrentAngle(deg);
    if (deg === mission.targetAngle) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 80 });
      setIsSuccess(true);
      setScore((s) => s + 40);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-cyan-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🧭</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Kompas Arah Angin & Navigasi</h2>
            <p className="text-xs text-cyan-100 font-semibold">8 Mata Angin & Sudut Derajat (Bearings)</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-cyan-50 rounded-2xl p-3 border border-cyan-200 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-bold text-cyan-950">{mission.desc}</p>
          <span className="bg-cyan-600 text-white font-black px-2.5 py-1 rounded-xl text-xs flex-shrink-0">
            Target: {mission.targetLabel}
          </span>
        </div>

        {/* Visual Compass Needle */}
        <div className="bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[220px]">
          <div className="relative w-48 h-48 rounded-full border-4 border-cyan-500 bg-slate-800 shadow-inner flex items-center justify-center">
            <span className="absolute top-2 font-black text-xs text-yellow-300">U (0°)</span>
            <span className="absolute right-2 font-black text-xs text-cyan-300">T (90°)</span>
            <span className="absolute bottom-2 font-black text-xs text-cyan-300">S (180°)</span>
            <span className="absolute left-2 font-black text-xs text-cyan-300">B (270°)</span>

            {/* Needle */}
            <div
              className="w-2 h-36 bg-transparent flex flex-col items-center justify-between transition-transform duration-500"
              style={{ transform: `rotate(${currentAngle}deg)` }}
            >
              <div className="w-4 h-16 bg-red-500 rounded-t-full shadow-md"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400 z-10"></div>
              <div className="w-4 h-16 bg-blue-500 rounded-b-full shadow-md"></div>
            </div>
          </div>
          <div className="mt-3 text-cyan-300 text-xs font-black">
            Arah Saat Ini: <span className="text-white text-base font-black">{currentAngle}°</span>
          </div>
        </div>

        {/* 8 Direction Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DIRECTIONS.map((d) => (
            <button
              key={d.angle}
              onClick={() => rotateTo(d.angle)}
              className={`p-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                currentAngle === d.angle
                  ? 'bg-cyan-500 text-white border-cyan-400 scale-105 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setCurrentAngle(0)} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset ke Utara</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => {
              sound.playClick();
              if (missionIdx < MISSIONS.length - 1) {
                setCurrentAngle(0);
                setIsSuccess(false);
                setMissionIdx((m) => m + 1);
              } else {
                onComplete(score + 50, 3);
              }
            }}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Lanjut Misi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 12. TIME DURATION BUS (Selisih Waktu Perjalanan)
// ==========================================
export const TimeDurationBusGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const MISSIONS = [
    { depart: '08:00', arrive: '10:30', targetH: 2, targetM: 30, desc: 'Bus berangkat pk 08:00 dan tiba pk 10:30. Berapa lama perjalanan bus?' },
    { depart: '13:15', arrive: '15:45', targetH: 2, targetM: 30, desc: 'Bus pariwisata berangkat pk 13:15 dan tiba pk 15:45. Tentukan durasi perjalanannya!' },
    { depart: '06:30', arrive: '10:00', targetH: 3, targetM: 30, desc: 'Kereta api berangkat pk 06:30 dan tiba pk 10:00. Berapa lama perjalanannya?' },
  ];

  const mission = MISSIONS[missionIdx];

  const checkDuration = (h: number, m: number) => {
    if (h === mission.targetH && m === mission.targetM) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 75 });
      setIsSuccess(true);
      setScore((s) => s + 40);
    }
  };

  const adjustH = (d: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = Math.max(0, Math.min(12, hours + d));
    setHours(next);
    checkDuration(next, minutes);
  };

  const adjustM = (d: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = Math.max(0, Math.min(55, minutes + d));
    setMinutes(next);
    checkDuration(hours, next);
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-blue-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🚌</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Jadwal Bus & Selisih Waktu</h2>
            <p className="text-xs text-blue-100 font-semibold">Hitung Durasi Waktu Jam & Menit</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-blue-50 rounded-2xl p-3 border border-blue-200">
          <p className="text-xs sm:text-sm font-bold text-blue-950">{mission.desc}</p>
        </div>

        {/* Departure & Arrival Badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-100 border-2 border-emerald-400 p-4 rounded-2xl text-center">
            <span className="text-xs font-bold text-emerald-800">Berangkat</span>
            <div className="text-2xl font-black text-emerald-950">{mission.depart}</div>
          </div>
          <div className="bg-rose-100 border-2 border-rose-400 p-4 rounded-2xl text-center">
            <span className="text-xs font-bold text-rose-800">Tiba</span>
            <div className="text-2xl font-black text-rose-950">{mission.arrive}</div>
          </div>
        </div>

        {/* Stepper for Duration */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 text-center">
          <div className="text-xs text-slate-400 font-bold">Lama Perjalanan (Durasi):</div>
          <div className="flex items-center justify-center gap-6">
            <div>
              <div className="text-3xl font-black text-yellow-400">{hours} Jam</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => adjustH(-1)} className="px-3 py-1 bg-slate-700 rounded-lg font-black">-1</button>
                <button onClick={() => adjustH(1)} className="px-3 py-1 bg-blue-600 rounded-lg font-black">+1</button>
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-cyan-400">{minutes} Menit</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => adjustM(-15)} className="px-2 py-1 bg-slate-700 rounded-lg font-black">-15m</button>
                <button onClick={() => adjustM(15)} className="px-2 py-1 bg-blue-600 rounded-lg font-black">+15m</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => { setHours(0); setMinutes(0); }} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset Waktu</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => {
              sound.playClick();
              if (missionIdx < MISSIONS.length - 1) {
                setHours(0);
                setMinutes(0);
                setIsSuccess(false);
                setMissionIdx((m) => m + 1);
              } else {
                onComplete(score + 50, 3);
              }
            }}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Lanjut Misi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 13. SPEED DISTANCE TIME (Radar Spidometer)
// ==========================================
export const SpeedDistanceTimeGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [userSpeed, setUserSpeed] = useState(40);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  // Target: Distance = 120 km in 2 hours -> Speed = 60 km/h
  const targetSpeed = 60;

  const handleSlider = (v: number) => {
    setUserSpeed(v);
    if (v === targetSpeed) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 75 });
      setIsSuccess(true);
      setScore(50);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🏎️</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Radar Spidometer & Kecepatan</h2>
            <p className="text-xs text-amber-100 font-semibold">Rumus: Kecepatan = Jarak ÷ Waktu</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
          <p className="text-xs sm:text-sm font-bold text-amber-950">
            Mobil menempuh <strong>Jarak 120 km</strong> dalam <strong>Waktu 2 jam</strong>. Geser spidometer ke kecepatan rata-rata mobil tersebut!
          </p>
        </div>

        {/* Speedometer HUD */}
        <div className="bg-slate-900 rounded-3xl p-6 text-center text-white space-y-4">
          <div className="text-xs text-slate-400 uppercase font-bold">Spidometer Kecepatan</div>
          <div className={`text-5xl font-black ${userSpeed === targetSpeed ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`}>
            {userSpeed} <span className="text-base text-slate-300">km/jam</span>
          </div>

          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={userSpeed}
            onChange={(e) => handleSlider(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />

          <div className="flex justify-between text-xs text-slate-400 font-bold px-1">
            <span>20 km/jam</span>
            <span>60 km/jam</span>
            <span>100 km/jam</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setUserSpeed(40)} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => onComplete(score + 40, 3)}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Selesai & Ambil Bintang!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 14. WEIGHT CONVERSION LIFT (Konversi Satuan kg & gram)
// ==========================================
export const WeightConversionLiftGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [totalGram, setTotalGram] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  // Target: 2.5 kg = 2500 gram
  const targetGram = 2500;

  const addWeight = (g: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = totalGram + g;
    setTotalGram(next);
    if (next === targetGram) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 75 });
      setIsSuccess(true);
      setScore(50);
    } else if (next > targetGram) {
      sound.playWrong();
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-emerald-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🏗️</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Lift Konversi Massa (kg & gram)</h2>
            <p className="text-xs text-emerald-100 font-semibold">1 kg = 1.000 gram</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-bold text-emerald-950">
            Muat peti ke dalam lift hingga tepat <strong>2,5 kg (2.500 gram)</strong>!
          </p>
          <span className="bg-emerald-600 text-white font-black px-2.5 py-1 rounded-xl text-xs flex-shrink-0">
            Target: 2.500 g
          </span>
        </div>

        {/* Lift Weight Indicator */}
        <div className="bg-slate-900 rounded-3xl p-6 text-center text-white space-y-2">
          <div className="text-4xl">🏗️📦</div>
          <div className="text-xs text-slate-400 font-bold">Total Beban Lift:</div>
          <div className={`text-4xl font-black ${totalGram === targetGram ? 'text-emerald-400' : totalGram > targetGram ? 'text-rose-400' : 'text-yellow-400'}`}>
            {totalGram.toLocaleString('id-ID')} gram
            <span className="text-sm text-slate-300 ml-2">({(totalGram / 1000).toFixed(2)} kg)</span>
          </div>
          {totalGram > targetGram && <p className="text-xs text-rose-400 font-bold">Kelebihan beban! Tekan Reset.</p>}
        </div>

        {/* Crates */}
        <div className="grid grid-cols-3 gap-3">
          {[250, 500, 1000].map((w) => (
            <button
              key={w}
              onClick={() => addWeight(w)}
              className="py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-500 font-black text-amber-950 flex flex-col items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <span className="text-lg">📦</span>
              <span>{w >= 1000 ? '1 kg (1.000g)' : `${w} gram`}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setTotalGram(0)} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Kosongkan Lift</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => onComplete(score + 40, 3)}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Selesai & Bintang!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 15. MEAN MEDIAN SEESAW (Jungkat-Jungkit Rata-rata)
// ==========================================
export const MeanMedianSeesawGame: React.FC<PackGameProps> = ({ onComplete, onExit }) => {
  const [fulcrumPos, setFulcrumPos] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  // Data: [2, 4, 6, 8, 10] -> Mean = (2+4+6+8+10)/5 = 6. Median = 6.
  const correctMean = 6;

  const placeFulcrum = (num: number) => {
    sound.playClick();
    setFulcrumPos(num);
    if (num === correctMean) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 75 });
      setIsSuccess(true);
      setScore(50);
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-indigo-400 shadow-2xl overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">⚖️</div>
          <div>
            <h2 className="font-black text-base sm:text-lg">Jungkat-Jungkit Rata-Rata (Mean)</h2>
            <p className="text-xs text-indigo-100 font-semibold">Titik Keseimbangan Data Nilai</p>
          </div>
        </div>
        <button onClick={onExit} className="w-8 h-8 rounded-full bg-white/20 text-white font-bold flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-200">
          <p className="text-xs sm:text-sm font-bold text-indigo-950">
            Data Nilai: <strong>2, 4, 6, 8, 10</strong>. Letakkan segitiga tumpuan pada angka yang menjadi <strong>Nilai Rata-rata (Mean)</strong> agar papan jungkat-jungkit seimbang!
          </p>
        </div>

        {/* Seesaw Visual */}
        <div className="bg-slate-900 rounded-3xl p-6 text-center text-white space-y-6 min-h-[200px] flex flex-col justify-center">
          {/* Plank with data points */}
          <div className="relative w-full h-4 bg-amber-600 rounded-full flex items-center justify-between px-4">
            {[2, 4, 6, 8, 10].map((val) => (
              <div key={val} className="relative flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-yellow-400 text-slate-900 font-black text-xs flex items-center justify-center -top-8 absolute shadow-md">
                  {val}
                </div>
              </div>
            ))}
          </div>

          {/* Fulcrum Selector */}
          <div className="text-xs text-slate-400 font-bold">Pilih Posisi Segitiga Penyangga:</div>
          <div className="flex justify-center gap-3">
            {[4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => placeFulcrum(num)}
                className={`w-12 h-12 rounded-2xl font-black text-base border-2 cursor-pointer transition-all ${
                  fulcrumPos === num
                    ? num === correctMean
                      ? 'bg-emerald-500 text-white border-emerald-400 scale-110 shadow-lg'
                      : 'bg-rose-500 text-white border-rose-400'
                    : 'bg-slate-800 text-indigo-300 border-indigo-500 hover:bg-slate-700'
                }`}
              >
                ▲ {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button onClick={() => setFulcrumPos(null)} className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" />
          <span>Reset Tumpuan</span>
        </button>
        {isSuccess && (
          <button
            onClick={() => onComplete(score + 40, 3)}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <span>Selesai & Ambil Bintang!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
