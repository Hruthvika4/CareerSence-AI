
import React, { useState, useEffect } from 'react';
import { AppState } from '../types';

interface SettingsProps {
  state: AppState;
}

const Settings: React.FC<SettingsProps> = ({ state }) => {
  const [name, setName] = useState(state.user?.name || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [role, setRole] = useState('Professional');
  const [experience, setExperience] = useState('Mid-Level');
  const [notifications, setNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  useEffect(() => {
    if (state.user) {
      setName(state.user.name);
      setEmail(state.user.email);
    }
  }, [state.user]);

  const handleSave = () => {
    // In a real app, this would update the backend
    alert("Settings saved locally!");
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 lg:p-10 space-y-12 bg-[#F8FAFC] min-h-screen">
      {/* Header Banner */}
      <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative">
          <h2 className="text-5xl font-black text-[#1A202E] mb-3 tracking-tight uppercase">Account Hub</h2>
          <p className="text-xl text-slate-400 font-medium italic">Personalizing your CareerSense experience</p>
        </div>
        <div className="flex items-center gap-6 relative">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-[24px] flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-100">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Profile Section */}
          <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 space-y-10">
            <h3 className="text-2xl font-black text-[#1A202E] uppercase tracking-tight">Identity & Role</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Identity</label>
                <input 
                  type="email" 
                  value={email} 
                  readOnly
                  className="w-full px-8 py-5 rounded-[24px] bg-slate-100 border-none font-bold text-slate-400 cursor-not-allowed"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Focus</label>
                <input 
                  type="text" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-900 transition-all"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Experience Level</label>
                <select 
                  value={experience} 
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-900 appearance-none"
                >
                  <option>Entry-Level</option>
                  <option>Mid-Level</option>
                  <option>Senior</option>
                  <option>Executive</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleSave}
              className="px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
            >
              Sync Configuration
            </button>
          </div>

          {/* Preferences Section */}
          <div className="bg-white p-12 rounded-[48px] shadow-sm border border-slate-100 space-y-10">
            <h3 className="text-2xl font-black text-[#1A202E] uppercase tracking-tight">Security & Privacy</h3>
            <div className="space-y-8">
              <ToggleRow 
                label="System Alerts" 
                desc="Real-time notifications for job matches and assessment results" 
                enabled={notifications} 
                onToggle={() => setNotifications(!notifications)} 
              />
              <ToggleRow 
                label="Stealth Mode" 
                desc="Hide your profile score from non-verified recruiters" 
                enabled={privateProfile} 
                onToggle={() => setPrivateProfile(!privateProfile)} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-slate-900 p-12 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="text-3xl font-black mb-6 tracking-tight uppercase">Titan Access 💎</h4>
            <p className="opacity-70 font-medium mb-12 text-lg leading-relaxed">Unlock deep-core analysis, unlimited AI interviews, and direct recruiter pipeline.</p>
            <button className="w-full py-5 bg-white text-slate-900 rounded-[24px] font-black text-xl hover:bg-indigo-50 transition-all active:scale-95 shadow-lg shadow-black/20">
              Go Titan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleRow: React.FC<{ label: string, desc: string, enabled: boolean, onToggle: () => void }> = ({ label, desc, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-2 group">
    <div className="max-w-md">
      <h5 className="text-xl font-bold text-[#1A202E] group-hover:text-indigo-600 transition-colors">{label}</h5>
      <p className="text-slate-400 font-medium text-sm mt-1">{desc}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`w-16 h-9 rounded-full relative transition-all duration-500 ${enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 ${enabled ? 'left-8.5' : 'left-1.5'}`} />
    </button>
  </div>
);

export default Settings;
