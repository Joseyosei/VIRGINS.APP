import React, { useState } from 'react';
import { Crown, Star, Gem, Settings, ArrowRight, Lock, Shield, Edit, MapPin, Eye, Heart, Users, LogOut } from 'lucide-react';
import { PageView } from '../types';

interface UserProfileProps {
  onNavigate: (page: PageView) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onNavigate }) => {
  const [subscription, setSubscription] = useState<'free' | 'plus' | 'ultimate'>('free');
  const [incognito, setIncognito] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header Card */}
        <div className="bg-navy-900 rounded-3xl shadow-xl overflow-hidden mb-6 relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-navy-800 to-navy-900 opacity-50"></div>
          
          <div className="relative z-10 p-8 flex flex-col items-center">
            <div className="relative mb-4">
               <img 
                 src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" 
                 alt="Profile" 
                 className="w-32 h-32 rounded-full border-4 border-gold-500 shadow-2xl object-cover"
               />
               <button className="absolute bottom-0 right-0 bg-gold-500 p-2 rounded-full text-navy-900 hover:bg-gold-400 transition-colors shadow-lg">
                 <Edit className="w-4 h-4" />
               </button>
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white font-serif">James, 27</h1>
              {getBadge()}
            </div>
            
            <p className="text-slate-300 text-sm flex items-center gap-1 mb-6">
              <span className="font-medium text-gold-400">{getPlanName()}</span>
              <span className="text-slate-600 mx-1">•</span>
              <MapPin className="w-3 h-3 text-slate-400" />
              Austin, TX
            </p>

            <div className="grid grid-cols-3 gap-8 w-full max-w-sm border-t border-navy-700 pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 mx-auto bg-navy-800 rounded-full mb-2">
                   <Users className="w-5 h-5 text-gold-500" />
                </div>
                <div className="text-xl font-bold text-white">12</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Matches</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 mx-auto bg-navy-800 rounded-full mb-2">
                   <Heart className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-xl font-bold text-white">48</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Likes</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 mx-auto bg-navy-800 rounded-full mb-2">
                   <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">342</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Banner */}
        {subscription !== 'ultimate' && (
          <button 
            onClick={() => onNavigate('pricing')}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl p-4 mb-6 shadow-lg flex items-center justify-between hover:from-gold-400 hover:to-gold-500 transition-all group"
          >
            <div className="text-left">
               <h3 className="text-navy-900 font-bold text-lg">Upgrade to {subscription === 'plus' ? 'Ultimate' : 'Premium'}</h3>
               <p className="text-navy-800 text-sm opacity-90">Unlock full access to matches & features</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
               <Crown className="w-6 h-6 text-navy-900" fill="#1A1A2E" />
            </div>
          </button>
        )}

        {/* Settings Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Settings</h3>
           </div>
           
           <div className="divide-y divide-slate-100">
              <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><Edit className="w-4 h-4 text-slate-600" /></div>
                    <span className="text-slate-700 font-medium">Edit Profile</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button onClick={() => onNavigate('pricing')} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><Crown className="w-4 h-4 text-slate-600" /></div>
                    <span className="text-slate-700 font-medium">Manage Subscription</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><MapPin className="w-4 h-4 text-slate-600" /></div>
                    <span className="text-slate-700 font-medium">Discovery Settings</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><Lock className="w-4 h-4 text-slate-600" /></div>
                    <div className="text-left">
                       <span className="text-slate-700 font-medium block">Incognito Mode</span>
                       {subscription !== 'ultimate' && <span className="text-xs text-gold-600 font-medium">Premium Feature</span>}
                    </div>
                 </div>
                 <button 
                   onClick={() => subscription === 'ultimate' ? setIncognito(!incognito) : onNavigate('pricing')}
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${incognito && subscription === 'ultimate' ? 'bg-gold-500' : 'bg-slate-200'}`}
                 >
                   <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${incognito && subscription === 'ultimate' ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
              </div>

              <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><Shield className="w-4 h-4 text-slate-600" /></div>
                    <span className="text-slate-700 font-medium">Privacy & Safety</span>
                 </div>
                 <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
           </div>
        </div>

        <div className="mt-8 mb-12 flex flex-col items-center">
           <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600 transition-colors px-6 py-2 rounded-xl hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Log Out
           </button>
           <p className="text-xs text-slate-400 mt-4">Version 2.0.1 (Web)</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;