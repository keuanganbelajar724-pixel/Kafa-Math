import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Sparkles, Heart, Key, Shield, Sword, Trophy, ArrowRight, RotateCcw, X, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface RoomChallenge {
  roomName: string;
  roomDesc: string;
  icon: string;
  bgGradient: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  monsterName?: string;
  monsterIcon?: string;
  monsterHP?: number;
}

export const TempleEscapeGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [selectedGrade, setSelectedGrade] = useState<'sd_1_2' | 'sd_3_4' | 'sd_5_6'>('sd_3_4');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'victory'>('menu');
  const [currentChamber, setCurrentChamber] = useState<number>(1);
  const [hearts, setHearts] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [keysFound, setKeysFound] = useState<number>(0);
  const [relics, setRelics] = useState<string[]>([]);
  const [bossHP, setBossHP] = useState<number>(3);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);

  // Generate dynamic challenges based on grade
  const generateChallenges = (grade: 'sd_1_2' | 'sd_3_4' | 'sd_5_6'): RoomChallenge[] => {
    if (grade === 'sd_1_2') {
      return [
        {
          roomName: 'Ruang 1: Gerbang Relief Candi',
          roomDesc: 'Pintu batu terkunci rapat. Hitung jumlah ukiran batu untuk membuka segel!',
          icon: '🗿',
          bgGradient: 'from-amber-700 to-stone-900',
          question: 'Untuk menyusun anak tangga candi, ada 15 batu hitam dan 13 batu putih. Berapa total batu?',
          options: ['25', '27', '28', '29'],
          correct: '28',
          explanation: '15 + 13 = 28 batu candi.',
        },
        {
          roomName: 'Ruang 2: Peti Rahasia Emas',
          roomDesc: 'Kamu menemukan peti emas kuno! Pecahkan kodenya untuk mengambil kunci emas.',
          icon: '📦',
          bgGradient: 'from-yellow-700 to-stone-900',
          question: 'Koleksi koin kuno ada 45 keping. Sebanyak 18 keping disimpan di museum. Berapa sisa koin di peti?',
          options: ['25', '27', '28', '30'],
          correct: '27',
          explanation: '45 - 18 = 27 koin.',
        },
        {
          roomName: 'Ruang 3: Jembatan Obor Api',
          roomDesc: 'Nyalakan obor dengan kelipatan bilangan yang benar agar jembatan batu terbentang.',
          icon: '🔥',
          bgGradient: 'from-orange-700 to-stone-900',
          question: 'Lengkapi pola obor yang menyala: 5, 10, 15, ..., 25. Angka obor di tengah adalah?',
          options: ['18', '20', '22', '24'],
          correct: '20',
          explanation: 'Pola loncat +5: 5, 10, 15, 20, 25.',
        },
        {
          roomName: 'Ruang 4: Altar Kristal Jam Kuno',
          roomDesc: 'Putar jam matahari di altar untuk memunculkan portal ruang utama.',
          icon: '☀️',
          bgGradient: 'from-cyan-800 to-stone-900',
          question: 'Matahari terbit pukul 06.00 pagi. Petualangan sudah berjalan selama 3 jam. Sekarang pukul berapa?',
          options: ['08.00', '09.00', '10.00', '11.00'],
          correct: '09.00',
          explanation: '06.00 + 3 jam = 09.00 pagi.',
        },
        {
          roomName: 'Ruang 5: Penjaga Raksasa Golem',
          roomDesc: 'Sang Raksasa Batu terbangun! Kalahkan dia dengan serangan matematika pamungkas!',
          icon: '👹',
          bgGradient: 'from-red-800 via-stone-900 to-black',
          monsterName: 'Raksasa Batu Candi',
          monsterIcon: '🗿⚔️',
          monsterHP: 3,
          question: 'Serangan Pamungkas! Ada 4 kotak relik, tiap kotak berisi 5 permata sakti. Berapa total permata?',
          options: ['16', '18', '20', '24'],
          correct: '20',
          explanation: '4 × 5 = 20 permata sakti menghancurkan pertahanan Golem!',
        },
      ];
    } else if (grade === 'sd_3_4') {
      return [
        {
          roomName: 'Ruang 1: Gerbang Segel Perkalian',
          roomDesc: 'Buka segel kuno dengan mengaktifkan roda gerigi perkalian.',
          icon: '⚙️',
          bgGradient: 'from-amber-800 to-stone-900',
          question: 'Ada 7 pilar candi, masing-masing dipasangi 8 lampu kristal. Berapa jumlah kristal semuanya?',
          options: ['48', '54', '56', '63'],
          correct: '56',
          explanation: '7 × 8 = 56 kristal.',
        },
        {
          roomName: 'Ruang 2: Lorong Pecahan Kristal',
          roomDesc: 'Satukan lempengan pecahan batu agar pintu magis terbuka!',
          icon: '💎',
          bgGradient: 'from-indigo-800 to-stone-900',
          question: 'Pecahan manakah yang senilai dengan 3/4?',
          options: ['6/8', '6/10', '9/15', '4/3'],
          correct: '6/8',
          explanation: '3/4 = (3×2)/(4×2) = 6/8.',
        },
        {
          roomName: 'Ruang 3: Ubin Lantai Geometri',
          roomDesc: 'Langkah di atas ubin persegi panjang untuk menghindari jebakan anak panah!',
          icon: '📐',
          bgGradient: 'from-emerald-800 to-stone-900',
          question: 'Lantai lorong memiliki panjang 12 meter dan lebar 6 meter. Berapa luas lantai tersebut?',
          options: ['36 m²', '64 m²', '72 m²', '80 m²'],
          correct: '72 m²',
          explanation: 'Luas = Panjang × Lebar = 12 × 6 = 72 m².',
        },
        {
          roomName: 'Ruang 4: Timbangan Emas Purbakala',
          roomDesc: 'Seimbangkan neraca untuk mendapatkan Kunci Pusaka Emas.',
          icon: '⚖️',
          bgGradient: 'from-yellow-800 to-stone-900',
          question: 'Sebuah kendi berisi 2,5 kg emas. Ditambahkan lagi 1.500 gram emas. Berapa total berat dalam kg?',
          options: ['3,0 kg', '3,5 kg', '4,0 kg', '4,5 kg'],
          correct: '4,0 kg',
          explanation: '1.500 gram = 1,5 kg. Total = 2,5 + 1,5 = 4,0 kg.',
        },
        {
          roomName: 'Ruang 5: Naga Penjaga Relik Kuno',
          roomDesc: 'Naga Purba bangkit dari lava! Lontarkan mantra perhitungan untuk menaklukkannya!',
          icon: '🐲',
          bgGradient: 'from-red-900 via-stone-900 to-black',
          monsterName: 'Naga Penjaga Pusaka',
          monsterIcon: '🐲🔥',
          monsterHP: 3,
          question: 'Serangan Naga! Berapakah hasil dari (45 : 5) × 7?',
          options: ['56', '63', '70', '72'],
          correct: '63',
          explanation: '45 : 5 = 9, lalu 9 × 7 = 63! Naga tunduk pada kehebatanmu!',
        },
      ];
    } else {
      // Kelas 5-6
      return [
        {
          roomName: 'Ruang 1: Pintu Kode KPK & FPB',
          roomDesc: 'Putar dua roda gerigi candi hingga mencapai titik temu faktor persekutuan terbesar!',
          icon: '🏛️',
          bgGradient: 'from-purple-900 to-stone-900',
          question: 'Berapakah FPB (Faktor Persekutuan Terbesar) dari 36 dan 48?',
          options: ['6', '12', '18', '24'],
          correct: '12',
          explanation: 'Faktor 36 = 1,2,3,4,6,9,12,18,36. Faktor 48 = 1,2,3,4,6,8,12,16,24,48. FPB = 12.',
        },
        {
          roomName: 'Ruang 2: Bejana Persen & Diskon Kuno',
          roomDesc: 'Tuang ramuan air suci sesuai perbandingan persentase tepat.',
          icon: '🧪',
          bgGradient: 'from-teal-900 to-stone-900',
          question: 'Harta karun bernilai Rp500.000 dipotong pajak kerajaan 15%. Berapa sisa nilai harta?',
          options: ['Rp400.000', 'Rp425.000', 'Rp450.000', 'Rp475.000'],
          correct: 'Rp425.000',
          explanation: 'Pajak = 15% × 500.000 = 75.000. Sisa = 500.000 - 75.000 = Rp425.000.',
        },
        {
          roomName: 'Ruang 3: Piramida Ruang Tiga Dimensi',
          roomDesc: 'Hitung volume bejana kubus untuk mengaktifkan lift kristal.',
          icon: '📦',
          bgGradient: 'from-blue-900 to-stone-900',
          question: 'Sebuah peti relik berbentuk kubus dengan panjang rusuk 8 cm. Berapa volume peti tersebut?',
          options: ['256 cm³', '384 cm³', '512 cm³', '648 cm³'],
          correct: '512 cm³',
          explanation: 'Volume Kubus = s³ = 8 × 8 × 8 = 512 cm³.',
        },
        {
          roomName: 'Ruang 4: Denah Skala Peta Harta',
          roomDesc: 'Pecahkan skala peta kuno untuk menentukan jalur keluar tanpa jebakan.',
          icon: '🗺️',
          bgGradient: 'from-amber-900 to-stone-900',
          question: 'Jarak di peta 4 cm dengan skala 1 : 250.000. Berapa jarak sebenarnya di dunia nyata?',
          options: ['1 km', '10 km', '25 km', '100 km'],
          correct: '10 km',
          explanation: '4 cm × 250.000 = 1.000.000 cm = 10.000 m = 10 km.',
        },
        {
          roomName: 'Ruang 5: Raja Bayangan Matematika',
          roomDesc: 'Bos Terakhir! Penguasa Kegelapan Candi menghadang jalan pulangmu!',
          icon: '👑',
          bgGradient: 'from-red-950 via-stone-950 to-black',
          monsterName: 'Raja Bayangan Math',
          monsterIcon: '🧙‍♂️⚡',
          monsterHP: 3,
          question: 'Mantra Penakluk: Berapakah hasil dari 2,5 + 3/4 - 1,25?',
          options: ['1,75', '2,00', '2,25', '2,50'],
          correct: '2,00',
          explanation: '2,5 + 0,75 = 3,25. Lalu 3,25 - 1,25 = 2,00! Raja Bayangan lenyap bercahaya!',
        },
      ];
    };
  };

  const [challenges, setChallenges] = useState<RoomChallenge[]>(() => generateChallenges('sd_3_4'));

  const handleStartGame = (grade: 'sd_1_2' | 'sd_3_4' | 'sd_5_6') => {
    sound.playClick();
    setSelectedGrade(grade);
    setChallenges(generateChallenges(grade));
    setCurrentChamber(1);
    setHearts(3);
    setScore(0);
    setKeysFound(0);
    setRelics([]);
    setBossHP(3);
    setFeedback(null);
    setGameState('playing');
    sound.speak('Selamat datang di Ekspedisi Candi Matematika! Pecahkan teka-teki tiap ruangan!');
  };

  const currentChallenge = challenges[currentChamber - 1];

  const handleSelectOption = (opt: string) => {
    if (feedback !== null) return;

    if (opt === currentChallenge.correct) {
      sound.playCorrect();
      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 600);

      const isBoss = currentChamber === 5;
      const newScore = score + (isBoss ? 40 : 20);
      setScore(newScore);
      setKeysFound((k) => k + 1);

      const relicNames = ['💎 Batu Permata Merah', '🔑 Kunci Emas Candi', '📜 Gulungan Kuno', '🏆 Mahkota Prabu', '🌟 Berlian Sakti'];
      if (!relics.includes(relicNames[currentChamber - 1])) {
        setRelics([...relics, relicNames[currentChamber - 1]]);
      }

      setFeedback({
        isCorrect: true,
        text: `Benar! ${currentChallenge.explanation}`,
      });

      setTimeout(() => {
        setFeedback(null);
        if (currentChamber < challenges.length) {
          setCurrentChamber((c) => c + 1);
        } else {
          // Victory!
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
        text: `Kurang tepat! Coba pelajari petunjuknya: ${currentChallenge.explanation}`,
      });

      if (newHearts <= 0) {
        setTimeout(() => {
          setGameState('gameover');
        }, 1500);
      } else {
        setTimeout(() => {
          setFeedback(null);
        }, 2200);
      }
    }
  };

  return (
    <div className="bg-stone-900 rounded-3xl overflow-hidden border-4 border-amber-500 shadow-2xl text-white font-sans max-h-[92vh] flex flex-col">
      {/* Top Bar */}
      <div className="bg-stone-950 px-4 py-3 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg">
            🏛️
          </div>
          <div>
            <h3 className="font-black text-sm text-amber-400">Ekspedisi Candi Matematika</h3>
            <p className="text-[10px] text-stone-400 font-semibold">Petualangan Bawah Tanah RPG</p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-3 text-xs font-bold">
            {/* Hearts */}
            <div className="flex items-center gap-0.5 bg-stone-800/80 px-2 py-1 rounded-xl border border-stone-700">
              {[1, 2, 3].map((h) => (
                <Heart
                  key={h}
                  className={`w-4 h-4 ${h <= hearts ? 'text-red-500 fill-red-500 animate-pulse' : 'text-stone-600'}`}
                />
              ))}
            </div>

            {/* Keys & Score */}
            <div className="flex items-center gap-1 bg-stone-800/80 px-2 py-1 rounded-xl border border-stone-700 text-amber-300">
              <Key className="w-3.5 h-3.5" />
              <span>{keysFound}/5</span>
            </div>

            <div className="bg-amber-500 text-stone-950 font-black px-2.5 py-1 rounded-xl text-xs">
              {score} XP
            </div>
          </div>
        )}

        <button
          onClick={onExit}
          className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* GAME MENU */}
      {gameState === 'menu' && (
        <div className="p-6 text-center space-y-5 my-auto max-w-lg mx-auto">
          <div className="text-6xl animate-bounce">🏛️</div>
          <div>
            <h2 className="text-2xl font-black text-amber-400">Jelajahi Candi Kuno Penuh Rahasia</h2>
            <p className="text-xs text-stone-300 mt-1 max-w-md mx-auto">
              Lewati 5 ruangan candi kuno, kalahkan jebakan & Raksasa Penjaga dengan kecerdasan matematika!
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 block">
              Pilih Tingkat Jenjang Sekolah:
            </span>
            <div className="grid grid-cols-1 gap-2.5 text-left">
              {[
                { id: 'sd_1_2', label: 'SD Kelas 1 - 2 (Fase A)', desc: 'Penjumlahan, Pengurangan, Pola Obor & Jam', icon: '🌱' },
                { id: 'sd_3_4', label: 'SD Kelas 3 - 4 (Fase B)', desc: 'Perkalian Cepat, Pecahan Kristal, Luas Geometri', icon: '⭐' },
                { id: 'sd_5_6', label: 'SD Kelas 5 - 6 (Fase C)', desc: 'FPB/KPK, Diskon Persen, Volume Kubus & Skala', icon: '👑' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => handleStartGame(lvl.id as any)}
                  className="p-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700/90 border-2 border-stone-700 hover:border-amber-500 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-125 transition-transform">{lvl.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-amber-400">{lvl.label}</h4>
                      <p className="text-[11px] text-stone-400">{lvl.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PLAYING SCREEN */}
      {gameState === 'playing' && currentChallenge && (
        <div className={`p-4 sm:p-6 flex-1 flex flex-col justify-between bg-gradient-to-b ${currentChallenge.bgGradient} relative overflow-y-auto`}>
          {/* Chamber Progress Indicator */}
          <div className="flex items-center justify-between gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  num === currentChamber
                    ? 'bg-amber-400 shadow-md shadow-amber-500/50 scale-105'
                    : num < currentChamber
                    ? 'bg-emerald-500'
                    : 'bg-stone-700/60'
                }`}
              />
            ))}
          </div>

          {/* Chamber Visual Scene */}
          <div className="bg-stone-950/70 backdrop-blur-md rounded-2xl p-4 border border-stone-700/60 text-center relative overflow-hidden my-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className={`text-4xl transition-transform duration-300 ${isAttacking ? 'scale-125 rotate-12' : 'animate-pulse'}`}>
                {currentChallenge.monsterIcon || currentChallenge.icon}
              </span>
              <div className="text-left">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Kamar {currentChamber} dari 5
                </span>
                <h4 className="font-black text-sm text-white">{currentChallenge.roomName}</h4>
              </div>
            </div>
            <p className="text-xs text-stone-300 font-medium max-w-md mx-auto">{currentChallenge.roomDesc}</p>
          </div>

          {/* Question Box */}
          <div className="bg-stone-900/90 rounded-2xl p-4 sm:p-5 border-2 border-amber-500/40 my-3 shadow-lg">
            <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
              📜 Teka-Teki Prasasti Candi:
            </span>
            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              {currentChallenge.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {currentChallenge.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                disabled={feedback !== null}
                className="p-3.5 bg-stone-800/90 hover:bg-amber-500/20 active:bg-amber-500/30 border-2 border-stone-700 hover:border-amber-400 rounded-2xl font-bold text-sm sm:text-base text-white text-center cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <span>{['A', 'B', 'C', 'D'][idx]}.</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>

          {/* Feedback Pop-banner */}
          {feedback && (
            <div
              className={`mt-3 p-3 rounded-2xl border flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 ${
                feedback.isCorrect
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-red-950/80 border-red-500 text-red-300'
              }`}
            >
              <span className="text-base">{feedback.isCorrect ? '✨' : '⚠️'}</span>
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      )}

      {/* GAME OVER */}
      {gameState === 'gameover' && (
        <div className="p-6 text-center space-y-4 my-auto max-w-md mx-auto">
          <div className="text-5xl animate-pulse">💔</div>
          <h2 className="text-xl font-black text-red-400">Energi Hatimu Habis!</h2>
          <p className="text-xs text-stone-300">
            Jebakan candi terlalu kuat hari ini. Tapi jangan menyerah, petualang sejati selalu mencoba lagi!
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => handleStartGame(selectedGrade)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-2xl text-xs cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Coba Lagi
            </button>
            <button
              onClick={onExit}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-2xl text-xs cursor-pointer"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>
      )}

      {/* VICTORY SCREEN */}
      {gameState === 'victory' && (
        <div className="p-6 sm:p-8 text-center space-y-4 my-auto max-w-lg mx-auto animate-in zoom-in-95">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
          <h2 className="text-2xl font-black text-amber-400">Ekspedisi Candi Selesai! 🎉</h2>
          <p className="text-xs text-stone-200">
            Luar biasa! Kamu berhasil menaklukkan seluruh ruangan candi dan membawa pulang relik legendaris Nusantara!
          </p>

          {/* Relics bag */}
          <div className="bg-stone-950/80 border border-amber-500/40 p-3.5 rounded-2xl text-left space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">
              🎒 Relik Pusaka yang Ditemukan:
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-300">
              {relics.map((r, i) => (
                <span key={i} className="bg-stone-800 px-2.5 py-1 rounded-xl border border-stone-700">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-amber-500/20 border border-amber-500 p-3 rounded-2xl text-amber-300 font-black text-sm">
            Total Skor: +{score} XP & Koin Emas!
          </div>

          <button
            onClick={() => onComplete(score, 3)}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black rounded-2xl shadow-xl cursor-pointer transition-transform hover:scale-105"
          >
            Klaim Hadiah Petualangan 🏆
          </button>
        </div>
      )}
    </div>
  );
};
