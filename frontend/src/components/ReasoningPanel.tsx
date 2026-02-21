import { motion } from 'framer-motion';
import type { ReasoningItem } from '../lib/mockData';
import { getGapColor } from '../lib/mockData';
import { Lightbulb, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ReasoningPanelProps {
  reasoning: ReasoningItem[];
}

export default function ReasoningPanel({ reasoning }: ReasoningPanelProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const getTypeIcon = (type: 'matched' | 'weak' | 'missing') => {
    switch (type) {
      case 'matched':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'weak':
        return <AlertTriangle className="w-5 h-5" />;
      case 'missing':
        return <XCircle className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: 'matched' | 'weak' | 'missing') => {
    switch (type) {
      case 'matched':
        return 'Strength';
      case 'weak':
        return 'Improvement Area';
      case 'missing':
        return 'Critical Gap';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-8 py-6 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 rounded-xl">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Why This Roadmap Was Generated</h2>
            <p className="text-sm text-slate-500 mt-0.5">AI reasoning behind each recommendation</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {reasoning.map((item, index) => {
            const colors = getGapColor(item.type);

            return (
              <motion.div
                key={index}
                variants={itemVariant}
                className={`flex items-start gap-4 p-5 rounded-xl border ${colors.bg} ${colors.border}`}
              >
                <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.text} ${colors.bg} border ${colors.border}`}>
                      {item.skill}
                    </span>
                    <span className={`text-xs font-medium ${colors.text}`}>
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.reason}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-900">Personalized Learning Path</p>
              <p className="text-xs text-indigo-600 mt-0.5">
                This roadmap prioritizes critical gaps first, then builds on your existing strengths.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
