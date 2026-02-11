import React from 'react';
import { Shield, Heart, Gem } from 'lucide-react';

const CommunityGuidelines: React.FC = () => {
  return (
    <div className="bg-slate-900 py-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Background pattern"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-primary-400 font-bold tracking-wider uppercase">Our Code of Honor</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl font-serif">
            The Virgins Pledge
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-400 mx-auto">
            We are not just a dating app; we are a counter-cultural movement. Every member agrees to our core standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
            <div className="w-12 h-12 bg-primary-900/50 rounded-lg flex items-center justify-center mb-6 border border-primary-500/30">
              <Gem className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 font-serif">Purity is Precious</h3>
            <p className="text-slate-400 leading-relaxed">
              We believe intimacy is a sacred gift reserved for marriage. Our community supports one another in maintaining boundaries and honoring this commitment.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
            <div className="w-12 h-12 bg-primary-900/50 rounded-lg flex items-center justify-center mb-6 border border-primary-500/30">
              <Heart className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 font-serif">Intentional Dating</h3>
            <p className="text-slate-400 leading-relaxed">
              We date with a purpose. No "hanging out" or ambiguity. We are here to find a spouse, build a family, and create a legacy.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
            <div className="w-12 h-12 bg-primary-900/50 rounded-lg flex items-center justify-center mb-6 border border-primary-500/30">
              <Shield className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 font-serif">Safe & Verified</h3>
            <p className="text-slate-400 leading-relaxed">
              We zero-tolerance for harassment or pressure. Every profile is manually reviewed to ensure they align with our traditional values.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;