import React from 'react';
import { Home, Map, Gamepad2, TrendingUp, User } from 'lucide-react';
import { sound } from '../services/sound';

export type MainTabType = 'home' | 'map' | 'game' | 'progress' | 'profile';

interface BottomNavigationProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const tabs = [
    { id: 'home' as MainTabType, label: 'Home', icon: Home, emoji: '🏠' },
    { id: 'map' as MainTabType, label: 'Map', icon: Map, emoji: '🗺️' },
    { id: 'game' as MainTabType, label: 'Game', icon: Gamepad2, emoji: '🎮' },
    { id: 'progress' as MainTabType, label: 'Progress', icon: TrendingUp, emoji: '📊' },
    { id: 'profile' as MainTabType, label: 'Profile', icon: User, emoji: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 sm:py-2">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onChangeTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-3 py-1 rounded-2xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-orange-600 font-black scale-105'
                  : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
            >
              {/* Active Background Pill */}
              {isActive && (
                <div className="absolute inset-0 bg-amber-100/70 rounded-2xl -z-10 border border-amber-300 shadow-2xs" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                )}
              </div>

              <span className="text-[11px] sm:text-xs mt-0.5 tracking-tight leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
