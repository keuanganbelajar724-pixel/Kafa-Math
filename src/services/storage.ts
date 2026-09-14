import { ChildProfile, ParentSettings, DailyQuest } from '../types';
import { INITIAL_DAILY_QUESTS } from '../data/curriculumData';

const PROFILES_KEY = 'kafa_math_profiles_v1';
const ACTIVE_PROFILE_KEY = 'kafa_math_active_profile_v1';
const SETTINGS_KEY = 'kafa_math_parent_settings_v1';
const QUESTS_KEY = 'kafa_math_daily_quests_v1';

export const LEVEL_TIERS = [
  { level: 1, minXP: 0, title: 'Penjelajah Angka' },
  { level: 2, minXP: 100, title: 'Jago Berhitung' },
  { level: 3, minXP: 250, title: 'Pemburu Pola' },
  { level: 4, minXP: 450, title: 'Penakluk Pecahan' },
  { level: 5, minXP: 700, title: 'Ahli Geometri' },
  { level: 6, minXP: 1000, title: 'Master Matematika' },
  { level: 7, minXP: 1400, title: 'Grandmaster Nusantara' },
];

export function getLevelInfo(xp: number) {
  let currentTier = LEVEL_TIERS[0];
  let nextTier = LEVEL_TIERS[1];

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (xp >= LEVEL_TIERS[i].minXP) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || { level: currentTier.level + 1, minXP: currentTier.minXP + 500, title: 'Legenda Matematika' };
    }
  }

  const xpInLevel = xp - currentTier.minXP;
  const xpNeeded = nextTier.minXP - currentTier.minXP;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInLevel / xpNeeded) * 100)));

  return {
    level: currentTier.level,
    title: currentTier.title,
    currentXP: xp,
    nextLevelXP: nextTier.minXP,
    progressPercent,
  };
}

export const DEFAULT_PROFILES: ChildProfile[] = [
  {
    id: 'child_teman',
    name: 'Teman',
    age: 7,
    grade: 'SD Kelas 2',
    phase: 'fase_a',
    avatarId: 'avatar_teman',
    avatarConfig: {
      skinTone: 'warm',
      hairStyle: 'short',
      outfit: 'outfit_penjelajah',
      accessory: 'acc_topi_petualang',
    },
    shipConfig: {
      color: '#0284c7',
      sailStyle: 'sail_merah_putih',
      flag: '⭐',
    },
    pet: {
      type: 'kucing',
      name: 'Si Belang',
      level: 2,
      happiness: 95,
    },
    xp: 220,
    level: 2,
    levelTitle: 'Jago Berhitung',
    coins: 85,
    streak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    dailyQuestionsDone: 2,
    totalMinutesSpent: 42,
    completedNodes: ['node_sumatra_1', 'node_jawa_1'],
    masteredTopics: ['fondasi_angka'],
    topicMastery: {
      fondasi_angka: 90,
      fase_a_penjumlahan: 75,
      fase_a_pengurangan: 60,
      fase_a_uang_waktu: 40,
    },
    totalQuestionsAnswered: 34,
    correctAnswersCount: 30,
    studyTimeSecondsToday: 420, // 7 mins
    totalStudyTimeMinutes: 52,
    achievements: ['ach_first_step', 'ach_10_questions'],
    unlockedCosmetics: ['outfit_penjelajah', 'acc_topi_petualang', 'sail_merah_putih'],
    unlockedItems: ['outfit_penjelajah', 'acc_topi_petualang', 'sail_merah_putih'],
    diagnosticCompleted: true,
  },
  {
    id: 'child_aisyah',
    name: 'Aisyah',
    age: 5,
    grade: 'PAUD/TK',
    phase: 'fondasi',
    avatarId: 'avatar_aisyah',
    avatarConfig: {
      skinTone: 'light',
      hairStyle: 'pigtails',
      outfit: 'outfit_batik',
      accessory: 'acc_blangkon',
    },
    shipConfig: {
      color: '#ec4899',
      sailStyle: 'sail_merah_putih',
      flag: '🌸',
    },
    pet: {
      type: 'kelinci',
      name: 'Si Manis',
      level: 1,
      happiness: 90,
    },
    xp: 90,
    level: 1,
    levelTitle: 'Penjelajah Angka',
    coins: 45,
    streak: 2,
    lastActiveDate: new Date().toISOString().split('T')[0],
    dailyQuestionsDone: 1,
    totalMinutesSpent: 25,
    completedNodes: ['node_sumatra_1'],
    masteredTopics: [],
    topicMastery: {
      fondasi_angka: 70,
      fondasi_perbandingan: 50,
      fondasi_bentuk_pola: 40,
    },
    totalQuestionsAnswered: 18,
    correctAnswersCount: 15,
    studyTimeSecondsToday: 300,
    totalStudyTimeMinutes: 28,
    achievements: ['ach_first_step'],
    unlockedCosmetics: ['outfit_batik', 'acc_blangkon'],
    unlockedItems: ['outfit_batik', 'acc_blangkon'],
    diagnosticCompleted: true,
  },
];

export const DEFAULT_PARENT_SETTINGS: ParentSettings = {
  parentPin: '1234',
  dailyTimeLimitMinutes: 15,
  dailyScreenTimeMinutes: 15,
  soundEffects: true,
  bgMusic: true,
  voiceOverEnabled: true,
  speechRate: 1,
  speechSpeed: 1,
  notifyDailyGoal: true,
  theme: 'light',
};

export function loadProfiles(): ChildProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const list: ChildProfile[] = JSON.parse(raw);
      // Migrate legacy 'Ahmad' profile name to 'Teman'
      let updated = false;
      const sanitized = list.map((p) => {
        if (p.name === 'Ahmad') {
          updated = true;
          return {
            ...p,
            name: 'Teman',
            id: p.id === 'child_ahmad' ? 'child_teman' : p.id,
            avatarId: p.avatarId === 'avatar_ahmad' ? 'avatar_teman' : p.avatarId,
          };
        }
        return p;
      });
      if (updated) {
        saveProfiles(sanitized);
      }
      return sanitized;
    }
  } catch (e) {
    console.error('Failed to load profiles from localStorage', e);
  }
  return DEFAULT_PROFILES;
}

export function saveProfiles(profiles: ChildProfile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profiles to localStorage', e);
  }
}

export function updateProfileStats(
  profile: ChildProfile,
  xpGained: number,
  coinsGained: number
): ChildProfile {
  const newXP = profile.xp + xpGained;
  const levelInfo = getLevelInfo(newXP);
  return {
    ...profile,
    xp: newXP,
    level: levelInfo.level,
    levelTitle: levelInfo.title,
    coins: profile.coins + coinsGained,
    dailyQuestionsDone: profile.dailyQuestionsDone + 1,
    totalQuestionsAnswered: (profile.totalQuestionsAnswered || 0) + 1,
    correctAnswersCount: (profile.correctAnswersCount || 0) + 1,
  };
}

export function unlockAchievement(profile: ChildProfile, achievementId: string): ChildProfile {
  if (profile.achievements.includes(achievementId)) return profile;
  return {
    ...profile,
    achievements: [...profile.achievements, achievementId],
  };
}

export function addCompletedNode(profile: ChildProfile, nodeId: string): ChildProfile {
  if (profile.completedNodes.includes(nodeId)) return profile;
  return {
    ...profile,
    completedNodes: [...profile.completedNodes, nodeId],
  };
}

export function loadActiveProfileId(): string {
  try {
    const raw = localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (raw) return raw;
  } catch (e) {}
  return DEFAULT_PROFILES[0].id;
}

export function saveActiveProfileId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  } catch (e) {}
}

export function loadParentSettings(): ParentSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_PARENT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {}
  return DEFAULT_PARENT_SETTINGS;
}

export function saveParentSettings(settings: ParentSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
}

export function loadDailyQuests(): DailyQuest[] {
  try {
    const raw = localStorage.getItem(QUESTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_DAILY_QUESTS;
}

export function saveDailyQuests(quests: DailyQuest[]): void {
  try {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
  } catch (e) {}
}

// Digital Workbook & Question Storage
const WORKBOOK_ANSWERS_PREFIX = 'kafa_workbook_answers_v1_';
const MISTAKES_PREFIX = 'kafa_mistakes_bank_v1_';
const EXAM_RESULTS_PREFIX = 'kafa_exam_results_v1_';
const QUICK_MATH_PREFIX = 'kafa_quick_math_v1_';
const FOCUS_MODE_KEY = 'kafa_focus_mode_v1';

export function loadWorkbookAnswers(profileId: string): Record<string, import('../types').WorkbookSavedAnswer> {
  try {
    const raw = localStorage.getItem(`${WORKBOOK_ANSWERS_PREFIX}${profileId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load workbook answers', e);
  }
  return {};
}

export function saveWorkbookAnswer(
  profileId: string,
  answerData: import('../types').WorkbookSavedAnswer
): Record<string, import('../types').WorkbookSavedAnswer> {
  try {
    const current = loadWorkbookAnswers(profileId);
    current[answerData.questionId] = answerData;
    localStorage.setItem(`${WORKBOOK_ANSWERS_PREFIX}${profileId}`, JSON.stringify(current));
    return current;
  } catch (e) {
    console.error('Failed to save workbook answer', e);
    return {};
  }
}

export function loadMistakes(profileId: string): import('../types').MistakeItem[] {
  try {
    const raw = localStorage.getItem(`${MISTAKES_PREFIX}${profileId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load mistakes', e);
  }
  return [];
}

export function saveMistake(
  profileId: string,
  question: import('../types').GeneratedMathQuestion,
  wrongAnswer: string
): import('../types').MistakeItem[] {
  try {
    const mistakes = loadMistakes(profileId);
    const existingIdx = mistakes.findIndex((m) => m.question.id === question.id || m.question.hash === question.hash);
    if (existingIdx >= 0) {
      mistakes[existingIdx].timesWrong += 1;
      mistakes[existingIdx].wrongAnswer = wrongAnswer;
      mistakes[existingIdx].resolved = false;
    } else {
      mistakes.unshift({
        id: `mis_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        profileId,
        question,
        wrongAnswer,
        dateAdded: new Date().toLocaleDateString('id-ID'),
        resolved: false,
        timesWrong: 1,
      });
    }
    localStorage.setItem(`${MISTAKES_PREFIX}${profileId}`, JSON.stringify(mistakes.slice(0, 50)));
    return mistakes;
  } catch (e) {
    console.error('Failed to save mistake', e);
    return [];
  }
}

export function resolveMistake(profileId: string, mistakeId: string): import('../types').MistakeItem[] {
  try {
    const mistakes = loadMistakes(profileId);
    const updated = mistakes.map((m) => (m.id === mistakeId ? { ...m, resolved: true } : m));
    localStorage.setItem(`${MISTAKES_PREFIX}${profileId}`, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to resolve mistake', e);
    return [];
  }
}

export function loadExamResults(profileId: string): import('../types').ExamSessionResult[] {
  try {
    const raw = localStorage.getItem(`${EXAM_RESULTS_PREFIX}${profileId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

export function saveExamResult(profileId: string, result: import('../types').ExamSessionResult): void {
  try {
    const results = loadExamResults(profileId);
    results.unshift(result);
    localStorage.setItem(`${EXAM_RESULTS_PREFIX}${profileId}`, JSON.stringify(results.slice(0, 30)));
  } catch (e) {}
}

export function loadQuickMathBest(profileId: string, duration: 30 | 60 | 120): number {
  try {
    const raw = localStorage.getItem(`${QUICK_MATH_PREFIX}${profileId}_${duration}`);
    if (raw) return Number(raw);
  } catch (e) {}
  return 0;
}

export function saveQuickMathBest(profileId: string, duration: 30 | 60 | 120, score: number): void {
  try {
    const current = loadQuickMathBest(profileId, duration);
    if (score > current) {
      localStorage.setItem(`${QUICK_MATH_PREFIX}${profileId}_${duration}`, String(score));
    }
  } catch (e) {}
}

export function loadFocusMode(): boolean {
  try {
    return localStorage.getItem(FOCUS_MODE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function saveFocusMode(val: boolean): void {
  try {
    localStorage.setItem(FOCUS_MODE_KEY, val ? 'true' : 'false');
  } catch (e) {}
}
