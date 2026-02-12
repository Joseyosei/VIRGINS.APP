
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Filter, RefreshCw, Heart, Check, ChevronDown, Sparkles, MessageCircle, ShieldCheck, X, Send } from 'lucide-react';
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
  const [hasRun, setHasRun] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeChat, setActiveChat] = useState<MatchResult | null>(null);
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
      setHasRun(true);
      setIsProcessing(false);
    }, 800);
  };

  const handleLike = (id: string) => {
    setLikedProfiles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openChat = (profile: MatchResult) => {
    setActiveChat(profile);
    setMessages(["Hi! I really appreciated your profile and shared values.", "I'd love to learn more about your faith journey."]);
  };

  const sendMessage = () => {
    if (!inputMsg.trim()) return;
    setMessages(prev => [...prev, inputMsg]);
    setInputMsg("");
    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, "Thank you for reaching out! I value intentionality. How has your week been?"]);
    }, 1000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Powered by Covenant AI
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-navy-900 mb-4 tracking-tight">Your Daily <span className="italic text-gold-600">Discoveries</span></h1>
            <p className="text-lg text-slate-500 font-light">
              Hand-picked matches that align with your faith, values, and vision for the future.
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
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-navy-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gold-500" /> Preferences
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Custom Filter</span>
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

                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Alignment Priorities</label>
                   <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                           <span className="text-slate-600 font-medium">Theological Match</span>
                           <span className="font-bold text-navy-900">{prefs.faithImportance}/10</span>
                        </div>
                        <input 
                          type="range" min="1" max="10" 
                          value={prefs.faithImportance}
                          onChange={(e) => setPrefs({...prefs, faithImportance: parseInt(e.target.value)})}
                          className="w-full accent-navy-900 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                           <span className="text-slate-600 font-medium">Family Values</span>
                           <span className="font-bold text-navy-900">{prefs.valueImportance}/10</span>
                        </div>
                        <input 
                          type="range" min="1" max="10" 
                          value={prefs.valueImportance}
                          onChange={(e) => setPrefs({...prefs, valueImportance: parseInt(e.target.value)})}
                          className="w-full accent-gold-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={runAlgorithm}
                    disabled={isProcessing}
                    className="w-full py-4 bg-navy-900 text-white rounded-2xl font-bold shadow-xl hover:bg-navy-800 transition-all flex items-center justify-center gap-2 group"
                  >
                    <BrainCircuit className="w-5 h-5 text-gold-500 group-hover:scale-110 transition-transform" />
                    Update Match Results
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {isProcessing ? (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-100">
                 <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-gold-500 rounded-full animate-spin"></div>
                 </div>
                 <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Filtering for Forever...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {results.map((result, idx) => (
                  <div key={result.profile.id} className="bg-white rounded-[2.5rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] border border-white hover:border-gold-200 transition-all group overflow-hidden animate-fadeIn">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-[280px] h-[320px] md:h-auto overflow-hidden">
                         <img src={result.profile.image} alt={result.profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <div className="bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-xl text-xs font-black text-navy-900 shadow-xl flex items-center gap-2 border border-white/50">
                               <ShieldCheck size={14} className="text-green-600" /> Verified
                            </div>
                         </div>
                      </div>

                      <div className="flex-1 p-8 md:p-10 flex flex-col">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                               <h3 className="text-3xl font-serif font-black text-navy-900">{result.profile.name}</h3>
                               <p className="text-sm font-bold text-gold-600 tracking-wide">{result.profile.denomination} • {result.profile.faithLevel}</p>
                            </div>
                            <div className="text-right">
                               <div className="text-4xl font-black text-navy-900 tabular-nums">{result.score}%</div>
                               <div className="text-[10px] font-black text-gold-500 uppercase tracking-widest">Match Score</div>
                            </div>
                         </div>

                         <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                           "{result.profile.bio}"
                         </p>

                         <div className="mt-auto flex items-center gap-3">
                            <button 
                              onClick={() => handleLike(result.profile.id)}
                              className={`flex-[2] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${likedProfiles.has(result.profile.id) ? 'bg-gold-500 text-white' : 'bg-navy-900 text-white'}`}
                            >
                               <Heart size={18} className={likedProfiles.has(result.profile.id) ? 'fill-white' : 'fill-gold-500 text-gold-500'} /> 
                               {likedProfiles.has(result.profile.id) ? 'Interested' : 'Send a Like'}
                            </button>
                            <button 
                              onClick={() => openChat(result)}
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

      {/* Chat Modal Overlay */}
      {activeChat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-navy-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[80vh]">
            <div className="p-6 bg-navy-900 flex items-center justify-between text-white">
               <div className="flex items-center gap-4">
                  <img src={activeChat.profile.image} className="w-12 h-12 rounded-full object-cover border-2 border-gold-500" />
                  <div>
                    <h3 className="font-serif font-bold text-xl">{activeChat.profile.name}</h3>
                    <p className="text-[10px] text-gold-500 font-bold uppercase tracking-widest">Connected via Covenant AI</p>
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
