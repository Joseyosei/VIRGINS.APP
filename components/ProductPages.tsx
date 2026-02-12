
import React, { useState } from 'react';
import { Check, X, Shield, Heart, Zap, UserPlus, Lock, Crown, Loader2 } from 'lucide-react';
import { PageView } from '../types';

interface PageProps {
  onNavigate: (page: PageView) => void;
}

export const HowItWorks: React.FC<PageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary-600 font-semibold tracking-wide uppercase">The Path to Love</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl font-serif">
            How Virgins Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            A simple, dignified process designed to help you find your future spouse.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200 hidden md:block"></div>
          </div>
          <div className="relative flex flex-col md:flex-row justify-between gap-12">
            
            <div className="flex-1 bg-white p-6 relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-6 mx-auto relative z-10 border-4 border-white">
                1
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4"><UserPlus className="w-12 h-12 text-slate-400" /></div>
                <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">Create Your Profile</h3>
                <p className="text-slate-500">
                  Share your values, faith, and what you are looking for. Our detailed onboarding ensures you present your authentic self.
                </p>
              </div>
            </div>

            <div className="flex-1 bg-white p-6 relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-6 mx-auto relative z-10 border-4 border-white">
                2
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4"><Shield className="w-12 h-12 text-slate-400" /></div>
                <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">Get Verified</h3>
                <p className="text-slate-500">
                  Safety is our priority. Every profile undergoes manual review to ensure the community remains authentic and safe.
                </p>
              </div>
            </div>

            <div className="flex-1 bg-white p-6 relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-6 mx-auto relative z-10 border-4 border-white">
                3
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4"><Heart className="w-12 h-12 text-slate-400" /></div>
                <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">Intentional Dating</h3>
                <p className="text-slate-500">
                  Browse matches who share your convictions. Start conversations that matter and lead to a lifelong covenant.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => onNavigate('home')} 
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 md:text-lg transition-transform hover:-translate-y-1"
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
};

export const Pricing: React.FC<PageProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<string>('free');

  const handleSelectPlan = (plan: string) => {
    setLoading(plan);
    setTimeout(() => {
      setLoading(null);
      setCurrentTier(plan);
      if (plan === 'free') onNavigate('signup');
      else {
        alert(`Thank you for investing in your legacy with the ${plan} plan!`);
        onNavigate('matchmaker');
      }
    }, 1500);
  };

  const features = [
    {
      category: "Core Experience",
      items: [
        { name: "Create Verified Profile", guest: true, covenant: true },
        { name: "Browse Matches", guest: true, covenant: true },
        { name: "Send Likes", guest: "Limited (5/day)", covenant: "Unlimited" },
        { name: "Messaging", guest: "Mutual Match Only", covenant: "Unlimited" },
        { name: "See Who Liked You", guest: true, covenant: true },
      ]
    },
    {
      category: "Safety & Security",
      items: [
        { name: "Photo Verification (AI + Human)", guest: true, covenant: true },
        { name: "Video Verification Badge", guest: true, covenant: true },
        { name: "Panic Button & Date Check-in", guest: true, covenant: true },
        { name: "Premium Background Check Badge", guest: false, covenant: true },
      ]
    },
    {
      category: "Faith & Planning",
      items: [
        { name: "Basic Denomination Filter", guest: true, covenant: true },
        { name: "Advanced Theology Filters", guest: false, covenant: true },
        { name: "Date Planning Tools", guest: false, covenant: true },
        { name: "\"We Met\" Feedback System", guest: false, covenant: true },
      ]
    },
    {
      category: "Premium Features",
      items: [
        { name: "Travel Mode (Match in other cities)", guest: false, covenant: true },
        { name: "Advanced Relationship Analytics", guest: false, covenant: true },
        { name: "Read Receipts", guest: false, covenant: true },
        { name: "Profile Boost (Spotlight)", guest: false, covenant: "1/mo Included" },
      ]
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary-600 font-semibold tracking-wide uppercase">Membership</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl font-serif">
            Invest in Your Future
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Choose the plan that fits your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center transition-all ${currentTier === 'free' ? 'ring-2 ring-navy-900' : ''}`}>
            <h3 className="text-xl font-medium text-slate-900 font-serif">Free</h3>
            <p className="mt-4 flex items-baseline justify-center text-slate-900">
              <span className="text-4xl font-extrabold tracking-tight">$0</span>
              <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>
            </p>
            <p className="mt-4 text-sm text-slate-500">Get a feel for the community.</p>
            <button 
              onClick={() => handleSelectPlan('free')}
              disabled={loading === 'free'}
              className="mt-6 w-full bg-slate-100 border border-transparent rounded-full py-3 px-6 text-center font-bold text-slate-900 hover:bg-slate-200 transition-all flex items-center justify-center"
            >
              {loading === 'free' ? <Loader2 className="animate-spin" /> : 'Join for Free'}
            </button>
          </div>

          <div className={`bg-navy-900 rounded-2xl shadow-xl border-2 border-gold-500 p-8 text-center relative transform md:-translate-y-4 transition-all ${currentTier === 'covenant' ? 'ring-4 ring-gold-400' : ''}`}>
            <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
              <span className="bg-gold-500 text-navy-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-md">
                <Crown className="w-3 h-3" /> Most Popular
              </span>
            </div>
            <h3 className="text-xl font-medium text-white font-serif">Covenant</h3>
            <p className="mt-4 flex items-baseline justify-center text-white">
              <span className="text-4xl font-extrabold tracking-tight">$29</span>
              <span className="ml-1 text-xl font-semibold text-slate-400">/mo</span>
            </p>
            <p className="mt-4 text-sm text-slate-300">For serious dating & marriage.</p>
            <button 
              onClick={() => handleSelectPlan('covenant')}
              disabled={loading === 'covenant'}
              className="mt-6 w-full bg-gradient-to-r from-gold-500 to-gold-600 border border-transparent rounded-full py-3 px-6 text-center font-bold text-navy-900 hover:bg-gold-400 shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center"
            >
              {loading === 'covenant' ? <Loader2 className="animate-spin" /> : 'Get Covenant'}
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 bg-slate-50 border-b border-slate-200 p-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-6 pl-4">Features</div>
            <div className="col-span-3 text-center">Free</div>
            <div className="col-span-3 text-center text-primary-700">Covenant</div>
          </div>

          {features.map((section, idx) => (
            <div key={idx}>
              <div className="bg-slate-50/50 p-3 pl-8 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                {section.category}
              </div>
              {section.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx} 
                  className="grid grid-cols-1 md:grid-cols-12 p-4 md:p-6 border-b border-slate-100 hover:bg-slate-50 transition-colors items-center"
                >
                  <div className="col-span-6 flex items-center gap-3 pl-2 mb-2 md:mb-0">
                    <div className="md:hidden font-bold text-slate-900 flex-1">{item.name}</div>
                    <div className="hidden md:block font-medium text-slate-900">{item.name}</div>
                    {item.name.includes("Boost") && <Zap className="w-4 h-4 text-gold-500 hidden md:block" />}
                    {item.name.includes("Background") && <Shield className="w-4 h-4 text-primary-500 hidden md:block" />}
                  </div>
                  
                  <div className="col-span-3 flex md:justify-center items-center gap-2 md:gap-0">
                    <span className="md:hidden text-xs text-slate-500 font-bold w-20">Free:</span>
                    {item.guest === true ? (
                      <Check className="w-5 h-5 text-slate-400" />
                    ) : item.guest === false ? (
                      <div className="w-4 h-px bg-slate-300"></div> 
                    ) : (
                      <span className="text-sm text-slate-500 font-medium">{item.guest}</span>
                    )}
                  </div>

                  <div className="col-span-3 flex md:justify-center items-center gap-2 md:gap-0 mt-2 md:mt-0">
                    <span className="md:hidden text-xs text-primary-700 font-bold w-20">Covenant:</span>
                    {item.covenant === true ? (
                      <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-navy-900">{item.covenant}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
