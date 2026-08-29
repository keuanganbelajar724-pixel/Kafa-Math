import React, { useState } from 'react';
import { sound } from '../../services/sound';
import { Trees, Sparkles, Heart, Trophy, RotateCcw, X, Footprints, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface RescueStation {
  animalName: string;
  animalEmoji: string;
  habitat: string;
  story: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export const JungleSafariRescueGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [selectedGrade, setSelectedGrade] = useState<'sd_1_2' | 'sd_3_4' | 'sd_5_6'>('sd_1_2');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'victory'>('menu');
  const [currentStation, setCurrentStation] = useState<number>(1);
  const [hearts, setHearts] = useState<number>(3);
  const [animalsSaved, setAnimalsSaved] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const generateStations = (grade: 'sd_1_2' | 'sd_3_4' | 'sd_5_6'): RescueStation[] => {
    if (grade === 'sd_1_2') {
      return [
        {
          animalName: 'Bayi Orangutan Kalimantan',
          animalEmoji: '🦧',
          habitat: 'Taman Nasional Tanjung Puting',
          story: 'Bayi orangutan terpisah di dahan pohon tinggi. Beri dia buah pisang manis!',
          question: 'Penjaga hutan membawa 14 buah pisang, lalu memberi 6 pisang ke orangutan. Berapa pisang tersisa di keranjang?',
          options: ['6', '7', '8', '9'],
          correct: '8',
          explanation: '14 - 6 = 8 buah pisang. Bayi orangutan tersenyum senang!',
        },
        {
          animalName: 'Komodo Cilik',
          animalEmoji: '🦎',
          habitat: 'Pulau Komodo & Rinca',
          story: 'Susun jembatan kayu untuk menyeberangi sarang komodo cilik.',
          question: 'Lengkapi nomor jembatan bambu: 10, 12, 14, ..., 18. Angka yang hilang adalah?',
          options: ['15', '16', '17', '19'],
          correct: '16',
          explanation: 'Pola lompat 2 bilangan genap: 10, 12, 14, 16, 18.',
        },
        {
          animalName: 'Anak Harimau Sumatra',
          animalEmoji: '🐅',
          habitat: 'Hutan Hujan Tropis Leuser',
          story: 'Jejak kaki anak harimau terlihat di lumpur. Hitung jumlah langkahnya!',
          question: 'Ada 7 jejak kaki di dekat sungai dan 8 jejak kaki di dekat gua. Berapa total seluruh jejak kaki?',
          options: ['13', '14', '15', '16'],
          correct: '15',
          explanation: '7 + 8 = 15 jejak kaki menuntun kita ke anak harimau yang aman!',
        },
        {
          animalName: 'Burung Cenderawasih Emas',
          animalEmoji: '🦜',
          habitat: 'Lembah Hijau Papua',
          story: 'Burung cenderawasih berkicau indah di puncak pohon matoa.',
          question: 'Ada 3 sarang burung, setiap sarang memiliki 4 telur indah. Berapa total seluruh telur?',
          options: ['7', '10', '12', '14'],
          correct: '12',
          explanation: '3 sarang × 4 telur = 12 telur burung cenderawasih terlindungi!',
        },
      ];
    } else if (grade === 'sd_3_4') {
      return [
        {
          animalName: 'Gajah Sumatra',
          animalEmoji: '🐘',
          habitat: 'Taman Nasional Way Kambas',
          story: 'Timbang pakan rumput gajah untuk perbekalan harian.',
          question: 'Seekor gajah butuh 9 karung rumput sehari. Untuk 8 ekor gajah, berapa karung rumput dibutuhkan?',
          options: ['64', '72', '81', '90'],
          correct: '72',
          explanation: '8 × 9 = 72 karung rumput segar.',
        },
        {
          animalName: 'Badak Jawa Bercula Satu',
          animalEmoji: '🦏',
          habitat: 'Taman Nasional Ujung Kulon',
          story: 'Tentukan area suaka perlindungan badak di pesisir semenanjung.',
          question: 'Kandang konservasi berbentuk persegi panjang dengan panjang 20 meter dan lebar 8 meter. Berapa keliling kandang?',
          options: ['40 m', '56 m', '60 m', '72 m'],
          correct: '56 m',
          explanation: 'Keliling = 2 × (20 + 8) = 2 × 28 = 56 meter.',
        },
        {
          animalName: 'Penyu Hijau Laut',
          animalEmoji: '🐢',
          habitat: 'Pantai Sukamade Meru Betiri',
          story: 'Bantu tukik penyu berenang menuju samudera bebas!',
          question: 'Dari 100 telur penyu, 3/4 bagian berhasil menetas menjadi tukik. Berapa jumlah tukik yang menetas?',
          options: ['50', '60', '75', '80'],
          correct: '75',
          explanation: '3/4 × 100 = 75 tukik berenang gembira ke laut!',
        },
        {
          animalName: 'Jalak Bali Putih',
          animalEmoji: '🕊️',
          habitat: 'Taman Nasional Bali Barat',
          story: 'Hitung waktu terbang patroli penjaga hutan lindung.',
          question: 'Patroli dimulai pukul 07.45 dan selesai pukul 09.15. Berapa menit lama patroli hutan?',
          options: ['60 menit', '75 menit', '90 menit', '105 menit'],
          correct: '90 menit',
          explanation: 'Dari 07.45 ke 09.15 = 1 jam 30 menit = 90 menit.',
        },
      ];
    } else {
      // Kelas 5-6
      return [
        {
          animalName: 'Bekantan Hidung Panjang',
          animalEmoji: '🐒',
          habitat: 'Hutan Bakau Mangrove Kalimantan',
          story: 'Hitung perbandingan populasi bekantan jantan dan betina di pulau mangrove.',
          question: 'Perbandingan bekantan jantan dan betina adalah 3 : 5. Jika ada 15 jantan, berapa banyak betina?',
          options: ['20', '25', '30', '35'],
          correct: '25',
          explanation: 'Betina = (5/3) × 15 = 25 ekor bekantan betina.',
        },
        {
          animalName: 'Pusat Medis Satwa Tropis',
          animalEmoji: '🩺',
          habitat: 'Klinik Konservasi Satwa',
          story: 'Campurkan cairan vitamin obat dengan dosis persen yang tepat.',
          question: 'Cairan vitamin 500 ml memiliki konsentrasi madu 15%. Berapa ml madu di dalamnya?',
          options: ['50 ml', '65 ml', '75 ml', '85 ml'],
          correct: '75 ml',
          explanation: '15% × 500 ml = 75 ml madu alami.',
        },
        {
          animalName: 'Zona Habitat Harimau Liar',
          animalEmoji: '🐾',
          habitat: 'Peta Satelit Cagar Alam',
          story: 'Hitung luas zona jelajah harimau pada citra satelit.',
          question: 'Pada peta berskala 1 : 100.000, jarak batas cagar alam adalah 5 cm. Berapa km jarak aslinya?',
          options: ['0,5 km', '5 km', '50 km', '500 km'],
          correct: '5 km',
          explanation: '5 cm × 100.000 = 500.000 cm = 5.000 m = 5 km.',
        },
        {
          animalName: 'Kubah Pelindung Hutan Tropis',
          animalEmoji: '🌳',
          habitat: 'Hutan Konservasi Abadi',
          story: 'Misi Pamungkas: Bangun kubah konservasi ramah lingkungan!',
          question: 'Hitung hasil operasi campuran: 4,5 + 2/5 - 1,4 = ?',
          options: ['3,2', '3,5', '3,7', '4,0'],
          correct: '3,5',
          explanation: '4,5 + 0,4 = 4,9, lalu 4,9 - 1,4 = 3,5! Ekosistem hutan terselamatkan sempurna!',
        },
      ];
    }
  };

  const [stations, setStations] = useState<RescueStation[]>(() => generateStations('sd_1_2'));

  const handleStartGame = (grade: 'sd_1_2' | 'sd_3_4' | 'sd_5_6') => {
    sound.playClick();
    setSelectedGrade(grade);
    setStations(generateStations(grade));
    setCurrentStation(1);
    setHearts(3);
    setAnimalsSaved([]);
    setScore(0);
    setFeedback(null);
    setGameState('playing');
    sound.speak('Selamat datang di Safari Penyelamatan Satwa Rimba Nusantara!');
  };

  const currentStationData = stations[currentStation - 1];

  const handleRescue = (opt: string) => {
    if (feedback !== null) return;

    if (opt === currentStationData.correct) {
      sound.playCorrect();
      setScore((s) => s + 25);
      const savedName = `${currentStationData.animalEmoji} ${currentStationData.animalName}`;
      setAnimalsSaved((prev) => [...prev, savedName]);

      setFeedback({
        isCorrect: true,
        text: `Penyelamatan Berhasil! ${currentStationData.explanation}`,
      });

      setTimeout(() => {
        setFeedback(null);
        if (currentStation < stations.length) {
          setCurrentStation((st) => st + 1);
        } else {
          sound.playFanfare();
          confetti({ particleCount: 70, spread: 70 });
          setGameState('victory');
        }
      }, 1800);
    } else {
      sound.playRetry();
      const newHearts = hearts - 1;
      setHearts(newHearts);

      setFeedback({
        isCorrect: false,
        text: `Belum tepat! Periksa kembali petunjuk: ${currentStationData.explanation}`,
      });

      if (newHearts <= 0) {
        setTimeout(() => setGameState('gameover'), 1500);
      } else {
        setTimeout(() => setFeedback(null), 2000);
      }
    }
  };

  return (
    <div className="bg-emerald-950 rounded-3xl overflow-hidden border-4 border-lime-400 shadow-2xl text-white font-sans max-h-[92vh] flex flex-col">
      {/* Top Bar */}
      <div className="bg-emerald-900 px-4 py-3 border-b border-emerald-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-lime-400/20 border border-lime-400/40 flex items-center justify-center text-lg">
            🦧
          </div>
          <div>
            <h3 className="font-black text-sm text-lime-300">Safari Penyelamatan Satwa</h3>
            <p className="text-[10px] text-emerald-300 font-semibold">Petualangan Rimba Nusantara</p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-0.5 bg-emerald-800/80 px-2 py-1 rounded-xl border border-emerald-600">
              {[1, 2, 3].map((h) => (
                <Heart key={h} className={`w-4 h-4 ${h <= hearts ? 'text-red-400 fill-red-400' : 'text-emerald-950'}`} />
              ))}
            </div>
            <div className="bg-lime-400 text-emerald-950 font-black px-2.5 py-1 rounded-xl">
              🦁 {animalsSaved.length}/{stations.length} Satwa
            </div>
          </div>
        )}

        <button onClick={onExit} className="w-7 h-7 rounded-full bg-emerald-800 hover:bg-emerald-700 text-emerald-200 flex items-center justify-center cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* MENU */}
      {gameState === 'menu' && (
        <div className="p-6 text-center space-y-5 my-auto max-w-lg mx-auto">
          <div className="text-6xl animate-bounce">🦧🌿🐆</div>
          <div>
            <h2 className="text-2xl font-black text-lime-300">Selamatkan Satwa Langka Indonesia</h2>
            <p className="text-xs text-emerald-100 mt-1 max-w-md mx-auto">
              Jelajahi hutan tropis, hitung pakan buah segar, perbaiki jembatan gantung, dan selamatkan satwa endemik Nusantara!
            </p>
          </div>

          <div className="space-y-2 pt-2 text-left">
            <span className="text-[11px] uppercase tracking-wider font-bold text-lime-300 block">
              Pilih Jalur Ekspedisi Hutan:
            </span>
            {[
              { id: 'sd_1_2', label: 'SD Kelas 1 - 2 (Jalur Hutan Wisata)', desc: 'Penjumlahan Pisang, Jejak Harimau & Pola Jembatan', icon: '🦧' },
              { id: 'sd_3_4', label: 'SD Kelas 3 - 4 (Jalur Suaka Margasatwa)', desc: 'Perkalian Pakan Gajah, Pecahan Tukik & Luas Kandang', icon: '🐘' },
              { id: 'sd_5_6', label: 'SD Kelas 5 - 6 (Jalur Cagar Alam Abadi)', desc: 'Rasio Bekantan, Dosis Obat & Skala Citra Satelit', icon: '🐅' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => handleStartGame(s.id as any)}
                className="w-full p-3.5 rounded-2xl bg-emerald-900 hover:bg-emerald-800 border-2 border-emerald-700 hover:border-lime-400 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-125 transition-transform">{s.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-lime-300">{s.label}</h4>
                    <p className="text-[11px] text-emerald-200">{s.desc}</p>
                  </div>
                </div>
                <Trees className="w-5 h-5 text-emerald-400 group-hover:text-lime-300" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PLAYING */}
      {gameState === 'playing' && currentStationData && (
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-emerald-900 via-teal-950 to-emerald-950 overflow-y-auto">
          {/* Habitat & Station Info */}
          <div className="bg-emerald-950/60 p-3 rounded-2xl border border-emerald-700/60 flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trees className="w-4 h-4 text-lime-400" />
              <span className="text-xs font-bold text-lime-200">{currentStationData.habitat}</span>
            </div>
            <span className="text-xs font-black text-amber-300">
              Pos {currentStation} / {stations.length}
            </span>
          </div>

          {/* Animal Scene */}
          <div className="h-36 sm:h-44 bg-gradient-to-b from-emerald-800/80 to-teal-950 rounded-3xl border-2 border-lime-500/40 p-4 relative overflow-hidden flex items-center justify-around my-2 shadow-inner">
            <div className="text-center">
              <div className="text-6xl sm:text-7xl animate-bounce" style={{ animationDuration: '2.5s' }}>
                {currentStationData.animalEmoji}
              </div>
              <h4 className="font-black text-xs sm:text-sm text-lime-300 mt-1">
                {currentStationData.animalName}
              </h4>
            </div>

            <div className="max-w-[200px] bg-emerald-950/90 border border-emerald-600/60 p-3 rounded-2xl text-[11px] text-emerald-100 italic leading-snug">
              "{currentStationData.story}"
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-emerald-900/90 rounded-2xl p-4 border border-lime-400/40 my-2">
            <span className="text-[10px] uppercase font-bold text-lime-400 block mb-1 flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5" /> Misi Penyelamatan:
            </span>
            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              {currentStationData.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-2.5">
            {currentStationData.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleRescue(opt)}
                disabled={feedback !== null}
                className="p-3.5 bg-emerald-800 hover:bg-lime-500/20 active:bg-lime-500/30 border-2 border-emerald-600 hover:border-lime-300 rounded-2xl font-bold text-sm sm:text-base text-white text-center cursor-pointer transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <ShieldCheck className="w-4 h-4 text-lime-400" />
                <span>{opt}</span>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-2.5 p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                feedback.isCorrect ? 'bg-emerald-950 border-lime-400 text-lime-200' : 'bg-red-950 border-red-500 text-red-200'
              }`}
            >
              <span>{feedback.isCorrect ? '🌿' : '⚠️'}</span>
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      )}

      {/* GAME OVER */}
      {gameState === 'gameover' && (
        <div className="p-6 text-center space-y-4 my-auto max-w-md mx-auto">
          <div className="text-5xl animate-bounce">🏕️💔</div>
          <h2 className="text-xl font-black text-red-300">Ekspedisi Hutan Terhenti</h2>
          <p className="text-xs text-emerald-100">
            Perbekalanmu habis di tengah hutan lebat. Beristirahatlah di pos utama dan susun strategi baru!
          </p>
          <button
            onClick={() => handleStartGame(selectedGrade)}
            className="px-5 py-2.5 bg-lime-400 hover:bg-lime-500 text-emerald-950 font-bold rounded-2xl text-xs cursor-pointer shadow flex items-center gap-1.5 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Ulangi Safari
          </button>
        </div>
      )}

      {/* VICTORY */}
      {gameState === 'victory' && (
        <div className="p-6 sm:p-8 text-center space-y-4 my-auto max-w-lg mx-auto animate-in zoom-in-95">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
          <h2 className="text-2xl font-black text-lime-300">Pahlawan Satwa Nusantara! 🏆</h2>
          <p className="text-xs text-emerald-100">
            Hebat sekali! Seluruh satwa langka endemik Indonesia berhasil kamu selamatkan dan rawat dengan penuh kasih sayang!
          </p>
          <div className="bg-emerald-900/80 border border-lime-400/50 p-3 rounded-2xl text-xs font-semibold text-lime-200 flex flex-wrap gap-2 justify-center">
            {animalsSaved.map((a, i) => (
              <span key={i} className="bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-700">
                {a}
              </span>
            ))}
          </div>
          <div className="bg-lime-400/20 border border-lime-400 p-3 rounded-2xl text-lime-300 font-black text-sm">
            Total Hadiah Ranger: +{score + 50} XP & 30 Koin Emas!
          </div>
          <button
            onClick={() => onComplete(score + 50, 3)}
            className="w-full py-3.5 bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-500 hover:to-emerald-600 text-emerald-950 font-black rounded-2xl shadow-xl cursor-pointer transition-transform hover:scale-105"
          >
            Klaim Lencana Penjaga Hutan 🦧
          </button>
        </div>
      )}
    </div>
  );
};
