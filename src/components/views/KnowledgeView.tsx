import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { ChildProfile } from '../../types';
import {
  BookOpen,
  Sparkles,
  Zap,
  Volume2,
  Search,
  CheckCircle2,
  ChevronRight,
  Calculator,
  Layers,
  Scale,
  Percent,
  Shapes,
  Clock,
  BarChart3,
  Lightbulb,
  Compass,
  ArrowRight,
  RotateCcw,
  Sliders,
  HelpCircle,
  Map,
  Check,
  Play,
  Circle,
  Trophy,
  Target,
  Filter,
  X,
  Award,
  Eye,
  CheckCheck,
} from 'lucide-react';
import {
  KnowledgeCategory,
  KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_ARTICLES,
  KnowledgeArticle,
} from '../../data/knowledgeArticlesData';
import { KnowledgeRoadmap } from './knowledge/KnowledgeRoadmap';
import { MentalMathHacksView } from './knowledge/MentalMathHacksView';
import { ConceptDetailModal } from './knowledge/ConceptDetailModal';
import { KnowledgeLabsCatalog } from './knowledge/KnowledgeLabsCatalog';

interface KnowledgeViewProps {
  activeProfile?: ChildProfile;
  onOpenTopicPractice?: (topicId: string) => void;
  onLaunchGame?: (gameId: string) => void;
  onRewardXP?: (xp: number, reason: string) => void;
}

type ViewMode = 'roadmap' | 'labs' | 'articles' | 'mental_hacks';
type ArticleStatusFilter = 'all' | 'unmastered' | 'mastered' | 'with_game';

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({
  activeProfile,
  onOpenTopicPractice,
  onLaunchGame,
  onRewardXP,
}) => {
  // Navigation View Mode
  const [viewMode, setViewMode] = useState<ViewMode>('roadmap');

  // Search & Filters for Articles
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<ArticleStatusFilter>('all');

  // Deep-dive Reader Modal State
  const [selectedArticleForModal, setSelectedArticleForModal] = useState<KnowledgeArticle | null>(null);

  // Filter & Highlight for Interactive Labs
  const [highlightedLabId, setHighlightedLabId] = useState<string | null>(null);

  // Mastered Articles Tracking
  const [masteredArticles, setMasteredArticles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kafa_mastered_articles');
      return saved ? JSON.parse(saved) : ['grade1_counting_objects', 'grade1_number_bonds_10'];
    } catch {
      return ['grade1_counting_objects', 'grade1_number_bonds_10'];
    }
  });

  const toggleMasterArticle = (articleId: string) => {
    sound.playClick();
    setMasteredArticles((prev) => {
      const next = prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId];
      try {
        localStorage.setItem('kafa_mastered_articles', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Text to Speech
  const handleSpeak = (text: string) => {
    sound.speak(text);
  };

  // Jump from Roadmap to specific lab
  const handleJumpToLab = (labId: string) => {
    sound.playClick();
    setViewMode('labs');
    setHighlightedLabId(labId);
    setTimeout(() => {
      const el = document.getElementById(`lab_${labId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Extract numeric grade from profile
  const currentGradeNum = (() => {
    if (!activeProfile?.grade) return undefined;
    if (typeof activeProfile.grade === 'number') return activeProfile.grade;
    const match = String(activeProfile.grade).match(/\d+/);
    return match ? parseInt(match[0], 10) : undefined;
  })();

  // Filtered articles
  const filteredArticles = KNOWLEDGE_ARTICLES.filter((art) => {
    const isMastered = masteredArticles.includes(art.id);
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.keyConcept.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade =
      selectedGradeFilter === 'all' ||
      (selectedGradeFilter === 'grade1_2' && (art.gradeBadge.includes('1') || art.gradeBadge.includes('2'))) ||
      (selectedGradeFilter === 'grade3_4' && (art.gradeBadge.includes('3') || art.gradeBadge.includes('4'))) ||
      (selectedGradeFilter === 'grade5_6' && (art.gradeBadge.includes('5') || art.gradeBadge.includes('6'))) ||
      (selectedGradeFilter === 'cambridge' && (art.category === 'cambridge' || art.gradeBadge.includes('Stage')));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unmastered' && !isMastered) ||
      (statusFilter === 'mastered' && isMastered) ||
      (statusFilter === 'with_game' && !!art.relatedGameId);

    return matchesCat && matchesSearch && matchesGrade && matchesStatus;
  });

  const masteryPercentage = Math.round((masteredArticles.length / KNOWLEDGE_ARTICLES.length) * 100);

  return (
    <div className="space-y-6 pb-24 sm:pb-8 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* 1. HERO HEADER: PUSAT PENGETAHUAN & KONSEP MATEMATIKA                     */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/30">
              <BookOpen className="w-4 h-4 text-amber-300" />
              Pusat Pengetahuan & Konsep
            </span>
            <span className="bg-amber-400 text-indigo-950 font-black px-2.5 py-1 rounded-full text-xs shadow-xs">
              Bebas Akses Terbuka
            </span>
            <span className="bg-blue-500/50 text-white font-extrabold px-2.5 py-1 rounded-full text-xs border border-white/20">
              Kurikulum Merdeka & Cambridge
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Pelajari Konsep, Pahami Cara Kerjanya 💡
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 font-medium leading-relaxed">
            Eksplorasi konsep matematika interaktif, metode Cambridge Thinking (TWM), trik berhitung cepat, dan visualisasi pemecahan soal tanpa rumus buta.
          </p>

          {/* Quick Mastery Progress Indicator */}
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 max-w-lg space-y-2 pt-3">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-indigo-100 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-300" />
                Progres Penguasaan Materi:
              </span>
              <span className="text-amber-300 font-mono text-sm">
                {masteredArticles.length} dari {KNOWLEDGE_ARTICLES.length} Materi ({masteryPercentage}%)
              </span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${masteryPercentage}%` }}
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Decorative background vectors */}
        <div className="absolute right-4 -bottom-6 text-8xl opacity-15 select-none pointer-events-none hidden sm:block">
          📐
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN SEGMENTED NAVIGATION TAB BAR                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-2.5 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setViewMode('roadmap');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              viewMode === 'roadmap'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Alur Belajar</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setViewMode('labs');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              viewMode === 'labs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Laboratorium (18)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setViewMode('articles');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              viewMode === 'articles'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Kamus Konsep ({KNOWLEDGE_ARTICLES.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setViewMode('mental_hacks');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              viewMode === 'mental_hacks'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>Rumus Sakti</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. VIEW: ROADMAP (PETA ALUR BELAJAR BERTAHAP)                            */}
      {/* ========================================================================= */}
      {viewMode === 'roadmap' && (
        <KnowledgeRoadmap
          activeGrade={currentGradeNum}
          onOpenLab={handleJumpToLab}
          onLaunchGame={onLaunchGame}
          onOpenTopicPractice={onOpenTopicPractice}
          onSelectArticle={(art) => setSelectedArticleForModal(art)}
          masteredArticleIds={masteredArticles}
          onRewardXP={onRewardXP}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. VIEW: MENTAL MATH HACKS HANDBOOK                                      */}
      {/* ========================================================================= */}
      {viewMode === 'mental_hacks' && (
        <MentalMathHacksView onLaunchGame={onLaunchGame} />
      )}

      {/* ========================================================================= */}
      {/* 5. VIEW: INTERACTIVE LABS (18 Modular Labs)                              */}
      {/* ========================================================================= */}
      {viewMode === 'labs' && (
        <KnowledgeLabsCatalog highlightedLabId={highlightedLabId} />
      )}

      {/* ========================================================================= */}
      {/* 6. VIEW: ARTICLES & CONCEPT CATALOG                                      */}
      {/* ========================================================================= */}
      {viewMode === 'articles' && (
        <div className="space-y-5">
          {/* Search & Filters Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari materi (misal: Pythagoras, Porogapit, Simetri, Pecahan, FPB, Rata-rata)..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'Semua Status' },
                { id: 'unmastered', label: '⏳ Belum Dikuasai' },
                { id: 'mastered', label: '✓ Sudah Dikuasai' },
                { id: 'with_game', label: '🎮 Ada Game' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    sound.playClick();
                    setStatusFilter(st.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs whitespace-nowrap cursor-pointer transition-all border ${
                    statusFilter === st.id
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Grade Level Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1 shrink-0">
                Jenjang:
              </span>
              {[
                { id: 'all', label: 'Semua Jenjang' },
                { id: 'grade1_2', label: 'SD Kelas 1 - 2' },
                { id: 'grade3_4', label: 'SD Kelas 3 - 4' },
                { id: 'grade5_6', label: 'SD Kelas 5 - 6' },
                { id: 'cambridge', label: 'Cambridge TWM' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedGradeFilter(g.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs whitespace-nowrap cursor-pointer transition-all border ${
                    selectedGradeFilter === g.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Category Pills Slider */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {KNOWLEDGE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCategory(cat.id);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-105'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Articles Count & Summary */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Daftar Materi & Konsep ({filteredArticles.length})
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Dikuasai: <strong className="text-emerald-600">{masteredArticles.length}</strong> / {KNOWLEDGE_ARTICLES.length}
            </span>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((art) => {
              const isMastered = masteredArticles.includes(art.id);

              return (
                <div
                  key={art.id}
                  className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all space-y-4 flex flex-col justify-between shadow-xs hover:shadow-md ${
                    isMastered
                      ? 'border-emerald-300 ring-2 ring-emerald-50'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shrink-0">
                          {art.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                              {art.gradeBadge}
                            </span>
                            {isMastered && (
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Dikuasai
                              </span>
                            )}
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug">
                            {art.title}
                          </h3>
                          <p className="text-xs font-bold text-slate-500">{art.subtitle}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSpeak(`${art.title}. ${art.keyConcept}`)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 border border-slate-200 cursor-pointer transition-colors shrink-0"
                        title="Dengarkan Penjelasan"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Key Concept Box */}
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 text-xs font-medium text-slate-700 leading-relaxed">
                      <span className="font-black text-indigo-900 block mb-1">💡 Inti Konsep:</span>
                      {art.keyConcept}
                    </div>

                    {/* Steps / Rules */}
                    <div className="space-y-1.5 pl-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                        Penjabaran & Aturan:
                      </span>
                      {art.steps.slice(0, 3).map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {/* View Details / Quiz Modal Button */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        setSelectedArticleForModal(art);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs border border-indigo-200 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Baca Pembahasan Lengkap & Kuis</span>
                    </button>

                    <div className="flex items-center justify-between gap-2">
                      {art.relatedGameId && onLaunchGame && (
                        <button
                          onClick={() => onLaunchGame(art.relatedGameId!)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-black cursor-pointer transition-transform active:scale-95"
                        >
                          <span>Game</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {art.relatedTopic && onOpenTopicPractice && (
                        <button
                          onClick={() => onOpenTopicPractice(art.relatedTopic!)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black cursor-pointer shadow-xs transition-transform active:scale-95"
                        >
                          <span>Latihan Soal</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Toggle Mastered Button */}
                    <button
                      onClick={() => toggleMasterArticle(art.id)}
                      className={`w-full py-1.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        isMastered
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isMastered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Telah Dikuasai</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Tandai Sudah Dipahami</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CONCEPT DETAIL & MINI-QUIZ MODAL                                      */}
      {/* ========================================================================= */}
      {selectedArticleForModal && (
        <ConceptDetailModal
          article={selectedArticleForModal}
          isMastered={masteredArticles.includes(selectedArticleForModal.id)}
          onToggleMastered={toggleMasterArticle}
          onClose={() => setSelectedArticleForModal(null)}
          onLaunchGame={onLaunchGame}
          onOpenTopicPractice={onOpenTopicPractice}
          onRewardXP={onRewardXP}
          onOpenLab={handleJumpToLab}
        />
      )}
    </div>
  );
};
