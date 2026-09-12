import React from 'react';
import { ChildProfile, ParentSettings } from '../../types';
import { getLevelInfo } from '../../services/storage';
import { sound } from '../../services/sound';
import { KafaMascot } from '../KafaMascot';
import {
  User,
  Users,
  Shield,
  ShoppingBag,
  Cloud,
  GraduationCap,
  Sparkles,
  Trophy,
  Flame,
  Star,
  Coins,
  Settings,
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

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* 1. Header Profile Card */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border-3 border-white/40">
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar circle */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-1 shadow-xl border-4 border-amber-300 flex items-center justify-center text-5xl">
              {activeProfile.avatar || '🦊'}
            </div>
            <span className="absolute -bottom-2 -right-2 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md border-2 border-white">
              Lv.{levelInfo.level}
            </span>
          </div>

          {/* Profile Name & Title */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">{activeProfile.name}</h1>
              <span className="bg-white/25 backdrop-blur-xs px-3 py-0.5 rounded-full text-xs font-black">
                {activeProfile.grade}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 font-semibold">
              Gelar: <strong className="text-white">{levelInfo.title}</strong>
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="bg-black/20 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-black">
                🔥 {activeProfile.streak} Hari
              </span>
              <span className="bg-black/20 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-black">
                🪙 {activeProfile.coins} Koin
              </span>
              <span className="bg-black/20 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-black">
                ⭐ {activeProfile.completedNodes.length * 3} Bintang
              </span>
            </div>
          </div>

          {/* Switch Profile Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfiles();
            }}
            className="px-4 py-2.5 rounded-2xl bg-white text-orange-600 hover:bg-amber-50 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
          >
            <Users className="w-4 h-4" />
            <span>Ganti Profil</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Companion Banner */}
      <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm flex items-center justify-between">
        <KafaMascot
          mood="happy"
          customMessage={`Tetap semangat belajar ya, ${activeProfile.name}! Koinmu bisa dipakai belanja avatar seru di Toko KAFA!`}
          size="md"
        />
        <button
          onClick={() => {
            sound.playClick();
            onOpenShop();
          }}
          className="hidden sm:flex px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-sm shadow-md items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Buka Toko Avatar</span>
        </button>
      </div>

      {/* 3. Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Toko Avatar & Hadiah */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenShop();
          }}
          className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
            🛍️
          </div>
          <h3 className="font-black text-base text-slate-800 group-hover:text-orange-600 transition-colors">
            Toko Avatar & Kostum
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gunakan {activeProfile.coins} Koin KAFA untuk membuka karakter dan topi lucu.
          </p>
          <div className="mt-4 text-xs font-black text-orange-600 flex items-center gap-1">
            <span>Belanja Sekarang</span>
            <span>→</span>
          </div>
        </div>

        {/* Dashboard Orang Tua */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenParentDashboard();
          }}
          className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
            🛡️
          </div>
          <h3 className="font-black text-base text-slate-800 group-hover:text-indigo-600 transition-colors">
            Area Orang Tua & Guru
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Atur batas waktu harian, pantau rapor nilai, dan kelola PIN keamanan.
          </p>
          <div className="mt-4 text-xs font-black text-indigo-600 flex items-center gap-1">
            <span>Buka dengan PIN</span>
            <span>→</span>
          </div>
        </div>

        {/* Sinkronisasi Cloud Firebase */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenParentDashboard();
          }}
          className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
            ☁️
          </div>
          <h3 className="font-black text-base text-slate-800 group-hover:text-emerald-600 transition-colors">
            Sinkronisasi Cloud Firestore
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Data kemajuan tersimpan aman di Cloud Firebase & dapat dimainkan lintas perangkat.
          </p>
          <div className="mt-4 text-xs font-black text-emerald-600 flex items-center gap-1">
            <span>Status: Terhubung Aktif ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
