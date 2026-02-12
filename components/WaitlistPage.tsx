import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Mail, ArrowRight, CheckCircle, Loader2, Share2, Copy, MapPin, User, Heart, Calendar, BookOpen, Inbox, AlertCircle, Camera, X, Plus, Info, Compass } from 'lucide-react';
import { PageView } from '../types';

interface WaitlistPageProps {
  onNavigate: (page: PageView) => void;
}

const INTEREST_OPTIONS = ['Yoga', 'Baking', 'Travel', 'Hiking', 'Cooking', 'Reading', 'Faith', 'Family', 'Music', 'Fitness', 'Outdoors', 'Art', 'Tradition'];
const LOOKING_FOR_OPTIONS = ['Long-term Relationship', 'Marriage', 'Friendship', 'Courtship'];

const WaitlistPage: React.FC<WaitlistPageProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1); 
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [details, setDetails] = useState({
    name: '',
    gender: '',
    age: '',
    faith: '',
    city: '',
    lookingFor: [] as string[],
    interests: [] as string[]
  });

  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePhotoSlot, setActivePhotoSlot] = useState<number | null>(null);

  useEffect(() => {
    const tempEmail = sessionStorage.getItem('virgins_temp_email');
    if (tempEmail) {
      setEmail(tempEmail);
      sessionStorage.removeItem('virgins_temp_email');
    }
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 600);
  };

  const handleBasicsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const togglePreference = (list: 'lookingFor' | 'interests', value: string) => {
    setDetails(prev => {
      const currentList = prev[list];
      const newList = currentList.includes(value) 
        ? currentList.filter(v => v !== value)
        : [...currentList, value];
      return { ...prev, [list]: newList };
    });
  };

  const handlePhotoClick = (index: number) => {
    if (photos[index]) {
      const newPhotos = [...photos];
      newPhotos[index] = null;
      setPhotos(newPhotos);
    } else {
      setActivePhotoSlot(index);
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activePhotoSlot !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos];
        newPhotos[activePhotoSlot] = reader.result as string;
        setPhotos(newPhotos);
        setActivePhotoSlot(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);
    
    // Simulating database storage
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: details.name,
      joinedAt: new Date().toISOString(),
      status: 'verified'
    };
    
    const existing = JSON.parse(localStorage.getItem('virgins_waitlist_data') || '[]');
    localStorage.setItem('virgins_waitlist_data', JSON.stringify([...existing, newUser]));

    setTimeout(() => {
      setLoading(false);
      setStep(5);
    }, 1500);
  };

  const photoCount = photos.filter(p => p !== null).length;

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-40 left-20 w-96 h-96 bg-gold-100 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-primary-100 rounded-full blur-[100px]"></div>
        </div>
      </div>

      <div className="w-full max-w-xl px-4 relative z-10">
        {step < 5 && (
          <div className="mb-8 max-w-xs mx-auto">
             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-navy-900 transition-all duration-500 ease-out"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
             </div>
             <div className="flex justify-between mt-2 px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {step} of 4</span>
                <span className="text-[10px] font-bold text-navy-900 uppercase tracking-widest">
                  {step === 1 ? 'Email' : step === 2 ? 'Basics' : step === 3 ? 'Preferences' : 'Photos'}
                </span>
             </div>
          </div>
        )}

        <div className="text-center mb-8">
           <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
             {step === 5 ? "Registration Complete" : "Join Virgins"}
           </h1>
           <p className="text-slate-500">
             {step === 5 ? `Welcome to the community, ${details.name}!` : "Courtship built on tradition and shared values."}
           </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 overflow-hidden mb-12">
          <div className="p-8 sm:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />

            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      className="block w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-navy-900 focus:bg-white focus:border-transparent transition-all outline-none text-slate-900 font-medium"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-4 px-6 rounded-2xl shadow-lg text-lg font-bold text-white bg-navy-900 hover:bg-navy-800 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start My Journey'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleBasicsSubmit} className="space-y-5 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                    <input
                      type="text" required
                      className="block w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none"
                      placeholder="Your Name"
                      value={details.name}
                      onChange={e => setDetails({...details, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Age</label>
                    <input
                      type="number" required min="18"
                      className="block w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none"
                      placeholder="21"
                      value={details.age}
                      onChange={e => setDetails({...details, age: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Gender</label>
                    <select 
                      className="block w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none appearance-none"
                      value={details.gender}
                      onChange={e => setDetails({...details, gender: e.target.value})}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Man">Man</option>
                      <option value="Woman">Woman</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Faith / Location</label>
                  <div className="space-y-3">
                    <input
                      type="text" required
                      className="block w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none"
                      placeholder="e.g. Catholic"
                      value={details.faith}
                      onChange={e => setDetails({...details, faith: e.target.value})}
                    />
                    <input
                      type="text" required
                      className="block w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none"
                      placeholder="e.g. London, UK"
                      value={details.city}
                      onChange={e => setDetails({...details, city: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl text-white bg-navy-900 font-bold mt-4 shadow-lg active:scale-95 transition-transform"
                >
                  Continue
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="animate-fadeIn space-y-6">
                <div>
                   <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">I'm looking for</h3>
                   <div className="flex flex-wrap gap-2">
                      {LOOKING_FOR_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => togglePreference('lookingFor', opt)}
                          className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${details.lookingFor.includes(opt) ? 'bg-navy-900 text-white border-navy-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                          {opt}
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">I enjoy</h3>
                   <div className="flex flex-wrap gap-2">
                      {INTEREST_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => togglePreference('interests', opt)}
                          className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${details.interests.includes(opt) ? 'bg-gold-500 text-white border-gold-500 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                          {opt}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setStep(4)}
                    disabled={details.lookingFor.length === 0}
                    className="w-full py-4 rounded-2xl text-white bg-navy-900 font-bold shadow-lg disabled:opacity-50"
                  >
                    Setup My Photos
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fadeIn space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Profile Photos</h3>
                   <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500">
                     {photoCount}/6
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => handlePhotoClick(index)}
                      className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center ${photo ? 'border-navy-900' : 'border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'}`}
                    >
                      {photo ? (
                        <>
                          <img src={photo} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 p-1 bg-black/50 backdrop-blur-md rounded-full text-white">
                             <X size={12} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3 bg-white rounded-full shadow-sm mb-2">
                             <Camera size={20} className="text-gold-500" />
                          </div>
                          <Plus size={16} className="text-slate-300 absolute bottom-3 right-3" />
                        </>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-navy-50 rounded-2xl flex items-start gap-3">
                   <Info className="w-5 h-5 text-navy-600 flex-shrink-0 mt-0.5" />
                   <p className="text-xs text-navy-700 leading-relaxed font-medium">
                     Traditional values prioritize authenticity. Clear, face-forward photos significantly increase your match rate for meaningful courtship.
                   </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleFinalSubmit}
                    disabled={loading || photoCount < 2}
                    className="w-full py-4 rounded-2xl text-white bg-navy-900 font-bold shadow-lg disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Complete Registration'}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">Minimum 2 photos required</p>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="animate-fadeIn text-center py-6">
                 <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-green-50/50">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                 </div>
                 <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Registration Successful!</h3>
                 <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                   Your account is ready. You can now browse the community and find individuals who share your values.
                 </p>
                 
                 <div className="space-y-4">
                    {/* Launch App Button */}
                    <button 
                       onClick={() => onNavigate('matchmaker')}
                       className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-navy-900 rounded-2xl shadow-xl hover:bg-navy-800 transition-all transform hover:scale-105 text-white font-bold"
                    >
                       <Compass className="w-5 h-5" />
                       <span>Launch Discover Feed</span>
                    </button>
                    
                    <button 
                       className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors text-slate-700 font-bold"
                    >
                       <Share2 className="w-4 h-4" />
                       <span>Invite Traditional Friends</span>
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
           <span className="flex items-center gap-1.5"><ShieldCheck size={12}/> Secure</span>
           <span className="flex items-center gap-1.5"><Lock size={12}/> Private</span>
           <span className="flex items-center gap-1.5"><User size={12}/> Verified</span>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;