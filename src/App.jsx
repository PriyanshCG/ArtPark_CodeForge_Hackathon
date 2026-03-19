import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Github, Twitter, Linkedin } from 'lucide-react';
import UploadForm from './components/UploadForm';
import SkillTable from './components/SkillTable';
import GapSummary from './components/GapSummary';
import Roadmap from './components/Roadmap';
import ReasoningPanel from './components/ReasoningPanel';
import SignInAnimation from './components/SignInAnimation';
import { mockProfiles } from './data/mockData';

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* Gap Summary Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8">
        <div className="animate-pulse flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-40 h-40 bg-slate-200 rounded-full" />
          </div>
          <div className="flex-1 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-slate-100 rounded-xl">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
                <div className="h-8 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Skills Table Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-24 h-4 bg-slate-200 rounded" />
              <div className="flex-1 h-4 bg-slate-200 rounded" />
              <div className="w-20 h-8 bg-slate-200 rounded" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl blur-lg opacity-50" />
                <div className="relative p-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  AI Onboarding Engine
                </h1>
                <p className="text-xs text-slate-500">Skill Gap Analysis & Learning Paths</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg border border-indigo-100">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-700">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <a href="#" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-full text-sm font-medium text-indigo-700 mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Advanced AI</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Bridge Your <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Skill Gaps</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your resume and job description to get a personalized skill analysis 
            and learning roadmap tailored to your career goals.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <UploadForm
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                selectedProfile={selectedProfile}
                onProfileChange={setSelectedProfile}
                profileOptions={profileOptions}
              />
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {showSkeleton ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SkeletonLoader />
                </motion.div>
              ) : showResults && currentData ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Role Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl text-white"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-100 text-sm">Analyzing for</p>
                        <h3 className="text-xl font-bold">{currentData.role}</h3>
                        <p className="text-indigo-200 text-sm">{currentData.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-indigo-100 text-sm">Readiness Score</p>
                        <p className="text-3xl font-bold">{currentData.readinessScore}%</p>
                      </div>
                    </div>
                  </motion.div>

                  <GapSummary
                    readinessScore={currentData.readinessScore}
                    matchPercentage={currentData.matchPercentage}
                    missingSkills={currentData.missingSkills}
                    weakSkills={currentData.weakSkills}
                  />
                  <SkillTable skills={currentData.skills} />
                  <Roadmap roadmap={currentData.roadmap} />
                  <ReasoningPanel reasoning={currentData.reasoning} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Brain className="w-5 h-5" />
              <span className="text-sm">AI Onboarding Engine © 2024</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}