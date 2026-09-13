import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../services/sound';
import { Compass, ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, Sparkles, X, Plus, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface AngleMission {
  id: number;
  title: string;
  englishTitle: string;
  targetAngle: number;
  tolerance: number; // e.g. +-2 degrees
  initialAngle: number;
  classification: string;
  englishClassification: string;
  storyPrompt: string;
  englishStoryPrompt: string;
  themeEmoji: string;
  targetDesc: string;
  englishTargetDesc: string;
  cambridgeNote: string;
  englishCambridgeNote: string;
}

const MISSIONS: AngleMission[] = [
  {
    id: 1,
    title: 'Misi 1: Sorot Lampu Mercusuar',
    englishTitle: 'Mission 1: Lighthouse Light Beam',
    targetAngle: 45,
    tolerance: 2,
    initialAngle: 10,
    classification: 'Sudut Lancip (Acute Angle, < 90°)',
    englishClassification: 'Acute Angle (< 90°)',
    storyPrompt: 'Arahkan sorot lampu mercusuar tepat ke arah 45° (setengah sudut siku-siku) agar kapal nelayan melihat sinyal!',
    englishStoryPrompt: 'Aim the lighthouse light beam exactly at 45° (half of a right angle) so the fishing boat spots the beacon!',
    themeEmoji: '⛵',
    targetDesc: 'Kapal Nelayan di 45°',
    englishTargetDesc: 'Fishing boat at 45°',
    cambridgeNote: 'Sudut 45° adalah setengah dari sudut siku-siku (90° ÷ 2 = 45°).',
    englishCambridgeNote: '45° is half of a right angle (90° ÷ 2 = 45°).',
  },
  {
    id: 2,
    title: 'Misi 2: Tiang Menara Siku-Siku',
    englishTitle: 'Mission 2: Right Angle Construction Crane',
    targetAngle: 90,
    tolerance: 1,
    initialAngle: 30,
    classification: 'Sudut Siku-Siku (Right Angle, = 90°)',
    englishClassification: 'Right Angle (= 90°)',
    storyPrompt: 'Tegakkan lengan crane hidrolik membentuk sudut siku-siku tepat 90° (Quarter Turn) agar tiang berdiri kokoh!',
    englishStoryPrompt: 'Raise the hydraulic crane arm to form a perfect 90° right angle (quarter turn) to support the pillar!',
    themeEmoji: '🏗️',
    targetDesc: 'Tiang Tegak Siku-Siku 90°',
    englishTargetDesc: 'Perpendicular Pillar 90°',
    cambridgeNote: 'Sudut siku-siku (90°) adalah 1/4 putaran penuh (quarter turn).',
    englishCambridgeNote: 'A right angle (90°) is a quarter turn of a full circle.',
  },
  {
    id: 3,
    title: 'Misi 3: Gerbang Benteng Sudut Tumpul',
    englishTitle: 'Mission 3: Castle Gate Obtuse Angle',
    targetAngle: 135,
    tolerance: 2,
    initialAngle: 60,
    classification: 'Sudut Tumpul (Obtuse Angle, > 90° & < 180°)',
    englishClassification: 'Obtuse Angle (> 90° & < 180°)',
    storyPrompt: 'Buka gerbang benteng istana selebar sudut tumpul 135° (90° + 45°) agar kereta kencana kuda kerajaan bisa masuk!',
    englishStoryPrompt: 'Open the fortress gate wide to an obtuse angle of 135° (90° + 45°) for the royal carriage!',
    themeEmoji: '🏰',
    targetDesc: 'Gerbang Terbuka 135°',
    englishTargetDesc: 'Open Gate at 135°',
    cambridgeNote: 'Sudut tumpul lebih besar dari 90° dan lebih kecil dari 180°.',
    englishCambridgeNote: 'Obtuse angles are greater than 90° and less than 180°.',
  },
  {
    id: 4,
    title: 'Misi 4: Jembatan Gantung Garis Lurus',
    englishTitle: 'Mission 4: Straight Line Drawbridge',
    targetAngle: 180,
    tolerance: 1,
    initialAngle: 120,
    classification: 'Sudut Lurus (Straight Line Angle, = 180°)',
    englishClassification: 'Straight Line Angle (= 180°)',
    storyPrompt: 'Ratakan jembatan gantung pulau sampai lurus horizontal 180° (setengah putaran / half turn) agar bus wisata bisa menyeberang!',
    englishStoryPrompt: 'Level the drawbridge until completely horizontal at 180° (half turn) so the school bus can cross!',
    themeEmoji: '🚌',
    targetDesc: 'Jembatan Lurus 180°',
    englishTargetDesc: 'Straight Bridge at 180°',
    cambridgeNote: 'Dua sudut siku-siku digabung membentuk sudut lurus 180° (90° + 90° = 180°).',
    englishCambridgeNote: 'Two right angles form a straight line (90° + 90° = 180°).',
  },
];

export const AngleProtractorLabGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState<number>(0);
  const [currentAngle, setCurrentAngle] = useState<number>(10);
  const [score, setScore] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const mission = MISSIONS[missionIdx];

  const initMission = (idx: number = missionIdx) => {
    const m = MISSIONS[idx];
    setCurrentAngle(m.initialAngle);
    setIsSuccess(false);
    setFeedback('');

    const voice = isEnglish ? m.englishStoryPrompt : m.storyPrompt;
    sound.speak(voice);
  };

  useEffect(() => {
    initMission(missionIdx);
  }, [missionIdx, isEnglish]);

  // Compute angle classification dynamically
  const getAngleCategory = (deg: number) => {
    if (deg === 0) return isEnglish ? 'Zero Angle (0°)' : 'Sudut Nol (0°)';
    if (deg < 90) return isEnglish ? 'Acute Angle (Sudut Lancip, <90°)' : 'Sudut Lancip (< 90°)';
    if (deg === 90) return isEnglish ? 'Right Angle (Sudut Siku-Siku, 90°)' : 'Sudut Siku-Siku (90°)';
    if (deg < 180) return isEnglish ? 'Obtuse Angle (Sudut Tumpul, >90°)' : 'Sudut Tumpul (> 90°)';
    if (deg === 180) return isEnglish ? 'Straight Line Angle (180°)' : 'Sudut Lurus (180°)';
    return isEnglish ? 'Reflex Angle (>180°)' : 'Sudut Refleks (> 180°)';
  };

  const adjustAngle = (delta: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = Math.max(0, Math.min(180, currentAngle + delta));
    setCurrentAngle(next);
    checkSuccess(next);
  };

  const checkSuccess = (deg: number) => {
    const diff = Math.abs(deg - mission.targetAngle);
    if (diff <= mission.tolerance) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
      setScore((s) => s + 40);
      setIsSuccess(true);
      const win = isEnglish
        ? `Magnificent! Exactly ${deg}° (${mission.englishClassification}) reached! Target aligned! 🧭✨`
        : `Luar biasa! Tepat ${deg}° (${mission.classification}) tercapai! Arah sasaran tepat sasaran! 🧭✨`;
      setFeedback(win);
      sound.speak(win);
    } else {
      if (deg < mission.targetAngle) {
        setFeedback(isEnglish ? `Angle is ${deg}°. Needs to rotate +${mission.targetAngle - deg}° more!` : `Sudut saat ini ${deg}°. Masih perlu dinaikkan +${mission.targetAngle - deg}° lagi!`);
      } else {
        setFeedback(isEnglish ? `Angle is ${deg}°. Lower it by -${deg - mission.targetAngle}°!` : `Sudut saat ini ${deg}°. Terlalu besar, turunkan -${deg - mission.targetAngle}°!`);
      }
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (missionIdx < MISSIONS.length - 1) {
      setMissionIdx((p) => p + 1);
    } else {
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90 });
      onComplete(score + 50, 3);
    }
  };

  // Convert degrees to coordinates on SVG arc (center at 200, 200, radius 150)
  const cx = 200;
  const cy = 190;
  const r = 140;

  // In standard math, 0° is to the right (+X), 90° is straight up (-Y), 180° is to the left (-X)
  const rad = (currentAngle * Math.PI) / 180;
  const targetRad = (mission.targetAngle * Math.PI) / 180;

  const armX = cx + r * Math.cos(Math.PI - rad); // measured from left (180°) to right (0°) or vice-versa
  // Let's standard Cambridge protractor: 0° on the right, rotating counter-clockwise up to 180° on left:
  const pointerX = cx + r * Math.cos(rad);
  const pointerY = cy - r * Math.sin(rad);

  const targetX = cx + (r + 18) * Math.cos(targetRad);
  const targetY = cy - (r + 18) * Math.sin(targetRad);

  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-cyan-400 shadow-2xl overflow-hidden flex flex-col">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-600 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            🧭
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isEnglish ? mission.englishTitle : mission.title}
              </h2>
              <span className="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Misi {missionIdx + 1}/{MISSIONS.length}
              </span>
            </div>
            <p className="text-xs text-cyan-100 font-semibold">
              {isEnglish ? 'Cambridge Protractor & Angle Geometry Lab' : 'Laboratorium Busur Derajat Sudut (Cambridge Primary)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setIsEnglish(!isEnglish);
            }}
            className="px-2.5 py-1 rounded-xl bg-white/25 hover:bg-white/35 text-xs font-black flex items-center gap-1 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isEnglish ? '🇬🇧 EN' : '🇮🇩 ID'}</span>
          </button>

          <button
            onClick={onExit}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Mission Context */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="bg-cyan-50 rounded-2xl p-3.5 border-2 border-cyan-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl bg-white p-2 rounded-2xl shadow-xs border border-cyan-200">
              {mission.themeEmoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-cyan-950 uppercase tracking-wide">
                  Target Sudut:
                </span>
                <span className="bg-cyan-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {mission.targetAngle}° ({isEnglish ? mission.englishClassification : mission.classification})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 leading-snug">
                {isEnglish ? mission.englishStoryPrompt : mission.storyPrompt}
              </p>
            </div>
          </div>

          <button
            onClick={() => sound.speak(isEnglish ? mission.englishStoryPrompt : mission.storyPrompt)}
            className="p-2 rounded-xl bg-cyan-200/80 hover:bg-cyan-300 text-cyan-900 flex-shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Interactive SVG Protractor Stage */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-3 sm:p-5 border-2 border-cyan-500/50 flex flex-col items-center justify-center select-none shadow-xl relative overflow-hidden">
          {/* Target indicator pill */}
          <div className="absolute top-3 right-4 z-20 flex items-center gap-2 bg-slate-800/90 backdrop-blur-xs px-3 py-1 rounded-xl border border-cyan-400/50 text-cyan-300 text-xs font-black">
            <span>Sasaran: {isEnglish ? mission.englishTargetDesc : mission.targetDesc}</span>
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 400 230"
            className="w-full max-w-md h-auto"
          >
            {/* Background Protractor Body (Semi-circle) */}
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z`}
              fill="rgba(6, 182, 212, 0.08)"
              stroke="rgba(6, 182, 212, 0.5)"
              strokeWidth="2"
            />
            {/* Inner cut out */}
            <path
              d={`M ${cx - 40} ${cy} A 40 40 0 0 1 ${cx + 40} ${cy} Z`}
              fill="rgba(15, 23, 42, 0.6)"
              stroke="rgba(6, 182, 212, 0.3)"
              strokeWidth="1.5"
            />

            {/* Baseline arm (0 degrees) */}
            <line
              x1={cx}
              y1={cy}
              x2={cx + r + 10}
              y2={cy}
              stroke="#38bdf8"
              strokeWidth="3"
              strokeDasharray="none"
            />
            <circle cx={cx + r + 10} cy={cy} r="4" fill="#38bdf8" />
            <text x={cx + r - 10} y={cy - 6} fill="#7dd3fc" fontSize="11" fontWeight="bold" textAnchor="end">
              0° Garis Dasar
            </text>

            {/* Tick marks and degree numbers around protractor */}
            {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((deg) => {
              const markRad = (deg * Math.PI) / 180;
              const innerX = cx + (r - (deg % 45 === 0 ? 16 : 9)) * Math.cos(markRad);
              const innerY = cy - (r - (deg % 45 === 0 ? 16 : 9)) * Math.sin(markRad);
              const outerX = cx + r * Math.cos(markRad);
              const outerY = cy - r * Math.sin(markRad);
              const textX = cx + (r - 26) * Math.cos(markRad);
              const textY = cy - (r - 26) * Math.sin(markRad);

              return (
                <g key={deg}>
                  <line
                    x1={innerX}
                    y1={innerY}
                    x2={outerX}
                    y2={outerY}
                    stroke={deg % 45 === 0 ? '#38bdf8' : 'rgba(125, 211, 252, 0.4)'}
                    strokeWidth={deg % 45 === 0 ? 2 : 1}
                  />
                  {deg % 15 === 0 && (
                    <text
                      x={textX}
                      y={textY + 3}
                      fill={deg === 90 ? '#facc15' : '#94a3b8'}
                      fontSize={deg % 45 === 0 ? '10' : '8'}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {deg}°
                    </text>
                  )}
                </g>
              );
            })}

            {/* Target marker flag/emoji */}
            <circle cx={targetX} cy={targetY} r="14" fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" strokeWidth="2" strokeDasharray="3,3" />
            <text x={targetX} y={targetY + 4} fontSize="12" textAnchor="middle">
              {mission.themeEmoji}
            </text>

            {/* Current Angle Sector Fill (Colored arc wedge) */}
            <path
              d={`M ${cx} ${cy} L ${cx + 70} ${cy} A 70 70 0 0 0 ${cx + 70 * Math.cos(rad)} ${cy - 70 * Math.sin(rad)} Z`}
              fill={isSuccess ? 'rgba(52, 211, 153, 0.35)' : 'rgba(56, 189, 248, 0.25)'}
              stroke={isSuccess ? '#10b981' : '#0284c7'}
              strokeWidth="1.5"
            />

            {/* Rotating Angle Pointer Arm */}
            <line
              x1={cx}
              y1={cy}
              x2={pointerX}
              y2={pointerY}
              stroke={isSuccess ? '#34d399' : '#f59e0b'}
              strokeWidth="4"
              strokeLinecap="round"
              className="transition-all duration-150"
            />
            {/* Pointer head handle */}
            <circle
              cx={pointerX}
              cy={pointerY}
              r="8"
              fill={isSuccess ? '#10b981' : '#f59e0b'}
              stroke="#ffffff"
              strokeWidth="2.5"
              className="animate-pulse"
            />

            {/* Center Origin Pivot */}
            <circle cx={cx} cy={cy} r="6" fill="#f8fafc" stroke="#0284c7" strokeWidth="3" />
          </svg>

          {/* Dynamic Angle Readout HUD */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1 z-10">
            <div className="bg-slate-900/90 border-2 border-cyan-400 px-4 py-1.5 rounded-2xl flex items-center gap-2 shadow-md">
              <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider">Sudut:</span>
              <span className={`text-2xl font-black ${isSuccess ? 'text-emerald-400' : 'text-amber-400'}`}>
                {currentAngle}°
              </span>
            </div>

            <div className="bg-slate-900/90 border border-slate-700 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-slate-200 shadow-md">
              {getAngleCategory(currentAngle)}
            </div>
          </div>
        </div>

        {/* 4. Tactile Controls & Rotator Pad */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-slate-700">
            <span>Sentuh Tombol Putar Busur Derajat:</span>
            <span className="text-slate-500 font-bold">Rentang: 0° s/d 180°</span>
          </div>

          {/* Tactile adjustment buttons */}
          <div className="grid grid-cols-6 gap-2">
            <button
              onClick={() => adjustAngle(-45)}
              className="py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 font-black text-xs text-slate-800 transition-transform cursor-pointer shadow-xs"
            >
              -45°
            </button>
            <button
              onClick={() => adjustAngle(-10)}
              className="py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 font-black text-xs text-slate-800 transition-transform cursor-pointer shadow-xs"
            >
              -10°
            </button>
            <button
              onClick={() => adjustAngle(-1)}
              className="py-2.5 rounded-xl bg-cyan-100 hover:bg-cyan-200 active:scale-95 font-black text-xs text-cyan-900 transition-transform cursor-pointer shadow-xs"
            >
              -1°
            </button>
            <button
              onClick={() => adjustAngle(+1)}
              className="py-2.5 rounded-xl bg-cyan-100 hover:bg-cyan-200 active:scale-95 font-black text-xs text-cyan-900 transition-transform cursor-pointer shadow-xs"
            >
              +1°
            </button>
            <button
              onClick={() => adjustAngle(+10)}
              className="py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 font-black text-xs text-slate-800 transition-transform cursor-pointer shadow-xs"
            >
              +10°
            </button>
            <button
              onClick={() => adjustAngle(+45)}
              className="py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 font-black text-xs text-slate-800 transition-transform cursor-pointer shadow-xs"
            >
              +45°
            </button>
          </div>

          {/* Quick preset keys */}
          <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Patokan Cepat:</span>
            {[
              { label: '0° (Nol)', val: 0 },
              { label: '45° (Lancip)', val: 45 },
              { label: '90° (Siku-Siku)', val: 90 },
              { label: '135° (Tumpul)', val: 135 },
              { label: '180° (Lurus)', val: 180 },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => {
                  sound.playClick();
                  setCurrentAngle(p.val);
                  checkSuccess(p.val);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-cyan-500 text-[10px] font-bold text-slate-700 cursor-pointer shadow-2xs hover:bg-cyan-50 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-cyan-50 border-cyan-300 text-cyan-900'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Compass className="w-5 h-5 text-cyan-600" />}
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* 5. Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={() => initMission()}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEnglish ? 'Reset Angle' : 'Ulang Posisi'}</span>
        </button>

        {!isSuccess ? (
          <div className="text-xs font-bold text-slate-500 italic">
            💡 {isEnglish ? mission.englishCambridgeNote : mission.cambridgeNote}
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95 animate-bounce"
          >
            <span>{missionIdx < MISSIONS.length - 1 ? (isEnglish ? 'Next Angle' : 'Sudut Berikutnya') : (isEnglish ? 'Angle Master!' : 'Selesai & Ambil Bintang!')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
