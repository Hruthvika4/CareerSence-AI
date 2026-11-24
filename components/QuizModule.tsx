
import React, { useState } from 'react';
import { DUMMY_QUIZ } from '../constants';

const QuizModule: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = DUMMY_QUIZ[currentIdx];

  const handleNext = () => {
    setSelectedAns(null);
    setShowExplanation(false);
    setCurrentIdx((prev) => (prev + 1) % DUMMY_QUIZ.length);
  };

  return (
    <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-2xl font-extrabold text-[#1A202E]">Daily Skill Challenge 🧠</h4>
          <p className="text-slate-400 font-medium">Test your knowledge on the go</p>
        </div>
        <span className="px-4 py-1 bg-blue-50 text-[#5E72E4] rounded-full text-xs font-black uppercase tracking-widest">
          {question.skill}
        </span>
      </div>

      <div className="space-y-6">
        <p className="text-xl font-bold text-[#1A202E] leading-snug">{question.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={showExplanation}
              onClick={() => {
                setSelectedAns(idx);
                setShowExplanation(true);
              }}
              className={`p-5 rounded-[24px] text-left border-2 transition-all font-bold ${
                showExplanation 
                  ? idx === question.correctIndex 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : selectedAns === idx 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-slate-50 opacity-50'
                  : 'border-slate-50 bg-slate-50/30 hover:border-[#5E72E4]/30'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="p-6 bg-blue-50/50 rounded-[24px] border border-blue-100 animate-in slide-in-from-top-2">
          <p className="text-sm font-bold text-[#5E72E4] mb-1 italic">Did you know?</p>
          <p className="text-slate-600 font-medium">{question.explanation}</p>
          <button 
            onClick={handleNext}
            className="mt-4 px-8 py-3 bg-[#1A202E] text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform"
          >
            Next Challenge
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizModule;
