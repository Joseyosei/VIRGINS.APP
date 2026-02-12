import React, { useState } from 'react';
import { Mail, User, Lock, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { PageView } from '../types';

interface SignupPageProps {
  onNavigate: (page: PageView) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate initial signup then redirect to detailed waitlist/onboarding
    sessionStorage.setItem('virgins_temp_email', formData.email);
    setTimeout(() => {
      setLoading(false);
      onNavigate('waitlist');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row pt-20">
      {/* Left side: Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80" 
            className="w-full h-full object-cover" 
            alt="Traditional values"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-900/60 to-transparent"></div>
        
        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-serif font-bold text-white mb-8 leading-tight">
            Start your legacy <br/>
            <span className="text-gold-500">of love.</span>
          </h2>
          <ul className="space-y-6">
            {[
              "Verified community of singles",
              "Faith-based matching algorithm",
              "Commitment to traditional values",
              "Exclusive marriage-minded platform"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-cream/90 text-lg">
                <CheckCircle className="text-gold-500 w-6 h-6 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl font-serif text-gold-500 font-bold">V</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-serif font-bold text-navy-900 mb-2">Join Virgins</h1>
          <p className="text-slate-500 mb-10">Create an account to begin your journey to a lifelong covenant.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-navy-900 text-white font-bold rounded-2xl shadow-lg hover:bg-navy-800 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Continue Registration
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              Already a member?{' '}
              <button 
                onClick={() => onNavigate('login')} 
                className="font-bold text-navy-900 hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
          
          <p className="mt-12 text-[10px] text-slate-400 text-center leading-relaxed">
            By joining, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>, and commit to upholding our community guidelines on purity and traditional courtship.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;