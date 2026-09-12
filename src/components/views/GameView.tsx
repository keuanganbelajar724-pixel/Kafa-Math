import React, { useState } from 'react';
import { sound } from '../../services/sound';
import { Gamepad2, Play, Sparkles, Trophy, Star, Filter } from 'lucide-react';

interface GameViewProps {
  onLaunchMinigame: (gameId: string) => void;
}

interface GameCardItem {
  id: string;
  title: string;
  desc: string;
  category: 'tradisional' | 'aksi' | 'logika' | 'alat_ujian' | 'cambridge_hands_on';
  icon: string;
  badge: string;
  color: string;
}

export const GameView: React.FC<GameViewProps> = ({ onLaunchMinigame }) => {
  const [filter, setFilter] = useState<string>('all');

  const ALL_GAMES: GameCardItem[] = [
    {
      id: 'cake_fraction_slicer',
      title: 'Bagi & Potong Kue (Touch Slicer)',
      desc: 'Sentuh pisau & potong kue bolu, martabak, brownies sesuai pecahan (1/2, 1/4, 2/3, 5/8). Full sentuh tanpa ABCD!',
      category: 'cambridge_hands_on',
      icon: '🍰',
      badge: 'Cambridge 🇬🇧 Sentuh',
      color: 'from-rose-500 to-pink-600',
    },
    {
      id: 'draw_line_match',
      title: 'Tarik Garis Mencocokkan (Line Match)',
      desc: 'Sentuh titik & tarik garis menghubungkan ten-frame, sahabat 10, pecahan, & jam. Interaktif tanpa ABCD!',
      category: 'cambridge_hands_on',
      icon: '✏️',
      badge: 'Tarik Garis ✍️',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'makan_kerupuk',
      title: 'Lomba Makan Kerupuk',
      desc: 'Jawab benar untuk menggigit kerupuk sampai habis!',
      category: 'tradisional',
      icon: '🍘',
      badge: 'Tradisional 🇮🇩',
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'tarik_tambang',
      title: 'Lomba Tarik Tambang',
      desc: 'Tarik pita merah dan kalahkan tim lawan bersama KAFA!',
      category: 'tradisional',
      icon: '🪢',
      badge: 'Duel Tim 🏆',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'math_vs_monster',
      title: 'Pendekar Math vs Monster',
      desc: 'Tembakkan jurus matematika dan kalahkan monster angka!',
      category: 'aksi',
      icon: '⚔️',
      badge: 'Aksi Seru 🔥',
      color: 'from-rose-500 to-red-600',
    },
    {
      id: 'racing_math',
      title: 'Balap Mobil Matematika',
      desc: 'Pacu mobil balapmu dengan kecepatan berhitung!',
      category: 'aksi',
      icon: '🏎️',
      badge: 'Kecepatan 🏁',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'warung_rupiah',
      title: 'Kasir Warung Rupiah',
      desc: 'Belanja aneka jajanan dan hitung uang kembalian rupiah.',
      category: 'logika',
      icon: '🏪',
      badge: 'Uang Rupiah 💰',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'fraction_pizza',
      title: 'Dapur Pizza & Martabak',
      desc: 'Potong dan bagikan pizza pecahan dengan porsi pas.',
      category: 'logika',
      icon: '🍕',
      badge: 'Pecahan 🍽️',
      color: 'from-amber-500 to-yellow-600',
    },
    {
      id: 'interactive_clock',
      title: 'Menara Jam Analog',
      desc: 'Putar jarum jam dan belajar membaca waktu harian.',
      category: 'logika',
      icon: '⏰',
      badge: 'Waktu & Jam ⏳',
      color: 'from-sky-500 to-blue-600',
    },
    {
      id: 'catch_number',
      title: 'Tangkap Angka Jatuh',
      desc: 'Gerakkan keranjang buah menangkap angka yang benar.',
      category: 'aksi',
      icon: '🎈',
      badge: 'Refleks Cepat ⚡',
      color: 'from-pink-500 to-rose-600',
    },
    {
      id: 'order_train',
      title: 'Kereta Urutan Angka',
      desc: 'Susun gerbong kereta dari angka terkecil ke terbesar.',
      category: 'logika',
      icon: '🚂',
      badge: 'Urutkan 🔢',
      color: 'from-teal-500 to-emerald-600',
    },
    {
      id: 'temple_escape',
      title: 'Ekspedisi Candi RPG',
      desc: 'Jelajahi labirin candi dan pecahkan teka-teki kuno.',
      category: 'tradisional',
      icon: '🏛️',
      badge: 'Petualangan 🗺️',
      color: 'from-orange-500 to-red-600',
    },
    {
      id: 'math_duel',
      title: 'Arena Duel 1 vs 1',
      desc: 'Tantang teman dalam satu layar adu cepat berhitung!',
      category: 'aksi',
      icon: '🥊',
      badge: 'Multiplayer 👥',
      color: 'from-indigo-600 to-purple-700',
    },
    {
      id: 'math_lab',
      title: 'Laboratorium Alat Peraga',
      desc: 'Eksplorasi sempoa, blok desimal, geometri 3D interaktif.',
      category: 'alat_ujian',
      icon: '🔬',
      badge: 'Lab Visual 🧪',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'exam_simulation',
      title: 'Tryout & Simulasi ANBK',
      desc: 'Uji kemampuan numerasi standar Kurikulum Merdeka SD.',
      category: 'alat_ujian',
      icon: '📝',
      badge: 'ANBK & Ujian 🎓',
      color: 'from-violet-600 to-indigo-800',
    },
  ];

  const filteredGames = filter === 'all' ? ALL_GAMES : ALL_GAMES.filter((g) => g.category === filter);

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border-3 border-white/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide border border-white/30 flex items-center gap-1.5 w-fit">
              <Gamepad2 className="w-3.5 h-3.5 text-yellow-300" />
              ARENA GAME MATEMATIKA INTERAKTIF
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Belajar Matematika Lewat Main Game! 🎮
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 font-semibold max-w-xl">
              Pilih game kesukaanmu: dari Lomba Makan Kerupuk, Tarik Tambang, Pendekar vs Monster, hingga Lab Interaktif!
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20 text-center self-start md:self-auto">
            <span className="text-xs font-bold text-indigo-200 block">Total Game Tersedia</span>
            <span className="text-2xl font-black text-yellow-300">{ALL_GAMES.length} Game Seru</span>
          </div>
        </div>
      </div>

      {/* 2. Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: '🌟 Semua Game' },
          { id: 'cambridge_hands_on', label: '🇬🇧 Cambridge Sentuh (Tanpa ABCD)' },
          { id: 'tradisional', label: '🇮🇩 Tradisional & RPG' },
          { id: 'aksi', label: '⚡ Aksi & Kecepatan' },
          { id: 'logika', label: '💡 Logika & Sehari-hari' },
          { id: 'alat_ujian', label: '🔬 Lab & Tryout' },
        ].map((tab) => {
          const isSel = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setFilter(tab.id);
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer border-2 ${
                isSel
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-600 shadow-md scale-105'
                  : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => {
              sound.playClick();
              onLaunchMinigame(game.id);
            }}
            className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-2xs">
                  {game.icon}
                </div>
                <span className="text-[11px] font-black bg-slate-100 text-slate-700 px-3 py-1 rounded-full group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                  {game.badge}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="font-black text-base text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                {game.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                {game.desc}
              </p>
            </div>

            {/* Play Button */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-black text-orange-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Main Sekarang</span>
              </span>
              <div className="w-8 h-8 rounded-xl bg-orange-500 group-hover:bg-orange-600 text-white flex items-center justify-center shadow-xs">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
