import React, { useState, useEffect } from 'react';
import { Crown, Check, Sparkles, Loader2, AlertCircle, X, Star, Shield, Heart, Trash2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API = process.env.REACT_APP_BACKEND_URL;

export default function MembershipPage({ onNavigate }) {
  const { user, profile, refreshProfile } = useAuth();
  const [packages, setPackages] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Check URL for payment status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const status = urlParams.get('status');

    if (sessionId && status === 'success') {
      pollPaymentStatus(sessionId);
    } else if (status === 'cancelled') {
      setPaymentStatus({ type: 'cancelled', message: 'Payment was cancelled' });
    }
  }, []);

  // Fetch packages
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API}/api/payments/packages`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages);
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 10;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setPaymentStatus({ type: 'error', message: 'Payment verification timed out. Please contact support.' });
      return;
    }

    setProcessingPayment(true);

    try {
      const response = await fetch(`${API}/api/payments/status/${sessionId}`);
      if (!response.ok) throw new Error('Failed to check payment status');

      const data = await response.json();

      if (data.paymentStatus === 'paid') {
        setPaymentStatus({ type: 'success', message: 'Payment successful! Your premium membership is now active.' });
        setProcessingPayment(false);
        await refreshProfile();
        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      } else if (data.status === 'expired') {
        setPaymentStatus({ type: 'error', message: 'Payment session expired. Please try again.' });
        setProcessingPayment(false);
        return;
      }

      // Continue polling
      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
    } catch (err) {
      console.error('Error checking payment status:', err);
      setPaymentStatus({ type: 'error', message: 'Error verifying payment. Please contact support.' });
      setProcessingPayment(false);
    }
  };

  const handleSelectPlan = async (packageId) => {
    if (!user) {
      onNavigate('signup');
      return;
    }

    setError(null);
    setProcessingPayment(true);

    try {
      const originUrl = window.location.origin;
      
      const response = await fetch(`${API}/api/payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-firebase-uid': user.uid,
        },
        body: JSON.stringify({
          packageId,
          originUrl,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to create checkout session');
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
      setProcessingPayment(false);
    }
  };

  const handleCancelMembership = async () => {
    if (!user) return;
    setActionLoading(true);

    try {
      const response = await fetch(`${API}/api/account/cancel-membership`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-firebase-uid': user.uid,
        },
      });

      if (!response.ok) throw new Error('Failed to cancel membership');

      await refreshProfile();
      setShowCancelModal(false);
      setPaymentStatus({ type: 'info', message: 'Your premium membership has been cancelled.' });
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setActionLoading(true);

    try {
      const response = await fetch(`${API}/api/account/delete`, {
        method: 'DELETE',
        headers: {
          'x-firebase-uid': user.uid,
        },
      });

      if (!response.ok) throw new Error('Failed to delete account');

      // Log user out and redirect to home
      onNavigate('home');
      window.location.reload();
    } catch (err) {
      setError(err.message);
      setActionLoading(false);
    }
  };

  const isPremium = profile?.isPremium;

  const planFeatures = {
    free: [
      '5 daily matches',
      'Basic filters',
      'See who likes you',
      'AI profile helper',
    ],
    premium: [
      'Unlimited matches',
      'Advanced filters',
      'Priority placement',
      'Read receipts',
      'Profile boost',
      'Incognito mode',
      'Date planner access',
      'Verified badge',
    ],
  };

  return (
    <div data-testid="membership-page" className="min-h-screen bg-slate-50 pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 text-gold-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <Crown size={14} /> Membership
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-navy-900 mb-4">
            Covenant <span className="italic text-gold-600">Premium</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Unlock the full potential of intentional dating.
          </p>
        </div>

        {/* Status Messages */}
        {paymentStatus && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
            paymentStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
            paymentStatus.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
            paymentStatus.type === 'cancelled' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {paymentStatus.type === 'success' && <Check size={20} />}
            {paymentStatus.type === 'error' && <AlertCircle size={20} />}
            {paymentStatus.type === 'cancelled' && <X size={20} />}
            <span className="font-medium">{paymentStatus.message}</span>
            <button onClick={() => setPaymentStatus(null)} className="ml-auto">
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Current Status */}
        {user && isPremium && (
          <div className="mb-8 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl p-6 text-navy-900 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Crown size={28} className="text-navy-900" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Premium Member</h3>
                <p className="text-sm text-navy-800/80">
                  {profile.premiumPackage ? `${packages[profile.premiumPackage]?.name || profile.premiumPackage}` : 'Active Subscription'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 bg-white/20 rounded-xl text-sm font-bold hover:bg-white/30 transition-colors"
            >
              Cancel Membership
            </button>
          </div>
        )}

        {/* Pricing Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Free Plan */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-serif font-bold text-navy-900 mb-1">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-navy-900">$0</span>
                <span className="text-slate-400 text-sm">/forever</span>
              </div>
              <ul className="space-y-3 mb-6">
                {planFeatures.free.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-bold cursor-not-allowed"
              >
                {user ? 'Current Plan' : 'Sign Up Free'}
              </button>
            </div>

            {/* Premium Plans */}
            {Object.entries(packages).map(([id, pkg], idx) => (
              <div
                key={id}
                className={`relative bg-white rounded-[2rem] shadow-lg border-2 p-6 ${
                  id === 'annual' ? 'border-gold-500 shadow-gold-100' : 'border-slate-200'
                }`}
              >
                {id === 'annual' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-navy-900 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                    Best Value
                  </div>
                )}
                <h3 className="text-xl font-serif font-bold text-navy-900 mb-1">{pkg.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-black text-navy-900">${pkg.amount}</span>
                  <span className="text-slate-400 text-sm">
                    {id === 'monthly' ? '/month' : id === 'annual' ? '/year' : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6">{pkg.description}</p>
                <ul className="space-y-3 mb-6">
                  {planFeatures.premium.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
                      <Check size={16} className="text-gold-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(id)}
                  disabled={processingPayment || (isPremium && profile?.premiumPackage === id)}
                  className={`w-full py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    id === 'annual'
                      ? 'bg-navy-900 text-white hover:bg-navy-800 shadow-lg'
                      : 'bg-gold-500 text-navy-900 hover:bg-gold-400'
                  }`}
                >
                  {processingPayment ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : isPremium && profile?.premiumPackage === id ? (
                    'Current Plan'
                  ) : isPremium ? (
                    'Switch Plan'
                  ) : (
                    'Get Premium'
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Premium Features */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-xl font-serif font-bold text-navy-900 mb-6 text-center">Why Go Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Heart className="w-6 h-6" />, title: 'Unlimited Matches', desc: 'No daily limits. Connect with as many aligned singles as you want.' },
              { icon: <Star className="w-6 h-6" />, title: 'Priority Visibility', desc: 'Your profile appears at the top of search results and feeds.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Incognito Mode', desc: 'Browse profiles privately without others knowing you viewed them.' },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-14 h-14 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gold-600">
                  {f.icon}
                </div>
                <h3 className="font-bold text-navy-900 mb-1">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Account Management */}
        {user && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Management</h3>
            </div>
            <div className="divide-y divide-slate-100">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="text-left">
                    <span className="text-slate-700 font-medium text-sm block">Delete Account</span>
                    <span className="text-xs text-slate-400">Permanently remove your account and data</span>
                  </div>
                </div>
                <XCircle className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        )}

        {/* Cancel Membership Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-navy-900 mb-2">Cancel Membership?</h3>
              <p className="text-slate-500 mb-6">
                Your premium features will remain active until the end of your current billing period. After that, you'll lose access to premium features.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Keep Membership
                </button>
                <button
                  onClick={handleCancelMembership}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2 text-center">Delete Account?</h3>
              <p className="text-slate-500 mb-6 text-center">
                This action cannot be undone. All your data, matches, likes, and messages will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
