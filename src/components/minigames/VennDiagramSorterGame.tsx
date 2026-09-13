import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import { ArrowRight, Volume2, Globe, CheckCircle2, RotateCcw, X, Layers, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onComplete: (score: number, stars: number) => void;
  onExit: () => void;
}

interface VennItem {
  id: string;
  label: string;
  sublabel?: string;
  emoji: string;
  correctZone: 'onlyA' | 'onlyB' | 'both' | 'outside';
}

interface VennMission {
  id: number;
  title: string;
  englishTitle: string;
  storyPrompt: string;
  englishStoryPrompt: string;
  circleALabel: string;
  englishCircleALabel: string;
  circleBLabel: string;
  englishCircleBLabel: string;
  items: VennItem[];
  cambridgeNote: string;
  englishCambridgeNote: string;
}

const MISSIONS: VennMission[] = [
  {
    id: 1,
    title: 'Misi 1: Bilangan Genap vs Kelipatan 5',
    englishTitle: 'Mission 1: Even Numbers vs Multiples of 5',
    storyPrompt: 'Kelompokkan kartu angka ke dalam Diagram Venn! Irisan tengah adalah angka yang GENAP sekaligus KELIPATAN 5 (akhiran 0).',
    englishStoryPrompt: 'Sort the number cards into the Venn Diagram! The intersection holds numbers that are BOTH Even and Multiples of 5.',
    circleALabel: 'Bilangan Genap (Even)',
    englishCircleALabel: 'Even Numbers',
    circleBLabel: 'Kelipatan 5 (Multiples of 5)',
    englishCircleBLabel: 'Multiples of 5',
    items: [
      { id: 'v1_1', label: '4', emoji: '4️⃣', correctZone: 'onlyA', sublabel: 'Genap' },
      { id: 'v1_2', label: '15', emoji: '1️⃣5️⃣', correctZone: 'onlyB', sublabel: 'Kelipatan 5' },
      { id: 'v1_3', label: '20', emoji: '2️⃣0️⃣', correctZone: 'both', sublabel: 'Genap & Kelipatan 5' },
      { id: 'v1_4', label: '30', emoji: '3️⃣0️⃣', correctZone: 'both', sublabel: 'Genap & Kelipatan 5' },
      { id: 'v1_5', label: '7', emoji: '7️⃣', correctZone: 'outside', sublabel: 'Bukan Keduanya' },
      { id: 'v1_6', label: '8', emoji: '8️⃣', correctZone: 'onlyA', sublabel: 'Genap' },
    ],
    cambridgeNote: 'Angka 20 dan 30 adalah genap DAN berakhiran 0 (kelipatan 5), sehingga diletakkan di irisan tengah (A ∩ B)!',
    englishCambridgeNote: '20 and 30 are both even and end in 0 (multiples of 5), so they belong in the overlap (A ∩ B)!',
  },
  {
    id: 2,
    title: 'Misi 2: Geometri Segiempat vs Berwarna Merah',
    englishTitle: 'Mission 2: Quadrilaterals vs Red Shapes',
    storyPrompt: 'Pisahkan bangun datar! Lingkaran kiri untuk bangun bersisi 4 (Segiempat), lingkaran kanan untuk benda berwarna merah.',
    englishStoryPrompt: 'Sort shapes! Left circle for 4-sided shapes (Quadrilaterals), right circle for Red items.',
    circleALabel: 'Segiempat (4 Sisi)',
    englishCircleALabel: 'Quadrilaterals (4 Sides)',
    circleBLabel: 'Benda Merah (Red)',
    englishCircleBLabel: 'Red Objects',
    items: [
      { id: 'v2_1', label: 'Buku Biru', emoji: '📘', correctZone: 'onlyA', sublabel: 'Segiempat (Biru)' },
      { id: 'v2_2', label: 'Apel Merah', emoji: '🍎', correctZone: 'onlyB', sublabel: 'Merah (Bulat)' },
      { id: 'v2_3', label: 'Batu Bata Merah', emoji: '🧱', correctZone: 'both', sublabel: 'Segiempat & Merah' },
      { id: 'v2_4', label: 'Hati Merah', emoji: '❤️', correctZone: 'onlyB', sublabel: 'Merah (Lengkung)' },
      { id: 'v2_5', label: 'Penggaris Segitiga Hijau', emoji: '📐', correctZone: 'outside', sublabel: '3 Sisi & Hijau' },
      { id: 'v2_6', label: 'Amplop Surat Merah', emoji: '🧧', correctZone: 'both', sublabel: 'Segiempat & Merah' },
    ],
    cambridgeNote: 'Bata merah 🧱 dan amplop merah 🧧 memiliki 4 sisi segiempat DAN berwarna merah, jadi masuk ke irisan tengah!',
    englishCambridgeNote: 'The red brick 🧱 and red envelope 🧧 have 4 sides AND are red, so they belong in the intersection!',
  },
  {
    id: 3,
    title: 'Misi 3: Habitat Hewan (Darat vs Air / Amfibi)',
    englishTitle: 'Mission 3: Animal Habitats (Land vs Water)',
    storyPrompt: 'Hewan darat di kiri, hewan air di kanan. Hewan yang bisa hidup di darat DAN air diletakkan di irisan tengah!',
    englishStoryPrompt: 'Land animals on the left, aquatic on the right. Animals that live on BOTH land and water go in the middle!',
    circleALabel: 'Hewan Darat (Land)',
    englishCircleALabel: 'Land Animals',
    circleBLabel: 'Hewan Air (Water)',
    englishCircleBLabel: 'Water Animals',
    items: [
      { id: 'v3_1', label: 'Kelinci', emoji: '🐇', correctZone: 'onlyA', sublabel: 'Darat' },
      { id: 'v3_2', label: 'Ikan Paus', emoji: '🐋', correctZone: 'onlyB', sublabel: 'Air' },
      { id: 'v3_3', label: 'Katak Hijau', emoji: '🐸', correctZone: 'both', sublabel: 'Darat & Air' },
      { id: 'v3_4', label: 'Kura-kura', emoji: '🐢', correctZone: 'both', sublabel: 'Darat & Air' },
      { id: 'v3_5', label: 'Gurita', emoji: '🐙', correctZone: 'onlyB', sublabel: 'Air' },
      { id: 'v3_6', label: 'Jerapah', emoji: '🦒', correctZone: 'onlyA', sublabel: 'Darat' },
    ],
    cambridgeNote: 'Katak 🐸 dan kura-kura 🐢 adalah amfibi/semi-akuatik yang hidup di darat dan air, letakkan di irisan tengah!',
    englishCambridgeNote: 'Frogs 🐸 and turtles 🐢 can live in water and on land, placing them in the intersection!',
  },
];

type ZoneKey = 'unassigned' | 'onlyA' | 'onlyB' | 'both' | 'outside';

export const VennDiagramSorterGame: React.FC<Props> = ({ onComplete, onExit }) => {
  const [missionIdx, setMissionIdx] = useState<number>(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemPlacements, setItemPlacements] = useState<Record<string, ZoneKey>>({});
  const [score, setScore] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isEnglish, setIsEnglish] = useState<boolean>(false);

  const mission = MISSIONS[missionIdx];

  const initMission = (idx: number = missionIdx) => {
    const m = MISSIONS[idx];
    const initial: Record<string, ZoneKey> = {};
    m.items.forEach((item) => {
      initial[item.id] = 'unassigned';
    });
    setItemPlacements(initial);
    setSelectedItemId(m.items[0]?.id || null);
    setIsSuccess(false);
    setFeedback('');

    const voice = isEnglish ? m.englishStoryPrompt : m.storyPrompt;
    sound.speak(voice);
  };

  useEffect(() => {
    initMission(missionIdx);
  }, [missionIdx, isEnglish]);

  const handleSelectItem = (id: string) => {
    if (isSuccess) return;
    sound.playClick();
    setSelectedItemId(id);
  };

  const assignItemToZone = (zone: ZoneKey) => {
    if (isSuccess || !selectedItemId) return;
    sound.playClick();

    const updated = { ...itemPlacements, [selectedItemId]: zone };
    setItemPlacements(updated);

    // Pick next unassigned item if any
    const nextUnassigned = mission.items.find((it) => it.id !== selectedItemId && updated[it.id] === 'unassigned');
    if (nextUnassigned) {
      setSelectedItemId(nextUnassigned.id);
    }

    // Check if all placed
    const allPlaced = mission.items.every((it) => updated[it.id] !== 'unassigned');
    if (allPlaced) {
      // Validate all
      const errors = mission.items.filter((it) => updated[it.id] !== it.correctZone);
      if (errors.length === 0) {
        sound.playCorrect();
        sound.playFanfare();
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
        setScore((s) => s + 40);
        setIsSuccess(true);
        const win = isEnglish
          ? 'Fantastic! All items are placed in their perfect Venn regions! A ∩ B complete! 📊✨'
          : 'Luar biasa! Semua kartu masuk ke daerah Diagram Venn dengan tepat! Irisan A ∩ B sempurna! 📊✨';
        setFeedback(win);
        sound.speak(win);
      } else {
        sound.playWrong();
        setFeedback(
          isEnglish
            ? `There are ${errors.length} item(s) in the wrong region. Review and tap to adjust!`
            : `Ada ${errors.length} kartu yang posisinya belum pas. Periksa kembali dan sentuh untuk memindahkan!`
        );
      }
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (missionIdx < MISSIONS.length - 1) {
      setMissionIdx((p) => p + 1);
    } else {
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 90 });
      onComplete(score + 50, 3);
    }
  };

  const getItemsInZone = (zone: ZoneKey) => {
    return mission.items.filter((it) => itemPlacements[it.id] === zone);
  };

  const activeItem = mission.items.find((it) => it.id === selectedItemId);

  return (
    <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-indigo-400 shadow-2xl overflow-hidden flex flex-col">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg leading-tight">
                {isEnglish ? mission.englishTitle : mission.title}
              </h2>
              <span className="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Misi {missionIdx + 1}/{MISSIONS.length}
              </span>
            </div>
            <p className="text-xs text-indigo-100 font-semibold">
              {isEnglish ? 'Cambridge Venn Diagram & Set Sorting' : 'Studio Diagram Venn & Himpunan (Cambridge Primary)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setIsEnglish(!isEnglish);
            }}
            className="px-2.5 py-1 rounded-xl bg-white/25 hover:bg-white/35 text-xs font-black flex items-center gap-1 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isEnglish ? '🇬🇧 EN' : '🇮🇩 ID'}</span>
          </button>

          <button
            onClick={onExit}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Mission Context */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="bg-indigo-50 rounded-2xl p-3.5 border-2 border-indigo-200 flex items-center justify-between gap-3 shadow-xs">
          <div>
            <span className="text-xs font-black text-indigo-950 uppercase tracking-wide">
              {isEnglish ? 'Sorting Mission Rules:' : 'Aturan Pengelompokan Himpunan:'}
            </span>
            <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1 leading-snug">
              {isEnglish ? mission.englishStoryPrompt : mission.storyPrompt}
            </p>
          </div>

          <button
            onClick={() => sound.speak(isEnglish ? mission.englishStoryPrompt : mission.storyPrompt)}
            className="p-2 rounded-xl bg-indigo-200/80 hover:bg-indigo-300 text-indigo-900 flex-shrink-0 cursor-pointer transition-transform active:scale-90"
            title="Dengarkan Suara"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3. The Visual Venn Diagram Stage */}
        <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-3 sm:p-5 border-2 border-indigo-400 shadow-xl relative min-h-[300px] flex flex-col justify-between overflow-hidden">
          {/* Top Title Badges for Circle A & Circle B */}
          <div className="flex items-center justify-between z-20 px-2">
            <div className="bg-blue-600/90 text-white px-3 py-1 rounded-xl text-xs font-black border border-blue-400 shadow-md">
              🔵 Lingkaran A: {isEnglish ? mission.englishCircleALabel : mission.circleALabel}
            </div>
            <div className="bg-purple-600/90 text-white px-3 py-1 rounded-xl text-xs font-black border border-purple-400 shadow-md">
              🔴 Lingkaran B: {isEnglish ? mission.englishCircleBLabel : mission.circleBLabel}
            </div>
          </div>

          {/* Venn Diagram Visual Circles (Overlapping Area) */}
          <div className="relative w-full h-[180px] sm:h-[200px] my-2 flex items-center justify-center">
            {/* Circle A (Left) */}
            <div
              onClick={() => assignItemToZone('onlyA')}
              className="absolute left-[8%] sm:left-[12%] w-[54%] h-[170px] sm:h-[190px] rounded-full border-4 border-blue-400 bg-blue-500/20 hover:bg-blue-500/30 cursor-pointer transition-all flex flex-col items-start justify-center p-3 z-10"
              title="Sentuh untuk menaruh ke Lingkaran A saja"
            >
              <span className="text-[10px] font-black text-blue-300 uppercase -mt-8 ml-2">Hanya A</span>
              <div className="flex flex-wrap gap-1 mt-1 max-w-[100px]">
                {getItemsInZone('onlyA').map((it) => (
                  <div
                    key={it.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectItem(it.id);
                    }}
                    className={`p-1.5 rounded-xl bg-blue-700/90 border text-white flex items-center gap-1 shadow-md cursor-pointer hover:scale-110 active:scale-95 ${
                      selectedItemId === it.id ? 'ring-2 ring-yellow-400 border-yellow-300' : 'border-blue-400'
                    }`}
                  >
                    <span className="text-base">{it.emoji}</span>
                    <span className="text-[10px] font-black">{it.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overlap / Intersection (Both A & B) Center */}
            <div
              onClick={() => assignItemToZone('both')}
              className="absolute w-[28%] sm:w-[26%] h-[140px] sm:h-[150px] rounded-full bg-violet-600/40 hover:bg-violet-600/60 border-2 border-dashed border-violet-300 cursor-pointer transition-all z-20 flex flex-col items-center justify-center p-1"
              title="Sentuh untuk menaruh ke Irisan A ∩ B"
            >
              <span className="text-[9px] font-black text-violet-200 uppercase text-center">Irisan A ∩ B (Keduanya)</span>
              <div className="flex flex-wrap items-center justify-center gap-1 mt-1">
                {getItemsInZone('both').map((it) => (
                  <div
                    key={it.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectItem(it.id);
                    }}
                    className={`p-1.5 rounded-xl bg-violet-800/90 border text-white flex items-center gap-1 shadow-md cursor-pointer hover:scale-110 active:scale-95 ${
                      selectedItemId === it.id ? 'ring-2 ring-yellow-400 border-yellow-300' : 'border-violet-400'
                    }`}
                  >
                    <span className="text-base">{it.emoji}</span>
                    <span className="text-[10px] font-black">{it.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Circle B (Right) */}
            <div
              onClick={() => assignItemToZone('onlyB')}
              className="absolute right-[8%] sm:right-[12%] w-[54%] h-[170px] sm:h-[190px] rounded-full border-4 border-purple-400 bg-purple-500/20 hover:bg-purple-500/30 cursor-pointer transition-all flex flex-col items-end justify-center p-3 z-10"
              title="Sentuh untuk menaruh ke Lingkaran B saja"
            >
              <span className="text-[10px] font-black text-purple-300 uppercase -mt-8 mr-2">Hanya B</span>
              <div className="flex flex-wrap justify-end gap-1 mt-1 max-w-[100px]">
                {getItemsInZone('onlyB').map((it) => (
                  <div
                    key={it.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectItem(it.id);
                    }}
                    className={`p-1.5 rounded-xl bg-purple-700/90 border text-white flex items-center gap-1 shadow-md cursor-pointer hover:scale-110 active:scale-95 ${
                      selectedItemId === it.id ? 'ring-2 ring-yellow-400 border-yellow-300' : 'border-purple-400'
                    }`}
                  >
                    <span className="text-base">{it.emoji}</span>
                    <span className="text-[10px] font-black">{it.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Outside Region (Bukan Keduanya) */}
          <div
            onClick={() => assignItemToZone('outside')}
            className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-600 rounded-2xl p-2 cursor-pointer transition-colors z-20 flex items-center justify-between"
            title="Sentuh untuk menaruh di Luar Lingkaran (Bukan A ataupun B)"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-700 px-2 py-0.5 rounded-lg">
                Di Luar (Bukan A & Bukan B)
              </span>
              <span className="text-[10px] text-slate-300">Sentuh baris ini jika tidak cocok di kedua lingkaran</span>
            </div>
            <div className="flex items-center gap-1">
              {getItemsInZone('outside').map((it) => (
                <div
                  key={it.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectItem(it.id);
                  }}
                  className={`p-1 rounded-lg bg-slate-700 border text-white flex items-center gap-1 cursor-pointer hover:scale-110 ${
                    selectedItemId === it.id ? 'ring-2 ring-yellow-400 border-yellow-300' : 'border-slate-500'
                  }`}
                >
                  <span className="text-sm">{it.emoji}</span>
                  <span className="text-[10px] font-bold">{it.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Active Card Tray & Quick Region Buttons */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-slate-700">
            <span>Pilih Kartu yang Ingin Dikelompokkan:</span>
            {activeItem && (
              <span className="text-indigo-600 font-black">
                Aktif: {activeItem.emoji} {activeItem.label}
              </span>
            )}
          </div>

          {/* Cards to sort */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {mission.items.map((it) => {
              const currentZone = itemPlacements[it.id];
              const isSelected = selectedItemId === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => handleSelectItem(it.id)}
                  className={`p-2 rounded-2xl border-2 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                    isSelected
                      ? 'bg-amber-100 border-amber-500 scale-105 shadow-md'
                      : currentZone === 'unassigned'
                      ? 'bg-white border-indigo-200 hover:border-indigo-400'
                      : 'bg-slate-100 border-slate-300 opacity-70'
                  }`}
                >
                  <span className="text-2xl">{it.emoji}</span>
                  <div className="text-left">
                    <div className="text-xs font-black text-slate-800 leading-tight">{it.label}</div>
                    <div className="text-[9px] font-bold text-slate-500">
                      {currentZone === 'unassigned' ? 'Belum ditaruh' : `Posisi: ${currentZone}`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Zone Placement Buttons for Active Card */}
          {activeItem && (
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 block mb-1 text-center">
                Letakkan <strong>{activeItem.label}</strong> ke dalam daerah:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => assignItemToZone('onlyA')}
                  className="py-2 px-2 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-black text-xs cursor-pointer shadow-xs"
                >
                  🔵 Hanya Lingkaran A
                </button>
                <button
                  onClick={() => assignItemToZone('both')}
                  className="py-2 px-2 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-black text-xs cursor-pointer shadow-xs"
                >
                  🟣 Irisan A ∩ B (Keduanya)
                </button>
                <button
                  onClick={() => assignItemToZone('onlyB')}
                  className="py-2 px-2 rounded-xl bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-black text-xs cursor-pointer shadow-xs"
                >
                  🔴 Hanya Lingkaran B
                </button>
                <button
                  onClick={() => assignItemToZone('outside')}
                  className="py-2 px-2 rounded-xl bg-slate-600 hover:bg-slate-700 active:scale-95 text-white font-black text-xs cursor-pointer shadow-xs"
                >
                  ⚪ Di Luar Lingkaran
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-indigo-50 border-indigo-300 text-indigo-900'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Layers className="w-5 h-5 text-indigo-600" />}
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* 5. Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
        <button
          onClick={() => initMission()}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEnglish ? 'Reset Sorting' : 'Ulang Kartu'}</span>
        </button>

        {!isSuccess ? (
          <div className="text-xs font-bold text-slate-500 italic">
            💡 {isEnglish ? mission.englishCambridgeNote : mission.cambridgeNote}
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95 animate-bounce"
          >
            <span>{missionIdx < MISSIONS.length - 1 ? (isEnglish ? 'Next Venn Mission' : 'Misi Venn Berikutnya') : (isEnglish ? 'Set Logic Master!' : 'Selesai & Ambil Bintang!')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
