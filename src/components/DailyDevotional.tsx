import { useState, useEffect } from 'react';
import { BookOpen, Heart, ChevronRight, Loader2, MapPin, Star, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';
import { PageView } from '../types';

interface DailyDevotionalProps {
  onNavigate: (page: PageView) => void;
}

const purple = 'hsl(270 100% 25%)';
const gold   = 'hsl(42 55% 55%)';
const dark   = 'hsl(270 100% 10%)';
const cream  = 'hsl(36 30% 97%)';

function TrustBadge({ level }: { level: number }) {
  if (level < 1) return null;
  const labels = ['', 'Pledge', 'ID', 'Vouched', 'Clear'] as const;
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${gold}25`, color: gold }}>
      Level {level} · {labels[level]}
    </span>
  );
}

export default function DailyDevotional({ onNavigate }: DailyDevotionalProps) {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReflection, setShowReflection] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  const load = async () => {
    setLoading(true);
    setShowReflection(false);
    try {
      const res = await (api as any).getDevotionalMatch() as any;
      setData(res);
    } catch {
      toast.error('Failed to load devotional');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleLikeMatch = () => {
    setLikeAnim(true);
    toast.success("You've expressed interest!", {
      style: { background: purple, color: cream, border: `1px solid ${gold}` }
    });
    setTimeout(() => setLikeAnim(false), 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: cream }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: purple }} />
          <p className="text-sm font-medium" style={{ color: 'hsl(270 30% 45%)' }}>Loading today's devotional…</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { devotional, match } = data;

  return (
    <div className="min-h-screen pb-16" style={{ background: cream }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${dark}, ${purple})` }}>
        <div className="max-w-lg mx-auto px-4 py-8 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${gold}30` }}>
            <BookOpen className="w-7 h-7" style={{ color: gold }} />
          </div>
          <h1 className="text-white font-serif text-2xl font-bold mb-1">Daily Devotional</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {devotional.dayName} · {devotional.date}
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-5">

        {/* Verse Card */}
        <div
          className="rounded-2xl p-6 shadow-md"
          style={{ background: 'white', border: `1px solid hsl(270 100% 25% / 0.1)` }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: gold }}>
              {devotional.theme}
            </span>
          </div>

          <blockquote className="font-serif text-base leading-relaxed mb-3" style={{ color: dark }}>
            "{devotional.text}"
          </blockquote>
          <p className="text-sm font-semibold" style={{ color: purple }}>— {devotional.verse}</p>
        </div>

        {/* Reflection prompt */}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'white', border: `1px solid hsl(270 100% 25% / 0.1)` }}>
          <button
            onClick={() => setShowReflection(v => !v)}
            className="w-full flex items-center justify-between p-5"
          >
            <span className="font-serif font-bold" style={{ color: dark }}>Reflection Prompt</span>
            <ChevronRight
              className="w-5 h-5 transition-transform"
              style={{ color: purple, transform: showReflection ? 'rotate(90deg)' : 'none' }}
            />
          </button>
          {showReflection && (
            <div className="px-5 pb-5">
              <div className="h-px mb-4" style={{ background: 'hsl(270 100% 25% / 0.08)' }} />
              <p className="text-sm leading-relaxed" style={{ color: 'hsl(270 100% 15% / 0.8)' }}>
                {devotional.reflection}
              </p>
              <p className="text-xs mt-4 italic" style={{ color: 'hsl(270 30% 55%)' }}>
                Consider journaling your thoughts or sharing this reflection with a mentor.
              </p>
            </div>
          )}
        </div>

        {/* Devotional Match */}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'white', border: `1px solid hsl(270 100% 25% / 0.1)` }}>
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif font-bold text-base" style={{ color: dark }}>Today's Devotional Match</h2>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(270 30% 50%)' }}>
                  Someone whose heart aligns with <em>{devotional.theme}</em>
                </p>
              </div>
              <button
                onClick={load}
                className="p-2 rounded-full transition-all hover:opacity-70"
                title="Refresh match"
                style={{ background: 'hsl(270 100% 25% / 0.06)' }}
              >
                <RefreshCw className="w-4 h-4" style={{ color: purple }} />
              </button>
            </div>

            {match ? (
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl overflow-hidden"
                    style={{ border: `2px solid ${gold}` }}
                  >
                    {match.profileImage ? (
                      <img src={match.profileImage} alt={match.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-2xl font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${dark}, ${purple})` }}>
                        {match.name?.[0]}
                      </div>
                    )}
                  </div>
                  {match.trustLevel > 0 && (
                    <div
                      className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: gold }}
                    >
                      <Star className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-bold" style={{ color: dark }}>
                      {match.name}, {match.age}
                    </span>
                    <TrustBadge level={match.trustLevel} />
                  </div>
                  <div className="flex items-center gap-3 text-xs mt-1" style={{ color: 'hsl(270 30% 50%)' }}>
                    <span>{match.faith}{match.denomination ? ` · ${match.denomination}` : ''}</span>
                    {match.city && (
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />{match.city}
                      </span>
                    )}
                  </div>
                  {match.values?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {match.values.slice(0, 3).map((v: string) => (
                        <span key={v} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'hsl(270 100% 25% / 0.06)', color: purple }}>
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                  {match.bio && (
                    <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color: 'hsl(270 100% 15% / 0.7)' }}>
                      {match.bio}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: purple }} />
                <p className="text-sm" style={{ color: 'hsl(270 30% 50%)' }}>No devotional match today. Check back tomorrow!</p>
              </div>
            )}
          </div>

          {match && (
            <div
              className="px-5 pb-5 pt-0 flex gap-3"
            >
              <button
                onClick={handleLikeMatch}
                className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: purple,
                  color: 'white',
                  transform: likeAnim ? 'scale(0.96)' : 'scale(1)',
                }}
              >
                <Heart className="w-4 h-4" />
                Express Interest
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{ background: 'hsl(270 100% 25% / 0.08)', color: purple }}
              >
                See Discovery Feed
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs pb-4" style={{ color: 'hsl(270 30% 55%)' }}>
          A new devotional and match refreshes every day at midnight. ✦
        </p>
      </div>
    </div>
  );
}
