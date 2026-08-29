import React from 'react';
import { ChildProfile, ParentSettings } from '../types';
import { getLevelInfo } from '../services/storage';
import { sound } from '../services/sound';
import { Flame, Sparkles, Coins, Trophy, Volume2, VolumeX, Shield, Users, ShoppingBag, Bot } from 'lucide-react';

interface Props {
  activeProfile: ChildProfile;
  parentSettings: ParentSettings;
  onOpenProfiles: () => void;
  onOpenParentDashboard: () => void;
  onOpenShop: () => void;
  onOpenAITutor: () => void;
  onOpenMathLab: () => void;
  onOpenExamSimulation: () => void;
  onOpenMathDuel: () => void;
  onOpenFormulaHandbook: () => void;
  onOpenWorksheets: () => void;
  onToggleVoice: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeProfile,
  parentSettings,
  onOpenProfiles,
  onOpenParentDashboard,
  onOpenShop,
  onOpenAITutor,
  onOpenMathLab,
  onOpenExamSimulation,
  onOpenMathDuel,
  onOpenFormulaHandbook,
  onOpenWorksheets,
  onToggleVoice,
}) => {
  const levelInfo = getLevelInfo(activeProfile.xp);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Child Profile Quick Switch */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onOpenProfiles}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-white">
              📐
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
                KAFA<span className="text-orange-500">MATH</span>
              </h1>
              <span className="text-[10px] font-bold text-slate-700 tracking-wider">PETUALANGAN BELAJAR</span>
            </div>
          </div>

          {/* Active Profile Pill */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfiles();
            }}
            className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-2.5 py-1.5 rounded-2xl cursor-pointer transition-all active:scale-95"
            title="Ganti Profil Anak"
          >
            <div className="w-6 h-6 rounded-full bg-orange-400 text-white font-black text-xs flex items-center justify-center">
              {activeProfile.name.charAt(0)}
            </div>
            <div className="text-left leading-tight pr-1">
              <span className="text-xs font-bold text-slate-800 block truncate max-w-[80px] sm:max-w-[120px]">
                {activeProfile.name}
              </span>
              <span className="text-[10px] text-orange-700 font-semibold">{activeProfile.grade}</span>
            </div>
            <Users className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>
        </div>

        {/* Stats Pills (Streak, XP, Coins, Level) */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Streak */}
          <div
            className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl shadow-2xs"
            title={`Streak Belajar: ${activeProfile.streak} Hari`}
          >
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-xs font-black text-rose-700">{activeProfile.streak}</span>
          </div>

          {/* XP & Level */}
          <div
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl shadow-2xs"
            title={`Level ${levelInfo.level}: ${levelInfo.title} (${activeProfile.xp} XP)`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <div className="text-left">
              <span className="text-xs font-black text-amber-800">Lv.{levelInfo.level}</span>
            </div>
          </div>

          {/* Coins */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="flex items-center gap-1 bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 px-2.5 py-1 rounded-xl shadow-2xs cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Toko Hadiah & Kostum"
          >
            <Coins className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            <span className="text-xs font-black text-yellow-800">{activeProfile.coins}</span>
          </button>

          {/* Quick Hub Buttons */}
          <div className="hidden xl:flex items-center gap-1.5 border-l border-r border-amber-200/80 px-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenMathLab();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-black bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 cursor-pointer transition-all active:scale-95"
              title="Laboratorium Matematika Interaktif"
            >
              <span>🔬</span>
              <span>Lab Alat Peraga</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onOpenExamSimulation();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-black bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer transition-all active:scale-95"
              title="Simulasi Ujian & ANBK SD"
            >
              <span>📝</span>
              <span>Tryout ANBK</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onOpenMathDuel();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-black bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer transition-all active:scale-95"
              title="Arena Duel 1 vs 1"
            >
              <span>⚔️</span>
              <span>Duel 1v1</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onOpenFormulaHandbook();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-black bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 cursor-pointer transition-all active:scale-95"
              title="Kamus Rumus & Trik Cepat"
            >
              <span>📚</span>
              <span>Kamus Rumus</span>
            </button>
          </div>

          {/* AI Tutor Quick Access */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAITutor();
            }}
            className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-2.5 py-1 rounded-xl shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
            title="Tanya AI Tutor Kaka"
          >
            <Bot className="w-4 h-4" />
            <span className="text-xs hidden md:inline">Tutor AI</span>
          </button>

          {/* Sound & Voice Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleVoice();
            }}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              parentSettings.voiceOverEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
            title={parentSettings.voiceOverEnabled ? 'Suara & Narasi Aktif' : 'Suara Dimatikan'}
          >
            {parentSettings.voiceOverEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Parent Dashboard Lock */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenParentDashboard();
            }}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl cursor-pointer transition-all active:scale-95 flex items-center gap-1"
            title="Dashboard Orang Tua (PIN)"
          >
            <Shield className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold hidden lg:inline">Orang Tua</span>
          </button>
        </div>
      </div>
    </header>
  );
};
