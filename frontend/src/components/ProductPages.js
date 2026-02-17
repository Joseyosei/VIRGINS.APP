import React, { useState } from 'react';
import { Heart, Users, Shield, Sparkles, Search, ArrowRight, MessageCircle, Eye, BrainCircuit, Crown, Check, Star, ChevronRight, Lock, Gem } from 'lucide-react';

export function HowItWorks({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-serif font-black text-navy-900 mb-4 tracking-tight">How <span className="italic text-gold-600">Virgins</span> Works</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">A revolutionary approach to dating that prioritizes your values.</p>
        </div>
        <div className="space-y-24">
          {[
            { step: 1, title: 'Create Your Covenant Profile', desc: 'Go beyond surface-level. Our unique onboarding dives deep into your faith, values, and intentions.', icon: <Heart className="w-10 h-10 text-white" /> },
            { step: 2, title: 'Discover Aligned Singles', desc: 'Our Covenant Algorithm matches you based on theology, family goals, and purity commitments.', icon: <BrainCircuit className="w-10 h-10 text-white" /> },
            { step: 3, title: 'Build With Intention', desc: 'Move from discovery to courtship with our Date Planner, chat, and community features.', icon: <Crown className="w-10 h-10 text-white" /> },
          ].map((item) => (
            <div key={item.step} className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-24 h-24 bg-navy-900 rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0">{item.icon}</div>
              <div>
                <div className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] mb-2">Step {item.step}</div>
                <h3 className="text-2xl font-serif font-bold text-navy-900 mb-3">{item.title}</h3>
                <p className="text-lg text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 text-center">
          <button onClick={() => onNavigate('signup')} className="px-10 py-5 bg-navy-900 text-white rounded-full font-bold text-lg shadow-2xl hover:bg-navy-800 transition-all hover:scale-105 flex items-center gap-3 mx-auto">
            Start Your Journey <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Pricing({ onNavigate }) {
  const plans = [
    { name: 'Free', price: '$0', period: '/forever', features: ['5 daily matches', 'Basic filters', 'See who likes you', 'AI profile helper'], recommended: false, cta: 'Start Free' },
    { name: 'Plus', price: '$14.99', period: '/month', features: ['Unlimited matches', 'Advanced filters', 'Priority placement', 'Read receipts', 'Undo pass'], recommended: true, cta: 'Upgrade to Plus' },
    { name: 'Ultimate', price: '$29.99', period: '/month', features: ['All Plus features', 'Verified badge', 'Profile boost', 'Incognito mode', 'Personal matchmaker', 'Date planner'], recommended: false, cta: 'Go Ultimate' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-black text-navy-900 mb-4">Covenant <span className="italic text-gold-600">Membership</span></h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Choose the plan that fits your journey to marriage.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(p => (
            <div key={p.name} className={`relative bg-white rounded-[2rem] shadow-lg border-2 p-8 ${p.recommended ? 'border-gold-500 shadow-gold-200/30' : 'border-slate-100'}`}>
              {p.recommended && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-500 text-navy-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Most Popular</div>}
              <h3 className="text-xl font-serif font-bold text-navy-900 mb-2">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-black text-navy-900">{p.price}</span><span className="text-slate-400 text-sm">{p.period}</span></div>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-600"><Check size={16} className="text-green-600 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <button onClick={() => onNavigate('signup')} className={`w-full py-4 rounded-2xl font-bold transition-all ${p.recommended ? 'bg-navy-900 text-white shadow-lg hover:bg-navy-800' : 'bg-slate-100 text-navy-900 hover:bg-slate-200'}`}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
