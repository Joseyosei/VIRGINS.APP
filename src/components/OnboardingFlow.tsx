import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Mail, ArrowRight, CheckCircle, Loader2, Share2, Copy, MapPin, User, Heart, Calendar, BookOpen, Inbox, AlertCircle, Camera, X, Plus, Info, Compass, Sparkles, Wand2, SearchCode, ChevronLeft, Image as ImageIcon, Lock as LockIcon } from 'lucide-react';
import { PageView } from '../types';
import { analyzeProfilePhoto, aiEditPhoto } from '../services/ai';
import { blink } from '../lib/blink';
import { toast } from 'react-hot-toast';

interface OnboardingFlowProps {
  onNavigate: (page: PageView) => void;
}

const INTEREST_OPTIONS = ['Yoga', 'Baking', 'Travel', 'Hiking', 'Cooking', 'Reading', 'Faith', 'Family', 'Music', 'Fitness', 'Outdoors', 'Art', 'Tradition'];
const LOOKING_FOR_OPTIONS = ['Long-term Relationship', 'Marriage', 'Friendship', 'Courtship'];

const COVENANT_QUESTIONS = [
  { id: 'faith', label: 'Faith Commitment', question: 'How central is your faith in your daily life and decision making?', min: 'Exploring', max: 'Very Serious' },
  { id: 'values', label: 'Traditional Values', question: 'How much do you prioritize traditional family values and gender roles?', min: 'Moderate', max: 'Traditional' },
  { id: 'intention', label: 'Marriage Intention', question: 'How ready are you for a lifelong covenant (marriage)?', min: 'Dating to Marry', max: 'Ready ASAP' },
  { id: 'lifestyle', label: 'Purity Commitment', question: 'How committed are you to saving physical intimacy exclusively for marriage?', min: 'Determined', max: 'Absolute' }
];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1); 
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [details, setDetails] = useState({
    name: '',
    gender: '',
    age: '',
    faith: '',
    city: '',
    lookingFor: [] as string[],
    interests: [] as string[],
    coordinates: '',
    faith_level: 5,
    values_level: 5,
    intention_level: 5,
    lifestyle_level: 5
  });

  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [photoFiles, setPhotoFiles] = useState<(File | null)[]>([null, null, null, null, null, null]);
  const [auditFeedback, setAuditFeedback] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePhotoSlot, setActivePhotoSlot] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await blink.auth.me();
      if (user) {
        setEmail(user.email || '');
        setDetails(prev => ({ ...prev, name: user.displayName || prev.name }));
      }
    };
    fetchUser();

    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setDetails(prev => ({ 
          ...prev, 
          coordinates: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }) 
        }));
      }, (err) => console.error("Location access denied", err));
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

  const handleValuesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
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
    setActivePhotoSlot(index);
    fileInputRef.current?.click();
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
    const newFiles = [...photoFiles];
    newFiles[index] = null;
    setPhotoFiles(newFiles);
    const newFeedback = [...auditFeedback];
    newFeedback[index] = null;
    setAuditFeedback(newFeedback);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activePhotoSlot !== null) {
      const newFiles = [...photoFiles];
      newFiles[activePhotoSlot] = file;
      setPhotoFiles(newFiles);

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

  const runAudit = async (index: number) => {
    const photo = photos[index];
    if (!photo) return;
    setAnalyzing(index);
    try {
      const feedback = await analyzeProfilePhoto(photo);
      const newFeedback = [...auditFeedback];
      newFeedback[index] = feedback || "Photo looks ready for courtship.";
      setAuditFeedback(newFeedback);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(null);
    }
  };

  const runEdit = async (index: number) => {
    const photo = photos[index];
    if (!photo) return;
    const prompt = window.prompt("How should we edit this photo? (e.g., 'apply a warm traditional film filter', 'blur background')", "apply a warm traditional filter");
    if (!prompt) return;

    setEditing(index);
    try {
      const result = await aiEditPhoto(photo, prompt);
      if (result) {
        const newPhotos = [...photos];
        newPhotos[index] = result;
        setPhotos(newPhotos);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEditing(null);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await blink.auth.me();
      if (!user) throw new Error('User not authenticated');

      const uploadedUrls: string[] = [];
      for (const file of photoFiles) {
        if (file) {
          const extension = file.name.split('.').pop();
          const { publicUrl } = await blink.storage.upload(
            file, 
            `profiles/${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`
          );
          uploadedUrls.push(publicUrl);
        }
      }

      await (blink.db as any).users.create({
        id: user.id,
        user_id: user.id,
        display_name: details.name,
        email: email,
        bio: `${details.faith} single from ${details.city} looking for ${details.lookingFor.join(', ')}. Interests include ${details.interests.join(', ')}.`,
        gender: details.gender,
        location: details.city,
        coordinates: details.coordinates,
        faith_level: details.faith_level,
        values_level: details.values_level,
        intention_level: details.intention_level,
        lifestyle_level: details.lifestyle_level,
        photo_url: uploadedUrls[0] || '',
        is_premium: false,
      });

      toast.success('Covenant Profile Created!');
      setStep(6);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to complete registration.');
      toast.error('Could not save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const photoCount = photos.filter(p => p !== null).length;

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-40 left-20 w-96 h-96 bg-virgins-gold/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-virgins-purple/10 rounded-full blur-[100px]"></div>
        </div>
      </div>

      <div className="w-full max-w-xl px-4 relative z-10">
        {step < 6 && (
          <div className="mb-8 max-w-xs mx-auto">
             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-virgins-purple transition-all duration-500 ease-out"
                  style={{ width: `${(step / 5) * 100}%` }}
                ></div>
             </div>
             <div className="flex justify-between mt-2 px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {step} of 5</span>
                <span className="text-[10px] font-bold text-virgins-purple uppercase tracking-widest">
                  {step === 1 ? 'Email' : step === 2 ? 'Basics' : step === 3 ? 'Preferences' : step === 4 ? 'Values' : 'Photos'}
                </span>
             </div>
          </div>
        )}

        <div className="text-center mb-8 relative">
           {step > 1 && step < 6 && (
             <button onClick={() => setStep(s => (s-1) as any)} className="absolute left-0 top-1 text-slate-400 hover:text-virgins-purple transition-colors">
                <ChevronLeft size={24} />
             </button>
           )}
           <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
             {step === 6 ? "Covenant Ready" : "Join Virgins"}
           </h1>
           <p className="text-slate-500">
             {step === 6 ? `Welcome home, ${details.name}.` : "Building a legacy requires a strong foundation."}
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
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Secure Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      className="block w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-virgins-purple focus:bg-white transition-all outline-none text-slate-900 font-medium"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-4 px-6 rounded-2xl shadow-lg text-lg font-bold text-white bg-virgins-purple hover:bg-virgins-purple/90 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start My Journey'}
                </button>
                <button onClick={() => onNavigate('home')} className="w-full py-2 text-slate-400 font-bold text-sm">Return Home</button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleBasicsSubmit} className="space-y-5 animate-fadeIn">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                    <input
                      type="text" required
                      className="block w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-virgins-purple focus:bg-white outline-none"
                      placeholder="Enter Full Name"
                      value={details.name}
                      onChange={e => setDetails({...details, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Age</label>
                    <input
                      type="number" required min="18"
                      className="block w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-virgins-purple focus:bg-white outline-none"
                      placeholder="21"
                      value={details.age}
                      onChange={e => setDetails({...details, age: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Gender</label>
                    <select 
                      className="block w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-virgins-purple focus:bg-white outline-none appearance-none"
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
                      className="block w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-virgins-purple focus:bg-white outline-none"
                      placeholder="Denomination (e.g. Baptist)"
                      value={details.faith}
                      onChange={e => setDetails({...details, faith: e.target.value})}
                    />
                    <input
                      type="text" required
                      className="block w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-virgins-purple focus:bg-white outline-none"
                      placeholder="Current City (e.g. Austin, TX)"
                      value={details.city}
                      onChange={e => setDetails({...details, city: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl text-white bg-navy-900 font-bold mt-4 shadow-lg active:scale-95 transition-transform"
                >
                  Save Basics
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="animate-fadeIn space-y-6">
                <div>
                   <h3 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest ml-1">I'm looking for</h3>
                   <div className="flex flex-wrap gap-2">
                      {LOOKING_FOR_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => togglePreference('lookingFor', opt)}
                          className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all ${details.lookingFor.includes(opt) ? 'bg-virgins-purple text-white border-virgins-purple shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                          {opt}
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <h3 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest ml-1">Life Interests</h3>
                   <div className="flex flex-wrap gap-2">
                      {INTEREST_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => togglePreference('interests', opt)}
                          className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all ${details.interests.includes(opt) ? 'bg-virgins-gold text-virgins-dark border-virgins-gold shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
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
                    className="w-full py-4 rounded-2xl text-white bg-navy-900 font-bold shadow-lg disabled:opacity-50 active:scale-95 transition-transform"
                  >
                    Align My Values
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <form onSubmit={handleValuesSubmit} className="space-y-8 animate-fadeIn">
                {COVENANT_QUESTIONS.map(q => (
                  <div key={q.id}>
                    <div className="flex justify-between items-end mb-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{q.label}</label>
                      <span className="text-virgins-purple font-black text-sm">{(details as any)[`${q.id}_level`]}/10</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">{q.question}</p>
                    <input
                      type="range"
                      min="1" max="10" step="1"
                      className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: 'hsl(270 100% 25%)' }}
                      value={(details as any)[`${q.id}_level`]}
                      onChange={e => setDetails({...details, [`${q.id}_level`]: parseInt(e.target.value)})}
                    />
                    <div className="flex justify-between mt-2 text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                      <span>{q.min}</span>
                      <span>{q.max}</span>
                    </div>
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl text-white bg-navy-900 font-bold mt-4 shadow-lg active:scale-95 transition-transform"
                >
                  Continue to Photos
                </button>
              </form>
            )}

            {step === 5 && (
              <div className="animate-fadeIn space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profile Photos</h3>
                   <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-500">
                     {photoCount}/6 Selected
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className={`relative aspect-[3/4] rounded-3xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center ${photo ? 'border-virgins-purple' : 'border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'}`}
                    >
                      {photo ? (
                        <>
                          <img src={photo} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-virgins-dark/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                             <button
                               onClick={() => runAudit(index)}
                               title="AI Value Audit"
                               className="p-2 bg-white text-virgins-dark rounded-full hover:bg-virgins-gold/10 shadow-xl"
                             >
                                <SearchCode size={18} />
                             </button>
                             <button
                               onClick={() => runEdit(index)}
                               title="Traditional Retouch"
                               className="p-2 bg-white text-virgins-dark rounded-full hover:bg-virgins-gold/10 shadow-xl"
                             >
                                <Wand2 size={18} />
                             </button>
                             <button 
                               onClick={() => removePhoto(index)}
                               title="Remove"
                               className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-xl"
                             >
                                <X size={18} />
                             </button>
                          </div>
                          {analyzing === index && (
                             <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 className="animate-spin text-virgins-purple" />
                             </div>
                          )}
                          {editing === index && (
                             <div className="absolute inset-0 bg-virgins-gold/20 backdrop-blur-sm flex flex-col items-center justify-center">
                                <Sparkles className="animate-pulse text-virgins-gold mb-1" />
                                <span className="text-[8px] font-black text-virgins-dark uppercase">AI Applying Filter...</span>
                             </div>
                          )}
                          {auditFeedback[index] && !analyzing && (
                             <div className="absolute bottom-0 left-0 right-0 bg-virgins-dark/90 text-white p-2 text-[8px] font-bold leading-tight uppercase tracking-tighter">
                                {auditFeedback[index]}
                             </div>
                          )}
                        </>
                      ) : (
                        <button 
                          onClick={() => handlePhotoClick(index)}
                          className="w-full h-full flex flex-col items-center justify-center p-4 text-center group"
                        >
                          <div className="w-10 h-10 bg-white rounded-full shadow-sm mb-2 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                             <Plus size={20} className="text-virgins-gold" />
                          </div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{index === 0 ? 'Main Portrait' : `Slot ${index+1}`}</span>
                          <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <ImageIcon size={10} className="text-slate-300" />
                             <Camera size={10} className="text-slate-300" />
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-virgins-cream rounded-[2rem] space-y-4">
                   <div className="flex items-start gap-4">
                     <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 border border-virgins-gold/20">
                        <Sparkles className="w-4 h-4 text-virgins-gold" />
                     </div>
                     <p className="text-xs text-virgins-purple leading-relaxed font-medium">
                       <strong>Covenant AI Audit:</strong> Hover over an image to verify modesty guidelines and value alignment before submission.
                     </p>
                   </div>
                   <div className="flex items-start gap-4">
                     <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 border border-virgins-gold/20">
                        <Camera className="w-4 h-4 text-virgins-gold" />
                     </div>
                     <p className="text-xs text-virgins-purple leading-relaxed font-medium">
                       <strong>Selection:</strong> Click any slot to choose from your <strong>Photo Gallery</strong> or use your <strong>Device Camera</strong> directly.
                     </p>
                   </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleFinalSubmit}
                    disabled={loading || photoCount < 2}
                    className="w-full py-4 rounded-2xl text-white bg-virgins-purple font-bold shadow-xl disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Complete Registration'}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-[0.2em] font-black">Minimum 2 photos required for verification</p>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="animate-fadeIn text-center py-6">
                 <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-green-50/50">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                 </div>
                 <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">Registration Successful!</h3>
                 <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                   Your profile is now live. We've pre-screened your images for traditional values. Happy discovering.
                 </p>
                 
                 <div className="space-y-4">
                    <button 
                       onClick={() => onNavigate('matchmaker')}
                       className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-virgins-purple rounded-2xl shadow-xl hover:bg-virgins-purple/90 transition-all transform hover:scale-105 text-white font-bold"
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

        <div className="flex justify-center items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
           <span className="flex items-center gap-1.5"><ShieldCheck size={12}/> Secure</span>
           <span className="flex items-center gap-1.5"><LockIcon size={12}/> Private</span>
           <span className="flex items-center gap-1.5"><User size={12}/> Verified</span>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;