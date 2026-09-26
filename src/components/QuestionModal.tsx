import React, { useState, useEffect } from 'react';
import { QuestionItem } from '../types';
import { sound } from '../services/sound';
import { Volume2, Lightbulb, Bot, CheckCircle, XCircle, Sparkles, ArrowRight, HelpCircle, Globe, Brain, Search, Split, Key } from 'lucide-react';
import confetti from 'canvas-confetti';
import { InteractiveObjectChests } from './adventure/InteractiveObjectChests';

interface Props {
  question: QuestionItem;
  childName: string;
  onAnswerCorrect: (xpReward: number, coinReward: number) => void;
  onAnswerIncorrect: () => void;
  onAskAITutor: (q: QuestionItem) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<Props> = ({
  question,
  childName,
  onAnswerCorrect,
  onAnswerIncorrect,
  onAskAITutor,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0); // 0: none, 1: hint1, 2: hint2, 3: hint3
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isEnglishMode, setIsEnglishMode] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const displayQuestion = isEnglishMode && question.englishQuestion ? question.englishQuestion : question.question;
  const displayExplanation = isEnglishMode && question.englishExplanation ? question.englishExplanation : question.explanation;

  useEffect(() => {
    // Speak question upon opening
    sound.speak(displayQuestion);
  }, [displayQuestion]);

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isAnswered) return;

    setIsAnswered(true);

    const normSelect = selectedOption.trim().toLowerCase();
    const normCorrect = question.correctAnswer.trim().toLowerCase();
    const isAccepted = question.acceptedAnswers
      ? question.acceptedAnswers.some((a) => a.trim().toLowerCase() === normSelect)
      : false;

    const correct = normSelect === normCorrect || isAccepted;
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      sound.playCoin();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      const msg = isEnglishMode ? 'Correct answer! Fantastic mathematical thinking! 🎉' : 'Jawabanmu benar! Pemikiran matematika yang hebat! 🎉';
      setFeedbackMessage(msg);
      sound.speak(msg);
    } else {
      sound.playRetry();
      const msg = isEnglishMode ? 'Good try! Let\'s think and check the hints ✨' : 'Usaha bagus! Coba periksa petunjuk atau telaah strategi yuk! ✨';
      setFeedbackMessage(msg);
      sound.speak(msg);
      onAnswerIncorrect();
    }
  };

  const handleNext = () => {
    if (isCorrect) {
      onAnswerCorrect(20, 10);
    } else {
      onClose();
    }
  };

  const unlockNextHint = () => {
    sound.playClick();
    const nextLevel = Math.min(3, hintLevel + 1);
    setHintLevel(nextLevel);
    let hintText = '';
    if (nextLevel === 1) hintText = question.hint1;
    if (nextLevel === 2) hintText = question.hint2;
    if (nextLevel === 3) hintText = question.hint3;
    sound.speak(`Petunjuk tingkat ${nextLevel}: ${hintText}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 p-1.5 rounded-xl text-lg font-bold">🎯</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm md:text-base leading-tight">{question.topicTitle}</h3>
                {question.stage && (
                  <span className="bg-white/25 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Stage {question.stage}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-100 font-medium">{question.competency}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Bilingual Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                setIsEnglishMode(!isEnglishMode);
              }}
              className="px-2.5 py-1 rounded-xl bg-white/25 hover:bg-white/40 text-xs font-black flex items-center gap-1 transition-all"
              title="Ganti Bahasa (Indonesian / English)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isEnglishMode ? '🇬🇧 EN' : '🇮🇩 ID'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Question Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Story context badge */}
          {question.contextStory && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 font-medium flex items-start gap-2">
              <span className="text-base">📖</span>
              <span>{question.contextStory}</span>
            </div>
          )}

          {/* Thinking Type Badge */}
          {question.thinkingType && question.thinkingType !== 'standard' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5 text-indigo-500" />
              {question.thinkingType === 'multiple_strategies' && 'Multiple Strategies Arena'}
              {question.thinkingType === 'find_the_mistake' && 'Math Detective: Spot the Error'}
              {question.thinkingType === 'which_one_doesnt_belong' && 'Which One Doesn\'t Belong? (WODB)'}
              {question.thinkingType === 'always_sometimes_never' && 'Always, Sometimes, or Never?'}
              {question.thinkingType === 'bar_model' && 'Visual Bar Model'}
              {question.thinkingType === 'estimation' && 'Estimation Mountain'}
              {question.thinkingType === 'open_ended' && 'Open-Ended Mathematical Thinking'}
            </div>
          )}

          {/* Question Text with Voice Read button */}
          <div className="flex items-start justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
                {displayQuestion}
              </h2>
              {isEnglishMode && question.question && (
                <p className="text-xs text-slate-400 font-medium mt-1">ID: {question.question}</p>
              )}
            </div>
            <button
              onClick={() => sound.speak(displayQuestion)}
              className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl cursor-pointer flex-shrink-0 transition-transform active:scale-90"
              title="Dengarkan Soal"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* 1. VISUAL: Math Detective Chalkboard */}
          {question.mistakeContext && (
            <div className="bg-slate-800 text-amber-200 rounded-2xl p-4 border-4 border-slate-700 font-mono text-sm shadow-inner relative">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-amber-400" /> Papan Tulis {question.mistakeContext.studentName}:
              </div>
              <p className="text-lg font-black text-white">{question.mistakeContext.initialClaim}</p>
              <p className="text-xs text-amber-300/80 mt-1">🔍 Tugasmu: Temukan di mana letak kekeliruan perhitungan di atas!</p>
            </div>
          )}

          {/* 2. VISUAL: Bar Model */}
          {question.barModelData && (
            <div className="bg-white rounded-2xl p-4 border-2 border-indigo-200 shadow-xs space-y-2">
              <span className="text-xs font-black text-indigo-700 block">Visual Bar Model (Part-Whole):</span>
              <div className="border-2 border-indigo-600 bg-indigo-50 rounded-xl p-2 text-center font-black text-indigo-900 text-sm">
                Keseluruhan: {question.barModelData.whole}
              </div>
              <div className="flex gap-2">
                {question.barModelData.parts.map((p, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 p-2.5 rounded-xl border-2 text-center font-black text-xs ${
                      p.isUnknown
                        ? 'bg-amber-100 border-dashed border-amber-500 text-amber-900 animate-pulse'
                        : 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    }`}
                  >
                    <span className="block text-[10px] text-slate-500 font-medium">{p.label}</span>
                    <span className="text-base">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. VISUAL: Multiple Strategies Arena */}
          {question.strategies && (
            <div className="space-y-2 bg-purple-50/70 p-3 rounded-2xl border border-purple-200">
              <span className="text-xs font-black text-purple-900 flex items-center gap-1">
                <Split className="w-3.5 h-3.5 text-purple-600" /> Perbandingan Strategi Berpikir:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.strategies.map((st) => (
                  <div key={st.id} className="bg-white p-3 rounded-xl border border-purple-200 shadow-2xs text-xs">
                    <span className="font-black text-purple-800 block mb-0.5">{st.name}</span>
                    <span className="text-slate-600 font-mono">{st.steps}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. VISUAL: WODB Interactive Grid */}
          {question.wodbItems && (
            <div className="grid grid-cols-2 gap-2.5">
              {question.wodbItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectOption(item.value)}
                  className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                    selectedOption === item.value
                      ? 'bg-orange-100 border-orange-500 text-orange-950 font-black shadow-md scale-102'
                      : 'bg-slate-50 border-slate-200 hover:border-orange-300 text-slate-700'
                  }`}
                >
                  <span className="text-2xl font-black block mb-1">{item.value}</span>
                  <span className="text-[11px] text-slate-500 leading-tight block">{item.reason}</span>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Treasure Chests for Choices */}
          {!question.wodbItems && (
            <div className="pt-1">
              <InteractiveObjectChests
                options={question.options}
                correctAnswer={question.correctAnswer}
                selectedOption={selectedOption}
                isAnswered={isAnswered}
                onSelectChest={(opt) => {
                  setSelectedOption(opt);
                }}
              />
            </div>
          )}

          {/* 3-Level Hint System */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>{isEnglishMode ? 'Hint System' : 'Sistem Petunjuk'} ({hintLevel}/3)</span>
              </div>
              <div className="flex items-center gap-2">
                {hintLevel < 3 && (
                  <button
                    onClick={unlockNextHint}
                    className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-2.5 py-1 rounded-xl cursor-pointer transition-colors"
                  >
                    {isEnglishMode ? `Unlock Hint ${hintLevel + 1} 💡` : `Buka Petunjuk ${hintLevel + 1} 💡`}
                  </button>
                )}
                <button
                  onClick={() => onAskAITutor(question)}
                  className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-2.5 py-1 rounded-xl cursor-pointer flex items-center gap-1"
                >
                  <Bot className="w-3.5 h-3.5" /> Tanya Kaka AI
                </button>
              </div>
            </div>

            {/* Hint disclosures */}
            {hintLevel >= 1 && (
              <div className="text-xs bg-amber-100/70 p-2.5 rounded-xl text-amber-900 border border-amber-200 animate-in fade-in">
                <strong>💡 {isEnglishMode ? 'Hint 1 (Clue):' : 'Petunjuk 1 (Klu):'}</strong> {question.hint1}
              </div>
            )}
            {hintLevel >= 2 && (
              <div className="text-xs bg-orange-100/70 p-2.5 rounded-xl text-orange-950 border border-orange-200 animate-in fade-in">
                <strong>💡 {isEnglishMode ? 'Hint 2 (Strategy):' : 'Petunjuk 2 (Strategi):'}</strong> {question.hint2}
              </div>
            )}
            {hintLevel >= 3 && (
              <div className="text-xs bg-purple-100/70 p-2.5 rounded-xl text-purple-950 border border-purple-200 animate-in fade-in">
                <strong>💡 {isEnglishMode ? 'Hint 3 (Worked Step):' : 'Petunjuk 3 (Langkah Solusi):'}</strong> {question.hint3}
              </div>
            )}
          </div>

          {/* Explanation if answered */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl border text-sm font-medium ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
              <div className="font-bold mb-1 flex items-center gap-2">
                {isCorrect ? '🎉 ' + feedbackMessage : '💡 ' + feedbackMessage}
              </div>
              <p className="text-xs text-slate-700 mt-1">
                <strong>{isEnglishMode ? 'Mathematical Explanation:' : 'Penjelasan Matematis:'}</strong> {displayExplanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-sm hover:bg-slate-100 cursor-pointer"
          >
            {isEnglishMode ? 'Cancel' : 'Batal'}
          </button>

          {!isAnswered ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedOption}
              className={`px-6 py-2.5 rounded-2xl font-bold text-sm md:text-base flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                selectedOption
                  ? 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" /> {isEnglishMode ? 'Check Answer' : 'Periksa Jawaban'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm md:text-base rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              {isCorrect ? '+20 XP & +10 Koin' : (isEnglishMode ? 'Try Again Later' : 'Coba Lagi Nanti')} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
