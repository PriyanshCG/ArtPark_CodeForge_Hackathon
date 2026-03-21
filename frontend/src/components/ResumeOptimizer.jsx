import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, TrendingUp, AlertTriangle, ExternalLink, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';
import axios from 'axios';

export default function ResumeOptimizer({ resumeText, jobDescription, missingSkills, currentSkills, targetRole, seniority }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleOptimize = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/resume/optimize', {
                resumeText,
                jobDescription,
                missingSkills: missingSkills?.map(s => s.name || s.skill || s) || [],
                currentSkills: currentSkills?.map(s => s.name || s.skill || s) || [],
                targetRole,
                seniority
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResult(response.data.data);
        } catch (err) {
            console.error('Optimization failed:', err);
            setError('Failed to generate optimization. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 flex flex-col items-center justify-center min-h-[400px] border border-slate-200/60 dark:border-slate-800/60">
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full animate-pulse" />
                    <Loader2 className="w-16 h-16 text-amber-500 animate-spin relative z-10" />
                </div>
                <h3 className="mt-8 text-2xl font-black text-slate-800 dark:text-white animate-pulse">AI is Surgically Optimizing...</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Rewriting bullet points and injecting key terms</p>
            </div>
        );
    }

    if (!result && !error) {
       return (
         <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-10 overflow-hidden relative hover-levitate flex flex-col lg:flex-row items-center gap-10">
            <div className="max-w-md">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-500/10 rounded-2xl">
                        <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400 icon-spin-float" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Resume Optimizer</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">FAANG-Grade Professional Feedback</p>
                    </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
                   Ready to optimize your resume for the <span className="text-indigo-600 font-bold">{targetRole}</span> role? Our AI will rewrite weak bullet points and ensure you pass ATS filters.
                </p>
                <button 
                  onClick={handleOptimize}
                  className="px-10 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black hover:-translate-y-1 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-3"
                >
                   Optimize My Resume
                   <Sparkles className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 hidden lg:block opacity-20 transform rotate-6 scale-110">
               <FileText className="w-64 h-64" />
            </div>
         </div>
       );
    }

    if (error) {
        return (
            <div className="bg-rose-50 dark:bg-rose-500/5 rounded-[2.5rem] p-12 border border-rose-200/60 dark:border-rose-500/20 text-center">
                <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-400 mb-2">Optimization Failed</h3>
                <p className="text-rose-600/70 dark:text-rose-400/60 mb-6">{error}</p>
                <button onClick={handleOptimize} className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold flex items-center gap-2 mx-auto">
                    <RefreshCw className="w-4 h-4" /> Try Again
                </button>
            </div>
        );
    }

    const pdfData = {
        name: "Professional Candidate",
        title: targetRole,
        summary: result.overallSuggestion,
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-10 overflow-hidden relative">
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-1/3">
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
                        <h4 className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Optimized Score</h4>
                        <div className="flex items-end gap-3">
                            <span className="text-6xl font-black tabular-nums">{result.optimizedScore}</span>
                            <span className="text-indigo-400 font-bold mb-2">/100</span>
                        </div>
                        <div className="mt-8 space-y-3">
                            {Object.entries(result.scoreBreakdown).map(([key, val]) => (
                                <div key={key}>
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-indigo-300/60 mb-1">
                                        <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span>{val}</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-indigo-500" 
                                          style={{ width: `${(val / (key === 'atsMatch' ? 30 : 25)) * 100}%` }} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <PDFDownloadLink
                        document={<ResumePDF data={pdfData} />}
                        fileName={`Optimized_Resume_${targetRole.replace(/\s+/g, '_')}.pdf`}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 no-underline shadow-lg shadow-indigo-500/20"
                    >
                        {({ loading }) => loading ? 'Generating...' : (
                            <>
                                Download PDF Resume
                                <ExternalLink className="w-4 h-4" />
                            </>
                        )}
                    </PDFDownloadLink>
                </div>

                <div className="flex-1 space-y-6">
                    <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                           Surgical Bullet Rewrites
                           <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 text-[8px] rounded-full">High Impact</span>
                        </h4>
                        <div className="space-y-4">
                            {result.rewrittenBullets.map((bullet, i) => (
                                <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group">
                                    <div className="flex flex-col gap-4">
                                        <div className="text-sm text-slate-400 line-through italic">"{bullet.original}"</div>
                                        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border-l-4 border-emerald-500 flex gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <div className="text-slate-700 dark:text-slate-200 font-bold leading-relaxed">{bullet.rewritten}</div>
                                        </div>
                                        <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-tight bg-indigo-500/5 px-3 py-1 rounded-full w-fit">
                                            {bullet.reason}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Skill Injections</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.skillInjections.map((inj, i) => (
                                    <div key={i} className="px-3 py-1.5 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-400">
                                        + {inj.skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">ATS Keyword Gaps</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.atsKeywordGaps.map((keyword, i) => (
                                    <div key={i} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 rounded-lg text-xs font-bold text-rose-700 dark:text-rose-400">
                                        {keyword}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900 rounded-2xl text-slate-400 text-sm italic">
                        "{result.overallSuggestion}"
                    </div>
                </div>
            </div>
        </div>
    );
}
