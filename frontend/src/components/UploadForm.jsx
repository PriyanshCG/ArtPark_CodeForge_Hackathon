import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, Brain, Code, Target, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import * as api from '../lib/api';
import ProfileSelector from './ProfileSelector';

export default function UploadForm({
  onAnalyze,
  selectedProfile,
  onProfileChange,
  profileOptions,
}) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [dragActive, setDragActive] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState('');

  const jdFileInputRef = useRef(null);

  const handleDrag = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(type);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  }, []);

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (type === 'resume') {
        setResumeFile(file);
      } else if (type === 'jobDescriptionFile') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setJdText(event.target.result);
        };
        reader.readAsText(file);
      }
    }
  }, []);

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === 'resume') {
        setResumeFile(file);
      } else if (type === 'jobDescriptionFile') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setJdText(event.target.result);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!resumeFile || jdText.trim().length === 0) return;

    setIsAnalyzing(true);
    setStatus('Parsing resume...');

    try {
      // Step 1: Parse Resume
      const resumeResult = await api.parseResume(resumeFile);
      const resumeProfile = resumeResult.profile;

      // Step 2: Parse JD
      setStatus('Analyzing job description...');
      const jdResult = await api.parseJD(jdText);
      const jdProfile = jdResult.profile;

      // Step 3: Skill Gap Analysis
      setStatus('Comparing semantics & mapping gaps...');
      const gapResult = await api.analyzeSkillGap(resumeProfile, jdProfile);
      const skillGap = gapResult.skillGap;

      // Step 4: Roadmap Generation
      setStatus('Architecting adaptive roadmap...');
      const roadmapResult = await api.generateRoadmap(resumeProfile, jdProfile, skillGap);
      const roadmap = roadmapResult.roadmap;

      // Step 5: Finalize
      setStatus('Finalizing report...');
      const finalResult = {
        resumeProfile,
        jdProfile,
        skillGap,
        pathway: roadmap.pathway,
        roadmapMetrics: roadmap.metrics,
        coachingNote: roadmap.overall_coaching_note
      };

      onAnalyze(finalResult);
      setIsAnalyzing(false);
      setStatus('');
    } catch (err) {
      console.error('Analysis failed:', err);
      setStatus('Error: ' + err.message);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStatus('');
      }, 3000);
    }
  };

  const handleTryDemo = () => {
    const demoData = {
      id: 'demo-fullstack',
      name: 'Demo Profile (Full Stack)',
      role: 'Full Stack Developer',
      company: 'ArtPark Innovation Lab',
      readinessScore: 72,
      matchPercentage: 75,
      missingSkills: 3,
      weakSkills: 2,
      skills: [
        { name: 'React', requiredLevel: 5, yourLevel: 5, category: 'Frontend' },
        { name: 'Node.js', requiredLevel: 4, yourLevel: 4, category: 'Backend' },
        { name: 'MongoDB', requiredLevel: 4, yourLevel: 3, category: 'Database' },
        { name: 'Docker', requiredLevel: 4, yourLevel: 1, category: 'DevOps' },
        { name: 'GraphQL', requiredLevel: 3, yourLevel: 0, category: 'API' },
        { name: 'TypeScript', requiredLevel: 5, yourLevel: 2, category: 'Language' },
      ],
      roadmap: [
        {
          sequence: 1,
          course_title: 'TypeScript Masterclass',
          skill_name: 'TypeScript',
          estimated_hours: 12,
          priority: 'high',
          learning_tips: 'Focus on generics and advanced type guards.',
          reasoning: { why_included: 'JD requires expert level (5/5), but resume shows basic familiarity.' }
        },
        {
          sequence: 2,
          course_title: 'Docker & Kubernetes Foundations',
          skill_name: 'Docker',
          estimated_hours: 15,
          priority: 'medium',
          learning_tips: 'Build a multi-stage container for a React app.',
          reasoning: { why_included: 'Missing core infrastructure skill needed for deployment.' }
        },
        {
          sequence: 3,
          course_title: 'GraphQL API Design',
          skill_name: 'GraphQL',
          estimated_hours: 10,
          priority: 'low',
          learning_tips: 'Practice schema-first development with Apollo.',
          reasoning: { why_included: 'Nice-to-have skill for modernizing the service layer.' }
        }
      ],
      reasoning: [
        { skill: 'TypeScript', reason: 'High-priority gap. The role requires TypeScript for all components.', type: 'weak' },
        { skill: 'Docker', reason: 'Critical for local development environments.', type: 'weak' },
        { skill: 'GraphQL', reason: 'Skill not found on resume. Recommended as a growth area.', type: 'missing' }
      ],
      targetJob: 'Full Stack Developer'
    };
    onAnalyze(demoData);
  };

  const canAnalyze = resumeFile && jdText.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-indigo-100/20 dark:shadow-none"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 px-8 py-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 rounded-xl">
            <Upload className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upload Your Documents</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">We'll analyze your skills against the job requirements</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Profile Selector */}
        <ProfileSelector
          selectedProfile={selectedProfile}
          onProfileChange={onProfileChange}
          profileOptions={profileOptions}
        />

        {/* Resume Upload */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            Resume
          </label>
          <AnimatePresence mode="wait">
            {!resumeFile ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onDragEnter={(e) => handleDrag(e, 'resume')}
                onDragLeave={(e) => handleDrag(e, 'resume')}
                onDragOver={(e) => handleDrag(e, 'resume')}
                onDrop={(e) => handleDrop(e, 'resume')}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${dragActive === 'resume'
                    ? 'border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'}`}
              >
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'resume')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-3">
                  <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Drop your resume here</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">or click to browse (PDF, TXT, DOC)</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/50 rounded-xl"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{resumeFile.name}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
                    {(resumeFile.size / 1024).toFixed(1)} KB • Ready to analyze
                  </p>
                </div>
                <button
                  onClick={() => setResumeFile(null)}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                >
                  Change
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Job Description */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            Job Description
          </label>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job description here..."
            rows={5}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none"
          />
          {jdText.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Job description added</span>
            </motion.div>
          )}
        </div>

        {/* Status Message */}
        {status && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
              status.startsWith('Error') 
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/10 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
                : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/10 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50'
            }`}
          >
            {status.startsWith('Error') ? <AlertCircle className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{status}</span>
          </motion.div>
        )}

        {/* Analyze Button */}
        <div className="space-y-3">
          <motion.button
            onClick={handleSubmit}
            disabled={!canAnalyze || isAnalyzing}
            whileHover={{ scale: canAnalyze && !isAnalyzing ? 1.01 : 1 }}
            whileTap={{ scale: canAnalyze && !isAnalyzing ? 0.99 : 1 }}
            className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-3
              ${canAnalyze && !isAnalyzing
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25 cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed'}`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Skill Gaps</span>
              </>
            )}
          </motion.button>

          {!isAnalyzing && (
            <button
              onClick={handleTryDemo}
              className="w-full py-3 px-6 rounded-xl font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Try Demo Data</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}