import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, Trophy, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface CardItem {
  id: string;
  pairId: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MatchCardsGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const pairs = [
    { id: 1, a: '3 + 4', b: '7' },
    { id: 2, a: '8 - 3', b: '5' },
    { id: 3, a: '2 × 5', b: '10' },
    { id: 4, a: '12 ÷ 3', b: '4' },
  ];

  const initGame = () => {
    const cardList: CardItem[] = [];
    pairs.forEach((p, idx) => {
      cardList.push({ id: `card_${idx}_a`, pairId: p.id, content: p.a, isFlipped: false, isMatched: false });
      cardList.push({ id: `card_${idx}_b`, pairId: p.id, content: p.b, isFlipped: false, isMatched: false });
    });

    setCards(cardList.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMoves(0);
    sound.speak('Buka dan pasangkan soal matematika dengan hasil jawaban yang tepat!');
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (card: CardItem) => {
    if (card.isMatched || card.isFlipped || selectedCards.length >= 2) return;

    sound.playClick();
    const updatedCards = cards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newSelected;
      if (first.pairId === second.pairId) {
        // Match!
        sound.playCorrect();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.pairId === first.pairId ? { ...c, isMatched: true } : c))
          );
          setSelectedCards([]);
          setScore((prev) => prev + 25);

          // Check if all matched
          const remaining = updatedCards.filter((c) => !c.isMatched && c.pairId !== first.pairId);
          if (remaining.length === 0) {
            sound.playFanfare();
            confetti({ particleCount: 50, spread: 75 });
            setGameOver(true);
          }
        }, 600);
      } else {
        // Not a match
        sound.playRetry();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c))
          );
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  if (gameOver) {
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-rose-400 shadow-xl animate-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Pakar Memori Matematika! 🎴✨</h3>
        <p className="text-slate-600 mb-4">Kamu berhasil memasangkan seluruh kartu dengan {moves} langkah jitu!</p>
        <div className="flex justify-center gap-2 mb-6">
          <span className="text-4xl text-amber-400">★★★</span>
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP didapatkan!</p>
        <button
          onClick={() => onComplete(score, 3)}
          className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow cursor-pointer"
        >
          Lanjut Petualangan 🌟
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-rose-100 via-pink-50 to-amber-100 rounded-3xl p-6 border-4 border-rose-300 shadow-xl min-h-[480px] flex flex-col justify-between">
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm md:text-base">
          <span>🎴</span>
          <span>Pasangkan Kartu ({moves} Langkah)</span>
          <button
            onClick={() => sound.speak('Pasangkan soal dengan jawaban yang tepat!')}
            className="p-1.5 bg-rose-100 text-rose-800 rounded-full hover:bg-rose-200"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <button onClick={onExit} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg">
          Tutup
        </button>
      </div>

      <div className="text-center my-2">
        <h3 className="text-sm md:text-base font-bold text-slate-800">
          Buka 2 kartu dan temukan pasangan <span className="text-rose-600 font-black">Soal & Hasilnya</span>!
        </h3>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-3 my-3">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => handleCardClick(c)}
            className={`h-24 md:h-28 rounded-2xl font-black text-lg md:text-xl shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center border-2 ${
              c.isMatched
                ? 'bg-emerald-100 text-emerald-800 border-emerald-400 opacity-60 scale-95'
                : c.isFlipped
                ? 'bg-white text-slate-900 border-rose-400 rotate-0 shadow-lg scale-105'
                : 'bg-gradient-to-b from-rose-500 to-pink-600 text-white border-rose-600 hover:scale-105'
            }`}
          >
            {c.isFlipped || c.isMatched ? c.content : '❓'}
          </button>
        ))}
      </div>

      <div className="text-center text-xs font-bold text-slate-600 bg-white/80 py-2 rounded-xl">
        💡 Latih konsentrasi dan kemampuan hitung cepatmu!
      </div>
    </div>
  );
};
