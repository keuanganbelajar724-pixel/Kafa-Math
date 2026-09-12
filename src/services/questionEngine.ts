import { QuestionItem, PhaseId, LearningPhase, PrimaryStage, MathDomain } from '../types';
import { QUESTION_BANK, CURRICULUM_TOPICS } from '../data/curriculumData';
import { THINKING_QUESTIONS_BANK } from '../data/cambridgeCurriculumData';
import { GradeMathEngine, GradeLevel } from './gradeMathEngine';

export function generateQuestion(phase: PhaseId | LearningPhase, topicId?: string, difficulty: number = 1): QuestionItem {
  return QuestionEngine.generateDynamicQuestion(phase as PhaseId, topicId, difficulty);
}

export function generateThinkingQuestion(stage: PrimaryStage = 2, domain?: MathDomain): QuestionItem {
  const filtered = THINKING_QUESTIONS_BANK.filter((q) => {
    if (stage && q.stage !== stage) return false;
    if (domain && q.domain !== domain) return false;
    return true;
  });

  if (filtered.length > 0) {
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    return { ...selected, id: `thk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` };
  }

  // Fallback to any thinking question
  const fallback = THINKING_QUESTIONS_BANK[Math.floor(Math.random() * THINKING_QUESTIONS_BANK.length)];
  return { ...fallback, id: `thk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` };
}

export class QuestionEngine {
  public static generateDynamicQuestion(phase: PhaseId, topicId?: string, difficulty: number = 1): QuestionItem {
    // 1. Check if a thinking question matches phase
    if (Math.random() > 0.4) {
      const thinkingMatches = THINKING_QUESTIONS_BANK.filter((q) => {
        if (topicId && q.topicId === topicId) return true;
        if (q.phase === phase) return true;
        return false;
      });
      if (thinkingMatches.length > 0) {
        const sel = thinkingMatches[Math.floor(Math.random() * thinkingMatches.length)];
        return { ...sel, id: `gen_thk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` };
      }
    }

    // 2. Try to find matching question in bank first
    const pool = QUESTION_BANK.filter((q) => {
      if (topicId && q.topicId === topicId) return true;
      if (q.phase === phase && !topicId) return true;
      return false;
    });

    if (pool.length > 0 && Math.random() > 0.2) {
      const selected = pool[Math.floor(Math.random() * pool.length)];
      return { ...selected, id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` };
    }

    // 2. If topicId is from CURRICULUM_TOPICS, extract gradeLevel
    const topicMeta = CURRICULUM_TOPICS.find((t) => t.id === topicId);
    if (topicMeta && typeof topicMeta.gradeLevel === 'number') {
      const gq = GradeMathEngine.generateQuestion(topicMeta.gradeLevel as GradeLevel);
      return {
        id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        phase,
        grade: topicMeta.gradeLabel || gq.gradeLabel,
        topicId: topicId,
        topicTitle: topicMeta.title || gq.topicTitle,
        competency: topicMeta.competency || gq.category,
        difficulty: (gq.difficulty || difficulty) as 1 | 2 | 3,
        question: gq.question,
        contextStory: `Tantangan Matematika Kurikulum Merdeka - ${topicMeta.title}`,
        visualType: gq.questionDisplay?.type === 'visual' ? 'objects' : undefined,
        options: gq.options,
        correctAnswer: gq.correctAnswer,
        explanation: gq.explanation,
        hint1: gq.hint,
        hint2: `Perhatikan kata kunci pada pertanyaan dan hitung dengan teliti.`,
        hint3: `Jawaban yang benar adalah: ${gq.correctAnswer}`,
        audioPrompt: gq.question,
      };
    }

    // 3. Fallback procedural generator by Phase
    let gradeNum: GradeLevel = 2;
    if (phase === 'fondasi') gradeNum = 0;
    else if (phase === 'fase_a') gradeNum = 1;
    else if (phase === 'fase_b') gradeNum = 3;
    else if (phase === 'fase_c') gradeNum = 5;

    const gq = GradeMathEngine.generateQuestion(gradeNum);
    return {
      id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      phase,
      grade: gq.gradeLabel,
      topicId: topicId || `topic_${gradeNum}`,
      topicTitle: gq.topicTitle,
      competency: gq.category,
      difficulty: (gq.difficulty || difficulty) as 1 | 2 | 3,
      question: gq.question,
      contextStory: `Tantangan Aritmatika Nusantara`,
      options: gq.options,
      correctAnswer: gq.correctAnswer,
      explanation: gq.explanation,
      hint1: gq.hint,
      hint2: `Hitung pelan-pelan langkah demi langkah.`,
      hint3: `Jawaban tepatnya adalah ${gq.correctAnswer}`,
      audioPrompt: gq.question,
    };
  }
}
