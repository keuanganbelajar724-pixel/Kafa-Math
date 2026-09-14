import React, { useState } from 'react';
import { ChildProfile } from '../../types';
import { getLevelInfo } from '../../services/storage';
import { sound } from '../../services/sound';
import { StatCard } from '../ui/StatCard';
import { ProgressBar } from '../ui/ProgressBar';
import { BadgeCard } from '../ui/BadgeCard';
import {
  Trophy,
  Flame,
  Star,
  Award,
  TrendingUp,
  Brain,
  CheckCircle2,
  Calendar,
  Sparkles,
  Printer,
  Download,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProgressViewProps {
  activeProfile: ChildProfile;
  onPracticeTopic: (topicId: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  activeProfile,
  onPracticeTopic,
}) => {
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const levelInfo = getLevelInfo(activeProfile.xp);

  // Level XP calculations (e.g. 1,240 / 1,500 XP)
  const currentLevel = levelInfo.level;
  const currentXP = activeProfile.xp;
  const targetXPForNextLevel = (currentLevel + 1) * 200;
  const xpNeeded = Math.max(0, targetXPForNextLevel - currentXP);
  const xpLevelProgress = Math.min(
    100,
    Math.round(((currentXP % 200) / 200) * 100)
  );

  // 1. SKILL MASTERY (As explicitly requested by user)
  const skillMasteries = [
    { name: 'Penjumlahan', score: 92, icon: '➕', color: 'bg-emerald-500' },
    { name: 'Pengurangan', score: 78, icon: '➖', color: 'bg-teal-500' },
    { name: 'Perkalian', score: 61, icon: '✖️', color: 'bg-amber-500' },
    { name: 'Pembagian', score: 42, icon: '➗', color: 'bg-rose-500' },
    { name: 'Soal Cerita', score: 70, icon: '📖', color: 'bg-sky-500' },
  ];

  // 2. WEEKLY ACTIVITY (Sen, Sel, Rab, Kam, Jum, Sab, Min)
  const weeklyDays = [
    { day: 'Sen', questions: 12, height: 60 },
    { day: 'Sel', questions: 18, height: 90 },
    { day: 'Rab', questions: 10, height: 50 },
    { day: 'Kam', questions: 15, height: 75 },
    { day: 'Jum', questions: 20, height: 100, active: true },
    { day: 'Sab', questions: 8, height: 40 },
    { day: 'Min', questions: 14, height: 70 },
  ];

  // 3. COLLECTIBLE BADGES (As explicitly requested by user)
  const badgesList = [
    {
      title: 'First 10 Questions',
      desc: 'Menyelesaikan 10 soal matematika pertamamu.',
      icon: '🌱',
      isUnlocked: true,
      unlockedAt: 'Minggu lalu',
    },
    {
      title: '100 Questions',
      desc: 'Menuntaskan 100 soal latihan matematika dengan tekun.',
      icon: '💯',
      isUnlocked: (activeProfile.totalQuestionsAnswered || 0) >= 100 || activeProfile.xp >= 500,
      progressText: `${activeProfile.totalQuestionsAnswered || 48} / 100 Soal`,
    },
    {
      title: 'Math Explorer',
      desc: 'Menjelajahi semua jenis operasi matematika dasar.',
      icon: '🧭',
      isUnlocked: true,
      unlockedAt: '3 hari lalu',
    },
    {
      title: 'Multiplication Hero',
      desc: 'Menjawab soal perkalian dengan akurasi di atas 85%.',
      icon: '⚡',
      isUnlocked: activeProfile.xp >= 300,
      progressText: 'Level Perkalian 2',
    },
    {
      title: '7 Day Streak',
      desc: 'Berlatih 7 hari berturut-turut tanpa putus.',
      icon: '🔥',
      isUnlocked: activeProfile.streak >= 7,
      progressText: `${activeProfile.streak} / 7 Hari`,
    },
    {
      title: '30 Day Streak',
      desc: 'Konsistensi luar biasa selama 30 hari penuh!',
      icon: '👑',
      isUnlocked: activeProfile.streak >= 30,
      progressText: `${activeProfile.streak} / 30 Hari`,
    },
  ];

  return (
    <div className="space-y-6 pb-24 sm:pb-8">
      {/* 1. Header: 📊 Progress Saya & "Kamu semakin jago setiap hari!" */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-wider text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Laporan Kemajuan Belajar
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Progress Saya 📊
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            "Kamu semakin jago setiap hari!" • Pantau penguasaan konsep matematika dan prestasimu.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playFanfare();
            confetti({ particleCount: 60, spread: 80 });
            setShowCertificate(true);
          }}
          className="px-5 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-black text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 self-start md:self-auto"
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>Lihat Sertifikat Prestasi 🎓</span>
        </button>
      </div>

      {/* 2. LEVEL SYSTEM & STREAK (Two hero stat cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Level System Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-black">
                🏆
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Sistem Level
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  LEVEL {currentLevel} • {levelInfo.title}
                </h3>
              </div>
            </div>
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              ⭐ {currentXP} XP
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Progress Level</span>
              <span>
                {currentXP} / {targetXPForNextLevel} XP
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(10, xpLevelProgress)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 font-semibold text-right">
              {xpNeeded} XP lagi menuju Level {currentLevel + 1}
            </p>
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl font-black">
                🔥
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Streak Latihan
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {activeProfile.streak} DAYS STREAK
                </h3>
              </div>
            </div>
            <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Konsisten ✓
            </span>
          </div>

          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-rose-900">Keep it going!</p>
              <p className="text-xs text-rose-700 mt-0.5">
                Latihan 10 soal setiap hari untuk terus mempertahankan apimu.
              </p>
            </div>
            <span className="text-3xl">🚀</span>
          </div>
        </div>
      </div>

      {/* 3. SKILL MASTERY & WEEKLY ACTIVITY (Two columns layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SKILL MASTERY */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Penguasaan Materi (Skill Mastery)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Tingkat akurasi pemahaman dari latihan yang telah dikerjakan.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            {skillMasteries.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 flex items-center gap-2">
                    <span className="text-base">{skill.icon}</span>
                    <span>{skill.name}</span>
                  </span>
                  <span className="text-slate-900 font-black">{skill.score}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${skill.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WEEKLY ACTIVITY (Simple Bar Chart) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Aktivitas Mingguan (Weekly Activity)
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                7 Hari Terakhir
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Jumlah soal yang kamu selesaikan setiap hari.
            </p>
          </div>

          {/* Simple Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-2 h-36 px-2">
              {weeklyDays.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-400">
                    {item.questions}
                  </span>
                  <div
                    className={`w-full max-w-[28px] rounded-xl transition-all ${
                      item.active
                        ? 'bg-emerald-500 shadow-xs'
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                    style={{ height: `${item.height}%` }}
                  />
                  <span
                    className={`text-xs font-black ${
                      item.active ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total minggu ini: <strong>97 Soal</strong></span>
            <span>Rata-rata: <strong>14 soal/hari</strong></span>
          </div>
        </div>
      </div>

      {/* 4. ACHIEVEMENTS / COLLECTIBLE BADGES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Lencana Prestasi (Collectible Badges) 🏅
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Kumpulkan semua lencana dengan terus giat berlatih matematika.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600">
            {badgesList.filter((b) => b.isUnlocked).length} / {badgesList.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badgesList.map((badge) => (
            <BadgeCard
              key={badge.title}
              title={badge.title}
              desc={badge.desc}
              icon={badge.icon}
              isUnlocked={badge.isUnlocked}
              progressText={badge.progressText}
              unlockedAt={badge.unlockedAt}
            />
          ))}
        </div>
      </div>

      {/* CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-4 border-amber-300 shadow-2xl relative space-y-5 animate-in zoom-in-95">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-4 border-double border-amber-400 rounded-2xl p-6 text-center space-y-4 bg-amber-50/40">
              <span className="text-4xl">🎓</span>
              <div>
                <h3 className="text-xs font-black tracking-widest text-amber-700 uppercase">
                  SERTIFIKAT KELULUSAN TINGKAT
                </h3>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  KAFA MATH SCHOLAR
                </h2>
              </div>
              <p className="text-xs text-slate-600">Diberikan dengan bangga kepada:</p>
              <h1 className="text-3xl font-black text-emerald-700 underline decoration-amber-400 decoration-wavy">
                {activeProfile.name}
              </h1>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Atas ketekunan dan keberhasilannya meraih <strong>{activeProfile.xp} XP</strong> dan tingkat <strong>{levelInfo.title}</strong> dalam belajar matematika.
              </p>
              <div className="pt-4 flex justify-between text-[11px] font-bold text-slate-500 border-t border-amber-200">
                <span>Tanggal: {new Date().toLocaleDateString('id-ID')}</span>
                <span>KAFA Math Platform</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  window.print();
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sertifikat</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
