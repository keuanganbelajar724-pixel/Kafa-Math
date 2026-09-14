import React from 'react';
import { MainTabType } from './BottomNavigation';
import { ChildProfile, ParentSettings } from '../types';
import { getLevelInfo } from '../services/storage';
import { sound } from '../services/sound';
import {
  Home,
  BookOpen,
  Gamepad2,
  TrendingUp,
  User,
  Map,
  Shield,
  ShoppingBag,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  Flame,
  Trophy,
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
}) => {
  const levelInfo = getLevelInfo(activeProfile.xp);

  const mainNavItems = [
    { id: 'home' as MainTabType, label: currentLanguage === 'en' ? 'Home' : 'Beranda', icon: Home },
    { id: 'workbook' as MainTabType, label: currentLanguage === 'en' ? 'Practice' : 'Latihan', icon: BookOpen },
    { id: 'game' as MainTabType, label: currentLanguage === 'en' ? 'Games' : 'Game Edukasi', icon: Gamepad2 },
    { id: 'progress' as MainTabType, label: currentLanguage === 'en' ? 'Progress' : 'Kemajuan', icon: TrendingUp },
    { id: 'profile' as MainTabType, label: currentLanguage === 'en' ? 'Profile' : 'Profil Anak', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/90 h-screen sticky top-0 z-30 p-4 justify-between shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
      {/* Top: Brand Header */}
      <div className="space-y-6">
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
              Math Made Fun.
            </span>
          </div>
        </div>

        {/* Child Profile Quick Capsule */}
        <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl flex-shrink-0">
            {activeProfile.avatar || '🦊'}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-black text-slate-900 block truncate">
              {activeProfile.name}
            </span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mt-0.5">
              <span className="text-emerald-600 font-extrabold">Lv.{levelInfo.level}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-rose-600 font-black">
                <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                {activeProfile.streak}d
              </span>
            </div>
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-black text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Special Sub-routes: Peta Petualangan */}
        <div className="pt-2 border-t border-slate-100 space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3">
            Eksplorasi
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onChangeTab('map');
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Map className="w-4 h-4 text-amber-500" />
            <span>Peta Petualangan Nusantara</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl font-bold text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-orange-500" />
            <span>Toko Hadiah & Avatar</span>
          </button>
        </div>
      </div>

      {/* Bottom: Settings, Parent Dashboard & Controls */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        {/* Language Switcher & Sound */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => {
              sound.playClick();
              onToggleLanguage();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black cursor-pointer transition-all"
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
            title={parentSettings.voiceOverEnabled ? 'Suara Aktif' : 'Suara Mati'}
          >
            {parentSettings.voiceOverEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Parent Dashboard Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenParentDashboard();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all active:scale-95 cursor-pointer border border-slate-200"
        >
          <Shield className="w-4 h-4 text-slate-600" />
          <span>Dashboard Orang Tua (PIN)</span>
        </button>
      </div>
    </aside>
  );
};
