import React, { useState, useEffect } from 'react';
import { PageView } from './types';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CommunityGuidelines from './components/CommunityGuidelines';
import AIProfileHelper from './components/AIProfileHelper';
import Testimonials from './components/Testimonials';
import DownloadSection from './components/DownloadSection';
import Footer from './components/Footer';
import WaitlistPage from './components/WaitlistPage';
import MatchmakerDemo from './components/MatchmakerDemo';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import DatePlanner from './components/DatePlanner';
import NearbyMap from './components/NearbyMap';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import SplashIntro from './components/SplashIntro';

// Pages
import { HowItWorks, Pricing } from './components/ProductPages';
import { About, Careers, Press, Contact, Privacy, Terms, Cookies, Safety } from './components/StaticPages';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [showSplash, setShowSplash] = useState(true);

  // Check if splash has been shown in this session
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('virgins_splash_seen');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('virgins_splash_seen', 'true');
    setShowSplash(false);
  };

  const renderPage = () => {
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
      case 'waitlist':
        return <WaitlistPage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignupPage onNavigate={setCurrentPage} />;
      case 'matchmaker':
        return <MatchmakerDemo />;
      case 'nearby':
        return <NearbyMap />;
      case 'date-planner':
        return <DatePlanner />;
      case 'admin':
        return <AdminDashboard />;
      case 'profile':
        return <UserProfile onNavigate={setCurrentPage} />;
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
        return <Hero onNavigate={setCurrentPage} />;
    }
  };

  if (showSplash) {
    return <SplashIntro onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
      {/* Hide footer on specialized pages for cleaner look. */}
      {currentPage !== 'waitlist' && 
       currentPage !== 'admin' && 
       currentPage !== 'profile' && 
       currentPage !== 'nearby' && 
       currentPage !== 'date-planner' && 
       currentPage !== 'login' &&
       currentPage !== 'signup' &&
       <Footer onNavigate={setCurrentPage} />}
    </div>
  );
};

export default App;