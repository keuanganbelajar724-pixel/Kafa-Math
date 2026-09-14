import React from 'react';
import { ChildProfile, ParentSettings } from '../../types';
import { getLevelInfo } from '../../services/storage';
import { sound } from '../../services/sound';
import { StatCard } from '../ui/StatCard';
import { ProgressBar } from '../ui/ProgressBar';
import {
  User,
  Users,
  Shield,
  ShoppingBag,
  Sparkles,
  Trophy,
  Flame,
  Star,
  Coins,
  Settings,
  CheckCircle2,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface ProfileViewProps {
  activeProfile: ChildProfile;
  parentSettings: ParentSettings;
  onOpenProfiles: () => void;
  onOpenShop: () => void;
  onOpenParentDashboard: () => void;
  onChangeGrade: (gradeLevel: number) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  activeProfile,
  parentSettings,
  onOpenProfiles,
  onOpenShop,
  onOpenParentDashboard,
  onChangeGrade,
}) => {
  const levelInfo = getLevelInfo(activeProfile.xp);

  const badges = [
    { title: 'First 10 Questions', icon: '🌱', unlocked: true },
    { title: 'Math Explorer', icon: '🧭', unlocked: true },
    { title: 'Multiplication Hero', icon: '⚡', unlocked: activeProfile.xp >= 300 },
    { title: '7 Day Streak', icon: '🔥', unlocked: activeProfile.streak >= 7 },
  ];

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      {/* 1. Header Profile Card: Avatar, Name, Level, XP, Streak */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Avatar Graphic */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-600 shadow-sm flex items-center justify-center text-5xl">
              {activeProfile.avatar || '🦊'}
            </div>
            <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm border-2 border-white">
              Lv.{levelInfo.level}
            </span>
          </div>

          {/* Profile Name & Level */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {activeProfile.name}
              </h1>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 rounded-full text-xs font-black">
                {activeProfile.grade}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Gelar: <strong className="text-slate-800 font-black">{levelInfo.title}</strong>
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1">
                ⭐ {activeProfile.xp.toLocaleString()} XP
              </span>
              <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1">
                🔥 {activeProfile.streak} Hari Streak
              </span>
              <span className="bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1">
                🪙 {activeProfile.coins} Koin
              </span>
            </div>
          </div>

          {/* Switch Profile Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfiles();
            }}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 self-center sm:self-start"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Ganti Profil</span>
          </button>
        </div>
      </div>

      {/* 2. Badges Showcase */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Lencana yang Diperoleh</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">
            {badges.filter((b) => b.unlocked).length} Koleksi
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b) => (
            <div
              key={b.title}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                b.unlocked
                  ? 'bg-amber-50/50 border-amber-200 text-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <span className="text-2xl">{b.icon}</span>
              <div className="min-w-0">
                <span className="text-xs font-black block truncate">{b.title}</span>
                <span className="text-[10px] text-slate-400 font-semibold block">
                  {b.unlocked ? '✓ Terbuka' : 'Terkunci'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Action Cards Grid: Toko Avatar & Area Orang Tua */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Toko Avatar */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenShop();
          }}
          className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-amber-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
              🛍️
            </div>
            <h3 className="font-black text-base text-slate-900 group-hover:text-amber-600 transition-colors">
              Toko Avatar & Kostum
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              Tukarkan {activeProfile.coins} Koin untuk membeli kostum, topi, dan avatar seru baru!
            </p>
          </div>
          <div className="mt-4 pt-2 flex items-center justify-between text-xs font-black text-amber-600">
            <span>Buka Toko</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Dashboard Orang Tua (Protected with PIN) */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenParentDashboard();
          }}
          className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
              Area Khusus Orang Tua & Guru
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              Pantau laporan akurasi, batas waktu belajar harian, dan cetak lembar kerja mandiri.
            </p>
          </div>
          <div className="mt-4 pt-2 flex items-center justify-between text-xs font-black text-emerald-600">
            <span>Buka dengan PIN Keamanan</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
