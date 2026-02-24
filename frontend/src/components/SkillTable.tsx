import { motion } from 'framer-motion';
import type { Skill } from '../lib/mockData';
import { getGapStatus, getGapColor } from '../lib/mockData';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface SkillTableProps {
  skills: Skill[];
}

export default function SkillTable({ skills }: SkillTableProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  const getStatusIcon = (status: 'matched' | 'weak' | 'missing') => {
    switch (status) {
      case 'matched':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'weak':
        return <AlertTriangle className="w-4 h-4" />;
      case 'missing':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: 'matched' | 'weak' | 'missing') => {
    switch (status) {
      case 'matched':
        return 'Matched';
      case 'weak':
        return 'Needs Work';
      case 'missing':
        return 'Missing';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-8 py-6 border-b border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-100 rounded-xl">
              <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Skill Analysis</h2>
              <p className="text-sm text-slate-500 mt-0.5">Detailed breakdown of your skill gaps</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-500">Matched</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-500">Needs Work</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-500">Missing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Required</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Level</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gap</th>
              <th className="text-right px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
          >
            {skills.map((skill) => {
              const status = getGapStatus(skill);
              const colors = getGapColor(status);
              const gap = skill.requiredLevel - skill.yourLevel;

              return (
                <motion.tr
                  key={skill.name}
                  variants={item}
                  className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors`}
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-8 rounded-full ${colors.dot}`} />
                      <div>
                        <p className="font-medium text-slate-800">{skill.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{skill.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < skill.requiredLevel ? 'bg-slate-400' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < skill.yourLevel
                              ? status === 'matched'
                                ? 'bg-emerald-500'
                                : status === 'weak'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-semibold ${
                      gap <= 0 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : gap <= 2
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {gap <= 0 ? '✓' : `-${gap}`}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
                      {getStatusIcon(status)}
                      {getStatusLabel(status)}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
}
