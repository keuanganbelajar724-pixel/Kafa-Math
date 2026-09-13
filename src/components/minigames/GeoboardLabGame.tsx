import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, X, Grid, Sparkles, Plus, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface GeoboardMission {
  id: number;
  title: string;
  englishTitle: string;
  storyPrompt: string;
  englishStoryPrompt: string;
  targetShapeType: 'rectangle' | 'square' | 'triangle';
  targetArea?: number; // in square units
  targetPerimeter?: number; // in boundary units
  initialWidth: number;
  initialHeight: number;
  cambridgeNote: string;
  englishCambridgeNote: string;
}

const MISSIONS: GeoboardMission[] = [
  {
    id: 1,
    title: 'Misi 1: Kebun Persegi Panjang (Luas = 6 Petak)',
    englishTitle: 'Mission 1: Rectangular Garden (Area = 6 Sq Units)',
    storyPrompt: 'Regangkan karet gelang pada papan pasak geoboard membentuk persegi panjang dengan LUAS tepat 6 petak satuan!',
    englishStoryPrompt: 'Stretch the rubber band on the geoboard to form a rectangle with an AREA of exactly 6 square units!',
    targetShapeType: 'rectangle',
    targetArea: 6,
    initialWidth: 2,
    initialHeight: 2,
    cambridgeNote: 'Luas = Panjang × Lebar. Contoh: 3 × 2 = 6 petak satuan!',
    englishCambridgeNote: 'Area = Length × Width. Example: 3 × 2 = 6 square units!',
  },
  {
    id: 2,
    title: 'Misi 2: Bingkai Foto Persegi (Keliling = 8 Unit)',
    englishTitle: 'Mission 2: Square Frame (Perimeter = 8 Units)',
    storyPrompt: 'Bentuk persegi dengan KELILING tepat 8 satuan unit (semua sisi sama panjang)!',
    englishStoryPrompt: 'Form a square with a PERIMETER of exactly 8 units (all 4 sides equal length)!',
    targetShapeType: 'square',
    targetPerimeter: 8,
    initialWidth: 3,
    initialHeight: 1,
    cambridgeNote: 'Persegi 2 × 2 memiliki 4 sisi berukuran 2 unit. Keliling = 2 + 2 + 2 + 2 = 8 unit!',
    englishCambridgeNote: 'A 2 × 2 square has 4 sides of 2 units. Perimeter = 2 + 2 + 2 + 2 = 8 units!',
  },
  {
    id: 3,
    title: 'Misi 3: Lapangan Futsal Mini (Luas = 8 Petak)',
    englishTitle: 'Mission 3: Mini Futsal Pitch (Area = 8 Sq Units)',
    storyPrompt: 'Tarik karet gelang membentuk lapangan futsal persegi panjang dengan Luas = 8 petak satuan!',
    englishStoryPrompt: 'Stretch the rubber band to form a rectangular field with an Area of 8 square units!',
    targetShapeType: 'rectangle',
    targetArea: 8,
    initialWidth: 2,
    initialHeight: 3,
    cambridgeNote: 'Ukuran 4 petak panjang × 2 petak lebar menghasilkan Luas = 8 petak!',
    englishCambridgeNote: 'Dimensions of 4 units length × 2 units width produce Area = 8 units!',
  },
  {
    id: 4,
    title: 'Misi 4: Alun-Alun Kota Persegi (Luas = 9 Petak)',
    englishTitle: 'Mission 4: Grand Town Square (Area = 9 Sq Units)',
    storyPrompt: 'Buat alun-alun persegi besar dengan Luas = 9 petak satuan (Panjang = Lebar = 3 unit)!',
    englishStoryPrompt: 'Create a grand town square with Area = 9 square units (Width = Height = 3 units)!',
    targetShapeType: 'square',
    targetArea: 9,
    initialWidth: 1,
    initialHeight: 1,
    cambridgeNote: 'Sisi 3 × 3 menghasilkan Luas = 9 petak dan Keliling = 12 unit!',
    englishCambridgeNote: 'Sides of 3 × 3 yield Area = 9 square units and Perimeter = 12 units!',
  },
];

export const GeoboardLabGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState<number>(0);
  const [shapeWidth, setShapeWidth] = useState<number>(2);
  const [shapeHeight, setShapeHeight] = useState<number>(2);
  const [score, setScore] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);

  const mission = MISSIONS[missionIdx];
  const GRID_SIZE = 5; // 5x5 pegs (indices 0..4)

  const currentArea = shapeWidth * shapeHeight;
  const currentPerimeter = 2 * (shapeWidth + shapeHeight);

  const initMission = (idx: number = missionIdx) => {
    const m = MISSIONS[idx];
    setShapeWidth(m.initialWidth);
    setShapeHeight(m.initialHeight);
    setIsSuccess(false);
    setFeedback('');

    const voice = isEnglish ? m.englishStoryPrompt : m.storyPrompt;
    sound.speak(voice);
  };

  useEffect(() => {
    initMission(missionIdx);
  }, [missionIdx, isEnglish]);

  const adjustWidth = (delta: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = Math.max(1, Math.min(GRID_SIZE - 1, shapeWidth + delta));
    setShapeWidth(next);
    evaluateShape(next, shapeHeight);
  };

  const adjustHeight = (delta: number) => {
    if (isSuccess) return;
    sound.playClick();
    const next = Math.max(1, Math.min(GRID_SIZE - 1, shapeHeight + delta));
    setShapeHeight(next);
    evaluateShape(shapeWidth, next);
  };

  const evaluateShape = (w: number, h: number) => {
    const area = w * h;
    const perim = 2 * (w + h);

    let match = false;
    if (mission.targetArea !== undefined && area === mission.targetArea) {
      if (mission.targetShapeType === 'square') {
        match = w === h;
      } else {
        match = true;
      }
    } else if (mission.targetPerimeter !== undefined && perim === mission.targetPerimeter) {
      if (mission.targetShapeType === 'square') {
        match = w === h;
      } else {
        match = true;
      }
    }

    if (match) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
      setScore((s) => s + 40);
      setIsSuccess(true);
      const win = isEnglish
        ? `Magnificent! Rubber band correctly forms ${w} × ${h} shape (Area = ${area}, Perimeter = ${perim})! 🟩✨`
        : `Luar biasa! Karet gelang membentuk bangun ${w} × ${h} dengan sempurna (Luas = ${area} petak, Keliling = ${perim} unit)! 🟩✨`;
      setFeedback(win);
      sound.speak(win);
    } else {
      if (mission.targetArea !== undefined) {
        if (mission.targetShapeType === 'square' && w !== h) {
          setFeedback(isEnglish ? `Target requires a SQUARE (Width must equal Height)! Currently ${w} × ${h}.` : `Syarat misi adalah PERSEGI (Panjang dan Lebar harus sama)! Saat ini ${w} × ${h}.`);
        } else if (area < mission.targetArea) {
          setFeedback(isEnglish ? `Current Area = ${area} sq units. Expand rubber band (+${mission.targetArea - area})!` : `Luas saat ini = ${area} petak satuan. Perbesar karet (+${mission.targetArea - area} lagi)!`);
        } else {
          setFeedback(isEnglish ? `Current Area = ${area} sq units. Shrink rubber band (-${area - mission.targetArea})!` : `Luas saat ini = ${area} petak satuan. Terlalu besar, perkecil karet (-${area - mission.targetArea})!`);
        }
      } else if (mission.targetPerimeter !== undefined) {
        if (mission.targetShapeType === 'square' && w !== h) {
          setFeedback(isEnglish ? `Needs to be a SQUARE (all 4 sides equal length)!` : `Bentuk harus PERSEGI (ke-4 sisi harus sama panjang)!`);
        } else if (perim < mission.targetPerimeter) {
          setFeedback(isEnglish ? `Perimeter = ${perim} units. Needs +${mission.targetPerimeter - perim} more!` : `Keliling = ${perim} unit. Masih kurang +${mission.targetPerimeter - perim} lagi!`);
        } else {
          setFeedback(isEnglish ? `Perimeter = ${perim} units. Lower by -${perim - mission.targetPerimeter}!` : `Keliling = ${perim} unit. Terlalu panjang, kurangi -${perim - mission.targetPerimeter}!`);
        }
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

  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-emerald-400 shadow-2xl overflow-hidden flex flex-col">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            📐
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
            <p className="text-xs text-emerald-100 font-semibold">
              {isEnglish ? 'Cambridge Geoboard, Area & Perimeter Lab' : 'Studio Geoboard Karet, Luas & Keliling (Cambridge Primary)'}
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
        <div className="bg-emerald-50 rounded-2xl p-3.5 border-2 border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                Target Geometri:
              </span>
              <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                {mission.targetArea !== undefined
                  ? `Luas = ${mission.targetArea} Petak Satuan`
                  : `Keliling = ${mission.targetPerimeter} Unit`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 leading-snug">
              {isEnglish ? mission.englishStoryPrompt : mission.storyPrompt}
            </p>
          </div>

          <button
            onClick={() => sound.speak(isEnglish ? mission.englishStoryPrompt : mission.storyPrompt)}
            className="p-2 rounded-xl bg-emerald-200/80 hover:bg-emerald-300 text-emerald-900 flex-shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3. The Physical Wooden Pegboard & Rubber Band SVG */}
        <div className="bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100 rounded-3xl p-4 sm:p-6 border-4 border-amber-800/30 shadow-inner flex flex-col items-center justify-center relative select-none">
          {/* Wood Board Texture Overlay & Peg Grid */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-amber-200/90 rounded-2xl border-4 border-amber-700/60 shadow-lg p-3 flex items-center justify-center">
            {/* SVG Rubber Band & Tiles */}
            <svg
              viewBox="0 0 240 240"
              className="absolute inset-0 w-full h-full p-3 pointer-events-none"
            >
              {/* Active Rubber Band Area Fill */}
              <rect
                x={20}
                y={20}
                width={shapeWidth * 50}
                height={shapeHeight * 50}
                fill={isSuccess ? 'rgba(16, 185, 129, 0.35)' : 'rgba(249, 115, 22, 0.3)'}
                stroke={isSuccess ? '#059669' : '#ea580c'}
                strokeWidth="5"
                rx="8"
                className="transition-all duration-200"
              />

              {/* Grid Unit Petak Squares visualization */}
              {Array.from({ length: shapeHeight }).map((_, rIdx) =>
                Array.from({ length: shapeWidth }).map((_, cIdx) => (
                  <rect
                    key={`${rIdx}-${cIdx}`}
                    x={20 + cIdx * 50 + 4}
                    y={20 + rIdx * 50 + 4}
                    width={42}
                    height={42}
                    fill="rgba(255, 255, 255, 0.3)"
                    stroke="rgba(249, 115, 22, 0.4)"
                    strokeDasharray="2,2"
                    rx="4"
                  />
                ))
              )}

              {/* Corner Rubber Band Stretcher Rings */}
              <circle cx={20} cy={20} r="9" fill="#ea580c" stroke="#fff" strokeWidth="2" />
              <circle cx={20 + shapeWidth * 50} cy={20} r="9" fill="#ea580c" stroke="#fff" strokeWidth="2" />
              <circle cx={20} cy={20 + shapeHeight * 50} r="9" fill="#ea580c" stroke="#fff" strokeWidth="2" />
              <circle cx={20 + shapeWidth * 50} cy={20 + shapeHeight * 50} r="9" fill="#ea580c" stroke="#fff" strokeWidth="2" />
            </svg>

            {/* 5x5 Grid of Wooden Peg Pins */}
            <div className="grid grid-cols-5 gap-7 sm:gap-8 z-10">
              {Array.from({ length: 25 }).map((_, idx) => {
                const col = idx % 5;
                const row = Math.floor(idx / 5);
                const isInsideBand = col <= shapeWidth && row <= shapeHeight;

                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shadow-md transition-colors border border-amber-950 ${
                      isInsideBand ? 'bg-amber-900 ring-2 ring-orange-400' : 'bg-amber-800'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Real-time Math HUD (Luas & Keliling) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 z-10">
            <div className="bg-white/95 border-2 border-emerald-500 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm">
              <span className="text-emerald-700 font-bold text-xs uppercase">Luas (Area):</span>
              <span className="text-xl font-black text-emerald-600">
                {currentArea} petak ({shapeWidth} × {shapeHeight})
              </span>
            </div>

            <div className="bg-white/95 border-2 border-blue-500 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm">
              <span className="text-blue-700 font-bold text-xs uppercase">Keliling (Perimeter):</span>
              <span className="text-xl font-black text-blue-600">
                {currentPerimeter} unit
              </span>
            </div>
          </div>
        </div>

        {/* 4. Tactile Stretcher Controls */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-slate-700">
            <span>Regangkan Karet Gelang (Sentuh Tombol + / -):</span>
            <span className="text-emerald-700 font-bold">
              Bentuk: {shapeWidth === shapeHeight ? 'Persegi Sama Sisi' : 'Persegi Panjang'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Width Controls */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
              <div>
                <div className="text-xs font-black text-slate-800">↔️ Lebar / Panjang Horizontal</div>
                <div className="text-xs text-slate-500 font-bold">{shapeWidth} petak pasak</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustWidth(-1)}
                  disabled={shapeWidth <= 1}
                  className="w-10 h-10 rounded-xl bg-orange-100 hover:bg-orange-200 active:scale-90 text-orange-950 font-black flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-6 text-center font-black text-lg text-slate-800">{shapeWidth}</span>
                <button
                  onClick={() => adjustWidth(+1)}
                  disabled={shapeWidth >= GRID_SIZE - 1}
                  className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-90 text-white font-black flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Height Controls */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
              <div>
                <div className="text-xs font-black text-slate-800">↕️ Tinggi / Panjang Vertikal</div>
                <div className="text-xs text-slate-500 font-bold">{shapeHeight} petak pasak</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustHeight(-1)}
                  disabled={shapeHeight <= 1}
                  className="w-10 h-10 rounded-xl bg-orange-100 hover:bg-orange-200 active:scale-90 text-orange-950 font-black flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-6 text-center font-black text-lg text-slate-800">{shapeHeight}</span>
                <button
                  onClick={() => adjustHeight(+1)}
                  disabled={shapeHeight >= GRID_SIZE - 1}
                  className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-90 text-white font-black flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-orange-50 border-orange-300 text-orange-900'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Grid className="w-5 h-5 text-orange-600" />}
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
          <span>{isEnglish ? 'Reset Board' : 'Ulang Ukuran'}</span>
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
            <span>{missionIdx < MISSIONS.length - 1 ? (isEnglish ? 'Next Geoboard Mission' : 'Misi Geoboard Berikutnya') : (isEnglish ? 'Geoboard Master!' : 'Selesai & Ambil Bintang!')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
