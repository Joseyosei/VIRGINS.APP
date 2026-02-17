import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Calendar, Gem, User, Compass, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RingsLogo = ({ className, color = "#D4A574" }) => (
  <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35" cy="45" r="22" stroke={color} strokeWidth="5" />
    <circle cx="65" cy="45" r="22" stroke={color} strokeWidth="5" />
    <path d="M50 12 L60 28 L50 44 L40 28 Z" fill={color} stroke="white" strokeWidth="1" />
  </svg>
);

export default function Header({ onNavigate, currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const navItemClass = (page) =>
    `group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ${
      currentPage === page
        ? (scrolled ? 'bg-white text-navy-900' : 'bg-navy-900 text-gold-500') + ' shadow-lg scale-105'
        : scrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/80'
    }`;

  return (
    <header data-testid="app-header" className={`fixed w-full z-50 transition-all duration-700 px-4 ${scrolled ? 'pt-2' : 'pt-6'}`}>
      <div className={`max-w-7xl mx-auto transition-all duration-700 ${scrolled ? 'scale-[0.98]' : ''}`}>
        <div className={`flex justify-between items-center transition-all duration-700 shadow-2xl ${
          scrolled
            ? 'bg-navy-900/80 backdrop-blur-xl border-white/10 py-2.5 px-5 rounded-full'
            : 'bg-white/60 backdrop-blur-md border-white/40 py-3.5 px-6 rounded-[2.5rem]'
        }`}>
          <div className="flex items-center">
            <button data-testid="logo-home-btn" onClick={() => handleNav('home')} className="flex items-center gap-3 group">
              <div className="relative">
                <RingsLogo className={`h-9 w-auto group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out ${scrolled ? 'brightness-125' : ''}`} color={scrolled ? "#E6CFA6" : "#D4A574"} />
                <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse ${scrolled ? 'bg-gold-300' : 'bg-gold-500'}`} />
              </div>
              <span className={`hidden md:block text-xl font-serif font-black tracking-widest uppercase transition-colors duration-500 ${scrolled ? 'text-white' : 'text-navy-900'}`}>
                Virgins
              </span>
            </button>
          </div>

          <nav className={`hidden lg:flex items-center p-1 rounded-full border transition-all duration-500 ${scrolled ? 'bg-white/5 border-white/10' : 'bg-slate-400/10 border-white/30'}`}>
            <button data-testid="nav-discover" onClick={() => handleNav('matchmaker')} className={navItemClass('matchmaker')}>
              <Compass size={16} /> Discover
            </button>
            <button data-testid="nav-likes" onClick={() => handleNav('likes')} className={navItemClass('likes')}>
              <Heart size={16} /> Likes
            </button>
            <button data-testid="nav-nearby" onClick={() => handleNav('nearby')} className={navItemClass('nearby')}>
              <MapPin size={16} /> Nearby
            </button>
            <button data-testid="nav-date-planner" onClick={() => handleNav('date-planner')} className={navItemClass('date-planner')}>
              <Calendar size={16} /> Plan Date
            </button>
            <div className={`w-px h-5 mx-2 transition-colors ${scrolled ? 'bg-white/10' : 'bg-slate-300/50'}`} />
            <button data-testid="nav-pricing" onClick={() => handleNav('pricing')} className={navItemClass('pricing')}>
              <Gem size={14} /> Membership
            </button>
          </nav>

          <div className="flex items-center gap-2 md:gap-5">
            {user && (
              <button data-testid="nav-profile-btn" onClick={() => handleNav('profile')}
                className={`hidden sm:flex items-center gap-2 px-5 py-2 rounded-full font-bold text-[10px] border transition-all shadow-sm active:scale-95 ${
                  scrolled ? 'bg-white/10 text-gold-300 border-white/20 hover:border-gold-300' : 'bg-gradient-to-r from-gold-50 to-white text-gold-700 border-gold-200/50 hover:border-gold-400'
                }`}>
                <Sparkles size={12} className={scrolled ? 'text-gold-300' : 'text-gold-500'} />
                <span className="uppercase tracking-tighter">Profile</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              {user ? (
                <button data-testid="logout-btn" onClick={logout}
                  className={`hidden sm:block text-xs font-bold transition-colors px-3 ${scrolled ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-navy-900'}`}>
                  Sign Out
                </button>
              ) : (
                <button data-testid="signin-btn" onClick={() => handleNav('login')}
                  className={`hidden sm:block text-xs font-bold transition-colors px-3 ${scrolled ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-navy-900'}`}>
                  Sign In
                </button>
              )}
              <button data-testid="get-started-btn" onClick={() => handleNav(user ? 'matchmaker' : 'signup')}
                className={`group relative overflow-hidden px-6 py-2.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 ${scrolled ? 'bg-gold-500' : 'bg-navy-900'}`}>
                <span className={`relative z-10 text-xs font-black uppercase tracking-widest ${scrolled ? 'text-navy-900' : 'text-white'}`}>
                  {user ? 'Discover' : 'Get Started'}
                </span>
              </button>
              <button type="button" data-testid="mobile-menu-toggle"
                className={`lg:hidden p-2 rounded-full shadow-xl transition-colors ${scrolled ? 'bg-white text-navy-900' : 'bg-navy-900 text-gold-500'}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

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
              { id: 'matchmaker', label: 'Discover Feed', icon: <Compass size={28} /> },
              { id: 'likes', label: 'Who Likes Me', icon: <Heart size={28} /> },
              { id: 'nearby', label: 'Nearby Members', icon: <MapPin size={28} /> },
              { id: 'date-planner', label: 'Plan a Date', icon: <Calendar size={28} /> },
              { id: 'pricing', label: 'Membership', icon: <Gem size={28} /> },
              { id: 'profile', label: 'My Profile', icon: <User size={28} /> },
            ].map((item) => (
              <button key={item.id} onClick={() => handleNav(item.id)} className="flex items-center gap-6 group">
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
            {user ? (
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full py-5 bg-red-500/20 text-red-400 rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-95 transition-transform border border-red-500/30">
                Sign Out
              </button>
            ) : (
              <button onClick={() => handleNav('signup')} className="w-full py-5 bg-gold-500 text-navy-900 rounded-[1.5rem] font-black text-xl shadow-2xl active:scale-95 transition-transform">
                Create Account
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
