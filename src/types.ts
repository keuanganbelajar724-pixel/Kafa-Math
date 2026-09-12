export type PhaseId = 'fondasi' | 'fase_a' | 'fase_b' | 'fase_c';

export enum LearningPhase {
  PONDASI = 'fondasi',
  FASE_A = 'fase_a',
  FASE_B = 'fase_b',
  FASE_C = 'fase_c',
}

// Cambridge-inspired Primary Stages (Ages ~5-11)
export type PrimaryStage = 1 | 2 | 3 | 4 | 5 | 6;

// 3 Core Mathematical Domains
export type MathDomain = 'number' | 'geometry_measure' | 'statistics_probability';

// Thinking & Working Mathematically (TWM) Strands
export type TWMStrand =
  | 'specialising'
  | 'generalising'
  | 'conjecturing'
  | 'convincing'
  | 'characterising'
  | 'classifying'
  | 'critiquing'
  | 'improving';

// Cognitive Learning Dimensions
export type QuestionCognitiveType = 'fluency' | 'concept' | 'reasoning' | 'problem_solving';

// High-Order Thinking Question Types
export type ThinkingQuestionType =
  | 'standard'
  | 'multiple_strategies'      // e.g. Strategy A vs Strategy B
  | 'how_do_you_know'          // Reasoning verification
  | 'always_sometimes_never'   // Mathematical certainty analysis
  | 'find_the_mistake'         // Math Detective: locate error & fix
  | 'which_one_doesnt_belong'  // WODB 4 items + multi-perspective reasoning
  | 'estimation'               // Reasonable magnitude & estimation
  | 'bar_model'                // Visual bar model representation
  | 'pattern_rule'             // Predict next & state algebra/pattern rule
  | 'open_ended';              // Multi-solution acceptable problems

export interface DiagnosticAssessment {
  stage: PrimaryStage;
  overallLevelName: string;
  numberSenseScore: number;       // 0-100
  geometryMeasureScore: number;    // 0-100
  statsProbScore: number;         // 0-100
  fluencyScore: number;           // 0-100
  conceptScore: number;           // 0-100
  reasoningScore: number;         // 0-100
  problemSolvingScore: number;    // 0-100
  strengths: string[];
  developingAreas: string[];
  recommendedPath: string[];
  completedDate?: string;
}

export interface MathJournalEntry {
  id: string;
  date: string;
  stage: PrimaryStage;
  topic: string;
  discovery: string;
  favoriteStrategy: string;
  trickyQuestion?: string;
  moodEmoji: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age?: number;
  grade: string; // "PAUD/TK", "SD Kelas 1", "SD Kelas 2", etc.
  phase: PhaseId | LearningPhase;
  stage?: PrimaryStage; // Stage 1 - 6
  languageMode?: 'id' | 'en' | 'bilingual';
  avatar?: string;
  avatarId?: string;
  avatarConfig?: {
    skinTone: string;
    hairStyle: string;
    outfit: string;
    accessory: string;
  };
  shipConfig?: {
    color: string;
    sailStyle: string;
    flag: string;
  };
  pet?: {
    type: 'kucing' | 'kelinci' | 'panda' | 'rubah' | 'harimau';
    name: string;
    level: number;
    happiness: number;
  };
  xp: number;
  level: number;
  levelTitle?: string;
  coins: number;
  streak: number;
  lastActiveDate: string;
  dailyQuestionsDone: number;
  totalMinutesSpent: number;
  completedNodes: string[]; // List of Node IDs
  masteredTopics?: string[]; // List of Topic IDs
  topicMastery?: Record<string, number>; // topicId -> percentage (0-100)
  totalQuestionsAnswered?: number;
  correctAnswersCount?: number;
  studyTimeSecondsToday?: number;
  totalStudyTimeMinutes?: number;
  achievements: string[];
  unlockedCosmetics: string[];
  unlockedItems?: string[];
  diagnosticCompleted?: boolean;
  diagnosticAssessment?: DiagnosticAssessment;
  diagnosticResult?: DiagnosticAssessment;
  mathJournal?: MathJournalEntry[];
}

export interface TopicCompetency {
  id: string;
  title: string;
  description: string;
  phase: PhaseId | LearningPhase;
  gradeLevel?: number; // 0 for PAUD/TK, 1-6 for SD
  chapterNumber?: number;
  semester?: 1 | 2;
  strand?: string;
  competency?: string;
  gradeLabel?: string;
  icon: string;
  color?: string;
  masteryPercentage?: number;
  keyConcepts?: string[];
  learningObjectives?: string[];
  recommendedGames?: string[];
}

export interface MapNode {
  id: string;
  worldId?: string;
  title: string;
  subtitle: string;
  type: 'learning' | 'game' | 'quiz' | 'boss';
  phase?: PhaseId | LearningPhase;
  topicId: string;
  difficulty?: 1 | 2 | 3 | 4; // 1: Mudah, 2: Sedang, 3: Sulit, 4: Boss
  gameType?: MiniGameType;
  minigameId?: string;
  starsEarned?: number; // 0, 1, 2, 3
  status?: 'locked' | 'available' | 'completed' | 'mastered';
  xpReward?: number;
  coinReward?: number;
  position?: { x: number; y: number }; // Percentage 0-100 on the world map
}

export interface WorldArea {
  id: string;
  name: string;
  regionName: string; // e.g. "Sumatra", "Jawa", "Bali", etc.
  tagline: string;
  icon: string;
  bgGradient: string;
  phaseRequired?: PhaseId | LearningPhase;
  nodes: MapNode[];
  description: string;
}

export type MiniGameType =
  | 'catch_numbers'
  | 'catch_number'
  | 'racing_math'
  | 'order_train'
  | 'match_cards'
  | 'warung_rupiah'
  | 'fraction_pizza'
  | 'geometry_builder'
  | 'balance_scale'
  | 'garden_counter'
  | 'pattern_guess'
  | 'clock_master'
  | 'interactive_clock'
  | 'barchart_collector'
  | 'bar_chart'
  | 'temple_escape'
  | 'pirate_voyage'
  | 'tower_defense'
  | 'jungle_safari'
  | 'space_explorer'
  | 'minecart_rush'
  | 'cake_fraction_slicer'
  | 'draw_line_match'
  | 'place_value_blocks'
  | 'ruler_measurement';

export interface QuestionStrategy {
  id: string;
  name: string;
  steps: string;
  isOptimal?: boolean;
}

export interface WODBItem {
  id: string;
  label: string;
  value: string;
  reason: string;
}

export interface QuestionItem {
  id: string;
  phase: PhaseId | LearningPhase;
  stage?: PrimaryStage;
  domain?: MathDomain;
  cognitiveType?: QuestionCognitiveType;
  thinkingType?: ThinkingQuestionType;
  grade: string;
  topicId: string;
  topicTitle: string;
  competency: string;
  difficulty: 1 | 2 | 3 | 4;
  question: string;
  englishQuestion?: string;
  contextStory?: string;
  visualType?: 'none' | 'objects' | 'fraction_pie' | 'money' | 'shapes' | 'clock' | 'balance' | 'bar_model' | 'ten_frame' | 'number_line';
  visualData?: any;
  options: string[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  explanation: string;
  englishExplanation?: string;
  hint1: string;
  hint2: string;
  hint3: string;
  audioPrompt?: string;
  strategies?: QuestionStrategy[];
  wodbItems?: WODBItem[];
  reasoningOptions?: string[];
  mistakeContext?: {
    studentName: string;
    initialClaim: string;
    errorLocation: string;
    correctFix: string;
  };
  barModelData?: {
    whole: number | string;
    parts: { label: string; value: number | string; isUnknown?: boolean }[];
  };
  twmStrand?: TWMStrand;
  realWorldScenario?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: 'soal' | 'streak' | 'mastery' | 'world';
  targetCount?: number;
  currentCount?: number;
  completed?: boolean;
  rewardCoins?: number;
  rewardXP?: number;
  xpReward?: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description?: string;
  category?: 'pet' | 'ship' | 'hat' | 'outfit' | 'accessory';
  type?: string;
  icon: string;
  cost: number;
  price?: number;
  preview?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  target: number;
  current: number;
  rewardXP: number;
  rewardCoins: number;
  completed: boolean;
  icon: string;
}

export interface ParentSettings {
  parentPin: string;
  languageMode?: 'id' | 'en' | 'bilingual';
  dailyTimeLimitMinutes?: number;
  dailyScreenTimeMinutes?: number; // 10, 15, 20, 30
  soundEffects: boolean;
  bgMusic: boolean;
  voiceOverEnabled: boolean;
  speechRate?: number;
  speechSpeed?: number; // 0.75, 1, 1.25
  notifyDailyGoal?: boolean;
  theme?: 'light' | 'dark';
}

export interface WorksheetConfig {
  grade: string;
  topicId: string;
  difficulty: 'mudah' | 'sedang' | 'sulit' | 'campuran';
  questionCount: number;
  includeAnswers: boolean;
  studentName?: string;
  schoolName?: string;
}
