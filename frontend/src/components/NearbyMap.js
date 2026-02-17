import React, { useState, useEffect } from 'react';
import { MapPin, Users, Shield, EyeOff, Navigation2, Compass, Loader2 } from 'lucide-react';

export default function NearbyMap() {
  const [ghostMode, setGhostMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Detecting...");
  const [userNearby, setUserNearby] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationName("Your Current Location");
        setUserNearby([
          { id: 1, name: 'Elizabeth', dist: '0.4 mi', age: 24, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
          { id: 2, name: 'Sarah', dist: '0.7 mi', age: 26, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
          { id: 3, name: 'Mary', dist: '1.2 mi', age: 23, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100' },
          { id: 4, name: 'Hannah', dist: '1.5 mi', age: 22, img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100' },
        ]);
        setLoading(false);
      }, () => {
        setLoading(false);
        setLocationName("San Francisco, CA (Demo)");
        setUserNearby([
          { id: 1, name: 'Elizabeth', dist: '0.4 mi', age: 24, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
          { id: 2, name: 'Sarah', dist: '0.7 mi', age: 26, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
        ]);
      });
    } else { setLoading(false); }
  }, []);

  return (
    <div data-testid="nearby-map-page" className="min-h-screen bg-slate-900 pt-32 pb-12 relative overflow-hidden flex flex-col font-sans">
      <div className="max-w-6xl mx-auto px-4 w-full relative z-10 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2 flex items-center gap-3">Live Community <Navigation2 className="text-gold-500 fill-gold-500" size={24} /></h1>
            <p className="text-slate-400 font-medium">Verified, intentional singles currently near you.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-1.5 flex border border-white/10 shadow-2xl">
              <button onClick={() => setGhostMode(false)} className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${!ghostMode ? 'bg-white text-navy-900 shadow-lg scale-105' : 'text-slate-400 hover:text-white'}`}>VISIBLE</button>
              <button onClick={() => setGhostMode(true)} className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${ghostMode ? 'bg-gold-500 text-navy-900 shadow-lg scale-105' : 'text-slate-400 hover:text-white'}`}><EyeOff size={14} className="inline mr-1" /> GHOST</button>
            </div>
          </div>
        </div>
        <div className="bg-navy-800 rounded-[3.5rem] border border-white/5 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex-1 flex flex-col relative min-h-[500px]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4"><Loader2 className="animate-spin text-gold-500" size={40} /><p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Calibrating Radar...</p></div>
          ) : (
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-[#0a0a14] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-[1000px] h-[1000px] rounded-full border border-white/5 animate-pulse" />
                  <div className="absolute inset-0 w-[600px] h-[600px] rounded-full border border-white/10 m-auto" />
                  <div className="absolute inset-0 w-[300px] h-[300px] rounded-full border border-gold-500/10 m-auto" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-[4]" />
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.6)] border-4 border-navy-900">
                      <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                    </div>
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"><span className="bg-navy-900/90 text-[10px] font-black text-white px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">{locationName}</span></div>
                  </div>
                </div>
                {userNearby.map((user, idx) => (
                  <div key={user.id} className="absolute z-20 transition-all duration-1000 group cursor-pointer" style={{ top: `${40 + (idx === 0 ? -15 : idx === 1 ? 25 : idx === 2 ? -8 : 18)}%`, left: `${50 + (idx === 0 ? 30 : idx === 1 ? -25 : idx === 2 ? -35 : 22)}%` }}>
                    <div className="relative flex flex-col items-center">
                      <div className="bg-white p-1.5 rounded-full border-2 border-gold-500 shadow-2xl transform hover:scale-125 transition-transform duration-300">
                        <img src={user.img} className="w-14 h-14 rounded-full object-cover" alt={user.name} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                      </div>
                      <div className="mt-3 bg-navy-900/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold-500/30 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] font-black text-white whitespace-nowrap">{user.name}, {user.age} &bull; {user.dist}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="absolute bottom-12 left-8 right-8 z-30">
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {userNearby.map(user => (
                <div key={user.id} className="flex-shrink-0 w-64 bg-navy-900/80 backdrop-blur-3xl rounded-[2.5rem] p-5 border border-white/10 shadow-2xl flex items-center gap-5 group hover:bg-navy-800 transition-all hover:-translate-y-2 cursor-pointer">
                  <img src={user.img} className="w-16 h-16 rounded-full border-2 border-gold-500 shadow-xl object-cover" alt={user.name} />
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg leading-none mb-1">{user.name}</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{user.dist} Away</p>
                    <button className="mt-2 text-[10px] font-black text-gold-500 hover:text-gold-400 flex items-center gap-1 group">READ PROFILE <Compass size={12} className="group-hover:rotate-45 transition-transform" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-8 left-8 z-30 flex flex-col gap-3">
            <div className="bg-navy-900/90 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 shadow-2xl">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" /><div><span className="text-[10px] font-black text-white uppercase tracking-widest block">Live Members</span><span className="text-[11px] text-slate-400 font-medium">12 Active nearby</span></div>
            </div>
            <div className="bg-gold-500 p-5 rounded-[2rem] shadow-2xl flex items-center gap-4">
              <Shield size={20} className="text-navy-900" /><div><span className="text-[10px] font-black text-navy-900 uppercase tracking-widest block">Safe Mode</span><span className="text-[11px] text-navy-800/70 font-bold">Privacy Scrambling Active</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
