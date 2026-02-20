import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lightbulb, PlayCircle, X, CheckSquare, MessageCircle, Mic, Star } from 'lucide-react';

export default function InterviewPrep({ skills, role }) {
    const [isActive, setIsActive] = useState(false);
    const [currentType, setCurrentType] = useState('questions'); // 'questions', 'mock'

    const mockQuestions = [
        {
            q: `Explain the fundamental architecture behind ${role}?`,
            a: `The architecture involves understanding data flow, component lifecycle, and state management specifically tailored for scales.`
        },
        {
            q: `How would you optimize performance in a high-traffic ${role} environment?`,
            a: `Key strategies include code splitting, tree shaking, caching layes, and optimizing build pipelines.`
        },
        {
            q: `What is the most challenging part of working with ${skills[0]?.name || 'relevant frameworks'}?`,
            a: `Managing side effects and ensuring type safety at scale is often cited as the biggest challenge.`
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-500/30 overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 bg-white/15 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-xl shadow-black/10">
                    <Terminal className="w-10 h-10 text-white" />
                </div>

                <div>
                    <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">Interview Preparation Mode</h3>
                    <p className="max-w-md text-indigo-100/80 mx-auto font-medium">Ready for the spotlight? Generate mock interviews and expert questions based on your unique skill profile.</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                    <button
                        onClick={() => { setIsActive(true); setCurrentType('questions') }}
                        className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all flex items-center gap-3"
                    >
                        <CheckSquare className="w-5 h-5" />
                        Generate Expert Q&A
                    </button>
                    <button
                        onClick={() => { setIsActive(true); setCurrentType('mock') }}
                        className="px-8 py-4 bg-transparent border-2 border-white/40 text-white rounded-2xl font-black hover:bg-white/10 transition-all flex items-center gap-3"
                    >
                        <PlayCircle className="w-5 h-5" />
                        Start Mock Interview
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed inset-0 z-[80] flex items-center justify-center p-6 backdrop-blur-2xl bg-slate-900/60"
                    >
                        <motion.div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden flex flex-col h-[650px]">
                            {/* Modal Header */}
                            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-2xl">
                                        {currentType === 'questions' ? <MessageCircle className="w-6 h-6 text-indigo-600" /> : <Mic className="w-6 h-6 text-indigo-600" />}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                            {currentType === 'questions' ? 'Expert Interview Q&A' : 'AI Mock Interview'}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Personalized for {role}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsActive(false)} className="p-3 hover:bg-slate-200/50 dark:hover:bg-slate-700 rounded-2xl transition-all">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                                {currentType === 'questions' ? (
                                    mockQuestions.map((q, i) => (
                                        <div key={i} className="group">
                                            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all">
                                                <h5 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-start gap-3">
                                                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">Q.</span>
                                                    {q.q}
                                                </h5>
                                                <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-800/50 text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                                    <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 opacity-60">
                                                        <Lightbulb className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Master Answer</span>
                                                    </div>
                                                    {q.a}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                                            <div className="relative w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center border-8 border-white dark:border-slate-800 transition-all shadow-xl shadow-indigo-500/20">
                                                <Mic className="w-12 h-12 text-white animate-bounce" />
                                            </div>
                                        </div>
                                        <h5 className="text-2xl font-black text-slate-900 dark:text-white">Listening... Speak Clearly</h5>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-sm">"Explain your approach to building highly scalable {role} infrastructures."</p>
                                        <div className="flex items-center gap-4">
                                            <button className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">End Session</button>
                                            <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">Score My Answer</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    Mode: {currentType === 'questions' ? 'Active' : 'Real-time Simulation'}
                                </div>
                                <button onClick={() => setIsActive(false)} className="px-8 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black transition-all">Close Dashboard</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
