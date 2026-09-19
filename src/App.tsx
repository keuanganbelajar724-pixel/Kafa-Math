import React, { useState, useEffect } from 'react';
import {
  ChildProfile,
  ParentSettings,
  MapNode,
  QuestionItem,
  ShopItem,
  LearningPhase,
} from './types';
import {
  loadProfiles,
  saveProfiles,
  loadParentSettings,
  saveParentSettings,
  updateProfileStats,
  unlockAchievement,
  addCompletedNode,
} from './services/storage';
import { generateQuestion } from './services/questionEngine';
import { sound } from './services/sound';
import { getGradeFromProfile } from './data/curriculumData';
import {
  fetchProfilesFromFirestore,
  saveProfileToFirestore,
  fetchParentSettingsFromFirestore,
  saveParentSettingsToFirestore,
  ensureAuthUser,
} from './services/firestoreSync';

// Components
import { Navbar } from './components/Navbar';
import { ChildDashboard } from './components/ChildDashboard';
import { QuestionModal } from './components/QuestionModal';
import { AITutorModal } from './components/AITutorModal';
import { ParentDashboard } from './components/ParentDashboard';
import { WorksheetGenerator } from './components/WorksheetGenerator';
import { DiagnosticTestModal } from './components/DiagnosticTestModal';
import { AvatarShopModal } from './components/AvatarShopModal';
import { ProfileSelectorModal } from './components/ProfileSelectorModal';
import { ScreenTimeAlert } from './components/ScreenTimeAlert';
import { MathLaboratoryModal } from './components/MathLaboratoryModal';
import { ExamSimulationModal } from './components/ExamSimulationModal';
import { MathDuelModal } from './components/MathDuelModal';
import { FormulaHandbookModal } from './components/FormulaHandbookModal';

// 5 Core Game Views & Modern Game Navigation
import { WORLDS_DATA } from './data/worldsData';
import { HomeView } from './components/views/HomeView';
import { KnowledgeView } from './components/views/KnowledgeView';
import { PracticeView } from './components/views/PracticeView';
import { MapView } from './components/views/MapView';
import { GameView } from './components/views/GameView';
import { BottomNavigation, MainTabType } from './components/BottomNavigation';
import { DesktopSidebar } from './components/DesktopSidebar';
import { LevelChallengeModal } from './components/LevelChallengeModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { DigitalWorkbookView } from './components/workbook/DigitalWorkbookView';
import { ExamModeModal } from './components/workbook/ExamModeModal';
import { QuickMathModal } from './components/workbook/QuickMathModal';
import { MistakesReviewModal } from './components/workbook/MistakesReviewModal';
import { loadMistakes, resolveMistake } from './services/storage';
import { getStoredLanguage, saveStoredLanguage, Language } from './services/i18n';

// Minigames
import { MakanKerupukGame } from './components/minigames/MakanKerupukGame';
import { TarikTambangGame } from './components/minigames/TarikTambangGame';
import { CatchNumberGame } from './components/minigames/CatchNumberGame';
import { WarungRupiahGame } from './components/minigames/WarungRupiahGame';
import { FractionPizzaGame } from './components/minigames/FractionPizzaGame';
import { RacingMathGame } from './components/minigames/RacingMathGame';
import { InteractiveClockGame } from './components/minigames/InteractiveClockGame';
import { GardenCounterGame } from './components/minigames/GardenCounterGame';
import { BalanceScaleGame } from './components/minigames/BalanceScaleGame';
import { GeometryBuilderGame } from './components/minigames/GeometryBuilderGame';
import { PatternGuessGame } from './components/minigames/PatternGuessGame';
import { BarChartCollectorGame } from './components/minigames/BarChartCollectorGame';
import { OrderNumberTrainGame } from './components/minigames/OrderNumberTrainGame';
import { MatchCardsGame } from './components/minigames/MatchCardsGame';
import { TempleEscapeGame } from './components/minigames/TempleEscapeGame';
import { PirateSeaVoyageGame } from './components/minigames/PirateSeaVoyageGame';
import { TowerDefenseMathGame } from './components/minigames/TowerDefenseMathGame';
import { JungleSafariRescueGame } from './components/minigames/JungleSafariRescueGame';
import { SpaceExplorerGame } from './components/minigames/SpaceExplorerGame';
import { MinecartTreasureRushGame } from './components/minigames/MinecartTreasureRushGame';
import { MathVsMonsterBattleGame } from './components/minigames/MathVsMonsterBattleGame';
import { CakeFractionSlicerGame } from './components/minigames/CakeFractionSlicerGame';
import { DrawLineMatchGame } from './components/minigames/DrawLineMatchGame';
import { PlaceValueBlocksGame } from './components/minigames/PlaceValueBlocksGame';
import { RulerMeasurementGame } from './components/minigames/RulerMeasurementGame';
import { NumberLineFrogGame } from './components/minigames/NumberLineFrogGame';
import { TangramSymmetryGame } from './components/minigames/TangramSymmetryGame';
import { LiquidMeasuringJugGame } from './components/minigames/LiquidMeasuringJugGame';
import { BarChartBuilderGame } from './components/minigames/BarChartBuilderGame';
import { PanBalanceAlgebraGame } from './components/minigames/PanBalanceAlgebraGame';
import { AngleProtractorLabGame } from './components/minigames/AngleProtractorLabGame';
import { VennDiagramSorterGame } from './components/minigames/VennDiagramSorterGame';
import { GeoboardLabGame } from './components/minigames/GeoboardLabGame';
import { TwentyNewGamesRouter, TWENTY_NEW_GAME_IDS } from './components/minigames/TwentyNewGamesRouter';

export const App: React.FC = () => {
  // Profiles and Settings
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => loadProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    const list = loadProfiles();
    return list[0]?.id || 'child_default';
  });
  const [parentSettings, setParentSettings] = useState<ParentSettings>(() => loadParentSettings());

  // Active child profile
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  // Active question modal
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem | null>(null);
  const [activeNode, setActiveNode] = useState<MapNode | null>(null);

  // Active minigame modal
  const [activeMinigameId, setActiveMinigameId] = useState<string | null>(null);

  // Modals state
  const [showAITutor, setShowAITutor] = useState<boolean>(false);
  const [showParentDashboard, setShowParentDashboard] = useState<boolean>(false);
  const [showWorksheetGenerator, setShowWorksheetGenerator] = useState<boolean>(false);
  const [showDiagnostic, setShowDiagnostic] = useState<boolean>(false);
  const [showShop, setShowShop] = useState<boolean>(false);
  const [showProfilesModal, setShowProfilesModal] = useState<boolean>(false);
  const [showScreenTimeAlert, setShowScreenTimeAlert] = useState<boolean>(false);
  const [showMathLab, setShowMathLab] = useState<boolean>(false);
  const [showExamSimulation, setShowExamSimulation] = useState<boolean>(false);
  const [showMathDuel, setShowMathDuel] = useState<boolean>(false);
  const [showFormulaHandbook, setShowFormulaHandbook] = useState<boolean>(false);

  // Digital Workbook & Assessment Modals
  const [showExamMode, setShowExamMode] = useState<boolean>(false);
  const [showQuickMath, setShowQuickMath] = useState<boolean>(false);
  const [showMistakes, setShowMistakes] = useState<boolean>(false);

  // Active Main Navigation Tab (Home, Workbook, Map, Game, Progress, Profile)
  const [mainTab, setMainTab] = useState<MainTabType>('home');
  const [selectedLevelNode, setSelectedLevelNode] = useState<MapNode | null>(null);
  const [showDailyChallenge, setShowDailyChallenge] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => getStoredLanguage());

  const handleToggleLanguage = () => {
    const nextLang = currentLanguage === 'id' ? 'en' : 'id';
    setCurrentLanguage(nextLang);
    saveStoredLanguage(nextLang);
  };

  // Session time tracker (minutes)
  const [sessionMinutes, setSessionMinutes] = useState<number>(0);

  // Initial load from Firestore on startup
  useEffect(() => {
    ensureAuthUser().then(async () => {
      try {
        const remoteProfiles = await fetchProfilesFromFirestore();
        if (remoteProfiles && remoteProfiles.length > 0) {
          setProfiles(remoteProfiles);
        } else {
          // Upload initial defaults to Firestore
          for (const p of profiles) {
            await saveProfileToFirestore(p);
          }
        }

        const remoteSettings = await fetchParentSettingsFromFirestore();
        if (remoteSettings) {
          setParentSettings(remoteSettings);
        }
      } catch (e) {
        console.warn('Initial Firestore sync note:', e);
      }
    });
  }, []);

  // Save changes to storage & Firestore whenever profiles or settings change
  useEffect(() => {
    saveProfiles(profiles);
    // Push active profile updates to Firestore in background
    if (activeProfile) {
      saveProfileToFirestore(activeProfile).catch(() => {});
    }
  }, [profiles]);

  useEffect(() => {
    saveParentSettings(parentSettings);
    sound.setVoiceOver(parentSettings.voiceOverEnabled);
    sound.setSpeechRate(parentSettings.speechRate);
    saveParentSettingsToFirestore(parentSettings).catch(() => {});
  }, [parentSettings]);

  // Session Timer for Healthy Screen-Time alert
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionMinutes((prev) => {
        const next = prev + 1;
        if (next === parentSettings.dailyTimeLimitMinutes) {
          setShowScreenTimeAlert(true);
        }
        return next;
      });
    }, 60000); // every 1 min
    return () => clearInterval(interval);
  }, [parentSettings.dailyTimeLimitMinutes]);

  // Handler to update active child profile
  const handleUpdateProfile = (updated: ChildProfile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleChangeGrade = (gradeLevel: number) => {
    let grade = 'SD Kelas 1';
    let phase = LearningPhase.FASE_A;
    if (gradeLevel === 0) {
      grade = 'PAUD/TK';
      phase = LearningPhase.PONDASI;
    } else if (gradeLevel === 1) {
      grade = 'SD Kelas 1';
      phase = LearningPhase.FASE_A;
    } else if (gradeLevel === 2) {
      grade = 'SD Kelas 2';
      phase = LearningPhase.FASE_A;
    } else if (gradeLevel === 3) {
      grade = 'SD Kelas 3';
      phase = LearningPhase.FASE_B;
    } else if (gradeLevel === 4) {
      grade = 'SD Kelas 4';
      phase = LearningPhase.FASE_B;
    } else if (gradeLevel === 5) {
      grade = 'SD Kelas 5';
      phase = LearningPhase.FASE_C;
    } else if (gradeLevel === 6) {
      grade = 'SD Kelas 6';
      phase = LearningPhase.FASE_C;
    }

    const updated: ChildProfile = {
      ...activeProfile,
      grade,
      phase,
    };
    handleUpdateProfile(updated);
    sound.speak(`Kurikulum aktif berhasil diubah ke ${grade}!`);
  };

  const handleCreateNewProfile = (name: string, grade: string) => {
    let phase = LearningPhase.FASE_A;
    if (grade === 'PAUD/TK') phase = LearningPhase.PONDASI;
    else if (grade === 'SD Kelas 3' || grade === 'SD Kelas 4') phase = LearningPhase.FASE_B;
    else if (grade === 'SD Kelas 5' || grade === 'SD Kelas 6') phase = LearningPhase.FASE_C;

    const newProfile: ChildProfile = {
      id: `child_${Date.now()}`,
      name,
      grade,
      phase,
      avatar: '🦊',
      xp: 0,
      level: 1,
      coins: 50,
      streak: 1,
      lastActiveDate: new Date().toISOString(),
      dailyQuestionsDone: 0,
      totalMinutesSpent: 0,
      completedNodes: [],
      achievements: ['ach_first_step'],
      unlockedCosmetics: ['hat_blangkon'],
    };

    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    sound.speak(`Halo ${name}! Selamat datang di petualangan matematika!`);
  };

  // Game Launch Router (supports both standalone modals like Math Duel / Lab and overlay minigames)
  const handleLaunchGame = (id: string) => {
    if (id === 'math_duel') {
      setShowMathDuel(true);
    } else if (id === 'math_lab') {
      setShowMathLab(true);
    } else if (id === 'exam_simulation') {
      setShowExamSimulation(true);
    } else {
      setActiveMinigameId(id);
    }
  };

  // Node Selection from Adventure Map
  const handleSelectNode = (node: MapNode) => {
    setActiveNode(node);
    if (node.type === 'game' && node.minigameId) {
      handleLaunchGame(node.minigameId);
    } else {
      // Launch 10-challenge Level Runner!
      setSelectedLevelNode(node);
    }
  };

  // Continue Learning: finds next node in progression
  const handleContinueLearning = () => {
    const allNodes = WORLDS_DATA.flatMap((w) => w.nodes);
    const nextNode =
      allNodes.find((n) => !activeProfile.completedNodes.includes(n.id)) || allNodes[0];
    handleSelectNode(nextNode);
  };

  // Level 10-Challenge Completion
  const handleCompleteLevelChallenges = (stars: number, xpEarned: number, coinsEarned: number) => {
    let updated = updateProfileStats(activeProfile, xpEarned, coinsEarned);
    if (selectedLevelNode) {
      updated = addCompletedNode(updated, selectedLevelNode.id);
    }
    if (!updated.achievements.includes('ach_first_step')) {
      updated = unlockAchievement(updated, 'ach_first_step');
    }
    if (updated.completedNodes.length >= 5 && !updated.achievements.includes('ach_island_explorer')) {
      updated = unlockAchievement(updated, 'ach_island_explorer');
    }
    handleUpdateProfile(updated);
    setSelectedLevelNode(null);
  };

  // Daily Challenge Completion
  const handleCompleteDailyChallenge = (bonusXP: number, bonusCoins: number) => {
    let updated = updateProfileStats(activeProfile, bonusXP, bonusCoins);
    updated = {
      ...updated,
      dailyQuestionsDone: (updated.dailyQuestionsDone || 0) + 10,
    };
    if (!updated.achievements.includes('ach_streak_3')) {
      updated = unlockAchievement(updated, 'ach_streak_3');
    }
    handleUpdateProfile(updated);
  };

  // Question Answer handlers
  const handleQuestionAnswerCorrect = (xpReward: number, coinReward: number) => {
    sound.playCorrect();
    let updated = updateProfileStats(activeProfile, xpReward, coinReward);
    if (activeNode) {
      updated = addCompletedNode(updated, activeNode.id);
    }
    // Check first win achievement
    if (!updated.achievements.includes('ach_first_step')) {
      updated = unlockAchievement(updated, 'ach_first_step');
    }
    handleUpdateProfile(updated);
    setCurrentQuestion(null);
  };

  const handleQuestionAnswerIncorrect = () => {
    // Keep record or gentle feedback
  };

  // Minigame completion handler
  const handleMinigameComplete = (score: number, stars: number) => {
    sound.playFanfare();
    const xpReward = score;
    const coinReward = Math.round(score / 3);
    let updated = updateProfileStats(activeProfile, xpReward, coinReward);
    if (activeNode) {
      updated = addCompletedNode(updated, activeNode.id);
    }
    if (!updated.achievements.includes('ach_minigame_master')) {
      updated = unlockAchievement(updated, 'ach_minigame_master');
    }
    handleUpdateProfile(updated);
    setActiveMinigameId(null);
  };

  // Shop purchase
  const handleBuyShopItem = (item: ShopItem) => {
    if (activeProfile.coins >= item.cost) {
      const updated: ChildProfile = {
        ...activeProfile,
        coins: activeProfile.coins - item.cost,
        unlockedCosmetics: [...activeProfile.unlockedCosmetics, item.id],
      };
      handleUpdateProfile(updated);
    }
  };

  // Diagnostic Test completion
  const handleDiagnosticComplete = (recommendedPhase: LearningPhase, score: number, stage?: any, assessment?: any) => {
    const updated: ChildProfile = {
      ...activeProfile,
      phase: recommendedPhase,
      stage: stage || activeProfile.stage || 2,
      diagnosticCompleted: true,
      diagnosticAssessment: assessment,
      diagnosticResult: assessment,
      xp: activeProfile.xp + 50,
      coins: activeProfile.coins + 30,
    };
    handleUpdateProfile(updated);
    setShowDiagnostic(false);
  };

  const handleRewardXP = (xp: number, coins: number) => {
    const updated = updateProfileStats(activeProfile, xp, coins);
    handleUpdateProfile(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex text-slate-900 font-sans selection:bg-emerald-200">
      {/* Desktop Sidebar (visible on md screens and up) */}
      <DesktopSidebar
        activeTab={mainTab}
        onChangeTab={(tab) => setMainTab(tab)}
        activeProfile={activeProfile}
        parentSettings={parentSettings}
        onOpenParentDashboard={() => setShowParentDashboard(true)}
        onOpenShop={() => setShowShop(true)}
        onToggleVoice={() =>
          setParentSettings((prev) => ({ ...prev, voiceOverEnabled: !prev.voiceOverEnabled }))
        }
        currentLanguage={currentLanguage}
        onToggleLanguage={handleToggleLanguage}
        onChangeGrade={handleChangeGrade}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar
          activeProfile={activeProfile}
          parentSettings={parentSettings}
          onNavigateHome={() => setMainTab('home')}
          onOpenWorkbook={() => setMainTab('workbook')}
          onOpenProfiles={() => setShowProfilesModal(true)}
          onOpenParentDashboard={() => setShowParentDashboard(true)}
          onOpenShop={() => setShowShop(true)}
          onOpenAITutor={() => setShowAITutor(true)}
          onOpenMathLab={() => setShowMathLab(true)}
          onOpenExamSimulation={() => setShowExamMode(true)}
          onOpenMathDuel={() => setShowMathDuel(true)}
          onOpenFormulaHandbook={() => setShowFormulaHandbook(true)}
          onOpenWorksheets={() => setShowWorksheetGenerator(true)}
          onToggleVoice={() =>
            setParentSettings((prev) => ({ ...prev, voiceOverEnabled: !prev.voiceOverEnabled }))
          }
          currentLanguage={currentLanguage}
          onToggleLanguage={handleToggleLanguage}
        />

        {/* Main Content Area: Modern Game & Knowledge Views */}
        <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 flex-1">
          {mainTab === 'home' && (
            <HomeView
              activeProfile={activeProfile}
              onContinueLearning={() => setMainTab('theory')}
              onOpenDailyChallenge={() => setShowDailyChallenge(true)}
              onNavigateTab={(tab) => setMainTab(tab)}
              onLaunchMinigame={handleLaunchGame}
              onStartQuickQuestion={(topicId) => {
                const q = generateQuestion(activeProfile.phase, topicId, 1);
                setCurrentQuestion(q);
              }}
              onChangeGrade={handleChangeGrade}
              onOpenExamMode={() => setShowExamMode(true)}
              onOpenQuickMath={() => setShowQuickMath(true)}
              onOpenMistakes={() => setShowMistakes(true)}
              onOpenWorksheets={() => setShowWorksheetGenerator(true)}
            />
          )}
          {mainTab === 'theory' && (
            <KnowledgeView
              onOpenTopicPractice={(topicId) => {
                const q = generateQuestion(activeProfile.phase, topicId as any, 1);
                setCurrentQuestion(q);
              }}
              onLaunchGame={handleLaunchGame}
            />
          )}
          {mainTab === 'game' && (
            <GameView
              activeProfile={activeProfile}
              onLaunchMinigame={handleLaunchGame}
              onRewardXP={handleRewardXP}
            />
          )}
          {mainTab === 'workbook' && (
            <PracticeView
              activeProfile={activeProfile}
              onRewardXP={handleRewardXP}
              onAskAITutor={(question) => {
                setShowAITutor(true);
              }}
              onOpenExamMode={() => setShowExamMode(true)}
              onOpenQuickMath={() => setShowQuickMath(true)}
              onOpenMistakes={() => setShowMistakes(true)}
              onOpenWorksheets={() => setShowWorksheetGenerator(true)}
            />
          )}
          {mainTab === 'map' && (
            <MapView
              activeProfile={activeProfile}
              onSelectNode={handleSelectNode}
            />
          )}
        </main>

        {/* Touch-Friendly Bottom Navigation (Mobile & Tablet) */}
        <div className="md:hidden">
          <BottomNavigation
            activeTab={mainTab}
            onChangeTab={(tab) => setMainTab(tab)}
          />
        </div>
      </div>

      {/* 10-CHALLENGE SERIAL LEVEL RUNNER MODAL */}
      {selectedLevelNode && (
        <LevelChallengeModal
          node={selectedLevelNode}
          childPhase={activeProfile.phase}
          childName={activeProfile.name}
          onCompleteLevel={handleCompleteLevelChallenges}
          onAskAITutor={(q) => {
            setCurrentQuestion(q);
            setShowAITutor(true);
          }}
          onClose={() => setSelectedLevelNode(null)}
        />
      )}

      {/* DAILY CHALLENGE MODAL */}
      {showDailyChallenge && (
        <DailyChallengeModal
          activeProfile={activeProfile}
          onComplete={handleCompleteDailyChallenge}
          onAskAITutor={(q) => {
            setCurrentQuestion(q);
            setShowAITutor(true);
          }}
          onClose={() => setShowDailyChallenge(false)}
        />
      )}

      {/* QUESTION MODAL */}
      {currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          childName={activeProfile.name}
          onAnswerCorrect={handleQuestionAnswerCorrect}
          onAnswerIncorrect={handleQuestionAnswerIncorrect}
          onAskAITutor={(q) => {
            setShowAITutor(true);
          }}
          onClose={() => setCurrentQuestion(null)}
        />
      )}

      {/* AI TUTOR MODAL (KAKA) */}
      {showAITutor && (
        <AITutorModal
          childName={activeProfile.name}
          ageGrade={activeProfile.grade}
          currentQuestion={currentQuestion}
          onClose={() => setShowAITutor(false)}
        />
      )}

      {/* PARENT DASHBOARD */}
      {showParentDashboard && (
        <ParentDashboard
          profiles={profiles}
          activeProfile={activeProfile}
          parentSettings={parentSettings}
          onUpdateParentSettings={(s) => setParentSettings(s)}
          onUpdateProfile={handleUpdateProfile}
          onCreateNewProfile={handleCreateNewProfile}
          onOpenWorksheetGenerator={() => {
            setShowParentDashboard(false);
            setShowWorksheetGenerator(true);
          }}
          onClose={() => setShowParentDashboard(false)}
        />
      )}

      {/* WORKSHEET GENERATOR */}
      {showWorksheetGenerator && (
        <WorksheetGenerator onClose={() => setShowWorksheetGenerator(false)} />
      )}

      {/* DIAGNOSTIC TEST */}
      {showDiagnostic && (
        <DiagnosticTestModal
          childProfile={activeProfile}
          onComplete={handleDiagnosticComplete}
          onClose={() => setShowDiagnostic(false)}
        />
      )}

      {/* AVATAR SHOP MODAL */}
      {showShop && (
        <AvatarShopModal
          activeProfile={activeProfile}
          onBuyItem={handleBuyShopItem}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* PROFILE SELECTOR MODAL */}
      {showProfilesModal && (
        <ProfileSelectorModal
          profiles={profiles}
          activeProfile={activeProfile}
          onSelectProfile={(p) => setActiveProfileId(p.id)}
          onCreateNewProfile={handleCreateNewProfile}
          onClose={() => setShowProfilesModal(false)}
        />
      )}

      {/* HEALTHY SCREEN TIME ALERT */}
      {showScreenTimeAlert && (
        <ScreenTimeAlert
          childName={activeProfile.name}
          minutesSpent={sessionMinutes}
          onDismiss={() => setShowScreenTimeAlert(false)}
        />
      )}

      {/* INTERACTIVE MATH LABORATORY */}
      {showMathLab && (
        <MathLaboratoryModal
          activeProfile={activeProfile}
          onClose={() => setShowMathLab(false)}
        />
      )}

      {/* EXAM SIMULATION & ANBK NUMERASI TRYOUT */}
      {showExamSimulation && (
        <ExamSimulationModal
          activeProfile={activeProfile}
          onClose={() => setShowExamSimulation(false)}
          onRewardXP={handleRewardXP}
        />
      )}

      {/* MATH DUEL 1V1 (SPLIT-SCREEN & AI BOT) */}
      {showMathDuel && (
        <MathDuelModal
          activeProfile={activeProfile}
          onClose={() => setShowMathDuel(false)}
          onRewardXP={handleRewardXP}
        />
      )}

      {/* FORMULA HANDBOOK & MENTAL MATH HACKS */}
      {showFormulaHandbook && (
        <FormulaHandbookModal
          onClose={() => setShowFormulaHandbook(false)}
        />
      )}

      {/* ACTIVE MINIGAME OVERLAY */}
      {activeMinigameId && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveMinigameId(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="max-w-2xl w-full my-auto">
            {activeMinigameId === 'math_duel' && (
              <MathDuelModal
                activeProfile={activeProfile}
                onClose={() => setActiveMinigameId(null)}
                onRewardXP={handleRewardXP}
              />
            )}
            {activeMinigameId === 'math_lab' && (
              <MathLaboratoryModal
                activeProfile={activeProfile}
                onClose={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'exam_simulation' && (
              <ExamSimulationModal
                activeProfile={activeProfile}
                onClose={() => setActiveMinigameId(null)}
                onRewardXP={handleRewardXP}
              />
            )}
            {activeMinigameId === 'cake_fraction_slicer' && (
              <CakeFractionSlicerGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'draw_line_match' && (
              <DrawLineMatchGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'place_value_blocks' && (
              <PlaceValueBlocksGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'ruler_measurement' && (
              <RulerMeasurementGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'number_line_frog' && (
              <NumberLineFrogGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'tangram_symmetry' && (
              <TangramSymmetryGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'liquid_measuring_jug' && (
              <LiquidMeasuringJugGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'barchart_builder' && (
              <BarChartBuilderGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'pan_balance_scale' && (
              <PanBalanceAlgebraGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'angle_protractor_lab' && (
              <AngleProtractorLabGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'venn_diagram_sorter' && (
              <VennDiagramSorterGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'geoboard_perimeter_area' && (
              <GeoboardLabGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'makan_kerupuk' && (
              <MakanKerupukGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'tarik_tambang' && (
              <TarikTambangGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {(activeMinigameId === 'catch_numbers' || activeMinigameId === 'catch_number') && (
              <CatchNumberGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'warung_rupiah' && (
              <WarungRupiahGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'fraction_pizza' && (
              <FractionPizzaGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'racing_math' && (
              <RacingMathGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {(activeMinigameId === 'clock_master' || activeMinigameId === 'interactive_clock') && (
              <InteractiveClockGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'garden_counter' && (
              <GardenCounterGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'balance_scale' && (
              <BalanceScaleGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'geometry_builder' && (
              <GeometryBuilderGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'pattern_guess' && (
              <PatternGuessGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'barchart_collector' && (
              <BarChartCollectorGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'order_train' && (
              <OrderNumberTrainGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {activeMinigameId === 'match_cards' && (
              <MatchCardsGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {(activeMinigameId === 'temple_escape' || activeMinigameId === 'temple_rpg') && (
              <TempleEscapeGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {(activeMinigameId === 'pirate_voyage' || activeMinigameId === 'pirate_sea') && (
              <PirateSeaVoyageGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {(activeMinigameId === 'tower_defense' || activeMinigameId === 'fortress_defense') && (
              <TowerDefenseMathGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {(activeMinigameId === 'jungle_safari' || activeMinigameId === 'safari_rescue') && (
              <JungleSafariRescueGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {(activeMinigameId === 'space_explorer' || activeMinigameId === 'galactic_rover') && (
              <SpaceExplorerGame
                initialGrade={getGradeFromProfile(activeProfile.grade) as any}
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {(activeMinigameId === 'minecart_rush' || activeMinigameId === 'minecart_treasure') && (
              <MinecartTreasureRushGame
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}
            {(activeMinigameId === 'math_vs_monster' || activeMinigameId === 'math_undead' || activeMinigameId === 'monster_battle') && (
              <MathVsMonsterBattleGame
                initialGrade={getGradeFromProfile(activeProfile.grade) as any}
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}

            {TWENTY_NEW_GAME_IDS.includes(activeMinigameId as any) && (
              <TwentyNewGamesRouter
                gameId={activeMinigameId!}
                onComplete={handleMinigameComplete}
                onExit={() => setActiveMinigameId(null)}
              />
            )}

            {/* Fallback to prevent blank screen if ID is unhandled */}
            {![
              ...TWENTY_NEW_GAME_IDS,
              'cake_fraction_slicer', 'draw_line_match', 'place_value_blocks', 'ruler_measurement',
              'number_line_frog', 'tangram_symmetry', 'liquid_measuring_jug', 'barchart_builder',
              'pan_balance_scale', 'angle_protractor_lab', 'venn_diagram_sorter', 'geoboard_perimeter_area',
              'makan_kerupuk', 'tarik_tambang', 'catch_numbers', 'catch_number', 'warung_rupiah',
              'fraction_pizza', 'racing_math', 'clock_master', 'interactive_clock', 'garden_counter',
              'balance_scale', 'geometry_builder', 'pattern_guess', 'barchart_collector', 'order_train',
              'match_cards', 'temple_escape', 'temple_rpg', 'pirate_voyage', 'pirate_sea', 'tower_defense',
              'fortress_defense', 'jungle_safari', 'safari_rescue', 'space_explorer', 'galactic_rover',
              'minecart_rush', 'minecart_treasure', 'math_vs_monster', 'math_undead', 'monster_battle',
              'math_duel', 'math_lab', 'exam_simulation'
            ].includes(activeMinigameId) && (
              <div className="bg-white rounded-3xl p-6 text-center space-y-4 border-4 border-amber-400 shadow-2xl max-w-md mx-auto">
                <div className="text-4xl">🎮</div>
                <h3 className="text-lg font-black text-slate-800">Game Sedang Disiapkan</h3>
                <p className="text-sm text-slate-600">ID: {activeMinigameId}</p>
                <button
                  onClick={() => setActiveMinigameId(null)}
                  className="px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black cursor-pointer shadow-md"
                >
                  Tutup / Kembali
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exam Mode Simulation Modal */}
      {showExamMode && (
        <ExamModeModal
          activeProfile={activeProfile}
          onClose={() => setShowExamMode(false)}
          onRewardXP={handleRewardXP}
        />
      )}

      {/* Quick Math Challenge Modal */}
      {showQuickMath && (
        <QuickMathModal
          activeProfile={activeProfile}
          onClose={() => setShowQuickMath(false)}
          onRewardXP={handleRewardXP}
        />
      )}

      {/* Mistakes Review Modal */}
      {showMistakes && (
        <MistakesReviewModal
          mistakes={loadMistakes(activeProfile.id)}
          childName={activeProfile.name}
          onResolveMistake={(mistakeId) => {
            resolveMistake(activeProfile.id, mistakeId);
          }}
          onRewardBonusXP={(xp) => {
            handleRewardXP(xp, 1);
          }}
          onClose={() => setShowMistakes(false)}
        />
      )}
    </div>
  );
};

export default App;
