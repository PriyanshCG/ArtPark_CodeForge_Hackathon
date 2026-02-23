import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Terminal, Clock, Target, ChevronRight, BarChart3, TrendingUp, Search } from 'lucide-react';
import { careerPaths } from '../data/mockData';

const SkillDNA = ({ userSkills }) => {
  const [selectedRole, setSelectedRole] = useState(careerPaths[0].id);
  const [isSimulating, setIsSimulating] = useState(false);

  // Panel A data calculation
  const distribution = useMemo(() => {
    if (!userSkills) return { strong: 0, moderate: 0, weak: 0 };
    const total = userSkills.length;
    const strong = userSkills.filter(s => s.yourLevel >= s.requiredLevel).length;
    const moderate = userSkills.filter(s => s.yourLevel > 0 && s.yourLevel < s.requiredLevel).length;
    const weak = userSkills.filter(s => s.yourLevel === 0).length;

    return {
      strong: Math.round((strong / total) * 100),
      moderate: Math.round((moderate / total) * 100),
      weak: Math.round((weak / total) * 100)
    };
  }, [userSkills]);

  // Panel B simulation logic
  const simulation = useMemo(() => {
    const role = careerPaths.find(r => r.id === selectedRole);
    if (!role || !userSkills) return null;

    const skillMap = Object.fromEntries(userSkills.map(s => [s.name, s]));
    const missing = role.requiredSkills.filter(rs => !skillMap[rs] || skillMap[rs].yourLevel === 0);
    const weak = role.requiredSkills.filter(rs => skillMap[rs] && skillMap[rs].yourLevel > 0 && skillMap[rs].yourLevel < skillMap[rs].requiredLevel);
    const totalRequired = role.requiredSkills.length;

    // Readiness: Mastered count is 1, Weak is 0.5, Missing is 0
    const masteredCount = role.requiredSkills.filter(rs => skillMap[rs] && skillMap[rs].yourLevel >= skillMap[rs].requiredLevel).length;
    const readiness = Math.round(((masteredCount + (weak.length * 0.5)) / totalRequired) * 100);

    const timeInWeeks = missing.length * 2 + weak.length * 1;
    const probability = Math.round(readiness * 0.9 + 5); // Simple heuristic

    return {
      readiness,
      timeInWeeks,
      missing,
      probability,
      name: role.name
    };
  }, [selectedRole, userSkills]);

  const handleRoleChange = (e) => {
    setIsSimulating(true);
    setSelectedRole(e.target.value);
    setTimeout(() => setIsSimulating(false), 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Panel A: Skill DNA Profile */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-8 overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
            <Fingerprint className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skill DNA Profile</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Distribution analysis based on current proficiency</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">Mastered Skills</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{distribution.strong}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${distribution.strong}%` }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md">Emerging Skills</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{distribution.moderate}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${distribution.moderate}%` }}
                className="h-full bg-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md">Growth Opportunity</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{distribution.weak}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${distribution.weak}%` }}
                className="h-full bg-rose-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-4">
          <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <BarChart3 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Your profile shows a <span className="font-bold text-emerald-600 dark:text-emerald-400">{distribution.strong < 40 ? 'growing' : 'strong'}</span> technical foundation
            with significant growth potential in emerging areas.
          </p>
        </div>
      </motion.div>

      {/* Panel B: Career Simulation Engine */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp className="w-32 h-32" />
        </div>

        <div className="relative flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
            <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Career Simulator</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Predicting your trajectory for different roles</p>
          </div>
        </div>

        <div className="relative mb-8">
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer transition-all"
          >
            {careerPaths.map(path => (
              <option key={path.id} value={path.id}>{path.name}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isSimulating ? (
            <motion.div
              key="simulating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 animate-pulse"
            >
              <div className="h-20 bg-slate-50 dark:bg-slate-800 rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-slate-50 dark:bg-slate-800 rounded-xl" />
                <div className="h-16 bg-slate-50 dark:bg-slate-800 rounded-xl" />
              </div>
            </motion.div>
          ) : simulation && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 bg-gradient-to-br from-indigo-900 to-indigo-700/80 dark:from-indigo-900/80 dark:to-slate-900 rounded-[1.5rem] shadow-xl shadow-indigo-500/20 border border-indigo-500/30 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Target className="w-48 h-48 -rotate-12 transition-transform group-hover:scale-110 duration-700" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-md animate-pulse">
                      Simulation Complete
                    </span>
                  </div>

                  <h4 className="text-2xl font-black mb-2 tracking-tight">
                    You are <span className="text-emerald-400">{simulation.readiness}%</span> ready for <br /> {simulation.name}
                  </h4>

                  <div className="h-2 w-full bg-indigo-950/50 rounded-full overflow-hidden mb-8 border border-indigo-500/20 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${simulation.readiness}%` }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 shadow-[0_0_15px_#10b981]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                      <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-widest mb-1 shadow-sm">Estimated Time</p>
                      <p className="text-xl font-black">{simulation.timeInWeeks * 4} Days</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
                      <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-widest mb-1 shadow-sm">Success Probability</p>
                      <p className="text-xl font-black text-amber-400">{simulation.probability}%</p>
                    </div>
                  </div>

                  {simulation.missing.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs font-bold text-indigo-200 mb-3 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Missing Core Competencies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {simulation.missing.map(skill => (
                          <span key={skill} className="text-xs font-bold px-3 py-1.5 bg-rose-500/20 text-rose-200 rounded-lg border border-rose-500/30">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SkillDNA;
