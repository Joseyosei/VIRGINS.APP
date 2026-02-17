import React, { useState, useEffect } from 'react';
import { Heart, Loader2, MapPin, UserX, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API = process.env.REACT_APP_BACKEND_URL;

export default function LikesScreen({ onNavigate }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (user) fetchLikes();
  }, [user]);

  const fetchLikes = async () => {
    try {
      const res = await fetch(`${API}/api/likes/received`, {
        headers: { 'x-firebase-uid': user.uid },
      });
      if (res.ok) setLikes(await res.json());
    } catch (e) {
      console.error('Failed to fetch likes:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeBack = async (likerUid) => {
    setActionLoading(likerUid);
    try {
      const res = await fetch(`${API}/api/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-firebase-uid': user.uid },
        body: JSON.stringify({ toUserId: likerUid }),
      });
      const data = await res.json();
      if (data.matched) {
        alert("It's a match! You can now chat with each other.");
      }
      setLikes(prev => prev.filter(l => l.firebaseUid !== likerUid));
    } catch (e) {
      console.error('Like back failed:', e);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePass = (likerUid) => {
    setLikes(prev => prev.filter(l => l.firebaseUid !== likerUid));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">Sign in to see your likes</h2>
          <button data-testid="likes-login-btn" onClick={() => onNavigate('login')} className="mt-4 px-8 py-3 bg-navy-900 text-white rounded-full font-bold">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="likes-screen" className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} /> FREE on VIRGINS
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-navy-900 mb-3 tracking-tight">
              Who <span className="italic text-gold-600">Likes</span> You
            </h1>
            <p className="text-lg text-slate-500 font-light">
              Other apps charge $30/month for this. We believe you deserve to know.
            </p>
          </div>
          <button data-testid="likes-back-to-discover" onClick={() => onNavigate('matchmaker')}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-navy-900 shadow-sm hover:shadow-md transition-all">
            <ArrowLeft size={16} /> Back to Discover
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-gold-500 animate-spin mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading admirers...</p>
          </div>
        ) : likes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-navy-900 mb-2">No likes yet</h3>
            <p className="text-slate-500 text-center max-w-md mb-6">Keep updating your profile and stay active. The right person will notice you soon!</p>
            <button onClick={() => onNavigate('matchmaker')} className="px-8 py-3 bg-navy-900 text-white rounded-full font-bold shadow-lg hover:bg-navy-800 transition-all">
              Discover People
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {likes.map((liker) => (
              <div key={liker.firebaseUid} data-testid={`like-card-${liker.firebaseUid}`}
                className="bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-white hover:border-gold-300 transition-all overflow-hidden group animate-fadeIn">
                <div className="relative h-64 overflow-hidden">
                  <img src={liker.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'} alt={liker.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-gold-500 text-navy-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Likes You
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-navy-900">{liker.name}, {liker.age}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {liker.location || 'Somewhere beautiful'}
                  </p>
                  <p className="text-sm text-slate-600 mt-3 line-clamp-2 italic">"{liker.bio}"</p>
                  <div className="flex gap-3 mt-5">
                    <button data-testid={`like-back-${liker.firebaseUid}`} onClick={() => handleLikeBack(liker.firebaseUid)} disabled={actionLoading === liker.firebaseUid}
                      className="flex-1 py-3 bg-navy-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-navy-800 transition-all active:scale-95 shadow-lg disabled:opacity-70">
                      {actionLoading === liker.firebaseUid ? <Loader2 size={16} className="animate-spin" /> : <><Heart size={16} className="fill-gold-500 text-gold-500" /> Like Back</>}
                    </button>
                    <button data-testid={`pass-${liker.firebaseUid}`} onClick={() => handlePass(liker.firebaseUid)}
                      className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold flex items-center justify-center hover:bg-slate-200 transition-all active:scale-95">
                      <UserX size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
