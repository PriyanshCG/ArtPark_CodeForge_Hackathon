import { motion } from 'framer-motion';
import type { RoadmapStep } from '../lib/mockData';
import { getPriorityColor } from '../lib/mockData';
import { Clock, ExternalLink, ChevronRight, Flag } from 'lucide-react';

interface RoadmapProps {
  roadmap: RoadmapStep[];
}

export default function Roadmap({ roadmap }: RoadmapProps) {
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
      className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-8 py-6 border-b border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-100 rounded-xl">
              <Flag className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Learning Roadmap</h2>
              <p className="text-sm text-slate-500 mt-0.5">Your personalized path to role readiness</p>
            </div>
          </div>
          <div className="text-sm text-slate-500">
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
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-violet-500 to-slate-200" />

          {roadmap.map((step) => {
            const priorityColors = getPriorityColor(step.priority);

            return (
              <motion.div
                key={step.step}
                variants={item}
                className="relative pl-16 pb-8 last:pb-0"
              >
                {/* Step Number */}
                <div className="absolute left-0 w-12 h-12 bg-white border-2 border-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-lg font-bold text-indigo-600">{step.step}</span>
                </div>

                {/* Content Card */}
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-800">{step.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border} border`}>
                          {step.priority.charAt(0).toUpperCase() + step.priority.slice(1)} Priority
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>{step.duration}</span>
                        </div>
                        
                        {step.resource && (
                          <a
                            href={step.resourceUrl}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>{step.resource}</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </a>
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
    </motion.div>
  );
}
