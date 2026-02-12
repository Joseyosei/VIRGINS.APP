
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Coffee, Utensils, TreePine, Church, Music, Footprints, Info, Clock, CheckCircle, ChevronRight, Search, Heart, Shield, Loader2 } from 'lucide-react';
import { getGroundedDateSpots } from '../services/geminiService';

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
  const [fetchingVenues, setFetchingVenues] = useState(false);
  const [planned, setPlanned] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [dateInfo, setDateInfo] = useState({
    partner: 'Sarah',
    type: 'Getting to Know You',
    category: '',
    date: '',
    time: 'Evening (5pm-9pm)',
    venue: '',
    note: ''
  });

  const fetchVenues = async () => {
    setFetchingVenues(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const result = await getGroundedDateSpots(latitude, longitude, dateInfo.category);
          if (result && result.places) {
            // Map grounding chunks to simple objects
            const list = result.places.map((chunk: any) => ({
              name: chunk.maps?.title || "Suggested Venue",
              addr: "Nearby verified location",
              badge: "High Intent",
              uri: chunk.maps?.uri
            }));
            setSuggestions(list);
          } else {
             // Fallback
             setSuggestions([
               { name: 'Local Coffee Garden', addr: 'Downtown', badge: 'Verified' },
               { name: 'Heritage Park Stroll', addr: 'Westside', badge: 'Safe Area' }
             ]);
          }
          setFetchingVenues(false);
        }, (err) => {
          console.error(err);
          setFetchingVenues(false);
          setSuggestions([
            { name: 'Quiet Corner Cafe', addr: 'Central City', badge: 'Public' },
            { name: 'Botanical Courtyard', addr: 'Uptown', badge: 'Peaceful' }
          ]);
        });
      }
    } catch (e) {
      setFetchingVenues(false);
    }
  };

  useEffect(() => {
    if (step === 2 && dateInfo.category) {
      fetchVenues();
    }
  }, [step, dateInfo.category]);

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
           </p>
           <button onClick={() => setPlanned(false)} className="w-full py-4 bg-navy-900 text-white font-bold rounded-2xl">
             Back to Messages
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-serif font-bold text-navy-900 mb-2">Plan a Date <Heart className="inline ml-1 text-gold-500 fill-gold-500" size={24} /></h1>
           <p className="text-slate-500">Coordinate a meaningful meeting with {dateInfo.partner}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden">
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
                 <div className="p-4 bg-gold-50 rounded-2xl border border-gold-100 flex items-center gap-3">
                    <MapPin className="text-gold-600" size={20} />
                    <p className="text-xs text-gold-800 font-medium">Finding best places near you...</p>
                 </div>

                 <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Grounded Venue Suggestions</h3>
                    
                    {fetchingVenues ? (
                      <div className="flex flex-col items-center py-12 text-slate-400">
                        <Loader2 className="animate-spin mb-4" />
                        <p className="text-sm">Accessing Maps Grounding...</p>
                      </div>
                    ) : suggestions.map((venue, idx) => (
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
                         {venue.uri && (
                            <a href={venue.uri} target="_blank" className="text-[10px] text-blue-500 underline mb-2 block">View on Maps</a>
                         )}
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
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white outline-none"
                      value={dateInfo.time}
                      onChange={e => setDateInfo({...dateInfo, time: e.target.value})}
                    >
                       <option>Morning (8am-12pm)</option>
                       <option>Afternoon (12pm-5pm)</option>
                       <option>Evening (5pm-9pm)</option>
                       <option>Night (9pm+)</option>
                    </select>
                 </div>

                 <button 
                   onClick={handleSendInvite}
                   disabled={loading || !dateInfo.date}
                   className="w-full py-4 bg-navy-900 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2"
                 >
                   {loading ? <Loader2 className="animate-spin" /> : 'Send Date Invitation'}
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePlanner;
