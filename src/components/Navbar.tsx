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

          {/* Active Grade Indicator */}
          <div
            className="flex items-center gap-1.5 bg-emerald-50/80 border border-emerald-200/80 px-2.5 py-1 rounded-xl"
            title="Jenjang Matematika Aktif"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center">
              🎓
            </div>
            <div className="text-left leading-tight pr-0.5">
              <span className="text-xs font-black text-slate-800 block truncate max-w-[100px] sm:max-w-[140px]">
                {activeProfile.grade}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Access & Utility (Knowledge, Game, AI Tutor, Language, Sound) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Knowledge Link */}
          {onOpenFormulaHandbook && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenFormulaHandbook();
              }}
              className="hidden md:flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-xl border border-indigo-200 text-xs transition-all active:scale-95 cursor-pointer"
              title="Pusat Pengetahuan & Teori"
            >
              <span>💡</span>
              <span>Pengetahuan</span>
            </button>
          )}

          {/* Quick Games Link */}
          {onOpenMathLab && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenMathLab();
              }}
              className="hidden md:flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-xl border border-purple-200 text-xs transition-all active:scale-95 cursor-pointer"
              title="Bank Game Edukasi"
            >
              <span>🎮</span>
              <span>Game Center</span>
            </button>
          )}

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
        </div>
      </div>
    </header>
  );
};
