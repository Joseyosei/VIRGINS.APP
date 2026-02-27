import React, { useState, useEffect } from 'react';
import {
  Crown, Star, Gem, ArrowRight, Lock, Shield, Edit, MapPin,
  Eye, Heart, Users, LogOut, TrendingUp, Sparkles, Upload, X,
  Loader2, Trash2, Download, Share2, Copy, ShieldCheck, Calendar
} from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';
import { PageView } from '../types';
import { useAuth } from '../hooks/useAuth';

interface UserProfileProps {
  onNavigate: (page: PageView) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile]           = useState<any>(null);
  const [analytics, setAnalytics]       = useState<any>(null);
  const [referral, setReferral]         = useState<any>(null);
  const [subscription, setSubscription] = useState<'free' | 'plus' | 'ultimate'>('free');
  const [incognito, setIncognito]       = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profileImages, setProfileImages]   = useState<string[]>([]);

  // GDPR delete modal
  const [showDeleteModal, setShowDeleteModal]     = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting]                   = useState(false);

  useEffect(() => {
    loadProfile();
    loadReferral();
  }, [user]);

  const loadProfile = async () => {
    try {
      const data = await (api as any).getMyProfile() as any;
      const u = data?.user || data;
      setProfile(u);
      if (u?.images?.length) setProfileImages(u.images);
      if (u?.subscriptionTier) setSubscription(u.subscriptionTier as any);
      if (u?.isPremium) setSubscription('plus');

      if (u?.isPremium) {
        try {
          const stats = await api.getAnalytics() as any;
          setAnalytics(stats);
        } catch { /* free users */ }
      }
    } catch (err: any) {
      console.warn('[UserProfile] Failed to load from backend:', err.message);
    }
    try {
      const s = await (api as any).getSubscriptionStatus() as any;
      if (s?.tier) setSubscription(s.tier);
    } catch { /* best-effort */ }
  };

  const loadReferral = async () => {
    try {
      const r = await (api as any).getReferral();
      setReferral(r);
    } catch { /* best-effort */ }
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const result = await (api as any).uploadProfilePhoto(file) as any;
      setProfileImages(result.images || []);
      toast.success('Photo uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    try {
      const result = await (api as any).deleteProfilePhoto(photoUrl) as any;
      setProfileImages(result.images || []);
      toast.success('Photo removed');
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      await (api as any).deleteMyAccount();
      toast.success('Account deleted. God bless your journey.');
      await logout();
      onNavigate('home');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await (api as any).exportMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'virgins-data-export.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data export downloaded');
    } catch (err: any) {
      toast.error(err.message || 'Export failed');
    }
  };

  const handleShareReferral = async () => {
    const code = referral?.referralCode;
    if (!code) return;
    const text = `Join me on VIRGINS — faith-based dating built on covenant values. Use my referral code ${code} and we both get a free week of Plus! https://virgins.app/join?ref=${code}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Join VIRGINS', text }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Invite link copied!');
    }
  };

  const handleCopyCode = async () => {
    if (!referral?.referralCode) return;
    await navigator.clipboard.writeText(referral.referralCode);
    toast.success('Referral code copied!');
  };

  const isPremium   = subscription !== 'free' || profile?.isPremium;
  const displayName = profile?.name || user?.email?.split('@')[0] || 'Member';

  const getBadge = () => {
    if (subscription === 'ultimate' || profile?.isPremium) return <Crown className="w-5 h-5 text-virgins-gold fill-virgins-gold" />;
    if (subscription === 'plus') return <Star className="w-5 h-5 text-virgins-gold fill-virgins-gold" />;
    return <Gem className="w-5 h-5 text-slate-400" />;
  };

  const getPlanName = () => {
    if (subscription === 'ultimate' || profile?.isPremium) return 'Ultimate Member';
    if (subscription === 'plus') return 'Plus Member';
    return 'Free Member';
  };

  return (
    <div className="min-h-screen bg-virgins-cream pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Profile Header ─────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-virgins-dark via-virgins-purple to-virgins-purple/80 rounded-3xl shadow-xl overflow-hidden mb-6 relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent" />
          <div className="relative z-10 p-8 flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={profileImages[0] || profile?.profileImage || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-virgins-gold shadow-2xl object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-virgins-gold p-2 rounded-full text-virgins-dark hover:bg-virgins-gold/90 transition-colors shadow-lg cursor-pointer">
                {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white font-serif">
                {displayName}{profile?.age ? `, ${profile.age}` : ''}
              </h1>
              {getBadge()}
            </div>
            <p className="text-slate-300 text-sm flex items-center gap-1 mb-6">
              <span className="font-medium text-virgins-gold">{getPlanName()}</span>
              {profile?.city && (<><span className="text-slate-600 mx-1">•</span><MapPin className="w-3 h-3 text-slate-400" />{profile.city}</>)}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 w-full max-w-sm border-t border-virgins-purple/30 pt-6">
              {[
                { icon: <Users className="w-5 h-5 text-virgins-gold" />, value: analytics?.totalMatches ?? (profile?.matches?.length ?? 0), label: 'Matches' },
                { icon: <Heart className="w-5 h-5 text-red-400" />,   value: analytics?.totalLikes ?? (profile?.likedBy?.length ?? 0), label: 'Likes' },
                { icon: <Eye className="w-5 h-5 text-blue-300" />,   value: analytics?.weeklyViews ?? '—', label: 'Views' },
              ].map(({ icon, value, label }) => (
                <div key={label} className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 mx-auto bg-virgins-purple/20 rounded-full mb-2">{icon}</div>
                  <div className="text-xl font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>

            {(profile?.reputationScore || analytics?.reputationScore || 0) > 0 && (
              <div className="mt-4 flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/30">
                <Star size={12} fill="currentColor" />
                {profile?.reputationScore || analytics?.reputationScore} "We Met" confirmed
              </div>
            )}
          </div>
        </div>

        {/* ── Upgrade Banner ─────────────────────────────────────────── */}
        {!isPremium && (
          <button
            onClick={() => onNavigate('pricing')}
            className="w-full bg-gradient-to-r from-virgins-gold to-virgins-gold/80 rounded-2xl p-4 mb-6 shadow-lg flex items-center justify-between hover:from-virgins-gold/90 hover:to-virgins-gold/70 transition-all group"
          >
            <div className="text-left">
              <h3 className="text-virgins-dark font-bold text-lg">Upgrade to Premium</h3>
              <p className="text-virgins-dark/80 text-sm opacity-90">See who liked you, analytics, boosts & more</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
              <Crown className="w-6 h-6 text-virgins-dark" fill="hsl(270 100% 10%)" />
            </div>
          </button>
        )}

        {/* ── Premium Analytics ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 relative">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={14} className="text-virgins-purple" /> Profile Insights
            </h3>
            <span className="text-[10px] font-black text-virgins-purple bg-virgins-gold/20 px-2 py-0.5 rounded-full">Last 7 Days</span>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6 relative">
            {!isPremium && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[6px] z-20 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg border border-gold-100">
                  <Sparkles className="w-6 h-6 text-virgins-gold" />
                </div>
                <h4 className="font-serif font-black text-virgins-purple text-lg mb-1">See who's noticing you</h4>
                <p className="text-xs text-slate-500 mb-4 max-w-[200px]">Unlock detailed analytics and see exactly who liked your profile.</p>
                <button onClick={() => onNavigate('pricing')} className="px-6 py-2.5 bg-virgins-purple text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl hover:bg-virgins-purple/90 transition-all active:scale-95">
                  Explore Premium
                </button>
              </div>
            )}
            {[
              { label: 'Views this week',        value: analytics?.weeklyViews        ?? '—' },
              { label: 'Likes received',          value: analytics?.totalLikes         ?? '—' },
              { label: 'Dates arranged',          value: analytics?.totalDatesRequested ?? '—' },
              { label: '"We Met" confirmed',      value: analytics?.totalWeMet         ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
                <span className="text-4xl font-black text-virgins-purple tabular-nums">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Referral Card ──────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-virgins-purple/5 to-virgins-gold/10 rounded-2xl border border-virgins-gold/20 p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="text-virgins-purple" size={18} />
            <h3 className="font-bold text-virgins-purple">Invite Friends — Earn Free Premium</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Each friend who completes onboarding earns you <strong>7 free days of Plus</strong>.
          </p>
          {referral ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-virgins-gold/30 rounded-xl px-4 py-2.5 font-mono font-black text-virgins-purple text-lg tracking-widest text-center">
                  {referral.referralCode}
                </div>
                <button onClick={handleCopyCode} className="p-2.5 bg-white border border-virgins-gold/30 rounded-xl text-virgins-purple hover:bg-virgins-purple/5 transition-colors" title="Copy code">
                  <Copy size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  <strong className="text-virgins-purple">{referral.referralCount || 0}</strong> friend{referral.referralCount !== 1 ? 's' : ''} referred
                </span>
                <button onClick={handleShareReferral} className="flex items-center gap-1.5 text-virgins-purple font-bold hover:underline text-xs">
                  <Share2 size={13} /> Share Invite
                </button>
              </div>
            </div>
          ) : (
            <div className="h-12 bg-white/60 rounded-xl animate-pulse" />
          )}
        </div>

        {/* ── Photo Management ───────────────────────────────────────── */}
        {profileImages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Upload size={14} className="text-virgins-purple" /> Profile Photos
              </h3>
              <label className="text-xs font-bold text-virgins-purple cursor-pointer hover:underline flex items-center gap-1">
                <Upload size={12} /> Add Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {profileImages.map((url, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover rounded-xl border border-slate-100" />
                  <button onClick={() => handleDeletePhoto(url)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <X size={10} />
                  </button>
                  {idx === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-black bg-virgins-gold text-virgins-dark px-1.5 py-0.5 rounded-full uppercase">Main</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Account Settings ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Settings</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { icon: <Edit className="w-4 h-4 text-slate-600" />, label: 'Edit Profile Story', action: () => {} },
              { icon: <Crown className="w-4 h-4 text-slate-600" />, label: 'Covenant Subscription', action: () => onNavigate('pricing') },
              { icon: <ShieldCheck className="w-4 h-4 text-slate-600" />, label: 'Trust Verification', action: () => onNavigate('verification') },
              { icon: <Shield className="w-4 h-4 text-slate-600" />, label: 'Security & Support', action: () => {} },
            ].map(({ icon, label, action }) => (
              <button key={label} onClick={action} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
                  <span className="text-slate-700 font-medium text-sm">{label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
            <div className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg"><Lock className="w-4 h-4 text-slate-600" /></div>
                <div className="text-left">
                  <span className="text-slate-700 font-medium text-sm block">Incognito Mode</span>
                  {!isPremium && <span className="text-[10px] text-virgins-gold font-black uppercase tracking-tighter">Premium Only</span>}
                </div>
              </div>
              <button
                onClick={() => isPremium ? setIncognito(!incognito) : onNavigate('pricing')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${incognito && isPremium ? 'bg-virgins-gold' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${incognito && isPremium ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Privacy & GDPR ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Privacy & Your Data</h3>
          </div>
          <div className="divide-y divide-slate-100">
            <button onClick={handleExportData} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg"><Download className="w-4 h-4 text-blue-600" /></div>
                <div className="text-left">
                  <span className="text-slate-700 font-medium text-sm block">Export My Data</span>
                  <span className="text-[11px] text-slate-400">GDPR Article 20 — data portability</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></div>
                <div className="text-left">
                  <span className="text-red-600 font-medium text-sm block">Delete My Account</span>
                  <span className="text-[11px] text-slate-400">Permanently remove all personal data (GDPR Art. 17)</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-red-300" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-2 mb-12 flex flex-col items-center">
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600 transition-colors px-6 py-2 rounded-xl hover:bg-red-50 text-sm">
            <LogOut className="w-4 h-4" /> End Session
          </button>
          <p className="text-xs text-slate-400 mt-4 font-medium tracking-tight">Covenant Cloud • Build 3.0.0</p>
        </div>
      </div>

      {/* ── GDPR Delete Modal ─────────────────────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="text-red-500" size={20} />
              <h3 className="font-black text-gray-900">Delete Account</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This permanently deletes your profile, photos, matches, and all personal data.
              This action <strong>cannot be undone</strong>.
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Type <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono font-bold">DELETE</code> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full border border-red-200 rounded-xl px-3 py-2 text-sm mb-4 focus:ring-2 focus:ring-red-300 outline-none font-mono"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleting}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
