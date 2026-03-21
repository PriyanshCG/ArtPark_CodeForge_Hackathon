import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import ProblemSection from '../components/landing/ProblemSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import DemoPreview from '../components/landing/DemoPreview';
import ImpactSection from '../components/landing/ImpactSection';
import TechStack from '../components/landing/TechStack';
import Testimonials from '../components/landing/Testimonials';
import TrustStrip from '../components/landing/TrustStrip';
import PricingSection from '../components/landing/PricingSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function LandingPage({ darkMode, toggleDark }) {
  return (
    <main className="bg-[#07080f] dark:bg-[#07080f] text-white overflow-hidden min-h-screen relative font-sans">
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>

      <Navbar darkMode={darkMode} toggleDark={toggleDark} />
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <DemoPreview />
      <ImpactSection />
      <TechStack />
      <Testimonials />
      <TrustStrip />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
