import React from 'react';
import { VerticalMathFormat } from '../../types';

interface VerticalMathCardProps {
  data: VerticalMathFormat;
}

export const VerticalMathCard: React.FC<VerticalMathCardProps> = ({ data }) => {
  const { operand1, operand2, operator } = data;

  return (
    <div className="inline-block bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-3 sm:p-4 my-1 select-none font-mono">
      <div className="flex flex-col items-end text-2xl sm:text-3xl font-black text-slate-800 tracking-wider">
        {/* Top Operand */}
        <div className="px-2 leading-tight">{operand1}</div>

        {/* Bottom Operand with Operator */}
        <div className="flex items-center justify-between w-full border-b-3 border-slate-800 px-2 leading-tight mt-0.5">
          <span className="text-xl sm:text-2xl text-orange-600 font-sans font-bold pr-3">
            {operator}
          </span>
          <span>{operand2}</span>
        </div>
      </div>
    </div>
  );
};
