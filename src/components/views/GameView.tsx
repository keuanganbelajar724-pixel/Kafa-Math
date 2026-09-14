import React, { useState } from 'react';
import { ChildProfile } from '../../types';
import { GameCategoryId, GameMetadata } from '../../types/gameCenter';
import { GAME_CENTER_METADATA } from '../../data/gameCenterData';
import { KafaGamePlayer } from '../gamecenter/KafaGamePlayer';
import { sound } from '../../services/sound';
import {
  Gamepad2,
  Sparkles,
  Flame,
  Star,
  Coins,
  Trophy,
  Play,
  CheckCircle2,
  Award,
} from 'lucide-react';

interface GameViewProps {
  activeProfile?: ChildProfile;
  onLaunchMinigame?: (gameId: string) => void;
  onRewardXP?: (xp: number, coins: number) => void;
}

export const GameView: React.FC<GameViewProps> = ({
  activeProfile,
  onLaunchMinigame,
  onRewardXP,
}) => {
  // Active category filter
  const [selectedCategory, setSelectedCategory] = useState<GameCategoryId>('all');

  // Active game in player
  const [activeGame, setActiveGame] = useState<GameMetadata | null>(null);

  // Daily challenge progress state (2 of 3 completed)
  const [dailyProgress, setDailyProgress] = useState<{ completed: number; total: number }>({
    completed: 2,
    total: 3,
  });

  // Categories list
  const CATEGORIES: { id: GameCategoryId; label: string; icon: string }[] = [
    { id: 'all', label: 'SEMUA', icon: '🌟' },
    { id: 'quick_math', label: 'QUICK MATH', icon: '⚡' },
    { id: 'logic', label: 'LOGIC', icon: '🧩' },
    { id: 'number', label: 'NUMBER', icon: '🔢' },
    { id: 'geometry', label: 'GEOMETRY', icon: '📐' },
    { id: 'fractions', label: 'FRACTIONS', icon: '🍕' },
    { id: 'money', label: 'MONEY', icon: '💰' },
    { id: 'time', label: 'TIME', icon: '⏰' },
    { id: 'data', label: 'DATA', icon: '📊' },
    { id: 'brain_training', label: 'BRAIN TRAINING', icon: '🧠' },
  ];

  // Filter games
  const displayedGames =
    selectedCategory === 'all'
      ? GAME_CENTER_METADATA
      : GAME_CENTER_METADATA.filter((g) => g.category === selectedCategory);

  // Difficulty badge styling
  const difficultyMap = {
    easy: { label: 'Mudah', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    medium: { label: 'Sedang', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    challenge: { label: 'Tantangan', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  };

  // Launch a game
  const handleSelectGame = (game: GameMetadata) => {
    sound.playClick();
    setActiveGame(game);
  };

  // Play next game
  const handlePlayNextGame = () => {
    if (!activeGame) return;
    const currentIndex = GAME_CENTER_METADATA.findIndex((g) => g.id === activeGame.id);
    const nextGame = GAME_CENTER_METADATA[(currentIndex + 1) % GAME_CENTER_METADATA.length];
    setActiveGame(nextGame);
  };

  // If a game is active in player, render the player
  if (activeGame) {
    return (
      <div className="pb-20 sm:pb-8">
        <KafaGamePlayer
          game={activeGame}
          onExit={() => setActiveGame(null)}
          onRewardXP={(xpVal, coinsVal) => {
            if (onRewardXP) {
              onRewardXP(xpVal, coinsVal);
            }
            if (dailyProgress.completed < dailyProgress.total) {
              setDailyProgress((prev) => ({ ...prev, completed: prev.completed + 1 }));
            }
          }}
          onPlayNextGame={handlePlayNextGame}
        />
      </div>
    );
  }

  // Derived user statistics
  const streak = activeProfile?.streak || 7;
  const xp = activeProfile?.xp || 1240;
  const coins = activeProfile?.coins || 860;
  const level = activeProfile?.level || 8;

  return (
    <div className="space-y-6 pb-24 sm:pb-8 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* 1. GAME CENTER HOME HEADER WITH STATS CHIPS                              */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 uppercase tracking-wider">
                <Gamepad2 className="w-4 h-4" />
                KAFA MATH GAME CENTER
              </span>
              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 hidden sm:inline">
                20 Mini-Games
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              🎮 Game Center
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-bold mt-1">
              "Belajar matematika sambil bermain!" • <span className="text-emerald-600 font-black">PLAY → THINK → SOLVE → REWARD → LEARN</span>
            </p>
          </div>

          {/* User Stats Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Streak */}
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-black text-lg shrink-0">
                🔥
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase block leading-none">
                  Streak
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900">
                  {streak} Hari
                </span>
              </div>
            </div>

            {/* XP */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-lg shrink-0">
                ⭐
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase block leading-none">
                  Total XP
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900">
                  {xp.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Coins */}
            <div className="p-3 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center gap-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-black text-lg shrink-0">
                🪙
              </div>
              <div>
                <span className="text-[10px] font-bold text-yellow-700 uppercase block leading-none">
                  Koin
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900">
                  {coins.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Level */}
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-center gap-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-lg shrink-0">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase block leading-none">
                  Peringkat
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900">
                  Level {level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DAILY CHALLENGE (TANTANGAN HARIAN)                                     */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        {/* Background Sparkles Decor */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none text-9xl">
          🎯
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/40 text-emerald-100 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-400/30">
                TANTANGAN HARIAN
              </span>
              <span className="text-xs text-emerald-200 font-bold">
                Hari ini: Penjumlahan, Perkalian, Pecahan
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              🎯 3 Game Matematika Hari Ini!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Selesaikan tantangan harian untuk mengamankan bonus XP dan melipatgandakan streak belajarmu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-emerald-800/50 p-3.5 rounded-2xl border border-emerald-500/30">
            {/* Progress indicators: ✓ ✓ ○ */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-200 block">
                Progress: {dailyProgress.completed} / {dailyProgress.total} Selesai
              </span>
              <div className="flex items-center gap-2">
                {Array.from({ length: dailyProgress.total }).map((_, idx) => {
                  const isDone = idx < dailyProgress.completed;
                  return (
                    <div
                      key={idx}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        isDone
                          ? 'bg-emerald-400 text-emerald-950 shadow-xs'
                          : 'bg-emerald-900/70 text-emerald-300 border border-emerald-600/40'
                      }`}
                    >
                      {isDone ? '✓' : '○'}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reward */}
            <div className="border-l border-emerald-500/40 pl-3.5 space-y-0.5">
              <span className="text-[10px] font-bold text-emerald-300 block uppercase">Reward</span>
              <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <span>+50 XP</span>
                <span>•</span>
                <span>+20 🪙</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                sound.playClick();
                handleSelectGame(GAME_CENTER_METADATA[0]); // Quick math
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              LANJUTKAN TANTANGAN ▶
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. GAME CATEGORIES FILTER TABS                                           */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. GAME CARDS GRID (20 MINI-GAMES)                                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {displayedGames.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header: Icon & Category & Difficulty */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                  {game.icon}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      difficultyMap[game.difficulty].color
                    }`}
                  >
                    {difficultyMap[game.difficulty].label}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    GAME {game.gameNumber < 10 ? `0${game.gameNumber}` : game.gameNumber}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                {game.title}
              </h3>
              <p className="text-xs font-bold text-amber-700 mt-0.5">"{game.subtitle}"</p>
              <p className="text-xs text-slate-500 font-medium mt-1.5 line-clamp-2 leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Bottom Meta & Play Button */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block">
                  Best: <strong className="text-slate-800">{game.bestScore}</strong>
                </span>
                <span className="text-[11px] font-black text-emerald-600 block">
                  +{game.xpReward} XP
                </span>
              </div>

              <button
                onClick={() => handleSelectGame(game)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 5. PARENT REPORT & LEARNING PROGRESS RECOMMENDATION                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
              📊
            </span>
            <div>
              <h3 className="text-base font-black text-slate-900">Laporan Kemajuan Belajar Game</h3>
              <p className="text-xs text-slate-500 font-medium">
                Analisis akurasi bermain & rekomendasi materi penguatan matematika.
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline">
            Akurasi Rata-rata 86%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Strong topic */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
            <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5 uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              QUICK MATH & PENJUMLAHAN
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xl font-black text-emerald-700">92%</span>
              <span className="text-xs text-slate-500 font-semibold">14 Sesi Selesai</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Kecepatan hitung mental dan ketelitian sudah sangat mantap.
            </p>
          </div>

          {/* Moderate topic */}
          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-1">
            <span className="text-xs font-black text-sky-800 flex items-center gap-1.5 uppercase">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              GEOMETRI & BANGUN DATAR
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xl font-black text-sky-700">78%</span>
              <span className="text-xs text-slate-500 font-semibold">8 Sesi Selesai</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Pemahaman jumlah sisi dan bentuk persegi/segitiga berkembang pesat.
            </p>
          </div>

          {/* Needs practice recommendation */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
            <span className="text-xs font-black text-amber-800 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4 text-amber-600" />
              REKOMENDASI PENGUATAN
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xl font-black text-amber-700">61%</span>
              <span className="text-xs text-slate-500 font-semibold">Pecahan (Fractions)</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Disarankan bermain <strong>Fraction Pizza</strong> 10 menit untuk memantapkan konsep visual.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. GAME ACHIEVEMENTS (PRESTASI GAME)                                      */}
      {/* ========================================================================= */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            PENCAPAIAN GAME (ACHIEVEMENTS)
          </span>
          <span className="text-xs font-bold text-slate-500">6 / 10 Terbuka</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {[
            { title: 'First Game', desc: 'Main game pertama', icon: '🎮', unlocked: true },
            { title: 'Speed Master', desc: 'Quick Math skor > 800', icon: '⚡', unlocked: true },
            { title: 'Fraction Hero', desc: 'Selesaikan Pizza 3★', icon: '🍕', unlocked: true },
            { title: 'Math Explorer', desc: 'Mainkan 5 game unik', icon: '🧭', unlocked: true },
            { title: '7 Day Player', desc: 'Streak bermain 7 hari', icon: '🔥', unlocked: true },
            { title: 'Perfect Score', desc: 'Raih 3 bintang sempurna', icon: '⭐', unlocked: true },
            { title: '10 Games', desc: 'Tuntaskan 10 game', icon: '🏆', unlocked: false },
            { title: 'Multiplication Hero', desc: 'Juara perkalian kilat', icon: '✖️', unlocked: false },
            { title: 'Geometry Explorer', desc: 'Kuasai bangun ruang', icon: '📐', unlocked: false },
            { title: '30 Day Player', desc: 'Bermain 30 hari aktif', icon: '👑', unlocked: false },
          ].map((ach, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center transition-all ${
                ach.unlocked
                  ? 'bg-white border-amber-200 shadow-xs'
                  : 'bg-slate-100/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="text-2xl mb-1">{ach.icon}</div>
              <span className="text-xs font-black text-slate-800 block truncate">
                {ach.title}
              </span>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {ach.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
