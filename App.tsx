import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import AIProfileHelper from './components/AIProfileHelper';
import Testimonials from './components/Testimonials';
import DownloadSection from './components/DownloadSection';
import Footer from './components/Footer';
import CommunityGuidelines from './components/CommunityGuidelines';
import { 
  About, 
  Careers, 
  Press, 
  Contact, 
  Privacy, 
  Terms, 
  Cookies, 
  Safety 
} from './components/StaticPages';
import { HowItWorks, Pricing } from './components/ProductPages';
import { PageView } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <main>
            <Hero onNavigate={setCurrentPage} />
            <Features />
            <CommunityGuidelines />
            <AIProfileHelper />
            <Testimonials />
            <DownloadSection />
          </main>
        );
      case 'how-it-works':
        return <HowItWorks onNavigate={setCurrentPage} />;
      case 'pricing':
        return <Pricing onNavigate={setCurrentPage} />;
      case 'about':
        return <About />;
      case 'careers':
        return <Careers />;
      case 'press':
        return <Press />;
      case 'contact':
        return <Contact />;
      case 'privacy':
        return <Privacy />;
      case 'terms':
        return <Terms />;
      case 'cookies':
        return <Cookies />;
      case 'safety':
        return <Safety />;
      default:
        return (
          <main>
            <Hero onNavigate={setCurrentPage} />
            <Features />
            <DownloadSection />
          </main>
        );
    }
  };

  return (
    <div className="app-container min-h-screen bg-white font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      {renderContent()}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}