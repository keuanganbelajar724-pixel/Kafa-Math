import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Trophy, RotateCcw, Volume2, Shield, Flame, Swords, ArrowRight, Zap, Target } from 'lucide-react';
import { sound } from '../../services/sound';
import { GradeMathEngine, GradeLevel, GradeQuestion } from '../../services/gradeMathEngine';

interface MathVsMonsterBattleGameProps {
  initialGrade?: GradeLevel;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface Monster {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  icon: string;
  isBoss?: boolean;
  speed: number; // percentage per second
  attackPower: number;
  rewardXp: number;
}

export const MathVsMonsterBattleGame: React.FC<MathVsMonsterBattleGameProps> = ({
  initialGrade = 2,
  onComplete,
  onExit,
}) => {
  // Grade Selection (PAUD, Kelas 1, 2, 3, 4, 5, 6)
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);

  // Game state
  const [gameState, setGameState] = useState<'playing' | 'victory' | 'gameover'>('playing');
  const [playerHp, setPlayerHp] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [currentWave, setCurrentWave] = useState<number>(1);
  const totalWaves = 5;

  // Active Question
  const [question, setQuestion] = useState<GradeQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Animation & Battle visual states
  const [monsterPosition, setMonsterPosition] = useState<number>(85); // 85% (far right) down to 20% (reaches hero)
  const [heroAction, setHeroAction] = useState<'idle' | 'attack' | 'hit'>('idle');
  const [monsterAction, setMonsterAction] = useState<'walk' | 'hit' | 'attack' | 'die'>('walk');
  const [projectileActive, setProjectileActive] = useState<boolean>(false);
  const [damagePopup, setDamagePopup] = useState<{ show: boolean; text: string; x: number; y: number } | null>(null);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [redFlash, setRedFlash] = useState<boolean>(false);

  // Monster specs
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const movementRef = useRef<number | null>(null);

  // Spawn monster for current wave
  const spawnMonster = (wave: number) => {
    const isBoss = wave === totalWaves;
    let monster: Monster;

    if (isBoss) {
      monster = {
        id: `boss_${Date.now()}`,
        name: 'Raja Golem Purba',
        maxHp: 3,
        currentHp: 3,
        icon: '👹',
        isBoss: true,
        speed: 3.5, // slower but giant
        attackPower: 2,
        rewardXp: 150,
      };
    } else {
      const monsterTypes = [
        { name: 'Goblin Hutan', icon: '👺', maxHp: 1, speed: 6 },
        { name: 'Zombi Rawa', icon: '🧟', maxHp: 1, speed: 5.5 },
        { name: 'Monster Tengkorak', icon: '💀', maxHp: 1, speed: 7 },
        { name: 'Orc Raksasa', icon: '🧌', maxHp: 2, speed: 4.5 },
        { name: 'Penyihir Bayangan', icon: '🧙‍♂️', maxHp: 2, speed: 5 },
      ];
      const m = monsterTypes[(wave - 1) % monsterTypes.length];
      monster = {
        id: `m_${wave}_${Date.now()}`,
        name: m.name,
        maxHp: m.maxHp,
        currentHp: m.maxHp,
        icon: m.icon,
        isBoss: false,
        speed: m.speed + (wave * 0.5),
        attackPower: 1,
        rewardXp: 40,
      };
    }

    setCurrentMonster(monster);
    setMonsterPosition(82); // start on right side
    setMonsterAction('walk');
  };

  // Generate question for the selected grade
  const nextQuestion = () => {
    const q = GradeMathEngine.generateQuestion(selectedGrade);
    setQuestion(q);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback(null);
  };

  // Initialize Game & Wave
  useEffect(() => {
    if (initialGrade !== undefined) {
      setSelectedGrade(initialGrade);
    }
  }, [initialGrade]);

  useEffect(() => {
    spawnMonster(currentWave);
    nextQuestion();
  }, [currentWave, selectedGrade]);

  // Real-time Monster Walking Movement Loop
  useEffect(() => {
    if (gameState !== 'playing' || !currentMonster) return;

    const interval = 100; // update every 100ms
    const step = (currentMonster.speed * (interval / 1000));

    timerRef.current = setInterval(() => {
      setMonsterPosition((prev) => {
        const nextPos = prev - step;
        // Check if monster reaches player (around position 25%)
        if (nextPos <= 25) {
          // Monster attacks hero!
          handleMonsterReachHero();
          return 75; // reset monster back slightly after attack
        }
        return nextPos;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentMonster, playerHp]);

  // When monster walks and attacks the hero (timeout or too slow)
  const handleMonsterReachHero = () => {
    sound.playHit();
    sound.playExplosion();

    setScreenShake(true);
    setRedFlash(true);
    setMonsterAction('attack');
    setHeroAction('hit');

    setDamagePopup({ show: true, text: '-1 HP! Tertabrak Monster!', x: 25, y: 40 });

    setTimeout(() => setScreenShake(false), 500);
    setTimeout(() => setRedFlash(false), 300);
    setTimeout(() => setHeroAction('idle'), 600);
    setTimeout(() => setMonsterAction('walk'), 600);

    setCombo(0);
    setPlayerHp((prev) => {
      const updated = prev - 1;
      if (updated <= 0) {
        setGameState('gameover');
        sound.playRetry();
      }
      return updated;
    });
  };

  // Handle User Answer Click
  const handleAnswer = (ans: string) => {
    if (isAnswered || gameState !== 'playing' || !question || !currentMonster) return;

    setIsAnswered(true);
    setSelectedAnswer(ans);

    const isCorrect = ans === question.correctAnswer;

    if (isCorrect) {
      // 1. Play projectile sound & animation
      sound.playLaser();
      sound.playSlash();
      setHeroAction('attack');
      setProjectileActive(true);

      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = 100 + newCombo * 25 + (currentMonster.isBoss ? 200 : 0);
      setScore((prev) => prev + points);

      setFeedback({
        isCorrect: true,
        text: `Tepat Sekali! Serangan Berhasil! (+${points} Poin)`,
      });

      // Monster hit animation after projectile reaches
      setTimeout(() => {
        setProjectileActive(false);
        sound.playExplosion();
        setMonsterAction('hit');
        setDamagePopup({
          show: true,
          text: newCombo > 1 ? `💥 CRITICAL -1 HP! (Combo x${newCombo})` : '💥 -1 HP!',
          x: monsterPosition,
          y: 40,
        });

        // Deduct monster HP
        setCurrentMonster((prevM) => {
          if (!prevM) return null;
          const nextHp = prevM.currentHp - 1;

          if (nextHp <= 0) {
            // Monster defeated!
            setMonsterAction('die');
            sound.playCoin();

            setTimeout(() => {
              if (currentWave >= totalWaves) {
                // VICTORY!
                setGameState('victory');
                sound.playFanfare();
                onComplete(score + points + 300, 3);
              } else {
                // Next wave
                setCurrentWave((w) => w + 1);
              }
            }, 800);
          } else {
            // Push monster back on hit
            setMonsterPosition((pos) => Math.min(80, pos + 18));
            setTimeout(() => {
              setMonsterAction('walk');
              setHeroAction('idle');
              nextQuestion();
            }, 700);
          }
          return { ...prevM, currentHp: Math.max(0, nextHp) };
        });
      }, 350);
    } else {
      // Wrong answer -> Monster slashes player!
      sound.playRetry();
      sound.playHit();
      setCombo(0);
      setScreenShake(true);
      setRedFlash(true);
      setHeroAction('hit');
      setMonsterAction('attack');

      setFeedback({
        isCorrect: false,
        text: `Kurang Tepat! Jawaban yang benar: ${question.correctAnswer}. ${question.explanation}`,
      });

      setDamagePopup({ show: true, text: '-1 Hati!', x: 25, y: 35 });

      setTimeout(() => setScreenShake(false), 500);
      setTimeout(() => setRedFlash(false), 300);
      setTimeout(() => setHeroAction('idle'), 600);
      setTimeout(() => setMonsterAction('walk'), 600);

      setPlayerHp((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setGameState('gameover');
          sound.playRetry();
        }
        return next;
      });

      // Show explanation then next question
      setTimeout(() => {
        if (playerHp > 1) {
          nextQuestion();
        }
      }, 1800);
    }
  };

  const handleRestart = () => {
    setPlayerHp(3);
    setScore(0);
    setCombo(0);
    setCurrentWave(1);
    setGameState('playing');
    spawnMonster(1);
    nextQuestion();
  };

  return (
    <div
      id="math_vs_monster_game"
      className={`relative w-full max-w-4xl mx-auto bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/40 select-none ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Red Danger Flash Overlay */}
      {redFlash && (
        <div className="absolute inset-0 bg-red-600/30 z-30 pointer-events-none transition-opacity duration-200" />
      )}

      {/* Top Header Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-black transition-colors cursor-pointer"
          >
            ← Keluar
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-black text-amber-400 flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-orange-400" />
              <span>Pendekar Math vs Monster</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Gelombang {currentWave} dari {totalWaves} • {GradeMathEngine.getGradeLabel(selectedGrade)}
            </p>
          </div>
        </div>

        {/* Grade Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700 overflow-x-auto">
          {[
            { g: 1, label: 'Kls 1' },
            { g: 2, label: 'Kls 2' },
            { g: 3, label: 'Kls 3' },
            { g: 4, label: 'Kls 4' },
            { g: 5, label: 'Kls 5' },
            { g: 6, label: 'Kls 6' },
          ].map((item) => (
            <button
              key={item.g}
              onClick={() => {
                sound.playClick();
                setSelectedGrade(item.g as GradeLevel);
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                selectedGrade === item.g
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Player Stats */}
        <div className="flex items-center gap-3">
          {/* Hearts */}
          <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-xl border border-red-500/30">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i < playerHp ? 'text-red-500 fill-red-500 animate-pulse' : 'text-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Score & Combo */}
          <div className="text-right">
            <span className="text-xs font-black text-amber-400">{score} Poin</span>
            {combo > 1 && (
              <span className="block text-[10px] font-extrabold text-orange-400 animate-bounce">
                🔥 Combo x{combo}!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Battle Arena (Animated Canvas/Stage) */}
      <div className="relative h-64 sm:h-72 bg-gradient-to-b from-sky-900 via-emerald-950 to-stone-950 overflow-hidden border-b border-slate-800">
        {/* Background Atmosphere: Moon, Trees, Grass Field */}
        <div className="absolute top-4 right-12 w-16 h-16 rounded-full bg-amber-200/40 blur-xs shadow-inner" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-emerald-950 to-emerald-900/60 border-t border-emerald-800/40" />

        {/* Boss HP Bar (if Boss Wave) */}
        {currentMonster?.isBoss && (
          <div className="absolute top-3 inset-x-0 mx-auto w-64 sm:w-80 bg-slate-900/90 border-2 border-red-500 rounded-full px-3 py-1.5 shadow-xl flex items-center gap-2 z-10">
            <span className="text-xs font-black text-red-400 whitespace-nowrap">👑 BOS:</span>
            <div className="flex-1 bg-slate-800 h-3 rounded-full overflow-hidden border border-red-800">
              <div
                className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-300"
                style={{ width: `${(currentMonster.currentHp / currentMonster.maxHp) * 100}%` }}
              />
            </div>
            <span className="text-xs font-black text-amber-300">
              {currentMonster.currentHp}/{currentMonster.maxHp} HP
            </span>
          </div>
        )}

        {/* Hero Character (Left Side) */}
        <div
          className={`absolute bottom-10 left-6 sm:left-12 flex flex-col items-center transition-transform duration-200 z-10 ${
            heroAction === 'attack'
              ? 'translate-x-4 scale-110'
              : heroAction === 'hit'
              ? '-translate-x-3 opacity-60'
              : 'hover:scale-105'
          }`}
        >
          <div className="relative">
            {/* Hero Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-2 border-white">
              🧑‍🎓
            </div>
            {/* Weapon / Bow */}
            <div className="absolute -right-2 top-2 text-2xl animate-pulse">
              🗡️
            </div>
          </div>
          <span className="mt-1 text-[11px] font-black text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded-md border border-amber-500/40">
            Ksatria Cilik
          </span>
        </div>

        {/* Projectile (Laser / Arrow flying right) */}
        {projectileActive && (
          <div
            className="absolute bottom-16 sm:bottom-18 left-24 sm:left-32 text-3xl z-20 transition-all duration-300 animate-ping"
            style={{
              left: `${monsterPosition - 10}%`,
              transition: 'left 0.35s linear',
            }}
          >
            ⚡🔥
          </div>
        )}

        {/* Monster Character (Moving smoothly from right to left in real-time) */}
        {currentMonster && (
          <div
            className={`absolute bottom-10 flex flex-col items-center transition-all duration-100 z-10 ${
              monsterAction === 'hit'
                ? 'opacity-70 translate-x-2'
                : monsterAction === 'die'
                ? 'scale-0 opacity-0'
                : 'scale-100'
            }`}
            style={{
              left: `${monsterPosition}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Monster Health bar (for normal enemies) */}
            {!currentMonster.isBoss && (
              <div className="w-12 bg-slate-900 h-1.5 rounded-full mb-1 border border-slate-700 overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all duration-200"
                  style={{ width: `${(currentMonster.currentHp / currentMonster.maxHp) * 100}%` }}
                />
              </div>
            )}

            {/* Monster Avatar */}
            <div
              className={`rounded-2xl flex items-center justify-center shadow-2xl transition-transform ${
                currentMonster.isBoss
                  ? 'w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-red-600 to-rose-900 text-5xl sm:text-6xl border-3 border-amber-400 animate-pulse'
                  : 'w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-purple-800 to-slate-900 text-3xl sm:text-4xl border-2 border-purple-500'
              }`}
            >
              {currentMonster.icon}
            </div>

            <span className="mt-1 text-[10px] font-black text-rose-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-rose-900/60 whitespace-nowrap">
              {currentMonster.name}
            </span>
          </div>
        )}

        {/* Floating Damage Popup */}
        {damagePopup?.show && (
          <div
            className="absolute text-sm sm:text-base font-black text-yellow-300 bg-slate-950/90 px-3 py-1 rounded-full border border-yellow-400 shadow-xl animate-bounce z-30"
            style={{ left: `${damagePopup.x}%`, top: `${damagePopup.y}%` }}
          >
            {damagePopup.text}
          </div>
        )}
      </div>

      {/* Math Question & Answer Panel */}
      {gameState === 'playing' && question && (
        <div className="p-4 sm:p-6 bg-slate-900/95 space-y-4">
          {/* Question Banner */}
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-[11px] font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {question.gradeLabel}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Topik: {question.topicTitle}
                </span>
              </div>
              <p className="text-sm sm:text-base font-black text-white leading-snug">
                {question.question}
              </p>
            </div>

            {/* Visual Formula / Display Card */}
            {question.questionDisplay && (
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-4 py-2 rounded-xl text-lg sm:text-xl shadow-md whitespace-nowrap">
                {question.questionDisplay.mainText}
              </div>
            )}
          </div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {question.options.map((opt, idx) => {
              let btnStyle = 'bg-slate-800 hover:bg-slate-750 text-white border-slate-700 hover:border-amber-400';
              if (isAnswered) {
                if (opt === question.correctAnswer) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-black ring-2 ring-emerald-400 animate-pulse';
                } else if (opt === selectedAnswer) {
                  btnStyle = 'bg-red-600 text-white border-red-400 opacity-80';
                } else {
                  btnStyle = 'bg-slate-800/50 text-slate-500 border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(opt)}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 font-black text-base sm:text-lg shadow-md transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95 ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback & Hint Bar */}
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
                feedback.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-red-950/60 border-red-500/50 text-red-300'
              }`}
            >
              {feedback.isCorrect ? <Sparkles className="w-4 h-4 text-emerald-400" /> : <Shield className="w-4 h-4 text-red-400" />}
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      )}

      {/* Victory Screen Modal */}
      {gameState === 'victory' && (
        <div className="p-8 text-center space-y-5 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/60">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-4xl shadow-xl animate-bounce">
            👑
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-400">
              Kemenangan Gemilang!
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Kamu berhasil menaklukkan semua pasukan monster dan Raja Golem Purba dengan kecerdasan matematika!
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 max-w-xs mx-auto text-center space-y-1">
            <span className="text-xs text-slate-400 font-bold">Total Skor Ksatria</span>
            <div className="text-2xl font-black text-amber-300">{score} Poin</div>
            <div className="text-xs text-emerald-400 font-bold">+150 XP • +80 Koin</div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Main Lagi
            </button>
            <button
              onClick={onExit}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105"
            >
              <Trophy className="w-4 h-4" />
              Kembali ke Menu
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen Modal */}
      {gameState === 'gameover' && (
        <div className="p-8 text-center space-y-5 bg-gradient-to-b from-slate-900 via-slate-900 to-red-950/60">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-600 text-white flex items-center justify-center text-4xl shadow-xl">
            💔
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-red-400">
              Pertahanan Tertembus!
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Jangan menyerah! Setiap ksatria tangguh selalu bangkit dan berlatih berhitung lebih cepat!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              Coba Lagi
            </button>
            <button
              onClick={onExit}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-black text-sm cursor-pointer transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
