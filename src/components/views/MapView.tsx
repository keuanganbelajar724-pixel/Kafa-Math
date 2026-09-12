import React, { useState } from 'react';
import { ChildProfile, WorldArea, MapNode } from '../../types';
import { WORLDS_DATA } from '../../data/worldsData';
import { sound } from '../../services/sound';
import {
  Compass,
  Star,
  Lock,
  Play,
  Trophy,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Shield,
  Crown,
} from 'lucide-react';

interface MapViewProps {
  activeProfile: ChildProfile;
  onSelectNode: (node: MapNode) => void;
}

export const MapView: React.FC<MapViewProps> = ({ activeProfile, onSelectNode }) => {
  const [selectedWorldId, setSelectedWorldId] = useState<string>(WORLDS_DATA[0].id);

  const currentWorld = WORLDS_DATA.find((w) => w.id === selectedWorldId) || WORLDS_DATA[0];

  // Helper to determine node status based on child's completedNodes
  const getNodeStatus = (node: MapNode, index: number, allNodes: MapNode[]) => {
    if (activeProfile.completedNodes.includes(node.id)) {
      return 'completed';
    }
    // If it's the very first node of the world, or previous node is completed
    if (index === 0) return 'available';
    const prevNode = allNodes[index - 1];
    if (prevNode && activeProfile.completedNodes.includes(prevNode.id)) {
      return 'available';
    }
    return 'locked';
  };

  // Find the active position of KAFA
  const activeNodeIndex = currentWorld.nodes.findIndex((node, idx) => {
    const status = getNodeStatus(node, idx, currentWorld.nodes);
    return status === 'available';
  });

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border-3 border-white/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide border border-white/30 flex items-center gap-1.5 w-fit">
              <Compass className="w-3.5 h-3.5 text-yellow-300" />
              PETA PETUALANGAN NUSANTARA • KAFA MATH
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Jelajahi Dunia & Kumpulkan Bintang! 🗺️
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 font-semibold max-w-xl">
              Pilih pulau impianmu, taklukkan pos tantangan bertingkat dari Level 1 hingga Boss Monster!
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 flex items-center gap-4 self-start md:self-auto">
            <div className="text-center">
              <span className="text-[10px] uppercase font-black text-teal-200 block">Pos Selesai</span>
              <span className="text-xl font-black text-white">
                {activeProfile.completedNodes.length} Pos
              </span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-black text-teal-200 block">Bintang</span>
              <span className="text-xl font-black text-yellow-300 flex items-center gap-1">
                ⭐ {activeProfile.completedNodes.length * 3}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. World Archipelago Selector Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {WORLDS_DATA.map((world) => {
          const isSelected = world.id === selectedWorldId;
          const completedInThisWorld = world.nodes.filter((n) =>
            activeProfile.completedNodes.includes(n.id)
          ).length;

          return (
            <button
              key={world.id}
              onClick={() => {
                sound.playClick();
                setSelectedWorldId(world.id);
              }}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-2 flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-600 shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
              }`}
            >
              <span className="text-2xl">{world.icon}</span>
              <div className="text-left">
                <span className="block leading-tight">{world.name}</span>
                <span
                  className={`text-[10px] font-bold ${
                    isSelected ? 'text-amber-100' : 'text-slate-400'
                  }`}
                >
                  {completedInThisWorld} / {world.nodes.length} Pos Selesai
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. The Active World Adventure Map Area */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-md space-y-6">
        {/* World Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-sm">
              {currentWorld.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-800">{currentWorld.name}</h2>
                <span className="text-xs bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full">
                  {currentWorld.regionName}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{currentWorld.description}</p>
            </div>
          </div>
        </div>

        {/* Sequential Path Visualization (START -> LEVEL 1 -> LEVEL 2 -> ... -> BOSS CHALLENGE) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-orange-600 tracking-wider">
            <Sparkles className="w-4 h-4" /> Alur Pos Perjalanan:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentWorld.nodes.map((node, idx) => {
              const status = getNodeStatus(node, idx, currentWorld.nodes);
              const isCurrentActive = idx === (activeNodeIndex === -1 ? 0 : activeNodeIndex);
              const isCompleted = status === 'completed';
              const isLocked = status === 'locked';
              const isBoss = node.type === 'boss';

              let cardBg = 'bg-white border-2 border-slate-200';
              let badgeBg = 'bg-slate-100 text-slate-700';

              if (isCompleted) {
                cardBg = 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 shadow-2xs';
                badgeBg = 'bg-emerald-500 text-white';
              } else if (isCurrentActive) {
                cardBg = 'bg-gradient-to-br from-amber-50 to-orange-50 border-3 border-orange-500 shadow-lg ring-4 ring-orange-200/60';
                badgeBg = 'bg-orange-500 text-white animate-pulse';
              } else if (isBoss) {
                cardBg = 'bg-gradient-to-br from-purple-50 to-rose-50 border-2 border-purple-300';
                badgeBg = 'bg-purple-600 text-white';
              }

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    if (isLocked) {
                      sound.playClick();
                      sound.speak('Pos ini masih terkunci. Selesaikan pos sebelumnya terlebih dahulu ya!');
                    } else {
                      sound.playClick();
                      onSelectNode(node);
                    }
                  }}
                  className={`rounded-3xl p-5 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${cardBg} ${
                    isLocked ? 'opacity-70 grayscale-30' : 'hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {/* Top indicators */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-xl uppercase flex items-center gap-1 ${badgeBg}`}>
                      {isBoss ? <Crown className="w-3.5 h-3.5" /> : null}
                      {idx === 0 ? 'Pos Awal' : isBoss ? '👑 Boss Tantangan' : `Pos Level ${idx + 1}`}
                    </span>

                    {/* Status Badge */}
                    <div>
                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-black text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>⭐⭐⭐</span>
                        </div>
                      ) : isLocked ? (
                        <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                          <Lock className="w-4 h-4" />
                          <span>Terkunci</span>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-lg animate-bounce">
                          📍 Pos Kamu
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Node Title & Subtitle */}
                  <div className="my-1">
                    <h3 className="font-black text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                      {node.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      {node.subtitle}
                    </p>
                  </div>

                  {/* Character marker for currently active node */}
                  {isCurrentActive && (
                    <div className="my-2 p-2 rounded-2xl bg-orange-100 border border-orange-300 flex items-center gap-2">
                      <span className="text-2xl animate-bounce">🦊🧭</span>
                      <span className="text-[11px] font-black text-orange-950">
                        KAFA sedang berada di sini! Siap bertualang?
                      </span>
                    </div>
                  )}

                  {/* Rewards & Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-600">
                      <span className="text-orange-600 font-black">+{node.xpReward} XP</span>
                      <span className="text-amber-600 font-black">+{node.coinReward} 🪙</span>
                    </div>

                    <button
                      disabled={isLocked}
                      className={`px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1 transition-all ${
                        isLocked
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : isCompleted
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                      }`}
                    >
                      {isLocked ? (
                        'Terkunci'
                      ) : isCompleted ? (
                        'Main Ulang'
                      ) : (
                        <>
                          <span>Mulai</span>
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
