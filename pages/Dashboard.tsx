
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { analyzeResumeAndJob } from '../geminiService';
import { AppState, SkillAnalysis } from '../types';
import SkillTag from '../components/SkillTag';
import CircularProgress from '../components/CircularProgress';
import { Icons } from '../components/Icons';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.mjs`;

interface DashboardProps {
  state: AppState;
  setAnalysisData: (resume: string, job: string, analysis: SkillAnalysis) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, setAnalysisData }) => {
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState(state.resumeText || '');
  const [jobText, setJobText] = useState(state.jobText || '');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'job') => {
    const file = event.target.files?.[0];
    if (!file) return;
    setParsing(true);
    setError(null);
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((it: any) => it.str).join(" ") + "\n";
        }
        if (type === 'resume') setResumeText(text); else setJobText(text);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          if (type === 'resume') setResumeText(text); else setJobText(text);
        };
        reader.readAsText(file);
      }
    } catch (err) { setError("PDF Parsing failed. Please copy/paste text manually."); }
    finally { setParsing(false); }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobText.trim()) {
      setError("Please provide both a Resume and a Job Description.");
      return;
    }
    
    setLoading(true); 
    setError(null);
    
    try {
      const result = await analyzeResumeAndJob(resumeText, jobText);
      setAnalysisData(resumeText, jobText, result);
    } catch (err) { 
      console.error(err);
      setError("Analysis encountered a problem. Check your internet or API key."); 
    } finally { 
      setLoading(false); 
    }
  };

  const analysis = state.analysis;

  return (
    <div className="max-w-7xl mx-auto p-8 lg:p-12 space-y-12 bg-slate-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Control Center</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-wider text-xs">Matching Expertise for {state.user?.name}</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 pr-4 rounded-2xl shadow-sm">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white uppercase">
            {state.user?.name?.substring(0, 1) || 'U'}
          </div>
          <span className="font-bold text-slate-700 text-sm">{state.user?.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UploadSection 
          icon={Icons.FileText} 
          title="Resume / CV" 
          value={resumeText} 
          onChange={setResumeText} 
          onUpload={(e) => handleFileUpload(e, 'resume')} 
          isParsing={parsing}
        />
        <UploadSection 
          icon={Icons.Briefcase} 
          title="Job Description" 
          value={jobText} 
          onChange={setJobText} 
          onUpload={(e) => handleFileUpload(e, 'job')} 
          isParsing={parsing}
        />
      </div>

      <div className="flex flex-col items-center gap-4 py-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 animate-in fade-in zoom-in duration-300">
            <span className="text-xl">⚠️</span>
            {error}
          </div>
        )}
        
        <button
          onClick={handleAnalyze}
          disabled={loading || parsing}
          className={`px-12 py-5 rounded-[24px] font-black text-xl transition-all flex items-center gap-4 shadow-2xl ${
            loading || parsing ? 'bg-slate-200 text-slate-400 cursor-not-allowed scale-95' : 'bg-slate-900 text-white hover:bg-black hover:-translate-y-1 active:scale-95'
          }`}
        >
          {loading ? (
            <div className="animate-spin h-6 w-6 border-4 border-white/20 border-t-white rounded-full" />
          ) : (
            <Icons.Target size={24} />
          )}
          {loading ? 'Analyzing with Gemini...' : 'Run Analysis'}
        </button>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Match Precision</h3>
            <CircularProgress percentage={analysis.matchScore} />
            <div className={`mt-10 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-wider ${analysis.matchScore >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
              {analysis.matchScore >= 80 ? 'Elite Match' : 'High Potential'}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white p-12 rounded-[40px] border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full" />
              Strategic Feedback
            </h3>
            <p className="text-slate-500 text-xl leading-relaxed mb-12 font-medium italic">"{analysis.explanation}"</p>
            
            <div className="grid md:grid-cols-2 gap-10 mb-12">
              <SkillGroup title="Strengths Detected" skills={analysis.matchedSkills} type="matched" />
              <SkillGroup title="Gaps to Bridge" skills={analysis.skillGaps} type="gap" />
            </div>

            <div className="mt-auto pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Link to="/assessment" className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-[24px] hover:bg-black transition-all group shadow-xl">
                <div>
                  <span className="text-xs opacity-70 font-black uppercase block mb-1">Step 2: Verification</span>
                  <span className="font-black text-lg">Take Skills Quiz</span>
                </div>
                <Icons.ArrowRight />
              </Link>
              <Link to="/learning" className="flex items-center justify-between p-6 bg-white border-2 border-slate-100 text-slate-800 rounded-[24px] hover:border-indigo-100 hover:bg-slate-50 transition-all group">
                <div>
                  <span className="text-xs text-slate-400 font-black uppercase block mb-1">Step 3: Growth</span>
                  <span className="font-black text-lg">View Roadmap</span>
                </div>
                <Icons.GraduationCap size={28} className="text-indigo-600" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UploadSection = ({ icon: Icon, title, value, onChange, onUpload, isParsing }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Icon size={22} /></div>
        <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">{title}</h4>
      </div>
      <label className="text-xs font-black text-indigo-600 cursor-pointer hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors uppercase tracking-widest border border-indigo-100">
        Upload File
        <input type="file" className="hidden" onChange={onUpload} accept=".pdf,.txt" />
      </label>
    </div>
    <div className="relative group">
      <textarea 
        className="w-full h-44 p-6 bg-slate-50 rounded-[24px] border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-900 resize-none leading-relaxed"
        placeholder="Paste text here..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {isParsing && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-[24px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
            <span className="font-black text-slate-700 uppercase tracking-widest text-[10px]">Parsing Document...</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

const SkillGroup = ({ title, skills, type }: any) => (
  <div className="space-y-4">
    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</h5>
    <div className="flex flex-wrap gap-2.5">
      {skills.length ? skills.map((s: string) => <SkillTag key={s} label={s} type={type} />) : <span className="text-slate-300 italic font-medium text-xs">No specific skills listed.</span>}
    </div>
  </div>
);

export default Dashboard;
