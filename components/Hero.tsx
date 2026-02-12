import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, CheckCircle, Loader2, Inbox, ArrowRight, MapPin } from 'lucide-react';
import { PageView } from '../types';

interface HeroProps {
  onNavigate: (page: PageView) => void;
}

const LOCATIONS = ['Austin, TX', 'Dallas, TX', 'Houston, TX', 'Nashville, TN', 'Charlotte, NC', 'Atlanta, GA', 'Denver, CO', 'Miami, FL', 'Chicago, IL'];

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&h=100&q=80"
];

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentJoin, setRecentJoin] = useState<{city: string, time: number} | null>(null);
  
  // Initialize count from local storage to simulate persistence or default to the number in the screenshot
  const [userCount, setUserCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('virgins_user_count');
      return saved ? parseInt(saved, 10) : 54896;
    }
    return 54896;
  });

  // Persist count changes to localStorage so it feels real across reloads
  useEffect(() => {
    localStorage.setItem('virgins_user_count', userCount.toString());
  }, [userCount]);

  // Simulate "Real-time" activity: Counter Growth & Join Notifications
  useEffect(() => {
    // 1. Counter growth
    const growthInterval = setInterval(() => {
      // Randomly decide to add a user (30% chance every 4 seconds) to simulate live traffic
      if (Math.random() > 0.7) {
        setUserCount(prev => prev + 1);
      }
    }, 4000);

    // 2. Live "Just Joined" Notifications
    const notificationInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        const city = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        setRecentJoin({ city, time: Date.now() });
        // Hide notification after 4 seconds
        setTimeout(() => setRecentJoin(null), 4000);
      }
    }, 8000);

    // 3. Listen for storage changes (e.g. from WaitlistPage in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'virgins_user_count' && e.newValue) {
        setUserCount(parseInt(e.newValue, 10));
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(growthInterval);
      clearInterval(notificationInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      // Store email temporarily to pre-fill waitlist
      sessionStorage.setItem('virgins_temp_email', email);
      
      setTimeout(() => {
        setLoading(false);
        onNavigate('waitlist');
      }, 800);
    }
  };

  return (
    <div className="relative bg-slate-50 pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
      {/* Live Notification Toast */}
      {recentJoin && (
        <div className="fixed top-24 right-4 md:right-8 z-50 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-full py-2 px-4 flex items-center gap-3">
             <div className="relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </div>
             <p className="text-xs font-medium text-slate-700">
               Someone from <span className="font-bold text-navy-900">{recentJoin.city}</span> joined
             </p>
          </div>
        </div>
      )}

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
        
        {/* Email Capture */}
        <div className="max-w-md mx-auto mb-12 min-h-[100px]">
            <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3 animate-fadeIn">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm transition-all"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white bg-gradient-to-r from-primary-600 to-gold-600 hover:from-primary-700 hover:to-gold-700 shadow-lg transform transition hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Now'}
              </button>
            </form>
          
          {/* Real-time Counter with Pulse */}
          <div className="mt-4 flex items-center justify-center space-x-3 text-sm text-slate-500">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
             </span>
             <p>
                Join <span className="font-bold text-slate-900 tabular-nums text-base">{userCount.toLocaleString()}</span> others waiting for true love.
             </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-sm text-slate-500">
          <div className="flex -space-x-3">
             {AVATARS.map((src, i) => (
                <img key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-slate-50 object-cover" src={src} alt="Member"/>
             ))}
             <div className="h-10 w-10 rounded-full ring-4 ring-slate-50 bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                {(Math.floor(userCount / 1000))}k+
             </div>
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