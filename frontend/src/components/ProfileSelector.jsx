import { Briefcase } from 'lucide-react';

export default function ProfileSelector({ selectedProfile, onProfileChange, profileOptions }) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        Demo Profile
      </label>
      <select
        value={selectedProfile}
        onChange={(e) => onProfileChange(e.target.value)}
        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer"
      >
        {profileOptions.map((option) => (
          <option key={option.id} value={option.id} className="dark:bg-slate-900 text-slate-900 dark:text-white">
            {option.name}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-400 dark:text-slate-500">Select a demo profile to see different skill gap scenarios</p>
    </div>
  );
}