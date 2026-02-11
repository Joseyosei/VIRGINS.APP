import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { PageView } from '../types';

interface HeaderProps {
  onNavigate: (page: PageView) => void;
  currentPage: PageView;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for "modern" feel
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
    `text-sm font-medium transition-all duration-200 cursor-pointer px-4 py-2 rounded-full hover:bg-slate-50 ${
      currentPage === page 
        ? 'text-navy-900 font-semibold bg-slate-50' 
        : 'text-slate-500 hover:text-navy-900'
    }`;

  // Custom Logo Component
  const RingsLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="45" r="22" stroke="#D4A574" strokeWidth="5" />
      <circle cx="65" cy="45" r="22" stroke="#D4A574" strokeWidth="5" />
      <path d="M50 12 L60 28 L50 44 L40 28 Z" fill="#D4A574" stroke="white" strokeWidth="1" />
    </svg>
  );

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-sm py-3 border-b border-slate-100' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <button onClick={() => handleNav('home')} className="flex items-center gap-3 group">
              <div className="transition-transform duration-300 group-hover:scale-110">
                 <RingsLogo className="h-9 w-auto" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-widest uppercase text-navy-900">
                Virgins
              </span>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="bg-white/50 backdrop-blur rounded-full p-2 inline-flex items-center justify-center text-slate-600 hover:text-navy-900 hover:bg-slate-100 focus:outline-none transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Navigation - Centered & Floating Pill */}
          <nav className="hidden md:flex space-x-2 items-center bg-white/70 px-6 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-sm ring-1 ring-slate-900/5">
            <button onClick={() => handleNav('home')} className={navItemClass('home')}>Home</button>
            <button onClick={() => handleNav('how-it-works')} className={navItemClass('how-it-works')}>How It Works</button>
            <button onClick={() => handleNav('pricing')} className={navItemClass('pricing')}>Pricing</button>
          </nav>
          
          {/* CTA Button */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <button 
              onClick={() => handleNav('waitlist')}
              className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 transition-all hover:-translate-y-0.5 hover:shadow-xl ring-2 ring-transparent hover:ring-gold-400"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <RingsLogo className="h-8 w-auto" />
                   <span className="text-xl font-serif font-bold text-navy-900 tracking-widest uppercase">Virgins</span>
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-4">
                  <button onClick={() => handleNav('home')} className="p-3 flex items-center rounded-xl hover:bg-slate-50 transition-colors">
                    <span className="ml-3 text-base font-medium text-slate-900">Home</span>
                  </button>
                  <button onClick={() => handleNav('how-it-works')} className="p-3 flex items-center rounded-xl hover:bg-slate-50 transition-colors">
                    <span className="ml-3 text-base font-medium text-slate-900">How It Works</span>
                  </button>
                  <button onClick={() => handleNav('pricing')} className="p-3 flex items-center rounded-xl hover:bg-slate-50 transition-colors">
                    <span className="ml-3 text-base font-medium text-slate-900">Pricing</span>
                  </button>
                  <button onClick={() => handleNav('waitlist')} className="mt-4 p-3 flex items-center rounded-xl bg-navy-50 hover:bg-navy-100 transition-colors group border border-navy-100">
                    <span className="ml-3 text-base font-bold text-navy-900 group-hover:text-navy-700">Join Waitlist</span>
                    <ArrowRight className="ml-auto w-5 h-5 text-navy-900" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;