import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Check, Camera, Loader2, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API = process.env.REACT_APP_BACKEND_URL;
const DENOMINATIONS = ['Non-Denominational', 'Baptist', 'Catholic', 'Methodist', 'Presbyterian', 'Reformed', 'Lutheran', 'Pentecostal', 'Anglican', 'Orthodox', 'Other'];
const VALUES_OPTIONS = ['Purity', 'Family', 'Tradition', 'Pro-Life', 'Homeschooling', 'Leadership', 'Kindness', 'Education', 'Career', 'Music', 'Sports', 'Travel'];

export default function WaitlistPage({ onNavigate }) {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '', gender: '', location: '', denomination: '', faithLevel: 'Practicing',
    values: [], intention: 'Dating to Marry', lifestyle: 'Moderate', bio: '',
  });

  const handleValuesToggle = (v) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.includes(v) ? prev.values.filter(x => x !== v) : prev.values.length < 5 ? [...prev.values, v] : prev.values,
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await fetch(`${API}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-firebase-uid': user.uid },
        body: JSON.stringify({
          age: parseInt(formData.age) || 0,
          gender: formData.gender,
          location: formData.location,
          denomination: formData.denomination,
          faithLevel: formData.faithLevel,
          values: formData.values,
          intention: formData.intention,
          lifestyle: formData.lifestyle,
          bio: formData.bio,
          status: 'verified',
        }),
      });
      await refreshProfile();
      onNavigate('matchmaker');
    } catch (e) {
      console.error('Onboarding failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 4;

  return (
    <div data-testid="waitlist-page" className="min-h-screen bg-navy-900 pt-28 pb-12 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-slate-400">Tell us about yourself so we can find your perfect match.</p>
        </div>

        <div className="flex gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${step > i ? 'bg-gold-500' : 'bg-white/10'}`} />
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 md:p-10 shadow-2xl">
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-serif font-bold text-white mb-6">Basic Information</h2>
              <div>
                <label className="block text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Age</label>
                <input data-testid="onboard-age" type="number" min={18} max={100} className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 outline-none transition-all placeholder-white/40" placeholder="Your age" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Gender</label>
                <div className="flex gap-3">
                  {['Male', 'Female'].map(g => (
                    <button key={g} data-testid={`onboard-gender-${g.toLowerCase()}`} onClick={() => setFormData({ ...formData, gender: g })}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.gender === g ? 'bg-gold-500 text-navy-900 shadow-lg' : 'bg-white/10 text-white/60 border border-white/10 hover:border-white/30'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Location</label>
                <input data-testid="onboard-location" type="text" className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 outline-none transition-all placeholder-white/40" placeholder="e.g. Austin, TX" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <button data-testid="onboard-next-1" onClick={() => setStep(2)} disabled={!formData.age || !formData.gender}
                className="w-full py-4 bg-gold-500 text-navy-900 rounded-xl font-bold shadow-lg hover:bg-gold-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-serif font-bold text-white mb-6">Faith Profile</h2>
              <div>
                <label className="block text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Denomination</label>
                <select data-testid="onboard-denomination" value={formData.denomination} onChange={e => setFormData({ ...formData, denomination: e.target.value })} className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 outline-none appearance-none">
                  <option value="" className="text-navy-900">Select denomination</option>
                  {DENOMINATIONS.map(d => <option key={d} value={d} className="text-navy-900">{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Faith Level</label>
                <div className="flex gap-2 flex-wrap">
                  {['Very Serious', 'Practicing', 'Cultural', 'Exploring'].map(l => (
                    <button key={l} onClick={() => setFormData({ ...formData, faithLevel: l })}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${formData.faithLevel === l ? 'bg-gold-500 text-navy-900' : 'bg-white/10 text-white/60 border border-white/10'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Intention</label>
                <div className="flex gap-2 flex-wrap">
                  {['Marriage ASAP', 'Marriage in 1-2 years', 'Dating to Marry', 'Unsure'].map(i => (
                    <button key={i} onClick={() => setFormData({ ...formData, intention: i })}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${formData.intention === i ? 'bg-gold-500 text-navy-900' : 'bg-white/10 text-white/60 border border-white/10'}`}>{i}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2"><ArrowLeft size={18} /> Back</button>
                <button data-testid="onboard-next-2" onClick={() => setStep(3)} className="flex-[2] py-4 bg-gold-500 text-navy-900 rounded-xl font-bold shadow-lg hover:bg-gold-400 transition-all flex items-center justify-center gap-2">Continue <ArrowRight size={18} /></button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-serif font-bold text-white mb-6">Values & Bio</h2>
              <div>
                <label className="block text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Select up to 5 values</label>
                <div className="flex gap-2 flex-wrap">
                  {VALUES_OPTIONS.map(v => (
                    <button key={v} onClick={() => handleValuesToggle(v)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${formData.values.includes(v) ? 'bg-gold-500 text-navy-900' : 'bg-white/10 text-white/60 border border-white/10'}`}>
                      {formData.values.includes(v) && <Check size={12} className="inline mr-1" />}{v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">Bio</label>
                <textarea data-testid="onboard-bio" rows={4} maxLength={500} className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 outline-none transition-all placeholder-white/40 resize-none" placeholder="Tell potential matches about yourself..." value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                <p className="text-xs text-white/30 mt-1 text-right">{formData.bio.length}/500</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-4 bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2"><ArrowLeft size={18} /> Back</button>
                <button data-testid="onboard-next-3" onClick={() => setStep(4)} className="flex-[2] py-4 bg-gold-500 text-navy-900 rounded-xl font-bold shadow-lg hover:bg-gold-400 transition-all flex items-center justify-center gap-2">Continue <ArrowRight size={18} /></button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn text-center">
              <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto"><Check className="w-10 h-10 text-gold-500" /></div>
              <h2 className="text-2xl font-serif font-bold text-white">You're All Set!</h2>
              <p className="text-slate-400 max-w-sm mx-auto">Your profile is ready. Start discovering your covenant match.</p>
              <button data-testid="onboard-start-matching" onClick={handleSubmit} disabled={loading}
                className="w-full py-4 bg-gold-500 text-navy-900 rounded-xl font-bold shadow-lg hover:bg-gold-400 transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (<>Start Matching <ArrowRight size={18} /></>)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
