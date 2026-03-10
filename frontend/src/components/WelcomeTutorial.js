import React, { useState } from 'react';
import { Heart, MapPin, Calendar, Sparkles, Shield, ArrowRight, X, Compass, Star, Users } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    icon: <Compass size={48} className="text-gold-500" />,
    title: 'Discover Your Match',
    description: 'Our Covenant Algorithm finds people who share your faith, values, and marriage intentions. Every profile is scored on theological alignment.',
    bg: 'bg-navy-900',
    accent: 'text-gold-500',
  },
  {
    icon: <Heart size={48} className="text-rose-400" />,
    title: 'See Who Likes You',
    description: "Other apps charge $30/month for this. On Virgins, it's always FREE. See everyone who's interested and like them back to match.",
    bg: 'bg-navy-900',
    accent: 'text-rose-400',
    badge: 'FREE Forever',
  },
  {
    icon: <MapPin size={48} className="text-blue-400" />,
    title: 'Find Nearby Members',
    description: 'See verified singles in your area in real-time. Enable location to discover who shares your community and faith nearby.',
    bg: 'bg-navy-900',
    accent: 'text-blue-400',
  },
  {
    icon: <Calendar size={48} className="text-emerald-400" />,
    title: 'Plan & Get Off The App',
    description: "We want you to meet in real life! Use our Date Planner to pick a venue, set a date, and take the conversation offline. That's the goal.",
    bg: 'bg-navy-900',
    accent: 'text-emerald-400',
  },
  {
    icon: <Shield size={48} className="text-gold-500" />,
    title: 'Safe & Verified',
    description: 'Every profile is reviewed. Zero tolerance for harassment. Your privacy is protected with Safe Mode and Ghost Mode.',
    bg: 'bg-navy-900',
    accent: 'text-gold-500',
  },
];

export default function WelcomeTutorial({ onComplete }) {
  const [step, setStep] = useState(0);
  const isLast = step === TUTORIAL_STEPS.length - 1;
  const current = TUTORIAL_STEPS[step];

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div data-testid="welcome-tutorial" className="fixed inset-0 z-[200] bg-navy-900 flex flex-col">
      {/* Skip button */}
      <div className="absolute top-6 right-6 z-10">
        <button data-testid="tutorial-skip" onClick={handleSkip}
          className="text-white/50 text-sm font-bold hover:text-white transition-colors px-4 py-2">
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-fadeIn" key={step}>
        {/* Icon with glow */}
        <div className="relative mb-10">
          <div className="absolute inset-0 blur-3xl opacity-20 scale-150" style={{ background: 'radial-gradient(circle, currentColor, transparent)' }} />
          <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
            {current.icon}
          </div>
          {current.badge && (
            <span className="absolute -top-2 -right-4 bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              {current.badge}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-black text-white mb-4 tracking-tight leading-tight max-w-sm">
          {current.title}
        </h1>
        <p className="text-base text-slate-400 max-w-md leading-relaxed">
          {current.description}
        </p>
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-10">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {TUTORIAL_STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
              i === step ? 'w-8 bg-gold-500' : i < step ? 'w-4 bg-gold-500/50' : 'w-4 bg-white/10'
            }`} />
          ))}
        </div>

        {/* Next button */}
        <button data-testid="tutorial-next" onClick={handleNext}
          className="w-full max-w-sm mx-auto py-5 bg-gold-500 text-navy-900 rounded-2xl font-bold text-lg shadow-xl hover:bg-gold-400 transition-all flex items-center justify-center gap-3 active:scale-95">
          {isLast ? (
            <>Start Discovering <Sparkles size={20} /></>
          ) : (
            <>Continue <ArrowRight size={20} /></>
          )}
        </button>

        {/* Step counter */}
        <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-widest mt-4">
          {step + 1} of {TUTORIAL_STEPS.length}
        </p>
      </div>
    </div>
  );
}
