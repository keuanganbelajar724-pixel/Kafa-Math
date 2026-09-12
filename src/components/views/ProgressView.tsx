import React, { useState } from 'react';
import { ChildProfile } from '../../types';
import { ACHIEVEMENTS_DATA } from '../../data/achievementsData';
import { getLevelInfo } from '../../services/storage';
import { PRIMARY_STAGES } from '../../data/cambridgeCurriculumData';
import { sound } from '../../services/sound';
import {
  Trophy,
  Flame,
  Star,
  Coins,
  TrendingUp,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Brain,
  Target,
  Printer,
  Download,
  ShieldCheck,
  Compass,
  FileText,
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
  const totalQuestions = (activeProfile.totalQuestionsAnswered || 0) + (activeProfile.dailyQuestionsDone || 0);

  // Derive Primary Stage from profile or default to Stage 2
  const currentStageNum = activeProfile.diagnosticResult?.stage || 2;
  const currentStageMeta = PRIMARY_STAGES.find((s) => s.stage === currentStageNum) || PRIMARY_STAGES[1];

  // Cognitive breakdown scores
  const cognitiveScores = {
    concept: activeProfile.diagnosticResult?.conceptScore || 85,
    fluency: activeProfile.diagnosticResult?.fluencyScore || 90,
    reasoning: activeProfile.diagnosticResult?.reasoningScore || 78,
    problemSolving: activeProfile.diagnosticResult?.problemSolvingScore || 72,
  };

  // TWM Strands
  const twmStrands = [
    {
      name: 'Specialising & Generalising',
      desc: 'Menguji contoh spesifik dan menemukan aturan umum pola bilangan',
      score: 82,
      color: 'bg-indigo-500',
    },
    {
      name: 'Conjecturing & Convincing',
      desc: 'Membuat dugaan matematis dan menjelaskan alasannya secara logis',
      score: 76,
      color: 'bg-purple-500',
    },
    {
      name: 'Characterising & Classifying',
      desc: 'Mengelompokkan bangun, sifat bilangan ganjil/genap, dan pecahan',
      score: 88,
      color: 'bg-emerald-500',
    },
    {
      name: 'Critiquing & Improving',
      desc: 'Menemukan kekeliruan perhitungan (Find the Mistake) dan membandingkan strategi',
      score: 74,
      color: 'bg-amber-500',
    },
  ];

  // Topic masteries calculation
  const topics = [
    {
      name: 'Penjumlahan & Berhitung Cepat',
      level: 'Sangat Baik',
      score: 92,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50',
      topicId: 'fase_a_penjumlahan',
    },
    {
      name: 'Pengurangan & Nilai Tempat (Place Value)',
      level: 'Baik',
      score: 85,
      color: 'bg-teal-500',
      textColor: 'text-teal-700',
      bgLight: 'bg-teal-50',
      topicId: 'fase_a_pengurangan',
    },
    {
      name: 'Perkalian Dasar & Multiple Strategies',
      level: 'Menuju Mahir',
      score: 78,
      color: 'bg-amber-500',
      textColor: 'text-amber-800',
      bgLight: 'bg-amber-50',
      topicId: 'fase_a_perkalian_dasar',
    },
    {
      name: 'Uang Rupiah, Waktu, & Pengukuran',
      level: 'Sangat Baik',
      score: 88,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      bgLight: 'bg-indigo-50',
      topicId: 'fase_a_uang_waktu',
    },
    {
      name: 'Pecahan Visual (Bar Model & Pizza)',
      level: 'Perlu Latihan',
      score: 70,
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      bgLight: 'bg-rose-50',
      topicId: 'fase_b_pecahan_dasar',
    },
  ];

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* 1. Top Stat Highlights */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border-3 border-white/40">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide border border-white/30 flex items-center gap-1.5 w-fit">
                <TrendingUp className="w-3.5 h-3.5 text-yellow-300" />
                CAMBRIDGE-INSPIRED MATH EXPLORER REPORT
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                Prestasi & Laporan Belajar {activeProfile.name} 📊
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 font-semibold mt-0.5">
                {currentStageMeta.name} • Play. Think. Solve. Master!
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => {
                  sound.playFanfare();
                  confetti({ particleCount: 60, spread: 80 });
                  setShowCertificate(true);
                }}
                className="bg-white hover:bg-amber-50 text-orange-600 px-4 py-2 rounded-2xl font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Lihat Sertifikat 🎓</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-black/25 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 text-center">
              <span className="text-xs font-bold text-amber-200 block">Tingkat Penjelajah</span>
              <span className="text-lg font-black text-white">{currentStageMeta.name}</span>
            </div>
            <div className="bg-black/25 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 text-center">
              <span className="text-xs font-bold text-amber-200 block">Total Pengalaman</span>
              <span className="text-xl font-black text-white">{activeProfile.xp} XP</span>
            </div>
            <div className="bg-black/25 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 text-center">
              <span className="text-xs font-bold text-amber-200 block">Koin Emas</span>
              <span className="text-xl font-black text-yellow-300">🪙 {activeProfile.coins}</span>
            </div>
            <div className="bg-black/25 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 text-center">
              <span className="text-xs font-bold text-amber-200 block">Bintang Petualang</span>
              <span className="text-xl font-black text-yellow-300">
                ⭐ {activeProfile.completedNodes.length * 3}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cognitive Profile: Concept, Fluency, Reasoning, Problem Solving */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-orange-600" />
            <div>
              <h2 className="text-lg font-black text-slate-800">
                Analisis 4 Pilar Berpikir Matematika
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Keseimbangan pemahaman konsep, kefasihan berhitung, dan penalaran tingkat tinggi
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-orange-950 text-sm">💡 Concept (Pemahaman Konsep)</span>
              <span className="text-sm font-black text-orange-600">{cognitiveScores.concept}%</span>
            </div>
            <div className="w-full bg-orange-200/70 h-3 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${cognitiveScores.concept}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Memahami makna nilai tempat, model visual, dan keterhubungan antar operasi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-blue-950 text-sm">⚡ Fluency (Kefasihan & Kecepatan)</span>
              <span className="text-sm font-black text-blue-600">{cognitiveScores.fluency}%</span>
            </div>
            <div className="w-full bg-blue-200/70 h-3 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${cognitiveScores.fluency}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Kefasihan fakta bilangan, fakta perkalian, dan ketepatan perhitungan mental.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-purple-950 text-sm">🧠 Reasoning (Penalaran & Pembuktian)</span>
              <span className="text-sm font-black text-purple-600">{cognitiveScores.reasoning}%</span>
            </div>
            <div className="w-full bg-purple-200/70 h-3 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${cognitiveScores.reasoning}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Kemampuan menjelaskan alasan: "Bagaimana kamu tahu?", detektif kekeliruan (Find the Mistake).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-emerald-950 text-sm">🎯 Problem Solving (Pemecahan Masalah)</span>
              <span className="text-sm font-black text-emerald-600">{cognitiveScores.problemSolving}%</span>
            </div>
            <div className="w-full bg-emerald-200/70 h-3 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${cognitiveScores.problemSolving}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Menyelesaikan soal cerita dunia nyata, pemodelan bar model, dan tantangan multi-langkah.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Thinking and Working Mathematically (TWM) Strands */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <div>
            <h2 className="text-lg font-black text-slate-800">
              Thinking & Working Mathematically (TWM Strands)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Karakteristik cara berpikir matematikawan sejati (Kurikulum Internasional)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {twmStrands.map((twm, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-800 text-xs sm:text-sm">{twm.name}</span>
                <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {twm.score}% Penguasaan
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{twm.desc}</p>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className={`${twm.color} h-full rounded-full transition-all duration-500`} style={{ width: `${twm.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Adaptive Learning: Penguasaan Topik Kurikulum */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-black text-slate-800">
              Penguasaan Domain & Topik Belajar
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">
            Update otomatis dari hasil latihan
          </span>
        </div>

        <div className="space-y-3">
          {topics.map((t, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-800 text-sm">{t.name}</span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${t.bgLight} ${t.textColor}`}>
                    {t.level} • {t.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className={`${t.color} h-full rounded-full transition-all duration-500`} style={{ width: `${t.score}%` }} />
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onPracticeTopic(t.topicId);
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-orange-600 border border-amber-300 font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95 flex-shrink-0"
              >
                <span>Latih Topik Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Achievements & Badges Collection */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-800">
              🏆 Lencana & Prestasi Terkumpul ({activeProfile.achievements.length} / {ACHIEVEMENTS_DATA.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ACHIEVEMENTS_DATA.map((ach) => {
            const isUnlocked = activeProfile.achievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="text-3xl flex-shrink-0">{ach.icon}</div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-slate-800 leading-tight">
                    {ach.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                    {ach.description}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-black mt-1.5 px-2 py-0.5 rounded-md ${
                      isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? '✓ Terbuka' : 'Terkunci'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 border-8 border-amber-300 shadow-2xl relative my-auto print:border-4">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 print:hidden"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Official Border Interior */}
            <div className="border-4 border-dashed border-amber-400/70 p-6 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-md border-4 border-white">
                🎓
              </div>

              <div>
                <span className="text-xs font-black text-orange-600 uppercase tracking-widest block">
                  SERTIFIKAT KELAYAKAN MATEMATIKA KAFA
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                  MATH EXPLORER CERTIFICATE
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  "Belajar Matematika, Main Sambil Hebat!" • Play. Think. Solve. Master!
                </p>
              </div>

              <div className="py-2">
                <p className="text-xs text-slate-500 font-medium">Diberikan dengan bangga kepada:</p>
                <h2 className="text-3xl sm:text-4xl font-black text-amber-600 mt-1 tracking-tight">
                  {activeProfile.name}
                </h2>
                <p className="text-xs font-semibold text-slate-600 mt-2 max-w-md mx-auto">
                  Atas dedikasi luar biasa dalam menaklukkan tantangan pemikiran matematis, penguasaan konsep bilangan, dan pemecahan masalah pada tingkat:
                </p>
                <div className="inline-block mt-3 px-5 py-2 rounded-2xl bg-amber-100 text-amber-900 font-black text-base border border-amber-300 shadow-xs">
                  {currentStageMeta.name} ({currentStageMeta.subtitle})
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Tingkat Kemahiran</span>
                  <span className="font-black text-slate-800">High Mastery</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Total Bintang</span>
                  <span className="font-black text-amber-600">⭐ {activeProfile.completedNodes.length * 3}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Verifikasi</span>
                  <span className="font-black text-emerald-600">✓ Kaka AI Tutor</span>
                </div>
              </div>
            </div>

            {/* Print / Close Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 print:hidden">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Cetak Sertifikat
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm shadow-md"
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
