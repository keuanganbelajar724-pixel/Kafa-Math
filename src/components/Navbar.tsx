import React from 'react';
import { ChildProfile, ParentSettings } from '../types';
import { getLevelInfo } from '../services/storage';
import { sound } from '../services/sound';
import {
  Flame,
  Star,
  Coins,
  Trophy,
  Volume2,
  VolumeX,
  Shield,
  Users,
  Bot,
  Languages,
} from 'lucide-react';

interface Props {
  activeProfile: ChildProfile;
  parentSettings: ParentSettings;
  onNavigateHome?: () => void;
  onOpenWorkbook?: () => void;
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
  currentLanguage?: 'id' | 'en';
  onToggleLanguage?: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeProfile,
  parentSettings,
  onNavigateHome,
  onOpenWorkbook,
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
  currentLanguage = 'id',
  onToggleLanguage,
}) => {
  const levelInfo = getLevelInfo(activeProfile.xp);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Mobile / Tablet Logo & Child Quick Switch */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 md:hidden"
            onClick={() => {
              sound.playClick();
              if (onNavigateHome) onNavigateHome();
              else onOpenProfiles();
            }}
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-xs">
              📐
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
                KAFA<span className="text-emerald-600">MATH</span>
              </h1>
            </div>
          </div>

          {/* Active Profile Pill */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfiles();
            }}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-2xl cursor-pointer transition-all active:scale-95"
            title="Ganti Profil Anak"
          >
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
              {activeProfile.name.charAt(0)}
            </div>
            <div className="text-left leading-tight pr-1">
              <span className="text-xs font-bold text-slate-800 block truncate max-w-[80px] sm:max-w-[120px]">
                {activeProfile.name}
              </span>
              <span className="text-[10px] text-emerald-600 font-extrabold">{activeProfile.grade}</span>
            </div>
            <Users className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>
        </div>

        {/* Stats & Quick Actions (Streak, Level, Coins, AI Tutor, Sound, Parent PIN) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Streak */}
          <div
            className="flex items-center gap-1 bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-xl shadow-2xs"
            title={`Streak: ${activeProfile.streak} Hari`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-xs font-black text-rose-700">{activeProfile.streak}d</span>
          </div>

          {/* Level */}
          <div
            className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl shadow-2xs"
            title={`Level ${levelInfo.level}: ${levelInfo.title}`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-black text-amber-800">Lv.{levelInfo.level}</span>
          </div>

          {/* Coins */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="flex items-center gap-1 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 px-2.5 py-1 rounded-xl shadow-2xs cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Toko Hadiah & Avatar"
          >
            <Coins className="w-3.5 h-3.5 text-yellow-600 fill-yellow-400" />
            <span className="text-xs font-black text-yellow-800">{activeProfile.coins}</span>
          </button>

          {/* AI Tutor Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAITutor();
            }}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-xl shadow-2xs cursor-pointer transition-all active:scale-95"
            title="Tanya AI Tutor Kaka"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="text-xs hidden sm:inline">Tutor AI</span>
          </button>

          {/* Language Switcher */}
          {onToggleLanguage && (
            <button
              onClick={() => {
                sound.playClick();
                onToggleLanguage();
              }}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer text-slate-700 text-xs font-black flex items-center gap-1"
              title="Ganti Bahasa (ID / EN)"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span className="uppercase text-[10px]">{currentLanguage}</span>
            </button>
          )}

          {/* Sound Toggle */}
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
            title={parentSettings.voiceOverEnabled ? 'Suara Aktif' : 'Suara Mati'}
          >
            {parentSettings.voiceOverEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Parent Mode (Only on mobile/tablet since desktop has it in sidebar) */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenParentDashboard();
            }}
            className="md:hidden p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl cursor-pointer transition-all active:scale-95"
            title="Dashboard Orang Tua"
          >
            <Shield className="w-3.5 h-3.5 text-slate-700" />
          </button>
        </div>
      </div>
    </header>
  );
};
