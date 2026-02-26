import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Loader2, CheckCircle } from 'lucide-react';
import { PageView } from '../types';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';

interface PasswordResetPageProps {
  onNavigate: (page: PageView) => void;
  token?: string;
}

const PasswordResetPage: React.FC<PasswordResetPageProps> = ({ onNavigate, token }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (!token) { toast.error('Invalid reset link — token missing'); return; }

    setLoading(true);
    try {
      await (api as any).resetPassword(token, password);
      setSuccess(true);
      toast.success('Password reset! Redirecting to login...');
      setTimeout(() => onNavigate('login'), 2500);
    } catch (err: any) {
      toast.error(err.message || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-virgins-cream flex flex-col items-center justify-center px-4 py-24 pt-32">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-virgins-purple shadow-xl mb-6">
            <span className="text-2xl font-serif text-virgins-gold font-bold">V</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-virgins-purple mb-2">Reset Password</h1>
          <p className="text-slate-500">Choose a new secure password for your account.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-10">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">Password Updated!</h2>
              <p className="text-slate-500 text-sm">Redirecting you to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    minLength={8}
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-virgins-purple focus:bg-white outline-none transition-all"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-virgins-purple transition-colors">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-virgins-purple focus:bg-white outline-none transition-all"
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-4 bg-virgins-purple text-white font-bold rounded-2xl shadow-lg hover:bg-virgins-purple/90 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set New Password'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <button onClick={() => onNavigate('login')} className="text-sm font-bold text-virgins-purple hover:underline">
              Back to Login
            </button>
          </div>
        </div>

        <div className="mt-12 flex justify-center items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> Secure Reset</span>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <span>1-Hour Expiry</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
