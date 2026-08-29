import React, { useState } from 'react';
import { CURRICULUM_TOPICS } from '../data/curriculumData';
import { generateQuestion } from '../services/questionEngine';
import { QuestionItem, LearningPhase } from '../types';
import { Printer, Download, RefreshCw, Eye, EyeOff, X, CheckCircle, Sparkles } from 'lucide-react';
import { sound } from '../services/sound';

interface Props {
  onClose: () => void;
}

export const WorksheetGenerator: React.FC<Props> = ({ onClose }) => {
  const [grade, setGrade] = useState<string>('SD Kelas 1');
  const [phase, setPhase] = useState<LearningPhase>(LearningPhase.FASE_A);
  const [topicId, setTopicId] = useState<string>('fa_penjumlahan_20');
  const [questionCount, setQuestionCount] = useState<number>(6);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(true);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuestionItem[]>([]);

  const handleGradeChange = (g: string) => {
    setGrade(g);
    let p = LearningPhase.FASE_A;
    let t = 'fa_penjumlahan_20';
    if (g === 'PAUD/TK') {
      p = LearningPhase.PONDASI;
      t = 'f0_bilangan_10';
    } else if (g === 'SD Kelas 3' || g === 'SD Kelas 4') {
      p = LearningPhase.FASE_B;
      t = 'fb_pecahan_senilai';
    } else if (g === 'SD Kelas 5' || g === 'SD Kelas 6') {
      p = LearningPhase.FASE_C;
      t = 'fc_pecahan_desimal';
    }
    setPhase(p);
    setTopicId(t);
  };

  const handleGenerate = () => {
    sound.playClick();
    const list: QuestionItem[] = [];
    for (let i = 0; i < questionCount; i++) {
      list.push(generateQuestion(phase, topicId, i + 1));
    }
    setGeneratedQuestions(list);
  };

  React.useEffect(() => {
    handleGenerate();
  }, [phase, topicId, questionCount]);

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const availableTopics = CURRICULUM_TOPICS.filter((t) => t.phase === phase);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-4xl w-full border-4 border-amber-200 shadow-2xl flex flex-col my-auto max-h-[95vh] overflow-hidden print:max-h-none print:border-none print:shadow-none print:w-full">
        {/* Controls Header (Hidden on Print) */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5" />
            <h2 className="text-base font-black">Generator Lembar Kerja Mandiri (Worksheet PDF/Print)</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center cursor-pointer">
            ✕
          </button>
        </div>

        {/* Toolbar (Hidden on Print) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block uppercase">Jenjang / Kelas:</label>
              <select
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-bold outline-none"
              >
                <option value="PAUD/TK">PAUD / TK (Fase Pondasi)</option>
                <option value="SD Kelas 1">SD Kelas 1 (Fase A)</option>
                <option value="SD Kelas 2">SD Kelas 2 (Fase A)</option>
                <option value="SD Kelas 3">SD Kelas 3 (Fase B)</option>
                <option value="SD Kelas 4">SD Kelas 4 (Fase B)</option>
                <option value="SD Kelas 5">SD Kelas 5 (Fase C)</option>
                <option value="SD Kelas 6">SD Kelas 6 (Fase C)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block uppercase">Topik Materi:</label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-bold outline-none max-w-[200px]"
              >
                {availableTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block uppercase">Jumlah Soal:</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-bold outline-none"
              >
                <option value={4}>4 Soal (Cepat)</option>
                <option value={6}>6 Soal (Standar)</option>
                <option value={8}>8 Soal (Lengkap)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5"
            >
              {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showAnswerKey ? 'Sembunyikan Kunci' : 'Tampilkan Kunci'}</span>
            </button>

            <button
              onClick={handleGenerate}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-slate-700 cursor-pointer"
              title="Acak Soal Baru"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs cursor-pointer shadow flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Lembar A4
            </button>
          </div>
        </div>

        {/* A4 Printable Paper Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-slate-900 font-sans print:p-0 print:overflow-visible">
          {/* Worksheet Header Header */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                KAFA MATH • LEMBAR KERJA MATEMATIKA
              </h1>
              <p className="text-xs text-slate-600 font-bold mt-0.5">
                Petualangan Matematika Nusantara • {grade} ({phase})
              </p>
            </div>
            <div className="text-right text-xs space-y-1">
              <div>
                Nama Siswa: <span className="inline-block border-b border-slate-500 w-32 ml-1"></span>
              </div>
              <div>
                Tanggal & Nilai: <span className="inline-block border-b border-slate-500 w-28 ml-1"></span>
              </div>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {generatedQuestions.map((q, idx) => (
              <div key={idx} className="border border-slate-300 rounded-2xl p-4 flex flex-col justify-between min-h-[140px] bg-slate-50/40">
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      {q.question}
                    </p>
                  </div>

                  {/* Context Story if exists */}
                  {q.contextStory && (
                    <p className="text-[11px] text-slate-500 italic pl-8 mb-2">"{q.contextStory}"</p>
                  )}
                </div>

                {/* Multiple choice options on worksheet */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200 text-xs">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full border border-slate-400 inline-block"></span>
                      <span className="font-semibold text-slate-700">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Answer Key Section */}
          {showAnswerKey && (
            <div className="mt-8 pt-4 border-t-2 border-dashed border-slate-300 text-xs">
              <h4 className="font-black text-slate-700 mb-2">🔑 Kunci Jawaban & Panduan Orang Tua:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="bg-slate-100 p-2 rounded-lg text-[11px]">
                    <strong>Soal #{idx + 1}:</strong> {q.correctAnswer}
                    <p className="text-[10px] text-slate-500 truncate">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer branding */}
          <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-medium">
            KAFA MATH • Platform Belajar Matematika Nusantara Berbasis Kurikulum Merdeka
          </div>
        </div>
      </div>
    </div>
  );
};
