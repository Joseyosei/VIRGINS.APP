import React from 'react';
import { ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { PageView } from '../types';

interface HeroProps {
  onNavigate: (page: PageView) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative bg-slate-50 pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-gold-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase bg-white text-primary-700 mb-8 border border-primary-100 shadow-sm">
          <ShieldCheck className="w-4 h-4 mr-2" />
          The #1 App for Waiting
        </div>
        
        <h1 className="text-5xl tracking-tight font-extrabold text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl font-serif leading-tight mb-8">
          Courtship, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 italic">Reimagined.</span>
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 font-light leading-relaxed mb-10">
          Connect with a community that honors tradition. We are the premier platform for those saving intimacy for marriage and seeking a relationship built on shared values.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4">
          <button 
            onClick={() => onNavigate('home')} 
            className="w-full sm:w-auto px-10 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:scale-105"
          >
            Start Your Journey
          </button>
          <button 
            onClick={() => onNavigate('how-it-works')}
            className="w-full sm:w-auto px-10 py-4 border border-slate-200 text-lg font-bold rounded-full text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            How It Works <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-sm text-slate-500">
          <div className="flex -space-x-3">
             {[1,2,3,4,5].map(i => (
                <img key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-slate-50 object-cover" src={`https://picsum.photos/100/100?random=${20+i}`} alt="Member"/>
             ))}
             <div className="h-10 w-10 rounded-full ring-4 ring-slate-50 bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">+2k</div>
          </div>
          <p className="font-medium">Joined by 10,000+ traditional singles this month</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;