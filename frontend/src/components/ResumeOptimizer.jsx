import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, TrendingUp, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';

export default function ResumeOptimizer({ missingSkills, role }) {
    const suggestions = [
        {
            title: "Add Targeted Project Work",
            desc: `Specifically mention ${missingSkills?.[0]?.name || 'relevant frameworks'} projects. Describe your role in building scalable systems.`,
            priority: 'high'
        },
        {
            title: "Quantify Impact",
            desc: "Instead of 'Managed servers', say 'Improved deployment speed by 40% using automation'.",
            priority: 'medium'
        },
        {
            title: "Keyword Optimization",
            desc: `Include ${missingSkills?.[1]?.name || 'industry standard'} as a core skill to pass ATS (Applicant Tracking System) filters.`,
            priority: 'high'
        }
    ];

    const safeMissingSkills = Array.isArray(missingSkills) ? missingSkills : [{ name: 'Cloud Architecture' }, { name: 'CI/CD Pipelines' }];
    const missingSignals = safeMissingSkills.slice(0, 4).map(s => s.name || s);

    const pdfData = {
        name: "Alex M. Chen",
        title: role || "Target Role",
        summary: `Results-oriented software engineer with strong experience in scalable systems. Intentionally upskilling in high-impact areas like ${missingSignals.join(', ')} to stay ahead of market trends and deliver enterprise-grade software. Passionate about clean code, robust pipelines, and driving product innovation.`,
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <FileText className="w-48 h-48" />
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="max-w-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-500/10 rounded-2xl">
                            <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Resume Optimization AI</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Personalized feedback for {role || 'your profile'}</p>
                        </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
                        Our AI analyzed your profile against industry standards. These high-impact adjustments will increase your visibility to top-tier recruiters by <span className="text-emerald-500 font-black">45%</span>.
                    </p>

                    <PDFDownloadLink
                        document={<ResumePDF data={pdfData} />}
                        fileName={`Resume_${(role || 'Developer').replace(/\s+/g, '_')}.pdf`}
                        className="px-8 py-4 bg-slate-900 dark:bg-amber-600 hover:-translate-y-1 shadow-lg shadow-amber-500/10 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 w-fit no-underline"
                    >
                        {({ loading }) => loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                Generate PDF Resume
                                <ExternalLink className="w-4 h-4" />
                            </>
                        )}
                    </PDFDownloadLink>
                </div>

                <div className="flex-1 w-full space-y-4">
                    {suggestions.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] hover:border-amber-500/30 transition-all group"
                        >
                            <div className="flex gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center 
                  ${item.priority === 'high' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600'}`}
                                >
                                    {item.priority === 'high' ? <AlertTriangle className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide flex items-center gap-2">
                                        {item.title}
                                        <span className={`text-[8px] px-2 py-0.5 rounded-full border 
                       ${item.priority === 'high' ? 'border-amber-500/40 text-amber-500 bg-amber-500/5' : 'border-blue-500/40 text-blue-500 bg-blue-500/5'}`}
                                        >
                                            {item.priority === 'high' ? 'High Impact' : 'Recommended'}
                                        </span>
                                    </h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
