import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Github, Twitter, Linkedin } from 'lucide-react';
import UploadForm from './components/UploadForm';
import SkillTable from './components/SkillTable';
import GapSummary from './components/GapSummary';
import Roadmap from './components/Roadmap';
import ReasoningPanel from './components/ReasoningPanel';
import { AnimatedThemeToggler } from './components/ui/AnimatedThemeToggler';
import SkillGraph from './components/SkillGraph';
import SkillDNA from './components/SkillDNA';
import SignInAnimation from './components/SignInAnimation';
import { mockProfiles } from './data/mockData';

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* Gap Summary Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-8">
        <div className="animate-pulse flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-40 h-40 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
          <div className="flex-1 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2" />
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Table Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedProfile, setSelectedProfile] = useState(mockProfiles[0].id);
  const [currentData, setCurrentData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const profileOptions = mockProfiles.map((d) => ({ id: d.id, name: d.name }));

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setShowSkeleton(true);

    // Simulate analysis with loading
    setTimeout(() => {
      const data = mockProfiles.find((d) => d.id === selectedProfile);
      setCurrentData(data || null);
      setIsAnalyzing(false);
      setShowSkeleton(false);
      setShowResults(true);
    }, 2500);
  };

  const handleSignIn = () => {
    setIsSigningIn(true);
  };

  const handleSignInComplete = () => {
    setIsSigningIn(false);
    // Simulate redirect
    console.log("Redirecting to dashboard...");
    window.location.href = "#/dashboard"; // Example redirect
  };

  // Auto-load first profile for demo
  useEffect(() => {
    setCurrentData(mockProfiles[0]);
    setShowResults(true);
  }, []);

  return (
    <div className="min-h-screen bg-mesh-gradient selection:bg-indigo-500/30 dark:selection:bg-indigo-500/50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg ring-1 ring-white/20">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                  AI Onboarding Engine
                </h1>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">Skill Gap Analysis</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-4"
            >
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-tight">AI Active</span>
              </div>

              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

              <div className="flex items-center gap-1">
                <a href="#" className="p-2 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
              <AnimatedThemeToggler />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignIn}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow"
              >
                Sign In
              </motion.button>
            </motion.div>
          </div>
        </div>
      </nav>

      {isSigningIn && <SignInAnimation onComplete={handleSignInComplete} />}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20 rounded-full text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-6 uppercase tracking-wider ring-1 ring-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next Generation Analysis Engine</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
            Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500">Skill Gap</span> Analysis
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and job description to get a personalized skill analysis
            and learning roadmap tailored to your career goals.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-start">
          {/* Left Column - Upload Form */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <UploadForm
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              selectedProfile={selectedProfile}
              onProfileChange={setSelectedProfile}
              profileOptions={profileOptions}
            />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {showSkeleton ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                >
                  <SkeletonLoader />
                </motion.div>
              ) : showResults && currentData ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="space-y-8"
                >
                  {/* Role Header */}
                  <div className="overflow-hidden relative p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="text-center sm:text-left">
                        <p className="text-indigo-100/80 text-xs font-bold uppercase tracking-widest mb-1">Current Analysis Target</p>
                        <h3 className="text-3xl font-black tracking-tight mb-1">{currentData.role}</h3>
                        <p className="text-indigo-100/90 font-medium">{currentData.company}</p>
                      </div>
                      <div className="flex flex-col items-center sm:items-end">
                        <div className="bg-white/15 backdrop-blur-md px-6 py-3 rounded-3xl ring-1 ring-white/30 text-center">
                          <p className="text-indigo-50/80 text-[10px] font-bold uppercase tracking-widest mb-0.5">Readiness Score</p>
                          <p className="text-4xl font-black tabular-nums">{currentData.readinessScore}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-8">
                    <GapSummary
                      readinessScore={currentData.readinessScore}
                      matchPercentage={currentData.matchPercentage}
                      missingSkills={currentData.missingSkills}
                      weakSkills={currentData.weakSkills}
                    />
                    <SkillDNA userSkills={currentData.skills} />
                    <SkillGraph skills={currentData.skills} graphData={currentData.skillGraph} />
                    <SkillTable skills={currentData.skills} />
                    <Roadmap roadmap={currentData.roadmap} />
                    <ReasoningPanel reasoning={currentData.reasoning} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-12 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 h-[400px]"
                >
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to Start?</h3>
                  <p className="text-slate-500 dark:text-slate-400">Select a demo profile or upload your documents to begin the analysis.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 mt-24 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 dark:bg-indigo-600 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">AI Onboarding Engine</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Empowering Careers with AI</p>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Documentation</a>
            </div>

            <div className="flex items-center gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-full hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">© 2024 ArtPark CodeForge Hackathon • Built with Passion</p>
          </div>
        </div>
      </footer>
    </div>
  );
}