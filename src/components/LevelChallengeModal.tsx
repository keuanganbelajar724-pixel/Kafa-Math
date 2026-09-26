import React, { useState, useEffect } from 'react';
import { MapNode, QuestionItem, LearningPhase } from '../types';
import { generateQuestion } from '../services/questionEngine';
import { sound } from '../services/sound';
import { InteractiveWorldStage, CharacterAction } from './adventure/InteractiveWorldStage';
import { InteractiveObjectChests } from './adventure/InteractiveObjectChests';
import { InteractiveRuneGate } from './adventure/InteractiveRuneGate';
import { InteractiveSteppingStones } from './adventure/InteractiveSteppingStones';
import { BossBattleArena } from './adventure/BossBattleArena';
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
  X,
  VolumeX,
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
  const TOTAL_CHALLENGES = 5; // Balanced 5 rich adventure stages per node to make every step feel significant and thrilling
  const [challengeIndex, setChallengeIndex] = useState(0); // 0..4
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textInputAnswer, setTextInputAnswer] = useState<string>('');

  // Adventure state
  const [characterAction, setCharacterAction] = useState<CharacterAction>('idle');
  const [characterPositionX, setCharacterPositionX] = useState<number>(20);
  const [speechBubbleText, setSpeechBubbleText] = useState<string | null>('Ayo kita mulai petualangan!');
  const [playerHearts, setPlayerHearts] = useState<number>(3);
  const [keysCount, setKeysCount] = useState<number>(0);
  const [gemsCount, setGemsCount] = useState<number>(0);

  // Boss Battle state
  const [bossHp, setBossHp] = useState<number>(3);
  const [bossHitAnimation, setBossHitAnimation] = useState<boolean>(false);

  // Challenge status
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Generate 5 challenges on mount
  useEffect(() => {
    const list: QuestionItem[] = [];
    for (let i = 0; i < TOTAL_CHALLENGES; i++) {
      const q = generateQuestion(childPhase as any, node.topicId, node.difficulty || 1);
      list.push(q);
    }
    setQuestions(list);
  }, [node, childPhase]);

  const currentQ = questions[challengeIndex];
  const isBossStage = challengeIndex === TOTAL_CHALLENGES - 1 || node.type === 'boss';

  // Audio and prompt read on question change
  useEffect(() => {
    if (currentQ && !isFinished) {
      if (!isMuted) {
        sound.speak(currentQ.audioPrompt || currentQ.question);
      }
      setSelectedOption('');
      setTextInputAnswer('');
      setIsAnswered(false);
      setIsCorrect(false);
      setHintLevel(0);
      setAttempts(0);
      setCharacterAction('idle');
      setCharacterPositionX(20 + challengeIndex * 12);

      if (isBossStage) {
        setSpeechBubbleText('⚔️ Waspada! Penjaga Gerbang Muncul!');
      } else {
        setSpeechBubbleText('Temukan jawabannya!');
      }
    }
  }, [challengeIndex, questions, isFinished, isBossStage, isMuted]);

  if (!currentQ && !isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-900 text-white rounded-3xl p-8 max-w-sm text-center shadow-2xl border-4 border-amber-400">
          <div className="text-5xl mb-4 animate-bounce">🗺️</div>
          <p className="font-black text-lg text-amber-300">Mempersiapkan Dunia Petualangan...</p>
          <p className="text-xs text-slate-300 mt-1">Mengumpulkan peta dan tantangan matematika</p>
        </div>
      </div>
    );
  }

  // Answer selection handler
  const handleSelectAnswer = (option: string, itemIndex?: number) => {
    if (isAnswered) return;
    setSelectedOption(option);

    // Visual Character Reaction: walk towards target
    if (itemIndex !== undefined) {
      const targetPercent = 25 + itemIndex * 18;
      setCharacterPositionX(targetPercent);
      setCharacterAction('walking');
    }

    // Auto-check answer after brief walk
    setTimeout(() => {
      handleCheckAnswer(option);
    }, 350);
  };

  const handleCheckAnswer = (overrideAnswer?: string) => {
    const rawAnswer = overrideAnswer !== undefined ? overrideAnswer : (selectedOption || textInputAnswer);
    if (!rawAnswer) return;

    setAttempts((prev) => prev + 1);

    const isMatch =
      rawAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase() ||
      (currentQ.acceptedAnswers &&
        currentQ.acceptedAnswers.some((a) => a.trim().toLowerCase() === rawAnswer.trim().toLowerCase()));

    setIsAnswered(true);

    if (isMatch) {
      setIsCorrect(true);
      setCorrectCount((prev) => prev + 1);
      setEarnedXP((prev) => prev + 15);
      setEarnedCoins((prev) => prev + 5);
      setKeysCount((prev) => prev + 1);
      setGemsCount((prev) => prev + 1);

      // Character & Stage visual excitement
      if (isBossStage) {
        setCharacterAction('casting');
        setSpeechBubbleText('⚡ Serangan Mantra Berhasil!');
        setBossHitAnimation(true);
        setTimeout(() => setBossHitAnimation(false), 800);
        setBossHp((prev) => Math.max(0, prev - 1));
      } else {
        setCharacterAction('celebrating');
        setSpeechBubbleText('🎉 Hore! Jawaban Benar!');
      }

      sound.playCorrect();
      sound.playCoin();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } else {
      setIsCorrect(false);
      setCharacterAction('thinking');
      setSpeechBubbleText('🤔 Hmm, belum tepat...');
      sound.playRetry();

      // Soft heart decrease with safety floor
      setPlayerHearts((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNextChallenge = () => {
    if (challengeIndex + 1 < TOTAL_CHALLENGES) {
      setChallengeIndex((prev) => prev + 1);
    } else {
      // Completed level!
      setIsFinished(true);
      sound.playFanfare();
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });

      const finalStars = correctCount >= 4 ? 3 : correctCount >= 3 ? 2 : 1;
      const finalXP = earnedXP + 40;
      const finalCoins = earnedCoins + 15;
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
    setSpeechBubbleText(`💡 Petunjuk: ${hintText}`);
    sound.speak(`Petunjuk: ${hintText}`);
  };

  const handleSecretDiscovered = (type: 'coin' | 'xp' | 'lore', message: string) => {
    if (type === 'coin') setEarnedCoins((prev) => prev + 5);
    if (type === 'xp') setEarnedXP((prev) => prev + 15);
    setSpeechBubbleText(message);
  };

  // Determine active visual gameplay format
  const renderVisualGameplay = () => {
    // True / False Mode
    const isTrueFalse =
      currentQ.options.length === 2 &&
      ((currentQ.options.includes('Benar') && currentQ.options.includes('Salah')) ||
        (currentQ.options.includes('BENAR') && currentQ.options.includes('SALAH')));

    if (isTrueFalse) {
      return (
        <div className="grid grid-cols-2 gap-4 my-2">
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCorrectOption = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

            let style = 'bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 text-white';
            if (isSelected) style = 'bg-amber-500 border-yellow-200 text-white ring-4 ring-yellow-300';
            if (isAnswered) {
              if (isCorrectOption) style = 'bg-emerald-600 border-emerald-300 text-white ring-4 ring-emerald-400 font-black shadow-lg';
              else if (isSelected && !isCorrect) style = 'bg-rose-800 border-rose-400 text-white opacity-80';
            }

            return (
              <button
                key={i}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectAnswer(opt, i * 2)}
                className={`py-4 px-4 rounded-3xl font-black text-lg transition-all cursor-pointer flex items-center justify-center gap-3 ${style}`}
              >
                <span className="text-2xl">{opt.toUpperCase() === 'BENAR' ? '✅' : '❌'}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      );
    }

    // Boss Battle Arena Mode
    if (isBossStage) {
      return (
        <BossBattleArena
          bossName={node.title}
          bossAvatar={node.type === 'boss' ? '🐉' : '🗿'}
          bossHp={bossHp}
          bossMaxHp={3}
          options={currentQ.options}
          correctAnswer={currentQ.correctAnswer}
          selectedOption={selectedOption}
          isAnswered={isAnswered}
          onCastSpell={(opt, idx) => handleSelectAnswer(opt, idx)}
        />
      );
    }

    // Dynamic rotation of world mechanics:
    // Stage 1 & 4: Interactive Treasure Chests
    // Stage 2: Interactive Rune Gate
    // Stage 3: Stepping Stones Crossing
    if (challengeIndex === 1) {
      return (
        <InteractiveRuneGate
          options={currentQ.options}
          correctAnswer={currentQ.correctAnswer}
          selectedOption={selectedOption}
          isAnswered={isAnswered}
          onSelectKey={(opt, idx) => handleSelectAnswer(opt, idx)}
        />
      );
    } else if (challengeIndex === 2) {
      return (
        <InteractiveSteppingStones
          options={currentQ.options}
          correctAnswer={currentQ.correctAnswer}
          selectedOption={selectedOption}
          isAnswered={isAnswered}
          onSelectStone={(opt, idx) => handleSelectAnswer(opt, idx)}
        />
      );
    }

    // Default: Interactive Object Chests
    return (
      <InteractiveObjectChests
        options={currentQ.options}
        correctAnswer={currentQ.correctAnswer}
        selectedOption={selectedOption}
        isAnswered={isAnswered}
        onSelectChest={(opt, idx) => handleSelectAnswer(opt, idx)}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl max-w-3xl w-full border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 flex items-center justify-between text-white border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-amber-300">
                {node.title}
              </h3>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                {node.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Toggle */}
            <button
              onClick={() => {
                sound.speak(currentQ?.audioPrompt || currentQ?.question || '');
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-2xl border border-slate-700 cursor-pointer"
              title="Dengarkan Soal"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* AI Tutor */}
            <button
              onClick={() => onAskAITutor(currentQ)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-300" />
              <span>Tanya AI</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-2xl border border-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isFinished ? (
          /* Victory & Celebration Screen */
          <div className="p-6 sm:p-8 text-center space-y-6 bg-gradient-to-b from-slate-900 to-indigo-950 text-white">
            <div className="relative inline-block animate-bounce">
              <div className="text-7xl sm:text-8xl">👑</div>
              <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-spin" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                PETUALANGAN BERHASIL DITAKLUKKAN!
              </h2>
              <p className="text-sm text-slate-200 font-semibold max-w-md mx-auto">
                Hebat sekali, <strong className="text-yellow-300">{childName}</strong>! Kamu berhasil membuka seluruh gerbang dan menyelesaikan tantangan dengan cemerlang!
              </p>
            </div>

            {/* Stars Awarded */}
            <div className="flex items-center justify-center gap-3">
              {[1, 2, 3].map((starIdx) => {
                const earned =
                  correctCount >= 4 ? starIdx <= 3 : correctCount >= 3 ? starIdx <= 2 : starIdx <= 1;
                return (
                  <div
                    key={starIdx}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center border-4 ${
                      earned
                        ? 'bg-amber-400 border-yellow-200 text-amber-950 shadow-[0_0_25px_rgba(251,191,36,0.8)] scale-110'
                        : 'bg-slate-800 border-slate-700 text-slate-600'
                    }`}
                  >
                    <Star className={`w-8 h-8 sm:w-10 sm:h-10 ${earned ? 'fill-amber-950' : ''}`} />
                  </div>
                );
              })}
            </div>

            {/* Loot & XP Summary Card */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto bg-slate-950/70 p-4 rounded-3xl border border-amber-400/40">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-black uppercase block">Benar</span>
                <span className="text-xl font-black text-emerald-400">{correctCount}/{TOTAL_CHALLENGES}</span>
              </div>
              <div className="text-center border-x border-slate-800">
                <span className="text-[10px] text-slate-400 font-black uppercase block">XP Didapat</span>
                <span className="text-xl font-black text-amber-400">+{earnedXP + 40} XP</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-black uppercase block">Koin Emas</span>
                <span className="text-xl font-black text-yellow-300">+{earnedCoins + 15} 🪙</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setChallengeIndex(0);
                  setCorrectCount(0);
                  setIsFinished(false);
                  setPlayerHearts(3);
                }}
                className="px-5 py-3 rounded-2xl border-2 border-slate-700 text-slate-300 hover:bg-slate-800 font-black flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-amber-950 font-black text-base shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <span>Buka Petualangan Baru 🚀</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Interactive Adventure Stage */
          <div className="p-3 sm:p-5 overflow-y-auto space-y-3">
            {/* The Living 2D Stage */}
            <InteractiveWorldStage
              worldId={node.worldId}
              stageIndex={challengeIndex}
              totalStages={TOTAL_CHALLENGES}
              characterAction={characterAction}
              characterPositionX={characterPositionX}
              speechBubbleText={speechBubbleText}
              isBossStage={isBossStage}
              bossHp={bossHp}
              bossMaxHp={3}
              bossHitAnimation={bossHitAnimation}
              hearts={playerHearts}
              keysCount={keysCount}
              gemsCount={gemsCount}
              onSecretFound={handleSecretDiscovered}
            >
              {/* Question Riddle Parchment */}
              <div className="bg-slate-950/85 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border-2 border-amber-400/60 shadow-xl mb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                      📜 TEKA-TEKI MATEMATIKA {challengeIndex + 1}/{TOTAL_CHALLENGES}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                      {currentQ.question}
                    </h2>
                  </div>
                  <button
                    onClick={() => sound.speak(currentQ.audioPrompt || currentQ.question)}
                    className="p-2 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded-xl border border-amber-400/40 cursor-pointer flex-shrink-0"
                    title="Dengar Suara"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Counting Objects Visuals if present */}
                {currentQ.visualType === 'objects' && currentQ.visualData && (
                  <div className="mt-2 p-2 bg-black/40 rounded-xl flex flex-wrap justify-center gap-2">
                    {currentQ.visualData.count ? (
                      Array.from({ length: currentQ.visualData.count }).map((_, i) => (
                        <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.08}s` }}>
                          {currentQ.visualData.emoji || '🍎'}
                        </span>
                      ))
                    ) : null}
                  </div>
                )}
              </div>

              {/* Dynamic Game Mechanic Controls */}
              {renderVisualGameplay()}
            </InteractiveWorldStage>

            {/* Bottom Feedback & Next Navigation */}
            {isAnswered && (
              <div className="p-3 bg-slate-950 rounded-2xl border-2 border-amber-400/80 flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center">
                      <XCircle className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className="font-black text-sm text-white block">
                      {isCorrect ? 'Luar biasa! Benar!' : `Jawaban tepat: ${currentQ.correctAnswer}`}
                    </span>
                    <span className="text-xs text-slate-300">
                      {currentQ.explanation}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleNextChallenge}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-amber-950 font-black text-sm shadow-lg flex items-center gap-1.5 cursor-pointer flex-shrink-0 transition-transform hover:scale-105"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Hint & Assistance Drawer */}
            {!isAnswered && (
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Petunjuk Kafa:</span>
                  {hintLevel < 3 ? (
                    <button
                      onClick={handleUnlockHint}
                      className="text-amber-300 hover:text-amber-200 underline font-bold cursor-pointer"
                    >
                      Buka Petunjuk {hintLevel + 1}
                    </button>
                  ) : (
                    <span className="text-amber-300 font-bold">{currentQ.hint1}</span>
                  )}
                </div>
                <span className="text-slate-500 text-[11px]">
                  💡 Klik semak atau kristal untuk rahasia tersembunyi!
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
