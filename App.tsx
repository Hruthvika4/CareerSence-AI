
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Learning from './pages/Learning';
import Settings from './pages/Settings';
import { AppState, User, SkillAnalysis, QuizQuestion } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    resumeText: '',
    jobText: '',
    analysis: null,
    quiz: [],
    quizAnswers: {},
    completedCourses: []
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('career_sense_user');
    if (savedUser) {
      setState(prev => ({ ...prev, user: JSON.parse(savedUser) }));
    }
  }, []);

  const handleLogin = (user: User) => {
    localStorage.setItem('career_sense_user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
  };

  const handleLogout = () => {
    localStorage.removeItem('career_sense_user');
    setState({
      user: null,
      resumeText: '',
      jobText: '',
      analysis: null,
      quiz: [],
      quizAnswers: {},
      completedCourses: []
    });
  };

  const setAnalysisData = (resumeText: string, jobText: string, analysis: SkillAnalysis) => {
    setState(prev => ({ ...prev, resumeText, jobText, analysis }));
  };

  const setQuizData = (quiz: QuizQuestion[]) => {
    setState(prev => ({ ...prev, quiz }));
  };

  const updateQuizAnswers = (questionId: number, answerIndex: number) => {
    setState(prev => ({
      ...prev,
      quizAnswers: { ...prev.quizAnswers, [questionId]: answerIndex }
    }));
  };

  const toggleCourseCompletion = (courseId: string) => {
    setState(prev => ({
      ...prev,
      completedCourses: prev.completedCourses.includes(courseId)
        ? prev.completedCourses.filter(id => id !== courseId)
        : [...prev.completedCourses, courseId]
    }));
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {state.user && <Sidebar user={state.user} onLogout={handleLogout} />}
        <main className={`flex-1 overflow-y-auto ${state.user ? '' : ''}`}>
          <Routes>
            <Route 
              path="/" 
              element={state.user ? <Navigate to="/dashboard" /> : <Auth onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={state.user ? <Dashboard state={state} setAnalysisData={setAnalysisData} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/assessment" 
              element={state.user ? <Assessment state={state} setQuizData={setQuizData} updateAnswers={updateQuizAnswers} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/learning" 
              element={state.user ? <Learning state={state} toggleCourse={toggleCourseCompletion} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/settings" 
              element={state.user ? <Settings state={state} /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
