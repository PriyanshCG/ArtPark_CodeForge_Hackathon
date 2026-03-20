import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Github, Chrome, Brain, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const { login, demoLogin } = useAuth();

    useEffect(() => {
        // Detect auth success in URL and close modal
        const params = new URLSearchParams(window.location.search);
        if (params.get('auth') === 'success') {
            onLoginSuccess();
        }
    }, [onLoginSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // For now, let's just trigger Google login for everything or keep mock for email
        // but for the sake of the task, let's keep it simple
        login();
    };

    const handleGoogleLogin = () => {
        login();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xl"
                >
                    {/* Animated Background Orbs for the Modal */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                                x: [0, 50, 0]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[20%] left-[20%] w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px]"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.2, 0.4, 0.2],
                                x: [0, -50, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-violet-500/30 rounded-full blur-[100px]"
                        />
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 40, rotateX: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40, rotateX: -10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="w-full max-w-[440px] relative z-10 perspective-1000"
                    >
                        {/* Glossy Card Container */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)] border border-white/50 dark:border-slate-700/50 overflow-hidden relative">

                            {/* Internal Gradient Glow */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

                            {/* Modal Header */}
                            <div className="absolute top-0 right-0 p-6 z-20">
                                <button
                                    onClick={onClose}
                                    className="p-2.5 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all hover:scale-110 active:scale-95 text-slate-500 dark:text-slate-400 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-700/50 group"
                                >
                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>

                            <div className="p-8 sm:p-10 pt-12 relative z-10">
                                {/* Brand Logo/Icon Indicator */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-[-4px] rounded-full border border-dashed border-indigo-500/30"
                                        />
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform rotate-3 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-2xl" />
                                            <Brain className="w-8 h-8 text-white relative z-10 drop-shadow-md" />
                                            <Sparkles className="absolute top-2 right-2 w-3 h-3 text-indigo-200 animate-pulse" />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {mode === 'login' ? 'Welcome Back' : 'Join the Elite'}
                                    </h2>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
                                        {mode === 'login' ? 'Authenticate to deploy your AI engine.' : 'Create your digital twin profile today.'}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {mode === 'signup' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, y: -20 }}
                                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                exit={{ opacity: 0, height: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="Full Name"
                                                        className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-indigo-500/30 transition-all font-medium placeholder:text-slate-400 shadow-sm"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Email Address"
                                                className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-indigo-500/30 transition-all font-medium placeholder:text-slate-400 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Password"
                                                className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-indigo-500/30 transition-all font-medium placeholder:text-slate-400 shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {mode === 'login' && (
                                        <div className="flex justify-end pt-1">
                                            <button type="button" className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full mt-2 relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                        <span>{mode === 'login' ? 'Initiate Session' : 'Create Access Key'}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </form>

                                <div className="relative my-8 text-center">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                                    </div>
                                    <div className="relative inline-block px-4 bg-white dark:bg-slate-900 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-full border border-slate-200 dark:border-slate-800 py-1">
                                        Or neural link with
                                    </div>
                                </div>

                                {/* Social Logins */}
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleGoogleLogin}
                                        className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 rounded-2xl hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/10 transition-all font-bold text-sm text-slate-700 dark:text-slate-300"
                                    >
                                        <Chrome className="w-5 h-5 text-[#4285F4]" />
                                        <span className="tracking-wide">Google</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleGoogleLogin}
                                        className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/50 rounded-2xl hover:border-slate-900 dark:hover:border-white/30 hover:shadow-md transition-all font-bold text-sm text-slate-700 dark:text-slate-300"
                                    >
                                        <Github className="w-5 h-5 text-slate-900 dark:text-white" />
                                        <span className="tracking-wide">GitHub</span>
                                    </motion.button>
                                </div>

                                {/* Demo Login for Judges */}
                                <div className="mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            demoLogin();
                                            onClose();
                                        }}
                                        className="w-full relative overflow-hidden py-4 px-6 bg-gradient-to-br from-[#b8860b] via-[#daa520] to-[#b8860b] text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_8px_32px_rgba(184,134,11,0.3)] hover:shadow-[0_12px_48px_rgba(184,134,11,0.5)] transition-all border border-amber-400/50 flex items-center justify-center gap-3 group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                                        <Sparkles className="w-4 h-4 text-slate-900 group-hover:rotate-12 transition-transform" />
                                        <span>Judge Demo Access</span>
                                        <Sparkles className="w-4 h-4 text-slate-900 group-hover:-rotate-12 transition-transform" />
                                    </motion.button>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-3 font-bold uppercase tracking-widest opacity-60">
                                        * Instant full experience for hackathon reviewers
                                    </p>
                                </div>

                                <div className="mt-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        {mode === 'login' ? "New to the platform? " : "Returning agent? "}
                                    </span>
                                    <button
                                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                        className="text-xs text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider hover:text-indigo-700 dark:hover:text-indigo-300 ml-1 underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-500 transition-all"
                                    >
                                        {mode === 'login' ? 'Register Now' : 'Sign In Here'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
