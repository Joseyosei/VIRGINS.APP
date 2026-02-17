import React, { useState } from 'react';
import { Crown, Star, Gem, ArrowRight, Lock, Shield, Edit, MapPin, Eye, Heart, Users, LogOut, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile({ onNavigate }) {
  const { user, profile, logout } = useAuth();
  const [subscription] = useState('free');
  const [incognito, setIncognito] = useState(false);

  const displayName = profile?.name || user?.displayName || 'Member';
  const displayAge = profile?.age || '';
  const displayLocation = profile?.location || 'Update your location';
  const displayImage = profile?.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80';

  const getBadge = () => {
    if (subscription === 'ultimate') return <Crown className="w-5 h-5 text-gold-600 fill-gold-600" />;
    if (subscription === 'plus') return <Star className="w-5 h-5 text-gold-400 fill-gold-400" />;
    return <Gem className="w-5 h-5 text-slate-400" />;
  };

  const getPlanName = () => {
    if (subscription === 'ultimate') return 'Ultimate Member';
    if (subscription === 'plus') return 'Plus Member';
    return 'Free Member';
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">Sign in to view your profile</h2>
          <button data-testid="profile-login-btn" onClick={() => onNavigate('login')} className="px-8 py-3 bg-navy-900 text-white rounded-full font-bold">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="user-profile-page" className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 rounded-3xl shadow-xl overflow-hidden mb-6 relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-navy-800 to-navy-900 opacity-50" />
          <div className="relative z-10 p-8 flex flex-col items-center">
            <div className="relative mb-4">
              <img src={displayImage} alt="Profile" className="w-32 h-32 rounded-full border-4 border-gold-500 shadow-2xl object-cover" />
              <button className="absolute bottom-0 right-0 bg-gold-500 p-2 rounded-full text-navy-900 hover:bg-gold-400 transition-colors shadow-lg">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white font-serif">{displayName}{displayAge ? `, ${displayAge}` : ''}</h1>
              {getBadge()}
            </div>
            <p className="text-slate-300 text-sm flex items-center gap-1 mb-6">
              <span className="font-medium text-gold-400">{getPlanName()}</span>
              <span className="text-slate-600 mx-1">&bull;</span>
              <MapPin className="w-3 h-3 text-slate-400" /> {displayLocation}
            </p>
            <div className="grid grid-cols-3 gap-8 w-full max-w-sm border-t border-navy-700 pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 mx-auto bg-navy-800 rounded-full mb-2"><Users className="w-5 h-5 text-gold-500" /></div>
                <div className="text-xl font-bold text-white">--</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Matches</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 mx-auto bg-navy-800 rounded-full mb-2"><Heart className="w-5 h-5 text-red-500" /></div>
                <div className="text-xl font-bold text-white">--</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Likes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 mx-auto bg-navy-800 rounded-full mb-2"><Eye className="w-5 h-5 text-blue-400" /></div>
                <div className="text-xl font-bold text-white">--</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Views</div>
              </div>
            </div>
          </div>
        </div>

        {subscription !== 'ultimate' && (
          <button onClick={() => onNavigate('pricing')}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl p-4 mb-6 shadow-lg flex items-center justify-between hover:from-gold-400 hover:to-gold-500 transition-all group">
            <div className="text-left">
              <h3 className="text-navy-900 font-bold text-lg">Upgrade to Premium</h3>
              <p className="text-navy-800 text-sm opacity-90">Unlock full access to matches & features</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
              <Crown className="w-6 h-6 text-navy-900" />
            </div>
          </button>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 relative">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><TrendingUp size={14} className="text-navy-900" /> Profile Insights</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6 relative">
            {subscription === 'free' && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[6px] z-20 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg border border-gold-100">
                  <Sparkles className="w-6 h-6 text-gold-600" />
                </div>
                <h4 className="font-serif font-black text-navy-900 text-lg mb-1">See who's noticing you</h4>
                <p className="text-xs text-slate-500 mb-4 max-w-[200px]">Unlock detailed analytics and see exactly who liked your profile.</p>
                <button onClick={() => onNavigate('pricing')} className="px-6 py-2.5 bg-navy-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl hover:bg-navy-800 transition-all active:scale-95">Explore Premium</button>
              </div>
            )}
            <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase">Views this week</p><span className="text-4xl font-black text-navy-900">--</span></div>
            <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase">Likes received</p><span className="text-4xl font-black text-navy-900">--</span></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100"><h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Settings</h3></div>
          <div className="divide-y divide-slate-100">
            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3"><div className="p-2 bg-slate-100 rounded-lg"><Edit className="w-4 h-4 text-slate-600" /></div><span className="text-slate-700 font-medium text-sm">Edit Profile Story</span></div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button onClick={() => onNavigate('pricing')} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3"><div className="p-2 bg-slate-100 rounded-lg"><Crown className="w-4 h-4 text-slate-600" /></div><span className="text-slate-700 font-medium text-sm">Covenant Subscription</span></div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3"><div className="p-2 bg-slate-100 rounded-lg"><Shield className="w-4 h-4 text-slate-600" /></div><span className="text-slate-700 font-medium text-sm">Security & Support</span></div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="mt-8 mb-12 flex flex-col items-center">
          <button data-testid="end-session-btn" onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600 transition-colors px-6 py-2 rounded-xl hover:bg-red-50 text-sm">
            <LogOut className="w-4 h-4" /> End Session
          </button>
          <p className="text-xs text-slate-400 mt-4 font-medium tracking-tight">Covenant Cloud Build 2.4.0</p>
        </div>
      </div>
    </div>
  );
}
