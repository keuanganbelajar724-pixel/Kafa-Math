import React from 'react';
import { MainTabType } from './BottomNavigation';
import { ChildProfile, ParentSettings } from '../types';
import { getLevelInfo } from '../services/storage';
import { sound } from '../services/sound';
import { GAME_CENTER_METADATA } from '../data/gameCenterData';
import {
  Home,
  BookOpen,
  Gamepad2,
  Lightbulb,
  Map,
  ShoppingBag,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  Flame,
  GraduationCap,
} from 'lucide-react';

interface DesktopSidebarProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
  activeProfile: ChildProfile;
  parentSettings: ParentSettings;
  onOpenParentDashboard: () => void;
  onOpenShop: () => void;
  onToggleVoice: () => void;
  currentLanguage: 'id' | 'en';
  onToggleLanguage: () => void;
  onChangeGrade?: (gradeLevel: number) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onChangeTab,
  activeProfile,
  parentSettings,
  onOpenParentDashboard,
  onOpenShop,
  onToggleVoice,
  currentLanguage,
  onToggleLanguage,
  onChangeGrade,
}) => {
  const levelInfo = getLevelInfo(activeProfile.xp);

  const mainNavItems = [
    { id: 'home' as MainTabType, label: currentLanguage === 'en' ? 'Home' : 'Beranda', icon: Home, badge: null },
    { id: 'theory' as MainTabType, label: currentLanguage === 'en' ? 'Knowledge Hub' : 'Materi & Konsep', icon: Lightbulb, badge: 'Baru' },
    { id: 'game' as MainTabType, label: currentLanguage === 'en' ? 'Game Center' : 'Game Edukasi', icon: Gamepad2, badge: String(GAME_CENTER_METADATA.length) },
    { id: 'workbook' as MainTabType, label: currentLanguage === 'en' ? 'Practice' : 'Latihan Soal', icon: BookOpen, badge: null },
    { id: 'map' as MainTabType, label: currentLanguage === 'en' ? 'Adventure Map' : 'Peta Petualangan', icon: Map, badge: null },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/90 h-screen sticky top-0 z-30 p-4 justify-between shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
      {/* Top: Brand Header */}
      <div className="space-y-5">
        <div
          onClick={() => onChangeTab('home')}
          className="flex items-center gap-3 px-2 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-sm group-hover:scale-105 transition-transform">
            📐
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight leading-none block">
              KAFA<span className="text-emerald-600">MATH</span>
            </span>
            <span className="text-[11px] font-bold text-slate-400 tracking-wider">
              Akses Terbuka & Gratis
            </span>
          </div>
        </div>

        {/* Open Access Grade Capsule */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-2xl border border-emerald-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              Pilih Jenjang Belajar
            </span>
            <span className="text-[10px] font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded-md">
              {activeProfile.grade}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6].map((g) => {
              const isCurrent = activeProfile.grade.includes(String(g));
              return (
                <button
                  key={g}
                  onClick={() => {
                    sound.playClick();
                    if (onChangeGrade) onChangeGrade(g);
                  }}
                  className={`py-1 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-100/50'
                  }`}
                >
                  Kelas {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 Core Navigation Tabs */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onChangeTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-black text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Settings & Controls (Accessible to all) */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        {/* Language Switcher & Sound */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => {
              sound.playClick();
              onToggleLanguage();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black cursor-pointer transition-all"
            title="Ganti Bahasa (ID / EN)"
          >
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase">{currentLanguage}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onToggleVoice();
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer border ${
              parentSettings.voiceOverEnabled
                ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title={parentSettings.voiceOverEnabled ? 'Suara Narasi Aktif' : 'Suara Narasi Mati'}
          >
            {parentSettings.voiceOverEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
