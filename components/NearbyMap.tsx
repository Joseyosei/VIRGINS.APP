import React, { useState } from 'react';
import { MapPin, Users, Filter, ChevronLeft, Shield, EyeOff, CheckCircle, Info } from 'lucide-react';

const MOCK_NEARBY = [
  { id: 1, name: 'Sarah', dist: '0.5 mi', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: 2, name: 'Emily', dist: '0.8 mi', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
  { id: 3, name: 'Grace', dist: '1.2 mi', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100' },
  { id: 4, name: 'Hannah', dist: '1.5 mi', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100' },
];

const NearbyMap: React.FC = () => {
  const [ghostMode, setGhostMode] = useState(false);
  const [radius, setRadius] = useState(2);

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12 relative overflow-hidden">
      {/* Background Simulated Map */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <img 
           src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
           className="w-full h-full object-cover scale-110" 
           alt="Map Grid"
         />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
           <div>
              <h1 className="text-3xl font-serif font-bold text-white mb-2 flex items-center gap-3">
                Nearby Community <MapPin className="text-gold-500" />
              </h1>
              <p className="text-slate-400">Discover marriage-minded singles in your area</p>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex border border-white/10">
                 <button 
                   onClick={() => setGhostMode(false)}
                   className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!ghostMode ? 'bg-white text-navy-900' : 'text-white'}`}
                 >
                   Visible
                 </button>
                 <button 
                   onClick={() => setGhostMode(true)}
                   className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${ghostMode ? 'bg-gold-500 text-white' : 'text-white'}`}
                 >
                   <EyeOff size={14} className="inline mr-1" /> Ghost
                 </button>
              </div>
           </div>
        </div>

        {/* Map Container */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
           {/* Controls Bar */}
           <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-xs font-bold text-white uppercase tracking-widest">12 Active Members within {radius} miles</span>
              </div>
              <div className="flex items-center gap-3">
                 <select 
                   value={radius} 
                   onChange={e => setRadius(parseInt(e.target.value))}
                   className="bg-navy-800 text-white border-none rounded-lg text-xs font-bold py-1.5 px-3 outline-none"
                 >
                    <option value={1}>1 mile</option>
                    <option value={2}>2 miles</option>
                    <option value={5}>5 miles</option>
                 </select>
                 <button className="p-1.5 bg-navy-800 text-gold-500 rounded-lg"><Filter size={16} /></button>
              </div>
           </div>

           {/* Interactive Visual Area */}
           <div className="flex-1 relative flex items-center justify-center p-12">
              {/* Central User Pulse */}
              <div className="relative">
                 <div className="absolute inset-0 bg-gold-500 rounded-full animate-ping opacity-20 scale-[4]"></div>
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-navy-900">
                    <div className="w-3 h-3 bg-gold-500 rounded-full"></div>
                 </div>
              </div>

              {/* Surrounding Profiles (Simulated Pins) */}
              {MOCK_NEARBY.map((user, idx) => (
                <div 
                  key={user.id}
                  className="absolute animate-fadeIn group cursor-pointer"
                  style={{
                    top: `${20 + Math.sin(idx) * 30}%`,
                    left: `${20 + Math.cos(idx) * 30}%`,
                  }}
                >
                   <div className="relative">
                      <div className="bg-white p-1 rounded-full border-2 border-gold-500 shadow-xl group-hover:scale-110 transition-transform">
                         <img src={user.img} className="w-10 h-10 rounded-full object-cover" alt={user.name} />
                      </div>
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-navy-900 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-gold-500">
                        {user.name} • {user.dist}
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {/* List Preview */}
           <div className="p-6 bg-black/30 mt-auto border-t border-white/5">
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                 {MOCK_NEARBY.map(user => (
                   <div key={user.id} className="flex-shrink-0 w-40 bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                         <img src={user.img} className="w-8 h-8 rounded-full border border-gold-500" />
                         <div>
                            <p className="text-xs font-bold text-white">{user.name}</p>
                            <p className="text-[10px] text-slate-400">{user.dist} away</p>
                         </div>
                      </div>
                      <button className="w-full py-1.5 bg-gold-500 text-navy-900 text-[10px] font-bold rounded-lg uppercase tracking-widest">View Profile</button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Privacy Info */}
        <div className="mt-8 p-6 bg-navy-800/50 rounded-[2rem] border border-white/5 flex items-start gap-4">
           <div className="p-2 bg-white/5 rounded-xl"><Shield className="text-gold-500" size={20} /></div>
           <div>
              <h4 className="text-sm font-bold text-white mb-1">Privacy Guarantee</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your exact GPS coordinates are <strong>never</strong> shared. Members only see your approximate location (2-mile fuzzy radius). 
                Ghost mode is available for Plus and Ultimate members to browse anonymously.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyMap;