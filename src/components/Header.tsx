import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, MapPin, Calendar, Gem, User, CheckCircle, Compass, Sparkles, LogIn } from 'lucide-react';
import { PageView } from '../types';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onNavigate: (page: PageView) => void;
  currentPage: PageView;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { isAuthenticated, user } = useAuth();
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
        ? (scrolled ? 'bg-white text-virgins-purple' : 'bg-virgins-purple text-virgins-gold') + ' shadow-lg scale-105'
        : (scrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-virgins-purple hover:bg-slate-100/80')
    }`;

  const RingsLogo = ({ className, color = "#C9A84C" }: { className?: string, color?: string }) => (
    <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="45" r="22" stroke={color} strokeWidth="5" />
      <circle cx="65" cy="45" r="22" stroke={color} strokeWidth="5" />
      <path d="M50 12 L60 28 L50 44 L40 28 Z" fill={color} stroke="white" strokeWidth="1" />
    </svg>
  );

  return (
    <header className={`fixed w-full z-50 transition-all duration-700 px-4 ${scrolled ? 'pt-2' : 'pt-6'}`}>
      <div className={`max-w-7xl mx-auto transition-all duration-700 ${scrolled ? 'scale-[0.98]' : ''}`}>
        <div className={`flex justify-between items-center transition-all duration-700 shadow-2xl ${
          scrolled
            ? 'bg-virgins-dark/80 backdrop-blur-xl border-white/10 py-2.5 px-5 rounded-full'
            : 'bg-white/60 backdrop-blur-md border-white/40 py-3.5 px-6 rounded-[2.5rem]'
        }`}>
          
          {/* Logo Section */}
          <div className="flex items-center">
            <button onClick={() => handleNav('home')} className="flex items-center gap-3 group">
              <div className="relative">
                <RingsLogo 
                  className={`h-9 w-auto group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out ${scrolled ? 'brightness-125' : ''}`} 
                  color="#C9A84C"
                />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse bg-virgins-gold"></div>
              </div>
              <span className={`hidden md:block text-xl font-serif font-black tracking-widest uppercase transition-colors duration-500 ${scrolled ? 'text-white' : 'text-virgins-purple'}`}>
                Virgins
              </span>
            </button>
          </div>

          {/* Desktop Navigation - Elite Pill Design */}
          <nav className={`hidden lg:flex items-center p-1 rounded-full border transition-all duration-500 ${scrolled ? 'bg-white/5 border-white/10' : 'bg-slate-400/10 border-white/30'}`}>
            <button onClick={() => handleNav('matchmaker')} className={navItemClass('matchmaker')}>
              <Compass size={16} className={currentPage === 'matchmaker' ? 'animate-spin-slow' : ''} /> Discover
            </button>
            <button onClick={() => handleNav('nearby')} className={navItemClass('nearby')}>
              <MapPin size={16} /> Nearby
            </button>
            <button onClick={() => handleNav('date-planner')} className={navItemClass('date-planner')}>
              <Calendar size={16} /> Plan Date
            </button>
            <div className={`w-px h-5 mx-2 transition-colors ${scrolled ? 'bg-white/10' : 'bg-slate-300/50'}`} />
            <button onClick={() => handleNav('pricing')} className={navItemClass('pricing')}>
              <Gem size={14} /> Membership
            </button>
          </nav>
          
          {/* Actions & Premium Status */}
          <div className="flex items-center gap-2 md:gap-5">
            {isAuthenticated && (
              <button 
                onClick={() => handleNav('profile')}
                className={`hidden sm:flex items-center gap-2 px-5 py-2 rounded-full font-bold text-[10px] border transition-all shadow-sm active:scale-95 ${
                  scrolled
                    ? 'bg-white/10 text-virgins-gold border-white/20 hover:border-virgins-gold'
                    : 'bg-gradient-to-r from-virgins-gold/10 to-white text-virgins-gold border-virgins-gold/20 hover:border-virgins-gold'
                }`}
              >
                <Sparkles size={12} className="text-virgins-gold" />
                <span className="tabular-nums">250</span>
                <span className="opacity-40 uppercase tracking-tighter">Beans</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => handleNav('login')}
                    className={`hidden sm:block text-xs font-bold transition-colors px-3 ${scrolled ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-virgins-purple'}`}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => handleNav('signup')}
                    className={`group relative overflow-hidden px-6 py-2.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 ${scrolled ? 'bg-virgins-gold' : 'bg-virgins-purple'}`}
                  >
                    <span className={`relative z-10 text-xs font-black uppercase tracking-widest ${scrolled ? 'text-virgins-dark' : 'text-white'}`}>Get Started</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleNav('profile')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-virgins-gold/20 bg-virgins-gold/10 text-virgins-gold font-bold text-xs transition-all hover:bg-virgins-gold/20 active:scale-95"
                >
                  <User size={14} />
                  <span className="hidden md:inline">{user?.displayName || user?.email?.split('@')[0]}</span>
                </button>
              )}
              
              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className={`lg:hidden p-2 rounded-full shadow-xl transition-colors ${scrolled ? 'bg-white text-virgins-purple' : 'bg-virgins-purple text-virgins-gold'}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-virgins-dark/95 backdrop-blur-3xl lg:hidden p-8 flex flex-col animate-fadeIn">
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
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-virgins-gold group-hover:bg-virgins-gold group-hover:text-virgins-dark transition-all">
                  {item.icon}
                </div>
                <span className="text-3xl font-serif font-bold text-slate-300 group-hover:text-virgins-gold transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="pt-12 space-y-4">
             <button onClick={() => handleNav('signup')} className="w-full py-5 bg-virgins-gold text-virgins-dark rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-95 transition-transform">Create Account</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
