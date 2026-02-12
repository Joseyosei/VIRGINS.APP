
import React, { useState, useEffect } from 'react';
import { MapPin, Users, Filter, ChevronLeft, Shield, EyeOff, CheckCircle, Info, Navigation2 } from 'lucide-react';

const NearbyMap: React.FC = () => {
  const [ghostMode, setGhostMode] = useState(false);
  const [radius, setRadius] = useState(2);
  const [coords, setCoords] = useState({ lat: 30.2672, lng: -97.7431 }); // Default Austin
  const [userNearby, setUserNearby] = useState<any[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        // Generate random offsets for mock pins
        const mocks = [
          { id: 1, name: 'Elizabeth', dist: '0.3 mi', lat: pos.coords.latitude + 0.002, lng: pos.coords.longitude - 0.001, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
          { id: 2, name: 'Sarah', dist: '0.6 mi', lat: pos.coords.latitude - 0.003, lng: pos.coords.longitude + 0.002, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
          { id: 3, name: 'Mary', dist: '1.1 mi', lat: pos.coords.latitude + 0.005, lng: pos.coords.longitude + 0.004, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100' },
        ];
        setUserNearby(mocks);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 pt-32 pb-12 relative overflow-hidden flex flex-col">
      <div className="max-w-6xl mx-auto px-4 w-full relative z-10 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
           <div>
              <h1 className="text-3xl font-serif font-bold text-white mb-2 flex items-center gap-3">
                Live Community <Navigation2 className="text-gold-500 fill-gold-500" size={24} />
              </h1>
              <p className="text-slate-400">Intentional singles currently near you</p>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-full p-1.5 flex border border-white/10 shadow-2xl">
                 <button 
                   onClick={() => setGhostMode(false)}
                   className={`px-5 py-2 rounded-full text-xs font-black transition-all ${!ghostMode ? 'bg-white text-navy-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                 >
                   VISIBLE
                 </button>
                 <button 
                   onClick={() => setGhostMode(true)}
                   className={`px-5 py-2 rounded-full text-xs font-black transition-all ${ghostMode ? 'bg-gold-500 text-navy-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                 >
                   <EyeOff size={14} className="inline mr-1" /> GHOST
                 </button>
              </div>
           </div>
        </div>

        <div className="bg-navy-800 rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex-1 flex flex-col relative">
           <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-[#0a0a14] relative overflow-hidden">
                 <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
                    {Array.from({length: 144}).map((_, i) => (
                      <div key={i} className="border border-white/10"></div>
                    ))}
                 </div>
                 
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-[800px] h-[800px] rounded-full border border-white/5 animate-pulse"></div>
                    <div className="absolute inset-0 w-[500px] h-[500px] rounded-full border border-white/5 m-auto"></div>
                 </div>

                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="relative">
                       <div className="absolute inset-0 bg-gold-500/20 rounded-full animate-ping scale-[3]"></div>
                       <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] border-4 border-navy-900">
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                       </div>
                    </div>
                 </div>

                 {userNearby.map((user, idx) => (
                    <div 
                      key={user.id} 
                      className="absolute z-20 transition-all duration-1000 group cursor-pointer"
                      style={{
                        top: `${40 + (idx === 0 ? -15 : idx === 1 ? 20 : -5)}%`,
                        left: `${50 + (idx === 0 ? 25 : idx === 1 ? -20 : -35)}%`,
                      }}
                    >
                       <div className="relative flex flex-col items-center">
                          <div className="bg-white p-1 rounded-full border-2 border-gold-500 shadow-2xl transform hover:scale-125 transition-transform">
                             <img src={user.img} className="w-12 h-12 rounded-full object-cover" />
                             <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="mt-2 bg-navy-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-gold-500/30">
                             <p className="text-[10px] font-black text-white">{user.name} • {user.dist}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="absolute bottom-8 left-8 right-8 z-30">
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                 {userNearby.map(user => (
                   <div key={user.id} className="flex-shrink-0 w-56 bg-navy-900/80 backdrop-blur-2xl rounded-3xl p-5 border border-white/10 shadow-2xl flex items-center gap-4 group hover:bg-navy-800 transition-all">
                      <img src={user.img} className="w-14 h-14 rounded-full border-2 border-gold-500 shadow-xl" />
                      <div className="flex-1">
                         <h4 className="text-white font-bold">{user.name}</h4>
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest">{user.dist} • Verified</p>
                         <button className="mt-2 text-[10px] font-black text-gold-500 hover:text-gold-400">VIEW PROFILE →</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="absolute top-8 left-8 z-30 flex flex-col gap-3">
              <div className="bg-navy-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Live: 12 members nearby</span>
              </div>
              <div className="bg-gold-500 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                 <Shield size={18} className="text-navy-900" />
                 <span className="text-[10px] font-black text-navy-900 uppercase tracking-widest">Privacy Protected</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyMap;
