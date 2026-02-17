import React, { useState } from 'react';
import { Mail, Lock, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '../lib/firebase';

export default function LoginPage({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      onNavigate('matchmaker');
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' ? 'Invalid email or password.'
        : err.code === 'auth/user-not-found' ? 'No account found with this email.'
        : err.code === 'auth/too-many-requests' ? 'Too many attempts. Please try again later.'
        : 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Enter your email first, then click Forgot.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setError('');
      alert('Password reset email sent! Check your inbox.');
    } catch {
      setError('Could not send reset email. Check your email address.');
    }
  };

  return (
    <div data-testid="login-page" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-24 pt-32">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-900 shadow-xl mb-6">
            <span className="text-2xl font-serif text-gold-500 font-bold">V</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-navy-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500">Sign in to continue your courtship journey.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-10">
          {error && (
            <div data-testid="login-error" className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input data-testid="login-email" type="email" required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all"
                  placeholder="you@example.com" value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <button type="button" data-testid="forgot-password-btn" onClick={handleForgotPassword} className="text-xs font-bold text-gold-600 hover:text-gold-700">Forgot?</button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input data-testid="login-password" type={showPassword ? 'text' : 'password'} required
                  className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all"
                  placeholder="Your password" value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-navy-900 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button data-testid="login-submit-btn" type="submit" disabled={loading}
              className="w-full flex items-center justify-center py-4 bg-navy-900 text-white font-bold rounded-2xl shadow-lg hover:bg-navy-800 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <button data-testid="goto-signup" onClick={() => onNavigate('signup')} className="font-bold text-navy-900 hover:underline">
                Join the community
              </button>
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> Secure Login</span>
          <span className="w-1 h-1 bg-slate-200 rounded-full" />
          <span>100% Private</span>
        </div>
      </div>
    </div>
  );
}
