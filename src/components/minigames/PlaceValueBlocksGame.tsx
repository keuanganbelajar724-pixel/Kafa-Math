import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Sparkles, Trophy, RotateCcw, ArrowRight, Volume2, Globe, CheckCircle2, Box, Layers, RefreshCw, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface PlaceValueChallenge {
  id: number;
  title: string;
  englishTitle: string;
  targetNumber: number;
  storyPrompt: string;
  englishStoryPrompt: string;
  allowHundreds: boolean;
  reqHundreds: number;
  reqTens: number;
  reqOnes: number;
  initialTens?: number;
  initialOnes?: number;
  initialHundreds?: number;
  requireRegrouping?: boolean;
}

const CHALLENGES: PlaceValueChallenge[] = [
  {
    id: 1,
    title: 'Misi 1: Membangun Bilangan 35',
    englishTitle: 'Mission 1: Build the Number 35',
    targetNumber: 35,
    allowHundreds: false,
    reqHundreds: 0,
    reqTens: 3,
    reqOnes: 5,
    storyPrompt: 'Susun balok nilai tempat agar bernilai 35! Gunakan 3 batang puluhan dan 5 kubus satuan.',
    englishStoryPrompt: 'Build the number 35 using 3 ten rods and 5 unit cubes!',
  },
  {
    id: 2,
    title: 'Misi 2: Keajaiban Regrouping (Tukar 10)',
    englishTitle: 'Mission 2: Regrouping Magic (Exchange 10)',
    targetNumber: 24,
    allowHundreds: false,
    reqHundreds: 0,
    reqTens: 2,
    reqOnes: 4,
    initialTens: 1,
    initialOnes: 14, // 14 ones -> child must regroup 10 ones into 1 ten!
    requireRegrouping: true,
    storyPrompt: 'Ada 14 kubus satuan di meja! Sentuh tombol "Tukar 10 Satuan ➔ 1 Puluhan" untuk merapikannya menjadi 2 puluhan dan 4 satuan (24)!',
    englishStoryPrompt: 'There are 14 ones! Tap "Regroup 10 Ones ➔ 1 Ten" to exchange and form 2 tens and 4 ones (24)!',
  },
  {
    id: 3,
    title: 'Misi 3: Rumah Tiga Digit (142)',
    englishTitle: 'Mission 3: Three-Digit Explorer (142)',
    targetNumber: 142,
    allowHundreds: true,
    reqHundreds: 1,
    reqTens: 4,
    reqOnes: 2,
    storyPrompt: 'Susun bilangan 142! Ambil 1 lempeng ratusan (100), 4 batang puluhan (40), dan 2 kubus satuan (2).',
    englishStoryPrompt: 'Build 142! Place 1 hundred flat, 4 ten rods, and 2 unit cubes.',
  },
  {
    id: 4,
    title: 'Misi 4: Nilai Tempat Besar (268)',
    englishTitle: 'Mission 4: Big Place Value (268)',
    targetNumber: 268,
    allowHundreds: true,
    reqHundreds: 2,
    reqTens: 6,
    reqOnes: 8,
    storyPrompt: 'Gudang membutuhkan 268 batu bata! Susun 2 lempeng ratusan, 6 puluhan, dan 8 satuan.',
    englishStoryPrompt: 'The warehouse needs 268 bricks! Place 2 hundreds, 6 tens, and 8 ones.',
  },
  {
    id: 5,
    title: 'Misi 5: Penjumlahan Manipulatif (27 + 15)',
    englishTitle: 'Mission 5: Hands-on Addition with Regrouping',
    targetNumber: 42,
    allowHundreds: false,
    reqHundreds: 0,
    reqTens: 4,
    reqOnes: 2,
    initialTens: 3,
    initialOnes: 12, // 27 + 15 = 42
    requireRegrouping: true,
    storyPrompt: 'Gabungkan 27 + 15! Kamu punya 3 puluhan dan 12 satuan. Tukar 10 satuan menjadi 1 puluhan agar menjadi 42!',
    englishStoryPrompt: 'Add 27 + 15! You have 3 tens and 12 ones. Regroup 10 ones into 1 ten to get 42!',
  },
];

export const PlaceValueBlocksGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [levelIdx, setLevelIdx] = useState<number>(0);
  const [hundreds, setHundreds] = useState<number>(0);
  const [tens, setTens] = useState<number>(0);
  const [ones, setOnes] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);
  const [regroupAnimation, setRegroupAnimation] = useState<boolean>(false);

  const currentCh = CHALLENGES[levelIdx];

  const initChallenge = (idx: number = levelIdx) => {
    const ch = CHALLENGES[idx];
    setHundreds(ch.initialHundreds || 0);
    setTens(ch.initialTens || 0);
    setOnes(ch.initialOnes || 0);
    setIsSuccess(false);
    setFeedback('');

    const voice = isEnglish ? ch.englishStoryPrompt : ch.storyPrompt;
    sound.speak(voice);
  };

  useEffect(() => {
    initChallenge(levelIdx);
  }, [levelIdx, isEnglish]);

  // Current Total
  const currentTotal = hundreds * 100 + tens * 10 + ones;

  // Regrouping: 10 Ones -> 1 Ten
  const handleRegroupOnesToTen = () => {
    if (ones < 10) return;
    sound.playCoin();
    setRegroupAnimation(true);
    setTimeout(() => setRegroupAnimation(false), 800);

    setOnes((prev) => prev - 10);
    setTens((prev) => prev + 1);

    const msg = isEnglish
      ? '✨ Magic! 10 unit cubes merged into 1 ten rod!'
      : '✨ Ajaib! 10 kubus satuan bersatu menjadi 1 batang puluhan!';
    setFeedback(msg);
    sound.speak(isEnglish ? 'Ten ones regrouped into one ten!' : 'Sepuluh satuan berubah menjadi satu puluhan!');
  };

  // Regrouping: 10 Tens -> 1 Hundred
  const handleRegroupTensToHundred = () => {
    if (tens < 10) return;
    sound.playCoin();
    setRegroupAnimation(true);
    setTimeout(() => setRegroupAnimation(false), 800);

    setTens((prev) => prev - 10);
    setHundreds((prev) => prev + 1);

    const msg = isEnglish
      ? '✨ Super! 10 ten rods merged into 1 hundred flat!'
      : '✨ Hebat! 10 batang puluhan bersatu menjadi 1 lempeng ratusan!';
    setFeedback(msg);
    sound.speak(isEnglish ? 'Ten tens regrouped into one hundred!' : 'Sepuluh puluhan menjadi satu ratusan!');
  };

  const handleVerify = () => {
    const isTarget = currentTotal === currentCh.targetNumber;
    const isRegrouped = ones < 10; // Must not have loose 10+ ones in standard place value

    if (isTarget && isRegrouped) {
      sound.playCorrect();
      sound.playFanfare();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      setScore((s) => s + 40);
      setIsSuccess(true);

      const winMsg = isEnglish
        ? `Brilliant! You built ${currentCh.targetNumber} (${hundreds * 100} + ${tens * 10} + ${ones})!`
        : `Luar biasa! Kamu berhasil membangun ${currentCh.targetNumber} (${hundreds > 0 ? hundreds * 100 + ' + ' : ''}${tens * 10} + ${ones})!`;
      setFeedback(winMsg);
      sound.speak(winMsg);
    } else {
      sound.playRetry();
      let hint = '';
      if (ones >= 10) {
        hint = isEnglish
          ? 'You have 10 or more loose ones! Tap "Regroup 10 Ones" button first!'
          : 'Ada 10 atau lebih kubus satuan yang belum rapi! Sentuh tombol "Tukar 10 Satuan" dulu ya!';
      } else if (currentTotal < currentCh.targetNumber) {
        hint = isEnglish
          ? `Current value is ${currentTotal}. We need ${currentCh.targetNumber} (+${currentCh.targetNumber - currentTotal} more)!`
          : `Nilai saat ini ${currentTotal}. Target kita adalah ${currentCh.targetNumber} (kurang ${currentCh.targetNumber - currentTotal})!`;
      } else {
        hint = isEnglish
          ? `Current value is ${currentTotal}. That is too much (excess of ${currentTotal - currentCh.targetNumber})!`
          : `Nilai saat ini ${currentTotal}. Beban berlebih ${currentTotal - currentCh.targetNumber}!`;
      }
      setFeedback(hint);
      sound.speak(hint);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (levelIdx < CHALLENGES.length - 1) {
      setLevelIdx((p) => p + 1);
    } else {
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90 });
      onComplete(score + 50, 3);
    }
  };

  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isEnglish ? currentCh.englishTitle : currentCh.title}
              </h2>
              <span className="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Tantangan {levelIdx + 1}/{CHALLENGES.length}
              </span>
            </div>
            <p className="text-xs text-amber-100 font-semibold">
              {isEnglish ? 'Cambridge Base-10 & Regrouping Lab' : 'Laboratorium Blok Nilai Tempat (Dienes Blocks)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setIsEnglish(!isEnglish);
            }}
            className="px-2.5 py-1 rounded-xl bg-white/25 hover:bg-white/35 text-xs font-black flex items-center gap-1 transition-all"
            title="Ganti Bahasa"
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

      {/* 2. Challenge Mission Prompt */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="bg-amber-50 rounded-2xl p-3.5 border-2 border-amber-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl bg-white p-2 rounded-2xl shadow-xs border border-amber-200">
              🪵
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                  Target Bilangan:
                </span>
                <span className="bg-amber-500 text-white text-base font-black px-3 py-0.5 rounded-full shadow-xs">
                  {currentCh.targetNumber}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 leading-snug">
                {isEnglish ? currentCh.englishStoryPrompt : currentCh.storyPrompt}
              </p>
            </div>
          </div>

          <button
            onClick={() => sound.speak(isEnglish ? currentCh.englishStoryPrompt : currentCh.storyPrompt)}
            className="p-2 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-amber-900 flex-shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Place Value Counting Mat (3 Columns: Hundreds, Tens, Ones) */}
        <div className="bg-gradient-to-b from-slate-50 to-amber-50/40 rounded-3xl p-3 sm:p-4 border-2 border-slate-200">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 min-h-[220px]">
            {/* COLUMN 1: RATUSAN (HUNDREDS) */}
            <div
              className={`rounded-2xl border-2 p-2 sm:p-3 flex flex-col justify-between transition-colors ${
                currentCh.allowHundreds ? 'bg-indigo-50/60 border-indigo-200' : 'bg-slate-100 border-dashed border-slate-300 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-1 border-b border-indigo-200">
                  <span className="text-[11px] font-black text-indigo-900 uppercase">
                    {isEnglish ? 'Hundreds (100)' : 'Ratusan (100)'}
                  </span>
                  <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                    {hundreds}
                  </span>
                </div>

                {/* Blocks container */}
                <div className="py-2 flex flex-wrap gap-1.5 justify-center min-h-[90px] items-center">
                  {Array.from({ length: hundreds }).map((_, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        sound.playClick();
                        setHundreds((h) => Math.max(0, h - 1));
                      }}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-indigo-500 border-2 border-indigo-700 shadow-md flex items-center justify-center text-white text-[10px] font-black cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                      title="Sentuh untuk menghapus 1 ratusan"
                    >
                      100
                    </div>
                  ))}
                  {hundreds === 0 && (
                    <span className="text-[10px] text-slate-400 font-bold italic">Kosong</span>
                  )}
                </div>
              </div>

              {/* Controls */}
              {currentCh.allowHundreds && (
                <div className="flex items-center gap-1 pt-2 border-t border-indigo-100">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setHundreds((h) => Math.max(0, h - 1));
                    }}
                    disabled={hundreds === 0}
                    className="flex-1 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-black text-xs disabled:opacity-30"
                  >
                    -100
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setHundreds((h) => h + 1);
                    }}
                    className="flex-1 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs"
                  >
                    +100
                  </button>
                </div>
              )}
            </div>

            {/* COLUMN 2: PULUHAN (TENS) */}
            <div className="bg-amber-50/70 rounded-2xl border-2 border-amber-300 p-2 sm:p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1 border-b border-amber-200">
                  <span className="text-[11px] font-black text-amber-900 uppercase">
                    {isEnglish ? 'Tens (10)' : 'Puluhan (10)'}
                  </span>
                  <span className="text-xs font-black text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md">
                    {tens} ({tens * 10})
                  </span>
                </div>

                {/* Blocks container */}
                <div className="py-2 flex flex-wrap gap-1.5 justify-center min-h-[90px] items-end">
                  {Array.from({ length: tens }).map((_, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        sound.playClick();
                        setTens((t) => Math.max(0, t - 1));
                      }}
                      className="w-4 h-16 sm:h-20 rounded-md bg-amber-500 border-2 border-amber-700 shadow-sm flex flex-col justify-between items-center py-1 text-white text-[9px] font-black cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                      title="Sentuh untuk menghapus 1 puluhan"
                    >
                      <span>1</span>
                      <span>0</span>
                    </div>
                  ))}
                  {tens === 0 && (
                    <span className="text-[10px] text-slate-400 font-bold italic self-center">Kosong</span>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 pt-2 border-t border-amber-100">
                <button
                  onClick={() => {
                    sound.playClick();
                    setTens((t) => Math.max(0, t - 1));
                  }}
                  disabled={tens === 0}
                  className="flex-1 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-black text-xs disabled:opacity-30"
                >
                  -10
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setTens((t) => t + 1);
                  }}
                  className="flex-1 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs"
                >
                  +10
                </button>
              </div>
            </div>

            {/* COLUMN 3: SATUAN (ONES) */}
            <div className="bg-emerald-50/70 rounded-2xl border-2 border-emerald-300 p-2 sm:p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1 border-b border-emerald-200">
                  <span className="text-[11px] font-black text-emerald-900 uppercase">
                    {isEnglish ? 'Ones (1)' : 'Satuan (1)'}
                  </span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md ${ones >= 10 ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-200 text-emerald-800'}`}>
                    {ones}
                  </span>
                </div>

                {/* Blocks container */}
                <div className="py-2 flex flex-wrap gap-1 justify-center min-h-[90px] items-center content-start">
                  {Array.from({ length: ones }).map((_, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        sound.playClick();
                        setOnes((o) => Math.max(0, o - 1));
                      }}
                      className="w-5 h-5 rounded-md bg-emerald-500 border border-emerald-700 shadow-xs flex items-center justify-center text-white text-[10px] font-black cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                      title="Sentuh untuk menghapus 1 satuan"
                    >
                      1
                    </div>
                  ))}
                  {ones === 0 && (
                    <span className="text-[10px] text-slate-400 font-bold italic self-center">Kosong</span>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 pt-2 border-t border-emerald-100">
                <button
                  onClick={() => {
                    sound.playClick();
                    setOnes((o) => Math.max(0, o - 1));
                  }}
                  disabled={ones === 0}
                  className="flex-1 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-black text-xs disabled:opacity-30"
                >
                  -1
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setOnes((o) => o + 1);
                  }}
                  className="flex-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs"
                >
                  +1
                </button>
              </div>
            </div>
          </div>

          {/* 4. Magic Regrouping Action Bar (When >= 10 Ones) */}
          {ones >= 10 && (
            <div className="mt-3 p-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg animate-bounce">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-200" />
                <span className="text-xs sm:text-sm font-black">
                  {isEnglish ? '10 Units Ready to Regroup!' : '10 Satuan Siap Ditukar Jadi 1 Batang Puluhan!'}
                </span>
              </div>
              <button
                onClick={handleRegroupOnesToTen}
                className="px-4 py-1.5 rounded-xl bg-white text-orange-700 font-black text-xs shadow-md hover:bg-amber-50 cursor-pointer active:scale-95 transition-transform"
              >
                ✨ {isEnglish ? 'Regroup 10 Ones ➔ 1 Ten' : 'Tukar 10 Satuan ➔ 1 Puluhan!'}
              </button>
            </div>
          )}

          {/* Realtime Expanded Form Summary */}
          <div className="mt-3 flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-black">
            <span className="text-slate-500">
              {isEnglish ? 'Current Value (Expanded Form):' : 'Bentuk Panjang (Expanded Form):'}
            </span>
            <div className="flex items-center gap-1.5 text-sm sm:text-base">
              {hundreds > 0 && <span className="text-indigo-600">{hundreds * 100} +</span>}
              <span className="text-amber-600">{tens * 10} +</span>
              <span className="text-emerald-600">{ones}</span>
              <span className="text-slate-400">=</span>
              <span className="text-rose-600 text-lg font-black">{currentTotal}</span>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Layers className="w-5 h-5 text-amber-600" />}
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* 5. Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={() => initChallenge()}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEnglish ? 'Reset Blocks' : 'Ulangi Balok'}</span>
        </button>

        {!isSuccess ? (
          <button
            onClick={handleVerify}
            className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <span>{isEnglish ? 'Verify Value' : 'Cek Nilai Tempat'} 🧱</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <span>{levelIdx < CHALLENGES.length - 1 ? (isEnglish ? 'Next Challenge' : 'Tantangan Berikutnya') : (isEnglish ? 'Master Builder!' : 'Selesai & Ambil Hadiah!')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
