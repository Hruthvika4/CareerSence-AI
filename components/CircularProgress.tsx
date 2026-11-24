
import React from 'react';

interface CircularProgressProps {
  percentage: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (p: number) => {
    if (p >= 80) return '#4f46e5'; // Indigo
    if (p >= 60) return '#7c3aed'; // Violet
    return '#f59e0b'; // Amber
  };

  return (
    <div className="relative flex items-center justify-center w-56 h-56">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="112" cy="112" r={radius} stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
        <circle
          cx="112" cy="112" r={radius}
          stroke={getColor(percentage)}
          strokeWidth="12" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <div className="flex items-baseline">
          <span className="text-6xl font-black text-slate-900 tracking-tighter">{percentage}</span>
          <span className="text-xl font-bold text-slate-400 ml-1">%</span>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Correlation</span>
      </div>
    </div>
  );
};

export default CircularProgress;
