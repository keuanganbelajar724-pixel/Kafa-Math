import React, { useState } from 'react';
import { GeneratedMathQuestion } from '../../types';
import { Printer, X, CheckSquare, Square, Download } from 'lucide-react';
import { VerticalMathCard } from './VerticalMathCard';

interface PrintableWorksheetModalProps {
  questions: GeneratedMathQuestion[];
  topicTitle: string;
  gradeLabel: string;
  pageNumber: number;
  childName: string;
  onClose: () => void;
}

export const PrintableWorksheetModal: React.FC<PrintableWorksheetModalProps> = ({
  questions,
  topicTitle,
  gradeLabel,
  pageNumber,
  childName,
  onClose,
}) => {
  const [includeAnswers, setIncludeAnswers] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      {/* Container */}
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border-3 border-amber-300 shadow-2xl relative my-auto">
        {/* Controls Bar (Hidden during actual print) */}
        <div className="print:hidden flex flex-col sm:flex-row items-center justify-between pb-5 mb-5 border-b border-slate-200 gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
              <Printer className="w-5 h-5 text-orange-600" />
              <span>Pratinjau Cetak / PDF Lembar Kerja</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Siap dicetak untuk latihan mandiri anak di kertas
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIncludeAnswers(!includeAnswers)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 cursor-pointer text-slate-700"
            >
              {includeAnswers ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Sertakan Kunci Jawaban</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE PAGE CONTENT (Designed for A4 Paper print styling) */}
        <div id="printable-worksheet" className="p-4 sm:p-8 bg-white border border-slate-200 rounded-2xl print:border-none print:p-0">
          {/* Official Worksheet Header */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  KAFA MATH • LEMBAR KERJA SISWA
                </h1>
                <p className="text-xs font-bold text-slate-600">
                  Topik: {topicTitle} | Tingkat: {gradeLabel} | Halaman {pageNumber}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block">KODE:</span>
                <span className="font-mono text-xs font-black text-slate-800">
                  KAFA-{pageNumber.toString().padStart(3, '0')}
                </span>
              </div>
            </div>

            {/* Student metadata grid on paper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200 text-xs font-medium text-slate-800">
              <div>
                <span className="text-slate-500 font-bold block">Nama Siswa:</span>
                <span className="border-b border-dotted border-slate-400 block pb-1 font-bold">
                  {childName || '...........................................'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Kelas:</span>
                <span className="border-b border-dotted border-slate-400 block pb-1 font-bold">
                  {gradeLabel || '...........................................'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Tanggal:</span>
                <span className="border-b border-dotted border-slate-400 block pb-1 font-bold">
                  {new Date().toLocaleDateString('id-ID')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Nilai / Paraf:</span>
                <span className="border-b border-dotted border-slate-400 block pb-1 font-bold">
                  ....... / 100
                </span>
              </div>
            </div>
          </div>

          {/* 10 Questions Grid Layout for Paper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-3 border border-slate-300 rounded-xl flex flex-col justify-between min-h-[140px] break-inside-avoid"
              >
                <div>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="font-black text-slate-800">Soal #{idx + 1}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{q.subCategory}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-snug mt-1">
                    {q.question}
                  </p>

                  {q.verticalFormat && (
                    <div className="flex justify-center my-1 scale-90">
                      <VerticalMathCard data={q.verticalFormat} />
                    </div>
                  )}
                </div>

                {/* Answer Workspace Box for Student Writing */}
                <div className="mt-3 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-xs">
                  <span className="text-slate-400 italic">Ruang Coretan / Jawaban:</span>
                  <div className="w-24 h-8 border-2 border-slate-400 rounded-lg flex items-center px-2 font-bold text-sm">
                    {includeAnswers && (
                      <span className="text-emerald-700 font-black">{q.answer}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Answer Key Page (Optional) */}
          {includeAnswers && (
            <div className="mt-8 pt-6 border-t-2 border-slate-800 break-before-page">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">
                🔑 Kunci Jawaban & Penjelasan Singkat
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-black text-slate-700">#{idx + 1}: </span>
                    <span className="font-black text-emerald-700">{q.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Print Footer */}
          <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Dicetak melalui KAFA MATH • "Berlatih Matematika Jadi Lebih Seru"
          </div>
        </div>
      </div>
    </div>
  );
};
