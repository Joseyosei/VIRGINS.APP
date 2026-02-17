import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, ChevronDown, MapPin, Heart, Sparkles, Church, User, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API = process.env.REACT_APP_BACKEND_URL;

const TOTAL_STEPS = 7;

const DENOMINATIONS = ['Non-Denominational', 'Baptist', 'Catholic', 'Methodist', 'Presbyterian', 'Reformed', 'Lutheran', 'Pentecostal', 'Anglican', 'Orthodox', 'Other'];
const VALUES_OPTIONS = ['Purity', 'Family', 'Tradition', 'Pro-Life', 'Homeschooling', 'Leadership', 'Kindness', 'Education', 'Career', 'Music', 'Sports', 'Travel', 'Fitness', 'Cooking', 'Art', 'Community Service'];

export default function OnboardingFlow({ onNavigate }) {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    birthday: '',
    location: '',
    denomination: '',
    faithLevel: '',
    intention: '',
    values: [],
    bio: '',
    height: '',
    work: '',
    education: '',
    exercise: '',
    showGenderOnProfile: true,
  });

  const goNext = () => {
    setDirection('forward');
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setDirection('back');
    setStep(s => Math.max(s - 1, 1));
  };

  const handleValuesToggle = (v) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.includes(v)
        ? prev.values.filter(x => x !== v)
        : prev.values.length < 5 ? [...prev.values, v] : prev.values,
    }));
  };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await fetch(`${API}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-firebase-uid': user.uid },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age) || 0,
          status: 'verified',
          onboardingComplete: true,
        }),
      });
      await refreshProfile();
      onNavigate('matchmaker');
    } catch (e) {
      console.error('Onboarding save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div data-testid="onboarding-flow" className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-4 bg-white/80 backdrop-blur-md">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-2">
            {step > 1 && (
              <button data-testid="onboard-back" onClick={goBack} className="p-2 -ml-2 text-slate-400 hover:text-navy-900 transition-colors">
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-navy-900 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step}/{TOTAL_STEPS}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pt-20 pb-32">
        <div className="w-full max-w-lg">
          {/* Step 1: Gender */}
          {step === 1 && (
            <StepWrapper direction={direction}>
              <StepHeader
                title="I am a..."
                subtitle="Select your gender to help us find your match."
              />
              <div className="space-y-4 mt-10">
                {['Man', 'Woman'].map(g => (
                  <button key={g} data-testid={`onboard-gender-${g.toLowerCase()}`}
                    onClick={() => setFormData({ ...formData, gender: g === 'Man' ? 'Male' : 'Female' })}
                    className={`w-full py-5 px-6 rounded-2xl text-lg font-bold transition-all flex items-center justify-between ${
                      formData.gender === (g === 'Man' ? 'Male' : 'Female')
                        ? 'bg-gold-500 text-navy-900 shadow-lg scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}>
                    <span>{g}</span>
                    {formData.gender === (g === 'Man' ? 'Male' : 'Female') && <Check size={20} />}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between bg-slate-50 rounded-xl px-5 py-3">
                <span className="text-sm text-slate-600 font-medium">Show on profile</span>
                <button data-testid="toggle-show-gender"
                  onClick={() => setFormData(f => ({ ...f, showGenderOnProfile: !f.showGenderOnProfile }))}
                  className={`relative w-12 h-7 rounded-full transition-colors ${formData.showGenderOnProfile ? 'bg-navy-900' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${formData.showGenderOnProfile ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </StepWrapper>
          )}

          {/* Step 2: Age & Location */}
          {step === 2 && (
            <StepWrapper direction={direction}>
              <StepHeader
                title="Tell us about yourself"
                subtitle="We need a few basics to get started."
              />
              <div className="space-y-6 mt-10">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">Your Age</label>
                  <input data-testid="onboard-age" type="number" min={18} max={100}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-medium focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all"
                    placeholder="How old are you?" value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">Your Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input data-testid="onboard-location" type="text"
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-medium focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all"
                      placeholder="e.g. Austin, TX" value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {/* Step 3: Faith Profile */}
          {step === 3 && (
            <StepWrapper direction={direction}>
              <StepHeader
                title="Your faith journey"
                subtitle="Help us understand your spiritual walk."
                icon={<Church size={28} className="text-gold-600" />}
              />
              <div className="space-y-6 mt-10">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-3">Denomination</label>
                  <div className="grid grid-cols-2 gap-2">
                    {DENOMINATIONS.map(d => (
                      <button key={d} onClick={() => setFormData({ ...formData, denomination: d })}
                        className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                          formData.denomination === d
                            ? 'bg-navy-900 text-white shadow-md'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}>{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-3">How serious is your faith?</label>
                  <div className="space-y-2">
                    {[
                      { value: 'Very Serious', emoji: '', desc: 'Faith is the foundation of my life' },
                      { value: 'Practicing', emoji: '', desc: 'I attend regularly and live by my faith' },
                      { value: 'Cultural', emoji: '', desc: 'Faith is part of my heritage' },
                      { value: 'Exploring', emoji: '', desc: 'I\'m on a spiritual journey' },
                    ].map(l => (
                      <button key={l.value} onClick={() => setFormData({ ...formData, faithLevel: l.value })}
                        className={`w-full py-4 px-5 rounded-xl text-left transition-all flex items-center justify-between ${
                          formData.faithLevel === l.value
                            ? 'bg-gold-50 border-2 border-gold-500 text-navy-900'
                            : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}>
                        <div>
                          <div className="font-bold text-sm">{l.value}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{l.desc}</div>
                        </div>
                        {formData.faithLevel === l.value && <Check size={18} className="text-gold-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {/* Step 4: Intention */}
          {step === 4 && (
            <StepWrapper direction={direction}>
              <StepHeader
                title="What are you looking for?"
                subtitle="Be honest about your intentions."
                icon={<Heart size={28} className="text-gold-600" />}
              />
              <div className="space-y-3 mt-10">
                {[
                  { value: 'Marriage ASAP', desc: 'Ready to find my spouse now', badge: 'Most Intentional' },
                  { value: 'Marriage in 1-2 years', desc: 'Building toward marriage' },
                  { value: 'Dating to Marry', desc: 'Looking for a serious relationship' },
                  { value: 'Unsure', desc: 'Exploring my options' },
                ].map(opt => (
                  <button key={opt.value} data-testid={`onboard-intention-${opt.value.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setFormData({ ...formData, intention: opt.value })}
                    className={`w-full py-5 px-6 rounded-2xl text-left transition-all relative overflow-hidden ${
                      formData.intention === opt.value
                        ? 'bg-navy-900 text-white shadow-lg'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">{opt.value}</div>
                        <div className={`text-xs mt-0.5 ${formData.intention === opt.value ? 'text-slate-300' : 'text-slate-400'}`}>{opt.desc}</div>
                      </div>
                      {opt.badge && (
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                          formData.intention === opt.value ? 'bg-gold-500 text-navy-900' : 'bg-gold-100 text-gold-700'
                        }`}>{opt.badge}</span>
                      )}
                      {formData.intention === opt.value && !opt.badge && <Check size={18} className="text-gold-500" />}
                    </div>
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {/* Step 5: Values */}
          {step === 5 && (
            <StepWrapper direction={direction}>
              <StepHeader
                title="What do you value most?"
                subtitle={`Select up to 5 values (${formData.values.length}/5 chosen)`}
              />
              <div className="flex flex-wrap gap-2 mt-10">
                {VALUES_OPTIONS.map(v => (
                  <button key={v} onClick={() => handleValuesToggle(v)}
                    className={`px-5 py-3 rounded-full text-sm font-bold transition-all ${
                      formData.values.includes(v)
                        ? 'bg-navy-900 text-white shadow-md scale-[1.03]'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}>
                    {formData.values.includes(v) && <Check size={14} className="inline mr-1.5" />}
                    {v}
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {/* Step 6: Bio & Details */}
          {step === 6 && (
            <StepWrapper direction={direction}>
              <StepHeader
                title="Write your story"
                subtitle="A punchy intro that shows the real you."
                icon={<Sparkles size={28} className="text-gold-600" />}
              />
              <div className="space-y-5 mt-10">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">Bio</label>
                  <textarea data-testid="onboard-bio" rows={4} maxLength={500}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-medium focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all resize-none"
                    placeholder="Write a fun and punchy intro..." value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                  <p className="text-xs text-slate-400 text-right mt-1">{formData.bio.length}/500</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">Work</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all"
                      placeholder="Your occupation" value={formData.work}
                      onChange={e => setFormData({ ...formData, work: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">Education</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all"
                      placeholder="Your school" value={formData.education}
                      onChange={e => setFormData({ ...formData, education: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">Height</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all"
                      placeholder={`e.g. 5'10"`} value={formData.height}
                      onChange={e => setFormData({ ...formData, height: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-2">Exercise</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy-900 outline-none appearance-none"
                      value={formData.exercise} onChange={e => setFormData({ ...formData, exercise: e.target.value })}>
                      <option value="">Select</option>
                      <option value="Active">Active</option>
                      <option value="Sometimes">Sometimes</option>
                      <option value="Almost Never">Almost Never</option>
                    </select>
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {/* Step 7: Complete */}
          {step === 7 && (
            <StepWrapper direction={direction}>
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Check className="w-12 h-12 text-gold-600" />
                </div>
                <h1 className="text-4xl font-serif font-black text-navy-900 mb-3 tracking-tight">You're all set!</h1>
                <p className="text-lg text-slate-500 max-w-sm mx-auto leading-relaxed mb-4">
                  Your profile is ready. Time to discover your covenant match.
                </p>
                <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 border border-slate-100">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Profile Summary</h3>
                  <div className="space-y-3">
                    {formData.gender && <SummaryRow label="Gender" value={formData.gender} />}
                    {formData.age && <SummaryRow label="Age" value={formData.age} />}
                    {formData.location && <SummaryRow label="Location" value={formData.location} />}
                    {formData.denomination && <SummaryRow label="Denomination" value={formData.denomination} />}
                    {formData.faithLevel && <SummaryRow label="Faith Level" value={formData.faithLevel} />}
                    {formData.intention && <SummaryRow label="Looking For" value={formData.intention} />}
                    {formData.values.length > 0 && <SummaryRow label="Values" value={formData.values.join(', ')} />}
                  </div>
                </div>
                <button data-testid="onboard-start-matching" onClick={handleComplete} disabled={saving}
                  className="w-full py-5 bg-navy-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-navy-800 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (<>Start Matching <ArrowRight size={20} /></>)}
                </button>
              </div>
            </StepWrapper>
          )}
        </div>
      </div>

      {/* Fixed bottom next button - more visible, centered on mobile */}
      {step < TOTAL_STEPS && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-6 bg-gradient-to-t from-white via-white to-transparent">
          <div className="max-w-lg mx-auto">
            <button data-testid="onboard-next" onClick={goNext}
              disabled={
                (step === 1 && !formData.gender) ||
                (step === 2 && !formData.age) ||
                (step === 3 && !formData.denomination) ||
                (step === 4 && !formData.intention)
              }
              className="w-full py-5 bg-navy-900 rounded-2xl shadow-2xl flex items-center justify-center gap-3 text-white font-bold text-lg hover:bg-navy-800 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed">
              Continue <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepWrapper({ children, direction }) {
  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
}

function StepHeader({ title, subtitle, icon }) {
  return (
    <div>
      {icon && <div className="mb-4">{icon}</div>}
      <h1 className="text-3xl md:text-4xl font-serif font-black text-navy-900 tracking-tight leading-tight">{title}</h1>
      {subtitle && <p className="text-base text-slate-500 mt-3 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-navy-900 text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}
