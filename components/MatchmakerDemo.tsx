import React, { useState, useEffect } from 'react';
import { BrainCircuit, Filter, RefreshCw, Heart, Check, ChevronDown, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';
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

  // Auto-load matches on mount so the user immediately sees the "dating app"
  useEffect(() => {
    runAlgorithm();
  }, []);

  const runAlgorithm = () => {
    setIsProcessing(true);
    // Slight delay to feel like the algorithm is "thinking" but quick enough for UX
    setTimeout(() => {
      const matches = calculateMatches(prefs);
      setResults(matches);
      setHasRun(true);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
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
               {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
               Refresh Feed
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Side Filter Controls */}
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
                    {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5 text-gold-500 group-hover:scale-110 transition-transform" />}
                    Update Match Results
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-navy-900 p-6 rounded-[2rem] border border-navy-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BrainCircuit size={80} className="text-white" />
              </div>
              <p className="text-sm text-slate-300 font-light leading-relaxed relative z-10">
                "Our <span className="text-gold-500 font-bold">Covenant Algorithm™</span> analyzes over 40 behavioral signals to prioritize intentionality over superficial swiping."
              </p>
            </div>
          </div>

          {/* Matches Feed */}
          <div className="lg:col-span-8">
            {isProcessing ? (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-100">
                 <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-gold-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <RingsLogo className="h-6 w-auto" />
                    </div>
                 </div>
                 <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Filtering for Forever...</p>
              </div>
            ) : !hasRun ? (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400">
                 <BrainCircuit className="w-16 h-16 mb-4 text-slate-100" />
                 <p className="font-medium">Initializing Discover Feed...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {results.length === 0 ? (
                   <div className="p-12 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Filter className="text-slate-300" size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-navy-900 mb-2">No Matches Found</h3>
                      <p className="text-slate-500 max-w-sm mx-auto">Try broadening your alignment priorities or denominations to see more profiles.</p>
                   </div>
                ) : (
                  results.map((result, idx) => (
                    <div key={idx} className="bg-white rounded-[2.5rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] border border-white hover:border-gold-200 transition-all group overflow-hidden animate-fadeIn" style={{animationDelay: `${idx * 100}ms`}}>
                      <div className="flex flex-col md:flex-row">
                        {/* Profile Image with Badges */}
                        <div className="relative w-full md:w-[280px] h-[320px] md:h-auto overflow-hidden">
                           <img src={result.profile.image} alt={result.profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                           <div className="absolute top-4 left-4 flex flex-col gap-2">
                              <div className="bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-xl text-xs font-black text-navy-900 shadow-xl flex items-center gap-2 border border-white/50">
                                 <ShieldCheck size={14} className="text-green-600" /> Verified
                              </div>
                              <div className="bg-navy-900/90 backdrop-blur-xl px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xl flex items-center gap-2 border border-white/10">
                                 {result.profile.age} • {result.profile.location.split(',')[0]}
                              </div>
                           </div>
                           <div className="absolute bottom-4 left-4 right-4 h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center">
                              <p className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={12} className="text-gold-400" /> {result.profile.lifestyle}
                              </p>
                           </div>
                        </div>

                        {/* Profile Content */}
                        <div className="flex-1 p-8 md:p-10 flex flex-col">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                 <div className="flex items-center gap-3 mb-1">
                                   <h3 className="text-3xl font-serif font-black text-navy-900">{result.profile.name}</h3>
                                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                 </div>
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

                           {/* Match Stats */}
                           <div className="grid grid-cols-3 gap-4 mb-8">
                              <div className="space-y-1.5">
                                 <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                    <span>Faith</span>
                                    <span>{Math.round((result.breakdown.faithScore / 35) * 100)}%</span>
                                 </div>
                                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-navy-900 transition-all duration-1000" style={{width: `${(result.breakdown.faithScore / 35) * 100}%`}}></div>
                                 </div>
                              </div>
                              <div className="space-y-1.5">
                                 <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                    <span>Values</span>
                                    <span>{Math.round((result.breakdown.valuesScore / 30) * 100)}%</span>
                                 </div>
                                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold-500 transition-all duration-1000" style={{width: `${(result.breakdown.valuesScore / 30) * 100}%`}}></div>
                                 </div>
                              </div>
                              <div className="space-y-1.5">
                                 <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                    <span>Goals</span>
                                    <span>{Math.round((result.breakdown.intentionScore / 25) * 100)}%</span>
                                 </div>
                                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 transition-all duration-1000" style={{width: `${(result.breakdown.intentionScore / 25) * 100}%`}}></div>
                                 </div>
                              </div>
                           </div>

                           {/* Actions */}
                           <div className="mt-auto flex items-center gap-3">
                              <button className="flex-[2] py-4 bg-navy-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-navy-800 transition-all active:scale-95 shadow-xl shadow-navy-900/20">
                                 <Heart size={18} className="fill-gold-500 text-gold-500" /> Send a Like
                              </button>
                              <button className="flex-1 py-4 bg-slate-50 border border-slate-200 text-navy-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-95">
                                 <MessageCircle size={18} /> Chat
                              </button>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Inline Logo Helper
const RingsLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35" cy="45" r="22" stroke="#D4A574" strokeWidth="5" />
    <circle cx="65" cy="45" r="22" stroke="#D4A574" strokeWidth="5" />
    <path d="M50 12 L60 28 L50 44 L40 28 Z" fill="#D4A574" stroke="white" strokeWidth="1" />
  </svg>
);

export default MatchmakerDemo;