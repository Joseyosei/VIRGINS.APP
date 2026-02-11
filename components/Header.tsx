import React, { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { PageView } from '../types';

interface HeaderProps {
  onNavigate: (page: PageView) => void;
  currentPage: PageView;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const navItemClass = (page: PageView) => 
    `text-base font-medium transition-colors cursor-pointer ${currentPage === page ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'}`;

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
              <div className="bg-primary-50 p-2 rounded-full group-hover:bg-primary-100 transition-colors">
                 <Heart className="h-6 w-6 text-primary-600 fill-current" />
              </div>
              <span className="text-2xl font-serif font-bold text-slate-900 tracking-tight">Virgins</span>
            </button>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <nav className="hidden md:flex space-x-10">
            <button onClick={() => handleNav('home')} className={navItemClass('home')}>Home</button>
            <button onClick={() => handleNav('how-it-works')} className={navItemClass('how-it-works')}>How It Works</button>
            <button onClick={() => handleNav('pricing')} className={navItemClass('pricing')}>Pricing</button>
            <button onClick={() => handleNav('about')} className={navItemClass('about')}>About Us</button>
          </nav>
          
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <a href="#download" className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all hover:shadow-md">
              Download App
            </a>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Heart className="h-6 w-6 text-primary-600 fill-current" />
                   <span className="text-xl font-serif font-bold text-slate-900">Virgins</span>
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <button onClick={() => handleNav('home')} className="-m-3 p-3 flex items-center rounded-md hover:bg-slate-50">
                    <span className="ml-3 text-base font-medium text-slate-900">Home</span>
                  </button>
                  <button onClick={() => handleNav('how-it-works')} className="-m-3 p-3 flex items-center rounded-md hover:bg-slate-50">
                    <span className="ml-3 text-base font-medium text-slate-900">How It Works</span>
                  </button>
                  <button onClick={() => handleNav('pricing')} className="-m-3 p-3 flex items-center rounded-md hover:bg-slate-50">
                    <span className="ml-3 text-base font-medium text-slate-900">Pricing</span>
                  </button>
                  <button onClick={() => handleNav('about')} className="-m-3 p-3 flex items-center rounded-md hover:bg-slate-50">
                    <span className="ml-3 text-base font-medium text-slate-900">About Us</span>
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