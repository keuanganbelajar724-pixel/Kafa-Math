import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../services/sound';
import { Rocket, Shield, Trophy, RotateCcw, Zap, Sparkles, AlertTriangle, Crosshair, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GradeMathEngine, GradeLevel, GradeQuestion } from '../../services/gradeMathEngine';

interface Props {
  initialGrade?: GradeLevel;
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

export const SpaceExplorerGame: React.FC<Props> = ({ initialGrade = 3, onComplete, onExit }) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [gameState, setGameState] = useState<'playing' | 'victory' | 'gameover'>('playing');

  // Spaceship status
  const [hullHp, setHullHp] = useState<number>(3); // 3 Shield integrity
  const [score, setScore] = useState<number>(0);
  const [warpEnergy, setWarpEnergy] = useState<number>(0);
  const [currentSector, setCurrentSector] = useState<number>(1);
  const totalSectors = 4;

  // Real-time obstacle / asteroid animation
  const [asteroidDistance, setAsteroidDistance] = useState<number>(85); // 85% to 20%
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [redAlert, setRedAlert] = useState<boolean>(false);
  const [isLaserFiring, setIsLaserFiring] = useState<boolean>(false);
  const [explosionActive, setExplosionActive] = useState<boolean>(false);

  // Math Question state
  const [question, setQuestion] = useState<GradeQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Boss state
  const isBossSector = currentSector === totalSectors;
  const [bossHp, setBossHp] = useState<number>(3);

  const loopRef = useRef<NodeJS.Timeout | null>(null);

  // Generate next question
  const loadQuestion = () => {
    const q = GradeMathEngine.generateQuestion(selectedGrade);
    setQuestion(q);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback(null);
    setAsteroidDistance(85);
  };

  useEffect(() => {
    if (initialGrade !== undefined) {
      setSelectedGrade(initialGrade);
    }
  }, [initialGrade]);

  useEffect(() => {
    loadQuestion();
    if (currentSector === totalSectors) {
      setBossHp(3);
    }
  }, [currentSector, selectedGrade]);

  // Real-time Asteroid / Alien attack movement loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = 100;
    const speed = isBossSector ? 4.5 : 5.5 + currentSector * 0.4;

    loopRef.current = setInterval(() => {
      setAsteroidDistance((prev) => {
        const next = prev - (speed * (interval / 1000));
        if (next <= 22) {
          // Asteroid / Alien Laser hits the Rocket!
          handleAsteroidCrash();
          return 80;
        }
        return next;
      });
    }, interval);

    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [gameState, currentSector, isBossSector, hullHp]);

  // Asteroid crashes into rocket
  const handleAsteroidCrash = () => {
    sound.playHit();
    sound.playExplosion();
    setScreenShake(true);
    setRedAlert(true);
    setExplosionActive(true);

    setFeedback({
      isCorrect: false,
      text: '⚠️ ROKET TERTABRAK ASTEROID! Perisai Berkurang 1!',
    });

    setTimeout(() => {
      setScreenShake(false);
      setRedAlert(false);
      setExplosionActive(false);
    }, 400);

    setHullHp((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setGameState('gameover');
        sound.playRetry();
      }
      return next;
    });
  };

  // Handle Answer
  const handleAnswer = (ans: string) => {
    if (isAnswered || gameState !== 'playing' || !question) return;

    setIsAnswered(true);
    setSelectedAnswer(ans);

    const isCorrect = ans === question.correctAnswer;

    if (isCorrect) {
      // Laser cannon blast!
      sound.playLaser();
      setIsLaserFiring(true);

      const pts = 120 + (isBossSector ? 150 : 0);
      setScore((s) => s + pts);
      setWarpEnergy((e) => Math.min(100, e + 25));

      setFeedback({
        isCorrect: true,
        text: `🎯 Tembakan Tepat! Rintangan Hancur! (+${pts} Poin)`,
      });

      // Explosion after laser connects
      setTimeout(() => {
        setIsLaserFiring(false);
        sound.playExplosion();
        setExplosionActive(true);

        setTimeout(() => setExplosionActive(false), 400);

        if (isBossSector) {
          setBossHp((b) => {
            const nextB = b - 1;
            if (nextB <= 0) {
              // Boss Mothership Defeated!
              sound.playFanfare();
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              setGameState('victory');
              onComplete(score + pts + 300, 3);
            } else {
              loadQuestion();
            }
            return Math.max(0, nextB);
          });
        } else {
          // Sector Cleared
          if (currentSector >= totalSectors - 1) {
            setCurrentSector(totalSectors); // Boss sector
          } else {
            setCurrentSector((s) => s + 1);
          }
        }
      }, 350);
    } else {
      // Wrong Answer -> Asteroid immediately crashes into rocket
      sound.playRetry();
      sound.playHit();
      setScreenShake(true);
      setRedAlert(true);
      setExplosionActive(true);

      setFeedback({
        isCorrect: false,
        text: `Kalkulasi Meleset! Jawaban benar: ${question.correctAnswer}. ${question.explanation}`,
      });

      setTimeout(() => {
        setScreenShake(false);
        setRedAlert(false);
        setExplosionActive(false);
      }, 450);

      setHullHp((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setGameState('gameover');
          sound.playRetry();
        }
        return next;
      });

      setTimeout(() => {
        if (hullHp > 1) {
          loadQuestion();
        }
      }, 1600);
    }
  };

  const handleRestart = () => {
    setHullHp(3);
    setScore(0);
    setWarpEnergy(0);
    setCurrentSector(1);
    setBossHp(3);
    setGameState('playing');
    loadQuestion();
  };

  return (
    <div
      id="space_explorer_action_game"
      className={`relative w-full max-w-4xl mx-auto bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border-4 border-indigo-500/40 select-none ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Red Alert Flash */}
      {redAlert && (
        <div className="absolute inset-0 bg-red-600/30 z-30 pointer-events-none transition-opacity duration-150" />
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
            <h2 className="text-sm sm:text-base font-black text-cyan-400 flex items-center gap-1.5">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span>Penjelajah Antariksa Garuda</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Sektor {currentSector}/{totalSectors} • {GradeMathEngine.getGradeLabel(selectedGrade)}
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
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Spacecraft Shield HP */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-xl border border-cyan-500/30">
            <span className="text-[10px] font-bold text-cyan-300 mr-1">PERISAI:</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <Shield
                key={i}
                className={`w-4 h-4 ${
                  i < hullHp ? 'text-cyan-400 fill-cyan-400 animate-pulse' : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <div className="text-xs font-black text-amber-400">{score} Poin</div>
        </div>
      </div>

      {/* Main Space Cockpit Viewport */}
      <div className="relative h-64 sm:h-72 bg-radial from-slate-900 via-indigo-950 to-slate-950 overflow-hidden border-b border-slate-800">
        {/* Animated Twinkling Starfield */}
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />
        <div className="absolute top-6 left-1/4 text-xs animate-ping">✨</div>
        <div className="absolute top-12 right-1/3 text-xs animate-pulse">⭐</div>
        <div className="absolute bottom-8 left-1/2 text-xs">🌟</div>

        {/* Boss Mothership Bar (Sector 4) */}
        {isBossSector && (
          <div className="absolute top-3 inset-x-0 mx-auto w-72 bg-slate-900/90 border-2 border-purple-500 rounded-full px-3 py-1.5 shadow-xl flex items-center gap-2 z-20">
            <span className="text-xs font-black text-purple-400 whitespace-nowrap">👾 INDUK ALIEN:</span>
            <div className="flex-1 bg-slate-800 h-3 rounded-full overflow-hidden border border-purple-800">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${(bossHp / 3) * 100}%` }}
              />
            </div>
            <span className="text-xs font-black text-pink-300">{bossHp}/3 HP</span>
          </div>
        )}

        {/* Player Rocket (Defending on Left) */}
        <div className="absolute bottom-12 left-6 sm:left-12 z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-xl border-2 border-cyan-300">
              🚀
            </div>
            {/* Rocket Thruster Flame */}
            <div className="absolute -left-3 top-5 text-xl animate-pulse">
              🔥
            </div>
          </div>
          <span className="mt-1 text-[11px] font-black text-cyan-300 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/40">
            Roket Garuda-1
          </span>
        </div>

        {/* Laser Torpedo Beam */}
        {isLaserFiring && (
          <div
            className="absolute bottom-20 left-28 sm:left-36 text-2xl z-20 animate-ping transition-all duration-300"
            style={{
              left: `${asteroidDistance - 10}%`,
              transition: 'left 0.35s linear',
            }}
          >
            ⚡💥
          </div>
        )}

        {/* Incoming Asteroid or Alien Boss (Moving from right to left) */}
        <div
          className="absolute bottom-12 z-10 flex flex-col items-center transition-all duration-100"
          style={{
            left: `${asteroidDistance}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div
            className={`rounded-2xl flex items-center justify-center shadow-2xl transition-transform ${
              isBossSector
                ? 'w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-purple-800 to-rose-950 text-5xl sm:text-6xl border-3 border-purple-400 animate-pulse'
                : 'w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-stone-800 to-amber-950 text-4xl border-2 border-amber-600'
            }`}
          >
            {isBossSector ? '🛸' : '☄️'}
          </div>
          <span className="mt-1 text-[10px] font-black text-amber-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-amber-800/60 whitespace-nowrap">
            {isBossSector ? 'Induk Alien Nebula' : 'Asteroid Kosmik'}
          </span>
        </div>

        {/* Explosion Effect */}
        {explosionActive && (
          <div
            className="absolute text-5xl sm:text-6xl z-30 animate-ping"
            style={{ left: `${asteroidDistance}%`, top: '40%' }}
          >
            💥
          </div>
        )}
      </div>

      {/* Math Problem Control Interface */}
      {gameState === 'playing' && question && (
        <div className="p-4 sm:p-6 bg-slate-900/95 space-y-4">
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-[11px] font-black bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/30">
                  {question.gradeLabel}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Target: {question.topicTitle}
                </span>
              </div>
              <p className="text-sm sm:text-base font-black text-white leading-snug">
                {question.question}
              </p>
            </div>

            {question.questionDisplay && (
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black px-4 py-2 rounded-xl text-lg sm:text-xl shadow-md whitespace-nowrap">
                {question.questionDisplay.mainText}
              </div>
            )}
          </div>

          {/* 4 Answer Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {question.options.map((opt, idx) => {
              let btnStyle = 'bg-slate-800 hover:bg-slate-750 text-white border-slate-700 hover:border-cyan-400';
              if (isAnswered) {
                if (opt === question.correctAnswer) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-black ring-2 ring-emerald-400';
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

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
                feedback.isCorrect
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-red-950/60 border-red-500/50 text-red-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{feedback.text}</span>
            </div>
          )}
        </div>
      )}

      {/* Victory Modal */}
      {gameState === 'victory' && (
        <div className="p-8 text-center space-y-5 bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/60">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 flex items-center justify-center text-4xl shadow-xl animate-bounce">
            🌌
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-cyan-400">
              Misi Antariksa Sukses!
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Roket Garuda berhasil menembus sabuk asteroid dan mengalahkan Armada Alien Nebula!
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 max-w-xs mx-auto text-center space-y-1">
            <span className="text-xs text-slate-400 font-bold">Total Skor Astronot</span>
            <div className="text-2xl font-black text-cyan-300">{score} Poin</div>
            <div className="text-xs text-emerald-400 font-bold">+180 XP • +90 Koin</div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Jelajah Lagi
            </button>
            <button
              onClick={onExit}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105"
            >
              <Trophy className="w-4 h-4" />
              Kembali ke Menu
            </button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <div className="p-8 text-center space-y-5 bg-gradient-to-b from-slate-900 via-slate-900 to-red-950/60">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-600 text-white flex items-center justify-center text-4xl shadow-xl">
            💥
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-red-400">
              Roket Kehabisan Perisai!
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
              Perbaiki koordinat kalkulasi matematikamu dan luncurkan roket kembali!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              Coba Ulang Misi
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
