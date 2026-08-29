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

// Minigames
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

  // Node Selection from Adventure Map
  const handleSelectNode = (node: MapNode) => {
    setActiveNode(node);
    if (node.type === 'game' && node.minigameId) {
      setActiveMinigameId(node.minigameId);
    } else {
      // Generate question for this node
      const q = generateQuestion(activeProfile.phase, node.topicId, 1);
      setCurrentQuestion(q);
    }
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
  const handleDiagnosticComplete = (recommendedPhase: LearningPhase, score: number) => {
    const updated: ChildProfile = {
      ...activeProfile,
      phase: recommendedPhase,
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-100/40 text-slate-900 font-sans selection:bg-orange-200">
      {/* Top Navbar */}
      <Navbar
        activeProfile={activeProfile}
        parentSettings={parentSettings}
        onOpenProfiles={() => setShowProfilesModal(true)}
        onOpenParentDashboard={() => setShowParentDashboard(true)}
        onOpenShop={() => setShowShop(true)}
        onOpenAITutor={() => setShowAITutor(true)}
        onOpenMathLab={() => setShowMathLab(true)}
        onOpenExamSimulation={() => setShowExamSimulation(true)}
        onOpenMathDuel={() => setShowMathDuel(true)}
        onOpenFormulaHandbook={() => setShowFormulaHandbook(true)}
        onOpenWorksheets={() => setShowWorksheetGenerator(true)}
        onToggleVoice={() =>
          setParentSettings((prev) => ({ ...prev, voiceOverEnabled: !prev.voiceOverEnabled }))
        }
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        <ChildDashboard
          activeProfile={activeProfile}
          onSelectNode={handleSelectNode}
          onLaunchMinigame={(id) => setActiveMinigameId(id)}
          onStartQuickQuestion={(topicId) => {
            const q = generateQuestion(activeProfile.phase, topicId, 1);
            setCurrentQuestion(q);
          }}
          onOpenShop={() => setShowShop(true)}
          onOpenDiagnostic={() => setShowDiagnostic(true)}
          onOpenMathLab={() => setShowMathLab(true)}
          onOpenExamSimulation={() => setShowExamSimulation(true)}
          onOpenMathDuel={() => setShowMathDuel(true)}
          onOpenFormulaHandbook={() => setShowFormulaHandbook(true)}
          onOpenWorksheets={() => setShowWorksheetGenerator(true)}
          onChangeGrade={handleChangeGrade}
        />
      </main>

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
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="max-w-2xl w-full my-auto">
            {activeMinigameId === 'catch_numbers' && (
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
            {activeMinigameId === 'clock_master' && (
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
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
