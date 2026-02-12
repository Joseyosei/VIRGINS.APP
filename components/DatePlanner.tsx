import React, { useState } from 'react';
import { Calendar, MapPin, Coffee, Utensils, TreePine, Church, Music, Footprints, Info, Clock, CheckCircle, ChevronRight, Search, Heart, Shield } from 'lucide-react';

const CATEGORIES = [
  { id: 'coffee', label: 'Coffee Shop', icon: <Coffee size={20} /> },
  { id: 'restaurant', label: 'Restaurant', icon: <Utensils size={20} /> },
  { id: 'park', label: 'Park / Outdoor', icon: <TreePine size={20} /> },
  { id: 'church', label: 'Church Event', icon: <Church size={20} /> },
  { id: 'museum', label: 'Museum / Art', icon: <Music size={20} /> },
  { id: 'walk', label: 'Walk / Stroll', icon: <Footprints size={20} /> },
];

const DatePlanner: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [planned, setPlanned] = useState(false);

  const [dateInfo, setDateInfo] = useState({
    partner: 'Sarah',
    type: 'Getting to Know You',
    category: '',
    date: '',
    time: 'Evening (5pm-9pm)',
    venue: '',
    note: ''
  });

  const handleSendInvite = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPlanned(true);
    }, 1500);
  };

  if (planned) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-fadeIn">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50">
              <CheckCircle className="w-10 h-10 text-green-500" />
           </div>
           <h2 className="text-3xl font-serif font-bold text-navy-900 mb-4">Invitation Sent!</h2>
           <p className="text-slate-500 text-sm mb-8">
             We've sent your courtship proposal to <span className="font-bold text-navy-900">{dateInfo.partner}</span>. 
             You'll be notified when she accepts or suggests changes.
           </p>
           
           <div className="bg-navy-50 rounded-2xl p-6 border border-navy-100 text-left mb-8">
              <div className="flex items-center gap-3 mb-4">
                 <Calendar className="w-4 h-4 text-navy-600" />
                 <span className="text-sm font-bold text-navy-900">{dateInfo.date || 'TBD'} • {dateInfo.time}</span>
              </div>
              <div className="flex items-center gap-3">
                 <MapPin className="w-4 h-4 text-navy-600" />
                 <span className="text-sm font-bold text-navy-900">{dateInfo.venue || 'Blue Bottle Coffee'}</span>
              </div>
           </div>

           <button onClick={() => window.location.reload()} className="w-full py-4 bg-navy-900 text-white font-bold rounded-2xl">
             Back to Messages
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
           <h1 className="text-3xl font-serif font-bold text-navy-900 mb-2">Plan a Date <Heart className="inline ml-1 text-gold-500 fill-gold-500" size={24} /></h1>
           <p className="text-slate-500">Coordinate a meaningful meeting with Sarah</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden">
          {/* Progress */}
          <div className="h-1.5 w-full bg-slate-100">
             <div 
               className="h-full bg-navy-900 transition-all duration-500" 
               style={{ width: `${(step / 3) * 100}%` }}
             ></div>
          </div>

          <div className="p-8">
            {step === 1 && (
              <div className="space-y-8 animate-fadeIn">
                 <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">1. Date Type</h3>
                    <div className="grid grid-cols-1 gap-3">
                       {['First Meeting', 'Getting to Know You', 'Courtship Meeting'].map(t => (
                         <button 
                           key={t}
                           onClick={() => setDateInfo({...dateInfo, type: t})}
                           className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${dateInfo.type === t ? 'bg-navy-900 border-navy-900 text-white shadow-lg' : 'bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100'}`}
                         >
                           <span className="font-bold">{t}</span>
                           {dateInfo.type === t && <CheckCircle size={18} />}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">2. Pick a Vibe</h3>
                    <div className="grid grid-cols-2 gap-3">
                       {CATEGORIES.map(cat => (
                         <button 
                           key={cat.id}
                           onClick={() => setDateInfo({...dateInfo, category: cat.id})}
                           className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${dateInfo.category === cat.id ? 'bg-gold-500 border-gold-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-gold-200'}`}
                         >
                           {cat.icon}
                           <span className="text-xs font-bold">{cat.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 <button 
                   onClick={() => setStep(2)}
                   disabled={!dateInfo.category}
                   className="w-full py-4 bg-navy-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   Select Venue <ChevronRight size={18} />
                 </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search public places near Sarah..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:ring-2 focus:ring-navy-900 outline-none"
                    />
                 </div>

                 <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Suggested for First Dates</h3>
                    {[
                      { name: 'Blue Bottle Coffee', addr: '123 Main St, Austin', rating: '4.8', badge: 'High Intent' },
                      { name: 'Zilker Park Stroll', addr: 'Barton Springs Rd', rating: '4.9', badge: 'Active' },
                    ].map((venue, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setDateInfo({...dateInfo, venue: venue.name})}
                        className={`w-full p-5 rounded-2xl border text-left transition-all ${dateInfo.venue === venue.name ? 'border-navy-900 bg-navy-50' : 'border-slate-100 hover:bg-slate-50'}`}
                      >
                         <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-navy-900">{venue.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gold-100 text-gold-700 rounded-full">{venue.badge}</span>
                         </div>
                         <p className="text-xs text-slate-500 mb-2">{venue.addr}</p>
                         <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock size={12} /> Open until 8:00 PM
                         </div>
                      </button>
                    ))}
                 </div>

                 <div className="flex gap-3">
                   <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Back</button>
                   <button 
                     onClick={() => setStep(3)}
                     disabled={!dateInfo.venue}
                     className="flex-[2] py-4 bg-navy-900 text-white font-bold rounded-2xl disabled:opacity-50"
                   >
                     Confirm Time
                   </button>
                 </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                 <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                      We suggest public places for first meetings. Shared details are sent to Sarah for safety verification.
                    </p>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Proposed Date</label>
                    <input 
                      type="date" 
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white outline-none"
                      onChange={e => setDateInfo({...dateInfo, date: e.target.value})}
                    />
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Proposed Time</label>
                    <select 
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white outline-none appearance-none"
                      value={dateInfo.time}
                      onChange={e => setDateInfo({...dateInfo, time: e.target.value})}
                    >
                       <option>Morning (8am-12pm)</option>
                       <option>Afternoon (12pm-5pm)</option>
                       <option>Evening (5pm-9pm)</option>
                       <option>Night (9pm+)</option>
                    </select>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Add a Wholesome Note</label>
                    <textarea 
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white outline-none resize-none"
                      rows={3}
                      placeholder="I'd love to learn more about your faith journey..."
                      onChange={e => setDateInfo({...dateInfo, note: e.target.value})}
                    ></textarea>
                 </div>

                 <button 
                   onClick={handleSendInvite}
                   disabled={loading || !dateInfo.date}
                   className="w-full py-4 bg-navy-900 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2"
                 >
                   {loading ? <Clock className="animate-spin" /> : 'Send Date Invitation'}
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Safety Footer */}
        <div className="mt-8 flex justify-center items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           {/* Fix: Use imported Shield icon */}
           <span className="flex items-center gap-1.5"><Shield size={12} /> Verified Venues</span>
           <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
           <span className="flex items-center gap-1.5"><CheckCircle size={12} /> Accountability</span>
        </div>
      </div>
    </div>
  );
};

export default DatePlanner;