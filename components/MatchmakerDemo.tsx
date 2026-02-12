
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Filter, RefreshCw, Heart, Check, ChevronDown, Sparkles, MessageCircle, ShieldCheck, X, Send, User, MapPin, Zap, Info, CheckCircle } from 'lucide-react';
import { MatchPreferences, MatchResult } from '../types';
import { calculateMatches } from '../services/matchingService';

const MatchmakerDemo: React.FC = () => {
  const [prefs, setPrefs] = useState<MatchPreferences>({
    gender: 'Female',
    minAge: 18,
    maxAge: 35,
    faithImportance: 10,
    valueImportance: 9,
    locationImportance: 5,
    targetDenominations: ['Baptist', 'Catholic', 'Non-Denominational'],
    requiredValues: ['Purity', 'Family', 'Tradition']
  });

  const [results, setResults] = useState<MatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // UI States
  const [activeChat, setActiveChat] = useState<MatchResult | null>(null);
  const [viewingProfile, setViewingProfile] = useState<MatchResult | null>(null);
  const [quickScoreProfile, setQuickScoreProfile] = useState<MatchResult | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMsg, setInputMsg] = useState("");

  useEffect(() => {
    runAlgorithm();
  }, []);

  const runAlgorithm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const matches = calculateMatches(prefs);
      setResults(matches);
      setIsProcessing(false);
    }, 800);
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedProfiles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openChat = (e: React.MouseEvent, profile: MatchResult) => {
    e.stopPropagation();
    setActiveChat(profile);
    setMessages(["Hi! I really appreciated your profile and your commitment to tradition.", "I'd love to learn more about what you're looking for."]);
  };

  const openQuickScore = (e: React.MouseEvent, profile: MatchResult) => {
    e.stopPropagation();
    setQuickScoreProfile(profile);
  };

  const sendMessage = () => {
    if (!inputMsg.trim()) return;
    setMessages(prev => [...prev, inputMsg]);
    setInputMsg("");
    setTimeout(() => {
      setMessages(prev => [...prev, "Thank you for the thoughtful message. Intentionality is so rare these days. How was your day?"]);
    }, 1500);
  };

  const ScoreBar = ({ label, score, max, color }: { label: string, score: number, max: number, color: string }) => (
    <div className="mb-4">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
        <span className="text-slate-500">{label}</span>
        <span className="text-navy-900">{Math.round(score)}/{max}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${(score / max) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Powered by Covenant AI
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-navy-900 mb-4 tracking-tight leading-tight">Daily <span className="italic text-gold-600">Discoveries</span></h1>
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              Profiles curated for theological alignment. Tap "Quick Score" for instant insights.
            </p>
          </div>
          
          <div className="flex gap-3">
             <button 
               onClick={runAlgorithm}
               disabled={isProcessing}
               className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-navy-900 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
             >
               <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
               Refresh Feed
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Side Filter Controls */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 p-8 sticky top-32">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-navy-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gold-500" /> Preferences
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Looking for</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                      onClick={() => { setPrefs({...prefs, gender: 'Female'}); setTimeout(runAlgorithm, 0); }}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${prefs.gender === 'Female' ? 'bg-white shadow-sm text-navy-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Women
                    </button>
                    <button 
                      onClick={() => { setPrefs({...prefs, gender: 'Male'}); setTimeout(runAlgorithm, 0); }}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${prefs.gender === 'Male' ? 'bg-white shadow-sm text-navy-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Men
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={runAlgorithm}
                    disabled={isProcessing}
                    className="w-full py-4 bg-navy-900 text-white rounded-2xl font-bold shadow-xl hover:bg-navy-800 transition-all flex items-center justify-center gap-2 group"
                  >
                    <BrainCircuit className="w-5 h-5 text-gold-500 group-hover:scale-110 transition-transform" />
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Matches Feed */}
          <div className="lg:col-span-8">
            {isProcessing ? (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-100">
                 <div className="w-16 h-16 border-4 border-slate-100 border-t-gold-500 rounded-full animate-spin"></div>
                 <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mt-4">Filtering for Forever...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {results.map((result) => (
                  <div 
                    key={result.profile.id} 
                    onClick={() => setViewingProfile(result)}
                    className="bg-white rounded-[2.5rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] border border-white hover:border-gold-300 transition-all group overflow-hidden animate-fadeIn cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="relative w-full md:w-[280px] h-[320px] md:h-auto overflow-hidden">
                         <img src={result.profile.image} alt={result.profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                            <span className="text-white text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">Expand Commitment</span>
                         </div>
                         <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button 
                              onClick={(e) => openQuickScore(e, result)}
                              className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-xl text-[10px] font-black text-gold-700 shadow-xl flex items-center gap-2 border border-gold-200 hover:bg-gold-50 transition-colors"
                            >
                               <Zap size={12} className="fill-gold-500 text-gold-500" /> Quick Score
                            </button>
                         </div>
                         <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <div className="bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-xl text-[10px] font-black text-navy-900 shadow-xl flex items-center gap-2 border border-white/50">
                               <ShieldCheck size={12} className="text-green-600" /> Verified
                            </div>
                         </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-8 md:p-10 flex flex-col">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                               <h3 className="text-3xl font-serif font-black text-navy-900 leading-none">{result.profile.name}, {result.profile.age}</h3>
                               <p className="text-sm font-bold text-gold-600 mt-2">{result.profile.denomination} • {result.profile.faithLevel}</p>
                            </div>
                            <div className="text-right">
                               <div className="text-4xl font-black text-navy-900 tabular-nums">{result.score}%</div>
                               <div className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Covenant Score</div>
                            </div>
                         </div>

                         <p className="text-slate-600 text-sm leading-relaxed mb-6 italic line-clamp-3">
                           "{result.profile.bio}"
                         </p>

                         <div className="mt-auto flex items-center gap-3">
                            <button 
                              onClick={(e) => handleLike(e, result.profile.id)}
                              className={`flex-[2] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${likedProfiles.has(result.profile.id) ? 'bg-gold-500 text-white' : 'bg-navy-900 text-white'}`}
                            >
                               <Heart size={18} className={likedProfiles.has(result.profile.id) ? 'fill-white' : 'fill-gold-500 text-gold-500'} /> 
                               {likedProfiles.has(result.profile.id) ? 'Saved' : 'Send a Like'}
                            </button>
                            <button 
                              onClick={(e) => openChat(e, result)}
                              className="flex-1 py-4 bg-slate-50 border border-slate-200 text-navy-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-95"
                            >
                               <MessageCircle size={18} /> Chat
                            </button>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Score Modal */}
      {quickScoreProfile && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 bg-navy-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 text-center relative">
            <button onClick={() => setQuickScoreProfile(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-navy-900">
              <X size={20} />
            </button>
            <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-gold-600 fill-gold-600" />
            </div>
            <h3 className="text-2xl font-serif font-black text-navy-900 mb-2">Covenant Insight</h3>
            <p className="text-slate-500 text-sm mb-6">Match Score for <span className="font-bold text-navy-900">{quickScoreProfile.profile.name}</span></p>
            
            <div className="text-6xl font-black text-navy-900 mb-8 tabular-nums">{quickScoreProfile.score}%</div>
            
            <div className="space-y-3 mb-8">
              {quickScoreProfile.reasons.map((reason, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-left border border-slate-100">
                  <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-700">{reason}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => { setViewingProfile(quickScoreProfile); setQuickScoreProfile(null); }}
              className="w-full py-4 bg-navy-900 text-white font-bold rounded-2xl hover:bg-navy-800 transition-all"
            >
              See Compatibility Breakdown
            </button>
          </div>
        </div>
      )}

      {/* Profile Detail Modal */}
      {viewingProfile && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-navy-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            <div className="md:w-1/2 h-64 md:h-auto relative">
               <img src={viewingProfile.profile.image} className="w-full h-full object-cover" />
               <button onClick={() => setViewingProfile(null)} className="absolute top-6 left-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors">
                  <X size={24} />
               </button>
            </div>
            <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-4xl font-serif font-black text-navy-900">{viewingProfile.profile.name}, {viewingProfile.profile.age}</h2>
                    <div className="flex items-center gap-2 text-gold-600 font-bold text-sm mt-2">
                      <MapPin size={16} /> {viewingProfile.profile.location}
                    </div>
                  </div>
                  <div className="bg-gold-100 px-4 py-2 rounded-2xl text-center">
                    <p className="text-2xl font-black text-navy-900 leading-none">{viewingProfile.score}%</p>
                    <p className="text-[10px] font-bold text-gold-700 uppercase tracking-tighter">Covenant Score</p>
                  </div>
               </div>

               <div className="space-y-8">
                  <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Zap size={14} className="text-gold-500 fill-gold-500" /> Compatibility Breakdown
                    </h4>
                    <ScoreBar label="Theology alignment" score={viewingProfile.breakdown.faithScore} max={35} color="bg-gold-500" />
                    <ScoreBar label="Core family values" score={viewingProfile.breakdown.valuesScore} max={30} color="bg-green-600" />
                    <ScoreBar label="Marriage intention" score={viewingProfile.breakdown.intentionScore} max={25} color="bg-navy-900" />
                    <ScoreBar label="Lifestyle sync" score={viewingProfile.breakdown.lifestyleScore} max={10} color="bg-blue-500" />
                  </section>

                  <section>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Values & Faith</h4>
                    <div className="flex flex-wrap gap-2">
                       <span className="px-4 py-2 bg-navy-900 text-white rounded-full text-xs font-bold">{viewingProfile.profile.denomination}</span>
                       <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{viewingProfile.profile.faithLevel}</span>
                       {viewingProfile.profile.values.map(v => (
                         <span key={v} className="px-4 py-2 border border-gold-200 text-gold-700 rounded-full text-xs font-bold">{v}</span>
                       ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">The Purity Story</h4>
                    <p className="text-slate-600 text-lg leading-relaxed italic">"{viewingProfile.bio || viewingProfile.profile.bio}"</p>
                  </section>

                  <div className="pt-8 border-t border-slate-100 flex gap-4">
                     <button 
                       onClick={(e) => { handleLike(e, viewingProfile.profile.id); setViewingProfile(null); }}
                       className="flex-1 py-5 bg-navy-900 text-white rounded-3xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-navy-800 transition-all"
                     >
                        <Heart size={20} className="fill-gold-500 text-gold-500" /> Express Interest
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal Overlay */}
      {activeChat && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 bg-navy-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[80vh]">
            <div className="p-6 bg-navy-900 flex items-center justify-between text-white">
               <div className="flex items-center gap-4">
                  <img src={activeChat.profile.image} className="w-12 h-12 rounded-full object-cover border-2 border-gold-500" />
                  <div>
                    <h3 className="font-serif font-bold text-xl leading-none">{activeChat.profile.name}</h3>
                    <p className="text-[10px] text-gold-500 font-bold uppercase tracking-widest mt-1">Direct Messenger</p>
                  </div>
               </div>
               <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-50">
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${i % 2 === 0 ? 'bg-white text-slate-700 shadow-sm border border-slate-100' : 'bg-navy-900 text-white shadow-lg'}`}>
                       {msg}
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
               <input 
                 type="text" 
                 value={inputMsg}
                 onChange={e => setInputMsg(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && sendMessage()}
                 placeholder="Type a message of intentionality..."
                 className="flex-1 px-5 py-3.5 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:ring-2 focus:ring-navy-900 outline-none transition-all"
               />
               <button 
                 onClick={sendMessage}
                 className="p-4 bg-gold-500 text-navy-900 rounded-2xl shadow-lg hover:bg-gold-400 transition-all active:scale-90"
               >
                 <Send size={20} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchmakerDemo;
