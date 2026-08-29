import React, { useState, useEffect } from 'react';
import { ChildProfile } from '../types';
import { GradeMathEngine, GradeLevel } from '../services/gradeMathEngine';
import { sound } from '../services/sound';
import {
  Swords,
  Users,
  Bot,
  Trophy,
  Zap,
  RotateCcw,
  X,
  Sparkles,
  Flame,
  Crown,
  Play,
} from 'lucide-react';

interface Props {
  activeProfile: ChildProfile;
  onClose: () => void;
  onRewardXP: (xp: number, coins: number) => void;
}

interface DuelQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const MathDuelModal: React.FC<Props> = ({ activeProfile, onClose, onRewardXP }) => {
  const [duelMode, setDuelMode] = useState<'menu' | 'split_screen' | 'vs_bot'>('menu');
  const [selectedGrade, setSelectedGrade] = useState<number>(() => {
    if (activeProfile.grade.includes('Kelas 1')) return 1;
    if (activeProfile.grade.includes('Kelas 2')) return 2;
    if (activeProfile.grade.includes('Kelas 3')) return 3;
    if (activeProfile.grade.includes('Kelas 4')) return 4;
    if (activeProfile.grade.includes('Kelas 5')) return 5;
    if (activeProfile.grade.includes('Kelas 6')) return 6;
    return 2;
  });

  // Game state
  const [round, setRound] = useState<number>(1);
  const totalRounds = 10;
  const [currentQ, setCurrentQ] = useState<DuelQuestion | null>(null);

  // Player 1 state
  const [p1Name, setP1Name] = useState<string>(activeProfile.name || 'Pemain 1');
  const [p1Score, setP1Score] = useState<number>(0);
  const [p1Answered, setP1Answered] = useState<boolean>(false);
  const [p1Feedback, setP1Feedback] = useState<'correct' | 'wrong' | null>(null);

  // Player 2 / Bot state
  const [p2Name, setP2Name] = useState<string>('Pemain 2');
  const [p2Score, setP2Score] = useState<number>(0);
  const [p2Answered, setP2Answered] = useState<boolean>(false);
  const [p2Feedback, setP2Feedback] = useState<'correct' | 'wrong' | null>(null);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [botDifficulty, setBotDifficulty] = useState<'mudah' | 'sedang' | 'cepat'>('sedang');

  // Generate a question for the current round
  const generateDuelQuestion = (gradeLvl: number): DuelQuestion => {
    const q = GradeMathEngine.generateQuestion((gradeLvl === 0 ? 1 : gradeLvl) as GradeLevel);
    return {
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    };
  };

  const startDuel = (mode: 'split_screen' | 'vs_bot') => {
    sound.playClick();
    setDuelMode(mode);
    setRound(1);
    setP1Score(0);
    setP2Score(0);
    setP1Answered(false);
    setP2Answered(false);
    setP1Feedback(null);
    setP2Feedback(null);
    setGameOver(false);

    if (mode === 'vs_bot') {
      setP2Name('Kaka Bot 🤖');
    } else {
      setP2Name('Pemain 2 🎮');
    }

    const firstQ = generateDuelQuestion(selectedGrade);
    setCurrentQ(firstQ);
  };

  // Bot logic
  useEffect(() => {
    if (duelMode !== 'vs_bot' || !currentQ || p2Answered || gameOver) return;

    let delay = 3500; // sedang
    if (botDifficulty === 'mudah') delay = 5000;
    if (botDifficulty === 'cepat') delay = 2000;

    // slight randomization
    const actualDelay = delay + (Math.random() * 1000 - 500);

    const timer = setTimeout(() => {
      if (p2Answered || gameOver) return;
      const isBotCorrect = Math.random() > 0.25; // 75% accuracy
      const ans = isBotCorrect ? currentQ.correctAnswer : currentQ.options.find((o) => o !== currentQ.correctAnswer) || currentQ.correctAnswer;
      handleP2Answer(ans);
    }, actualDelay);

    return () => clearTimeout(timer);
  }, [currentQ, duelMode, p2Answered, gameOver, botDifficulty]);

  const handleP1Answer = (ans: string) => {
    if (p1Answered || gameOver || !currentQ) return;
    setP1Answered(true);

    if (ans === currentQ.correctAnswer) {
      sound.playCorrect();
      setP1Score((prev) => prev + 10);
      setP1Feedback('correct');
    } else {
      sound.playWrong();
      setP1Feedback('wrong');
    }

    checkRoundAdvance(true, p2Answered);
  };

  const handleP2Answer = (ans: string) => {
    if (p2Answered || gameOver || !currentQ) return;
    setP2Answered(true);

    if (ans === currentQ.correctAnswer) {
      sound.playCorrect();
      setP2Score((prev) => prev + 10);
      setP2Feedback('correct');
    } else {
      sound.playWrong();
      setP2Feedback('wrong');
    }

    checkRoundAdvance(p1Answered, true);
  };

  const checkRoundAdvance = (p1Done: boolean, p2Done: boolean) => {
    if (p1Done && p2Done) {
      setTimeout(() => {
        if (round >= totalRounds) {
          sound.playFanfare();
          setGameOver(true);
          onRewardXP(p1Score * 2, Math.floor(p1Score / 5));
        } else {
          setRound((prev) => prev + 1);
          setP1Answered(false);
          setP2Answered(false);
          setP1Feedback(null);
          setP2Feedback(null);
          setCurrentQ(generateDuelQuestion(selectedGrade));
        }
      }, 1200);
    }
  };

  // If one player answered, auto advance after 2.5 seconds timeout if other doesn't
  useEffect(() => {
    if ((p1Answered && !p2Answered) || (!p1Answered && p2Answered)) {
      const timer = setTimeout(() => {
        if (!p1Answered) handleP1Answer('TIMEOUT');
        if (!p2Answered) handleP2Answer('TIMEOUT');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [p1Answered, p2Answered]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border-4 border-rose-400 shadow-2xl flex flex-col my-auto max-h-[96vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 p-4 text-white flex items-center justify-between shadow-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner border border-white/30">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">Arena Duel Matematika 1 vs 1</h2>
                <span className="text-[10px] font-black bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Multiplayer & Bot
                </span>
              </div>
              <p className="text-xs text-rose-100">
                Adu kecepatan dan ketepatan berhitung dengan teman atau AI Kaka Bot!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* 1. MENU VIEW */}
        {/* ============================================================== */}
        {duelMode === 'menu' && (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50">
            <div className="max-w-2xl mx-auto space-y-6 text-center">
              <div className="inline-block p-4 rounded-3xl bg-rose-100 text-rose-600 text-5xl shadow-inner">
                ⚡
              </div>
              <h3 className="text-2xl font-black text-slate-800">Pilih Mode Pertarungan Matematika</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Tantang temanmu di layar yang sama, atau latih kecepatan berhitung melawan Robot Pintar.
              </p>

              {/* Grade Selector */}
              <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 text-left">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                  Tingkat Kesulitan Materi:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrade(g)}
                      className={`p-2 rounded-xl text-center font-black text-xs cursor-pointer border ${
                        selectedGrade === g ? 'bg-rose-500 text-white border-rose-600 shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Kelas {g} SD
                    </button>
                  ))}
                </div>
              </div>

              {/* Duel Mode Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 2 Players Split Screen */}
                <div
                  onClick={() => startDuel('split_screen')}
                  className="bg-white hover:bg-orange-50/50 p-6 rounded-3xl border-2 border-slate-200 hover:border-orange-400 shadow-xs hover:shadow-md transition-all cursor-pointer text-left space-y-3 group"
                >
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    👥
                  </div>
                  <h4 className="font-black text-base text-slate-800 group-hover:text-orange-600">
                    Duel Layar Bersama (2 Pemain)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Main berdua langsung di 1 HP / Tablet / Layar. Sisi kiri vs sisi kanan saling berhadapan!
                  </p>
                  <div className="text-xs font-black text-orange-600 flex items-center gap-1 pt-2">
                    Mulai Duel Teman <Play className="w-3.5 h-3.5 fill-orange-600" />
                  </div>
                </div>

                {/* VS AI Bot */}
                <div
                  onClick={() => startDuel('vs_bot')}
                  className="bg-white hover:bg-rose-50/50 p-6 rounded-3xl border-2 border-slate-200 hover:border-rose-400 shadow-xs hover:shadow-md transition-all cursor-pointer text-left space-y-3 group"
                >
                  <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🤖
                  </div>
                  <h4 className="font-black text-base text-slate-800 group-hover:text-rose-600">
                    Duel Lawan Robot Kaka (AI)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Uji kemampuan berhitungmu melawan bot cerdas dengan respon cepat dan tangkas!
                  </p>

                  <div className="flex gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                    {(['mudah', 'sedang', 'cepat'] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setBotDifficulty(spd)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase ${
                          botDifficulty === spd ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. ACTIVE DUEL VIEW (SPLIT SCREEN / VS BOT) */}
        {/* ============================================================== */}
        {(duelMode === 'split_screen' || duelMode === 'vs_bot') && !gameOver && currentQ && (
          <div className="flex flex-col flex-1 overflow-hidden bg-slate-50">
            {/* Top Score Bar */}
            <div className="bg-white p-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              {/* Player 1 Info */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-sm">
                  {p1Name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-black text-slate-800">{p1Name}</span>
                  <div className="text-xs font-black text-blue-600">{p1Score} Poin</div>
                </div>
              </div>

              {/* Round indicator */}
              <div className="text-center">
                <span className="text-xs font-black bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
                  Ronde {round} / {totalRounds}
                </span>
              </div>

              {/* Player 2 Info */}
              <div className="flex items-center gap-2 text-right">
                <div>
                  <span className="text-xs font-black text-slate-800">{p2Name}</span>
                  <div className="text-xs font-black text-rose-600">{p2Score} Poin</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-black flex items-center justify-center text-sm">
                  {p2Name.charAt(0)}
                </div>
              </div>
            </div>

            {/* Duel Arena Split Screen */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-slate-200 overflow-y-auto">
              {/* ================= PLAYER 1 ZONE (LEFT / BLUE) ================= */}
              <div className={`p-4 sm:p-6 flex flex-col justify-between transition-colors ${
                p1Feedback === 'correct' ? 'bg-emerald-50' : p1Feedback === 'wrong' ? 'bg-rose-50' : 'bg-blue-50/20'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-lg">
                      {p1Name} (Pemain 1)
                    </span>
                    {p1Answered && (
                      <span className={`text-xs font-black ${p1Feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {p1Feedback === 'correct' ? '✓ Benar (+10)' : '✕ Salah'}
                      </span>
                    )}
                  </div>

                  {/* Question Box */}
                  <div className="bg-white p-5 rounded-2xl border-2 border-blue-200 shadow-xs text-center mb-4">
                    <span className="text-xs font-bold text-slate-400 block mb-1">SOAL CEPAT:</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800">{currentQ.question}</h3>
                  </div>
                </div>

                {/* Option Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleP1Answer(opt)}
                      disabled={p1Answered}
                      className="p-3.5 bg-white hover:bg-blue-500 hover:text-white disabled:opacity-60 font-black text-sm text-slate-800 rounded-2xl border-2 border-blue-300 shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* ================= PLAYER 2 / BOT ZONE (RIGHT / ROSE) ================= */}
              <div className={`p-4 sm:p-6 flex flex-col justify-between transition-colors ${
                p2Feedback === 'correct' ? 'bg-emerald-50' : p2Feedback === 'wrong' ? 'bg-rose-50' : 'bg-rose-50/20'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-lg">
                      {p2Name} {duelMode === 'vs_bot' ? '🤖' : '(Pemain 2)'}
                    </span>
                    {p2Answered && (
                      <span className={`text-xs font-black ${p2Feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {p2Feedback === 'correct' ? '✓ Benar (+10)' : '✕ Salah'}
                      </span>
                    )}
                  </div>

                  {/* Question Box */}
                  <div className="bg-white p-5 rounded-2xl border-2 border-rose-200 shadow-xs text-center mb-4">
                    <span className="text-xs font-bold text-slate-400 block mb-1">SOAL CEPAT:</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800">{currentQ.question}</h3>
                  </div>
                </div>

                {/* Option Buttons (If 2-Player mode, active; if bot, disabled display) */}
                <div className="grid grid-cols-2 gap-2.5">
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleP2Answer(opt)}
                      disabled={p2Answered || duelMode === 'vs_bot'}
                      className="p-3.5 bg-white hover:bg-rose-500 hover:text-white disabled:opacity-60 font-black text-sm text-slate-800 rounded-2xl border-2 border-rose-300 shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. GAME OVER & WINNER REVEAL */}
        {/* ============================================================== */}
        {gameOver && (
          <div className="p-8 text-center space-y-6 flex-1 overflow-y-auto bg-slate-50">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 mx-auto bg-yellow-400 text-yellow-950 rounded-3xl flex items-center justify-center text-5xl shadow-lg animate-bounce">
                👑
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                {p1Score > p2Score
                  ? `🎉 ${p1Name} MENANG!`
                  : p2Score > p1Score
                  ? `🎉 ${p2Name} MENANG!`
                  : '🤝 HASIL SERI / IMBANG!'}
              </h3>

              {/* Final Score Board */}
              <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="font-bold text-xs text-blue-900">{p1Name}</div>
                  <div className="text-3xl font-black text-blue-700 mt-1">{p1Score}</div>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
                  <div className="font-bold text-xs text-rose-900">{p2Name}</div>
                  <div className="text-3xl font-black text-rose-700 mt-1">{p2Score}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => startDuel(duelMode)}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-md cursor-pointer flex items-center gap-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Main Lagi
                </button>
                <button
                  onClick={() => setDuelMode('menu')}
                  className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-2xl cursor-pointer text-sm"
                >
                  Menu Utama
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
