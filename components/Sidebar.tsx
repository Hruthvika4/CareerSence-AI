
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { User } from '../types';
import { Icons } from './Icons';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { path: '/assessment', label: 'Assessment', icon: Icons.Assessment },
    { path: '/learning', label: 'Learning', icon: Icons.Learning },
    { path: '/settings', label: 'Settings', icon: Icons.Settings },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col hidden lg:flex shrink-0">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Icons.Target className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">CareerSense</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon size={20} />
              <span className="font-semibold text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={onLogout}
          className="w-full py-3 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border border-transparent hover:border-red-500/20"
        >
          <Icons.Logout size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
