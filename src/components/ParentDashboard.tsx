import React, { useState } from 'react';
import { ChildProfile, ParentSettings } from '../types';
import { sound } from '../services/sound';
import {
  Shield,
  KeyRound,
  BarChart3,
  Clock,
  Printer,
  UserPlus,
  Settings,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Volume2,
  TrendingUp,
  BrainCircuit,
  Sliders,
  Database,
  X,
} from 'lucide-react';
import { FirebaseSyncPanel } from './FirebaseSyncPanel';

interface Props {
  profiles: ChildProfile[];
  activeProfile: ChildProfile;
  parentSettings: ParentSettings;
  onUpdateParentSettings: (settings: ParentSettings) => void;
  onUpdateProfile: (profile: ChildProfile) => void;
  onCreateNewProfile: (name: string, grade: string) => void;
  onOpenWorksheetGenerator: () => void;
  onClose: () => void;
}

export const ParentDashboard: React.FC<Props> = ({
  profiles,
  activeProfile,
  parentSettings,
  onUpdateParentSettings,
  onUpdateProfile,
  onCreateNewProfile,
  onOpenWorksheetGenerator,
  onClose,
}) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'controls' | 'profiles' | 'worksheets'>('analytics');

  // Form for new child
  const [newChildName, setNewChildName] = useState<string>('');
  const [newChildGrade, setNewChildGrade] = useState<string>('SD Kelas 1');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === parentSettings.parentPin) {
      sound.playCorrect();
      setIsUnlocked(true);
      setPinError(false);
    } else {
      sound.playRetry();
      setPinError(true);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border-4 border-slate-300 shadow-2xl animate-in zoom-in-95">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-600">
            <KeyRound className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-800">Area Khusus Orang Tua</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Masukkan PIN 4 digit untuk melihat laporan perkembangan dan pengaturan (Default: 1234)
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              autoFocus
              className="w-full text-center tracking-[1em] text-2xl font-mono py-2.5 bg-slate-100 border-2 border-slate-300 rounded-2xl focus:border-indigo-500 outline-none"
            />

            {pinError && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 py-1.5 rounded-xl">
                PIN salah. Gunakan PIN default: 1234
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
              >
                Buka Portal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border-4 border-indigo-200 shadow-2xl flex flex-col my-auto max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 flex items-center justify-center text-indigo-300 border border-indigo-400/40">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">Dashboard Pantauan Orang Tua</h2>
              <p className="text-xs text-indigo-200">
                Memantau kemajuan belajar: <strong className="text-white">{activeProfile.name}</strong> ({activeProfile.grade})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-3 bg-slate-100 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'analytics', label: 'Analisis & Laporan', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'cloud', label: 'Cloud Sync & Peringkat', icon: <Database className="w-4 h-4" /> },
            { id: 'controls', label: 'Batas Waktu & Suara', icon: <Clock className="w-4 h-4" /> },
            { id: 'worksheets', label: 'Cetak Lembar Kerja', icon: <Printer className="w-4 h-4" /> },
            { id: 'profiles', label: 'Kelola Profil Anak', icon: <UserPlus className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB: Analytics & Mastery */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl">
                  <span className="text-[11px] font-bold text-indigo-700 block">Total Waktu Belajar</span>
                  <span className="text-xl font-black text-indigo-950 mt-1 block">
                    {activeProfile.totalMinutesSpent} Menit
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold">15 Menit/Hari Dianjurkan</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                  <span className="text-[11px] font-bold text-amber-700 block">Total Soal Dijawab</span>
                  <span className="text-xl font-black text-amber-950 mt-1 block">
                    {activeProfile.completedNodes.length * 3 + activeProfile.dailyQuestionsDone} Soal
                  </span>
                  <span className="text-[10px] text-amber-600 font-semibold">Akurasi Rata-rata: 88%</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                  <span className="text-[11px] font-bold text-emerald-700 block">Streak Konsistensi</span>
                  <span className="text-xl font-black text-emerald-950 mt-1 block">
                    {activeProfile.streak} Hari Berturut
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Kebiasaan Positif 🔥</span>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl">
                  <span className="text-[11px] font-bold text-purple-700 block">Lencana & Hadiah</span>
                  <span className="text-xl font-black text-purple-950 mt-1 block">
                    {activeProfile.achievements.length} Trofi
                  </span>
                  <span className="text-[10px] text-purple-600 font-semibold">{activeProfile.coins} Koin Terkumpul</span>
                </div>
              </div>

              {/* Learning Mastery Heatmap */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>Peta Penguasaan Materi Berdasarkan Fase</span>
                  </h4>
                  <span className="text-xs font-semibold text-slate-500">Kurikulum Merdeka</span>
                </div>

                <div className="space-y-2">
                  {[
                    { topic: 'Bilangan & Berhitung Dasar', mastery: 92, status: 'Mahir' },
                    { topic: 'Pengenalan Bangun Geometri & Pola', mastery: 85, status: 'Bagus' },
                    { topic: 'Pengukuran Panjang & Waktu Jam', mastery: 74, status: 'Sedang Berkembang' },
                    { topic: 'Pecahan Sederhana (Martabak & Pizza)', mastery: 68, status: 'Perlu Latihan Tambahan' },
                  ].map((m, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{m.topic}</span>
                        <span className="text-indigo-700 font-bold">{m.mastery}% ({m.status})</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            m.mastery >= 85 ? 'bg-emerald-500' : m.mastery >= 70 ? 'bg-amber-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${m.mastery}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation Insights */}
              <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-2xl flex items-start gap-3">
                <BrainCircuit className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h5 className="font-bold text-indigo-950">Rekomendasi AI Kaka untuk Orang Tua:</h5>
                  <p className="text-indigo-900 leading-relaxed">
                    {activeProfile.name} sangat cepat memahami penjumlahan bilangan dan bangun datar geometri. Untuk topik pecahan dan pembagian, disarankan mengajak anak bermain mini-game <em>Pecahan Martabak</em> atau mencetak lembar kerja visual 10 soal untuk dikerjakan bersama di akhir pekan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Cloud Firebase Synchronization & Global Leaderboard */}
          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <FirebaseSyncPanel
                profiles={profiles}
                activeProfile={activeProfile}
                parentSettings={parentSettings}
                onSyncProfiles={(updatedList) => {
                  updatedList.forEach((p) => onUpdateProfile(p));
                }}
                onSyncSettings={onUpdateParentSettings}
              />
            </div>
          )}

          {/* TAB: Screen Time & Voice Controls */}
          {activeTab === 'controls' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Batas Waktu Layar Harian (Healthy Screen Time)</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Aplikasi akan menampilkan notifikasi ramah untuk menyudahi sesi belajar saat batas waktu tercapai.
                </p>

                <div className="flex gap-3">
                  {[10, 15, 20, 30, 45].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        sound.playClick();
                        onUpdateParentSettings({ ...parentSettings, dailyTimeLimitMinutes: mins });
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer border transition-all ${
                        parentSettings.dailyTimeLimitMinutes === mins
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {mins} Menit
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice narration settings */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span>Pengaturan Narasi Suara & Kecepatan Bicara</span>
                </h4>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Aktifkan Voice-Over Bahasa Indonesia</span>
                    <span className="text-[11px] text-slate-500">Membacakan setiap soal dan narasi petualangan</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={parentSettings.voiceOverEnabled}
                    onChange={(e) =>
                      onUpdateParentSettings({ ...parentSettings, voiceOverEnabled: e.target.checked })
                    }
                    className="w-5 h-5 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Kecepatan Bicara: {parentSettings.speechRate}x
                  </label>
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.1"
                    value={parentSettings.speechRate}
                    onChange={(e) =>
                      onUpdateParentSettings({ ...parentSettings, speechRate: parseFloat(e.target.value) })
                    }
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>Pelan (Anak PAUD/TK)</span>
                    <span>Normal (1.0x)</span>
                    <span>Cepat</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Worksheet Generator Trigger */}
          {activeTab === 'worksheets' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-3xl flex items-center justify-center mx-auto text-3xl">
                📄
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Generator Lembar Kerja Cetak (PDF / Print)</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Buat lembar latihan soal matematika bertema Nusantara yang siap dicetak di kertas A4 lengkap dengan kunci jawaban.
                </p>
              </div>
              <button
                onClick={onOpenWorksheetGenerator}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105 inline-flex items-center gap-2"
              >
                <Printer className="w-5 h-5" /> Buka Generator Lembar Kerja
              </button>
            </div>
          )}

          {/* TAB: Profiles Management */}
          {activeTab === 'profiles' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Daftar Akun Anak</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between ${
                      p.id === activeProfile.id ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{p.name}</h5>
                      <span className="text-xs text-slate-500">{p.grade} • {p.xp} XP</span>
                    </div>
                    {p.id === activeProfile.id && (
                      <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-md">
                        Aktif
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Add child form */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 mt-4">
                <h5 className="text-xs font-bold text-slate-800">Tambah Profil Anak Baru:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nama Anak (mis: Aisyah)"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs outline-none"
                  />
                  <select
                    value={newChildGrade}
                    onChange={(e) => setNewChildGrade(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs outline-none"
                  >
                    <option value="PAUD/TK">PAUD/TK (Fase Pondasi)</option>
                    <option value="SD Kelas 1">SD Kelas 1 (Fase A)</option>
                    <option value="SD Kelas 2">SD Kelas 2 (Fase A)</option>
                    <option value="SD Kelas 3">SD Kelas 3 (Fase B)</option>
                    <option value="SD Kelas 4">SD Kelas 4 (Fase B)</option>
                    <option value="SD Kelas 5">SD Kelas 5 (Fase C)</option>
                    <option value="SD Kelas 6">SD Kelas 6 (Fase C)</option>
                  </select>
                  <button
                    onClick={() => {
                      if (newChildName.trim()) {
                        onCreateNewProfile(newChildName.trim(), newChildGrade);
                        setNewChildName('');
                      }
                    }}
                    className="py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                  >
                    + Tambah Anak
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
