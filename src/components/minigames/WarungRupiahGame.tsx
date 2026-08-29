import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { Volume2, ShoppingBag, Coins, CheckCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface MarketItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
}

const ITEMS: MarketItem[] = [
  { id: 'item_1', name: 'Es Cendol Durian', emoji: '🍧', price: 5000 },
  { id: 'item_2', name: 'Sate Ayam Madura', emoji: '🍢', price: 8000 },
  { id: 'item_3', name: 'Martabak Manis', emoji: '🥞', price: 12000 },
  { id: 'item_4', name: 'Kue Onde-Onde', emoji: '🍘', price: 3000 },
  { id: 'item_5', name: 'Buku Tulis Batik', emoji: '📒', price: 6000 },
];

export const WarungRupiahGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<MarketItem>(ITEMS[0]);
  const [buyerPayment, setBuyerPayment] = useState<number>(10000);
  const [selectedChange, setSelectedChange] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const correctChange = buyerPayment - selectedItem.price;

  const initRound = (r: number) => {
    const item = ITEMS[(r - 1) % ITEMS.length];
    const payment = item.price <= 5000 ? 10000 : item.price <= 10000 ? 15000 : 20000;

    setSelectedItem(item);
    setBuyerPayment(payment);
    setSelectedChange(0);
    setFeedback(null);

    const prompt = `Pelanggan membeli ${item.name} seharga Rp${item.price.toLocaleString('id-ID')} dan membayar Rp${payment.toLocaleString('id-ID')}. Berapa kembaliannya?`;
    sound.speak(prompt);
  };

  useEffect(() => {
    initRound(1);
  }, []);

  const addMoneyToChange = (amount: number) => {
    sound.playClick();
    setSelectedChange((prev) => prev + amount);
  };

  const resetChange = () => {
    sound.playClick();
    setSelectedChange(0);
  };

  const verifyTransaction = () => {
    if (selectedChange === correctChange) {
      sound.playCorrect();
      sound.playCoin();
      confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
      setScore((prev) => prev + 30);
      setFeedback('Luar biasa! Kembalian uang pas dan benar! 🪙✨');
      sound.speak('Luar biasa! Kembalian uang pas dan benar!');

      setTimeout(() => {
        if (round >= 4) {
          setGameOver(true);
          sound.playFanfare();
        } else {
          setRound((prev) => prev + 1);
          initRound(round + 1);
        }
      }, 1500);
    } else if (selectedChange < correctChange) {
      sound.playRetry();
      const diff = correctChange - selectedChange;
      setFeedback(`Kembalian masih kurang Rp${diff.toLocaleString('id-ID')}. Coba hitung lagi yuk!`);
      sound.speak(`Kembalian masih kurang.`);
    } else {
      sound.playRetry();
      const excess = selectedChange - correctChange;
      setFeedback(`Kembalian kelebihan Rp${excess.toLocaleString('id-ID')}. Ayo kurangi!`);
      sound.speak(`Kembalian kelebihan.`);
    }
  };

  if (gameOver) {
    const stars = score >= 90 ? 3 : 2;
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border-4 border-amber-400 shadow-xl animate-in zoom-in duration-300">
        <div className="text-6xl mb-3">🏪🪙</div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Kasir Warung Juara!</h3>
        <p className="text-slate-600 mb-4">Kamu sangat mahir menghitung uang rupiah dan kembalian!</p>
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-4xl ${i < stars ? 'text-amber-400' : 'text-slate-200'}`}>
              ★
            </span>
          ))}
        </div>
        <p className="text-lg font-bold text-emerald-600 mb-6">+ {score} XP & Koin Didapatkan!</p>
        <button
          onClick={() => onComplete(score, stars)}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105"
        >
          Ambil Hadiah 🌟
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 rounded-3xl p-6 border-4 border-amber-300 shadow-xl min-h-[480px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl shadow">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-slate-800 text-sm md:text-base">Warung Kasir Matematika (Ronde {round}/4)</span>
          <button
            onClick={() =>
              sound.speak(
                `Pelanggan beli ${selectedItem.name} seharga Rp${selectedItem.price.toLocaleString('id-ID')}, bayar Rp${buyerPayment.toLocaleString('id-ID')}. Berapa kembaliannya?`
              )
            }
            className="p-1.5 bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs md:text-sm">
            ⭐ {score} XP
          </span>
          <button onClick={onExit} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-lg">
            Tutup
          </button>
        </div>
      </div>

      {/* Transaction Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Buyer item & payment */}
        <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-amber-200 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{selectedItem.emoji}</span>
            <div>
              <h4 className="font-bold text-slate-800 text-lg">{selectedItem.name}</h4>
              <p className="text-sm font-semibold text-rose-600">Harga: Rp{selectedItem.price.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-xs text-slate-600 font-medium">Uang Pembeli:</p>
            <p className="text-lg font-black text-emerald-700">💵 Rp{buyerPayment.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Change Register */}
        <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-amber-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-600">Uang Kembalian Disiapkan:</span>
              <button
                onClick={resetChange}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>
            <div className="text-2xl md:text-3xl font-black text-indigo-700 bg-indigo-50 p-3 rounded-xl text-center border border-indigo-200">
              Rp{selectedChange.toLocaleString('id-ID')}
            </div>
          </div>

          {feedback && (
            <p className="text-xs font-bold text-center mt-2 text-indigo-900 bg-amber-100 p-1.5 rounded-lg animate-fade-in">
              {feedback}
            </p>
          )}

          <button
            onClick={verifyTransaction}
            className="mt-3 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" /> Berikan Kembalian
          </button>
        </div>
      </div>

      {/* Money Dispenser Pad */}
      <div className="bg-white/90 p-4 rounded-2xl shadow-inner border-2 border-amber-200">
        <p className="text-xs font-bold text-slate-700 mb-2">Pilih Uang Koin & Kertas Rupiah:</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { label: '+ Rp500', val: 500, color: 'bg-slate-200 text-slate-800 border-slate-400' },
            { label: '+ Rp1.000', val: 1000, color: 'bg-amber-200 text-amber-900 border-amber-400' },
            { label: '+ Rp2.000', val: 2000, color: 'bg-emerald-200 text-emerald-900 border-emerald-400' },
            { label: '+ Rp5.000', val: 5000, color: 'bg-yellow-200 text-yellow-900 border-yellow-400' },
            { label: '+ Rp10.000', val: 10000, color: 'bg-rose-200 text-rose-900 border-rose-400' },
            { label: '+ Rp20.000', val: 20000, color: 'bg-teal-200 text-teal-900 border-teal-400' },
          ].map((m, idx) => (
            <button
              key={idx}
              onClick={() => addMoneyToChange(m.val)}
              className={`py-2 px-1 rounded-xl text-xs md:text-sm font-bold border-2 shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer ${m.color}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
