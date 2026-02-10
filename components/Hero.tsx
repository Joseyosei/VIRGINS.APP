import React from 'react';
import { ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-slate-50 pt-32 pb-16 overflow-hidden lg:pt-40 lg:pb-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary-50 text-primary-700 mb-6 border border-primary-100">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Premarital Purity & Commitment
            </div>
            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl lg:text-6xl font-serif">
              <span className="block xl:inline">Love that waits is</span>{' '}
              <span className="block text-primary-600 xl:inline">love that lasts.</span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-lg text-slate-500 sm:text-xl md:mt-5 md:max-w-3xl lg:mx-0 font-light leading-relaxed">
              Find a partner who shares your deepest convictions. Join the premier community for those dedicated to traditional values and saving intimacy for marriage.
            </p>
            <div className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
              <div className="rounded-md shadow">
                <a href="#download" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-transform hover:-translate-y-1">
                  Start Your Journey
                </a>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a href="#bio-helper" className="w-full flex items-center justify-center px-8 py-3 border border-slate-300 text-base font-medium rounded-full text-slate-700 bg-white hover:bg-slate-50 md:py-4 md:text-lg md:px-10 gap-2">
                  Create Profile <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-16 lg:mt-0 relative">
            <div className="relative mx-auto w-full rounded-lg shadow-2xl lg:max-w-md overflow-hidden ring-8 ring-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
               <img 
                 className="w-full h-auto object-cover"
                 src="https://picsum.photos/800/1000?grayscale" 
                 alt="Couple holding hands" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                 <div className="text-white">
                   <p className="font-serif text-2xl italic">"Worth the wait."</p>
                   <p className="text-sm opacity-90 mt-2">— Sarah & James, married 2023</p>
                 </div>
               </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 top-0 -right-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -z-10 bottom-0 -left-4 w-72 h-72 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;