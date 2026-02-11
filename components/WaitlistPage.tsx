import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, ArrowRight, CheckCircle, Loader2, Share2, Copy, MapPin, User, Heart } from 'lucide-react';
import { PageView } from '../types';

interface WaitlistPageProps {
  onNavigate: (page: PageView) => void;
}

const WaitlistPage: React.FC<WaitlistPageProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Email, 2: Verify, 3: Details, 4: Success
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Additional Details
  const [details, setDetails] = useState({
    name: '',
    gender: '',
    city: ''
  });

  // User Count Logic
  const [userCount, setUserCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('virgins_user_count');
      return saved ? parseInt(saved, 10) : 54896;
    }
    return 54896;
  });

  const [position, setPosition] = useState(userCount + 1);

  useEffect(() => {
    // Sync with local storage to keep the count realistic
    localStorage.setItem('virgins_user_count', userCount.toString());
  }, [userCount]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setUserCount(prev => prev + 1);
      setPosition(userCount + 1);
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://virgins.app/invite/${btoa(email).substring(0, 8)}`);
    // Ideally show a toast here
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="w-full max-w-lg px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md border border-slate-100 mb-6">
              <ShieldCheck className="w-8 h-8 text-gold-500" />
           </div>
           <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">
             {step === 4 ? "You're on the list!" : "Join the Waitlist"}
           </h1>
           <p className="text-slate-500 text-lg">
             {step === 4 ? "We'll let you know as soon as your spot opens up." : "Secure your spot for the most intentional dating community."}
           </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Progress Bar (Hidden on Success) */}
          {step < 4 && (
            <div className="h-1.5 bg-slate-100 w-full">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-gold-500 transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          )}

          <div className="p-8">
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-navy-900 hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-900 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Now'}
                </button>
                <p className="text-xs text-center text-slate-400 mt-4">
                  By joining, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            )}

            {step === 2 && (
              <div className="animate-fadeIn text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Verify your email</h3>
                <p className="text-slate-500 mb-6 text-sm">
                  We sent a secure link to <span className="font-semibold text-slate-900">{email}</span>.<br/>
                  Please verify your email to proceed.
                </p>
                
                {/* Simulated Inbox Action */}
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 mb-6">
                  <p className="text-xs uppercase font-bold text-slate-400 mb-2">Simulated Action</p>
                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full flex items-center justify-between bg-white border border-slate-200 hover:border-primary-400 p-3 rounded-lg shadow-sm group transition-all"
                  >
                    <span className="font-medium text-slate-700">Click to Verify</span>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500" />}
                  </button>
                </div>
                
                <button onClick={() => setStep(1)} className="text-sm text-slate-400 underline hover:text-primary-600">
                  Change email address
                </button>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4 animate-fadeIn">
                <div className="text-center mb-6">
                   <h3 className="text-lg font-bold text-slate-900">Almost there!</h3>
                   <p className="text-sm text-slate-500">Help us customize your experience.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-400" />
                     </div>
                     <input
                        type="text"
                        required
                        className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="John Doe"
                        value={details.name}
                        onChange={e => setDetails({...details, name: e.target.value})}
                     />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDetails({...details, gender: 'Man'})}
                        className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${details.gender === 'Man' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                      >
                         Man
                      </button>
                      <button
                        type="button"
                        onClick={() => setDetails({...details, gender: 'Woman'})}
                        className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${details.gender === 'Woman' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                      >
                         Woman
                      </button>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-slate-400" />
                     </div>
                     <input
                        type="text"
                        className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g. Austin, TX"
                        value={details.city}
                        onChange={e => setDetails({...details, city: e.target.value})}
                     />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !details.name || !details.gender}
                  className="w-full flex items-center justify-center py-3.5 px-6 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-navy-900 hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-900 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
                </button>
              </form>
            )}

            {step === 4 && (
              <div className="animate-fadeIn text-center">
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-50">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                 </div>
                 
                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8">
                    <p className="text-slate-500 text-sm uppercase tracking-wider font-bold mb-1">Your Position</p>
                    <p className="text-4xl font-serif font-bold text-navy-900">#{position.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-2">People ahead of you: {(position - 1).toLocaleString()}</p>
                 </div>

                 <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-700">Want to skip the line?</p>
                    <button 
                       onClick={copyReferral}
                       className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-medium"
                    >
                       <Share2 className="w-4 h-4" />
                       <span>Copy Referral Link</span>
                    </button>
                 </div>
                 
                 <div className="mt-8 pt-8 border-t border-slate-100">
                    <button onClick={() => onNavigate('home')} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center gap-1">
                       Back to Home <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
           <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Virgins Dating App. Love Worth Waiting For.</p>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;