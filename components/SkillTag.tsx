
import React from 'react';

interface SkillTagProps {
  label: string;
  type: 'matched' | 'gap' | 'neutral';
}

const SkillTag: React.FC<SkillTagProps> = ({ label, type }) => {
  const styles = {
    matched: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100',
    gap: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
  };

  return (
    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-default ${styles[type]}`}>
      {label}
    </span>
  );
};

export default SkillTag;
