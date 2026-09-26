import React, { useState, useEffect, useRef } from 'react';
import { GameMetadata } from '../../types/gameCenter';
import { sound } from '../../services/sound';
import {
  ArrowLeft,
  Heart,
  Clock,
  Flame,
  Star,
  Sparkles,
  Lightbulb,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  ChevronRight,
  Play,
  Home,
  Award,
  Zap,
  Volume2,
  VolumeX,
  Shield,
  Snowflake,
  Music,
  Swords,
  Timer,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Compass,
  Coffee,
  HelpCircle,
  Pause,
  X,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const getGameActionGuidance = (gameId: string): string => {
  switch (gameId) {
    case 'quick_math':
      return '👆 Hitung di kepala, lalu ketuk salah satu angka pilihan jawaban!';
    case 'number_catch':
      return '🎈 Amati instruksi di atas, lalu ketuk gelembung angka yang memenuhi kriteria!';
    case 'number_bond':
      return '🔗 Cari angka yang melengkapi ikatan agar total lingkaran di atas pas!';
    case 'math_match':
      return '🃏 Ketuk 1 kotak operasi di kiri, lalu ketuk kotak hasil yang sama di kanan!';
    case 'math_memory':
      return '🧠 Buka 2 kartu memori secara berurutan untuk mencocokkan nilainya!';
    case 'fraction_pizza':
      return '🍕 Sentuh irisan pizza sesuai angka pembilang, lalu tekan tombol Periksa!';
    case 'clock_master':
    case 'interactive_clock':
      return '⏰ Amati jarum pendek & panjang, lalu pilih jam digital yang tepat!';
    case 'coin_cashier':
      return '💰 Kumpulkan koin rupiah hingga tepat sama dengan nominal target belanja!';
    case 'pattern_quest':
    case 'pattern_master':
      return '🔍 Amati urutan pola bilangan, lalu tentukan angka pengisi tanda tanya!';
    case 'shape_sorter':
    case 'shape_builder':
      return '📐 Pilih bangun datar yang cocok dengan ciri dan sifat yang disebutkan!';
    case 'area_builder':
      return '🧱 Ketuk petak-petak kisi kotak hingga total luas perseginya pas!';
    case 'math_sort':
    case 'odd_even_runner':
      return '⚡ Tentukan dengan cepat apakah bilangan ini GANJIL atau GENAP!';
    case 'greater_or_less':
      return '⚖️ Bandingkan kedua sisi, lalu pilih simbol <, =, atau >!';
    case 'math_race':
      return '🏎️ Pacu larimu mendahului lawan dengan menjawab cepat dan benar!';
    case 'target_number':
      return '🎯 Pilih operasi matematika yang tepat menghasilkan angka target!';
    case 'math_detective':
      return '🕵️ Baca petunjuk detektif dan ketuk kotak brankas rahasia!';
    case 'balance_math':
      return '⚖️ Amati timbangan yang seimbang, hitung berat 1 buah benda misteri!';
    case 'quick_tap':
      return '⚡ Refleks kilat! Segera ketuk tombol angka target yang diminta!';
    case 'true_or_false':
      return '✅ Tentukan apakah rumus atau pernyataan ini BENAR atau SALAH!';
    case 'word_problem_adventure':
      return '📖 Baca cerita petualangan, kamu bisa sentuh apel untuk coret/hitung!';
    default:
      return '💡 Pahami pertanyaan dengan teliti, lalu tentukan jawaban yang paling tepat!';
  }
};

interface KafaGamePlayerProps {
  game: GameMetadata;
  onExit: () => void;
  onRewardXP: (xp: number, coins: number) => void;
  onPlayNextGame?: () => void;
}

export const KafaGamePlayer: React.FC<KafaGamePlayerProps> = ({
  game,
  onExit,
  onRewardXP,
  onPlayNextGame,
}) => {
  // Game states: 'intro' | 'playing' | 'gameover' | 'completed'
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'completed'>('intro');

  // Game Mode: 'adventure' | 'time_attack' | 'boss_battle' | 'relaxed'
  const [gameMode, setGameMode] = useState<'adventure' | 'time_attack' | 'boss_battle' | 'relaxed'>('adventure');
  const [bossHp, setBossHp] = useState<number>(500);
  const bossMaxHp = 500;

  // Power-Ups
  const [freezeAvailable, setFreezeAvailable] = useState<boolean>(true);
  const [freezeActive, setFreezeActive] = useState<boolean>(false);
  const [eliminateAvailable, setEliminateAvailable] = useState<boolean>(true);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [shieldAvailable, setShieldAvailable] = useState<boolean>(true);
  const [shieldActive, setShieldActive] = useState<boolean>(false);

  // Background Music & Interactive Review
  const [isBgmOn, setIsBgmOn] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const [isFeedbackPaused, setIsFeedbackPaused] = useState<boolean>(false);
  const [roundHistory, setRoundHistory] = useState<
    Array<{ round: number; question: string; isCorrect: boolean; explanation?: string }>
  >([]);

  // Stats
  const [score, setScore] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const totalRounds = gameMode === 'time_attack' ? 12 : 5;

  // World-Class Game Polish & Feedback States
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [floatingScore, setFloatingScore] = useState<{ id: number; text: string } | null>(null);

  // Feedback & Hint
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; explanation?: string } | null>(null);
  const feedbackAdvanceTimerRef = useRef<any>(null);

  // Specific Game Interactivities
  // Game 04: Math Match state
  const [matchSelectedLeft, setMatchSelectedLeft] = useState<number | null>(null);
  const [matchSelectedRight, setMatchSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

  // Game 05: Math Memory state
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);

  // Game 06: Fraction Pizza state
  const [pizzaSelectedSlices, setPizzaSelectedSlices] = useState<number[]>([]);

  // Game 11: Area Builder state
  const [areaFilledTiles, setAreaFilledTiles] = useState<number[]>([]);

  // Game 14: Math Race progress
  const [playerDistance, setPlayerDistance] = useState<number>(10);
  const [botDistance, setBotDistance] = useState<number>(10);

  // Game 20: Word Problem Apples clicked
  const [applesCrossed, setApplesCrossed] = useState<number[]>([]);

  // Timer reference
  const timerRef = useRef<any>(null);

  // Start the game
  const handleStartGame = () => {
    sound.playClick();
    if (feedbackAdvanceTimerRef.current) clearTimeout(feedbackAdvanceTimerRef.current);
    setIsFeedbackPaused(false);
    setGameState('playing');
    setScore(0);
    setHearts(3);
    setCombo(0);
    setMaxCombo(0);
    setRound(1);
    setFeedback(null);
    setShowHint(false);
    setRoundHistory([]);
    setBossHp(500);

    // Reset power-ups for the new game run
    setFreezeAvailable(true);
    setFreezeActive(false);
    setEliminateAvailable(true);
    setEliminatedOptions([]);
    setShieldAvailable(true);
    setShieldActive(false);

    resetRoundStates(1);
    const hasActiveTimer = (game.hasTimer || gameMode === 'time_attack') && gameMode !== 'relaxed';
    if (hasActiveTimer) {
      const roundDuration = gameMode === 'time_attack' ? 7 : 10;
      resetTimer(roundDuration);
    }
  };

  // Power-up activation handlers
  const handleUseFreeze = () => {
    if (!freezeAvailable || freezeActive) return;
    sound.playFreeze();
    setFreezeAvailable(false);
    setFreezeActive(true);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      setFreezeActive(false);
      if (gameState === 'playing' && (game.hasTimer || gameMode === 'time_attack')) {
        resetTimer(timeLeft > 0 ? timeLeft : 6);
      }
    }, 5000);
  };

  const handleUseShield = () => {
    if (!shieldAvailable || shieldActive) return;
    sound.playShield();
    setShieldAvailable(false);
    setShieldActive(true);
  };

  const handleUseEliminate = (options?: string[], correctAns?: string) => {
    if (!eliminateAvailable || !options || !correctAns) return;
    sound.playEliminate();
    setEliminateAvailable(false);
    const wrong = options.filter((o) => o !== correctAns);
    // Pick up to 2 wrong options to eliminate
    const shuffled = [...wrong].sort(() => 0.5 - Math.random());
    setEliminatedOptions(shuffled.slice(0, 2));
  };

  // Reset round-specific interactive state
  const resetRoundStates = (r: number) => {
    setPizzaSelectedSlices([]);
    setAreaFilledTiles([]);
    setMatchSelectedLeft(null);
    setMatchSelectedRight(null);
    setMatchedPairs([]);
    setMemoryFlipped([]);
    setMemoryMatched([]);
    setApplesCrossed([]);
    setEliminatedOptions([]);
  };

  // Interactivities for Game 04: Math Match
  const handleMatchClickLeft = (pairId: number, totalPairs: number, expText?: string) => {
    if (matchedPairs.includes(pairId)) return;
    sound.playClick();
    setMatchSelectedLeft(pairId);
    if (matchSelectedRight !== null) {
      if (pairId === matchSelectedRight) {
        sound.playCorrect();
        const updated = [...matchedPairs, pairId];
        setMatchedPairs(updated);
        setMatchSelectedLeft(null);
        setMatchSelectedRight(null);
        if (updated.length === totalPairs) {
          handleAnswer(true, expText, 'Kartu Cocok Logika');
        }
      } else {
        sound.playIncorrect();
        sound.playHaptic('warning');
        setMatchSelectedLeft(null);
        setMatchSelectedRight(null);
      }
    }
  };

  const handleMatchClickRight = (pairId: number, totalPairs: number, expText?: string) => {
    if (matchedPairs.includes(pairId)) return;
    sound.playClick();
    setMatchSelectedRight(pairId);
    if (matchSelectedLeft !== null) {
      if (pairId === matchSelectedLeft) {
        sound.playCorrect();
        const updated = [...matchedPairs, pairId];
        setMatchedPairs(updated);
        setMatchSelectedLeft(null);
        setMatchSelectedRight(null);
        if (updated.length === totalPairs) {
          handleAnswer(true, expText, 'Kartu Cocok Logika');
        }
      } else {
        sound.playIncorrect();
        sound.playHaptic('warning');
        setMatchSelectedLeft(null);
        setMatchSelectedRight(null);
      }
    }
  };

  // Interactivities for Game 05: Math Memory
  const handleMemoryCardClick = (
    cardIndex: number,
    card: { id: number; matchKey: string },
    cards: Array<{ id: number; matchKey: string }>,
    expText?: string
  ) => {
    if (memoryMatched.includes(card.id) || memoryFlipped.includes(cardIndex)) return;
    if (memoryFlipped.length >= 2) return;

    sound.playClick();
    const nextFlipped = [...memoryFlipped, cardIndex];
    setMemoryFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const firstCard = cards[nextFlipped[0]];
      const secondCard = card;

      if (firstCard.matchKey === secondCard.matchKey) {
        sound.playCorrect();
        const updated = [...memoryMatched, firstCard.id, secondCard.id];
        setMemoryMatched(updated);
        setMemoryFlipped([]);
        if (updated.length === cards.length) {
          handleAnswer(true, expText, 'Memori Matematika');
        }
      } else {
        sound.playIncorrect();
        setTimeout(() => {
          setMemoryFlipped([]);
        }, 900);
      }
    }
  };

  // Interactivities for Game 11: Area Builder
  const handleToggleAreaTile = (tileIndex: number) => {
    sound.playClick();
    setAreaFilledTiles((prev) =>
      prev.includes(tileIndex) ? prev.filter((i) => i !== tileIndex) : [...prev, tileIndex]
    );
  };

  const handleCheckAreaBuilder = (targetArea: number, expText?: string) => {
    const isCorrect = areaFilledTiles.length === targetArea;
    const explanation = isCorrect
      ? expText || `Tepat! Kamu telah membangun bentuk dengan luas ${targetArea} petak satuan!`
      : areaFilledTiles.length < targetArea
      ? `Petak masih kurang! Baru ada ${areaFilledTiles.length} petak, dibutuhkan ${targetArea} petak satuan.`
      : `Petak kelebihan! Kamu memasang ${areaFilledTiles.length} petak, targetnya adalah ${targetArea} petak satuan.`;
    handleAnswer(isCorrect, explanation, 'Arsitek Luas Persegi');
  };

  // Timer loop
  const resetTimer = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(seconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 4 && prev > 1) {
          sound.playTick(true);
        }
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeExpired = () => {
    if (gameState !== 'playing') return;
    sound.playIncorrect();
    sound.playHaptic('warning');
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
    setCombo(0);

    // Check if shield was active
    if (shieldActive) {
      sound.playShield();
      setShieldActive(false);
      setFeedback({
        isCorrect: false,
        message: '🛡️ Perisai Melindungi!',
        explanation: 'Waktu habis tetapi Perisai Suci melindungimu dari kehilangan nyawa!',
      });
      setTimeout(() => {
        handleNextRound();
      }, 1500);
      return;
    }

    if (game.hasHearts) {
      setHearts((h) => {
        const next = h - 1;
        if (next <= 0) {
          setGameState('gameover');
        }
        return next;
      });
    }

    setFeedback({
      isCorrect: false,
      message: 'Waktu habis!',
      explanation: 'Yuk coba lebih cepat di babak berikutnya.',
    });

    setTimeout(() => {
      handleNextRound();
    }, 1500);
  };

  // Clear timer and bgm on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      sound.stopBgm();
    };
  }, []);

  // Handle Answer Evaluation
  const handleAnswer = (isCorrect: boolean, explanationText?: string, questionTitle?: string) => {
    if (feedback) return; // Prevent double taps during animation

    if (timerRef.current) clearInterval(timerRef.current);

    // Save history for interactive review
    setRoundHistory((prev) => [
      ...prev,
      {
        round,
        question: questionTitle || `Tantangan Babak ${round}`,
        isCorrect,
        explanation: explanationText,
      },
    ]);

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // World-class combo audio synthesis
      sound.playCombo(newCombo);

      // Boss Battle Damage
      if (gameMode === 'boss_battle') {
        sound.playBossHit();
        const damage = 100 + newCombo * 20;
        setBossHp((hp) => Math.max(0, hp - damage));
      }

      // Speed bonus
      const speedBonus = game.hasTimer || gameMode === 'time_attack' ? timeLeft * 6 : 20;
      const comboMultiplier = Math.min(newCombo, 4);
      const pointsEarned = 100 * comboMultiplier + speedBonus;
      setScore((prev) => prev + pointsEarned);

      // Trigger floating score tag
      setFloatingScore({
        id: Date.now(),
        text: newCombo > 1 ? `+${pointsEarned} PTS (x${newCombo} COMBO!) 🔥` : `+${pointsEarned} PTS! ⭐`,
      });
      setTimeout(() => setFloatingScore(null), 1000);

      confetti({
        particleCount: newCombo > 2 ? 40 : 25,
        spread: newCombo > 2 ? 70 : 50,
        origin: { y: 0.7 },
      });

      setFeedback({
        isCorrect: true,
        message: newCombo > 1 ? `🔥 ${newCombo} COMBO! Luar Biasa!` : '✓ Hebat! Benar!',
        explanation: explanationText,
      });

      if (feedbackAdvanceTimerRef.current) clearTimeout(feedbackAdvanceTimerRef.current);
      feedbackAdvanceTimerRef.current = setTimeout(() => {
        handleNextRound();
      }, 3200);
    } else {
      // If shield is active, protect player!
      if (shieldActive) {
        sound.playShield();
        setShieldActive(false);
        setFeedback({
          isCorrect: false,
          message: '🛡️ Perisai Melindungi!',
          explanation: 'Jawaban kurang tepat tetapi Perisai Suci melindungimu dari kehilangan hati!',
        });
        if (feedbackAdvanceTimerRef.current) clearTimeout(feedbackAdvanceTimerRef.current);
        feedbackAdvanceTimerRef.current = setTimeout(() => {
          handleNextRound();
        }, 3200);
        return;
      }

      sound.playIncorrect();
      sound.playHaptic('warning');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
      setCombo(0);

      if (gameMode === 'boss_battle') {
        sound.playBossAttack();
      }

      let nextHearts = hearts;
      if (game.hasHearts) {
        nextHearts = hearts - 1;
        setHearts(nextHearts);
      }

      setFeedback({
        isCorrect: false,
        message: 'Belum tepat.',
        explanation: explanationText || 'Perhatikan lagi konsep perhitungannya.',
      });

      if (feedbackAdvanceTimerRef.current) clearTimeout(feedbackAdvanceTimerRef.current);
      feedbackAdvanceTimerRef.current = setTimeout(() => {
        if (nextHearts <= 0 && game.hasHearts) {
          setGameState('gameover');
        } else {
          handleNextRound();
        }
      }, 4500);
    }
  };

  const handleNextRound = () => {
    if (feedbackAdvanceTimerRef.current) {
      clearTimeout(feedbackAdvanceTimerRef.current);
      feedbackAdvanceTimerRef.current = null;
    }
    setIsFeedbackPaused(false);
    setFeedback(null);
    setShowHint(false);

    if (round < totalRounds) {
      const nextR = round + 1;
      setRound(nextR);
      resetRoundStates(nextR);
      const hasActiveTimer = (game.hasTimer || gameMode === 'time_attack') && gameMode !== 'relaxed';
      if (hasActiveTimer) {
        const roundDuration = gameMode === 'time_attack' ? 7 : 10;
        resetTimer(roundDuration);
      }
    } else {
      // Completed all rounds!
      finishGame();
    }
  };

  const finishGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('completed');
    sound.playCelebration();
    confetti({ particleCount: 80, spread: 90 });
    onRewardXP(game.xpReward, game.coinReward);
  };

  // ----------------------------------------------------------------------
  // ROUND DATA GENERATION FOR EACH GAME TYPE
  // ----------------------------------------------------------------------
  const getRoundContent = () => {
    switch (game.id) {
      // GAME 01: QUICK MATH
      case 'quick_math': {
        const pool = [
          { q: '27 + 18 = ?', a: '45', opts: ['35', '45', '55', '43'], exp: '20 + 10 = 30, 7 + 8 = 15 → 30 + 15 = 45', hint: 'Pisahkan puluhan dan satuan.' },
          { q: '8 × 7 = ?', a: '56', opts: ['54', '56', '58', '64'], exp: '8 × 7 = 56.', hint: 'Ingat perkalian 8: 8 × 5 = 40, tambah 16 = 56.' },
          { q: '63 - 29 = ?', a: '34', opts: ['34', '36', '44', '32'], exp: '63 - 30 = 33, lalu tambah 1 = 34.', hint: 'Gunakan taksiran dekat 30.' },
          { q: '9 × 6 = ?', a: '54', opts: ['45', '54', '56', '63'], exp: '9 × 6 = 54.', hint: 'Perkalian 9: angka puluhan 5, angka satuan 4 (5+4=9).' },
          { q: '75 + 38 = ?', a: '113', opts: ['103', '113', '115', '123'], exp: '75 + 25 = 100, lalu tambah 13 = 113.', hint: 'Jadikan angka bulat 100 terlebih dahulu.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 02: NUMBER CATCH
      case 'number_catch': {
        const pool = [
          { target: '10', prompt: 'Tap angka yang jika dijumlahkan dengan 4 hasilnya 10!', correct: '6', bubbles: ['3', '6', '7', '8', '2'], exp: '4 + 6 = 10.', hint: '10 - 4 = 6.' },
          { target: 'Kelipatan 5', prompt: 'Tap angka yang merupakan KELIPATAN 5!', correct: '25', bubbles: ['18', '21', '25', '32', '14'], exp: '25 adalah kelipatan 5 (5 × 5 = 25).', hint: 'Kelipatan 5 berakhiran angka 0 atau 5.' },
          { target: 'Terbesar', prompt: 'Tap angka TERBESAR di layar!', correct: '84', bubbles: ['79', '84', '68', '73', '81'], exp: '84 memiliki nilai puluhan tertinggi (8 puluhan + 4 satuan).', hint: 'Bandingkan angka puluhan lebih dulu.' },
          { target: 'Genap', prompt: 'Tap bilangan GENAP berikut!', correct: '38', bubbles: ['27', '31', '38', '45', '19'], exp: '38 berakhiran angka 8, jadi bilangan genap.', hint: 'Bilangan genap habis dibagi 2 (akhir 0,2,4,6,8).' },
          { target: 'Hasil 24', prompt: 'Tap hasil dari 6 × 4!', correct: '24', bubbles: ['18', '24', '28', '32', '36'], exp: '6 × 4 = 24.', hint: 'Empat dikalikan enam kali.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 03: NUMBER BOND
      case 'number_bond': {
        const pool = [
          { total: 10, part1: 6, part2Ans: 4, opts: [2, 3, 4, 5], exp: '10 = 6 + 4', hint: 'Kurangkan 10 dengan 6.' },
          { total: 20, part1: 13, part2Ans: 7, opts: [5, 6, 7, 8], exp: '20 = 13 + 7', hint: '20 - 13 = 7.' },
          { total: 50, part1: 35, part2Ans: 15, opts: [10, 15, 20, 25], exp: '50 = 35 + 15', hint: '50 - 35 = 15.' },
          { total: 100, part1: 64, part2Ans: 36, opts: [26, 34, 36, 46], exp: '100 = 64 + 36', hint: 'Lengkapi 64 ke puluhan terdekat (70), lalu ke 100.' },
          { total: 15, part1: 8, part2Ans: 7, opts: [6, 7, 8, 9], exp: '15 = 8 + 7', hint: '15 - 8 = 7.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 04: MATH MATCH (Kartu Cocok Logika)
      case 'math_match': {
        const pool = [
          {
            pairs: [
              { id: 1, left: '7 + 8', right: '15' },
              { id: 2, left: '6 × 4', right: '24' },
              { id: 3, left: '40 - 15', right: '25' },
              { id: 4, left: '9 × 3', right: '27' },
            ],
            rightOrder: [2, 4, 1, 3],
            exp: '7+8=15, 6×4=24, 40-15=25, 9×3=27. Semua pasangan cocok!',
            hint: 'Hitung operasi di sisi kiri terlebih dahulu, lalu temukan jawabannya di sisi kanan.',
          },
          {
            pairs: [
              { id: 1, left: '5 × 8', right: '40' },
              { id: 2, left: '50 - 18', right: '32' },
              { id: 3, left: '12 + 19', right: '31' },
              { id: 4, left: '36 ÷ 4', right: '9' },
            ],
            rightOrder: [3, 1, 4, 2],
            exp: '5×8=40, 50-18=32, 12+19=31, 36÷4=9. Pasangan tepat!',
            hint: '36 ÷ 4 = 9, 5 × 8 = 40.',
          },
          {
            pairs: [
              { id: 1, left: '8 × 7', right: '56' },
              { id: 2, left: '100 - 35', right: '65' },
              { id: 3, left: '4 × 12', right: '48' },
              { id: 4, left: '81 ÷ 9', right: '9' },
            ],
            rightOrder: [4, 2, 1, 3],
            exp: '8×7=56, 100-35=65, 4×12=48, 81÷9=9. Tepat sekali!',
            hint: '8 × 7 = 56, 100 - 35 = 65.',
          },
          {
            pairs: [
              { id: 1, left: '15 × 2', right: '30' },
              { id: 2, left: '75 - 25', right: '50' },
              { id: 3, left: '9 × 9', right: '81' },
              { id: 4, left: '64 ÷ 8', right: '8' },
            ],
            rightOrder: [2, 1, 4, 3],
            exp: '15×2=30, 75-25=50, 9×9=81, 64÷8=8.',
            hint: '9 × 9 = 81, 64 ÷ 8 = 8.',
          },
          {
            pairs: [
              { id: 1, left: '25 + 25', right: '50' },
              { id: 2, left: '11 × 6', right: '66' },
              { id: 3, left: '90 - 45', right: '45' },
              { id: 4, left: '7 × 7', right: '49' },
            ],
            rightOrder: [3, 1, 2, 4],
            exp: '25+25=50, 11×6=66, 90-45=45, 7×7=49.',
            hint: '11 × 6 = 66, 7 × 7 = 49.',
          },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 05: MATH MEMORY (Memori Matematika)
      case 'math_memory': {
        const pool = [
          {
            cards: [
              { id: 1, matchKey: 'pairA', label: '4 × 5' },
              { id: 2, matchKey: 'pairB', label: '18 + 12' },
              { id: 3, matchKey: 'pairA', label: '20' },
              { id: 4, matchKey: 'pairC', label: '7 × 3' },
              { id: 5, matchKey: 'pairB', label: '30' },
              { id: 6, matchKey: 'pairC', label: '21' },
            ],
            exp: '4×5 = 20, 18+12 = 30, 7×3 = 21. Ingatanmu sangat tajam!',
            hint: 'Ingat posisi kartu angka dan hitungannya saat dibuka!',
          },
          {
            cards: [
              { id: 1, matchKey: 'pairA', label: '9 × 2' },
              { id: 2, matchKey: 'pairB', label: '15 + 15' },
              { id: 3, matchKey: 'pairC', label: '8 × 4' },
              { id: 4, matchKey: 'pairA', label: '18' },
              { id: 5, matchKey: 'pairC', label: '32' },
              { id: 6, matchKey: 'pairB', label: '30' },
            ],
            exp: '9×2 = 18, 15+15 = 30, 8×4 = 32. Pasangan memori sempurna!',
            hint: 'Cari kartu dengan nilai hasil yang sama.',
          },
          {
            cards: [
              { id: 1, matchKey: 'pairA', label: '6 × 6' },
              { id: 2, matchKey: 'pairB', label: '50 - 25' },
              { id: 3, matchKey: 'pairB', label: '25' },
              { id: 4, matchKey: 'pairC', label: '10 × 4' },
              { id: 5, matchKey: 'pairA', label: '36' },
              { id: 6, matchKey: 'pairC', label: '40' },
            ],
            exp: '6×6 = 36, 50-25 = 25, 10×4 = 40. Sangat fokus!',
            hint: 'Perhatikan kartu yang sudah pernah dibuka.',
          },
          {
            cards: [
              { id: 1, matchKey: 'pairA', label: '8 × 6' },
              { id: 2, matchKey: 'pairC', label: '50 + 20' },
              { id: 3, matchKey: 'pairB', label: '100 ÷ 2' },
              { id: 4, matchKey: 'pairA', label: '48' },
              { id: 5, matchKey: 'pairB', label: '50' },
              { id: 6, matchKey: 'pairC', label: '70' },
            ],
            exp: '8×6 = 48, 100÷2 = 50, 50+20 = 70. Hebat sekali!',
            hint: '8 × 6 = 48.',
          },
          {
            cards: [
              { id: 1, matchKey: 'pairA', label: '7 × 7' },
              { id: 2, matchKey: 'pairB', label: '60 - 15' },
              { id: 3, matchKey: 'pairC', label: '9 × 6' },
              { id: 4, matchKey: 'pairA', label: '49' },
              { id: 5, matchKey: 'pairB', label: '45' },
              { id: 6, matchKey: 'pairC', label: '54' },
            ],
            exp: '7×7 = 49, 60-15 = 45, 9×6 = 54. Selamat kamu mengingat semuanya!',
            hint: '7 × 7 = 49, 9 × 6 = 54.',
          },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 06: FRACTION PIZZA
      case 'fraction_pizza': {
        const pool = [
          { fractionStr: '3/4', num: 3, den: 4, prompt: 'Pilih 3 dari 4 bagian pizza (3/4)', hint: 'Sentuh 3 potongan pizza hingga menyala.' },
          { fractionStr: '2/3', num: 2, den: 3, prompt: 'Pilih 2 dari 3 bagian pizza (2/3)', hint: 'Sentuh 2 potongan pizza.' },
          { fractionStr: '1/2', num: 2, den: 4, prompt: 'Pilih 2 dari 4 bagian pizza (setengah / 1/2)', hint: '2 potong dari 4 potong bernilai setengah (1/2).' },
          { fractionStr: '5/8', num: 5, den: 8, prompt: 'Pilih 5 dari 8 bagian pizza (5/8)', hint: 'Sentuh 5 potongan pizza.' },
          { fractionStr: '1/4', num: 1, den: 4, prompt: 'Pilih 1 dari 4 bagian pizza (seperempat / 1/4)', hint: 'Cukup sentuh 1 potongan saja.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 07: MONEY MASTER
      case 'money_master': {
        const pool = [
          { item: 'Buku Cerita Edukasi', price: 12000, paid: 20000, correct: 8000, opts: [5000, 6000, 8000, 10000], exp: 'Rp20.000 - Rp12.000 = Rp8.000', hint: 'Kurangkan uang pembayaran dengan harga buku.' },
          { item: 'Pensil Warna 12 Warna', price: 15000, paid: 50000, correct: 35000, opts: [25000, 35000, 40000, 30000], exp: 'Rp50.000 - Rp15.000 = Rp35.000', hint: 'Rp50.000 dikurangi Rp15.000.' },
          { item: 'Kotak Pensil Robot', price: 24000, paid: 30000, correct: 6000, opts: [4000, 5000, 6000, 8000], exp: 'Rp30.000 - Rp24.000 = Rp6.000', hint: 'Hitung selisih dari 24.000 menuju 30.000.' },
          { item: 'Penghapus Lucu 3 Pcs', price: 6000, paid: 10000, correct: 4000, opts: [3000, 4000, 5000, 6000], exp: 'Rp10.000 - Rp6.000 = Rp4.000', hint: 'Rp10.000 - Rp6.000.' },
          { item: 'Penggaris Set Geometri', price: 18000, paid: 20000, correct: 2000, opts: [1000, 2000, 3000, 4000], exp: 'Rp20.000 - Rp18.000 = Rp2.000', hint: 'Selisih Rp20.000 dan Rp18.000.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 08: TIME MASTER
      case 'time_master': {
        const pool = [
          { hour: 7, minute: 30, text: '07.30', label: 'Pukul 07.30 (Setengah Delapan)', opts: ['07.30', '08.30', '06.30', '07.15'], exp: 'Jarum pendek antara 7 dan 8, jarum panjang di angka 6 = 07.30.', hint: 'Jarum panjang di angka 6 artinya lewat 30 menit.' },
          { hour: 3, minute: 0, text: '03.00', label: 'Pukul 03.00 Tepat', opts: ['03.00', '12.15', '03.30', '04.00'], exp: 'Jarum pendek di angka 3, jarum panjang tepat di 12 = 03.00.', hint: 'Jarum panjang menunjuk angka 12.' },
          { hour: 9, minute: 15, text: '09.15', label: 'Pukul 09.15 (Lewat Seperempat)', opts: ['09.15', '09.30', '03.45', '09.45'], exp: 'Jarum panjang di angka 3 artinya lewat 15 menit.', hint: 'Setiap angka pada jam bernilai 5 menit (3 × 5 = 15).' },
          { hour: 10, minute: 45, text: '10.45', label: 'Pukul 10.45 (Pukul 11 Kurang 15)', opts: ['10.45', '11.45', '09.45', '10.15'], exp: 'Jarum panjang di angka 9 artinya menit ke-45.', hint: 'Angka 9 bernilai 45 menit.' },
          { hour: 12, minute: 30, text: '12.30', label: 'Pukul 12.30 (Setengah Satu)', opts: ['12.30', '01.30', '12.00', '06.00'], exp: 'Jarum pendek antara 12 dan 1, jarum panjang di 6 = 12.30.', hint: 'Setengah jam setelah pukul dua belas.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 09: PATTERN MASTER
      case 'pattern_master': {
        const pool = [
          { seq: '2 → 4 → 6 → 8 → ?', correct: '10', opts: ['9', '10', '11', '12'], exp: 'Pola loncat bertambah +2 setiap langkah. 8 + 2 = 10.', hint: 'Cari selisih antara 4 dan 2.' },
          { seq: '5 → 10 → 15 → 20 → ?', correct: '25', opts: ['22', '24', '25', '30'], exp: 'Pola kelipatan 5 (bertambah +5). 20 + 5 = 25.', hint: 'Hitung kelipatan 5 berikutnya.' },
          { seq: '3 → 6 → 12 → 24 → ?', correct: '48', opts: ['36', '42', '48', '50'], exp: 'Pola dikali 2 (×2) pada setiap langkah. 24 × 2 = 48.', hint: 'Tiap angka dilipatgandakan (dikali 2).' },
          { seq: '100 → 90 → 80 → 70 → ?', correct: '60', opts: ['50', '60', '65', '75'], exp: 'Pola berkurang 10 (-10). 70 - 10 = 60.', hint: 'Hitung mundur kelipatan 10.' },
          { seq: '1 → 4 → 9 → 16 → ?', correct: '25', opts: ['20', '24', '25', '36'], exp: 'Pola bilangan kuadrat: 1², 2², 3², 4², maka 5² = 25.', hint: 'Perhatikan: 1×1, 2×2, 3×3, 4×4...' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 10: SHAPE BUILDER
      case 'shape_builder': {
        const pool = [
          { q: 'Bangun datar mana yang memiliki TEPAT 4 SISI sama panjang dan 4 sudut siku-siku?', correct: 'Persegi', opts: ['Persegi', 'Segitiga', 'Lingkaran', 'Trapesium'], exp: 'Persegi memiliki 4 sisi sama panjang dan 4 sudut 90°.', hint: 'Bentuk seperti ubin lantai keramik.' },
          { q: 'Bangun datar mana yang TIDAK MEMILIKI SUDUT dan bersimetri tak terhingga?', correct: 'Lingkaran', opts: ['Lingkaran', 'Persegi', 'Segi Enam', 'Bintang'], exp: 'Lingkaran dibentuk dari satu garis lengkung tertutup tanpa titik sudut.', hint: 'Bentuk seperti roda sepeda.' },
          { q: 'Berapa jumlah titik sudut pada bangun SEGITIGA?', correct: '3 Sudut', opts: ['2 Sudut', '3 Sudut', '4 Sudut', '5 Sudut'], exp: 'Segitiga selalu memiliki 3 sisi dan 3 titik sudut.', hint: 'Sesuai namanya: segi-tiga.' },
          { q: 'Bangun datar dengan 2 pasang sisi sejajar dan 4 sudut siku-siku adalah:', correct: 'Persegi Panjang', opts: ['Persegi Panjang', 'Segitiga Sama Sisi', 'Belah Ketupat', 'Layang-Layang'], exp: 'Persegi panjang memiliki sisi berhadapan sejajar dan sudut siku-siku.', hint: 'Bentuk seperti layar buku atau papan tulis.' },
          { q: 'Berapa jumlah sisi pada bangun SEGI ENAM (Heksagon)?', correct: '6 Sisi', opts: ['5 Sisi', '6 Sisi', '7 Sisi', '8 Sisi'], exp: 'Segi enam (heksagon) memiliki 6 sisi lurus.', hint: 'Heksagon = 6 sisi.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 11: AREA BUILDER (Arsitek Luas Persegi)
      case 'area_builder': {
        const pool = [
          {
            targetArea: 6,
            gridRows: 4,
            gridCols: 4,
            prompt: 'Arsitek Cilik: Bangun lantai dengan Luas TEPAT 6 petak satuan!',
            exp: 'Kamu mewarnai tepat 6 petak satuan. Luas bangun = 6 satuan persegi!',
            hint: 'Sentuh 6 buah kotak mana saja pada denah lantai.',
          },
          {
            targetArea: 8,
            gridRows: 4,
            gridCols: 4,
            prompt: 'Arsitek Cilik: Buat denah ruangan dengan Luas 8 petak satuan!',
            exp: 'Tepat 8 petak! Luas = 8 satuan persegi.',
            hint: 'Sentuh 8 kotak (misal 2 baris penuh atau bentuk L/persegi panjang).',
          },
          {
            targetArea: 9,
            gridRows: 4,
            gridCols: 4,
            prompt: 'Arsitek Cilik: Buat taman persegi dengan Luas 9 petak (3 × 3)!',
            exp: 'Sempurna! 9 petak terpasang (3 baris × 3 kolom = 9 petak).',
            hint: 'Isi 9 petak satuan.',
          },
          {
            targetArea: 10,
            gridRows: 4,
            gridCols: 4,
            prompt: 'Arsitek Cilik: Pasang keramik aula dengan Luas 10 petak satuan!',
            exp: '10 petak terpasang rapi! Luas = 10 petak.',
            hint: 'Sentuh 10 petak kotak pada kisi lantai.',
          },
          {
            targetArea: 12,
            gridRows: 4,
            gridCols: 4,
            prompt: 'Arsitek Cilik: Bangun kolam renang dengan Luas 12 petak satuan!',
            exp: 'Hebat! 12 petak berhasil dibangun (hanya menyisakan 4 petak kosong).',
            hint: '16 petak total dikurangi 4 petak kosong = 12 petak.',
          },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 12: MATH SORT (GENAP / GANJIL)
      case 'math_sort': {
        const pool = [
          { num: 14, isEven: true, exp: '14 berakhiran 4, jadi bilangan GENAP.', hint: 'Angka terakhir 4 dapat dibagi 2.' },
          { num: 27, isEven: false, exp: '27 berakhiran 7, jadi bilangan GANJIL.', hint: 'Angka 7 menyisakan 1 jika dibagi 2.' },
          { num: 42, isEven: true, exp: '42 adalah bilangan GENAP.', hint: 'Habis dibagi 2.' },
          { num: 39, isEven: false, exp: '39 adalah bilangan GANJIL.', hint: 'Angka 9 adalah ganjil.' },
          { num: 80, isEven: true, exp: '80 berakhiran 0, merupakan bilangan GENAP.', hint: 'Kelipatan 10 selalu genap.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 13: GREATER OR LESS (<, =, >)
      case 'greater_or_less': {
        const pool = [
          { left: '47', right: '52', correct: '<', exp: '47 lebih kecil dari 52 (47 < 52).', hint: 'Bandingkan angka puluhan 4 vs 5.' },
          { left: '6 × 5', right: '30', correct: '=', exp: '6 × 5 = 30, sehingga 30 = 30.', hint: 'Hitung nilai 6 dikali 5.' },
          { left: '85 - 15', right: '65', correct: '>', exp: '85 - 15 = 70, dan 70 > 65.', hint: '85 - 15 = 70.' },
          { left: '100 ÷ 4', right: '25', correct: '=', exp: '100 ÷ 4 = 25, maka kedua sisi sama (25 = 25).', hint: '100 dibagi 4 adalah 25.' },
          { left: '3/4', right: '1/2', correct: '>', exp: '3/4 (75%) lebih besar dari 1/2 (50%).', hint: 'Bayangkan 3 potong pizza vs 2 potong pizza.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 14: MATH RACE
      case 'math_race': {
        const pool = [
          { q: '7 × 6 = ?', a: '42', opts: ['36', '42', '48', '40'], exp: '7 × 6 = 42. Pacu larimu!', hint: 'Tujuh dikalikan enam.' },
          { q: '48 ÷ 6 = ?', a: '8', opts: ['6', '7', '8', '9'], exp: '48 ÷ 6 = 8. Kecepatan bertambah!', hint: '6 × berapa yang hasilnya 48?' },
          { q: '15 + 29 = ?', a: '44', opts: ['34', '44', '45', '54'], exp: '15 + 29 = 44. Kamu semakin di depan!', hint: '15 + 30 - 1 = 44.' },
          { q: '9 × 4 = ?', a: '36', opts: ['32', '36', '38', '45'], exp: '9 × 4 = 36. Sedikit lagi garis finish!', hint: 'Sembilan dikali empat.' },
          { q: '80 - 35 = ?', a: '45', opts: ['35', '45', '55', '40'], exp: '80 - 35 = 45. FINISH! Kamu pemenangnya!', hint: '80 - 30 = 50, kurangi 5 = 45.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 15: TARGET NUMBER
      case 'target_number': {
        const pool = [
          { target: 24, correctExpr: '6 × 4', opts: ['6 × 4', '5 × 5', '8 + 12', '7 × 3'], exp: '6 × 4 = 24. Target tepat tercapai!', hint: 'Cari perkalian yang menghasilkan 24.' },
          { target: 36, correctExpr: '9 × 4', opts: ['9 × 4', '8 × 4', '6 × 5', '10 × 3'], exp: '9 × 4 = 36.', hint: 'Sembilan dikali empat.' },
          { target: 50, correctExpr: '25 × 2', opts: ['20 × 2', '25 × 2', '15 × 3', '60 - 15'], exp: '25 × 2 = 50.', hint: 'Dua kali dua puluh lima.' },
          { target: 18, correctExpr: '9 + 9', opts: ['9 + 9', '8 + 8', '7 × 3', '20 - 4'], exp: '9 + 9 = 18.', hint: 'Jumlah dari dua angka kembar.' },
          { target: 100, correctExpr: '20 × 5', opts: ['25 × 3', '20 × 5', '50 + 40', '15 × 6'], exp: '20 × 5 = 100.', hint: 'Dua puluh dikalikan lima.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 16: MATH DETECTIVE
      case 'math_detective': {
        const pool = [
          { clue: 'Kunci brankas adalah KELIPATAN 6 dan LEBIH DARI 15', boxes: [{ id: 'A', val: '12' }, { id: 'B', val: '18' }, { id: 'C', val: '25' }], correct: 'B', exp: 'Kotak B (18) adalah kelipatan 6 (6 × 3 = 18) dan nilainya > 15.', hint: 'Cari angka yang ada di tabel perkalian 6.' },
          { clue: 'Kotak misteri berisi bilangan GANJIL yang HABIS DIBAGI 3', boxes: [{ id: 'A', val: '14' }, { id: 'B', val: '21' }, { id: 'C', val: '24' }], correct: 'B', exp: 'Kotak B (21) adalah bilangan ganjil dan 21 ÷ 3 = 7.', hint: '24 adalah genap, 14 tidak habis dibagi 3.' },
          { clue: 'Kunci kode adalah BILANGAN PRIMA antara 10 dan 15', boxes: [{ id: 'A', val: '11' }, { id: 'B', val: '12' }, { id: 'C', val: '14' }], correct: 'A', exp: 'Kotak A (11) adalah bilangan prima (hanya bisa dibagi 1 dan 11).', hint: '12 dan 14 adalah bilangan genap.' },
          { clue: 'Kotak rahasia memiliki hasil kali angka sama dengan 36', boxes: [{ id: 'A', val: '4 × 8' }, { id: 'B', val: '6 × 6' }, { id: 'C', val: '5 × 7' }], correct: 'B', exp: 'Kotak B (6 × 6 = 36) membuka brankas!', hint: 'Enam dikalikan enam.' },
          { clue: 'Kotak dengan nilai TERBESAR setelah dikurangkan 15', boxes: [{ id: 'A', val: '50 - 15' }, { id: 'B', val: '60 - 15' }, { id: 'C', val: '45 - 15' }], correct: 'B', exp: 'Kotak B (60 - 15 = 45) adalah yang terbesar!', hint: '60 adalah nilai awal tertinggi.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 17: BALANCE MATH (Neraca Timbangan)
      case 'balance_math': {
        const pool = [
          { leftDesc: '🍎🍎🍎 (3 Apel)', rightDesc: 'Bandul 6 kg', question: 'Berapa berat 1 buah apel?', correct: '2 kg', opts: ['1 kg', '2 kg', '3 kg', '4 kg'], exp: '3 apel = 6 kg, maka 1 apel = 6 ÷ 3 = 2 kg.', hint: 'Bagi 6 kg dengan 3 apel.' },
          { leftDesc: '⭐ + 5', rightDesc: 'Bandul 12', question: 'Berapakah nilai bintang ⭐?', correct: '7', opts: ['5', '6', '7', '8'], exp: '⭐ + 5 = 12, maka ⭐ = 12 - 5 = 7.', hint: 'Kurangkan 12 dengan 5.' },
          { leftDesc: '📦📦 (2 Kotak)', rightDesc: 'Bandul 18 kg', question: 'Berapa berat 1 kotak 📦?', correct: '9 kg', opts: ['7 kg', '8 kg', '9 kg', '10 kg'], exp: '2 kotak = 18 kg, maka 1 kotak = 18 ÷ 2 = 9 kg.', hint: '18 dibagi 2.' },
          { leftDesc: '🔺 + 10', rightDesc: 'Bandul 25', question: 'Berapakah nilai segitiga 🔺?', correct: '15', opts: ['10', '12', '15', '20'], exp: '🔺 + 10 = 25, maka 🔺 = 25 - 10 = 15.', hint: '25 dikurangi 10.' },
          { leftDesc: '🍋🍋🍋🍋 (4 Lemon)', rightDesc: 'Bandul 20 gram', question: 'Berapa berat 1 buah lemon 🍋?', correct: '5 gram', opts: ['4 gram', '5 gram', '6 gram', '8 gram'], exp: '4 lemon = 20 gram, maka 1 lemon = 20 ÷ 4 = 5 gram.', hint: '20 dibagi 4.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 18: QUICK TAP (Refleks Tap)
      case 'quick_tap': {
        const pool = [
          { prompt: 'Tap hasil dari 3 × 4 = 12!', target: '12', bubbles: ['7', '12', '9', '15', '16', '8'], exp: '3 × 4 = 12! Refleks luar biasa!', hint: 'Cari angka 12 di antara tombol.' },
          { prompt: 'Tap hasil dari 7 + 8 = 15!', target: '15', bubbles: ['13', '14', '15', '16', '17', '18'], exp: '7 + 8 = 15!', hint: 'Cari angka 15.' },
          { prompt: 'Tap hasil dari 5 × 5 = 25!', target: '25', bubbles: ['20', '25', '30', '35', '15', '10'], exp: '5 × 5 = 25!', hint: 'Cari angka 25.' },
          { prompt: 'Tap hasil dari 63 ÷ 7 = 9!', target: '9', bubbles: ['6', '7', '8', '9', '10', '11'], exp: '63 ÷ 7 = 9!', hint: 'Cari angka 9.' },
          { prompt: 'Tap hasil dari 100 - 45 = 55!', target: '55', bubbles: ['45', '50', '55', '60', '65', '70'], exp: '100 - 45 = 55!', hint: 'Cari angka 55.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 19: TRUE OR FALSE
      case 'true_or_false': {
        const pool = [
          { statement: '8 × 7 = 56', isTrue: true, exp: 'BENAR. 8 × 7 memang menghasilkan 56.', hint: 'Cek tabel perkalian 8.' },
          { statement: '3/4 lebih kecil dari 1/2 (3/4 < 1/2)', isTrue: false, exp: 'SALAH. 3/4 (0,75) justru lebih besar dari 1/2 (0,5).', hint: '3 dari 4 bagian lebih banyak daripada 1 dari 2 bagian.' },
          { statement: 'Persegi memiliki 3 titik sudut', isTrue: false, exp: 'SALAH. Persegi memiliki 4 titik sudut, sedangkan bangun bersudut 3 adalah Segitiga.', hint: 'Persegi memiliki 4 sisi dan 4 sudut.' },
          { statement: '1 jam = 60 menit', isTrue: true, exp: 'BENAR. Tepat 1 putaran jarum panjang jam adalah 60 menit.', hint: '60 detik = 1 menit, 60 menit = 1 jam.' },
          { statement: 'Bilangan 25 adalah bilangan genap', isTrue: false, exp: 'SALAH. 25 berakhiran angka 5 sehingga merupakan bilangan ganjil.', hint: 'Bilangan genap berakhiran 0, 2, 4, 6, atau 8.' },
        ];
        return pool[(round - 1) % pool.length];
      }

      // GAME 20: WORD PROBLEM ADVENTURE
      case 'word_problem_adventure': {
        const pool = [
          {
            story: 'Raka memiliki 12 buah apel di keranjang. Ia membagikan 5 apel kepada temannya.',
            question: 'Berapa buah apel yang tersisa pada keranjang Raka?',
            totalApples: 12,
            correct: '7',
            opts: ['6', '7', '8', '9'],
            exp: '12 apel - 5 apel = 7 apel tersisa.',
            hint: 'Kurangkan total 12 apel dengan 5 yang sudah dibagikan.',
          },
          {
            story: 'Siti membeli 3 bungkus permen. Setiap bungkus berisi 6 butir permen manis.',
            question: 'Berapa total seluruh butir permen yang dimiliki Siti?',
            totalApples: 6,
            correct: '18',
            opts: ['15', '16', '18', '20'],
            exp: '3 bungkus × 6 butir = 18 butir permen.',
            hint: 'Gunakan perkalian: 3 dikalikan 6.',
          },
          {
            story: 'Ada 20 burung merpati di dahan pohon. Tiba-tiba 8 burung terbang ke angkasa.',
            question: 'Berapa banyak burung merpati yang masih hinggap di dahan?',
            totalApples: 10,
            correct: '12',
            opts: ['10', '12', '14', '16'],
            exp: '20 burung - 8 burung = 12 burung.',
            hint: '20 dikurangi 8.',
          },
          {
            story: 'Budi memiliki tabungan Rp15.000. Ibu memberinya uang saku tambahan Rp10.000.',
            question: 'Berapa jumlah total uang tabungan Budi sekarang?',
            totalApples: 5,
            correct: 'Rp25.000',
            opts: ['Rp20.000', 'Rp25.000', 'Rp30.000', 'Rp35.000'],
            exp: 'Rp15.000 + Rp10.000 = Rp25.000.',
            hint: 'Jumlahkan kedua nominal uang.',
          },
          {
            story: 'Sebuah kotak kue berisi 24 potong kue bolu. Dibagikan sama rata kepada 4 anak.',
            question: 'Berapa potong kue bolu yang diterima oleh masing-masing anak?',
            totalApples: 8,
            correct: '6',
            opts: ['5', '6', '7', '8'],
            exp: '24 potong ÷ 4 anak = 6 potong kue per anak.',
            hint: 'Gunakan pembagian: 24 dibagi 4.',
          },
        ];
        return pool[(round - 1) % pool.length];
      }

      // DEFAULT FALLBACK (arithmetic quick math)
      default: {
        const pool = [
          { q: '15 + 17 = ?', a: '32', opts: ['30', '32', '34', '36'], exp: '15 + 17 = 32', hint: '15 + 15 + 2 = 32' },
          { q: '6 × 7 = ?', a: '42', opts: ['36', '42', '48', '40'], exp: '6 × 7 = 42', hint: '6 × 7 = 42' },
          { q: '50 - 18 = ?', a: '32', opts: ['30', '32', '34', '36'], exp: '50 - 18 = 32', hint: '50 - 20 + 2 = 32' },
          { q: '8 × 4 = ?', a: '32', opts: ['28', '30', '32', '36'], exp: '8 × 4 = 32', hint: '8 × 4 = 32' },
          { q: '100 ÷ 5 = ?', a: '20', opts: ['15', '20', '25', '30'], exp: '100 ÷ 5 = 20', hint: '100 dibagi 5 adalah 20' },
        ];
        return pool[(round - 1) % pool.length];
      }
    }
  };

  const currentContent: any = getRoundContent();

  // ----------------------------------------------------------------------
  // VIEW: 1. INTRO / DETAIL SCREEN
  // ----------------------------------------------------------------------
  if (gameState === 'intro') {
    const difficultyMap = {
      easy: { label: 'Mudah', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      medium: { label: 'Sedang', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      challenge: { label: 'Tantangan', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    };

    return (
      <div className="max-w-2xl mx-auto py-6 px-4 animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Top Bar inside Intro */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                sound.playClick();
                onExit();
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Game Center</span>
            </button>
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                difficultyMap[game.difficulty].color
              }`}
            >
              {difficultyMap[game.difficulty].label}
            </span>
          </div>

          {/* Game Title & Big Icon */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-amber-50 text-5xl flex items-center justify-center border-2 border-amber-200 shadow-inner">
              {game.icon}
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                GAME {game.gameNumber < 10 ? `0${game.gameNumber}` : game.gameNumber} • {game.categoryLabel}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                {game.title}
              </h1>
              <p className="text-sm font-bold text-amber-700 mt-1">"{game.subtitle}"</p>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2">
                {game.description}
              </p>
            </div>
          </div>

          {/* Learning Objectives & Rewards Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Tujuan Belajar</span>
              <span className="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5">
                {game.learningObjective}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="text-[11px] font-semibold text-amber-700 block">Reward Penyelesaian</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-black text-amber-800 flex items-center gap-1">
                  ⭐ +{game.xpReward} XP
                </span>
                <span className="text-xs font-black text-amber-800 flex items-center gap-1">
                  🪙 +{game.coinReward} Koin
                </span>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                PILIH MODE PERMAINAN:
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Pilih sesuai gaya belajarmu
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setGameMode('relaxed')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  gameMode === 'relaxed'
                    ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Coffee className="w-4 h-4" />
                <span className="text-[11px] font-black">Mode Santai</span>
                <span className="text-[9px] opacity-80">Tanpa Batas Waktu</span>
              </button>
              <button
                type="button"
                onClick={() => setGameMode('adventure')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  gameMode === 'adventure'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span className="text-[11px] font-black">Petualangan</span>
                <span className="text-[9px] opacity-80">5 Babak Berimbang</span>
              </button>
              <button
                type="button"
                onClick={() => setGameMode('time_attack')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  gameMode === 'time_attack'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Timer className="w-4 h-4" />
                <span className="text-[11px] font-black">Time Attack</span>
                <span className="text-[9px] opacity-80">12 Soal Cepat</span>
              </button>
              <button
                type="button"
                onClick={() => setGameMode('boss_battle')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  gameMode === 'boss_battle'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Swords className="w-4 h-4" />
                <span className="text-[11px] font-black">Boss Battle</span>
                <span className="text-[9px] opacity-80">Kalahkan Monster</span>
              </button>
            </div>
          </div>

          {/* Quick Walkthrough & Anti-Confusion Card */}
          <div className="bg-sky-50/80 p-4 rounded-2xl border border-sky-200 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black text-xs">
                💡
              </span>
              <span className="text-xs font-black text-sky-950 uppercase tracking-wider">
                PANDUAN CEPAT (CARA MAIN ANTI BINGUNG):
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-sky-100 space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <span className="font-black text-sky-700 shrink-0">🎯 Langkah Utama:</span>
                <span className="font-semibold text-slate-700">{getGameActionGuidance(game.id)}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-black text-teal-700 shrink-0">🌿 Tips Santai:</span>
                <span className="text-slate-600">Gunakan Mode Santai jika ingin berpikir tenang tanpa hitungan mundur.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-black text-amber-700 shrink-0">⚡ Power-Up:</span>
                <span className="text-slate-600">Tekan ❄️ Beku, ✂️ 50:50, atau 🛡️ Perisai jika menemui soal sulit!</span>
              </div>
            </div>
          </div>

          {/* Rules List */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-left">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              ATURAN PERMAINAN:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              {game.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartGame}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>
              MULAI GAME ({gameMode === 'relaxed' ? 'MODE SANTAI' : gameMode === 'adventure' ? 'PETUALANGAN' : gameMode === 'time_attack' ? 'TIME ATTACK' : 'BOSS BATTLE'})
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW: 2. GAME OVER / COMPLETED REWARD SCREEN
  // ----------------------------------------------------------------------
  if (gameState === 'gameover' || gameState === 'completed') {
    const isWin = gameState === 'completed';
    const stars: 1 | 2 | 3 = score >= 500 ? 3 : score >= 300 ? 2 : 1;

    return (
      <div className="max-w-xl mx-auto py-6 px-4 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-5">
          {/* Header Trophy or Heart Broken */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-5xl shadow-sm">
            {isWin ? '🎉' : '⏱️'}
          </div>

          <div>
            <span
              className={`text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full border ${
                isWin
                  ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                  : 'text-amber-600 bg-amber-50 border-amber-200'
              }`}
            >
              {isWin ? 'GREAT JOB!' : 'GAME OVER!'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {isWin ? 'Misi Berhasil Dituntaskan!' : 'Waktu Habis / Kesempatan Berakhir'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {isWin
                ? 'Kemampuan matematika kamu semakin tajam dan luar biasa!'
                : 'Usaha yang sangat bagus! Ayo coba lagi dan lampaui skormu.'}
            </p>
          </div>

          {/* Stars display */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {[1, 2, 3].map((starIdx) => (
              <div
                key={starIdx}
                className={`text-3xl transition-transform ${
                  starIdx <= (isWin ? stars : 1)
                    ? 'text-amber-400 scale-110 drop-shadow-sm'
                    : 'text-slate-200'
                }`}
              >
                ★
              </div>
            ))}
          </div>

          {/* Score & Rewards Summary */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block">TOTAL SKOR</span>
              <span className="text-lg sm:text-xl font-black text-slate-900">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 block">XP DIPEROLEH</span>
              <span className="text-lg sm:text-xl font-black text-amber-700">
                +{isWin ? game.xpReward : 20} XP
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 block">KOIN BONUS</span>
              <span className="text-lg sm:text-xl font-black text-emerald-700">
                +{isWin ? game.coinReward : 5} 🪙
              </span>
            </div>
          </div>

          {maxCombo > 1 && (
            <div className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 text-xs font-black text-amber-800 flex items-center justify-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-600 fill-current" />
              <span>Kombo Tertinggi: {maxCombo}x COMBO!</span>
            </div>
          )}

          {/* Interactive Review Drawer */}
          {roundHistory.length > 0 && (
            <div className="pt-2 text-left">
              <button
                type="button"
                onClick={() => setShowReview(!showReview)}
                className="w-full py-2.5 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-extrabold text-xs flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Tinjau Pembahasan & Kunci Jawaban ({roundHistory.filter(h => h.isCorrect).length}/{roundHistory.length} Benar)</span>
                </div>
                {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showReview && (
                <div className="mt-2.5 space-y-2 max-h-60 overflow-y-auto pr-1 animate-in fade-in">
                  {roundHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border text-xs ${
                        item.isCorrect
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50/70 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center justify-between font-black mb-1">
                        <span>Babak {item.round}: {item.question}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          item.isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                        }`}>
                          {item.isCorrect ? 'BENAR ✓' : 'SALAH ✕'}
                        </span>
                      </div>
                      {item.explanation && (
                        <p className="text-[11px] text-slate-700 font-medium mt-1 bg-white/70 p-2 rounded-xl border border-slate-200/60">
                          💡 <span className="font-bold">Solusi:</span> {item.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action CTAs: [ MAIN LAGI ] [ GAME BERIKUTNYA ] [ GAME CENTER ] */}
          <div className="space-y-2.5 pt-3">
            <button
              onClick={handleStartGame}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>MAIN LAGI</span>
            </button>

            {onPlayNextGame && (
              <button
                onClick={() => {
                  sound.playClick();
                  onPlayNextGame();
                }}
                className="w-full py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-extrabold text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>GAME BERIKUTNYA</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onExit();
              }}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>KEMBALI KE GAME CENTER</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW: 3. ACTIVE GAMEPLAY
  // ----------------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto py-3 px-3 sm:px-4 space-y-4 animate-in fade-in duration-200">
      {/* 3.1 TOP BAR */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        {/* Left: Back button & Title */}
        <button
          onClick={() => {
            sound.playClick();
            if (timerRef.current) clearInterval(timerRef.current);
            setGameState('intro');
          }}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm cursor-pointer active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline font-extrabold text-slate-800">{game.title}</span>
        </button>

        {/* Center: Hearts & Score & Combo */}
        <div className="flex items-center gap-3">
          {game.hasHearts && (
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((hIdx) => (
                <Heart
                  key={hIdx}
                  className={`w-5 h-5 transition-colors ${
                    hIdx <= hearts
                      ? 'text-rose-500 fill-rose-500 scale-105'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-amber-700 font-black text-xs">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{score}</span>
          </div>

          {combo > 1 && (
            <div className="flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200 text-rose-600 font-black text-xs animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>x{combo}</span>
            </div>
          )}
        </div>

        {/* Right: Sound, Tutorial, Timer & Round */}
        <div className="flex items-center gap-2">
          {/* In-Game Help / Tutorial Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowTutorialModal(true);
            }}
            className="p-1.5 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold shadow-2xs"
            title="Lihat Panduan & Petunjuk Cara Main"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Panduan</span>
          </button>

          {/* BGM Toggle */}
          <button
            onClick={() => {
              const state = sound.toggleBgm();
              setIsBgmOn(state);
            }}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
              isBgmOn ? 'bg-indigo-100 text-indigo-700 font-bold text-[10px]' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
            }`}
            title={isBgmOn ? 'Musik Latar Aktif' : 'Nyalakan Musik Latar'}
          >
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline text-[10px]">{isBgmOn ? 'BGM ON' : 'BGM'}</span>
          </button>

          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              sound.setSoundEnabled(!next);
            }}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {game.hasTimer && gameMode !== 'relaxed' && (
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border font-black text-xs ${
                timeLeft <= 3
                  ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s</span>
            </div>
          )}

          {gameMode === 'relaxed' && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 font-bold text-[10px]" title="Mode santai: tanpa batas waktu">
              <Coffee className="w-3 h-3" />
              <span className="hidden sm:inline">Santai</span>
            </div>
          )}

          <span className="text-xs font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
            {round}/{totalRounds}
          </span>
        </div>
      </div>

      {/* Boss Battle Bar if Boss Mode */}
      {gameMode === 'boss_battle' && (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white p-3.5 rounded-3xl border border-rose-800 shadow-md space-y-1.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="flex items-center gap-1.5 text-rose-300">
              <Swords className="w-4 h-4 text-rose-400" />
              <span>RAJA MONSTER MATEMATIKA</span>
            </span>
            <span className="font-mono text-rose-200">{bossHp} / {bossMaxHp} HP</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-rose-700">
            <div
              className="bg-gradient-to-r from-amber-400 via-rose-500 to-red-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Power-Up HUD Bar */}
      <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-2 px-3 border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Bantuan:</span>
        </span>
        <div className="flex items-center gap-2">
          {/* Freeze Power-up */}
          <button
            type="button"
            onClick={handleUseFreeze}
            disabled={!freezeAvailable || freezeActive}
            className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
              freezeActive
                ? 'bg-sky-500 text-white animate-pulse'
                : freezeAvailable
                ? 'bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
            }`}
            title="Bekukan waktu selama 5 detik"
          >
            <Snowflake className="w-3.5 h-3.5" />
            <span>Beku</span>
          </button>

          {/* 50:50 Eliminator */}
          <button
            type="button"
            onClick={() => {
              if (currentContent?.opts && currentContent?.a) {
                handleUseEliminate(currentContent.opts, currentContent.a);
              } else if (currentContent?.bubbles && currentContent?.correct) {
                handleUseEliminate(currentContent.bubbles, currentContent.correct);
              }
            }}
            disabled={!eliminateAvailable}
            className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
              eliminateAvailable
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
            }`}
            title="Hapus 2 pilihan jawaban salah"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>50:50</span>
          </button>

          {/* Divine Shield */}
          <button
            type="button"
            onClick={handleUseShield}
            disabled={!shieldAvailable || shieldActive}
            className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
              shieldActive
                ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300'
                : shieldAvailable
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
            }`}
            title="Perisai: Tahan 1 kesalahan tanpa kehilangan nyawa"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{shieldActive ? 'Perisai Aktif' : 'Perisai'}</span>
          </button>
        </div>
      </div>

      {/* 3.2 MAIN QUESTION & PLAY INTERFACE */}
      <div
        className={`bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden transition-all duration-300 min-h-[360px] flex flex-col justify-between ${
          isShaking ? 'animate-game-shake ring-4 ring-rose-400' : ''
        } ${combo >= 3 ? 'ring-2 ring-amber-300 shadow-lg shadow-amber-100' : ''}`}
      >
        {/* Floating score tag */}
        {floatingScore && (
          <div
            key={floatingScore.id}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 text-white font-black text-sm sm:text-base shadow-xl animate-float-score"
          >
            {floatingScore.text}
          </div>
        )}

        {/* Read-Aloud Voice Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => {
              let textToSpeak = '';
              if (currentContent?.q) textToSpeak = currentContent.q;
              else if (currentContent?.prompt) textToSpeak = currentContent.prompt;
              else if (currentContent?.seq) textToSpeak = `Lengkapi pola berikut: ${currentContent.seq}`;
              else textToSpeak = `${game.title}. Ronde ${round} dari ${totalRounds}.`;
              sound.speak(textToSpeak);
            }}
            className="p-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
            title="Dengarkan Soal / Narasi Suara"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Suara</span>
          </button>
        </div>

        {/* Render specific game mechanic content */}
        <div>
          {/* Step-by-Step Action Guidance Banner */}
          <div className="bg-sky-50/90 border border-sky-200 text-sky-950 rounded-2xl px-3.5 py-2 text-xs font-bold flex items-center justify-between gap-2 shadow-2xs mb-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-sky-600 text-white flex items-center justify-center font-black text-[10px] shrink-0">
                🎯
              </span>
              <span className="text-left leading-tight">{getGameActionGuidance(game.id)}</span>
            </div>
            {gameMode === 'relaxed' && (
              <span className="shrink-0 text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-black">
                🌿 Mode Santai
              </span>
            )}
          </div>
          {/* QUICK MATH (Game 01) */}
          {game.id === 'quick_math' && (
            <div className="text-center space-y-4 py-4">
              <span className="text-xs font-black tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                SOAL HITUNG CEPAT
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {currentContent.q}
              </h2>
            </div>
          )}

          {/* NUMBER CATCH (Game 02) */}
          {game.id === 'number_catch' && (
            <div className="text-center space-y-4 py-2">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs font-black text-amber-900">
                🎯 {currentContent.prompt}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 py-6">
                {currentContent.bubbles.map((numStr: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(numStr === currentContent.correct, currentContent.exp)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-white to-slate-50 border-2 border-slate-300 hover:border-emerald-500 hover:scale-105 text-2xl font-black text-slate-800 shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                  >
                    {numStr}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* NUMBER BOND (Game 03) */}
          {game.id === 'number_bond' && (
            <div className="text-center space-y-4 py-2">
              <span className="text-xs font-black text-slate-500 uppercase">
                LENGKAPI IKATAN ANGKA (NUMBER BOND)
              </span>
              {/* Visual Bond Nodes */}
              <div className="flex flex-col items-center justify-center my-2">
                {/* Top Node */}
                <div className="w-18 h-18 rounded-full bg-emerald-500 text-white font-black text-2xl flex items-center justify-center shadow-md border-4 border-emerald-300">
                  {currentContent.total}
                </div>
                {/* Connecting Lines */}
                <div className="w-32 h-6 flex justify-between px-6 border-b-2 border-slate-300 relative">
                  <div className="w-0.5 h-6 bg-slate-300 absolute left-10" />
                  <div className="w-0.5 h-6 bg-slate-300 absolute right-10" />
                </div>
                {/* Child Nodes */}
                <div className="flex items-center gap-8 mt-2">
                  <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-800 font-black text-xl flex items-center justify-center border-2 border-slate-300">
                    {currentContent.part1}
                  </div>
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center border-2 border-dashed border-amber-400">
                    ?
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MATH MATCH (Game 04) */}
          {game.id === 'math_match' && currentContent?.pairs && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  🃏 COCOKKAN SOAL & HASILNYA
                </span>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Pilih 1 operasi di kiri, lalu pilih jawabannya di kanan ({matchedPairs.length}/{currentContent.pairs.length} Cocok)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {/* Left Column: Equations */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block text-center">
                    Operasi Hitung
                  </span>
                  {currentContent.pairs.map((p: any) => {
                    const isMatched = matchedPairs.includes(p.id);
                    const isSelected = matchSelectedLeft === p.id;
                    return (
                      <button
                        key={p.id}
                        disabled={isMatched}
                        onClick={() => handleMatchClickLeft(p.id, currentContent.pairs.length, currentContent.exp)}
                        className={`w-full py-3.5 px-3 rounded-2xl border-2 font-black text-base transition-all active:scale-95 flex items-center justify-between shadow-xs ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 cursor-not-allowed opacity-80'
                            : isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-200 scale-102 cursor-pointer'
                            : 'bg-white hover:bg-indigo-50/70 border-slate-200 text-slate-800 hover:border-indigo-300 cursor-pointer'
                        }`}
                      >
                        <span className="ml-1">{p.left}</span>
                        {isMatched ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isSelected ? (
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md">Dipilih</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column: Answers (pre-shuffled by rightOrder) */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block text-center">
                    Hasil Nilai
                  </span>
                  {currentContent.rightOrder.map((pairId: number) => {
                    const p = currentContent.pairs.find((x: any) => x.id === pairId);
                    if (!p) return null;
                    const isMatched = matchedPairs.includes(p.id);
                    const isSelected = matchSelectedRight === p.id;
                    return (
                      <button
                        key={p.id}
                        disabled={isMatched}
                        onClick={() => handleMatchClickRight(p.id, currentContent.pairs.length, currentContent.exp)}
                        className={`w-full py-3.5 px-3 rounded-2xl border-2 font-black text-base transition-all active:scale-95 flex items-center justify-between shadow-xs ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 cursor-not-allowed opacity-80'
                            : isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-200 scale-102 cursor-pointer'
                            : 'bg-white hover:bg-indigo-50/70 border-slate-200 text-slate-800 hover:border-indigo-300 cursor-pointer'
                        }`}
                      >
                        <span className="ml-1">{p.right}</span>
                        {isMatched ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isSelected ? (
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md">Dipilih</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MATH MEMORY (Game 05) */}
          {game.id === 'math_memory' && currentContent?.cards && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <span className="text-xs font-black text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
                  🧠 DAYA INGAT MATEMATIKA
                </span>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Buka 2 kartu yang nilainya sama ({memoryMatched.length / 2} dari {currentContent.cards.length / 2} Pasang Terbuka)
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                {currentContent.cards.map((c: any, cIdx: number) => {
                  const isFlipped = memoryFlipped.includes(cIdx);
                  const isMatched = memoryMatched.includes(c.id);
                  const isRevealed = isFlipped || isMatched;

                  return (
                    <button
                      key={c.id}
                      disabled={isRevealed}
                      onClick={() => handleMemoryCardClick(cIdx, c, currentContent.cards, currentContent.exp)}
                      className={`h-20 sm:h-24 rounded-2xl border-2 font-black transition-all flex items-center justify-center text-center p-2 shadow-xs cursor-pointer active:scale-95 ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 text-lg shadow-sm cursor-default'
                          : isFlipped
                          ? 'bg-violet-600 border-violet-700 text-white text-lg ring-4 ring-violet-200'
                          : 'bg-gradient-to-br from-indigo-50 to-purple-50 hover:bg-indigo-100 border-indigo-200 text-indigo-400 text-2xl'
                      }`}
                    >
                      {isRevealed ? (
                        <span className="animate-in zoom-in-75 font-black">{c.label}</span>
                      ) : (
                        <span>✨</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* FRACTION PIZZA (Game 06) */}
          {game.id === 'fraction_pizza' && (
            <div className="text-center space-y-3 py-2">
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                🍕 {currentContent.prompt}
              </span>
              {/* Interactive Pizza Visual */}
              <div className="my-3">
                <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full bg-amber-100 border-4 border-amber-400 relative overflow-hidden shadow-inner p-1">
                  <div
                    className="grid h-full w-full rounded-full overflow-hidden"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(currentContent.den, 4)}, 1fr)`,
                    }}
                  >
                    {Array.from({ length: currentContent.den }).map((_, sIdx) => {
                      const isSelected = pizzaSelectedSlices.includes(sIdx);
                      return (
                        <button
                          key={sIdx}
                          onClick={() => {
                            sound.playClick();
                            setPizzaSelectedSlices((prev) =>
                              prev.includes(sIdx) ? prev.filter((x) => x !== sIdx) : [...prev, sIdx]
                            );
                          }}
                          className={`border border-amber-300 transition-colors flex items-center justify-center text-xl cursor-pointer ${
                            isSelected ? 'bg-amber-400 text-amber-950 font-black' : 'bg-amber-50 hover:bg-amber-200'
                          }`}
                        >
                          {isSelected ? '🍕' : '○'}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Terpilih: {pizzaSelectedSlices.length} dari {currentContent.den} bagian
                </p>
                <button
                  onClick={() =>
                    handleAnswer(
                      pizzaSelectedSlices.length === currentContent.num,
                      `${currentContent.num} dari ${currentContent.den} bagian = ${currentContent.fractionStr}`
                    )
                  }
                  className="mt-3 px-6 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md active:scale-95 cursor-pointer"
                >
                  KIRIM SAJIAN PIZZA
                </button>
              </div>
            </div>
          )}

          {/* MONEY MASTER (Game 07) */}
          {game.id === 'money_master' && (
            <div className="text-center space-y-4 py-2">
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-left space-y-2">
                <span className="text-xs font-black text-amber-800 uppercase block">KASIR WARUNG PINTAR</span>
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>Barang: {currentContent.item}</span>
                  <span className="text-emerald-700">Rp{currentContent.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-800 border-t border-amber-200 pt-2">
                  <span>Uang Diterima:</span>
                  <span className="text-sky-700">Rp{currentContent.paid.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Berapa uang kembalian yang harus diberikan?
              </h3>
            </div>
          )}

          {/* TIME MASTER (Game 08) */}
          {game.id === 'time_master' && (
            <div className="text-center space-y-4 py-2">
              <span className="text-xs font-black text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                ⏰ BACA JAM ANALOG
              </span>
              {/* SVG Analog Clock */}
              <div className="w-36 h-36 mx-auto relative rounded-full bg-slate-50 border-4 border-slate-700 shadow-inner flex items-center justify-center">
                {/* 12, 3, 6, 9 markers */}
                <span className="absolute top-1 text-xs font-black text-slate-700">12</span>
                <span className="absolute right-2 text-xs font-black text-slate-700">3</span>
                <span className="absolute bottom-1 text-xs font-black text-slate-700">6</span>
                <span className="absolute left-2 text-xs font-black text-slate-700">9</span>
                {/* Center dot */}
                <div className="w-3 h-3 rounded-full bg-slate-800 z-10" />
                {/* Hour Hand */}
                <div
                  className="w-1.5 h-10 bg-slate-800 absolute top-8 rounded-full origin-bottom"
                  style={{
                    transform: `rotate(${(currentContent.hour % 12) * 30 + currentContent.minute * 0.5}deg)`,
                    transformOrigin: '50% 100%',
                  }}
                />
                {/* Minute Hand */}
                <div
                  className="w-1 h-14 bg-rose-500 absolute top-4 rounded-full origin-bottom"
                  style={{
                    transform: `rotate(${currentContent.minute * 6}deg)`,
                    transformOrigin: '50% 100%',
                  }}
                />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Pukul berapakah yang ditunjukkan jam di atas?
              </h3>
            </div>
          )}

          {/* PATTERN MASTER (Game 09) */}
          {game.id === 'pattern_master' && (
            <div className="text-center space-y-4 py-4">
              <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                🔮 TEMUKAN POLA BERIKUT
              </span>
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200">
                <span className="text-2xl sm:text-4xl font-black text-purple-900 tracking-wider">
                  {currentContent.seq}
                </span>
              </div>
            </div>
          )}

          {/* SHAPE BUILDER (Game 10) */}
          {game.id === 'shape_builder' && (
            <div className="text-center space-y-4 py-4">
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                📐 CIRI & SIFAT BANGUN DATAR
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {currentContent.q}
              </h3>
            </div>
          )}

          {/* AREA BUILDER (Game 11) */}
          {game.id === 'area_builder' && currentContent && (
            <div className="text-center space-y-4 py-2">
              <span className="text-xs font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                🧱 ARSITEK DENAH & LUAS PERSEGI
              </span>
              <p className="text-sm font-black text-slate-800">
                {currentContent.prompt}
              </p>

              {/* Progress Chip */}
              <div className="flex items-center justify-center gap-2">
                <div className="bg-slate-100 px-3 py-1 rounded-xl text-xs font-bold text-slate-700 border border-slate-200">
                  Petak Terpasang: <span className={`font-black text-sm ${areaFilledTiles.length === currentContent.targetArea ? 'text-emerald-600' : 'text-slate-900'}`}>{areaFilledTiles.length}</span> / <span className="font-black">{currentContent.targetArea}</span> petak
                </div>
              </div>

              {/* Interactive Grid (4x4) */}
              <div className="inline-grid grid-cols-4 gap-2 p-3 bg-slate-900 rounded-3xl shadow-inner border-4 border-slate-800">
                {Array.from({ length: 16 }).map((_, tileIdx) => {
                  const isFilled = areaFilledTiles.includes(tileIdx);
                  return (
                    <button
                      key={tileIdx}
                      type="button"
                      onClick={() => handleToggleAreaTile(tileIdx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 transition-all active:scale-90 flex items-center justify-center text-xl font-black cursor-pointer ${
                        isFilled
                          ? 'bg-emerald-500 border-emerald-300 text-white shadow-md shadow-emerald-500/50 scale-102'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-500'
                      }`}
                      title={`Petak ${tileIdx + 1}`}
                    >
                      {isFilled ? '🟩' : '·'}
                    </button>
                  );
                })}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAreaFilledTiles([]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Kosongkan Petak
                </button>
                <button
                  type="button"
                  onClick={() => handleCheckAreaBuilder(currentContent.targetArea, currentContent.exp)}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>PERIKSA BANGUN ARSITEK</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* MATH SORT (Game 12) */}
          {game.id === 'math_sort' && (
            <div className="text-center space-y-6 py-4">
              <span className="text-xs font-black text-slate-500 uppercase">
                KELOMPOKKAN BILANGAN
              </span>
              <div className="w-28 h-28 mx-auto rounded-3xl bg-amber-50 border-4 border-amber-300 flex items-center justify-center text-4xl font-black text-amber-900 shadow-lg animate-bounce">
                {currentContent.num}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleAnswer(currentContent.isEven === true, currentContent.exp)}
                  className="flex-1 max-w-[140px] py-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-base shadow-md active:scale-95 cursor-pointer"
                >
                  GENAP (Even)
                </button>
                <button
                  onClick={() => handleAnswer(currentContent.isEven === false, currentContent.exp)}
                  className="flex-1 max-w-[140px] py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-base shadow-md active:scale-95 cursor-pointer"
                >
                  GANJIL (Odd)
                </button>
              </div>
            </div>
          )}

          {/* GREATER OR LESS (Game 13) */}
          {game.id === 'greater_or_less' && (
            <div className="text-center space-y-6 py-4">
              <span className="text-xs font-black text-slate-500 uppercase">
                BANDINGKAN DUA NILAI
              </span>
              <div className="flex items-center justify-center gap-4 text-3xl sm:text-4xl font-black text-slate-900">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 min-w-[80px]">
                  {currentContent.left}
                </div>
                <span className="text-amber-500">___</span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 min-w-[80px]">
                  {currentContent.right}
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                {['<', '=', '>'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => handleAnswer(sym === currentContent.correct, currentContent.exp)}
                    className="w-16 h-16 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-2xl font-black text-emerald-800 shadow-sm active:scale-95 cursor-pointer"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MATH RACE (Game 14) */}
          {game.id === 'math_race' && (
            <div className="space-y-4 py-2">
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 block text-center">
                🏎️ BALAPAN BERHITUNG MELAWAN BOT
              </span>
              {/* Race Track */}
              <div className="bg-slate-900 p-4 rounded-2xl text-white space-y-3 shadow-inner">
                {/* Player lane */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>KAMU (YOU)</span>
                    <span>🏁 FINISH</span>
                  </div>
                  <div className="w-full bg-slate-800 h-6 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500 flex items-center justify-end pr-1"
                      style={{ width: `${Math.min((round / totalRounds) * 100, 100)}%` }}
                    >
                      🏃
                    </div>
                  </div>
                </div>
                {/* Bot lane */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>ROBOT BOT</span>
                  </div>
                  <div className="w-full bg-slate-800 h-6 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-rose-500/80 rounded-full transition-all duration-500 flex items-center justify-end pr-1"
                      style={{ width: `${Math.min(((round - 0.5) / totalRounds) * 100, 90)}%` }}
                    >
                      🤖
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-black text-slate-900">{currentContent.q}</h3>
              </div>
            </div>
          )}

          {/* TARGET NUMBER (Game 15) */}
          {game.id === 'target_number' && (
            <div className="text-center space-y-4 py-4">
              <span className="text-xs font-black text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                🎯 CAPAI ANGKA TARGET
              </span>
              <div className="w-24 h-24 mx-auto rounded-3xl bg-rose-500 text-white font-black text-4xl flex items-center justify-center shadow-lg">
                {currentContent.target}
              </div>
              <p className="text-sm font-bold text-slate-700">
                Pilih kombinasi hitungan yang menghasilkan {currentContent.target}:
              </p>
            </div>
          )}

          {/* MATH DETECTIVE (Game 16) */}
          {game.id === 'math_detective' && (
            <div className="text-center space-y-4 py-2">
              <span className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                🕵️ MISI DETEKTIF MATEMATIKA
              </span>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
                🔎 PETUNJUK: "{currentContent.clue}"
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {currentContent.boxes.map((box: any) => (
                  <button
                    key={box.id}
                    onClick={() => handleAnswer(box.id === currentContent.correct, currentContent.exp)}
                    className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-center transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span className="text-3xl block mb-1">📦</span>
                    <span className="text-xs font-black text-amber-900 block">KOTAK {box.id}</span>
                    <span className="text-sm font-extrabold text-slate-800 mt-1 block">{box.val}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BALANCE MATH (Game 17) */}
          {game.id === 'balance_math' && (
            <div className="text-center space-y-4 py-2">
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ⚖️ NERACA TIMBANGAN SEIMBANG
              </span>
              <div className="flex items-center justify-center gap-6 my-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-sm font-black text-slate-800">
                  {currentContent.leftDesc}
                </div>
                <div className="text-2xl text-slate-400">⚖️ =</div>
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-300 text-sm font-black text-slate-800">
                  {currentContent.rightDesc}
                </div>
              </div>
              <h3 className="text-base font-black text-slate-900">{currentContent.question}</h3>
            </div>
          )}

          {/* QUICK TAP (Game 18) */}
          {game.id === 'quick_tap' && (
            <div className="text-center space-y-4 py-2">
              <span className="text-xs font-black text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                ⚡ REFLEKS CEPAT TAP
              </span>
              <h3 className="text-lg font-black text-slate-900">{currentContent.prompt}</h3>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {currentContent.bubbles.map((num: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(num === currentContent.target, currentContent.exp)}
                    className="h-16 rounded-2xl bg-white hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400 text-2xl font-black text-slate-800 shadow-sm active:scale-95 cursor-pointer flex items-center justify-center"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TRUE OR FALSE (Game 19) */}
          {game.id === 'true_or_false' && (
            <div className="text-center space-y-6 py-4">
              <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                ✓/✕ BENAR ATAU SALAH?
              </span>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xl sm:text-2xl font-black text-slate-900">
                "{currentContent.statement}"
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleAnswer(currentContent.isTrue === true, currentContent.exp)}
                  className="flex-1 max-w-[150px] py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>BENAR ✓</span>
                </button>
                <button
                  onClick={() => handleAnswer(currentContent.isTrue === false, currentContent.exp)}
                  className="flex-1 max-w-[150px] py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  <span>SALAH ✕</span>
                </button>
              </div>
            </div>
          )}

          {/* WORD PROBLEM ADVENTURE (Game 20) */}
          {game.id === 'word_problem_adventure' && (
            <div className="space-y-4 py-2">
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 block text-center">
                📖 SOAL CERITA INTERAKTIF
              </span>
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-sm font-bold text-slate-800 leading-relaxed">
                {currentContent.story}
              </div>
              {/* Interactive Apples Visual */}
              <div className="flex flex-wrap gap-1.5 justify-center py-1">
                {Array.from({ length: currentContent.totalApples }).map((_, aIdx) => {
                  const isCrossed = applesCrossed.includes(aIdx);
                  return (
                    <button
                      key={aIdx}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setApplesCrossed((prev) =>
                          prev.includes(aIdx) ? prev.filter((x) => x !== aIdx) : [...prev, aIdx]
                        );
                      }}
                      className={`text-2xl p-1 rounded-lg transition-transform cursor-pointer ${
                        isCrossed ? 'opacity-30 line-through scale-90' : 'hover:scale-110'
                      }`}
                      title="Sentuh untuk coret/hitung"
                    >
                      🍎
                    </button>
                  );
                })}
              </div>
              <h4 className="text-center text-sm font-black text-slate-900">
                {currentContent.question}
              </h4>
            </div>
          )}
        </div>

        {/* 3.3 OPTIONS BUTTONS (For games that use 4-option selection) */}
        {currentContent?.opts &&
          game.id !== 'math_match' &&
          game.id !== 'math_memory' &&
          game.id !== 'area_builder' &&
          game.id !== 'math_sort' &&
          game.id !== 'greater_or_less' &&
          game.id !== 'number_catch' &&
          game.id !== 'fraction_pizza' &&
          game.id !== 'math_detective' &&
          game.id !== 'quick_tap' &&
          game.id !== 'true_or_false' && (
            <div className="grid grid-cols-2 gap-3 pt-4">
              {currentContent.opts.map((opt: any, optIdx: number) => {
                const isEliminated = eliminatedOptions.includes(String(opt));
                return (
                  <button
                    key={optIdx}
                    disabled={isEliminated}
                    onClick={() => {
                      const isCorrect =
                        String(opt) === String(currentContent.a) ||
                        String(opt) === String(currentContent.part2Ans) ||
                        String(opt) === String(currentContent.correct) ||
                        String(opt) === String(currentContent.correctExpr) ||
                        String(opt) === String(currentContent.text);
                      handleAnswer(isCorrect, currentContent.exp);
                    }}
                    className={`h-14 sm:h-16 rounded-2xl border-2 text-lg sm:text-xl font-black shadow-sm transition-all flex items-center justify-center ${
                      isEliminated
                        ? 'opacity-25 line-through bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
                        : 'bg-white hover:bg-emerald-50 active:bg-emerald-100 border-slate-200 hover:border-emerald-500 text-slate-800 active:scale-95 cursor-pointer'
                    }`}
                  >
                    {typeof opt === 'number' && game.id === 'money_master'
                      ? `Rp${opt.toLocaleString('id-ID')}`
                      : String(opt)}
                  </button>
                );
              })}
            </div>
          )}

        {/* 3.4 ENHANCED FEEDBACK BANNER (With Advance Button and Read Pause) */}
        {feedback && (
          <div
            className={`mt-4 p-4 rounded-2xl border text-center animate-in zoom-in-95 shadow-md ${
              feedback.isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-black text-sm text-left">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {!isFeedbackPaused && (
                  <button
                    type="button"
                    onClick={() => {
                      if (feedbackAdvanceTimerRef.current) {
                        clearTimeout(feedbackAdvanceTimerRef.current);
                        feedbackAdvanceTimerRef.current = null;
                      }
                      setIsFeedbackPaused(true);
                      sound.playClick();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Hentikan hitungan mundur agar bisa membaca penjelasan"
                  >
                    <Pause className="w-3.5 h-3.5 text-slate-500" />
                    <span>Tahan / Baca</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (feedbackAdvanceTimerRef.current) {
                      clearTimeout(feedbackAdvanceTimerRef.current);
                      feedbackAdvanceTimerRef.current = null;
                    }
                    sound.playClick();
                    handleNextRound();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Lanjut Sekarang</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {feedback.explanation && (
              <div className="text-xs font-semibold mt-3 text-left bg-white/80 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                <span className="font-black block text-slate-900 mb-0.5">💡 Penjelasan Konsep:</span>
                {feedback.explanation}
              </div>
            )}
          </div>
        )}

        {/* 3.5 SMART HINT BUTTON & ACCORDION */}
        <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
          {currentContent?.hint && !feedback && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHint ? 'Tutup Petunjuk' : '💡 Butuh Petunjuk?'}</span>
            </button>
          )}

          {showHint && currentContent?.hint && !feedback && (
            <div className="w-full mt-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium text-left animate-in fade-in">
              💡 <strong>Petunjuk Pintar:</strong> {currentContent.hint}
            </div>
          )}
        </div>
      </div>

      {/* 3.6 IN-GAME TUTORIAL & HELP MODAL */}
      {showTutorialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-base">
                  {game.icon}
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{game.title}</h3>
                  <p className="text-[11px] text-slate-500 font-bold">{game.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setShowTutorialModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-left text-xs">
              <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200">
                <span className="font-black text-sky-900 block mb-1">🎯 Cara Bermain Babak Ini:</span>
                <p className="text-slate-700 font-semibold">{getGameActionGuidance(game.id)}</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-black text-slate-800 uppercase tracking-wider text-[11px] block">
                  Aturan & Petunjuk:
                </span>
                {game.rules.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-950">
                <span className="font-black block mb-0.5">💡 Tips Power-Up:</span>
                <p className="text-[11px] font-semibold text-amber-900">
                  Gunakan ❄️ Beku untuk menghentikan timer 5 detik, ⚡ 50:50 untuk membuang 2 jawaban salah, dan 🛡️ Perisai untuk menahan 1 kesalahan.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowTutorialModal(false)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer transition-transform active:scale-95"
            >
              Saya Mengerti! Lanjutkan Main 🎮
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
