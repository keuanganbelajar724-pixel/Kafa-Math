import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../services/sound';
import { Shield, Sparkles, Zap, Flame, Trophy, RotateCcw, X, Target, Pause, Play, Heart, Award, Snowflake, Bomb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GradeMathEngine, GradeLevel } from '../../services/gradeMathEngine';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface MonsterEntity {
  id: string;
  name: string;
  type: 'zombie_cyborg' | 'zombie_classic' | 'tuyul_ninja' | 'buto_ijo' | 'boss_golem';
  maxHp: number;
  hp: number;
  xPos: number; // percentage from left (0 to 100). Hero is at ~18%
  speed: number;
  walkFrame: number;
  isHit: boolean;
  isDead: boolean;
  scoreValue: number;
}

interface Projectile {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  type: 'slingshot_bullet' | 'fireball' | 'laser';
}

export const TowerDefenseMathGame: React.FC<Props> = ({ onComplete, onExit }) => {
  // Grade level
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(2);

  // Game state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameover' | 'victory'>('menu');
  const [currentWave, setCurrentWave] = useState<number>(1);
  const totalWaves = 5;

  // Fortress & Hero HP
  const [barrierHp, setBarrierHp] = useState<number>(100);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);

  // Powerups cooldowns / stock
  const [freezeActive, setFreezeActive] = useState<boolean>(false);
  const [freezeCharges, setFreezeCharges] = useState<number>(2);
  const [bombCharges, setBombCharges] = useState<number>(2);

  // Questions
  const [question, setQuestion] = useState<{
    prompt: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }>({
    prompt: '9 + 5',
    options: ['14', '15', '16'],
    correctAnswer: '14',
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  // Active Monsters on screen
  const [monsters, setMonsters] = useState<MonsterEntity[]>([]);

  // Visual effects
  const [heroAction, setHeroAction] = useState<'idle' | 'aim' | 'shoot' | 'hurt'>('idle');
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<Array<{ id: number; text: string; x: number; y: number; color: string }>>([]);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [dangerAlert, setDangerAlert] = useState<boolean>(false);
  const [redVignette, setRedVignette] = useState<boolean>(false);

  // Refs for animation loops
  const gameLoopRef = useRef<number | null>(null);
  const lastHeartbeatTime = useRef<number>(0);

  // Generate question according to selected grade
  const generateNewQuestion = () => {
    const q = GradeMathEngine.generateQuestion(selectedGrade);
    // Shuffle and pick 3 or 4 options
    const opts = q.options.slice(0, 3);
    if (!opts.includes(q.correctAnswer)) {
      opts[0] = q.correctAnswer;
      // shuffle
      opts.sort(() => Math.random() - 0.5);
    }
    setQuestion({
      prompt: q.question,
      options: opts,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
    setSelectedOption(null);
    setIsAnswering(false);
  };

  // Spawn monsters for a wave
  const spawnWave = (wave: number) => {
    const isBossWave = wave === totalWaves;
    const newMonsters: MonsterEntity[] = [];

    if (isBossWave) {
      // 1 Giant Boss + 2 Minions
      newMonsters.push({
        id: `boss_${Date.now()}`,
        name: 'Raja Buto Purba',
        type: 'boss_golem',
        maxHp: 4,
        hp: 4,
        xPos: 88,
        speed: 0.18,
        walkFrame: 0,
        isHit: false,
        isDead: false,
        scoreValue: 300,
      });
      newMonsters.push({
        id: `m_minion1_${Date.now()}`,
        name: 'Pengawal Zombi',
        type: 'zombie_cyborg',
        maxHp: 1,
        hp: 1,
        xPos: 76,
        speed: 0.28,
        walkFrame: 0,
        isHit: false,
        isDead: false,
        scoreValue: 80,
      });
    } else {
      // Regular wave of 3 - 4 monsters marching in line
      const types: Array<'zombie_cyborg' | 'zombie_classic' | 'tuyul_ninja' | 'buto_ijo'> = [
        'zombie_cyborg',
        'zombie_classic',
        'tuyul_ninja',
        'buto_ijo',
      ];

      const count = Math.min(4, 2 + wave);
      for (let i = 0; i < count; i++) {
        const t = types[(i + wave) % types.length];
        const hp = t === 'buto_ijo' ? 2 : 1;
        newMonsters.push({
          id: `m_${wave}_${i}_${Date.now()}`,
          name: t === 'zombie_cyborg' ? 'Zombi Robot' : t === 'zombie_classic' ? 'Zombi Lapar' : t === 'tuyul_ninja' ? 'Tuyul Kilat' : 'Buto Ijo',
          type: t,
          maxHp: hp,
          hp: hp,
          xPos: 72 + i * 14, // Spaced apart across the right field
          speed: t === 'tuyul_ninja' ? 0.45 : t === 'zombie_cyborg' ? 0.32 : 0.26 + (wave * 0.04),
          walkFrame: 0,
          isHit: false,
          isDead: false,
          scoreValue: 50 + wave * 15,
        });
      }
    }

    setMonsters(newMonsters);
  };

  // Start game
  const startGame = (grade: GradeLevel) => {
    sound.playClick();
    setSelectedGrade(grade);
    setCurrentWave(1);
    setBarrierHp(100);
    setScore(0);
    setCombo(0);
    setCoinsEarned(0);
    setFreezeCharges(2);
    setBombCharges(2);
    setGameState('playing');
    spawnWave(1);
    generateNewQuestion();
    sound.speak('Waspada! Pasukan monster mendekati desa! Pecahkan soal matematika untuk menembak ketapel!');
  };

  // Main game tick (Real-time monster walking & collision check)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setMonsters((prevMonsters) => {
        let anyMonsterNear = false;
        let fortressDamaged = false;

        const updated = prevMonsters.map((m) => {
          if (m.isDead) return m;

          // If frozen, speed is 0
          const actualSpeed = freezeActive ? 0 : m.speed;
          const nextX = m.xPos - actualSpeed;

          // Check if dangerously close to hero (x <= 40%)
          if (nextX <= 42) {
            anyMonsterNear = true;
          }

          // Check if reached hero's barricade (x <= 20%)
          if (nextX <= 22) {
            fortressDamaged = true;
            // Push back slightly after attacking
            return {
              ...m,
              xPos: 38,
              walkFrame: (m.walkFrame + 1) % 8,
            };
          }

          return {
            ...m,
            xPos: nextX,
            walkFrame: (m.walkFrame + 1) % 8,
          };
        });

        // Trigger danger pulse & heartbeat sound
        setDangerAlert(anyMonsterNear);
        if (anyMonsterNear) {
          const now = Date.now();
          if (now - lastHeartbeatTime.current > 1200) {
            sound.playHeartbeat();
            lastHeartbeatTime.current = now;
          }
        }

        // Apply fortress damage if monster breached barrier
        if (fortressDamaged) {
          sound.playHit();
          sound.playExplosion();
          setScreenShake(true);
          setRedVignette(true);
          setHeroAction('hurt');

          setTimeout(() => setScreenShake(false), 450);
          setTimeout(() => setRedVignette(false), 300);
          setTimeout(() => setHeroAction('idle'), 600);

          setBarrierHp((prevHp) => {
            const nextHp = Math.max(0, prevHp - 15);
            if (nextHp <= 0) {
              setGameState('gameover');
              sound.playRetry();
            }
            return nextHp;
          });
        }

        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, freezeActive]);

  // Projectile flight animation loop
  useEffect(() => {
    if (projectiles.length === 0) return;

    const projInterval = setInterval(() => {
      setProjectiles((prev) => {
        return prev
          .map((p) => {
            const dx = p.targetX - p.currentX;
            const dy = p.targetY - p.currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 4) {
              // Impact!
              return null;
            }

            const speed = 7;
            return {
              ...p,
              currentX: p.currentX + (dx / dist) * speed,
              currentY: p.currentY + (dy / dist) * speed,
            };
          })
          .filter(Boolean) as Projectile[];
      });
    }, 20);

    return () => clearInterval(projInterval);
  }, [projectiles]);

  // Handle User selecting an answer
  const handleAnswerSelect = (option: string) => {
    if (isAnswering || gameState !== 'playing') return;

    setIsAnswering(true);
    setSelectedOption(option);

    const isCorrect = option === question.correctAnswer;

    if (isCorrect) {
      // 1. Hero aims and shoots slingshot!
      setHeroAction('shoot');
      sound.playSlingshot();

      // Find the closest active monster
      const livingMonsters = monsters.filter((m) => !m.isDead);
      const targetMonster = livingMonsters.sort((a, b) => a.xPos - b.xPos)[0];

      if (targetMonster) {
        // Spawn projectile flying from hero (x: 18, y: 65) to monster
        const newProj: Projectile = {
          id: Date.now(),
          startX: 18,
          startY: 62,
          targetX: targetMonster.xPos,
          targetY: 65,
          currentX: 18,
          currentY: 62,
          type: 'slingshot_bullet',
        };
        setProjectiles((prev) => [...prev, newProj]);

        // When projectile hits after ~300ms
        setTimeout(() => {
          sound.playHit();
          sound.playLaser();

          const newCombo = combo + 1;
          setCombo(newCombo);
          const earned = 50 + newCombo * 20;
          setScore((s) => s + earned);
          setCoinsEarned((c) => c + 2);

          // Add floating score text
          setFloatingTexts((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: newCombo > 1 ? `💥 COMBO x${newCombo}! +${earned}` : `🎯 KENA! +${earned}`,
              x: targetMonster.xPos,
              y: 45,
              color: 'text-amber-300',
            },
          ]);

          // Damage target monster
          setMonsters((prevM) => {
            const nextMonsters = prevM.map((m) => {
              if (m.id === targetMonster.id) {
                const nextHp = m.hp - 1;
                const dead = nextHp <= 0;
                if (dead) {
                  sound.playCoin();
                }
                return {
                  ...m,
                  hp: Math.max(0, nextHp),
                  isHit: true,
                  isDead: dead,
                  xPos: dead ? m.xPos : Math.min(88, m.xPos + 12), // Knockback!
                };
              }
              return m;
            });

            // Reset hit flag after 300ms
            setTimeout(() => {
              setMonsters((curr) => curr.map((m) => (m.id === targetMonster.id ? { ...m, isHit: false } : m)));
            }, 300);

            // Check if all monsters in wave are defeated
            const allDefeated = nextMonsters.every((m) => m.isDead);
            if (allDefeated) {
              setTimeout(() => {
                if (currentWave >= totalWaves) {
                  // ALL WAVES CLEARED: VICTORY!
                  setGameState('victory');
                  sound.playFanfare();
                  confetti({ particleCount: 120, spread: 80 });
                } else {
                  // Next wave!
                  sound.playCorrect();
                  setCurrentWave((w) => w + 1);
                  spawnWave(currentWave + 1);
                  setFloatingTexts((prev) => [
                    ...prev,
                    {
                      id: Date.now(),
                      text: `🌊 GELOMBANG ${currentWave + 1} TIBA!`,
                      x: 50,
                      y: 30,
                      color: 'text-yellow-400 font-black',
                    },
                  ]);
                }
              }, 600);
            }

            return nextMonsters;
          });
        }, 300);
      }

      // Next question
      setTimeout(() => {
        setHeroAction('idle');
        generateNewQuestion();
      }, 700);
    } else {
      // WRONG ANSWER: Hero is confused, monsters march faster forward!
      sound.playRetry();
      sound.playWrong();
      setCombo(0);
      setHeroAction('hurt');

      setFloatingTexts((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: `❌ Meleset! Jawaban: ${question.correctAnswer}`,
          x: 20,
          y: 40,
          color: 'text-red-400',
        },
      ]);

      // Monsters surge forward 5%
      setMonsters((prev) =>
        prev.map((m) => ({
          ...m,
          xPos: Math.max(22, m.xPos - 5),
        }))
      );

      setTimeout(() => {
        setHeroAction('idle');
        generateNewQuestion();
      }, 1200);
    }
  };

  // Special Skill 1: Freeze Spell
  const useFreezeSpell = () => {
    if (freezeCharges <= 0 || freezeActive || gameState !== 'playing') return;
    sound.playFreeze();
    setFreezeCharges((c) => c - 1);
    setFreezeActive(true);

    setFloatingTexts((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: '❄️ MANTRA ES MEMBEKUKAN MONSTER! (4 Detik)',
        x: 50,
        y: 35,
        color: 'text-cyan-300 font-black',
      },
    ]);

    setTimeout(() => {
      setFreezeActive(false);
    }, 4000);
  };

  // Special Skill 2: Mega Bomb Knockback
  const useBombSpell = () => {
    if (bombCharges <= 0 || gameState !== 'playing') return;
    sound.playExplosion();
    setBombCharges((c) => c - 1);
    setScreenShake(true);

    setFloatingTexts((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: '💣 BOM BAMBU MELEDAK! MONSTER TERPENTAL!',
        x: 50,
        y: 35,
        color: 'text-orange-400 font-black',
      },
    ]);

    setMonsters((prev) =>
      prev.map((m) => ({
        ...m,
        xPos: Math.min(88, m.xPos + 25),
        hp: Math.max(1, m.hp - 1),
      }))
    );

    setTimeout(() => setScreenShake(false), 500);
  };

  return (
    <div
      id="adventure_tower_defense_game"
      className={`relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-600 select-none bg-slate-900 text-white ${
        screenShake ? 'animate-bounce' : ''
      }`}
    >
      {/* Red Danger Pulse Overlay (When monsters get close) */}
      {dangerAlert && (
        <div className="absolute inset-0 border-4 border-red-500/80 pointer-events-none z-30 animate-pulse shadow-[inset_0_0_40px_rgba(239,68,68,0.5)]" />
      )}

      {/* Red Damage Vignette Flash */}
      {redVignette && (
        <div className="absolute inset-0 bg-red-600/30 z-30 pointer-events-none transition-opacity duration-200" />
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER / STATUS BAR                                                */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 px-4 py-2.5 border-b-2 border-amber-600/40 flex flex-wrap items-center justify-between gap-2 z-20 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 hover:text-white rounded-xl text-xs font-black transition-colors cursor-pointer border border-amber-500/30"
          >
            ← Keluar
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-1.5">
              <span>🏹 Pendekar Math vs Pasukan Zombi</span>
            </h2>
            <p className="text-[11px] text-amber-200/80">
              Gelombang {currentWave}/{totalWaves} • Kelas {selectedGrade} SD
            </p>
          </div>
        </div>

        {/* Grade selector */}
        {gameState === 'menu' && (
          <div className="flex items-center gap-1 bg-stone-800/90 p-1 rounded-xl border border-amber-500/30">
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <button
                key={g}
                onClick={() => {
                  sound.playClick();
                  setSelectedGrade(g as GradeLevel);
                }}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
              >
                Kls {g}
              </button>
            ))}
          </div>
        )}

        {/* Status Metrics (HP, Score, Combo) */}
        {gameState === 'playing' && (
          <div className="flex items-center gap-3">
            {/* Barrier HP */}
            <div className="flex items-center gap-1.5 bg-stone-800/90 px-3 py-1 rounded-xl border border-stone-700">
              <Shield className={`w-4 h-4 ${barrierHp > 35 ? 'text-emerald-400' : 'text-red-400 animate-pulse'}`} />
              <span className="text-xs font-black text-amber-100">Benteng: {barrierHp}%</span>
            </div>

            {/* Score & Coins */}
            <div className="flex items-center gap-2">
              <div className="bg-amber-500/20 border border-amber-500/50 px-2.5 py-1 rounded-xl text-xs font-black text-amber-300">
                ⭐ {score}
              </div>
              <div className="bg-yellow-500/20 border border-yellow-500/50 px-2.5 py-1 rounded-xl text-xs font-black text-yellow-300">
                🪙 +{coinsEarned}
              </div>
            </div>

            {/* Pause / Resume */}
            <button
              onClick={() => {
                sound.playClick();
                setGameState((s) => (s === 'playing' ? 'paused' : 'playing'));
              }}
              className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center cursor-pointer shadow-md transition-transform hover:scale-105"
            >
              <Pause className="w-4 h-4 fill-white" />
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. MENU SCREEN                                                            */}
      {/* ========================================================================= */}
      {gameState === 'menu' && (
        <div className="p-6 sm:p-8 text-center space-y-6 max-w-lg mx-auto my-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-3xl flex items-center justify-center text-5xl sm:text-6xl shadow-2xl border-4 border-white animate-bounce">
              🧟‍♂️🏹
            </div>
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow animate-pulse">
              AKSI SERU 🔥
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-300">
              Petualangan Math vs Zombi
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              Pasukan Zombi dan monster liar sedang berbaris menyerbu benteng desa! Jadilah pahlawan berketapel sakti, pecahkan soal matematika cepat, dan pukul mundur seluruh gelombang musuh!
            </p>
          </div>

          {/* Grade selection cards */}
          <div className="space-y-2.5 text-left">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block">
              Pilih Tingkat Jenjang:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { g: 1, label: 'Kelas 1 SD', desc: 'Tambah/Kurang 1-20', icon: '🌱' },
                { g: 2, label: 'Kelas 2 SD', desc: 'Hitung Cepat & Deret', icon: '🏹' },
                { g: 3, label: 'Kelas 3 SD', desc: 'Tabel Perkalian Dasar', icon: '⚔️' },
                { g: 4, label: 'Kelas 4 SD', desc: 'Perkalian & Pembagian', icon: '💣' },
                { g: 5, label: 'Kelas 5 SD', desc: 'Pecahan & Desimal', icon: '⚡' },
                { g: 6, label: 'Kelas 6 SD', desc: 'Operasi Campuran & FPB', icon: '👑' },
              ].map((item) => (
                <button
                  key={item.g}
                  onClick={() => startGame(item.g as GradeLevel)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between group ${
                    selectedGrade === item.g
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                      : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:border-amber-400 hover:bg-stone-800'
                  }`}
                >
                  <div className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="mt-2">
                    <div className="font-black text-xs text-white">{item.label}</div>
                    <div className="text-[10px] text-stone-400 leading-tight mt-0.5">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => startGame(selectedGrade)}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black text-base rounded-2xl shadow-xl transition-transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-stone-950" />
            <span>Mulai Bertualang & Bertarung!</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ACTIVE PLAYING CANVAS / BATTLEFIELD ARENA                               */}
      {/* ========================================================================= */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="relative flex flex-col">
          {/* PAUSE OVERLAY */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs z-40 flex flex-col items-center justify-center space-y-4">
              <span className="text-5xl">⏸️</span>
              <h3 className="text-xl font-black text-amber-300">Permainan Deda Sementara</h3>
              <p className="text-xs text-stone-300">Tarik napas, siapkan strategi berhitungmu!</p>
              <button
                onClick={() => setGameState('playing')}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-2xl text-sm cursor-pointer shadow-lg"
              >
                Lanjutkan Pertempuran ▶
              </button>
            </div>
          )}

          {/* MAIN 2D BATTLEFIELD ARENA (Meadow, Sky, Rolling Hills, Marching Path) */}
          <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200">
            {/* Sun with Rays (Matching user reference top right) */}
            <div className="absolute top-4 right-10 w-20 h-20 rounded-full bg-yellow-300/80 blur-xs shadow-[0_0_40px_rgba(253,224,71,0.8)] pointer-events-none flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-yellow-200" />
            </div>

            {/* Soft Moving Clouds */}
            <div className="absolute top-6 left-12 opacity-80 text-4xl animate-pulse">☁️</div>
            <div className="absolute top-12 left-1/2 opacity-70 text-3xl">☁️</div>

            {/* Background Rolling Green Hills */}
            <svg
              className="absolute bottom-16 inset-x-0 w-full h-32 text-emerald-400/90 pointer-events-none"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
            >
              <path
                d="M0,120 Q200,40 400,100 T800,80 T1000,110 L1000,200 L0,200 Z"
                fill="currentColor"
              />
            </svg>
            <svg
              className="absolute bottom-12 inset-x-0 w-full h-28 text-emerald-500 pointer-events-none"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
            >
              <path
                d="M0,140 Q300,60 600,130 T1000,120 L1000,200 L0,200 Z"
                fill="currentColor"
              />
            </svg>

            {/* Lush Trees & Flowers */}
            <div className="absolute bottom-20 left-16 text-3xl pointer-events-none">🌳</div>
            <div className="absolute bottom-22 left-28 text-2xl pointer-events-none">🌲</div>
            <div className="absolute bottom-20 right-24 text-3xl pointer-events-none">🌳</div>
            <div className="absolute bottom-22 right-12 text-2xl pointer-events-none">🌲</div>

            {/* Ground / Grassy Path */}
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-emerald-800 via-emerald-600 to-emerald-500 border-t-2 border-emerald-400">
              {/* Grass details & wildflowers */}
              <div className="flex justify-around items-center pt-2 text-xs opacity-75">
                <span>🌱</span><span>🌼</span><span>🌱</span><span>🌸</span><span>🌱</span><span>🌼</span><span>🌱</span><span>🌸</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* HANGING WOODEN QUESTION & ANSWER BOARDS (DIRECT USER REFERENCE REPLICA!) */}
            {/* ========================================================================= */}
            <div className="absolute top-2 inset-x-0 mx-auto w-full max-w-sm sm:max-w-md z-20 flex flex-col items-center pointer-events-auto">
              {/* Hanging Ropes */}
              <div className="w-full flex justify-between px-16 -mb-1">
                <div className="w-1.5 h-6 bg-amber-900 border-l border-amber-700" />
                <div className="w-1.5 h-6 bg-amber-900 border-r border-amber-700" />
              </div>

              {/* Main Wooden Question Signboard */}
              <div className="w-full bg-gradient-to-b from-amber-100 via-amber-50 to-amber-200 border-4 border-amber-800 rounded-2xl shadow-xl px-4 py-2 text-center relative overflow-hidden">
                {/* Wood nail rivets */}
                <div className="absolute top-1.5 left-2 w-2 h-2 rounded-full bg-stone-700" />
                <div className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-stone-700" />
                <div className="text-stone-900 font-black text-lg sm:text-2xl tracking-wider">
                  {question.prompt}
                </div>
              </div>

              {/* Hanging Answer Plaques (Below the Question Board) */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 w-full">
                {question.options.map((opt, idx) => {
                  const isChosen = selectedOption === opt;
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      {/* Short hanging rope */}
                      <div className="w-1 h-2 bg-amber-900" />
                      <button
                        onClick={() => handleAnswerSelect(opt)}
                        disabled={isAnswering}
                        className={`w-16 sm:w-20 py-2 sm:py-2.5 rounded-2xl font-black text-base sm:text-lg text-stone-900 shadow-lg border-3 transition-all cursor-pointer select-none active:scale-95 ${
                          isChosen
                            ? opt === question.correctAnswer
                              ? 'bg-emerald-300 border-emerald-600 scale-105 ring-4 ring-emerald-400'
                              : 'bg-red-300 border-red-600 animate-shake'
                            : 'bg-gradient-to-b from-amber-100 via-amber-50 to-amber-200 border-amber-800 hover:from-amber-50 hover:to-amber-100 hover:scale-105'
                        }`}
                      >
                        {opt}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danger Warning Alert Banner when monsters get dangerously close */}
            {dangerAlert && (
              <div className="absolute top-28 left-4 z-20 bg-red-600/90 text-white font-black text-[10px] sm:text-xs px-3 py-1 rounded-xl shadow-lg border border-red-300 animate-pulse flex items-center gap-1.5">
                <span>⚠️</span>
                <span>BAHAYA! MONSTER SUDAH DEKAT! CEPAT TEMBAK!</span>
              </div>
            )}

            {/* Floating Damage & Score Text Overlays */}
            {floatingTexts.map((f) => (
              <div
                key={f.id}
                className={`absolute z-30 font-black text-xs sm:text-sm animate-bounce ${f.color} pointer-events-none drop-shadow-md`}
                style={{
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {f.text}
              </div>
            ))}

            {/* Flying Slingshot Projectiles */}
            {projectiles.map((p) => (
              <div
                key={p.id}
                className="absolute z-25 text-2xl filter drop-shadow-md transition-transform"
                style={{
                  left: `${p.currentX}%`,
                  top: `${p.currentY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                ⚡🔥
              </div>
            ))}

            {/* ========================================================================= */}
            {/* HERO CHARACTER (Left side on Barricade, holding pink/wood Slingshot)       */}
            {/* ========================================================================= */}
            <div
              className={`absolute bottom-4 left-4 sm:left-8 z-20 flex flex-col items-center transition-transform duration-200 ${
                heroAction === 'shoot'
                  ? 'scale-110 translate-x-2'
                  : heroAction === 'hurt'
                  ? '-translate-x-2 opacity-70 animate-shake'
                  : ''
              }`}
            >
              {/* Wooden Barricade Fence */}
              <div className="absolute -bottom-1 -left-2 text-2xl sm:text-3xl opacity-90">
                🪵🛡️
              </div>

              {/* Animated Kid Hero SVG with Slingshot */}
              <div className="relative">
                <svg
                  width="70"
                  height="95"
                  viewBox="0 0 70 95"
                  className="overflow-visible"
                >
                  {/* Legs */}
                  <rect x="22" y="60" width="8" height="22" rx="4" fill="#15803d" />
                  <rect x="36" y="60" width="8" height="22" rx="4" fill="#15803d" />
                  {/* Shoes */}
                  <ellipse cx="24" cy="84" rx="7" ry="4" fill="#1e293b" />
                  <ellipse cx="42" cy="84" rx="7" ry="4" fill="#1e293b" />

                  {/* Body / Blue Shirt */}
                  <rect x="18" y="32" width="30" height="30" rx="8" fill="#0284c7" />
                  <line x1="33" y1="32" x2="33" y2="62" stroke="#0369a1" strokeWidth="2" />

                  {/* Head */}
                  <circle cx="33" cy="20" r="16" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
                  {/* Hair */}
                  <path d="M18,18 Q33,4 48,18 Q40,6 26,10 Z" fill="#eab308" />

                  {/* Glasses */}
                  <circle cx="27" cy="18" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  <circle cx="39" cy="18" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                  <line x1="32" y1="18" x2="34" y2="18" stroke="#0f172a" strokeWidth="2" />
                  {/* Pupils */}
                  <circle cx="28" cy="18" r="2" fill="#0f172a" />
                  <circle cx="40" cy="18" r="2" fill="#0f172a" />

                  {/* Cheerful Smile */}
                  <path d="M28,26 Q33,30 38,26" fill="none" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Arm & Pink/Wood Slingshot (Pointing Right!) */}
                  <path d="M38,42 L52,40" stroke="#fde047" strokeWidth="5" strokeLinecap="round" />
                  {/* Slingshot Fork */}
                  <path
                    d="M52,40 L58,34 M52,40 L58,46 M58,34 Q50,40 58,46"
                    stroke="#ec4899"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Loaded Glowing Ammo */}
                  <circle cx="53" cy="40" r="4" fill="#f59e0b" className="animate-ping" />
                </svg>
              </div>

              <span className="text-[10px] font-black text-amber-300 bg-stone-900/80 px-2 py-0.5 rounded-md border border-amber-500/40 mt-0.5">
                Ksatria Matematika
              </span>
            </div>

            {/* ========================================================================= */}
            {/* MONSTER / ZOMBIE HORDE (Marching from Right to Left across the Field)     */}
            {/* ========================================================================= */}
            {monsters.map((m) => {
              if (m.isDead) return null;

              // Alternating walk sway
              const isStep = m.walkFrame % 2 === 0;
              const isCyborg = m.type === 'zombie_cyborg';
              const isBoss = m.type === 'boss_golem';

              return (
                <div
                  key={m.id}
                  className={`absolute bottom-4 flex flex-col items-center transition-all duration-100 z-15 ${
                    m.isHit ? 'opacity-80 scale-110 filter brightness-150' : ''
                  }`}
                  style={{
                    left: `${m.xPos}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {/* Monster HP Bar */}
                  <div className="w-12 sm:w-14 bg-stone-900/90 h-2 rounded-full mb-1 border border-stone-600 overflow-hidden shadow">
                    <div
                      className={`h-full transition-all duration-200 ${
                        m.hp / m.maxHp > 0.5 ? 'bg-red-500' : 'bg-orange-500 animate-pulse'
                      }`}
                      style={{ width: `${(m.hp / m.maxHp) * 100}%` }}
                    />
                  </div>

                  {/* Monster Name tag */}
                  <span className="text-[9px] font-bold bg-stone-900/90 text-stone-200 px-1.5 py-0.2 rounded mb-0.5 whitespace-nowrap border border-stone-700">
                    {m.name}
                  </span>

                  {/* Animated Zombie Character SVG */}
                  <div className={`relative ${isBoss ? 'scale-135' : ''}`}>
                    <svg
                      width="60"
                      height="85"
                      viewBox="0 0 60 85"
                      className="overflow-visible"
                    >
                      {/* Legs with walking cycle */}
                      <rect
                        x="18"
                        y="52"
                        width="7"
                        height="20"
                        rx="3"
                        fill="#334155"
                        transform={isStep ? 'rotate(12 21 52)' : 'rotate(-10 21 52)'}
                      />
                      <rect
                        x="32"
                        y="52"
                        width="7"
                        height="20"
                        rx="3"
                        fill="#334155"
                        transform={isStep ? 'rotate(-12 35 52)' : 'rotate(10 35 52)'}
                      />
                      {/* Shoes */}
                      <ellipse cx="18" cy="74" rx="6" ry="3" fill="#0f172a" />
                      <ellipse cx="36" cy="74" rx="6" ry="3" fill="#0f172a" />

                      {/* Body (Torn Shirt) */}
                      <rect x="14" y="28" width="28" height="26" rx="6" fill={isCyborg ? '#d6d3d1' : '#0284c7'} />

                      {/* Zombie Green Head */}
                      <circle
                        cx="28"
                        cy="18"
                        r="14"
                        fill={isCyborg ? '#14b8a6' : '#22c55e'}
                        stroke="#065f46"
                        strokeWidth="1.5"
                      />

                      {/* Brain / Cyborg Gear Top */}
                      {isCyborg ? (
                        <path d="M20,12 Q28,4 36,12" stroke="#f43f5e" strokeWidth="4" fill="none" />
                      ) : (
                        <path d="M22,10 Q28,5 34,10" stroke="#15803d" strokeWidth="3" fill="none" />
                      )}

                      {/* Zombie Staring Red/Yellow Eyes */}
                      <circle cx="22" cy="16" r="4.5" fill="#fef08a" stroke="#000" strokeWidth="1.5" />
                      <circle cx="34" cy="16" r="4.5" fill="#fef08a" stroke="#000" strokeWidth="1.5" />
                      <circle cx="20" cy="16" r="2" fill="#ef4444" />
                      <circle cx="32" cy="16" r="2" fill="#ef4444" />

                      {/* Mouth / Teeth */}
                      <path d="M22,24 Q28,28 34,24" stroke="#0f172a" strokeWidth="2" fill="none" />

                      {/* Outstretched Walking Zombie Arms (Pointing Left towards player!) */}
                      <path
                        d={isStep ? 'M20,36 L-4,32' : 'M20,38 L-4,42'}
                        stroke={isCyborg ? '#14b8a6' : '#22c55e'}
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <circle cx="-4" cy={isStep ? 32 : 42} r="4" fill="#0f766e" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* 4. BOTTOM ACTION & SPECIAL SPELL CONTROLS                                 */}
          {/* ========================================================================= */}
          <div className="bg-stone-950 p-3 sm:p-4 border-t-2 border-amber-600/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 hidden sm:inline">Mantra Sakti:</span>
              {/* Freeze spell button */}
              <button
                onClick={useFreezeSpell}
                disabled={freezeCharges <= 0 || freezeActive}
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  freezeCharges > 0 && !freezeActive
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Snowflake className="w-4 h-4" />
                <span>Beku Es ({freezeCharges})</span>
              </button>

              {/* Bomb spell button */}
              <button
                onClick={useBombSpell}
                disabled={bombCharges <= 0}
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  bombCharges > 0
                    ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-md'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Bomb className="w-4 h-4" />
                <span>Bom Bambu ({bombCharges})</span>
              </button>
            </div>

            {/* Current combo status */}
            <div className="text-right">
              {combo > 1 ? (
                <div className="text-xs font-black text-orange-400 animate-bounce flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-orange-400" />
                  <span>Combo x{combo}! Ketapel Membara!</span>
                </div>
              ) : (
                <div className="text-[11px] text-stone-400 font-bold">
                  Pilih jawaban di papan kayu untuk menembak!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. GAME OVER SCREEN                                                       */}
      {/* ========================================================================= */}
      {gameState === 'gameover' && (
        <div className="p-8 text-center space-y-5 max-w-md mx-auto my-6 animate-in zoom-in-95">
          <div className="text-6xl animate-bounce">🧟‍♂️💥🛡️</div>
          <div>
            <h2 className="text-2xl font-black text-red-400">Benteng Pertahanan Tembus!</h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2">
              Monster berhasil menerobos benteng. Jangan menyerah, asah kembali kecepatan hitungmu dan coba lagi!
            </p>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded-2xl border border-stone-700 text-xs text-amber-300 font-black">
            Skor Akhir: {score} Poin • Gelombang {currentWave}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => startGame(selectedGrade)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-2xl text-xs sm:text-sm cursor-pointer shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Coba Lagi
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-2xl text-xs sm:text-sm cursor-pointer"
            >
              Pilih Kelas Lain
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. VICTORY SCREEN                                                         */}
      {/* ========================================================================= */}
      {gameState === 'victory' && (
        <div className="p-8 text-center space-y-5 max-w-lg mx-auto my-6 animate-in zoom-in-95">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto animate-bounce drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-300">
              Kemenangan Pahlawan Desa! 🏆
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 mt-2">
              Luar biasa! Semua 5 gelombang monster dan raja zombi berhasil dipukul mundur dengan ketajaman berhitungmu!
            </p>
          </div>

          <div className="bg-amber-500/20 border-2 border-amber-500 p-4 rounded-2xl text-amber-300 font-black text-sm sm:text-base space-y-1">
            <div>Total Skor: {score} Poin</div>
            <div className="text-yellow-300">Hadiah Petualang: +150 XP & 50 Koin Emas! 🪙⭐</div>
          </div>

          <button
            onClick={() => onComplete(score + 150, 3)}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black text-base rounded-2xl shadow-xl transition-transform hover:scale-105 cursor-pointer"
          >
            Klaim Hadiah & Selesai 🛡️
          </button>
        </div>
      )}
    </div>
  );
};
