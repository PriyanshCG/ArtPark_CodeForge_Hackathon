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
        className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Fingerprint className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Skill DNA Profile</h3>
            <p className="text-sm text-slate-500">Distribution analysis based on current proficiency</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">Mastered Skills</span>
              <span className="text-sm font-bold text-slate-900">{distribution.strong}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${distribution.strong}%` }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-md">Emerging Skills</span>
              <span className="text-sm font-bold text-slate-900">{distribution.moderate}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${distribution.moderate}%` }}
                className="h-full bg-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-rose-700 bg-rose-50 px-2 py-1 rounded-md">Growth Opportunity</span>
              <span className="text-sm font-bold text-slate-900">{distribution.weak}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${distribution.weak}%` }}
                className="h-full bg-rose-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-4">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <BarChart3 className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your profile shows a <span className="font-bold text-emerald-600">{distribution.strong < 40 ? 'growing' : 'strong'}</span> technical foundation 
            with significant growth potential in emerging areas.
          </p>
        </div>
      </motion.div>

      {/* Panel B: Career Simulation Engine */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp className="w-32 h-32" />
        </div>

        <div className="relative flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Terminal className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Career Simulator</h3>
            <p className="text-sm text-slate-400">Predicting your trajectory for different roles</p>
          </div>
        </div>

        <div className="relative mb-8">
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
          >
            {careerPaths.map(path => (
              <option key={path.id} value={path.id}>{path.name}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronRight className="w-4 h-4 text-slate-500" />
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
              <div className="h-20 bg-slate-800 rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-slate-800 rounded-xl" />
                <div className="h-16 bg-slate-800 rounded-xl" />
              </div>
            </motion.div>
          ) : simulation && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-indigo-300">Readiness for {simulation.name}</span>
                  <span className="text-2xl font-black text-indigo-400">{simulation.readiness}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${simulation.readiness}%` }}
                    className="h-full bg-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Estimated Time</span>
                  </div>
                  <p className="text-lg font-bold">{simulation.timeInWeeks} Weeks</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Success Fate</span>
                  </div>
                  <p className="text-lg font-bold">{simulation.probability}% Probability</p>
                </div>
              </div>

              {simulation.missing.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Critical Skill Gaps to Address
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {simulation.missing.map(skill => (
                      <span key={skill} className="text-xs font-medium px-2 py-1 bg-rose-500/10 text-rose-300 rounded-md border border-rose-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SkillDNA;
