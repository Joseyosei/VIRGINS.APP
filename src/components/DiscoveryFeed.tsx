import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart, X, Filter, RefreshCw, ShieldCheck, MapPin, Sparkles,
  MessageCircle, Zap, ChevronDown, ChevronUp, Star, Flag, Ban,
  AlertTriangle
} from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';

interface DiscoveryProfile {
  user: {
    _id: string;
    name: string;
    age: number;
    city: string;
    faith: string;
    denomination?: string;
    bio?: string;
    profileImage?: string;
    images?: string[];
    videoIntroUrl?: string;
    trustLevel: number;
    trustBadges?: string[];
    values?: string[];
    intention?: string;
    lifestyle?: string;
    isOnline?: boolean;
    reputationScore?: number;
  };
  score: number;
  reasons: string[];
  breakdown: {
    faithScore: number;
    valuesScore: number;
    intentionScore: number;
    lifestyleScore: number;
  };
}

interface Preferences {
  gender: string;
  minAge: number;
  maxAge: number;
}

const TRUST_LABELS = ['', 'Pledge', 'ID Verified', 'Reference', 'Background Check'];

const DiscoveryFeed: React.FC<{ onNavigate?: (page: any) => void }> = ({ onNavigate }) => {
  const [profiles, setProfiles]           = useState<DiscoveryProfile[]>([]);
  const [loading, setLoading]             = useState(true);
  const [page, setPage]                   = useState(1);
  const [hasMore, setHasMore]             = useState(true);
  const [likedIds, setLikedIds]           = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId]       = useState<string | null>(null);
  const [showFilters, setShowFilters]     = useState(false);
  const [showReportModal, setShowReportModal] = useState<string | null>(null); // userId
  const [reportType, setReportType]       = useState('');
  const [reportDesc, setReportDesc]       = useState('');
  const [prefs, setPrefs]                 = useState<Preferences>({
    gender: 'Woman', minAge: 18, maxAge: 50
  });

  const loadProfiles = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      const data: any = await api.getDiscovery({ page: currentPage, ...prefs });
      const newProfiles = data.profiles || [];
      setProfiles(prev => reset ? newProfiles : [...prev, ...newProfiles]);
      setHasMore(currentPage < (data.pages || 1));
      if (!reset) setPage(p => p + 1);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  }, [page, prefs]);

  useEffect(() => {
    setPage(1);
    loadProfiles(true);
  }, [prefs]);                    // eslint-disable-line react-hooks/exhaustive-deps

  const handleLike = async (profile: DiscoveryProfile) => {
    const userId = profile.user._id;
    setLikedIds(prev => new Set([...prev, userId]));
    try {
      await api.likeUser(userId);
      toast.success(`You expressed interest in ${profile.user.name}!`);
    } catch (err: any) {
      setLikedIds(prev => { const n = new Set(prev); n.delete(userId); return n; });
      toast.error(err.message || 'Failed to express interest');
    }
  };

  const handleBlock = async (userId: string, name: string) => {
    try {
      await (api as any).blockUser(userId);
      setProfiles(prev => prev.filter(p => p.user._id !== userId));
      toast.success(`${name} has been blocked.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to block user');
    }
  };

  const handleReport = async () => {
    if (!showReportModal || !reportType) return;
    try {
      await (api as any).submitReport({ reportedId: showReportModal, type: reportType, description: reportDesc });
      toast.success('Report submitted. Our team will review within 24 hours.');
      setShowReportModal(null);
      setReportType('');
      setReportDesc('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit report');
    }
  };

  const applyFilters = async () => {
    try {
      await (api as any).updatePreferences(prefs);
    } catch { /* best-effort */ }
    setShowFilters(false);
  };

  const trustColor = (level: number) =>
    level >= 4 ? 'text-green-600' : level >= 3 ? 'text-blue-500' : level >= 2 ? 'text-amber-500' : 'text-gray-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-virgins-cream via-white to-purple-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-virgins-purple">Discover</h1>
            <p className="text-sm text-gray-500">Faith-compatible matches, curated by the Covenant Algorithm</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-virgins-purple/20 text-virgins-purple text-sm font-semibold shadow-sm hover:bg-virgins-purple/5 transition-colors"
            >
              <Filter size={14} /> Filters
            </button>
            <button
              onClick={() => { setPage(1); loadProfiles(true); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-virgins-purple text-white text-sm font-semibold shadow-sm hover:bg-virgins-purple/90 transition-colors"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg border border-virgins-gold/20 p-5 mb-6">
            <h3 className="font-bold text-virgins-purple mb-4">Discovery Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Looking for</label>
                <select
                  value={prefs.gender}
                  onChange={e => setPrefs(p => ({ ...p, gender: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-virgins-purple/30 outline-none"
                >
                  <option value="Woman">Women</option>
                  <option value="Man">Men</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Min Age: {prefs.minAge}</label>
                <input type="range" min={18} max={60} value={prefs.minAge}
                  onChange={e => setPrefs(p => ({ ...p, minAge: Number(e.target.value) }))}
                  className="w-full accent-virgins-purple" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Max Age: {prefs.maxAge}</label>
                <input type="range" min={18} max={70} value={prefs.maxAge}
                  onChange={e => setPrefs(p => ({ ...p, maxAge: Number(e.target.value) }))}
                  className="w-full accent-virgins-purple" />
              </div>
            </div>
            <button
              onClick={applyFilters}
              className="mt-4 px-6 py-2 bg-virgins-purple text-white rounded-xl text-sm font-bold hover:bg-virgins-purple/90 transition-colors"
            >
              Apply & Search
            </button>
          </div>
        )}

        {/* Profile cards */}
        {loading && profiles.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="mx-auto text-virgins-gold mb-3" size={32} />
            <p className="text-virgins-purple font-semibold">Finding your covenant matches...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 font-semibold">No new matches right now</p>
            <p className="text-sm text-gray-400 mt-1">Check back later as more members join!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {profiles.map(profile => {
              const { user, score, reasons, breakdown } = profile;
              const isLiked    = likedIds.has(user._id);
              const isExpanded = expandedId === user._id;

              return (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    {/* Photo */}
                    <div className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-virgins-purple/10 text-virgins-purple font-black text-2xl">
                          {user.name[0]}
                        </div>
                      )}
                      {user.isOnline && (
                        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-black text-virgins-purple text-lg leading-tight">{user.name}, {user.age}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <MapPin size={11} /> {user.city}
                          </div>
                        </div>
                        {/* Match score pill */}
                        <div className="flex-shrink-0 bg-virgins-gold/10 text-virgins-gold font-black text-sm px-3 py-1 rounded-full border border-virgins-gold/20">
                          {score}% match
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs bg-virgins-purple/10 text-virgins-purple px-2 py-0.5 rounded-full font-semibold">
                          {user.faith}
                        </span>
                        {user.denomination && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {user.denomination}
                          </span>
                        )}
                        <span className={`flex items-center gap-0.5 text-xs font-semibold ${trustColor(user.trustLevel)}`}>
                          <ShieldCheck size={11} /> {TRUST_LABELS[user.trustLevel] || 'Level ' + user.trustLevel}
                        </span>
                        {(user.reputationScore || 0) > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold">
                            <Star size={10} fill="currentColor" /> {user.reputationScore} met
                          </span>
                        )}
                      </div>

                      {user.bio && !isExpanded && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{user.bio}</p>
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-4 pb-3 border-t border-gray-50 pt-3">
                      {user.bio && <p className="text-sm text-gray-700 mb-3">{user.bio}</p>}

                      {/* Breakdown bars */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {[
                          { label: 'Faith', value: breakdown.faithScore },
                          { label: 'Values', value: breakdown.valuesScore },
                          { label: 'Intention', value: breakdown.intentionScore },
                          { label: 'Lifestyle', value: breakdown.lifestyleScore },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                              <span>{label}</span><span>{value}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-virgins-purple to-virgins-gold rounded-full"
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {reasons.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {reasons.map((r, i) => (
                            <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-50 bg-gray-50/50">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : user._id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-virgins-purple transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {isExpanded ? 'Less' : 'More'}
                    </button>

                    <div className="flex-1" />

                    {/* Report */}
                    <button
                      onClick={() => setShowReportModal(user._id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Report"
                    >
                      <Flag size={14} />
                    </button>
                    {/* Block */}
                    <button
                      onClick={() => handleBlock(user._id, user.name)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title="Block"
                    >
                      <Ban size={14} />
                    </button>
                    {/* Message (if matched) */}
                    <button
                      onClick={() => onNavigate?.('messages')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <MessageCircle size={13} /> Message
                    </button>
                    {/* Express Interest */}
                    <button
                      onClick={() => handleLike(profile)}
                      disabled={isLiked}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isLiked
                          ? 'bg-pink-100 text-pink-500 cursor-default'
                          : 'bg-virgins-purple text-white hover:bg-virgins-purple/90'
                      }`}
                    >
                      <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
                      {isLiked ? 'Interested!' : 'Express Interest'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && profiles.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={() => loadProfiles(false)}
              className="px-8 py-3 bg-white border border-virgins-purple/20 text-virgins-purple rounded-xl text-sm font-bold hover:bg-virgins-purple/5 transition-colors shadow-sm"
            >
              Load More Matches
            </button>
          </div>
        )}

        {loading && profiles.length > 0 && (
          <div className="text-center mt-6">
            <div className="inline-block w-6 h-6 border-2 border-virgins-purple border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-red-500" size={20} />
              <h3 className="font-black text-gray-900">Report User</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Reason *</label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-300 outline-none"
                >
                  <option value="">Select a reason...</option>
                  <option value="harassment">Harassment</option>
                  <option value="fake_profile">Fake Profile</option>
                  <option value="inappropriate_content">Inappropriate Content</option>
                  <option value="underage">Appears Underage</option>
                  <option value="spam">Spam</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Additional details (optional)</label>
                <textarea
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  rows={3}
                  placeholder="Please describe what happened..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-red-300 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowReportModal(null); setReportType(''); setReportDesc(''); }}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportType}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryFeed;
