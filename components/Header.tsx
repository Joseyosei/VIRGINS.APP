import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, MapPin, Calendar, Gem, User, CheckCircle, Compass, Sparkles } from 'lucide-react';
import { PageView } from '../types';

interface HeaderProps {
  onNavigate: (page: PageView) => void;
  currentPage: PageView;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [beans] = useState(250); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const navItemClass = (page: PageView) => 
    `group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ${
      currentPage === page 
        ? 'bg-navy-900 text-gold-500 shadow-[0_0_20px_rgba(212,165,116,0.3)] scale-105' 
        : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/80'
    }`;

  const RingsLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="45" r="22" stroke="#D4A574" strokeWidth="5" />
      <circle cx="65" cy="45" r="22" stroke="#D4A574" strokeWidth="5" />
      <path d="M50 12 L60 28 L50 44 L40 28 Z" fill="#D4A574" stroke="white" strokeWidth="1" />
    </svg>
  );

  return (
    <header className="fixed w-full z-50 transition-all duration-700 px-4 pt-6">
      <div className={`max-w-7xl mx-auto transition-all duration-700 ${scrolled ? 'translate-y-[-8px]' : ''}`}>
        <div className={`flex justify-between items-center px-6 py-3.5 rounded-[2.5rem] border transition-all duration-700 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-2xl border-white/20' 
            : 'bg-white/60 backdrop-blur-md border-white/40'
        }`}>
          
          {/* Logo Section */}
          <div className="flex items-center">
            <button onClick={() => handleNav('home')} className="flex items-center gap-3 group">
              <div className="relative">
                <RingsLogo className="h-10 w-auto group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <span className="hidden md:block text-2xl font-serif font-black tracking-widest uppercase text-navy-900">
                Virgins
              </span>
            </button>
          </div>

          {/* Desktop Navigation - Elite Pill Design */}
          <nav className="hidden lg:flex items-center bg-slate-400/10 p-1 rounded-full border border-white/30 backdrop-blur-2xl">
            <button onClick={() => handleNav('matchmaker')} className={navItemClass('matchmaker')}>
              <Compass size={16} className={currentPage === 'matchmaker' ? 'animate-spin-slow' : ''} /> Discover
            </button>
            <button onClick={() => handleNav('nearby')} className={navItemClass('nearby')}>
              <MapPin size={16} /> Nearby
            </button>
            <button onClick={() => handleNav('date-planner')} className={navItemClass('date-planner')}>
              <Calendar size={16} /> Plan Date
            </button>
            <div className="w-px h-5 bg-slate-300/50 mx-2" />
            <button onClick={() => handleNav('pricing')} className={navItemClass('pricing')}>
              <Gem size={14} /> Membership
            </button>
          </nav>
          
          {/* Actions & Premium Status */}
          <div className="flex items-center gap-2 md:gap-5">
            <button 
              onClick={() => handleNav('profile')}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-gold-50 to-white px-5 py-2.5 rounded-full text-gold-700 font-bold text-xs border border-gold-200/50 hover:border-gold-400 transition-all shadow-sm active:scale-95"
            >
              <Sparkles size={14} className="text-gold-500" />
              <span className="tabular-nums">{beans}</span>
              <span className="opacity-40 uppercase tracking-tighter">Beans</span>
            </button>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleNav('login')}
                className="hidden sm:block text-sm font-bold text-slate-500 hover:text-navy-900 px-3 transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => handleNav('signup')}
                className="group relative overflow-hidden px-7 py-3 rounded-full shadow-2xl transition-all hover:scale-105 hover:-translate-y-0.5 active:scale-95"
              >
                <div className="absolute inset-0 bg-navy-900 transition-colors group-hover:bg-navy-800"></div>
                <span className="relative z-10 text-sm font-bold text-white tracking-wide">Get Started</span>
              </button>
              
              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className="lg:hidden p-2.5 rounded-full bg-navy-900 text-gold-500 shadow-xl"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - Ultra Modern Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-navy-900/95 backdrop-blur-3xl lg:hidden p-8 flex flex-col animate-fadeIn">
          <div className="flex justify-between items-center mb-16">
             <div className="flex items-center gap-3">
               <RingsLogo className="h-10 w-auto" />
               <span className="text-3xl font-serif font-black text-white tracking-widest uppercase">Virgins</span>
             </div>
             <button onClick={() => setIsMenuOpen(false)} className="p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors">
               <X size={32} />
             </button>
          </div>
          
          <nav className="flex flex-col gap-8 flex-1">
            {[
              { id: 'matchmaker', label: 'Discover Feed', icon: <Compass size={28}/> },
              { id: 'nearby', label: 'Nearby Members', icon: <MapPin size={28}/> },
              { id: 'date-planner', label: 'Plan a Date', icon: <Calendar size={28}/> },
              { id: 'pricing', label: 'Membership', icon: <Gem size={28}/> },
              { id: 'profile', label: 'My Profile', icon: <User size={28}/> },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => handleNav(item.id as PageView)}
                className="flex items-center gap-6 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-900 transition-all">
                  {item.icon}
                </div>
                <span className="text-3xl font-serif font-bold text-slate-300 group-hover:text-gold-400 transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="pt-12 space-y-4">
             <button onClick={() => handleNav('signup')} className="w-full py-5 bg-gold-500 text-navy-900 rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-95 transition-transform">Create Account</button>
             <button onClick={() => handleNav('login')} className="w-full py-5 border-2 border-white/10 text-white rounded-[1.5rem] font-bold text-xl hover:bg-white/5 transition-colors">Sign In</button>
          </div>
          
          <div className="mt-12 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
            Love Worth Waiting For
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;