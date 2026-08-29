import React, { useState } from 'react';
import { WorldArea, MapNode, ChildProfile } from '../types';
import { WORLDS_DATA } from '../data/worldsData';
import { sound } from '../services/sound';
import { Compass, Lock, Play, Star, Skull, Sparkles, MapPin, Volume2 } from 'lucide-react';

interface Props {
  activeProfile: ChildProfile;
  onSelectNode: (node: MapNode) => void;
}

export const AdventureMap: React.FC<Props> = ({ activeProfile, onSelectNode }) => {
  const [selectedWorldId, setSelectedWorldId] = useState<string>(WORLDS_DATA[0].id);

  const selectedWorld = WORLDS_DATA.find((w) => w.id === selectedWorldId) || WORLDS_DATA[0];

  const handleWorldChange = (world: WorldArea) => {
    sound.playClick();
    setSelectedWorldId(world.id);
    sound.speak(`Selamat datang di ${world.name}, wilayah ${world.regionName}! ${world.description}`);
  };

  return (
    <div className="space-y-4">
      {/* World Region Selector Pills */}
      <div className="bg-white/90 backdrop-blur p-3 rounded-3xl border border-amber-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2 px-2">
          <Compass className="w-5 h-5 text-orange-500" />
          <h2 className="text-sm font-black text-slate-800 tracking-wide uppercase">
            Peta Petualangan Nusantara (8 Wilayah)
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {WORLDS_DATA.map((w) => {
            const isSelected = w.id === selectedWorldId;
            return (
              <button
                key={w.id}
                onClick={() => handleWorldChange(w)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-[1.02]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span className="text-base">{w.icon}</span>
                <div className="text-left leading-tight">
                  <span className="block">{w.name}</span>
                  <span className="text-[10px] opacity-80">{w.regionName}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* World Map Stage Canvas */}
      <div className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${selectedWorld.bgGradient} text-white shadow-xl relative overflow-hidden min-h-[440px] flex flex-col justify-between border-4 border-white/20`}>
        {/* Animated Background Island Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-black" />

        {/* World Header Info */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{selectedWorld.icon}</span>
              <div>
                <h3 className="text-xl md:text-2xl font-black">{selectedWorld.name}</h3>
                <p className="text-xs text-amber-200 font-semibold">{selectedWorld.tagline} • {selectedWorld.regionName}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => sound.speak(selectedWorld.description)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl cursor-pointer self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold"
          >
            <Volume2 className="w-4 h-4" /> Narasi Wilayah
          </button>
        </div>

        {/* Nodes Progression Path Container */}
        <div className="relative my-10 py-6 min-h-[220px]">
          {/* Connecting SVG Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <path
              d="M 60 120 Q 200 40, 360 140 T 700 80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="4"
              strokeDasharray="8,8"
            />
          </svg>

          {/* Node Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 relative z-10 justify-items-center">
            {selectedWorld.nodes.map((node, index) => {
              const isCompleted = activeProfile.completedNodes.includes(node.id);
              const isBoss = node.type === 'boss';

              return (
                <div key={node.id} className="flex flex-col items-center group">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectNode(node);
                    }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex flex-col items-center justify-center shadow-lg transition-all duration-300 transform group-hover:scale-110 active:scale-95 cursor-pointer relative border-4 ${
                      isBoss
                        ? 'bg-gradient-to-tr from-purple-700 to-rose-600 border-amber-400 text-white animate-pulse'
                        : isCompleted
                        ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 border-white text-white'
                        : 'bg-gradient-to-tr from-amber-400 to-orange-500 border-white text-white'
                    }`}
                  >
                    {/* Node Icon */}
                    {isBoss ? (
                      <Skull className="w-8 h-8 text-amber-300" />
                    ) : isCompleted ? (
                      <Star className="w-8 h-8 fill-amber-300 text-amber-200" />
                    ) : (
                      <Play className="w-7 h-7 fill-white ml-0.5" />
                    )}

                    {/* Step badge */}
                    <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                      {index + 1}
                    </span>
                  </button>

                  {/* Node Label */}
                  <div className="mt-2.5 text-center max-w-[130px] bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-white/10">
                    <p className="text-xs font-bold text-white truncate">{node.title}</p>
                    <p className="text-[10px] text-amber-200 truncate">{node.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ship Navigator Card */}
        <div className="relative z-10 bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⛵</span>
            <div>
              <span className="text-xs font-bold text-amber-200 block">Kapal Penjelajah:</span>
              <span className="text-sm font-black text-white">{activeProfile.name} • Siap Berlayar</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-400/90 text-emerald-950 font-bold px-3 py-1 rounded-full">
              {activeProfile.completedNodes.length} Pos Selesai
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
