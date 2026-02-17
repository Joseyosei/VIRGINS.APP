import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function SplashIntro({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);
  const handleEnter = () => { setFadeOut(true); setTimeout(onComplete, 800); };

  return (
    <div data-testid="splash-intro" className={`fixed inset-0 z-[100] bg-navy-900 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-field-of-flowers-34440-large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/40 via-transparent to-navy-900" />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div className="animate-fadeIn space-y-6 max-w-3xl">
          <div className="w-24 h-24 rounded-full border-2 border-gold-500 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(212,165,116,0.4)] bg-navy-900/50 backdrop-blur-md">
            <span className="text-4xl font-serif text-gold-500 font-bold">V</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
            Love is worth <br /><span className="italic text-gold-400">waiting for.</span>
          </h1>
          <p className="text-xl text-cream font-light max-w-xl mx-auto leading-relaxed">
            Join a community of thousands dedicated to purity, tradition, and the sacred art of intentional courtship.
          </p>
          <div className="pt-10">
            <button data-testid="enter-app-btn" onClick={handleEnter}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gold-500 text-navy-900 rounded-full font-bold text-lg shadow-2xl hover:bg-gold-400 transition-all hover:scale-105 active:scale-95">
              Enter Virgins <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-12 flex items-center gap-8 text-[10px] font-bold text-gold-500/60 uppercase tracking-[0.3em]">
          <span>Traditional Values</span><span className="w-1.5 h-1.5 bg-gold-500/30 rounded-full" /><span>Verified Members</span><span className="w-1.5 h-1.5 bg-gold-500/30 rounded-full" /><span>Faith Centered</span>
        </div>
      </div>
    </div>
  );
}
