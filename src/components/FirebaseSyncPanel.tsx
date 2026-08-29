import React, { useState, useEffect } from 'react';
import {
  fetchProfilesFromFirestore,
  saveProfileToFirestore,
  fetchParentSettingsFromFirestore,
  saveParentSettingsToFirestore,
  subscribeToProfiles,
  subscribeToLeaderboard,
  LeaderboardEntry,
  ensureAuthUser,
} from '../services/firestoreSync';
import { ChildProfile, ParentSettings } from '../types';
import { sound } from '../services/sound';
import firebaseConfig from '../../firebase-applet-config.json';
import { Cloud, CloudCheck, RefreshCw, Trophy, Shield, Sparkles, Database, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  profiles: ChildProfile[];
  activeProfile: ChildProfile;
  parentSettings: ParentSettings;
  onSyncProfiles: (updatedProfiles: ChildProfile[]) => void;
  onSyncSettings: (updatedSettings: ParentSettings) => void;
}

export const FirebaseSyncPanel: React.FC<Props> = ({
  profiles,
  activeProfile,
  parentSettings,
  onSyncProfiles,
  onSyncSettings,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>('Online (Cloud Sync)');

  // Auto connect and subscribe
  useEffect(() => {
    ensureAuthUser().then((user) => {
      if (user) {
        setAuthEmail(user.isAnonymous ? 'Mode Cloud Anonim' : (user.email || 'Online'));
      }
    });

    // Realtime listen to leaderboard
    const unsubLeaderboard = subscribeToLeaderboard((entries) => {
      setLeaderboard(entries);
    });

    return () => {
      unsubLeaderboard();
    };
  }, []);

  // Manual trigger Sync
  const handleManualSync = async () => {
    setIsSyncing(true);
    sound.playClick();
    try {
      // 1. Upload local active profiles to Firestore
      for (const p of profiles) {
        await saveProfileToFirestore(p);
      }
      await saveParentSettingsToFirestore(parentSettings);

      // 2. Fetch latest snapshot
      const remoteProfiles = await fetchProfilesFromFirestore();
      if (remoteProfiles.length > 0) {
        onSyncProfiles(remoteProfiles);
      }

      setSyncStatus('success');
      setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
      sound.playFanfare();
      setTimeout(() => setSyncStatus('idle'), 4000);
    } catch (e) {
      console.error('Firebase sync error:', e);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900/5 rounded-3xl p-4 sm:p-5 border-2 border-amber-500/30 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-800">
                Cloud Firebase Synchronization
              </h3>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                🟢 Terhubung
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Project ID: <code className="bg-slate-200/80 px-1 py-0.5 rounded text-slate-700 font-mono text-[10px]">{firebaseConfig.projectId}</code>
            </p>
          </div>
        </div>

        {/* Sync Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLeaderboard((s) => !s)}
            className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Peringkat Nusantara ({leaderboard.length})</span>
          </button>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
          </button>
        </div>
      </div>

      {/* Sync notification message */}
      {syncStatus === 'success' && (
        <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Semua progres XP, koin, materi, dan setelan berhasil disimpan permanen ke Firebase! ({lastSyncTime})</span>
        </div>
      )}

      {/* Realtime Nusantara Leaderboard View Modal/Accordion */}
      {showLeaderboard && (
        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h4 className="font-black text-sm text-slate-800">
                Papan Peringkat Pelajar Matematika Nusantara (Firestore Real-time)
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">Update Otomatis</span>
          </div>

          {leaderboard.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">
              Belum ada data peringkat di Firebase. Tekan "Sinkronkan Sekarang" untuk mengunggah profilmu!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {leaderboard.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`flex items-center justify-between p-2 rounded-xl border ${
                    item.id === activeProfile.id
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      idx === 0 ? 'bg-yellow-400 text-stone-900' : idx === 1 ? 'bg-slate-300 text-stone-900' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                        <span>{item.name}</span>
                        {item.id === activeProfile.id && (
                          <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded font-bold">Kamu</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">{item.grade} • {item.levelTitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-amber-600">⭐ {item.xp} XP</div>
                    <div className="text-[10px] text-yellow-600 font-bold">🪙 {item.coins}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
