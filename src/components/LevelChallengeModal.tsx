import React, { useState, useEffect } from 'react';
import { MapNode, QuestionItem, LearningPhase } from '../types';
import { generateQuestion } from '../services/questionEngine';
import { sound } from '../services/sound';
import { KafaMascot, MascotMood } from './KafaMascot';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Volume2,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Star,
  Coins,
  Bot,
  HelpCircle,
} from 'lucide-react';

interface LevelChallengeModalProps {
  node: MapNode;
  childPhase: LearningPhase | string;
  childName: string;
  onCompleteLevel: (stars: number, xpEarned: number, coinsEarned: number) => void;
  onAskAITutor: (q: QuestionItem) => void;
  onClose: () => void;
}

export const LevelChallengeModal: React.FC<LevelChallengeModalProps> = ({
  node,
  childPhase,
  childName,
  onCompleteLevel,
  onAskAITutor,
  onClose,
}) => {
  const TOTAL_CHALLENGES = 10;
  const [challengeIndex, setChallengeIndex] = useState(0); // 0..9
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textInputAnswer, setTextInputAnswer] = useState<string>('');
  const [matchingPairs, setMatchingPairs] = useState<{ [key: string]: string }>({});
  const [selectedMatchLeft, setSelectedMatchLeft] = useState<string | null>(null);

  // Challenge status
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('neutral');
  const [mascotMessage, setMascotMessage] = useState<string>('Ayo kita selesaikan tantangan ini!');

  // Generate 10 challenges on mount
  useEffect(() => {
    const list: QuestionItem[] = [];
    for (let i = 0; i < TOTAL_CHALLENGES; i++) {
      const q = generateQuestion(childPhase as any, node.topicId, node.difficulty || 1);
      list.push(q);
    }
    setQuestions(list);
  }, [node, childPhase]);

  const currentQ = questions[challengeIndex];

  // Voice read on new question
  useEffect(() => {
    if (currentQ && !isFinished) {
      sound.speak(currentQ.audioPrompt || currentQ.question);
      setSelectedOption('');
      setTextInputAnswer('');
      setMatchingPairs({});
      setSelectedMatchLeft(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setHintLevel(0);
      setAttempts(0);
      setMascotMood('neutral');
      setMascotMessage(`Tantangan ${challengeIndex + 1} dari ${TOTAL_CHALLENGES}: ${currentQ.topicTitle}`);
    }
  }, [challengeIndex, questions, isFinished]);

  if (!currentQ && !isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm text-center shadow-2xl border-4 border-amber-300">
          <div className="animate-spin text-4xl mb-3">🌟</div>
          <p className="font-black text-slate-800">Menyiapkan 10 Tantangan Matematika...</p>
        </div>
      </div>
    );
  }

  // Check answer handler
  const handleCheckAnswer = (overrideAnswer?: string) => {
    const rawAnswer = overrideAnswer !== undefined ? overrideAnswer : (selectedOption || textInputAnswer);
    if (!rawAnswer && Object.keys(matchingPairs).length === 0) return;

    setAttempts((prev) => prev + 1);

    const isMatch = rawAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

    if (isMatch) {
      setIsAnswered(true);
      setIsCorrect(true);
      setCorrectCount((prev) => prev + 1);
      setEarnedXP((prev) => prev + 10);
      setEarnedCoins((prev) => prev + 2);
      setMascotMood('happy');
      setMascotMessage('Hebat! Jawabanmu benar! 🎉 +10 XP & +2 Koin!');

      sound.playCorrect();
      sound.playCoin();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } else {
      // Anti-frustration system
      sound.playRetry();
      if (attempts === 0) {
        setMascotMood('encouraging');
        setMascotMessage('Coba lagi yuk! Kamu pasti bisa menemukan jawabannya 😊');
        sound.speak('Coba lagi yuk! Kamu pasti bisa.');
      } else {
        setIsAnswered(true);
        setIsCorrect(false);
        setMascotMood('thinking');
        setMascotMessage(`Hampir tepat! Jawabannya adalah ${currentQ.correctAnswer}. Yuk pelajari penjelasannya!`);
        sound.speak(`Jawaban tepatnya adalah ${currentQ.correctAnswer}. Mari kita pelajari!`);
      }
    }
  };

  // Move to next challenge or finish level
  const handleNextChallenge = () => {
    if (challengeIndex + 1 < TOTAL_CHALLENGES) {
      setChallengeIndex((prev) => prev + 1);
    } else {
      // Finished all 10 challenges!
      setIsFinished(true);
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });

      const finalStars = correctCount >= 9 ? 3 : correctCount >= 6 ? 2 : 1;
      const finalXP = earnedXP + 30; // bonus completion XP
      const finalCoins = earnedCoins + 10; // bonus completion coins
      onCompleteLevel(finalStars, finalXP, finalCoins);
    }
  };

  const handleUnlockHint = () => {
    sound.playClick();
    const next = Math.min(3, hintLevel + 1);
    setHintLevel(next);
    let hintText = currentQ.hint1;
    if (next === 2) hintText = currentQ.hint2;
    if (next === 3) hintText = currentQ.hint3;
    setMascotMood('thinking');
    setMascotMessage(`Petunjuk ${next}: ${hintText}`);
    sound.speak(`Petunjuk ${next}: ${hintText}`);
  };

  // Render question interactive type
  const renderQuestionInteractive = () => {
    const isTrueFalse =
      currentQ.options.length === 2 &&
      ((currentQ.options.includes('Benar') && currentQ.options.includes('Salah')) ||
        (currentQ.options.includes('BENAR') && currentQ.options.includes('SALAH')));

    // True / False mode
    if (isTrueFalse) {
      return (
        <div className="grid grid-cols-2 gap-4 my-4">
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCorrectOption = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

            let style = 'bg-white hover:bg-amber-50 border-2 border-slate-200 text-slate-800';
            if (isSelected) style = 'bg-amber-100 border-3 border-amber-500 text-amber-950 shadow-md';
            if (isAnswered) {
              if (isCorrectOption) style = 'bg-emerald-100 border-3 border-emerald-500 text-emerald-950 font-black';
              else if (isSelected && !isCorrect) style = 'bg-rose-100 border-2 border-rose-400 text-rose-950';
            }

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => {
                  sound.playClick();
                  setSelectedOption(opt);
                }}
                className={`py-5 px-4 rounded-3xl font-black text-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${style}`}
              >
                <span>{opt.toUpperCase() === 'BENAR' ? '✅' : '❌'}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      );
    }

    // Multiple Choice mode
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {currentQ.options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          const isCorrectOption = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

          let style = 'bg-white hover:bg-amber-50/80 border-2 border-slate-200 text-slate-800';
          if (isSelected) style = 'bg-amber-100 border-2 border-amber-500 text-amber-950 shadow-md scale-[1.01]';
          if (isAnswered) {
            if (isCorrectOption) style = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black shadow-md';
            else if (isSelected && !isCorrect) style = 'bg-rose-100 border-2 border-rose-400 text-rose-950 opacity-80';
            else style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
          }

          return (
            <button
              key={i}
              disabled={isAnswered}
              onClick={() => {
                sound.playClick();
                setSelectedOption(opt);
              }}
              className={`p-3.5 sm:p-4 rounded-2xl font-black text-base sm:text-lg transition-all cursor-pointer text-left flex items-center justify-between ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-black border border-slate-200">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </div>
              {isAnswered && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 p-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                {node.title} • {node.subtitle}
              </h3>
              <p className="text-[11px] text-amber-100 font-semibold">
                Tantangan Matematika KAFA • {childName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-black flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Level Finished Victory Screen */}
        {isFinished ? (
          <div className="p-6 sm:p-8 text-center space-y-6 overflow-y-auto">
            <div className="animate-bounce text-6xl sm:text-7xl">🎉</div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                Misi Berhasil Ditaklukkan!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                LEVEL SELESAI!
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-1">
                Luar biasa, {childName}! Kamu telah menyelesaikan semua tantangan di pos ini.
              </p>
            </div>

            {/* Stars Rating */}
            <div className="flex justify-center gap-3">
              {[1, 2, 3].map((starIndex) => {
                const starAchieved =
                  (starIndex === 1 && correctCount >= 4) ||
                  (starIndex === 2 && correctCount >= 7) ||
                  (starIndex === 3 && correctCount >= 9);
                return (
                  <div
                    key={starIndex}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 transition-transform transform ${
                      starAchieved
                        ? 'bg-gradient-to-tr from-amber-300 to-yellow-400 border-amber-500 scale-110 animate-pulse'
                        : 'bg-slate-100 border-slate-300 text-slate-300'
                    }`}
                  >
                    ⭐
                  </div>
                );
              })}
            </div>

            {/* Score & Rewards Summary Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-center shadow-2xs">
                <span className="text-xs font-bold text-slate-500 block">Benar</span>
                <span className="text-xl font-black text-emerald-600">{correctCount} / {TOTAL_CHALLENGES}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-center shadow-2xs">
                <span className="text-xs font-bold text-slate-500 block">Akurasi</span>
                <span className="text-xl font-black text-indigo-600">
                  {Math.round((correctCount / TOTAL_CHALLENGES) * 100)}%
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-center shadow-2xs">
                <span className="text-xs font-bold text-slate-500 block">XP Didapat</span>
                <span className="text-xl font-black text-orange-600">+{earnedXP + 30} XP</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-center shadow-2xs">
                <span className="text-xs font-bold text-slate-500 block">Koin KAFA</span>
                <span className="text-xl font-black text-amber-600">+{earnedCoins + 10} 🪙</span>
              </div>
            </div>

            {/* Mascot reaction */}
            <div className="flex justify-center">
              <KafaMascot
                mood="celebrate"
                customMessage={`Selamat ya, ${childName}! Kamu hebat sekali, terus berpetualang dan kumpulkan koinnya!`}
                size="md"
              />
            </div>

            {/* Victory Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setChallengeIndex(0);
                  setIsFinished(false);
                  setCorrectCount(0);
                  setEarnedXP(0);
                  setEarnedCoins(0);
                }}
                className="px-5 py-3 rounded-2xl border-2 border-slate-300 font-black text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <RotateCcw className="w-4 h-4" /> Main Lagi
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>Lanjut ke Level Berikutnya 🚀</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Challenge View */
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Progress Header */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="bg-orange-500 text-white px-2 py-0.5 rounded-md font-black">
                    Challenge {challengeIndex + 1}/{TOTAL_CHALLENGES}
                  </span>
                  <span>{currentQ.topicTitle}</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-700 font-black">✓ {correctCount} Benar</span>
                  <span className="text-orange-600 font-black">+{earnedXP} XP</span>
                  <span className="text-amber-600 font-black">+{earnedCoins} 🪙</span>
                </div>
              </div>

              {/* Progress Bar [██████░░░░] */}
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300">
                <div
                  className="bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((challengeIndex + (isAnswered && isCorrect ? 1 : 0)) / TOTAL_CHALLENGES) * 100}%` }}
                />
              </div>
            </div>

            {/* Interactive KAFA Mascot Companion */}
            <KafaMascot mood={mascotMood} customMessage={mascotMessage} size="sm" />

            {/* Story Context if available */}
            {currentQ.contextStory && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 font-medium flex items-start gap-2">
                <span className="text-base">📖</span>
                <span>{currentQ.contextStory}</span>
              </div>
            )}

            {/* Question Card with Voice Button */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
                  {currentQ.question}
                </h2>
                <button
                  onClick={() => sound.speak(currentQ.audioPrompt || currentQ.question)}
                  className="p-2.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-2xl cursor-pointer flex-shrink-0 transition-transform active:scale-90"
                  title="Dengarkan Soal (Suara)"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Visual Display for Counting Objects */}
              {currentQ.visualType === 'objects' && currentQ.visualData && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-wrap justify-center gap-3">
                  {currentQ.visualData.count ? (
                    Array.from({ length: currentQ.visualData.count }).map((_, i) => (
                      <span key={i} className="text-3xl sm:text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                        {currentQ.visualData.emoji || '🍎'}
                      </span>
                    ))
                  ) : null}
                </div>
              )}

              {/* Interactive Options */}
              {renderQuestionInteractive()}
            </div>

            {/* Anti-Frustration Hints & AI Tutor */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Butuh Bantuan?</span>
              </div>
              <div className="flex items-center gap-2">
                {hintLevel < 3 && (
                  <button
                    onClick={handleUnlockHint}
                    className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-black px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95"
                  >
                    Buka Petunjuk {hintLevel + 1} 💡
                  </button>
                )}
                <button
                  onClick={() => onAskAITutor(currentQ)}
                  className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white font-black px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                >
                  <Bot className="w-3.5 h-3.5" /> Tanya KAFA AI
                </button>
              </div>
            </div>

            {/* Hint Display Boxes */}
            {hintLevel >= 1 && (
              <div className="text-xs bg-amber-100/80 p-3 rounded-2xl text-amber-900 border border-amber-300 animate-in fade-in">
                <strong>💡 Petunjuk:</strong> {currentQ.hint1}
              </div>
            )}

            {/* Explanation box after answer */}
            {isAnswered && (
              <div
                className={`p-4 rounded-2xl border-2 text-sm font-medium animate-in fade-in ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="font-black text-base flex items-center gap-2 mb-1">
                  {isCorrect ? '🎉 Jawabanmu Tepat!' : '💡 Pelajari Konsepnya:'}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Penjelasan:</strong> {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Footer Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-600 font-black text-xs sm:text-sm hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>

              {!isAnswered ? (
                <button
                  onClick={() => handleCheckAnswer()}
                  disabled={!selectedOption && !textInputAnswer}
                  className={`px-6 py-3 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                    selectedOption || textInputAnswer
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-105 active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" /> Periksa Jawaban
                </button>
              ) : (
                <button
                  onClick={handleNextChallenge}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <span>Lanjut ({challengeIndex + 1}/{TOTAL_CHALLENGES})</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
