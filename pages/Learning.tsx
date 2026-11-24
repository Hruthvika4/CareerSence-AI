
import React, { useEffect, useState } from 'react';
import { recommendCourses } from '../geminiService';
import { AppState, Course } from '../types';
import { DUMMY_COURSES } from '../constants';

interface LearningProps {
  state: AppState;
  toggleCourse: (id: string) => void;
}

const Learning: React.FC<LearningProps> = ({ state, toggleCourse }) => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>(DUMMY_COURSES); // Initialize with curated list

  useEffect(() => {
    const loadCourses = async () => {
      // If no analysis is present, we already have DUMMY_COURSES
      if (!state.analysis) {
        return;
      }

      setLoading(true);
      try {
        const results = await recommendCourses(state.analysis.skillGaps || [], state.analysis.resumeSkills || []);
        if (results && Array.isArray(results) && results.length > 0) {
          // Put AI recommendations at the top, followed by our verified library
          // Remove duplicates if the AI happens to recommend something in our list
          const combined = [...results, ...DUMMY_COURSES];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);
          setCourses(unique);
        }
      } catch (err) {
        console.error("AI Course Recommendation failed, keeping curated list.", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [state.analysis]);

  const handleStartLearning = (course: Course) => {
    if (course.url && course.url !== '#') {
      window.open(course.url, '_blank', 'noopener,noreferrer');
      toggleCourse(course.id);
    } else {
      alert("This course link is being processed. Please try again in a few seconds.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 lg:p-10 space-y-12 bg-[#F8FAFC]">
      {/* Header Banner */}
      <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <div className="relative">
          <h2 className="text-5xl font-extrabold text-[#1A202E] mb-3 tracking-tight">Your Learning Path 📚</h2>
          <p className="text-xl text-slate-400 font-medium">
            {state.analysis 
              ? `Tailored courses to prepare you for your target role`
              : 'Verified high-quality courses for every technical domain'}
          </p>
        </div>
        <div className="flex items-center gap-6 relative">
          <div className="w-14 h-14 bg-slate-50 text-amber-500 rounded-full flex items-center justify-center text-2xl">🔔</div>
          <div className="w-16 h-16 bg-[#5E72E4] text-white rounded-full flex items-center justify-center font-extrabold text-2xl shadow-xl shadow-blue-200">
            {state.user?.name?.charAt(0) || 'AB'}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-3xl font-extrabold text-[#1A202E] tracking-tight">Preparation Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <ProgressStat 
            value={state.completedCourses.length} 
            label="Courses Visited" 
            color="text-[#5E72E4]"
          />
          <ProgressStat 
            value={state.analysis ? (state.analysis.skillGaps?.length || 0) : '—'} 
            label="Identified Gaps" 
            color="text-[#FF5C39]"
          />
          <ProgressStat 
            value={`${state.analysis?.matchScore || 0}%`} 
            label="Role Readiness" 
            color="text-[#26C6DA]"
          />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <span className="text-3xl opacity-30">🎓</span>
          <h3 className="text-3xl font-extrabold text-[#1A202E] tracking-tight">
            {loading ? 'Curating AI recommendations...' : (state.analysis ? 'Recommended Learning Path' : 'Complete Course Library')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => (
            <CourseCard 
              key={course.id || Math.random().toString()}
              course={course}
              isCompleted={state.completedCourses.includes(course.id)}
              onStart={() => handleStartLearning(course)}
            />
          ))}
          
          {loading && (
             <div className="animate-pulse bg-white p-12 rounded-[48px] border-2 border-dashed border-blue-100 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#5E72E4] border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-slate-400">Searching for live gap-specific links...</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProgressStat: React.FC<{ value: string | number, label: string, color: string }> = ({ value, label, color }) => (
  <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 text-center space-y-3 hover:scale-105 transition-transform">
    <span className={`block text-6xl font-black ${color}`}>{value}</span>
    <span className="block text-lg font-bold text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

const CourseCard: React.FC<{ course: Course, isCompleted: boolean, onStart: () => void }> = ({ course, isCompleted, onStart }) => {
  const isYouTube = course.platform?.toLowerCase().includes('youtube');
  const isUdemy = course.platform?.toLowerCase().includes('udemy');

  return (
    <div className="bg-white rounded-[48px] shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-2 transition-all">
      <div className={`h-40 flex items-center justify-center relative overflow-hidden ${isYouTube ? 'bg-red-500' : isUdemy ? 'bg-slate-800' : 'bg-[#26C6DA]'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
        <div className="w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center text-4xl group-hover:rotate-12 transition-transform text-white">
          {isYouTube ? '▶️' : isUdemy ? '🎓' : '📚'}
        </div>
      </div>
      
      <div className="p-10 flex flex-col flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-wider italic">
            <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] not-italic text-white ${isYouTube ? 'bg-red-500' : 'bg-blue-600'}`}>
              {isYouTube ? 'Y' : 'U'}
            </span>
            {course.platform}
          </span>
          <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${course.isFree ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            {course.isFree ? 'Free Access' : 'Paid Course'}
          </span>
        </div>

        <h4 className="text-2xl font-extrabold text-[#1A202E] leading-snug h-16 overflow-hidden">
          {course.title}
        </h4>
        
        <p className="text-slate-400 font-medium text-lg leading-relaxed line-clamp-3 h-24">
          {course.description}
        </p>

        <div className="mt-auto pt-6 space-y-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Skill Focus</span>
            <span className="text-sm font-black text-[#5E72E4]">{course.skill}</span>
          </div>
          
          <button
            onClick={onStart}
            className={`w-full py-5 rounded-[24px] font-extrabold text-xl flex items-center justify-center gap-3 transition-all ${
              isCompleted 
                ? 'bg-emerald-500 text-white' 
                : 'bg-[#5E72E4] text-white hover:bg-blue-600 shadow-xl shadow-blue-100'
            }`}
          >
            {isCompleted ? '✓ Continue Learning' : '🚀 Start Full Course'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Learning;
