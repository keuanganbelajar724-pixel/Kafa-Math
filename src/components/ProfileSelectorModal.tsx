import React, { useState } from 'react';
import { ChildProfile } from '../types';
import { sound } from '../services/sound';
import { Sparkles, UserPlus, Users, Play, Star, ChevronRight, X } from 'lucide-react';

interface Props {
  profiles: ChildProfile[];
  activeProfile: ChildProfile;
  onSelectProfile: (profile: ChildProfile) => void;
  onCreateNewProfile: (name: string, grade: string) => void;
  onClose: () => void;
}

export const ProfileSelectorModal: React.FC<Props> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onCreateNewProfile,
  onClose,
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [grade, setGrade] = useState<string>('SD Kelas 1');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateNewProfile(name.trim(), grade);
    setName('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 p-5 text-white text-center relative">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl shadow-inner border border-white/30">
            📐
          </div>
          <h2 className="text-xl font-black">Pilih Profil Petualang</h2>
          <p className="text-xs text-amber-100 mt-0.5">
            Selamat datang di KAFA MATH! Pilih siapa yang bermain hari ini:
          </p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Profiles List */}
        <div className="p-5 space-y-3">
          {profiles.map((p) => {
            const isActive = p.id === activeProfile.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  sound.playClick();
                  onSelectProfile(p);
                  onClose();
                }}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  isActive
                    ? 'bg-amber-50 border-orange-500 shadow-md'
                    : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-xs">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                      {p.name}
                      {isActive && (
                        <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {p.grade} • {p.xp} XP • {p.streak} Hari Streak 🔥
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            );
          })}

          {/* Add Child Profile Button / Form */}
          {!showAddForm ? (
            <button
              onClick={() => {
                sound.playClick();
                setShowAddForm(true);
              }}
              className="w-full py-3 bg-slate-50 hover:bg-amber-50 text-orange-600 border-2 border-dashed border-orange-300 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <UserPlus className="w-4 h-4" /> + Tambah Profil Anak Baru
            </button>
          ) : (
            <form onSubmit={handleCreate} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Daftarkan Anak Baru:</h4>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Lengkap Anak"
                required
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs outline-none focus:border-orange-500"
              />
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs outline-none focus:border-orange-500"
              >
                <option value="PAUD/TK">PAUD/TK (Fase Pondasi)</option>
                <option value="SD Kelas 1">SD Kelas 1 (Fase A)</option>
                <option value="SD Kelas 2">SD Kelas 2 (Fase A)</option>
                <option value="SD Kelas 3">SD Kelas 3 (Fase B)</option>
                <option value="SD Kelas 4">SD Kelas 4 (Fase B)</option>
                <option value="SD Kelas 5">SD Kelas 5 (Fase C)</option>
                <option value="SD Kelas 6">SD Kelas 6 (Fase C)</option>
              </select>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow"
                >
                  Simpan Profil
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
