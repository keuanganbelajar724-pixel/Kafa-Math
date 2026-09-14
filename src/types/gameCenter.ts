export type GameCategoryId =
  | 'all'
  | 'quick_math'
  | 'logic'
  | 'number'
  | 'geometry'
  | 'fractions'
  | 'money'
  | 'time'
  | 'data'
  | 'brain_training';

export interface GameMetadata {
  id: string;
  gameNumber: number; // 1 to 20
  title: string;
  subtitle: string;
  description: string;
  category: GameCategoryId;
  categoryLabel: string;
  difficulty: 'easy' | 'medium' | 'challenge';
  bestScore?: number;
  xpReward: number;
  coinReward: number;
  icon: string;
  learningObjective: string;
  rules: string[];
  recommendedGrade?: string;
  hasTimer?: boolean;
  hasHearts?: boolean;
}

export interface GameScoreResult {
  score: number;
  stars: 1 | 2 | 3;
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  coinsEarned: number;
  maxCombo: number;
  isNewBest?: boolean;
}
