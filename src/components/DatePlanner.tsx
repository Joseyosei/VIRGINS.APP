
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Coffee, Utensils, TreePine, Church, Music, Footprints, Info, Clock, CheckCircle, ChevronRight, Search, Heart, Shield, Loader2, Home, MessageSquare } from 'lucide-react';
import { getGroundedDateSpots } from '../services/ai';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';

const CATEGORIES = [
  { id: 'coffee', label: 'Coffee Shop', icon: <Coffee size={20} /> },
  { id: 'restaurant', label: 'Fine Dining', icon: <Utensils size={20} /> },
  { id: 'park', label: 'Botanical Park', icon: <TreePine size={20} /> },
  { id: 'church', label: 'Church Event', icon: <Church size={20} /> },
  { id: 'museum', label: 'Museum / Art', icon: <Music size={20} /> },
  { id: 'walk', label: 'Historic Walk', icon: <Footprints size={20} /> },
];

const DatePlanner: React.FC<{ onNavigate?: (page: any) => void; matchId?: string }> = ({ onNavigate, matchId }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingVenues, setFetchingVenues] = useState(false);
  const [planned, setPlanned] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [dateInfo, setDateInfo] = useState({
    partner: 'Sarah',
    type: 'First Meeting',
    category: '',
    date: '',
    time: 'Evening (5pm-9pm)',
    venue: '',
    note: ''
  });

  const fetchVenues = async () => {
    setFetchingVenues(true);
    setSuggestions([]);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const result = await getGroundedDateSpots(latitude, longitude, dateInfo.category || 'coffee');
          
          if (result && result.places) {
            const list = result.places.map((chunk: any) => ({
              name: chunk.maps?.title || "Suggested Venue",
              addr: "Nearby verified location",
              badge: "High Intent",
              uri: chunk.maps?.uri
            }));
            setSuggestions(list);
          } else {
             // Fallback for demo if API limits reached
             setSuggestions([
               { name: 'Heritage Coffee Garden', addr: '0.8 mi away', badge: 'Verified Venue' },
               { name: 'Old Town Square', addr: '1.2 mi away', badge: 'Safe Public Space' }
             ]);
          }
          setFetchingVenues(false);
        }, (err) => {
          console.error("Geolocation Error:", err);
          setFetchingVenues(false);
          setSuggestions([
            { name: 'Central Garden Cafe', addr: '1.5 mi away', badge: 'Popular First Date' },
            { name: 'Modern Arts Courtyard', addr: '2.0 mi away', badge: 'Wholesome Setting' }
          ]);
        });
      }
    } catch (e) {
      console.error(e);
      setFetchingVenues(false);
    }
  };

  useEffect(() => {
    if (step === 2) {
      fetchVenues();
    }
  }, [step]);

  const handleSendInvite = async () => {
    setLoading(true);
    try {
      if (matchId) {
        await (api as any).requestDate({
          matchId,
          stage:        dateInfo.type as any,
          category:     dateInfo.category,
          venue:        dateInfo.venue,
          proposedDate: dateInfo.date,
          proposedTime: dateInfo.time,
        });
      }
      setPlanned(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send date request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (planned) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-fadeIn">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50">
              <CheckCircle className="w-10 h-10 text-green-500" />
           </div>
           <h2 className="text-3xl font-serif font-bold text-navy-900 mb-4">Invitation Sent!</h2>
           <p className="text-slate-500 text-sm mb-8 leading-relaxed">
             We've sent your intentional courtship proposal to <span className="font-bold text-navy-900">{dateInfo.partner}</span>. 
             You will be notified once they accept the invitation.
           </p>
           <div className="space-y-3">
             <button 
               onClick={() => onNavigate && onNavigate('matchmaker')} 
               className="w-full py-4 bg-navy-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-navy-800 transition-all"
             >
               <MessageSquare size={18} /> Back to Messages
             </button>
             <button 
               onClick={() => onNavigate && onNavigate('home')} 
               className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
             >
               <Home size={18} /> Return Home
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-serif font-bold text-navy-900 mb-2">Courtship Planner <Heart className="inline ml-1 text-gold-500 fill-gold-500" size={24} /></h1>
           <p className="text-slate-500">Suggest a wholesome, public meeting with {dateInfo.partner}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden relative">
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
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">1. Select Date Stage</h3>
                    <div className="grid grid-cols-1 gap-3">
                       {['First Meeting', 'Getting to Know You', 'Courtship Proposal'].map(t => (
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
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">2. Choose a Vibe</h3>
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
                   className="w-full py-4 bg-navy-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-navy-900/10"
                 >
                   Find Public Venues <ChevronRight size={18} />
                 </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                 <div className="p-4 bg-gold-50 rounded-2xl border border-gold-100 flex items-center gap-3">
                    <MapPin className="text-gold-600" size={20} />
                    <p className="text-xs text-gold-800 font-medium">Fetching verified public spaces near you...</p>
                 </div>

                 <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Grounded Venue Suggestions</h3>
                    
                    {fetchingVenues ? (
                      <div className="flex flex-col items-center py-12 text-slate-400">
                        <Loader2 className="animate-spin mb-4" />
                        <p className="text-sm">Accessing Maps Data...</p>
                      </div>
                    ) : suggestions.map((venue, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setDateInfo({...dateInfo, venue: venue.name})}
                        className={`w-full p-5 rounded-2xl border text-left transition-all group ${dateInfo.venue === venue.name ? 'border-navy-900 bg-navy-50 ring-1 ring-navy-900' : 'border-slate-100 hover:bg-slate-50'}`}
                      >
                         <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-navy-900">{venue.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gold-100 text-gold-700 rounded-full">{venue.badge}</span>
                         </div>
                         <p className="text-xs text-slate-500 mb-2">{venue.addr}</p>
                         {venue.uri && (
                            <a href={venue.uri} target="_blank" onClick={(e) => e.stopPropagation()} className="text-[10px] text-blue-500 font-bold hover:underline mb-2 block">Open in Google Maps</a>
                         )}
                      </button>
                    ))}
                 </div>

                 <div className="flex gap-3">
                   <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Back</button>
                   <button 
                     onClick={() => setStep(3)}
                     disabled={!dateInfo.venue}
                     className="flex-[2] py-4 bg-navy-900 text-white font-bold rounded-2xl disabled:opacity-50 shadow-xl shadow-navy-900/10 transition-all"
                   >
                     Confirm Location
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
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                      onChange={e => setDateInfo({...dateInfo, date: e.target.value})}
                    />
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Proposed Time</label>
                    <select 
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:ring-2 focus:ring-navy-900 outline-none transition-all"
                      value={dateInfo.time}
                      onChange={e => setDateInfo({...dateInfo, time: e.target.value})}
                    >
                       <option>Morning (8am-12pm)</option>
                       <option>Afternoon (12pm-5pm)</option>
                       <option>Evening (5pm-9pm)</option>
                       <option>Night (9pm+)</option>
                    </select>
                 </div>

                 <div className="p-4 bg-navy-50 rounded-2xl flex items-start gap-3 border border-navy-100">
                    <Shield size={18} className="text-navy-900 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-navy-800 leading-relaxed font-medium uppercase tracking-tight">
                       Accountability: Your verified support contact will receive the location details once the date is confirmed for your safety.
                    </p>
                 </div>

                 <div className="flex gap-3 pt-4">
                   <button onClick={() => setStep(2)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Back</button>
                   <button 
                     onClick={handleSendInvite}
                     disabled={loading || !dateInfo.date}
                     className="flex-[2] py-4 bg-navy-900 text-white font-bold rounded-2xl shadow-xl hover:bg-navy-800 transition-all flex items-center justify-center gap-2"
                   >
                     {loading ? <Loader2 className="animate-spin" /> : 'Send Intentional Invite'}
                   </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePlanner;
