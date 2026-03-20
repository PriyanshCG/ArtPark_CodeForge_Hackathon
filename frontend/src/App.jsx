import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Github, Twitter, Linkedin, Sun, Moon } from 'lucide-react';
import UploadForm from './components/UploadForm';
import SkillTable from './components/SkillTable';
import GapSummary from './components/GapSummary';
import Roadmap from './components/Roadmap';
import ReasoningPanel from './components/ReasoningPanel';
import SkillGraph from './components/SkillGraph';
import SkillDNA from './components/SkillDNA';
import SignInAnimation from './components/SignInAnimation';
import { mockProfiles } from './data/mockData';
import SemanticMatcher from './lib/semanticMatcher';
import MentorChat from './components/MentorChat';
import InterviewPrep from './components/InterviewPrep';
import ResumeOptimizer from './components/ResumeOptimizer';
import AuthModal from './components/AuthModal';
import { useAuth } from './lib/AuthContext';

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* Semantic AI Status Banner */}
      <div className="bg-indigo-600 rounded-3xl p-6 flex items-center justify-between text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="flex items-center gap-4 relative">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Semantic AI Matching Active</h3>
            <p className="text-sm text-indigo-100/80">Comparing skill meanings (e.g., Deep Learning ≈ Neural Networks)</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest animate-pulse">
            Embedding Check...
          </div>
        </div>
      </div>

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
  const [learningStyle, setLearningStyle] = useState('Practical'); // 'Visual', 'Practical', 'Theoretical'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { user, isLoggedIn, logout: authLogout } = useAuth();

  const toggleLearningStyle = (style) => setLearningStyle(style);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Seed data for Demo Judge user
  useEffect(() => {
    if (user?.id === 'DEMO_12345' && !currentData) {
      setCurrentData(mockProfiles[0]);
      setShowResults(true);
    }
  }, [user, currentData]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const profileOptions = mockProfiles.map((d) => ({ id: d.id, name: d.name }));

  const handleAnalyze = (finalResult) => {
    setIsAnalyzing(false);
    setShowSkeleton(false);

    // If it's demo data, it might already be mapped
    if (finalResult.id === 'demo-fullstack') {
      setCurrentData(finalResult);
      setShowResults(true);
      return;
    }

    // Combine matched and missing skills for display
    const allSkills = [
      ...(finalResult.skillGap?.matched_skills || []).map(s => ({
        name: s.skill,
        requiredLevel: 3, // Default or extracted
        yourLevel: s.resume_proficiency === 'expert' ? 4 : s.resume_proficiency === 'advanced' ? 3 : s.resume_proficiency === 'intermediate' ? 2 : 1,
        status: 'matched',
        category: 'Technical'
      })),
      ...(finalResult.skillGap?.missing_skills || []).map(s => ({
        name: s.skill,
        requiredLevel: 3,
        yourLevel: 0,
        status: 'missing',
        category: 'Technical'
      }))
    ];

    // Map backend data to frontend state
    const mappedData = {
      role: finalResult.jdProfile?.role_title || "Target Role",
      company: finalResult.jdProfile?.company_name || "Target Company",
      readinessScore: finalResult.skillGap?.overall_readiness_score || 0,
      matchPercentage: finalResult.skillGap?.overall_readiness_score || 0,
      missingSkills: (finalResult.skillGap?.missing_skills || []).length,
      weakSkills: (finalResult.skillGap?.proficiency_gaps || []).length,
      skills: allSkills,
      reasoning: (finalResult.skillGap?.missing_skills || []).map(s => ({
        skill: s.skill,
        reason: `Required for the role but not found in your profile. Priority: ${s.priority}.`,
        type: 'missing'
      })).concat((finalResult.skillGap?.proficiency_gaps || []).map(s => ({
        skill: s.skill,
        reason: `Proficiency gap detected. Role requires ${s.required_level}, you have ${s.current_level}.`,
        type: 'weak'
      }))),
      roadmap: (finalResult.pathway || []).map(step => ({
        step: step.sequence,
        title: step.course_title,
        description: step.learning_tips,
        duration: `${step.estimated_hours}h`,
        priority: step.priority,
        status: 'todo',
        reason: step.reasoning?.why_included
      })),
      coachingNote: finalResult.coachingNote,
      targetJob: finalResult.jdProfile?.role_title
    };

    setCurrentData(mappedData);
    setShowResults(true);
  };

  const handleRoadmapUpdate = (index, updates) => {
    setCurrentData(prev => {
      const newRoadmap = [...prev.roadmap];
      newRoadmap[index] = { ...newRoadmap[index], ...updates };
      return { ...prev, roadmap: newRoadmap };
    });
  };

  const handleAssessment = (step) => {
    const passed = window.confirm(`Take Assessment for: ${step.title}\n\n(OK = You Pass, Cancel = You Fail)`);

    setCurrentData(prev => {
      const index = prev.roadmap.findIndex(s => s.title === step.title);
      const newRoadmap = [...prev.roadmap];

      if (passed) {
        alert("Assessment Passed! Adaptive engine is skipping related prerequisite steps...");
        newRoadmap[index] = {
          ...newRoadmap[index],
          status: 'completed',
          reason: `Assessment passed with 95% score. Verified mastery of ${step.title}.`
        };
        // Skip next step as an adaptive measure
        if (newRoadmap[index + 1]) {
          newRoadmap[index + 1] = {
            ...newRoadmap[index + 1],
            status: 'skipped',
            reason: `Skipped because user demonstrated advanced knowledge in prerequisite assessment.`
          };
        }
      } else {
        alert("Assessment Failed. Adaptive engine is injecting a remedial review step...");
        // Inject a remedial step
        const remedialStep = {
          step: '!',
          title: `Remedial: ${step.title} Fundamentals`,
          description: `Extra focus on core concepts to bridge the gap identified in the assessment.`,
          duration: '1 week',
          priority: 'high',
          status: 'todo',
          reason: 'Injected by Adaptive Engine due to assessment performance below 70% threshold.'
        };
        newRoadmap.splice(index, 0, remedialStep);
      }

      return { ...prev, roadmap: newRoadmap };
    });
  };

  const handleSignIn = () => {
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    setIsSigningIn(true);
  };

  const handleSignInComplete = () => {
    setIsSigningIn(false);
    // Simulate redirect
    console.log("Redirecting to dashboard...");
  };

  // Initial demo data loading removed to prefer real logic
  useEffect(() => {
    // If we want a demo state, we could set a flag or just keep it empty
    // For this task, we want real API data
  }, []);

  return (
    <div className="min-h-screen bg-mesh-gradient selection:bg-indigo-500/30 dark:selection:bg-indigo-500/50 transition-colors duration-300 dark:bg-slate-950">
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

              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 group"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                )}
              </button>

              <div className="hidden sm:flex items-center gap-1">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</p>
                    <button onClick={authLogout} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors">Sign Out</button>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 overflow-hidden bg-indigo-100 flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <Brain className="w-5 h-5 text-indigo-500" />
                    )}
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignIn}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow"
                >
                  Sign In
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
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
                    {/* Progress Dashboard */}
                    {(() => {
                      const roadmap = currentData.roadmap || [];
                      const completedCount = roadmap.filter(s => s.status === 'completed' || s.status === 'skipped').length;
                      const progress = roadmap.length > 0 ? (completedCount / roadmap.length) * 100 : 0;

                      const remainingSteps = roadmap.filter(s => s.status === 'todo');
                      const totalWeeks = remainingSteps.reduce((acc, s) => acc + parseInt(s.duration || 0), 0);
                      const displayTime = totalWeeks > 0 ? `${totalWeeks} Weeks` : 'Ready!';

                      const skills = currentData.skills || [];
                      const confidence = Math.round(
                        (skills.reduce((acc, s) => acc + (s.yourLevel / s.requiredLevel), 0) / (skills.length || 1)) * 100
                      );

                      return (
                        <GapSummary
                          readinessScore={currentData.readinessScore}
                          matchPercentage={currentData.matchPercentage}
                          missingSkills={currentData.missingSkills}
                          weakSkills={currentData.weakSkills}
                          totalTime={displayTime}
                          roadmapProgress={progress}
                          skillConfidence={confidence}
                          marketTrends={currentData.marketTrends}
                          learningStyle={learningStyle}
                          onStyleChange={toggleLearningStyle}
                        />
                      );
                    })()}

                    <SkillDNA userSkills={currentData.skills} />
                    <SkillGraph skills={currentData.skills} graphData={currentData.skillGraph} />
                    <SkillTable skills={currentData.skills} />

                    {/* Career Accelerator Tools */}
                    <div className="grid gap-8 lg:grid-cols-1">
                      <InterviewPrep
                        skills={currentData.skills}
                        role={currentData.targetJob || currentData.role}
                      />
                      <ResumeOptimizer
                        missingSkills={currentData.missingSkills}
                        role={currentData.targetJob || currentData.role}
                      />
                    </div>
                    <Roadmap
                      roadmap={currentData.roadmap}
                      onUpdate={handleRoadmapUpdate}
                      onAssessment={handleAssessment}
                      learningStyle={learningStyle}
                    />
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

      {/* AI Mentor Chatbot */}
      <MentorChat userData={currentData} />
    </div>
  );
}