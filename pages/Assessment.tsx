
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateQuiz } from '../geminiService';
import { AppState, QuizQuestion } from '../types';
import { DUMMY_QUIZ } from '../constants';
import { Icons } from '../components/Icons';

interface AssessmentProps {
  state: AppState;
  setQuizData: (quiz: QuizQuestion[]) => void;
  updateAnswers: (id: number, answer: number) => void;
}

const Assessment: React.FC<AssessmentProps> = ({ state, setQuizData, updateAnswers }) => {
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Clear dummy data if we have an active analysis but no quiz yet
  const needsQuiz = state.analysis && (state.quiz.length === 0 || state.quiz[0].skill === "JavaScript" && state.quiz.length === 2);

  const startAssessment = async () => {
    setLoading(true);
    try {
      const matched = state.analysis?.matchedSkills || [];
      const gaps = state.analysis?.skillGaps || [];
      const jobDesc = state.jobText;

      const quiz = await generateQuiz(matched, gaps, jobDesc);
      setQuizData(quiz.length > 0 ? quiz : DUMMY_QUIZ);
      setCurrentIdx(0); 
      setShowResults(false);
    } catch (err) { 
      setQuizData(DUMMY_QUIZ); 
    }
    finally { setLoading(false); }
  };

  const currentQuestion = state.quiz[currentIdx];
  const totalQuestions = state.quiz.length;
  const score = state.quiz.reduce((acc, q) => state.quizAnswers[q.id] === q.correctIndex ? acc + 1 : acc, 0);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-10">
      <div className="relative">
        <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-black">AI</div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900">Customizing Assessment</h2>
        <p className="text-slate-400 font-bold max-w-sm mx-auto">Gemini is analyzing the Job Description to build your personalized technical test...</p>
      </div>
    </div>
  );

  if (state.quiz.length === 0 || needsQuiz) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center space-y-10 mt-20">
        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-[32px] mx-auto shadow-inner"><Icons.Assessment size={48} /></div>
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">Verify Skill Readiness</h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">
            {state.analysis 
              ? `We've prepared 10 questions to verify your fit for the role. Ready to begin?` 
              : "Analyze a resume and job description on the dashboard to unlock a personalized assessment."}
          </p>
        </div>
        {state.analysis ? (
          <button onClick={startAssessment} className="px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black text-xl hover:bg-black transition-all shadow-2xl active:scale-95">
            Start Personalized Quiz
          </button>
        ) : (
          <Link to="/dashboard" className="inline-block px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-xl hover:bg-indigo-700 transition-all">
            Go to Dashboard
          </Link>
        )}
      </div>
    );
  }

  if (showResults) {
    const accuracy = Math.round((score / totalQuestions) * 100);
    return (
      <div className="max-w-4xl mx-auto p-8 mt-12 animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-16 rounded-[48px] border border-slate-200 shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500" />
          <div className="text-7xl mb-10 flex justify-center text-emerald-500 scale-125"><Icons.Target size={100} /></div>
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Verified Results</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] mb-12">Performance Summary</p>
          
          <div className="grid grid-cols-2 gap-12 py-12 border-y border-slate-50 mb-12">
            <div className="space-y-2">
              <span className="block text-6xl font-black text-indigo-600">{score}/{totalQuestions}</span>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Correct</span>
            </div>
            <div className="space-y-2">
              <span className="block text-6xl font-black text-slate-900">{accuracy}%</span>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Technical Readiness</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => { setQuizData([]); setShowResults(false); }} className="px-10 py-5 bg-slate-100 text-slate-600 rounded-[24px] font-black text-lg hover:bg-slate-200 transition-all">
              Try Another Version
            </button>
            <Link to="/learning" className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl">
              <Icons.Learning size={22} /> View Skill Roadmap
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12 space-y-12 min-h-screen">
      <div className="flex items-end justify-between border-b border-slate-200 pb-10">
        <div>
          <span className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-3 block">Evaluation Phase</span>
          <h2 className="text-3xl font-black text-slate-900">{currentQuestion?.skill} Mastery</h2>
        </div>
        <div className="text-right">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Question {currentIdx + 1} of {totalQuestions}</div>
          <div className="w-56 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-white p-12 lg:p-16 rounded-[56px] border border-slate-200 shadow-sm space-y-14">
        <h3 className="text-3xl font-bold text-slate-800 leading-[1.3]">{currentQuestion?.question}</h3>
        <div className="grid grid-cols-1 gap-5">
          {currentQuestion?.options.map((option, idx) => {
            const isSelected = state.quizAnswers[currentQuestion.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => updateAnswers(currentQuestion.id, idx)}
                className={`p-7 rounded-[28px] border-2 text-left transition-all flex items-center gap-6 ${
                  isSelected ? 'border-indigo-600 bg-indigo-50/40' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-black text-sm ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-400'}`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={`font-bold text-lg ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>{option}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-12 border-t border-slate-50">
          <button onClick={() => setCurrentIdx(p => Math.max(0, p - 1))} disabled={currentIdx === 0} className={`px-8 py-4 font-black text-slate-400 hover:text-slate-900 ${currentIdx === 0 ? 'opacity-0' : ''}`}>
            Back
          </button>
          <button
            onClick={() => currentIdx === totalQuestions - 1 ? setShowResults(true) : setCurrentIdx(p => p + 1)}
            disabled={state.quizAnswers[currentQuestion?.id] === undefined}
            className={`px-12 py-5 rounded-[24px] font-black text-xl transition-all ${
              state.quizAnswers[currentQuestion?.id] === undefined ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white hover:bg-black shadow-2xl'
            }`}
          >
            {currentIdx === totalQuestions - 1 ? 'Finish Results' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
