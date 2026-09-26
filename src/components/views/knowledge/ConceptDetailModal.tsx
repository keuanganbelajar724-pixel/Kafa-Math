import React, { useState } from 'react';
import { sound } from '../../../services/sound';
import { KnowledgeArticle } from '../../../data/knowledgeArticlesData';
import {
  X,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Trophy,
  Check,
  ChevronRight,
  Play,
  RotateCcw,
} from 'lucide-react';

interface ConceptDetailModalProps {
  article: KnowledgeArticle;
  isMastered: boolean;
  onToggleMastered: (id: string) => void;
  onClose: () => void;
  onLaunchGame?: (gameId: string) => void;
  onOpenTopicPractice?: (topicId: string) => void;
  onRewardXP?: (xp: number, reason: string) => void;
  onOpenLab?: (labId: string) => void;
}

const ARTICLE_LAB_MAP: Record<string, { labId: string; labTitle: string }> = {
  grade1_number_bonds_10: { labId: 'ten_frame', labTitle: 'Ten-Frame' },
  nilai_tempat_ratusan: { labId: 'coin_cashier', labTitle: 'Dompet Koin' },
  uang_rupiah_koin_belanja: { labId: 'coin_cashier', labTitle: 'Dompet Koin Kasir' },
  perkalian_matriks_array: { labId: 'multiplication_array', labTitle: 'Array Perkalian' },
  pecahan_pizza_bagian: { labId: 'pecahan_pizza', labTitle: 'Visualizer Pecahan' },
  jam_analog_durasi_menit: { labId: 'jam_analog', labTitle: 'Jam Analog & Durasi' },
  grade1_analog_clock_intro: { labId: 'jam_analog', labTitle: 'Jam Analog' },
  porogapit_bersusun: { labId: 'porogapit', labTitle: 'Porogapit Simulator' },
  keliling_luas_persegi: { labId: 'geometri_luas', labTitle: 'Luas & Keliling' },
  busur_derajat_sudut: { labId: 'angle_protractor', labTitle: 'Busur Derajat Sudut' },
  faktor_prima_faktorisasi: { labId: 'prime_factors', labTitle: 'Pohon Faktor' },
  fpb_kpk_cerita: { labId: 'prime_factors', labTitle: 'FPB & KPK' },
  tangga_satuan_metrik: { labId: 'metric_ladder', labTitle: 'Tangga Metrik' },
  segitiga_jkw_kecepatan: { labId: 'jkw_triangle', labTitle: 'Segitiga JKW' },
  statistika_mean_median_modus: { labId: 'mean_median_mode', labTitle: 'Statistika Cilik' },
  aljabar_neraca: { labId: 'bar_model', labTitle: 'Bar Model / Neraca' },
  cambridge_twm_bar_model: { labId: 'bar_model', labTitle: 'Bar Model TWM' },
  metode_singapura_before_after: { labId: 'bar_model', labTitle: 'Bar Model Singapura' },
  teorema_pythagoras: { labId: 'pythagoras', labTitle: 'Teorema Pythagoras' },
  simetri_lipat_putar: { labId: 'symmetry_lab', labTitle: 'Simetri Lipat' },
  trik_11: { labId: 'trik_11', labTitle: 'Trik Perkalian 11' },
  trik_kuadrat_5: { labId: 'kuadrat_5', labTitle: 'Kuadrat Berakhiran 5' },
};

export const ConceptDetailModal: React.FC<ConceptDetailModalProps> = ({
  article,
  isMastered,
  onToggleMastered,
  onClose,
  onLaunchGame,
  onOpenTopicPractice,
  onRewardXP,
  onOpenLab,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const relatedLab = ARTICLE_LAB_MAP[article.id];

  const handleSpeak = () => {
    sound.speak(`${article.title}. ${article.keyConcept}`);
  };

  const handleOptionClick = (idx: number) => {
    if (quizSubmitted) return;
    sound.playClick();
    setSelectedOption(idx);
  };

  const handleCheckQuiz = () => {
    if (selectedOption === null || !article.quiz) return;
    setQuizSubmitted(true);
    const correct = selectedOption === article.quiz.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      if (!isMastered) {
        onToggleMastered(article.id);
      }
      if (onRewardXP) {
        onRewardXP(15, `Memahami Konsep: ${article.title}`);
      }
    } else {
      sound.playIncorrect();
    }
  };

  const handleResetQuiz = () => {
    sound.playClick();
    setSelectedOption(null);
    setQuizSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pr-10">
            <span className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shrink-0 border border-white/20">
              {article.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-300/30">
                  {article.gradeBadge}
                </span>
                {isMastered && (
                  <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Tuntas Dikuasai
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-1 leading-snug text-white">
                {article.title}
              </h2>
              <p className="text-xs text-indigo-100 font-medium">{article.subtitle}</p>
            </div>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* Key Concept Box */}
          <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Inti Konsep Utama
              </span>
              <button
                onClick={handleSpeak}
                className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-xl border border-indigo-200 hover:bg-indigo-50 cursor-pointer shadow-2xs"
                title="Dengarkan Suara"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Bacakan</span>
              </button>
            </div>
            <p className="text-sm font-semibold text-indigo-950 leading-relaxed">
              {article.keyConcept}
            </p>
          </div>

          {/* Steps & Golden Rules */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Langkah Pengerjaan & Aturan Emas:
            </h3>
            <div className="space-y-2">
              {article.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-start gap-3 text-xs sm:text-sm font-semibold text-slate-700"
                >
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Problem */}
          {article.sampleProblem && (
            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 space-y-1 text-xs sm:text-sm text-amber-950">
              <span className="font-black text-amber-900 block text-xs uppercase tracking-wider">
                📝 Contoh Soal & Pembuktian Nyata:
              </span>
              <p className="font-medium leading-relaxed">{article.sampleProblem}</p>
            </div>
          )}

          {/* Interactive Mini-Quiz */}
          {article.quiz && (
            <div className="bg-slate-900 text-white rounded-3xl p-5 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  Kuis Kilat Uji Pemahaman (+15 XP)
                </span>
                {quizSubmitted && (
                  <button
                    onClick={handleResetQuiz}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Ulangi Kuis</span>
                  </button>
                )}
              </div>

              <p className="text-sm sm:text-base font-black text-white leading-snug">
                {article.quiz.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {article.quiz.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  let btnStyle = 'bg-white/10 hover:bg-white/15 text-white border-white/20';

                  if (quizSubmitted) {
                    if (oIdx === article.quiz!.correctIndex) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-400 shadow-md font-black';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500/80 text-white border-rose-400';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-300';
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={quizSubmitted}
                      onClick={() => handleOptionClick(oIdx)}
                      className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-left transition-all cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center font-mono text-xs shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted && selectedOption !== null && (
                <button
                  onClick={handleCheckQuiz}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-indigo-950 font-black text-xs cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Periksa Jawaban Kuis ✨
                </button>
              )}

              {quizSubmitted && (
                <div
                  className={`p-3 rounded-2xl border text-xs font-semibold leading-relaxed animate-in fade-in ${
                    isCorrect
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                      : 'bg-rose-500/20 text-rose-200 border-rose-400/40'
                  }`}
                >
                  <strong className="block text-sm font-black mb-0.5">
                    {isCorrect ? '🎉 Hebat! Jawaban Benar (+15 XP)!' : '😅 Belum Tepat, Ayo Coba Lagi!'}
                  </strong>
                  <span>{article.quiz.explanation}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            onClick={() => onToggleMastered(article.id)}
            className={`py-2 px-3.5 rounded-2xl text-xs font-black border flex items-center gap-2 cursor-pointer transition-all ${
              isMastered
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {isMastered ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Telah Dikuasai ✓</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-slate-400" />
                <span>Tandai Sudah Paham</span>
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {relatedLab && onOpenLab && (
              <button
                onClick={() => {
                  onClose();
                  onOpenLab(relatedLab.labId);
                }}
                className="py-2 px-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs border border-amber-300 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Lab: {relatedLab.labTitle}</span>
              </button>
            )}

            {article.relatedGameId && onLaunchGame && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchGame(article.relatedGameId!);
                }}
                className="py-2 px-3.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-black text-xs border border-purple-300 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Mainkan Game</span>
              </button>
            )}

            {article.relatedTopic && onOpenTopicPractice && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTopicPractice(article.relatedTopic!);
                }}
                className="py-2 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <span>Latihan Soal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
