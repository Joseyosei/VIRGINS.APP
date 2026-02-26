
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api';
import { Crown, Check, Star, Shield, Zap, ArrowRight, Sparkles, MessageCircle, Eye, MapPin } from 'lucide-react';
import { PageView } from '../types';

interface PricingPageProps {
  onNavigate: (page: PageView) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<string>('free');

  useEffect(() => {
    (api as any).getSubscriptionStatus().then((s: any) => {
      if (s?.tier) setCurrentTier(s.tier);
    }).catch(() => {});
  }, []);

  const tierPriceIds: Record<string, string> = {
    plus: process.env.VITE_STRIPE_PRICE_PLUS_MONTHLY || (import.meta.env.VITE_STRIPE_PRICE_PLUS_MONTHLY || ''),
    ultimate: process.env.VITE_STRIPE_PRICE_ULTIMATE_MONTHLY || (import.meta.env.VITE_STRIPE_PRICE_ULTIMATE_MONTHLY || ''),
  };

  const handleUpgrade = async (tier: string, planPriceId?: string) => {
    if (tier === 'free' || tier === 'standard') { return; }
    setLoadingPlan(tier);
    try {
      const priceId = planPriceId || tierPriceIds[tier];
      if (!priceId) {
        toast.error('Stripe price ID not configured. Set VITE_STRIPE_PRICE_* env vars.');
        return;
      }
      const result = await (api as any).createCheckoutSession(priceId) as any;
      if (result?.url) {
        window.location.href = result.url;
      } else {
        toast.error(result?.message || 'Failed to start checkout');
      }
    } catch (err: any) {
      toast.error(err.message || 'Checkout unavailable');
    } finally {
      setLoadingPlan(null);
    }
  };
  const plans: Array<{ name: string; price: string; period?: string; description: string; features: string[]; cta: string; popular: boolean; icon: React.ReactNode; tier: string; priceId?: string; }> = [
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
      tier: 'free',
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
      tier: 'plus',
      priceId: import.meta.env.VITE_STRIPE_PRICE_PLUS_MONTHLY || '',
      icon: <Zap className="w-6 h-6 text-virgins-gold" fill="#C9A84C" />
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
      tier: 'ultimate',
      priceId: import.meta.env.VITE_STRIPE_PRICE_ULTIMATE_MONTHLY || '',
      icon: <Crown className="w-6 h-6 text-virgins-gold" fill="#C9A84C" />
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-virgins-gold/10 text-virgins-gold rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles size={12} /> Premium Membership
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-black text-virgins-purple mb-6 tracking-tight">Invest in your <span className="italic text-virgins-gold">forever.</span></h1>
          <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            Choose the plan that aligns with your intentionality. All proceeds support the growth of our traditional community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative rounded-[3rem] p-8 sm:p-10 border transition-all hover:scale-[1.02] duration-500 ${plan.popular ? 'bg-gradient-to-br from-virgins-dark to-virgins-purple text-white border-virgins-purple shadow-2xl scale-105 z-10' : 'bg-white text-virgins-purple border-slate-100 shadow-xl'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-virgins-gold text-virgins-dark text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
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
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-virgins-gold' : 'text-virgins-purple'}`} />
                    <span className="text-sm font-medium leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => plan.tier !== 'free' && handleUpgrade(plan.tier, plan.priceId)}
                disabled={loadingPlan === plan.tier || currentTier === plan.tier}
                className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed ${plan.popular ? 'bg-virgins-gold text-virgins-dark hover:bg-virgins-gold/90' : 'bg-virgins-purple text-white hover:bg-virgins-purple/90'}`}
              >
                {loadingPlan === plan.tier ? (
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : currentTier === plan.tier ? (
                  'Current Plan'
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Grid */}
        <div className="bg-virgins-cream rounded-[3rem] p-12 border border-slate-100 overflow-hidden">
           <h2 className="text-3xl font-serif font-black text-virgins-purple mb-12 text-center">Compare Benefits</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { title: 'Discovery Radar', desc: 'Find verified singles nearby with real GPS.', icon: <MapPin className="text-virgins-gold" /> },
                { title: 'Covenant Insights', desc: 'Deep compatibility analysis and scoring.', icon: <Zap className="text-virgins-gold" /> },
                { title: 'Safe Messaging', desc: 'Secure, respectful communication environment.', icon: <MessageCircle className="text-virgins-gold" /> },
                { title: 'Verified Purity', desc: 'Strict community guidelines and moderation.', icon: <Shield className="text-virgins-gold" /> }
              ].map((f, i) => (
                <div key={i} className="text-center md:text-left">
                   <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 mx-auto md:mx-0 border border-gold-100">
                      {f.icon}
                   </div>
                   <h4 className="font-bold text-virgins-purple mb-2">{f.title}</h4>
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
