import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CommunityGuidelines from './components/CommunityGuidelines';
import AIProfileHelper from './components/AIProfileHelper';
import Testimonials from './components/Testimonials';
import DownloadSection from './components/DownloadSection';
import Footer from './components/Footer';
import WaitlistPage from './components/OnboardingFlow';
import MatchmakerDemo from './components/MatchmakerDemo';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import DatePlanner from './components/DatePlanner';
import NearbyMap from './components/NearbyMap';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import SplashIntro from './components/SplashIntro';
import LikesScreen from './components/LikesScreen';
import MembershipPage from './components/MembershipPage';
import { HowItWorks, Pricing } from './components/ProductPages';
import { About, Careers, Press, Contact, Privacy, Terms, Cookies, Safety } from './components/StaticPages';

function AppInner() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('virgins_splash_seen');
    if (hasSeenSplash) setShowSplash(false);
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('virgins_splash_seen', 'true');
    setShowSplash(false);
    setCurrentPage(user ? 'matchmaker' : 'home');
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
        return <MatchmakerDemo onNavigate={setCurrentPage} />;
      case 'nearby':
        return <NearbyMap />;
      case 'date-planner':
        return <DatePlanner />;
      case 'admin':
        return <AdminDashboard />;
      case 'profile':
        return <UserProfile onNavigate={setCurrentPage} />;
      case 'likes':
        return <LikesScreen onNavigate={setCurrentPage} />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gold-500 font-serif text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (showSplash) {
    return <SplashIntro onComplete={handleSplashComplete} />;
  }

  const hiddenFooterPages = ['waitlist', 'admin', 'profile', 'nearby', 'date-planner', 'login', 'signup', 'matchmaker', 'likes'];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
      {!hiddenFooterPages.includes(currentPage) && <Footer onNavigate={setCurrentPage} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
