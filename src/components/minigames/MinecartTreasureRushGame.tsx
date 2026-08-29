import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Sparkles, Trophy, RotateCcw, X, Gem, ArrowLeftRight, Flame, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface TrackJunction {
  junctionNumber: number;
  caveSection: string;
  targetDescription: string;
  leftOption: { label: string; value: string; isCorrect: boolean };
  rightOption: { label: string; value: string; isCorrect: boolean };
  explanation: string;
}

export const MinecartTreasureRushGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [selectedGrade, setSelectedGrade] = useState<'sd_1_2' | 'sd_3_4' | 'sd_5_6'>('sd_3_4');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'victory'>('menu');
  const [currentJunction, setCurrentJunction] = useState<number>(1);
  const [hearts, setHearts] = useState<number>(3);
  const [goldNuggets, setGoldNuggets] = useState<number>(0);
  const [cartOffset, setCartOffset] = useState<'center' | 'left' | 'right'>('center');
  const [timeLeft, setTimeLeft] = useState<number>(12); // seconds per junction
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const generateJunctions = (grade: 'sd_1_2' | 'sd_3_4' | 'sd_5_6'): TrackJunction[] => {
    if (grade === 'sd_1_2') {
      return [
        {
          junctionNumber: 1,
          caveSection: 'Lorong Kristal Zamrud',
          targetDescription: 'Pilih rel dengan hasil hitungan sama dengan 16:',
          leftOption: { label: 'Jalur Kiri', value: '9 + 7', isCorrect: true },
          rightOption: { label: 'Jalur Kanan', value: '8 + 6', isCorrect: false },
          explanation: '9 + 7 = 16, sedangkan 8 + 6 = 14.',
        },
        {
          junctionNumber: 2,
          caveSection: 'Gua Safir Berkilau',
          targetDescription: 'Pilih rel dengan hasil hitungan sama dengan 25:',
          leftOption: { label: 'Jalur Kiri', value: '30 - 8', isCorrect: false },
          rightOption: { label: 'Jalur Kanan', value: '32 - 7', isCorrect: true },
          explanation: '32 - 7 = 25, sedangkan 30 - 8 = 22.',
        },
        {
          junctionNumber: 3,
          caveSection: 'Jembatan Rel Bawah Tanah',
          targetDescription: 'Pilih rel yang memiliki angka bilangan GENAP:',
          leftOption: { label: 'Jalur Kiri', value: 'Bilangan 28', isCorrect: true },
          rightOption: { label: 'Jalur Kanan', value: 'Bilangan 31', isCorrect: false },
          explanation: '28 berakhiran angka genap (dapat dibagi 2).',
        },
        {
          junctionNumber: 4,
          caveSection: 'Ruang Kubah Intan Emas',
          targetDescription: 'Pilih rel yang menghasilkan 4 × 4:',
          leftOption: { label: 'Jalur Kiri', value: '14', isCorrect: false },
          rightOption: { label: 'Jalur Kanan', value: '16', isCorrect: true },
          explanation: '4 × 4 = 16 emas murni!',
        },
      ];
    } else if (grade === 'sd_3_4') {
      return [
        {
          junctionNumber: 1,
          caveSection: 'Terowongan Batu Bara',
          targetDescription: 'Pilih rel dengan hasil sama dengan 48:',
          leftOption: { label: 'Jalur Kiri', value: '6 × 8', isCorrect: true },
          rightOption: { label: 'Jalur Kanan', value: '7 × 7', isCorrect: false },
          explanation: '6 × 8 = 48, sedangkan 7 × 7 = 49.',
        },
        {
          junctionNumber: 2,
          caveSection: 'Air Terjun Emas Bawah Tanah',
          targetDescription: 'Pilih pecahan yang senilai dengan 1/2:',
          leftOption: { label: 'Jalur Kiri', value: '3/8', isCorrect: false },
          rightOption: { label: 'Jalur Kanan', value: '5/10', isCorrect: true },
          explanation: '5/10 disederhanakan menjadi 1/2.',
        },
        {
          junctionNumber: 3,
          caveSection: 'Tebing Kristal Amethyst',
          targetDescription: 'Pilih keliling persegi dengan sisi 15 cm:',
          leftOption: { label: 'Jalur Kiri', value: '60 cm', isCorrect: true },
          rightOption: { label: 'Jalur Kanan', value: '45 cm', isCorrect: false },
          explanation: 'Keliling persegi = 4 × 15 = 60 cm.',
        },
        {
          junctionNumber: 4,
          caveSection: 'Ruang Inti Gunung Emas',
          targetDescription: 'Pilih hasil dari (56 : 7) × 6:',
          leftOption: { label: 'Jalur Kiri', value: '42', isCorrect: false },
          rightOption: { label: 'Jalur Kanan', value: '48', isCorrect: true },
          explanation: '56 : 7 = 8, lalu 8 × 6 = 48!',
        },
      ];
    } else {
      // Kelas 5-6
      return [
        {
          junctionNumber: 1,
          caveSection: 'Lorong Vulkanik Purbakala',
          targetDescription: 'Pilih rel dengan FPB dari 30 dan 45:',
          leftOption: { label: 'Jalur Kiri', value: '15', isCorrect: true },
          rightOption: { label: 'Jalur Kanan', value: '10', isCorrect: false },
          explanation: 'Faktor persekutuan terbesar 30 & 45 adalah 15.',
        },
        {
          junctionNumber: 2,
          caveSection: 'Peti Tambang Berlian',
          targetDescription: 'Pilih nilai 20% dari 350:',
          leftOption: { label: 'Jalur Kiri', value: '60', isCorrect: false },
          rightOption: { label: 'Jalur Kanan', value: '70', isCorrect: true },
          explanation: '20% × 350 = (1/5) × 350 = 70.',
        },
        {
          junctionNumber: 3,
          caveSection: 'Rel Gantung Jurang Lava',
          targetDescription: 'Pilih volume kubus dengan rusuk 7 cm:',
          leftOption: { label: 'Jalur Kiri', value: '343 cm³', isCorrect: true },
          rightOption: { label: 'Jalur Kanan', value: '294 cm³', isCorrect: false },
          explanation: 'Volume kubus = 7 × 7 × 7 = 343 cm³.',
        },
        {
          junctionNumber: 4,
          caveSection: 'Pintu Gerbang Keluar Tambang',
          targetDescription: 'Pilih hasil 3,4 + 1/2 - 0,9:',
          leftOption: { label: 'Jalur Kiri', value: '2,8', isCorrect: false },
          rightOption: { label: 'Jalur Kanan', value: '3,0', isCorrect: true },
          explanation: '3,4 + 0,5 = 3,9, lalu 3,9 - 0,9 = 3,0! Kereta meluncur keluar!',
        },
      ];
    }
  };

  const [junctions, setJunctions] = useState<TrackJunction[]>(() => generateJunctions('sd_3_4'));

  const handleStartGame = (grade: 'sd_1_2' | 'sd_3_4' | 'sd_5_6') => {
    sound.playClick();
    setSelectedGrade(grade);
    setJunctions(generateJunctions(grade));
    setCurrentJunction(1);
    setHearts(3);
    setGoldNuggets(0);
    setCartOffset('center');
    setTimeLeft(12);
    setFeedback(null);
    setGameState('playing');
    sound.speak('Kereta tambang melaju cepat! Geser wesel rel ke jalur yang benar!');
  };

  const currentJuncData = junctions[currentJunction - 1];

  // Junction countdown timer
  useEffect(() => {
    if (gameState !== 'playing' || feedback !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired, cart derails
          handleSwitchTrack(false, 'Waktu habis! Kereta menabrak batas rel.');
          return 12;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, feedback, currentJunction]);

  const handleSwitchTrack = (isCorrect: boolean, customMsg?: string) => {
    if (feedback !== null) return;

    if (isCorrect) {
      sound.playCorrect();
      setGoldNuggets((g) => g + 25);
      setFeedback({
        isCorrect: true,
        text: `Jalur Aman! ${currentJuncData.explanation}`,
      });

      setTimeout(() => {
        setFeedback(null);
        setCartOffset('center');
        setTimeLeft(12);
        if (currentJunction < junctions.length) {
          setCurrentJunction((j) => j + 1);
        } else {
          sound.playFanfare();
          confetti({ particleCount: 80, spread: 80 });
          setGameState('victory');
        }
      }, 1800);
    } else {
      sound.playRetry();
      const newHearts = hearts - 1;
      setHearts(newHearts);
      setFeedback({
        isCorrect: false,
        text: customMsg || `Jalur Buntu! ${currentJuncData.explanation}`,
      });

      if (newHearts <= 0) {
        setTimeout(() => setGameState('gameover'), 1500);
      } else {
        setTimeout(() => {
          setFeedback(null);
          setCartOffset('center');
          setTimeLeft(12);
        }, 2000);
      }
    }
  };

  return (
    <div className="bg-amber-950 rounded-3xl overflow-hidden border-4 border-yellow-500 shadow-2xl text-white font-sans max-h-[92vh] flex flex-col">
      {/* Top Bar */}
      <div className="bg-stone-900 px-4 py-3 border-b border-amber-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-lg">
            🛒
          </div>
          <div>
            <h3 className="font-black text-sm text-yellow-400">Kereta Tambang Gua Emas</h3>
            <p className="text-[10px] text-amber-300 font-semibold">Minecart Railway Rush</p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-0.5 bg-stone-800 px-2 py-1 rounded-xl border border-stone-700">
              {[1, 2, 3].map((h) => (
                <Heart key={h} className={`w-4 h-4 ${h <= hearts ? 'text-red-500 fill-red-500' : 'text-stone-700'}`} />
              ))}
            </div>
            <div className="bg-yellow-400 text-stone-950 font-black px-2.5 py-1 rounded-xl">
              🪙 {goldNuggets} Emas
            </div>
          </div>
        )}

        <button onClick={onExit} className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-200 flex items-center justify-center cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* MENU */}
      {gameState === 'menu' && (
        <div className="p-6 text-center space-y-5 my-auto max-w-lg mx-auto">
          <div className="text-6xl animate-bounce">🛒💎✨</div>
          <div>
            <h2 className="text-2xl font-black text-yellow-400">Pacu Kereta di Gua Kristal</h2>
            <p className="text-xs text-amber-200 mt-1 max-w-md mx-auto">
              Kereta melaju kencang di atas rel tambang emas! Geser tuas rel ke jalur yang benar sebelum waktu habis untuk menghindari jalan buntu!
            </p>
          </div>

          <div className="space-y-2 pt-2 text-left">
            <span className="text-[11px] uppercase tracking-wider font-bold text-yellow-400 block">
              Pilih Kecepatan Jalur Tambang:
            </span>
            {[
              { id: 'sd_1_2', label: 'SD Kelas 1 - 2 (Rel Kristal Zamrud)', desc: 'Penjumlahan 1-20, Pengurangan & Bilangan Genap', icon: '💎' },
              { id: 'sd_3_4', label: 'SD Kelas 3 - 4 (Rel Air Terjun Emas)', desc: 'Perkalian 1-10, Pecahan Senilai & Keliling Bangun', icon: '🪙' },
              { id: 'sd_5_6', label: 'SD Kelas 5 - 6 (Rel Jurang Lava Magma)', desc: 'FPB Cepat, Persen 20% & Volume Kubus Tambang', icon: '🔥' },
            ].map((j) => (
              <button
                key={j.id}
                onClick={() => handleStartGame(j.id as any)}
                className="w-full p-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border-2 border-stone-800 hover:border-yellow-400 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-125 transition-transform">{j.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-yellow-400">{j.label}</h4>
                    <p className="text-[11px] text-amber-300">{j.desc}</p>
                  </div>
                </div>
                <ArrowLeftRight className="w-5 h-5 text-stone-500 group-hover:text-yellow-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PLAYING */}
      {gameState === 'playing' && currentJuncData && (
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-stone-900 via-amber-950 to-stone-950 overflow-y-auto">
          {/* Header section & Timer */}
          <div className="bg-stone-900/80 p-2.5 rounded-2xl border border-amber-700/60 flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-amber-200">{currentJuncData.caveSection}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-stone-400">Persimpangan {currentJunction}/{junctions.length}</span>
              <span className={`px-2 py-0.5 rounded-md font-black ${timeLeft <= 4 ? 'bg-red-600 text-white animate-ping' : 'bg-yellow-500 text-stone-950'}`}>
                ⏳ {timeLeft}s
              </span>
            </div>
          </div>

          {/* Mine Railway Arena */}
          <div className="h-40 sm:h-48 bg-stone-950 rounded-3xl border-2 border-yellow-500/40 p-4 relative overflow-hidden flex flex-col justify-between my-2 shadow-inner">
            {/* Split Tracks Visual */}
            <div className="flex justify-between items-center px-6 text-xs font-black">
              <div className="bg-amber-900/60 border border-amber-500/60 px-3 py-1 rounded-xl text-amber-300">
                ⬅️ {currentJuncData.leftOption.label}
              </div>
              <div className="bg-amber-900/60 border border-amber-500/60 px-3 py-1 rounded-xl text-amber-300">
                {currentJuncData.rightOption.label} ➡️
              </div>
            </div>

            {/* Minecart Animation on Tracks */}
            <div className="relative h-16 flex items-center justify-center">
              <div className="absolute inset-x-8 border-b-4 border-dashed border-stone-600 top-1/2 -translate-y-1/2" />

              <div
                className={`text-5xl sm:text-6xl transition-all duration-300 z-10 ${
                  cartOffset === 'left'
                    ? '-translate-x-24 -rotate-12'
                    : cartOffset === 'right'
                    ? 'translate-x-24 rotate-12'
                    : 'animate-bounce'
                }`}
              >
                🛒
              </div>
            </div>

            <div className="text-center text-[10px] text-amber-300 font-bold">
              Klik pilihan jalur di bawah sebelum kereta menabrak persimpangan!
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-stone-900/90 rounded-2xl p-4 border border-yellow-500/40 my-2">
            <span className="text-[10px] uppercase font-bold text-yellow-400 block mb-1">
              🎯 Target Persimpangan Rel:
            </span>
            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              {currentJuncData.targetDescription}
            </p>
          </div>

          {/* Two Split Track Decision Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setCartOffset('left');
                handleSwitchTrack(currentJuncData.leftOption.isCorrect);
              }}
              disabled={feedback !== null}
              className="p-4 bg-gradient-to-r from-amber-900 to-stone-900 hover:from-amber-800 hover:to-stone-800 border-2 border-amber-600 hover:border-yellow-400 rounded-2xl font-bold text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95"
            >
              <span className="text-xs text-amber-300 font-black">⬅️ JALUR KIRI</span>
              <span className="text-base sm:text-lg font-black text-white">{currentJuncData.leftOption.value}</span>
            </button>

            <button
              onClick={() => {
                setCartOffset('right');
                handleSwitchTrack(currentJuncData.rightOption.isCorrect);
              }}
              disabled={feedback !== null}
              className="p-4 bg-gradient-to-r from-stone-900 to-amber-900 hover:from-stone-800 hover:to-amber-800 border-2 border-amber-600 hover:border-yellow-400 rounded-2xl font-bold text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95"
            >
              <span className="text-xs text-amber-300 font-black">JALUR KANAN ➡️</span>
              <span className="text-base sm:text-lg font-black text-white">{currentJuncData.rightOption.value}</span>
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-2.5 p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                feedback.isCorrect ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-red-950 border-red-500 text-red-200'
              }`}
            >
              <span>{feedback.isCorrect ? '💎' : '💥'}</span>
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      )}

      {/* GAME OVER */}
      {gameState === 'gameover' && (
        <div className="p-6 text-center space-y-4 my-auto max-w-md mx-auto">
          <div className="text-5xl animate-bounce">🛒💥</div>
          <h2 className="text-xl font-black text-red-400">Kereta Anjlok Keluar Rel!</h2>
          <p className="text-xs text-amber-200">
            Jalur yang kamu pilih menabrak dinding batu gua. Letakkan kembali kereta di atas rel dan coba lagi!
          </p>
          <button
            onClick={() => handleStartGame(selectedGrade)}
            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-bold rounded-2xl text-xs cursor-pointer shadow flex items-center gap-1.5 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Tarik Kereta Lagi
          </button>
        </div>
      )}

      {/* VICTORY */}
      {gameState === 'victory' && (
        <div className="p-6 sm:p-8 text-center space-y-4 my-auto max-w-lg mx-auto animate-in zoom-in-95">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
          <h2 className="text-2xl font-black text-yellow-400">Kereta Tiba di Gudang Emas! 🏆</h2>
          <p className="text-xs text-amber-100">
            Luar biasa! Seluruh persimpangan rel berhasil kamu lewati tanpa celaka dengan kecepatan hitungan super tepat!
          </p>
          <div className="bg-yellow-400/20 border border-yellow-400 p-3.5 rounded-2xl text-yellow-300 font-black text-sm">
            Hasil Tambang Emas: +{goldNuggets + 50} XP & 35 Koin Emas!
          </div>
          <button
            onClick={() => onComplete(goldNuggets + 50, 3)}
            className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-stone-950 font-black rounded-2xl shadow-xl cursor-pointer transition-transform hover:scale-105"
          >
            Bawa Pulang Gerbong Emas 🛒
          </button>
        </div>
      )}
    </div>
  );
};
