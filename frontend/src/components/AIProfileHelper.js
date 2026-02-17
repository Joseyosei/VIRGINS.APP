import React, { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check, HeartHandshake } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

export default function AIProfileHelper() {
  const [formData, setFormData] = useState({ name: '', age: '', faith: '', hobbies: '', values: '', lookingFor: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API}/api/ai/generate-bio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.bio) { navigator.clipboard.writeText(result.bio); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div id="bio-helper" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-gold-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center justify-center p-2 bg-primary-100 rounded-full mb-4 ring-4 ring-primary-50"><Sparkles className="w-6 h-6 text-primary-600" /></span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-serif sm:text-4xl">AI Courtship Assistant</h2>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">Let our assistant help you express your heart for marriage and tradition.</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-10 bg-white border-b lg:border-b-0 lg:border-r border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 font-serif flex items-center gap-2"><HeartHandshake className="w-5 h-5 text-primary-500" /> Tell us about yourself</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">First Name</label><input data-testid="ai-name" type="text" name="name" required className="block w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-primary-500 transition-colors" placeholder="e.g. Sarah" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Age</label><input data-testid="ai-age" type="number" name="age" required className="block w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-primary-500 transition-colors" placeholder="e.g. 24" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Faith / Tradition</label><input type="text" className="block w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Catholic, Reformed Baptist" value={formData.faith} onChange={e => setFormData({ ...formData, faith: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Interests</label><input type="text" required className="block w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Classical Music, Hiking" value={formData.hobbies} onChange={e => setFormData({ ...formData, hobbies: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Core Values</label><textarea rows={2} required className="block w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Saving intimacy for marriage" value={formData.values} onChange={e => setFormData({ ...formData, values: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Looking For</label><textarea rows={2} required className="block w-full rounded-lg border-slate-300 shadow-sm p-2.5 border bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. A spiritual leader" value={formData.lookingFor} onChange={e => setFormData({ ...formData, lookingFor: e.target.value })} /></div>
                <button data-testid="generate-bio-btn" type="submit" disabled={loading} className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-70 mt-2">
                  {loading ? (<><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Crafting Profile...</>) : 'Generate Professional Bio'}
                </button>
              </form>
            </div>
            <div className="p-8 md:p-10 bg-slate-50 flex flex-col justify-center min-h-[500px]">
              {result ? (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <div className="flex items-center justify-between mb-2"><h3 className="text-lg font-bold text-slate-900 font-serif">Your Narrative</h3><span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">Optimized for Marriage</span></div>
                    <div className="bg-white rounded-xl p-6 relative group shadow-sm border border-slate-200">
                      <p data-testid="generated-bio" className="text-slate-700 leading-relaxed font-sans text-lg">"{result.bio}"</p>
                      <button onClick={copyToClipboard} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50 text-slate-500 hover:text-primary-600" title="Copy">
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {result.advice && (
                    <div><h3 className="text-lg font-bold text-slate-900 font-serif mb-2">Coach's Advice</h3><div className="bg-amber-50 rounded-xl p-5 border border-amber-100 flex gap-3 items-start"><Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" /><p className="text-amber-900 text-sm font-medium leading-relaxed">{result.advice}</p></div></div>
                  )}
                  <div className="text-center pt-4"><button onClick={() => setResult(null)} className="text-sm text-slate-500 hover:text-primary-600 underline">Try again</button></div>
                </div>
              ) : (
                <div className="text-center h-full flex flex-col items-center justify-center text-slate-400">
                  {error ? (<div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg border border-red-100">{error}</div>) : (
                    <>
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-slate-100"><Sparkles className="w-10 h-10 text-primary-200" /></div>
                      <h4 className="text-slate-900 font-serif text-xl font-medium mb-2">Ready to be seen?</h4>
                      <p className="max-w-xs mx-auto text-sm leading-relaxed">Fill out the details, and our AI will write a respectful, engaging bio.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
