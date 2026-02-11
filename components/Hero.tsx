import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Heart, Mail, CheckCircle } from 'lucide-react';
import { PageView } from '../types';

interface HeroProps {
  onNavigate: (page: PageView) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [userCount, setUserCount] = useState(54892);

  // Simulate live user growth for social proof
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setJoined(true);
      setEmail('');
      // In a real app, send to API here
    }
  };

  return (
    <div className="relative bg-slate-50 pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-gold-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase bg-white text-primary-700 mb-8 border border-primary-100 shadow-sm animate-fadeIn">
          <ShieldCheck className="w-4 h-4 mr-2" />
          The #1 App for Marriage
        </div>
        
        <h1 className="text-5xl tracking-tight font-extrabold text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl font-serif leading-tight mb-8">
          Courtship, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 italic">Reimagined.</span>
        </h1>
        
        <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 font-light leading-relaxed mb-10">
          Connect with a verified community that honors tradition. We are the platform for those saving intimacy for marriage and building a legacy.
        </p>
        
        {/* High Conversion Email Capture */}
        <div className="max-w-md mx-auto mb-12">
          {!joined ? (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white bg-gradient-to-r from-primary-600 to-gold-600 hover:from-primary-700 hover:to-gold-700 shadow-lg transform transition hover:-translate-y-1"
              >
                Join Now
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center bg-green-50 text-green-700 px-6 py-4 rounded-full border border-green-200 animate-fadeIn">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>You're on the list! We'll be in touch soon.</span>
            </div>
          )}
          <p className="mt-3 text-sm text-slate-400">Join {userCount.toLocaleString()} others waiting for true love.</p>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-sm text-slate-500">
          <div className="flex -space-x-3">
             {[1,2,3,4,5].map(i => (
                <img key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-slate-50 object-cover" src={`https://picsum.photos/100/100?random=${20+i}`} alt="Member"/>
             ))}
             <div className="h-10 w-10 rounded-full ring-4 ring-slate-50 bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">50k+</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="font-medium">High matching activity in your area</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;