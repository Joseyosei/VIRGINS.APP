import React, { useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { generateProfileBio } from '../services/geminiService';
import { BioRequest, GeminiResponse } from '../types';

const AIProfileHelper: React.FC = () => {
  const [formData, setFormData] = useState<BioRequest>({
    name: '',
    hobbies: '',
    values: '',
    lookingFor: ''
  });
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await generateProfileBio(formData);
      setResult(response);
    } catch (err) {
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.bio) {
      navigator.clipboard.writeText(result.bio);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="bio-helper" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <span className="inline-flex items-center justify-center p-2 bg-primary-100 rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-primary-600" />
           </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-serif sm:text-4xl">
            AI Profile Assistant
          </h2>
          <p className="mt-4 text-xl text-slate-600">
            Not sure how to express your values? Let our AI help you write a respectful, engaging bio that attracts the right person.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 bg-slate-50 border-r border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">First Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3 border"
                    placeholder="e.g. Caleb"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="hobbies" className="block text-sm font-medium text-slate-700">Hobbies & Interests</label>
                  <input
                    type="text"
                    name="hobbies"
                    id="hobbies"
                    required
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3 border"
                    placeholder="e.g. Hiking, Reading Theology, Piano"
                    value={formData.hobbies}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="values" className="block text-sm font-medium text-slate-700">Core Values</label>
                  <textarea
                    name="values"
                    id="values"
                    rows={2}
                    required
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3 border"
                    placeholder="e.g. Faith, Family, Honesty, Waiting for marriage"
                    value={formData.values}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="lookingFor" className="block text-sm font-medium text-slate-700">Looking For</label>
                  <textarea
                    name="lookingFor"
                    id="lookingFor"
                    rows={2}
                    required
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3 border"
                    placeholder="e.g. A serious relationship leading to marriage"
                    value={formData.lookingFor}
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Generating...
                    </>
                  ) : (
                    'Generate My Bio'
                  )}
                </button>
              </form>
            </div>

            <div className="p-8 flex flex-col justify-center min-h-[400px]">
              {result ? (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 font-serif mb-2">Your Bio</h3>
                    <div className="bg-primary-50 rounded-lg p-6 relative group">
                      <p className="text-slate-700 italic leading-relaxed">"{result.bio}"</p>
                      <button 
                        onClick={copyToClipboard}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 font-serif mb-2">Relationship Advice</h3>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                      <p className="text-amber-800 text-sm">{result.advice}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  {error ? (
                    <div className="text-red-500">{error}</div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-slate-300" />
                      </div>
                      <p>Fill out the form to generate a customized, traditional profile bio.</p>
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
};

export default AIProfileHelper;