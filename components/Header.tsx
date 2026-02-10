import React, { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <a href="#" className="flex items-center gap-2 group">
              <div className="bg-primary-50 p-2 rounded-full group-hover:bg-primary-100 transition-colors">
                 <Heart className="h-6 w-6 text-primary-600 fill-current" />
              </div>
              <span className="text-2xl font-serif font-bold text-slate-900 tracking-tight">Virgins</span>
            </a>
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
            <a href="#features" className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Our Values
            </a>
            <a href="#stories" className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Success Stories
            </a>
            <a href="#bio-helper" className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors">
              AI Profile Helper
            </a>
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
                  <a href="#features" className="-m-3 p-3 flex items-center rounded-md hover:bg-slate-50">
                    <span className="ml-3 text-base font-medium text-slate-900">Our Values</span>
                  </a>
                  <a href="#stories" className="-m-3 p-3 flex items-center rounded-md hover:bg-slate-50">
                    <span className="ml-3 text-base font-medium text-slate-900">Success Stories</span>
                  </a>
                  <a href="#bio-helper" className="-m-3 p-3 flex items-center rounded-md hover:bg-slate-50">
                    <span className="ml-3 text-base font-medium text-slate-900">AI Profile Helper</span>
                  </a>
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <a href="#download" className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700">
                Download App
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;