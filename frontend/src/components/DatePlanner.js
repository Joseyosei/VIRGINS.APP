import React, { useState } from 'react';
import { Calendar, MapPin, Heart, Crown, ArrowRight, Check, Coffee, GlassWater, Star, Sparkles, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const venueCategories = [
  { name: 'Cafe', icon: <Coffee size={16} />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { name: 'Restaurant', icon: <GlassWater size={16} />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { name: 'Park', icon: <Star size={16} />, color: 'text-green-600 bg-green-50 border-green-200' },
];

const mockVenues = [
  { name: 'Grace Fellowship Cafe', distance: '0.8 mi', rating: 4.9, image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=400&q=80', type: 'Cafe' },
  { name: 'Covenant Garden Park', distance: '1.2 mi', rating: 4.7, image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=400&q=80', type: 'Park' },
  { name: 'The Bethany Bistro', distance: '1.5 mi', rating: 4.8, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', type: 'Restaurant' },
];

export default function DatePlanner() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);

  return (
    <div data-testid="date-planner-page" className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 text-gold-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"><Sparkles size={12} /> Courtship Planning</div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-navy-900 mb-3">Plan Your Date</h1>
          <p className="text-lg text-slate-500">Our 3-step courtship planner helps you set up the perfect date.</p>
        </div>
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-navy-900 text-gold-500 shadow-lg' : 'bg-slate-200 text-slate-500'}`}>{step > s ? <Check size={18} /> : s}</div>
              {s < 3 && <div className={`w-16 h-1 rounded-full ${step > s ? 'bg-navy-900' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <h2 className="text-2xl font-serif font-bold text-navy-900">When would you like to go?</h2>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-navy-900 outline-none transition-all bg-slate-50 focus:bg-white" />
              </div>
              <button onClick={() => setStep(2)} disabled={!date} className="w-full py-4 bg-navy-900 text-white rounded-2xl font-bold shadow-lg hover:bg-navy-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">Next Step <ArrowRight size={18} /></button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-navy-900">Choose a Venue</h2>
                <button onClick={() => setStep(1)} className="text-sm font-bold text-slate-500 hover:text-navy-900 flex items-center gap-1"><ChevronLeft size={16} /> Back</button>
              </div>
              <div className="flex gap-3 mb-6">
                {venueCategories.map(c => (
                  <button key={c.name} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${c.color} transition-all hover:shadow-md`}>{c.icon} {c.name}</button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockVenues.map(v => (
                  <button key={v.name} onClick={() => setSelectedVenue(v)} className={`text-left rounded-2xl overflow-hidden border-2 transition-all hover:shadow-lg ${selectedVenue?.name === v.name ? 'border-gold-500 shadow-lg' : 'border-transparent'}`}>
                    <img src={v.image} alt={v.name} className="w-full h-36 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-navy-900 text-sm">{v.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {v.distance}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(3)} disabled={!selectedVenue} className="w-full py-4 bg-navy-900 text-white rounded-2xl font-bold shadow-lg hover:bg-navy-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">Confirm Venue <ArrowRight size={18} /></button>
            </div>
          )}
          {step === 3 && (
            <div className="text-center space-y-6 animate-fadeIn py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"><Check className="w-10 h-10 text-green-600" /></div>
              <h2 className="text-3xl font-serif font-black text-navy-900">Date Planned!</h2>
              <p className="text-lg text-slate-500 max-w-md mx-auto">Your courtship date at <span className="font-bold text-navy-900">{selectedVenue?.name}</span> on <span className="font-bold text-navy-900">{date}</span> is ready.</p>
              <div className="flex gap-4 justify-center pt-4">
                <button onClick={() => { setStep(1); setSelectedVenue(null); setDate(''); }} className="px-6 py-3 bg-slate-100 text-navy-900 rounded-2xl font-bold hover:bg-slate-200 transition-all">Plan Another</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
