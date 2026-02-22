import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPriorityColor } from '../data/mockData';
import { Clock, ExternalLink, ChevronRight, Flag, CheckCircle2, XCircle, Target, Brain, Sparkles } from 'lucide-react';
import SkillQuiz from './SkillQuiz';

export default function Roadmap({ roadmap, onUpdate, onAssessment, learningStyle }) {
  const [activeQuizStep, setActiveQuizStep] = useState(null);

  const handleQuizComplete = (passed) => {
    if (activeQuizStep) {
      onAssessment(activeQuizStep.id, passed);
      setActiveQuizStep(null);
    }
  };
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-indigo-100/20 dark:shadow-none"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900 px-8 py-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-100 rounded-xl">
              <Flag className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Learning Roadmap</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Your personalized path to role readiness</p>
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {roadmap.length} steps • {roadmap.reduce((acc, step) => acc + parseInt(step.duration), 0)} weeks estimated
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative"
        >
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-violet-500 to-slate-200 dark:to-slate-800" />

          {roadmap.map((step, index) => {
            const priorityColors = getPriorityColor(step.priority);
            const isCompleted = step.status === 'completed';
            const isSkipped = step.status === 'skipped';
            const isActive = !isCompleted && !isSkipped && (index === 0 || roadmap[index - 1].status === 'completed');

            return (
              <motion.div
                key={step.step || index}
                variants={item}
                className={`relative pl-16 pb-8 last:pb-0 ${isSkipped ? 'opacity-50' : ''}`}
              >
                {/* Step Number / Icon */}
                <div className={`absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border-2 transition-all duration-500 z-10
                  ${isCompleted ? 'bg-emerald-500 border-emerald-500 scale-110' :
                    isSkipped ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700' :
                      isActive ? 'bg-white dark:bg-slate-900 border-indigo-500 animate-pulse' :
                        'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : isSkipped ? (
                    <XCircle className="w-5 h-5 text-slate-400" />
                  ) : (
                    <span className={`text-lg font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                      {step.step}
                    </span>
                  )}
                </div>

                {/* Content Card */}
                <div className={`rounded-xl border p-5 transition-all group relative overflow-hidden
                  ${isCompleted ? 'bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-200/50' :
                    isSkipped ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800' :
                      isActive ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-500/30 shadow-lg shadow-indigo-100/20' :
                        'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}
                >
                  {isSkipped && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest rounded-bl-xl border-l border-b border-slate-300 dark:border-slate-700">
                      Skipped (System Trace Applied)
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`font-semibold ${isCompleted ? 'text-emerald-700 dark:text-emerald-300 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                          {step.title}
                        </h3>
                        {!isCompleted && !isSkipped && (
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border} dark:bg-opacity-10 dark:border-opacity-30`}>
                            {step.priority.charAt(0).toUpperCase() + step.priority.slice(1)} Priority
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{step.description}</p>

                      {/* AI Decision Trace */}
                      <div className="mb-4 p-3 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-lg border border-indigo-100/50 dark:border-indigo-500/10">
                        <div className="flex items-start gap-2">
                          <Brain className="w-3.5 h-3.5 text-indigo-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Explainable AI Trace</p>
                            <p className="text-xs text-indigo-800/70 dark:text-indigo-300/70 italic">
                              {step.reason || (isSkipped ? `System identified proficiency in '${step.title.split(' ').pop()}' from resume context.` : `Prerequisite graph indicates '${step.title}' is the optimal next step for your ${step.priority} priority goals.`)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{step.duration}</span>
                          </div>

                          {step.style && (
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter
                              ${step.style === learningStyle ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                            >
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              {step.style}
                              {step.style === learningStyle && " • Match"}
                            </div>
                          )}

                          {step.resource && !isCompleted && !isSkipped && (
                            <a href={step.resourceUrl} className="group/resource inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all">
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Learn on {step.resource}</span>
                            </a>
                          )}
                        </div>

                        {isActive && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setActiveQuizStep(step)}
                              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                            >
                              <Target className="w-3.5 h-3.5" />
                              Take Assessment
                            </button>
                            <button
                              onClick={() => onUpdate(index, { status: 'completed' })}
                              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                              Mark Complete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeQuizStep && (
          <SkillQuiz
            step={activeQuizStep}
            onComplete={handleQuizComplete}
            onCancel={() => setActiveQuizStep(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}