
import React, { useState } from 'react';
import { User } from '../types';
import { Icons } from '../components/Icons';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const TEST_EMAIL = 'test@careersense.ai';
  const TEST_PASSWORD = 'password123';

  const handleTestLogin = () => {
    setEmail(TEST_EMAIL);
    setPassword(TEST_PASSWORD);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin({ name: email === TEST_EMAIL ? 'Test User' : email.split('@')[0], email });
    } else {
      if (password !== confirmPassword) return alert("Passwords do not match");
      onLogin({ name, email });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-slate-900/50 backdrop-blur-xl rounded-[40px] border border-slate-800 overflow-hidden shadow-2xl relative z-10">
        {/* Left Side: Marketing/Info */}
        <div className="p-12 lg:p-16 flex flex-col justify-between border-r border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950/20">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Icons.Target className="text-white" size={28} />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">CareerSense</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">Empower your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">AI Intelligence.</span></h1>
            <p className="text-slate-400 text-lg mb-12 max-w-md">The next-generation platform for resume analysis, skill verification, and personalized learning.</p>
          </div>

          <div className="space-y-6">
            <Feature icon={Icons.FileText} title="Smart Analysis" desc="Detailed resume to job matching" />
            <Feature icon={Icons.Assessment} title="Skills Verified" desc="AI-generated technical assessments" />
            <Feature icon={Icons.Learning} title="Pathways" desc="Curated roadmaps for your gaps" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 lg:p-16 bg-white flex flex-col justify-center">
          <div className="mb-10 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-1">{isLogin ? 'Welcome back' : 'Create account'}</h2>
              <p className="text-slate-500">Sign in to continue your journey</p>
            </div>
            {isLogin && (
              <button onClick={handleTestLogin} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
                TEST ACCOUNT
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400" 
                    placeholder="John Doe" 
                  />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400" 
                  placeholder="name@company.com" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                    className="w-full px-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
                  </button>
                </div>
              </div>
            )}
            
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 mt-4 flex items-center justify-center gap-2 group">
              {isLogin ? 'Sign In' : 'Sign Up'}
              <Icons.ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-bold hover:underline">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon: Icon, title, desc }: any) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center shrink-0">
      <Icon className="text-indigo-400" size={20} />
    </div>
    <div>
      <h3 className="text-white font-bold">{title}</h3>
      <p className="text-slate-500 text-sm">{desc}</p>
    </div>
  </div>
);

export default Auth;
