import React from 'react';
import { PageView } from '../types';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  // Custom Logo Component (Inline for footer)
  const RingsLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="45" r="22" stroke="#C9A84C" strokeWidth="5" />
      <circle cx="65" cy="45" r="22" stroke="#C9A84C" strokeWidth="5" />
      <path d="M50 12 L60 28 L50 44 L40 28 Z" fill="#C9A84C" stroke="white" strokeWidth="1" />
    </svg>
  );

  return (
    <footer className="bg-virgins-dark border-t border-virgins-purple/20 pt-16 pb-12 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
             <div className="flex items-center gap-3 mb-6">
               <RingsLogo className="h-10 w-auto" />
               <span className="text-2xl font-serif font-bold text-white tracking-widest uppercase">Virgins</span>
             </div>
             <p className="text-sm text-slate-400 mb-6 pr-4 leading-relaxed">
               The premier dating app for those committed to traditional values and saving intimacy for marriage.
             </p>
             <div className="text-xs text-virgins-gold font-medium tracking-wider uppercase">Love Worth Waiting For</div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Company</h3>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('about')} className="text-base text-slate-400 hover:text-virgins-gold transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate('careers')} className="text-base text-slate-400 hover:text-virgins-gold transition-colors">Careers</button></li>
              <li><button onClick={() => onNavigate('press')} className="text-base text-slate-400 hover:text-virgins-gold transition-colors">Press</button></li>
              <li><button onClick={() => onNavigate('contact')} className="text-base text-slate-400 hover:text-virgins-gold transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Product</h3>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('how-it-works')} className="text-base text-slate-400 hover:text-virgins-gold transition-colors">How It Works</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="text-base text-slate-400 hover:text-virgins-gold transition-colors">Pricing</button></li>
              <li><button onClick={() => onNavigate('safety')} className="text-base text-slate-400 hover:text-virgins-gold transition-colors">Safety Center</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate('privacy')} className="text-base text-slate-400 hover:text-virgins-gold transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} className="text-base text-slate-400 hover:text-virgins-gold transition-colors">Terms of Service</button></li>
              <li><button onClick={() => onNavigate('cookies')} className="text-base text-slate-400 hover:text-virgins-gold transition-colors">Cookie Policy</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-virgins-purple/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Virgins Dating App. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
             <p className="text-sm text-slate-600 flex items-center">
               Designed with <span className="mx-1 text-red-900">♥</span> for Marriage
             </p>
             {/* Hidden Admin Link */}
             <button 
               onClick={() => onNavigate('admin')}
               className="text-xs text-virgins-dark/30 hover:text-virgins-purple/50 transition-colors"
               title="Admin Access"
             >
               Admin
             </button>
             <button 
               onClick={() => onNavigate('profile')}
               className="text-xs text-virgins-dark/30 hover:text-virgins-purple/50 transition-colors"
               title="Member Profile"
             >
               Profile
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;