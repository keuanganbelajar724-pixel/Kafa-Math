import React, { useState } from 'react';
import { sound } from '../../services/sound';
import { Compass, Ship, Anchor, Wind, Trophy, Sparkles, X, RotateCcw, Crosshair } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface SeaVoyageMission {
  islandName: string;
  seaRegion: string;
  story: string;
  shipEmoji: string;
  obstacleEmoji: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export const PirateSeaVoyageGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [selectedGrade, setSelectedGrade] = useState<'sd_1_2' | 'sd_3_4' | 'sd_5_6'>('sd_3_4');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'victory'>('menu');
  const [currentVoyage, setCurrentVoyage] = useState<number>(1);
  const [shipHP, setShipHP] = useState<number>(3);
  const [goldCoins, setGoldCoins] = useState<number>(0);
  const [cannonBalls, setCannonBalls] = useState<number>(5);
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const generateMissions = (grade: 'sd_1_2' | 'sd_3_4' | 'sd_5_6'): SeaVoyageMission[] => {
    if (grade === 'sd_1_2') {
      return [
        {
          islandName: 'Pulau Kelapa Gading',
          seaRegion: 'Teluk Jakarta',
          story: 'Kapal Pinisi mendekati pulau karang. Hitung jumlah peti perbekalan di geladak kapal!',
          shipEmoji: '⛵',
          obstacleEmoji: '🐙 Gurita Raksasa',
          question: 'Di kapal ada 12 peti buah kelapa dan 9 peti air bersih. Berapa total peti perbekalan?',
          options: ['19', '20', '21', '22'],
          correct: '21',
          explanation: '12 + 9 = 21 peti diangkut dengan aman.',
        },
        {
          islandName: 'Selat Lumba-Lumba',
          seaRegion: 'Laut Jawa',
          story: 'Kawanan lumba-lumba melompat gembira memberi petunjuk arah.',
          shipEmoji: '⛵',
          obstacleEmoji: '🐬 Lumba-Lumba Ceria',
          question: 'Nakhoda melihat 35 burung camar di tiang layar. Terbang pergi 14 ekor. Berapa burung yang tersisa?',
          options: ['19', '20', '21', '22'],
          correct: '21',
          explanation: '35 - 14 = 21 burung camar.',
        },
        {
          islandName: 'Kepulauan Rempah Nusantara',
          seaRegion: 'Banda Neira',
          story: 'Beli rempah-rempah pala dan cengkih di pelabuhan tua!',
          shipEmoji: '⛵',
          obstacleEmoji: '⚓ Pelabuhan Banda',
          question: 'Harga sekantong pala Rp3.000. Kamu membeli 2 kantong pala. Berapa uang yang harus dibayar?',
          options: ['Rp4.000', 'Rp5.000', 'Rp6.000', 'Rp7.000'],
          correct: 'Rp6.000',
          explanation: '2 × Rp3.000 = Rp6.000.',
        },
        {
          islandName: 'Batu Karang Hiu Putih',
          seaRegion: 'Selat Sunda',
          story: 'Meriam kapal siap ditembakkan untuk memecah karang penghalang!',
          shipEmoji: '⛵',
          obstacleEmoji: '🦈 Hiu Penjaga Karang',
          question: 'Tembakkan meriam pada jarak tepat: Ada 3 baris meriam, tiap baris ada 4 meriam. Berapa total meriam?',
          options: ['7', '10', '12', '14'],
          correct: '12',
          explanation: '3 baris × 4 meriam = 12 tembakan meriam akurat!',
        },
      ];
    } else if (grade === 'sd_3_4') {
      return [
        {
          islandName: 'Selat Karang Berbisik',
          seaRegion: 'Kepulauan Seribu',
          story: 'Kapal bajak laut musuh mengepung dari arah barat!',
          shipEmoji: '⛵',
          obstacleEmoji: '🏴‍☠️ Kapal Bajak Laut',
          question: 'Meriam kapal butuh 8 barel mesiu per tembakan. Untuk 7 kali tembakan, berapa barel mesiu diperlukan?',
          options: ['48', '54', '56', '64'],
          correct: '56',
          explanation: '7 × 8 = 56 barel mesiu melumpuhkan kapal musuh!',
        },
        {
          islandName: 'Karang Pecahan Senilai',
          seaRegion: 'Selat Makassar',
          story: 'Bentangkan layar sesuai pecahan angin agar kapal melaju dua kali lebih kencang!',
          shipEmoji: '⛵',
          obstacleEmoji: '💨 Pusaran Angin',
          question: 'Layar kapal dibuka seluas 2/3 bagian. Manakah pecahan yang senilai dengan 2/3?',
          options: ['4/6', '4/9', '3/6', '6/12'],
          correct: '4/6',
          explanation: '2/3 = (2×2)/(3×2) = 4/6.',
        },
        {
          islandName: 'Gua Karang Harta Emas',
          seaRegion: 'Laut Flores',
          story: 'Temukan peti emas terkubur di bawah koordinat pulau!',
          shipEmoji: '⛵',
          obstacleEmoji: '💎 Peti Emas Terkubur',
          question: 'Sebuah pulau harta karun berbentuk persegi dengan sisi 25 meter. Berapa keliling pulau tersebut?',
          options: ['50 m', '75 m', '100 m', '125 m'],
          correct: '100 m',
          explanation: 'Keliling persegi = 4 × sisi = 4 × 25 m = 100 meter.',
        },
        {
          islandName: 'Samudra Raja Ampat',
          seaRegion: 'Papua Barat',
          story: 'Bos Kraken Laut Dalam muncul di pusaran air biru kristal!',
          shipEmoji: '⛵',
          obstacleEmoji: '🦑 Kraken Samudra Biru',
          question: 'Tembakan Pamungkas Kraken: Hitung (60 : 6) × 9 = ?',
          options: ['70', '80', '90', '100'],
          correct: '90',
          explanation: '60 : 6 = 10, lalu 10 × 9 = 90! Kraken menyelam kembali ke palung laut!',
        },
      ];
    } else {
      // Kelas 5-6
      return [
        {
          islandName: 'Navigasi Kecepatan Kapal',
          seaRegion: 'Samudra Hindia',
          story: 'Hitung waktu tempuh pelayaran sebelum badai tropis menerjang!',
          shipEmoji: '⛵',
          obstacleEmoji: '⚡ Badai Tropis',
          question: 'Kapal berlayar menempuh jarak 180 km dengan kecepatan 60 km/jam. Berapa jam waktu yang dibutuhkan?',
          options: ['2 jam', '2,5 jam', '3 jam', '4 jam'],
          correct: '3 jam',
          explanation: 'Waktu = Jarak / Kecepatan = 180 km / 60 km/jam = 3 jam.',
        },
        {
          islandName: 'Pulau Diskon Bandar Niaga',
          seaRegion: 'Pelabuhan Sunda Kelapa',
          story: 'Tukarkan mutiara laut dengan perlengkapan navigasi canggih!',
          shipEmoji: '⛵',
          obstacleEmoji: '💰 Saudagar Mutiara',
          question: 'Kompas emas seharga Rp200.000 mendapat potongan diskon 30%. Berapa harga yang harus dibayar?',
          options: ['Rp120.000', 'Rp140.000', 'Rp150.000', 'Rp160.000'],
          correct: 'Rp140.000',
          explanation: 'Diskon 30% × 200.000 = 60.000. Harga bayar = 200.000 - 60.000 = Rp140.000.',
        },
        {
          islandName: 'Koordinat Palung Laut Mariana',
          seaRegion: 'Laut Pasifik',
          story: 'Tentukan perbandingan volume tangki air kapal selam eksplorasi!',
          shipEmoji: '⛵',
          obstacleEmoji: '🌊 Arus Palung Dalam',
          question: 'Sebuah tangki air kapal berbentuk balok berukuran 4 m × 2 m × 1,5 m. Berapa volume air di tangki?',
          options: ['8 m³', '10 m³', '12 m³', '14 m³'],
          correct: '12 m³',
          explanation: 'Volume = p × l × t = 4 × 2 × 1,5 = 12 m³.',
        },
        {
          islandName: 'Benteng Penguasa Tujuh Samudra',
          seaRegion: 'Pusaran Segitiga Misteri',
          story: 'Bos Monster Leviathan Penjaga Samudra menghadang kapal!',
          shipEmoji: '⛵',
          obstacleEmoji: '🐉 Leviathan Samudra',
          question: 'Serangan Pamungkas: Selesaikan 3,25 + (1/2) - 0,75 = ?',
          options: ['2,5', '2,75', '3,0', '3,25'],
          correct: '3,0',
          explanation: '3,25 + 0,5 = 3,75. Lalu 3,75 - 0,75 = 3,0! Samudra tenang dan damai kembali!',
        },
      ];
    }
  };

  const [missions, setMissions] = useState<SeaVoyageMission[]>(() => generateMissions('sd_3_4'));

  const handleStartGame = (grade: 'sd_1_2' | 'sd_3_4' | 'sd_5_6') => {
    sound.playClick();
    setSelectedGrade(grade);
    setMissions(generateMissions(grade));
    setCurrentVoyage(1);
    setShipHP(3);
    setGoldCoins(0);
    setCannonBalls(5);
    setFeedback(null);
    setGameState('playing');
    sound.speak('Angkat jangkar! Berlayar menaklukkan samudra Nusantara!');
  };

  const currentMission = missions[currentVoyage - 1];

  const handleFireCannon = (opt: string) => {
    if (feedback !== null) return;

    if (opt === currentMission.correct) {
      sound.playCorrect();
      setIsShooting(true);
      setTimeout(() => setIsShooting(false), 500);

      setGoldCoins((g) => g + 30);
      setFeedback({
        isCorrect: true,
        text: `Tembakan Tepat Sasaran! 🎯 ${currentMission.explanation}`,
      });

      setTimeout(() => {
        setFeedback(null);
        if (currentVoyage < missions.length) {
          setCurrentVoyage((v) => v + 1);
        } else {
          sound.playFanfare();
          confetti({ particleCount: 75, spread: 70 });
          setGameState('victory');
        }
      }, 1800);
    } else {
      sound.playRetry();
      const newHP = shipHP - 1;
      setShipHP(newHP);

      setFeedback({
        isCorrect: false,
        text: `Tembakan Meleset! Kapal terkena benturan! ${currentMission.explanation}`,
      });

      if (newHP <= 0) {
        setTimeout(() => setGameState('gameover'), 1500);
      } else {
        setTimeout(() => setFeedback(null), 2000);
      }
    }
  };

  return (
    <div className="bg-sky-950 rounded-3xl overflow-hidden border-4 border-cyan-400 shadow-2xl text-white font-sans max-h-[92vh] flex flex-col">
      {/* Header */}
      <div className="bg-sky-900/90 px-4 py-3 border-b border-sky-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-lg">
            ⛵
          </div>
          <div>
            <h3 className="font-black text-sm text-cyan-300">Petualangan Bajak Laut Samudra</h3>
            <p className="text-[10px] text-sky-300 font-semibold">Pelayaran Kapal Nusantara</p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <div className="bg-sky-800/80 px-2 py-1 rounded-xl border border-sky-600 flex items-center gap-1">
              <span>🛡️ Lambung:</span>
              <span className="text-yellow-300">{shipHP}/3</span>
            </div>
            <div className="bg-yellow-400 text-slate-900 font-black px-2.5 py-1 rounded-xl">
              💰 {goldCoins} Koin
            </div>
          </div>
        )}

        <button onClick={onExit} className="w-7 h-7 rounded-full bg-sky-800 hover:bg-sky-700 text-sky-200 flex items-center justify-center cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* MENU */}
      {gameState === 'menu' && (
        <div className="p-6 text-center space-y-5 my-auto max-w-lg mx-auto">
          <div className="text-6xl animate-bounce">⛵🌊</div>
          <div>
            <h2 className="text-2xl font-black text-cyan-300">Arungi 7 Samudra Nusantara</h2>
            <p className="text-xs text-sky-200 mt-1 max-w-md mx-auto">
              Nakhodai kapal Pinisi melewati pusaran air, serang monster laut dengan meriam matematika, dan kumpulkan peti harta karun!
            </p>
          </div>

          <div className="space-y-2 pt-2 text-left">
            <span className="text-[11px] uppercase tracking-wider font-bold text-sky-300 block">
              Pilih Rute Pelayaran:
            </span>
            {[
              { id: 'sd_1_2', label: 'SD Kelas 1 - 2 (Rute Teluk Tenang)', desc: 'Penjumlahan Perbekalan, Pengurangan Camar & Uang Logam', icon: '🐬' },
              { id: 'sd_3_4', label: 'SD Kelas 3 - 4 (Rute Selat Karang)', desc: 'Perkalian Meriam, Pecahan Angin & Keliling Pulau', icon: '⛵' },
              { id: 'sd_5_6', label: 'SD Kelas 5 - 6 (Rute Samudra Dalam)', desc: 'Kecepatan Kapal, Diskon Niaga & Volume Tangki Air', icon: '🦑' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => handleStartGame(r.id as any)}
                className="w-full p-3.5 rounded-2xl bg-sky-900 hover:bg-sky-800 border-2 border-sky-700 hover:border-cyan-400 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-125 transition-transform">{r.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-300">{r.label}</h4>
                    <p className="text-[11px] text-sky-300">{r.desc}</p>
                  </div>
                </div>
                <Compass className="w-5 h-5 text-sky-400 group-hover:rotate-45 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PLAYING */}
      {gameState === 'playing' && currentMission && (
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-sky-900 via-blue-900 to-sky-950 overflow-y-auto">
          {/* Top Voyage Progress */}
          <div className="flex justify-between items-center bg-sky-950/60 p-2.5 rounded-2xl border border-sky-700/50 mb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-bold text-cyan-200">
                {currentMission.seaRegion} • {currentMission.islandName}
              </span>
            </div>
            <span className="text-xs font-black text-amber-300">
              Misi {currentVoyage} / {missions.length}
            </span>
          </div>

          {/* Sea Battle Arena Animation */}
          <div className="h-36 sm:h-44 bg-gradient-to-b from-sky-800 to-blue-950 rounded-2xl border border-sky-600/60 flex items-center justify-around p-4 relative overflow-hidden my-2 shadow-inner">
            {/* Sea waves animation */}
            <div className="absolute inset-x-0 bottom-0 h-8 bg-blue-600/30 flex items-center justify-around text-xs opacity-70 animate-pulse">
              〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️
            </div>

            {/* Player Ship */}
            <div className={`text-center transition-transform duration-300 ${isShooting ? 'translate-x-6 scale-110' : ''}`}>
              <div className="text-5xl sm:text-6xl animate-bounce" style={{ animationDuration: '2s' }}>
                ⛵
              </div>
              <span className="text-[10px] font-bold bg-sky-950/80 px-2 py-0.5 rounded-md text-cyan-200 border border-sky-600 block mt-1">
                Kapal Pinisi Kita
              </span>
            </div>

            {/* Cannonball Flight */}
            {isShooting && (
              <div className="text-2xl animate-ping text-yellow-400 font-black">
                💣 ➔ 💥
              </div>
            )}

            {/* Monster / Obstacle */}
            <div className="text-center">
              <div className="text-5xl sm:text-6xl animate-pulse">
                {currentMission.obstacleEmoji.split(' ')[0]}
              </div>
              <span className="text-[10px] font-bold bg-red-950/80 px-2 py-0.5 rounded-md text-red-200 border border-red-700 block mt-1">
                {currentMission.obstacleEmoji}
              </span>
            </div>
          </div>

          {/* Story & Question Box */}
          <div className="bg-sky-900/90 rounded-2xl p-4 border border-cyan-400/40 my-2">
            <p className="text-xs text-sky-200 italic mb-1.5">"{currentMission.story}"</p>
            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              {currentMission.question}
            </p>
          </div>

          {/* Cannon Options */}
          <div className="grid grid-cols-2 gap-2.5">
            {currentMission.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleFireCannon(opt)}
                disabled={feedback !== null}
                className="p-3.5 bg-sky-800 hover:bg-cyan-600/30 active:bg-cyan-600/40 border-2 border-sky-600 hover:border-cyan-300 rounded-2xl font-bold text-sm sm:text-base text-white text-center cursor-pointer transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Crosshair className="w-4 h-4 text-cyan-300" />
                <span>{opt}</span>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-2.5 p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                feedback.isCorrect ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-red-950 border-red-500 text-red-200'
              }`}
            >
              <span>{feedback.isCorrect ? '🎯' : '💥'}</span>
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      )}

      {/* GAME OVER */}
      {gameState === 'gameover' && (
        <div className="p-6 text-center space-y-4 my-auto max-w-md mx-auto">
          <div className="text-5xl animate-bounce">🌊🚢</div>
          <h2 className="text-xl font-black text-red-300">Kapal Perlu Diperbaiki!</h2>
          <p className="text-xs text-sky-200">
            Gelombang ombak dan meriam monster terlalu kuat. Beristirahat di pelabuhan dan coba lagi!
          </p>
          <button
            onClick={() => handleStartGame(selectedGrade)}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-500 text-sky-950 font-bold rounded-2xl text-xs cursor-pointer shadow flex items-center gap-1.5 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Berlayar Lagi
          </button>
        </div>
      )}

      {/* VICTORY */}
      {gameState === 'victory' && (
        <div className="p-6 sm:p-8 text-center space-y-4 my-auto max-w-lg mx-auto animate-in zoom-in-95">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
          <h2 className="text-2xl font-black text-cyan-300">Penjelajah Samudra Nusantara! 🏆</h2>
          <p className="text-xs text-sky-100">
            Hebat sekali! Nakhoda berhasil membawa kapal melintasi seluruh rute kepulauan dan mengamankan harta karun laut!
          </p>
          <div className="bg-yellow-400/20 border border-yellow-400 p-3.5 rounded-2xl text-yellow-300 font-black text-sm">
            Total Harta Rampasan: +{goldCoins + 60} XP & Koin Emas!
          </div>
          <button
            onClick={() => onComplete(goldCoins + 60, 3)}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-slate-950 font-black rounded-2xl shadow-xl cursor-pointer transition-transform hover:scale-105"
          >
            Bawa Pulang Harta Karun ⛵
          </button>
        </div>
      )}
    </div>
  );
};
