import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import AIProfileHelper from './components/AIProfileHelper';
import Testimonials from './components/Testimonials';
import DownloadSection from './components/DownloadSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main>
        <Hero />
        <Features />
        <AIProfileHelper />
        <Testimonials />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;