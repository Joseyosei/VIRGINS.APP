import React from 'react';
import { Shield, Heart, Gem } from 'lucide-react';

export default function CommunityGuidelines() {
  return (
    <div className="bg-slate-900 py-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2000&q=80" alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-primary-400 font-bold tracking-wider uppercase">Our Code of Honor</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl font-serif">The Virgins Pledge</p>
          <p className="mt-4 max-w-2xl text-xl text-slate-400 mx-auto">We are not just a dating app; we are a counter-cultural movement.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: <Gem className="w-6 h-6 text-primary-400" />, title: 'Purity is Precious', desc: 'We believe intimacy is a sacred gift reserved for marriage. Our community supports one another in maintaining boundaries.' },
            { icon: <Heart className="w-6 h-6 text-primary-400" />, title: 'Intentional Dating', desc: 'We date with a purpose. No "hanging out" or ambiguity. We are here to find a spouse and create a legacy.' },
            { icon: <Shield className="w-6 h-6 text-primary-400" />, title: 'Safe & Verified', desc: 'Zero-tolerance for harassment. Every profile is manually reviewed to ensure alignment with traditional values.' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 bg-primary-900/50 rounded-lg flex items-center justify-center mb-6 border border-primary-500/30">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4 font-serif">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
