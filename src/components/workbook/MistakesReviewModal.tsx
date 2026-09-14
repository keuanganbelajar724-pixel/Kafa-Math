import React, { useState } from 'react';
import { MistakeItem } from '../../types';
import { X, CheckCircle2, RotateCcw, AlertCircle, Award, Sparkles } from 'lucide-react';
import { sound } from '../../services/sound';

interface MistakesReviewModalProps {
  mistakes: MistakeItem[];
  childName: string;
  onResolveMistake: (mistakeId: string) => void;
  onRewardBonusXP: (xp: number) => void;
  onClose: () => void;
}

export const MistakesReviewModal: React.FC<MistakesReviewModalProps> = ({
  mistakes,
  childName,
  onResolveMistake,
  onRewardBonusXP,
  onClose,
}) => {
  const [activeMistakeId, setActiveMistakeId] = useState<string | null>(
    mistakes.find((m) => !m.resolved)?.id || null
  );
  const [retryInput, setRetryInput] = useState('');
  const [retryStatus, setRetryStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const unresolved = mistakes.filter((m) => !m.resolved);
  const currentMistake = mistakes.find((m) => m.id === activeMistakeId);

  const handleTestRetry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMistake || !retryInput.trim()) return;

    const isMatch =
      retryInput.trim().toLowerCase() === currentMistake.question.answer.trim().toLowerCase() ||
      (currentMistake.question.acceptedAnswers &&
        currentMistake.question.acceptedAnswers.some(
          (ans) => ans.trim().toLowerCase() === retryInput.trim().toLowerCase()
        ));

    if (isMatch) {
      sound.playCorrect();
      setRetryStatus('correct');
      onResolveMistake(currentMistake.id);
      onRewardBonusXP(15); // +15 XP bonus for overcoming mistake
    } else {
      sound.playIncorrect();
      setRetryStatus('wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 border-3 border-amber-300 shadow-2xl relative my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 leading-tight">
                Review & Ulangi Kesalahan
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Belajar dari kesalahan adalah rahasia jadi jago matematika!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          {mistakes.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="text-5xl">🌟</div>
              <h4 className="text-lg font-black text-slate-800">
                Hebat Sekali, {childName}!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Tidak ada soal yang salah saat ini. Terus pertahankan ketelitianmu dalam berhitung!
              </p>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-rose-500" />
                  <div>
                    <span className="text-[11px] font-bold text-rose-600 block">Perlu Diulang</span>
                    <span className="text-lg font-black text-rose-800">{unresolved.length} Soal</span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 block">Sudah Dikuasai</span>
                    <span className="text-lg font-black text-emerald-800">
                      {mistakes.length - unresolved.length} Soal
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Practice Card */}
              {currentMistake && (
                <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-3xl border-2 border-amber-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-orange-600">
                      Latihan Ulang • {currentMistake.question.category}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      Salah {currentMistake.timesWrong}x sebelumnya
                    </span>
                  </div>

                  <p className="text-base sm:text-lg font-black text-slate-900">
                    {currentMistake.question.question}
                  </p>

                  {/* Previous wrong input note */}
                  <div className="text-xs text-slate-500 bg-white/70 p-2 rounded-xl border border-amber-200">
                    <span>Jawabanmu sebelumnya: </span>
                    <span className="font-bold text-rose-600 line-through">
                      {currentMistake.wrongAnswer}
                    </span>
                  </div>

                  {/* Retry form */}
                  <form onSubmit={handleTestRetry} className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={retryInput}
                      onChange={(e) => {
                        setRetryInput(e.target.value);
                        setRetryStatus('idle');
                      }}
                      placeholder="Coba jawab lagi..."
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-white border-2 border-slate-300 focus:border-orange-500 font-black text-base outline-none"
                    />
                    <button
                      type="submit"
                      className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-2xl cursor-pointer shadow-md active:scale-95"
                    >
                      Periksa
                    </button>
                  </form>

                  {/* Feedback feedback */}
                  {retryStatus === 'correct' && (
                    <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 font-bold text-xs animate-in zoom-in-95">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Luar biasa! Kamu berhasil menaklukkan soal ini (+15 XP)!</span>
                      </div>
                      <span className="text-lg">🎉</span>
                    </div>
                  )}

                  {retryStatus === 'wrong' && (
                    <div className="p-3 bg-rose-100 border border-rose-300 rounded-2xl flex items-center gap-2 text-rose-900 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>Belum tepat. Coba perhatikan kembali petunjuknya ya!</span>
                    </div>
                  )}
                </div>
              )}

              {/* List of Mistake Items */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider">
                  Daftar Riwayat Soal:
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {mistakes.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setActiveMistakeId(m.id);
                        setRetryInput('');
                        setRetryStatus('idle');
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        m.id === activeMistakeId
                          ? 'border-orange-400 bg-orange-50/50'
                          : m.resolved
                          ? 'border-emerald-200 bg-emerald-50/40 text-slate-500'
                          : 'border-slate-200 bg-white hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {m.resolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <RotateCcw className="w-4 h-4 text-rose-500" />
                        )}
                        <div>
                          <p className="font-bold text-xs text-slate-800 line-clamp-1">
                            {m.question.question}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {m.question.category} • Ditambahkan {m.dateAdded}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          m.resolved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {m.resolved ? 'Dikuasai' : 'Latihan'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
