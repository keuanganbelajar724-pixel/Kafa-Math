import React, { useState } from 'react';
import { ChildProfile, ShopItem } from '../types';
import { ALL_SHOP_ITEMS } from '../data/achievementsData';
import { sound } from '../services/sound';
import { ShoppingBag, Coins, Sparkles, Check, Lock, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  activeProfile: ChildProfile;
  onBuyItem: (item: ShopItem) => void;
  onClose: () => void;
}

export const AvatarShopModal: React.FC<Props> = ({ activeProfile, onBuyItem, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'pet' | 'ship' | 'hat'>('all');

  const filteredItems = ALL_SHOP_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handlePurchase = (item: ShopItem) => {
    if (activeProfile.unlockedCosmetics.includes(item.id)) return;

    if (activeProfile.coins >= item.cost) {
      sound.playCoin();
      confetti({ particleCount: 40, spread: 60 });
      onBuyItem(item);
    } else {
      sound.playRetry();
      sound.speak('Koinmu belum cukup. Ayo selesaikan misi belajar untuk dapat koin tambahan!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-yellow-300 shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 p-4 sm:p-5 text-amber-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/40 flex items-center justify-center text-xl shadow-xs">
              🏪
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">Toko Hadiah & Kostum Karakter</h2>
              <p className="text-xs font-bold text-amber-900">Tukarkan koin hasil belajarmu dengan item keren!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-2xl border border-amber-300 shadow-xs">
              <Coins className="w-4 h-4 text-yellow-600 fill-yellow-500" />
              <span className="font-black text-xs sm:text-sm text-yellow-950">{activeProfile.coins}</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-amber-950 font-bold flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 p-3 bg-amber-50 border-b border-amber-200 overflow-x-auto">
          {[
            { id: 'all', label: 'Semua Item' },
            { id: 'pet', label: 'Teman Hewan 🐱' },
            { id: 'ship', label: 'Kapal Layar ⛵' },
            { id: 'hat', label: 'Topi & Kostum 👑' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat.id as any);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isOwned = activeProfile.unlockedCosmetics.includes(item.id);
            const canAfford = activeProfile.coins >= item.cost;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border-2 flex items-start justify-between gap-3 transition-all ${
                  isOwned
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-amber-400 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl flex-shrink-0 shadow-2xs">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.preview || (item as any).description || 'Item Kostum Karakter'}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Coins className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                      <span className="text-xs font-bold text-slate-700">{item.cost} Koin</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isOwned ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Dimiliki
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs shadow-xs cursor-pointer transition-transform hover:scale-105 ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                      }`}
                    >
                      Beli
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
