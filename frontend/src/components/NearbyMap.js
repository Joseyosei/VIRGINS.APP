import React, { useState, useEffect } from 'react';
import { MapPin, Shield, EyeOff, Navigation2, Compass, Loader2, Heart, MessageCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API = process.env.REACT_APP_BACKEND_URL;

export default function NearbyMap() {
  const { user, profile } = useAuth();
  const [ghostMode, setGhostMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Detecting...");
  const [coords, setCoords] = useState(null);
  const [userNearby, setUserNearby] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const NEARBY_USERS = [
    { id: 1, name: 'Elizabeth', dist: '0.4 mi', age: 24, faith: 'Baptist', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', bio: 'Saving myself for marriage. Looking for a spiritual leader.' },
    { id: 2, name: 'Sarah', dist: '0.7 mi', age: 26, faith: 'Non-Denom', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', bio: 'Love Jesus and coffee. Want a family one day.' },
    { id: 3, name: 'Mary', dist: '1.2 mi', age: 23, faith: 'Catholic', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200', bio: 'Traditional Catholic mass attendee. Values faith above all.' },
    { id: 4, name: 'Hannah', dist: '1.5 mi', age: 22, faith: 'Baptist', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200', bio: 'Worship leader. Waiting for a man who loves God more than me.' },
    { id: 5, name: 'James', dist: '0.9 mi', age: 27, faith: 'Reformed', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', bio: 'Biblical manhood. Seeking a Proverbs 31 woman.' },
    { id: 6, name: 'Caleb', dist: '1.8 mi', age: 28, faith: 'Non-Denom', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', bio: 'Youth pastor building a future rooted in Christ.' },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          // Reverse geocode to get city name
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
            const state = data.address?.state || '';
            const country = data.address?.country_code?.toUpperCase() || '';
            const name = city ? `${city}${state ? `, ${state}` : ''}` : (profile?.location || 'Your Area');
            setLocationName(name);
          } catch {
            setLocationName(profile?.location || 'Your Area');
          }
          setUserNearby(NEARBY_USERS);
          setLoading(false);
        },
        () => {
          setLocationName(profile?.location || 'Location Unavailable');
          setUserNearby(NEARBY_USERS.slice(0, 3));
          setLoading(false);
        }
      );
    } else {
      setLocationName(profile?.location || 'Location Unavailable');
      setUserNearby(NEARBY_USERS.slice(0, 3));
      setLoading(false);
    }
  }, []);

  // User dot positions spread in a radar pattern
  const userPositions = [
    { top: '25%', left: '70%' },
    { top: '60%', left: '22%' },
    { top: '20%', left: '28%' },
    { top: '68%', left: '72%' },
    { top: '38%', left: '15%' },
    { top: '50%', left: '78%' },
  ];

  return (
    <div data-testid="nearby-map-page" className="min-h-screen bg-slate-900 pt-28 pb-8 relative overflow-hidden flex flex-col font-sans">
      <div className="max-w-6xl mx-auto px-4 w-full relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1 flex items-center gap-3">
              Nearby <Navigation2 className="text-gold-500 fill-gold-500" size={22} />
            </h1>
            <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
              <MapPin size={14} className="text-gold-500" />
              <span className="text-gold-400 font-bold">{locationName}</span>
              <span className="text-slate-600">|</span>
              <span>{userNearby.length} members nearby</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex border border-white/10">
              <button data-testid="visible-btn" onClick={() => setGhostMode(false)}
                className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${!ghostMode ? 'bg-white text-navy-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                VISIBLE
              </button>
              <button data-testid="ghost-btn" onClick={() => setGhostMode(true)}
                className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all flex items-center gap-1 ${ghostMode ? 'bg-gold-500 text-navy-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                <EyeOff size={12} /> GHOST
              </button>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="bg-navy-800 rounded-[2rem] sm:rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex-1 flex flex-col relative min-h-[450px] sm:min-h-[500px]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4">
              <Loader2 className="animate-spin text-gold-500" size={40} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Calibrating Radar...</p>
            </div>
          ) : (
            <div className="absolute inset-0 z-0">
              <div className="w-full h-full bg-[#0a0a14] relative overflow-hidden">
                {/* Background texture */}
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                {/* Radar rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-[800px] h-[800px] rounded-full border border-white/[0.03]" />
                  <div className="absolute inset-0 w-[550px] h-[550px] rounded-full border border-white/[0.06] m-auto" />
                  <div className="absolute inset-0 w-[320px] h-[320px] rounded-full border border-gold-500/10 m-auto" />
                  <div className="absolute inset-0 w-[140px] h-[140px] rounded-full border border-gold-500/20 m-auto" />
                </div>

                {/* Radar sweep animation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
                  <div className="w-full h-full rounded-full" style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(212,165,116,0.08) 30deg, transparent 60deg)',
                    animation: 'spin 4s linear infinite',
                  }} />
                </div>

                {/* Your location - center dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative flex flex-col items-center">
                    <div className="absolute inset-0 bg-blue-500/15 rounded-full animate-ping" style={{ width: '80px', height: '80px', marginLeft: '-32px', marginTop: '-32px' }} />
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.5)] border-4 border-navy-900 relative z-10">
                      <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                    </div>
                    <div className="mt-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl z-10">
                      <p className="text-[10px] font-black text-navy-900 uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
                        You - {locationName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nearby users on radar */}
                {userNearby.map((nearbyUser, idx) => {
                  const pos = userPositions[idx] || { top: '50%', left: '50%' };
                  return (
                    <button key={nearbyUser.id}
                      data-testid={`nearby-user-${nearbyUser.id}`}
                      onClick={() => setSelectedUser(nearbyUser)}
                      className="absolute z-20 transition-all duration-500 group cursor-pointer"
                      style={{ top: pos.top, left: pos.left }}>
                      <div className="relative flex flex-col items-center">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gold-500/20 rounded-full animate-pulse" />
                          <div className="bg-white p-1 rounded-full border-2 border-gold-500 shadow-2xl transform group-hover:scale-125 transition-transform duration-300 relative">
                            <img src={nearbyUser.img} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover" alt={nearbyUser.name} />
                            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                          </div>
                        </div>
                        {/* Always visible label */}
                        <div className="mt-2 bg-navy-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-xl">
                          <p className="text-[9px] font-black text-white whitespace-nowrap">{nearbyUser.name}, {nearbyUser.age}</p>
                        </div>
                        {/* Distance on hover */}
                        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[8px] font-bold text-gold-500 bg-navy-900/80 px-2 py-0.5 rounded-full">{nearbyUser.dist}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom user cards - scrollable */}
          {!loading && (
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 z-30">
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {userNearby.map(nearbyUser => (
                  <button key={nearbyUser.id} onClick={() => setSelectedUser(nearbyUser)}
                    className="flex-shrink-0 w-56 sm:w-64 bg-navy-900/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl flex items-center gap-4 group hover:bg-navy-800 transition-all hover:-translate-y-1 text-left">
                    <img src={nearbyUser.img} className="w-14 h-14 rounded-full border-2 border-gold-500 shadow-xl object-cover flex-shrink-0" alt={nearbyUser.name} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-base leading-none mb-1 truncate">{nearbyUser.name}, {nearbyUser.age}</h4>
                      <p className="text-[10px] text-gold-500 font-bold">{nearbyUser.faith}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">{nearbyUser.dist}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Top-left info cards */}
          {!loading && (
            <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-30 flex flex-col gap-2">
              <div className="bg-navy-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 flex items-center gap-3 shadow-xl">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest block">{userNearby.length} Members Nearby</span>
                  <span className="text-[9px] text-slate-500 font-medium">{locationName}</span>
                </div>
              </div>
              <div className="bg-gold-500 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-3">
                <Shield size={16} className="text-navy-900" />
                <span className="text-[9px] font-black text-navy-900 uppercase tracking-widest">Safe Mode Active</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected user modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[120] bg-navy-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fadeIn p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="relative h-48">
              <img src={selectedUser.img} className="w-full h-full object-cover" alt={selectedUser.name} />
              <button data-testid="close-nearby-modal" onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"><X size={20} /></button>
              <div className="absolute bottom-4 left-4">
                <span className="bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">Online Now</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-serif font-black text-navy-900">{selectedUser.name}, {selectedUser.age}</h3>
              <p className="text-sm text-gold-600 font-bold mt-1">{selectedUser.faith} &bull; {selectedUser.dist} away</p>
              <p className="text-sm text-slate-600 mt-3 italic leading-relaxed">"{selectedUser.bio}"</p>
              <div className="flex gap-3 mt-5">
                <button className="flex-1 py-3 bg-navy-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                  <Heart size={16} className="fill-gold-500 text-gold-500" /> Like
                </button>
                <button className="flex-1 py-3 bg-slate-100 text-navy-900 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <MessageCircle size={16} /> Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
