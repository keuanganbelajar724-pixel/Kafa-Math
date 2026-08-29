import React from 'react';
import { sound } from '../services/sound';
import { Sparkles, Sun, HeartHandshake, ArrowRight } from 'lucide-react';

interface Props {
  childName: string;
  minutesSpent: number;
  onDismiss: () => void;
}

export const ScreenTimeAlert: React.FC<Props> = ({ childName, minutesSpent, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center border-4 border-amber-400 shadow-2xl animate-in zoom-in-95">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
          🌟
        </div>

        <h3 className="text-2xl font-black text-slate-800">Hebat Sekali, {childName}! 🎉</h3>
        <p className="text-sm font-bold text-orange-600 mt-1">
          Waktu belajar hari ini ({minutesSpent} menit) sudah tercapai dengan sangat baik!
        </p>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl my-4 text-left text-xs text-amber-950 space-y-2">
          <p className="font-bold flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-600" />
            <span>Saran dari Kaka & Orang Tua:</span>
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            <li>Istirahatkan matamu sejenak dan minum segelas air putih. 💧</li>
            <li>Bermain di luar rumah atau bercerita dengan Ayah & Ibu. 🏡</li>
            <li>Sampai jumpa di petualangan matematika besok hari! 🚀</li>
          </ul>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onDismiss();
          }}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105"
        >
          Baik, Kaka! Saya Istirahat Dulu 🌈
        </button>
      </div>
    </div>
  );
};
