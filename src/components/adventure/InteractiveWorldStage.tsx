import React, { useState } from 'react';
import { sound } from '../../services/sound';
import { Sparkles, Heart, Shield, Swords, Star, Coins, Volume2, Gem, Compass } from 'lucide-react';

export type CharacterAction = 'idle' | 'walking' | 'jumping' | 'celebrating' | 'thinking' | 'casting';

export interface WorldStageTheme {
  id: string;
  name: string;
  skyGradient: string;
  groundBg: string;
  groundPattern: string;
  ambientEmoji: string[];
  musicMood: string;
  bossTitle: string;
  bossAvatar: string;
}

export const WORLD_THEMES: Record<string, WorldStageTheme> = {
  world_number_village: {
    id: 'world_number_village',
    name: 'Desa Bilangan',
    skyGradient: 'from-amber-200 via-emerald-100 to-sky-300',
    groundBg: 'bg-emerald-600 border-t-8 border-emerald-700',
    groundPattern: '🌿 🏡 🌻 🌾',
    ambientEmoji: ['🦋', '🌻', '🏡', '🌾', '🐦'],
    musicMood: 'Ceria & Damai',
    bossTitle: 'Golem Penjaga Desa Bilangan',
    bossAvatar: '🗿',
  },
  world_sumatra_wonder: {
    id: 'world_sumatra_wonder',
    name: 'Hutan Tropis Bukit Barisan',
    skyGradient: 'from-emerald-700 via-teal-800 to-slate-900',
    groundBg: 'bg-emerald-800 border-t-8 border-emerald-900',
    groundPattern: '🌴 🌺 🌿 🐒',
    ambientEmoji: ['🦜', '🌴', '🌺', '✨', '🐒'],
    musicMood: 'Misteri Alam',
    bossTitle: 'Harimau Penjaga Gerbang Hutan',
    bossAvatar: '🐯',
  },
  world_shape_island: {
    id: 'world_shape_island',
    name: 'Pulau Geometri & Dimensi',
    skyGradient: 'from-indigo-600 via-purple-700 to-sky-800',
    groundBg: 'bg-purple-900 border-t-8 border-purple-950',
    groundPattern: '🔺 🔷 ⏹️ 💎',
    ambientEmoji: ['📐', '🔷', '🔺', '✨', '⭐'],
    musicMood: 'Tekno Ajaib',
    bossTitle: 'Raja Dimensi Kubus Ajaib',
    bossAvatar: '👾',
  },
  world_castle_conquest: {
    id: 'world_castle_conquest',
    name: 'Kastil Kerajaan Matematika',
    skyGradient: 'from-amber-600 via-rose-700 to-slate-900',
    groundBg: 'bg-stone-800 border-t-8 border-stone-900',
    groundPattern: '🏰 🛡️ ⚔️ 👑',
    ambientEmoji: ['🏰', '🛡️', '👑', '🔥', '🦅'],
    musicMood: 'Megah & Gagah',
    bossTitle: 'Naga Bilangan Emas Kastil',
    bossAvatar: '🐉',
  },
  default: {
    id: 'default',
    name: 'Lembah Petualangan Matematika',
    skyGradient: 'from-sky-300 via-teal-200 to-amber-100',
    groundBg: 'bg-emerald-600 border-t-8 border-emerald-700',
    groundPattern: '🌿 🌸 🍀 🌱',
    ambientEmoji: ['🍃', '🌸', '✨', '⭐', '🎈'],
    musicMood: 'Petualangan',
    bossTitle: 'Penjaga Gerbang Kuno',
    bossAvatar: '🦁',
  },
};

interface InteractiveWorldStageProps {
  worldId?: string;
  stageIndex: number;
  totalStages: number;
  characterAction: CharacterAction;
  characterPositionX: number; // percentage 0 - 100
  speechBubbleText?: string | null;
  isBossStage?: boolean;
  bossHp?: number;
  bossMaxHp?: number;
  bossHitAnimation?: boolean;
  hearts: number; // Player lives (3 max)
  keysCount: number;
  gemsCount: number;
  onSecretFound?: (type: 'coin' | 'xp' | 'lore', message: string) => void;
  children: React.ReactNode;
}

export const InteractiveWorldStage: React.FC<InteractiveWorldStageProps> = ({
  worldId = 'world_number_village',
  stageIndex,
  totalStages,
  characterAction,
  characterPositionX,
  speechBubbleText,
  isBossStage = false,
  bossHp = 3,
  bossMaxHp = 3,
  bossHitAnimation = false,
  hearts = 3,
  keysCount = 0,
  gemsCount = 0,
  onSecretFound,
  children,
}) => {
  const theme = WORLD_THEMES[worldId] || WORLD_THEMES.default;

  // Environmental secrets found tracking
  const [bushFound, setBushFound] = useState(false);
  const [crystalFound, setCrystalFound] = useState(false);
  const [balloonFound, setBalloonFound] = useState(false);
  const [floatingBonusText, setFloatingBonusText] = useState<{ id: number; text: string; x: number; y: number } | null>(null);

  const handleTriggerSecret = (type: 'coin' | 'xp' | 'lore', x: number, y: number) => {
    sound.playCoin();
    sound.playStarGain();
    let text = '+5 Koin Harta!';
    if (type === 'xp') text = '+15 XP Kristal!';
    if (type === 'lore') text = '📜 Petunjuk Rahasia!';

    setFloatingBonusText({ id: Date.now(), text, x, y });
    setTimeout(() => setFloatingBonusText(null), 1800);

    if (onSecretFound) {
      onSecretFound(type, text);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border-4 border-amber-300 shadow-2xl bg-slate-900 select-none flex flex-col min-h-[460px] sm:min-h-[520px]">
      {/* 1. Dynamic Animated Sky & Atmosphere */}
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.skyGradient} transition-colors duration-1000`}>
        {/* Floating clouds / celestial objects */}
        <div className="absolute top-4 left-6 animate-pulse opacity-80 pointer-events-none">
          <span className="text-4xl">☁️</span>
        </div>
        <div className="absolute top-8 right-16 animate-bounce opacity-70 pointer-events-none" style={{ animationDuration: '4s' }}>
          <span className="text-3xl">⛅</span>
        </div>
        <div className="absolute top-3 left-1/3 opacity-60 pointer-events-none text-2xl">
          ☁️
        </div>

        {/* Ambient floating nature particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {theme.ambientEmoji.map((emoji, idx) => (
            <span
              key={idx}
              className="absolute text-xl sm:text-2xl opacity-40 animate-pulse"
              style={{
                top: `${15 + idx * 16}%`,
                left: `${8 + idx * 20}%`,
                animationDuration: `${3 + idx}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Top Game HUD (Clean, RPG adventure style) */}
      <div className="relative z-30 p-3 sm:p-4 flex items-center justify-between gap-2 bg-slate-900/60 backdrop-blur-md border-b border-white/20 text-white">
        {/* Left: Stage Progress & World Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="w-9 h-9 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-sm shadow-md border-2 border-white">
            {stageIndex + 1}/{totalStages}
          </span>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <Compass className="w-3.5 h-3.5" />
              <span>{theme.name}</span>
            </div>
            <span className="text-[11px] text-slate-200 font-semibold hidden sm:inline-block">
              {isBossStage ? `⚔️ Boss Battle: ${theme.bossTitle}` : `Tantangan Tahap ${stageIndex + 1}`}
            </span>
          </div>
        </div>

        {/* Center: Boss HP Bar if Boss Stage */}
        {isBossStage ? (
          <div className="flex items-center gap-2 bg-rose-950/80 px-3 py-1.5 rounded-2xl border-2 border-rose-500 shadow-lg animate-pulse">
            <span className="text-base">{theme.bossAvatar}</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                {Array.from({ length: bossMaxHp }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 transition-all duration-300 ${
                      i < bossHp ? 'text-rose-500 fill-rose-500 scale-110' : 'text-slate-600 fill-slate-800'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[9px] font-black text-rose-300 uppercase tracking-wider text-center">
                Boss HP {bossHp}/{bossMaxHp}
              </span>
            </div>
          </div>
        ) : (
          /* Normal Objective Banner */
          <div className="hidden md:flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/20 text-xs font-bold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Misi: Buka Gerbang Misteri Menuju Tahap Akhir!</span>
          </div>
        )}

        {/* Right: Player Stats (Hearts, Keys, Gems) */}
        <div className="flex items-center gap-2 sm:gap-3 bg-black/50 px-3 py-1.5 rounded-2xl border border-white/20 text-xs font-black">
          {/* Player Hearts */}
          <div className="flex items-center gap-1" title="Energi Pemain">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < hearts ? 'text-red-500 fill-red-500' : 'text-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="w-px h-4 bg-white/20" />

          {/* Keys */}
          <div className="flex items-center gap-1 text-yellow-300" title="Kunci Emas Terkumpul">
            <span>🗝️</span>
            <span>{keysCount}</span>
          </div>

          <div className="w-px h-4 bg-white/20" />

          {/* Gems / Coins */}
          <div className="flex items-center gap-1 text-cyan-300" title="Permata Matematika">
            <span>💎</span>
            <span>{gemsCount}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Stage Playfield (World landscape & Actors) */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-4 sm:p-6 pb-2">
        {/* Interactive Secrets in Environment (Bush, Crystal, Balloon) */}
        {!bushFound && (
          <button
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setBushFound(true);
              handleTriggerSecret('coin', 12, 60);
            }}
            className="absolute bottom-28 left-4 text-3xl cursor-pointer hover:scale-125 transition-transform animate-bounce active:scale-95 z-20"
            title="Klik semak rahasia!"
          >
            🌿
            <span className="absolute -top-2 -right-1 text-xs animate-ping">✨</span>
          </button>
        )}

        {!crystalFound && (
          <button
            type="button"
            onClick={(e) => {
              setCrystalFound(true);
              handleTriggerSecret('xp', 85, 30);
            }}
            className="absolute top-20 right-6 text-2xl cursor-pointer hover:scale-125 transition-transform animate-pulse active:scale-95 z-20"
            title="Klik kristal pengetahuan!"
          >
            💎
          </button>
        )}

        {!balloonFound && stageIndex % 2 === 1 && (
          <button
            type="button"
            onClick={() => {
              setBalloonFound(true);
              handleTriggerSecret('lore', 50, 20);
            }}
            className="absolute top-16 left-1/4 text-3xl cursor-pointer hover:scale-125 transition-transform animate-bounce active:scale-95 z-20"
            style={{ animationDuration: '3s' }}
            title="Pecahkan balon misteri!"
          >
            🎈
          </button>
        )}

        {/* Floating Bonus Popup Indicator */}
        {floatingBonusText && (
          <div
            className="absolute z-40 bg-amber-400 text-amber-950 font-black px-3 py-1.5 rounded-full shadow-2xl border-2 border-white animate-bounce text-xs pointer-events-none"
            style={{ left: `${floatingBonusText.x}%`, top: `${floatingBonusText.y}%` }}
          >
            {floatingBonusText.text}
          </div>
        )}

        {/* Boss Actor (if Boss Stage) */}
        {isBossStage && (
          <div className="absolute top-20 right-8 sm:right-16 z-20 flex flex-col items-center">
            <div
              className={`relative transition-all duration-300 ${
                bossHitAnimation
                  ? 'scale-125 rotate-12 filter brightness-150 drop-shadow-[0_0_25px_rgba(239,68,68,1)]'
                  : 'animate-pulse hover:scale-105'
              }`}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900/60 backdrop-blur-md border-4 border-rose-500 shadow-2xl flex items-center justify-center text-6xl sm:text-7xl">
                {theme.bossAvatar}
              </div>
              {bossHitAnimation && (
                <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-yellow-300 drop-shadow-md animate-ping">
                  💥 CRITICAL!
                </div>
              )}
            </div>
            <div className="mt-2 bg-black/70 px-3 py-1 rounded-xl border border-rose-500/50 text-[11px] font-black text-rose-300 text-center shadow-lg">
              {theme.bossTitle}
            </div>
          </div>
        )}

        {/* Explorer Kafa Character on Stage */}
        <div
          className="absolute bottom-28 z-20 transition-all duration-700 ease-out flex flex-col items-center pointer-events-none"
          style={{ left: `calc(${characterPositionX}% - 40px)` }}
        >
          {/* Speech bubble */}
          {speechBubbleText && (
            <div className="mb-2 bg-white text-slate-800 text-xs font-black px-3.5 py-1.5 rounded-2xl shadow-xl border-2 border-amber-300 relative animate-bounce max-w-[200px] text-center">
              <span>{speechBubbleText}</span>
              <div className="w-2.5 h-2.5 bg-white border-b-2 border-r-2 border-amber-300 transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
            </div>
          )}

          {/* Kafa Character Sprite Visual */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-2xl border-4 border-white flex items-center justify-center text-4xl sm:text-5xl transition-transform ${
              characterAction === 'jumping'
                ? '-translate-y-8 scale-110'
                : characterAction === 'celebrating'
                ? 'animate-bounce scale-115 rotate-6'
                : characterAction === 'casting'
                ? 'scale-125 ring-8 ring-cyan-400/80 animate-pulse'
                : characterAction === 'thinking'
                ? 'rotate-3 scale-95'
                : 'animate-pulse'
            }`}
          >
            {characterAction === 'celebrating'
              ? '🎉'
              : characterAction === 'casting'
              ? '⚡'
              : characterAction === 'thinking'
              ? '🤔'
              : '🦊'}
          </div>

          {/* Adventurer Title / Shadow */}
          <div className="w-14 h-3 bg-black/40 rounded-full blur-xs mt-1" />
        </div>

        {/* 4. Interactive Gameplay Stage Content (Chests, Gate, Stones, etc.) */}
        <div className="relative z-20 w-full mb-2">
          {children}
        </div>
      </div>

      {/* 5. Terrain Ground Layer */}
      <div className={`relative z-10 w-full h-20 sm:h-24 ${theme.groundBg} p-3 flex items-center justify-between text-white/80 font-black text-sm`}>
        <div className="text-xl tracking-widest opacity-60">
          {theme.groundPattern}
        </div>
        <div className="flex items-center gap-2 text-xs text-white/90 bg-black/30 px-3 py-1.5 rounded-full border border-white/20">
          <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
          <span>Posisi Kafa: Langkah {stageIndex + 1}</span>
        </div>
      </div>
    </div>
  );
};
