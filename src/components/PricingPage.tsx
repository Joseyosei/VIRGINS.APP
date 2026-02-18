
import React from 'react';
import { Crown, Check, Star, Shield, Zap, ArrowRight, Sparkles, MessageCircle, Eye, MapPin } from 'lucide-react';
import { PageView } from '../types';

interface PricingPageProps {
  onNavigate: (page: PageView) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const plans = [
    {
      name: 'Standard',
      price: 'Free',
      description: 'The foundation for your intentional journey.',
      features: [
        '3 Match discoveries per day',
        'Basic profile verification',
        'See who likes you (Limited)',
        'GPS Nearby Radar',
      ],
      cta: 'Current Plan',
      popular: false,
      icon: <Star className="w-6 h-6 text-slate-400" />
    },
    {
      name: 'Plus',
      price: '$19.99',
      period: '/mo',
      description: 'Enhanced visibility and intentional matching.',
      features: [
        'Unlimited daily discoveries',
        'Priority profile placement',
        'See all likes instantly',
        '5 AI Bio generations per month',
        'Incognito browsing',
      ],
      cta: 'Upgrade to Plus',
      popular: true,
      icon: <Zap className="w-6 h-6 text-gold-500" fill="#D4A574" />
    },
    {
      name: 'Ultimate',
      price: '$39.99',
      period: '/mo',
      description: 'The complete experience for serious seekers.',
      features: [
        'Everything in Plus',
        'Direct messaging with anyone',
        'Full compatibility breakdowns',
        'Exclusive date planning AI',
        'VIP support and verification',
        'Ad-free experience',
      ],
      cta: 'Go Ultimate',
      popular: false,
      icon: <Crown className="w-6 h-6 text-gold-600" fill="#D4A574" />
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles size={12} /> Premium Membership
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-black text-navy-900 mb-6 tracking-tight">Invest in your <span className="italic text-gold-600">forever.</span></h1>
          <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            Choose the plan that aligns with your intentionality. All proceeds support the growth of our traditional community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative rounded-[3rem] p-8 sm:p-10 border transition-all hover:scale-[1.02] duration-500 ${plan.popular ? 'bg-navy-900 text-white border-navy-900 shadow-2xl scale-105 z-10' : 'bg-white text-navy-900 border-slate-100 shadow-xl'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-500 text-navy-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.popular ? 'bg-white/10' : 'bg-slate-50 border border-slate-100'}`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black tabular-nums">{plan.price}</span>
                  {plan.period && <span className={`text-sm font-bold ${plan.popular ? 'text-slate-400' : 'text-slate-400'}`}>{plan.period}</span>}
                </div>
                <p className={`text-sm leading-relaxed ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-gold-500' : 'text-navy-900'}`} />
                    <span className="text-sm font-medium leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 group ${plan.popular ? 'bg-gold-500 text-navy-900 hover:bg-gold-400' : 'bg-navy-900 text-white hover:bg-navy-800'}`}
              >
                {plan.cta}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Grid */}
        <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100 overflow-hidden">
           <h2 className="text-3xl font-serif font-black text-navy-900 mb-12 text-center">Compare Benefits</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { title: 'Discovery Radar', desc: 'Find verified singles nearby with real GPS.', icon: <MapPin className="text-gold-500" /> },
                { title: 'Covenant Insights', desc: 'Deep compatibility analysis and scoring.', icon: <Zap className="text-gold-500" /> },
                { title: 'Safe Messaging', desc: 'Secure, respectful communication environment.', icon: <MessageCircle className="text-gold-500" /> },
                { title: 'Verified Purity', desc: 'Strict community guidelines and moderation.', icon: <Shield className="text-gold-500" /> }
              ].map((f, i) => (
                <div key={i} className="text-center md:text-left">
                   <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 mx-auto md:mx-0 border border-gold-100">
                      {f.icon}
                   </div>
                   <h4 className="font-bold text-navy-900 mb-2">{f.title}</h4>
                   <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="mt-20 text-center max-w-2xl mx-auto">
           <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-widest font-bold">
             Payments are processed securely via Stripe. You can cancel or change your subscription at any time through your profile settings. Membership helps us keep the community free from superficiality.
           </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
