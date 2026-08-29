import React, { useState, useEffect } from 'react';
import { QuestionItem } from '../types';
import { sound } from '../services/sound';
import { Bot, Volume2, Send, Sparkles, X, Lightbulb, MessageSquare } from 'lucide-react';

interface Props {
  childName: string;
  ageGrade: string;
  currentQuestion?: QuestionItem | null;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export const AITutorModal: React.FC<Props> = ({ childName, ageGrade, currentQuestion, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const initialGreeting = `Halo ${childName}! 👋 Aku Kaka, teman petualangan matematikamu. Ada bagian yang membingungkan dari soal ini? Yuk kita bedah bersama-sama! 🌟`;
    setMessages([
      {
        id: 'msg_init',
        sender: 'ai',
        text: initialGreeting,
      },
    ]);
    sound.speak(initialGreeting);
  }, [childName]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    sound.playClick();
    const userMsg: Message = { id: `user_${Date.now()}`, sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName,
          ageGrade,
          topic: currentQuestion?.topicTitle || 'Matematika Umum',
          currentQuestion: currentQuestion?.question || '',
          userMessage: textToSend,
        }),
      });

      const data = await res.json();
      const aiResponse = data.text || 'Yuk kita coba hitung pelan-pelan bersama Kaka!';

      const aiMsg: Message = { id: `ai_${Date.now()}`, sender: 'ai', text: aiResponse };
      setMessages((prev) => [...prev, aiMsg]);
      sound.speak(aiResponse);
    } catch (e) {
      const fallback = `Wah, coba kita bayangkan dengan contoh mudah yuk! Kalau kamu punya 2 kue onde-onde, lalu diberi 3 lagi, jadi berapa?`;
      setMessages((prev) => [...prev, { id: `ai_fallback_${Date.now()}`, sender: 'ai', text: fallback }]);
      sound.speak(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-indigo-400 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[85vh] h-[580px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl border border-white/40 shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base">Kaka AI Tutor</h3>
                <span className="text-[10px] bg-indigo-300 text-indigo-950 font-bold px-2 py-0.5 rounded-full">
                  Ramah Anak
                </span>
              </div>
              <p className="text-xs text-indigo-100 font-medium">Bimbingan Sokratik & Analogi Nyata</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Current Question Context Badge if active */}
        {currentQuestion && (
          <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
            <span className="truncate">
              <strong>Soal:</strong> {currentQuestion.question}
            </span>
          </div>
        )}

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((m) => {
            const isAI = m.sender === 'ai';
            return (
              <div key={m.id} className={`flex gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}>
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 text-base shadow-xs">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed relative ${
                    isAI
                      ? 'bg-white text-slate-800 border border-indigo-100 shadow-sm rounded-tl-none'
                      : 'bg-indigo-600 text-white shadow-sm rounded-tr-none'
                  }`}
                >
                  <p>{m.text}</p>
                  {isAI && (
                    <button
                      onClick={() => sound.speak(m.text)}
                      className="mt-2 text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Dengarkan
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-slate-500 font-bold italic animate-pulse">
              <div className="w-7 h-7 rounded-xl bg-indigo-200 flex items-center justify-center">🤖</div>
              <span>Kaka sedang menyiapkan petunjuk...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto">
          {[
            'Beri contoh dengan benda',
            'Bagaimana langkah pertamanya?',
            'Kenapa bisa begitu?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt)}
              className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold px-3 py-1.5 rounded-xl border border-indigo-200 flex-shrink-0 cursor-pointer whitespace-nowrap"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputVal)}
            placeholder="Ketik pertanyaan untuk Kaka di sini..."
            className="flex-1 px-4 py-2.5 bg-slate-100 rounded-2xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-400 border border-slate-200"
          />
          <button
            onClick={() => sendMessage(inputVal)}
            disabled={!inputVal.trim() || isLoading}
            className="w-10 h-10 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 text-white rounded-2xl flex items-center justify-center cursor-pointer transition-transform active:scale-95 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
