import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, XCircle, ChevronRight, Brain, AlertTriangle } from 'lucide-react';

export default function SkillQuiz({ step, onComplete, onCancel }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    // Mock quiz data based on the step title
    const mockQuiz = [
        {
            question: `Which concept is most fundamental to ${step.title}?`,
            options: ["Core Syntax", "Advanced Patterns", "Standard Libraries", "Ecosystem Integration"],
            correct: 0
        },
        {
            question: `What is the primary benefit of mastering ${step.title}?`,
            options: ["Higher Salary", "Better Performance", "Faster Development", "All of the above"],
            correct: 3
        },
        {
            question: `When should you NOT use ${step.title}?`,
            options: ["In large scale apps", "For simple tasks", "When performance is critical", "In production"],
            correct: 1
        }
    ];

    const handleAnswer = (index) => {
        setSelectedAnswer(index);
        if (index === mockQuiz[currentQuestion].correct) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentQuestion < mockQuiz.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
            } else {
                setShowResult(true);
            }
        }, 800);
    };

    const finalScorePercent = Math.round((score / mockQuiz.length) * 100);
    const passed = finalScorePercent >= 70;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/60">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden"
            >
                {!showResult ? (
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl">
                                    <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Adaptive Quiz</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Question {currentQuestion + 1} of {mockQuiz.length}</p>
                                </div>
                            </div>
                            <button
                                onClick={onCancel}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <XCircle className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="mb-8">
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                {mockQuiz[currentQuestion].question}
                            </h4>
                            <div className="space-y-3">
                                {mockQuiz[currentQuestion].options.map((option, i) => (
                                    <button
                                        key={i}
                                        disabled={selectedAnswer !== null}
                                        onClick={() => handleAnswer(i)}
                                        className={`w-full p-4 rounded-2xl text-left font-medium transition-all border-2
                      ${selectedAnswer === i
                                                ? (i === mockQuiz[currentQuestion].correct ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400')
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {selectedAnswer === i && (
                                                i === mockQuiz[currentQuestion].correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestion + 1) / mockQuiz.length) * 100}%` }}
                                className="h-full bg-indigo-500"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-center">
                        <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-xl 
              ${passed ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}
                        >
                            {passed ? <Target className="w-12 h-12 text-white" /> : <AlertTriangle className="w-12 h-12 text-white" />}
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                            {passed ? 'Assessment Passed!' : 'Further Review Needed'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">
                            Your score: <span className="font-black text-slate-900 dark:text-white">{finalScorePercent}%</span>.
                            {passed
                                ? 'Adaptive engine is fast-tracking your roadmap.'
                                : 'Adaptive engine is adding a remedial module to your path.'}
                        </p>
                        <button
                            onClick={() => onComplete(passed)}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                        >
                            Update Roadmap
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
