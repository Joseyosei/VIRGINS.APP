import React, { useState } from 'react';
import { BrainCircuit, Filter, RefreshCw, Heart, Check, ChevronDown } from 'lucide-react';
import { MatchPreferences, MatchResult } from '../types';
import { calculateMatches } from '../services/matchingService';

const MatchmakerDemo: React.FC = () => {
  const [prefs, setPrefs] = useState<MatchPreferences>({
    gender: 'Female',
    minAge: 18,
    maxAge: 35,
    faithImportance: 10,
    valueImportance: 8,
    locationImportance: 5,
    targetDenominations: ['Baptist', 'Catholic', 'Non-Denominational'],
    requiredValues: ['Purity', 'Family', 'Tradition']
  });

  const [results, setResults] = useState<MatchResult[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const runAlgorithm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const matches = calculateMatches(prefs);
      setResults(matches);
      setHasRun(true);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 shadow-xl mb-6">
            <BrainCircuit className="w-8 h-8 text-gold-500" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">The Covenant Algorithm™</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See how our proprietary engine weights Faith, Values, and Intentionality to predict marital success.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary-600" /> Match Preferences
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Looking for</label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setPrefs({...prefs, gender: 'Female'})}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${prefs.gender === 'Female' ? 'bg-white shadow text-primary-700' : 'text-slate-500'}`}
                    >
                      Women
                    </button>
                    <button 
                      onClick={() => setPrefs({...prefs, gender: 'Male'})}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${prefs.gender === 'Male' ? 'bg-white shadow text-primary-700' : 'text-slate-500'}`}
                    >
                      Men
                    </button>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Importance Weights (1-10)</label>
                   <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                           <span>Faith Match</span>
                           <span className="font-bold">{prefs.faithImportance}</span>
                        </div>
                        <input 
                          type="range" min="1" max="10" 
                          value={prefs.faithImportance}
                          onChange={(e) => setPrefs({...prefs, faithImportance: parseInt(e.target.value)})}
                          className="w-full accent-primary-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                           <span>Values Match</span>
                           <span className="font-bold">{prefs.valueImportance}</span>
                        </div>
                        <input 
                          type="range" min="1" max="10" 
                          value={prefs.valueImportance}
                          onChange={(e) => setPrefs({...prefs, valueImportance: parseInt(e.target.value)})}
                          className="w-full accent-gold-500"
                        />
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={runAlgorithm}
                    disabled={isProcessing}
                    className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold shadow-lg hover:bg-navy-800 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Run Simulation'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl">
              <p className="text-sm text-blue-800 font-medium">
                "Our algorithm penalizes casual dating signals and boosts profiles that demonstrate high intentionality for marriage."
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-8">
            {!hasRun ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400">
                 <BrainCircuit className="w-16 h-16 mb-4 text-slate-200" />
                 <p>Adjust preferences and run the algorithm to see matches.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {results.length === 0 ? (
                   <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                      <p className="text-slate-500">No matches found with these strict criteria. Try widening your search.</p>
                   </div>
                ) : (
                  results.map((result, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 animate-fadeIn" style={{animationDelay: `${idx * 150}ms`}}>
                      {/* Image */}
                      <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                         <img src={result.profile.image} alt={result.profile.name} className="w-full h-full object-cover rounded-xl" />
                         <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-navy-900 shadow-sm">
                            {result.profile.age} • {result.profile.location}
                         </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-2">
                            <div>
                               <h3 className="text-xl font-bold text-slate-900 font-serif">{result.profile.name}</h3>
                               <p className="text-sm text-slate-500">{result.profile.denomination} • {result.profile.faithLevel}</p>
                            </div>
                            <div className="text-right">
                               <div className="text-3xl font-bold text-primary-600">{result.score}%</div>
                               <div className="text-xs font-bold text-primary-400 uppercase tracking-wide">Match Score</div>
                            </div>
                         </div>

                         {/* Breakdown Bars */}
                         <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs">
                               <span className="w-20 text-slate-500">Faith</span>
                               <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary-500" style={{width: `${(result.breakdown.faithScore / 35) * 100}%`}}></div>
                               </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                               <span className="w-20 text-slate-500">Values</span>
                               <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-gold-500" style={{width: `${(result.breakdown.valuesScore / 30) * 100}%`}}></div>
                               </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                               <span className="w-20 text-slate-500">Intention</span>
                               <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500" style={{width: `${(result.breakdown.intentionScore / 25) * 100}%`}}></div>
                               </div>
                            </div>
                         </div>

                         {/* Reasons */}
                         <div className="flex flex-wrap gap-2">
                            {result.reasons.map((reason, rIdx) => (
                               <span key={rIdx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                  <Check className="w-3 h-3 mr-1 text-green-600" /> {reason}
                               </span>
                            ))}
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

export default MatchmakerDemo;