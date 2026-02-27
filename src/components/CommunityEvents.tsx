import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Globe, Heart, Church, BookOpen, Handshake, Leaf, ChevronRight, Loader2, Check } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';
import { PageView } from '../types';

interface CommunityEventsProps {
  onNavigate: (page: PageView) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  worship:  { icon: Church,    label: 'Worship',  color: '#7C3AED' },
  social:   { icon: Heart,     label: 'Social',   color: '#DB2777' },
  service:  { icon: Handshake, label: 'Service',  color: '#059669' },
  study:    { icon: BookOpen,  label: 'Study',    color: '#2563EB' },
  retreat:  { icon: Leaf,      label: 'Retreat',  color: '#D97706' },
  all:      { icon: Calendar,  label: 'All',      color: '#1A1A2E' },
};

const TABS = ['all', 'worship', 'social', 'service', 'study', 'retreat'] as const;

const purple = 'hsl(270 100% 25%)';
const gold   = 'hsl(42 55% 55%)';
const dark   = 'hsl(270 100% 10%)';
const cream  = 'hsl(36 30% 97%)';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function CommunityEvents({ onNavigate }: CommunityEventsProps) {
  const [activeTab, setActiveTab]     = useState<string>('all');
  const [events, setEvents]           = useState<any[]>([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [rsvping, setRsvping]         = useState<string | null>(null);
  const [rsvpedIds, setRsvpedIds]     = useState<Set<string>>(new Set());

  const loadEvents = async (category = 'all') => {
    setLoading(true);
    try {
      const data = await (api as any).listCommunityEvents({ category }) as any;
      setEvents(data.events || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(activeTab); }, [activeTab]);

  const handleRsvp = async (eventId: string) => {
    setRsvping(eventId);
    try {
      const res = await (api as any).rsvpCommunityEvent(eventId) as any;
      setRsvpedIds(prev => {
        const next = new Set(prev);
        if (res.attending) {
          next.add(eventId);
          toast.success('RSVP confirmed!');
        } else {
          next.delete(eventId);
          toast('RSVP cancelled');
        }
        return next;
      });
      // Refresh list to update spotsLeft
      await loadEvents(activeTab);
    } catch (err: any) {
      toast.error(err.message || 'Failed to RSVP');
    } finally {
      setRsvping(null);
    }
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: cream }}>
      {/* Header */}
      <div className="sticky top-0 z-10 shadow-sm" style={{ background: `linear-gradient(135deg, ${dark}, ${purple})` }}>
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-white font-serif text-2xl font-bold">Community Events</h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {total} upcoming events for faith-minded singles
              </p>
            </div>
            <Calendar className="w-7 h-7" style={{ color: gold }} />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map(tab => {
              const { icon: Icon, label, color } = CATEGORY_ICONS[tab];
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
                  style={{
                    background: isActive ? gold : 'rgba(255,255,255,0.12)',
                    color: isActive ? dark : 'rgba(255,255,255,0.85)',
                    border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: purple }} />
            <p className="text-sm" style={{ color: 'hsl(270 30% 45%)' }}>Loading events…</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: purple }} />
            <p className="font-serif font-bold text-lg" style={{ color: dark }}>No events found</p>
            <p className="text-sm mt-1" style={{ color: 'hsl(270 30% 45%)' }}>Check back soon — new events are added weekly.</p>
          </div>
        ) : (
          events.map((event: any) => {
            const { icon: Icon, color } = CATEGORY_ICONS[event.category] || CATEGORY_ICONS.social;
            const isAttending = rsvpedIds.has(event._id);
            const isFull = event.spotsLeft === 0 && !isAttending;
            return (
              <div
                key={event._id}
                className="rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md"
                style={{ background: 'white', border: '1px solid hsl(270 100% 25% / 0.08)' }}
              >
                {/* Category stripe */}
                <div className="h-1.5 w-full" style={{ background: color }} />

                <div className="p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base leading-tight" style={{ color: dark }}>
                          {event.title}
                        </h3>
                        <p className="text-xs mt-0.5 font-medium" style={{ color: 'hsl(270 30% 50%)' }}>
                          {event.organizer}
                        </p>
                      </div>
                    </div>
                    {event.faithTradition && (
                      <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0" style={{ background: `${color}15`, color }}>
                        {event.faithTradition}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'hsl(270 100% 15% / 0.75)' }}>
                    {event.description}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 mb-4 text-xs" style={{ color: 'hsl(270 30% 45%)' }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(event.dateTime)} at {formatTime(event.dateTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      {event.isVirtual
                        ? <><Globe className="w-3.5 h-3.5" /> Online</>
                        : <><MapPin className="w-3.5 h-3.5" /> {event.location?.city}, {event.location?.state}</>
                      }
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {event.spotsLeft} spot{event.spotsLeft !== 1 ? 's' : ''} left
                    </span>
                  </div>

                  {/* Tags */}
                  {event.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {event.tags.map((tag: string) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'hsl(270 100% 25% / 0.06)', color: purple }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* RSVP button */}
                  <button
                    onClick={() => !isFull && handleRsvp(event._id)}
                    disabled={rsvping === event._id || isFull}
                    className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: isAttending ? '#f0fdf4' : isFull ? 'hsl(0 0% 93%)' : purple,
                      color: isAttending ? '#16a34a' : isFull ? '#9ca3af' : 'white',
                      border: isAttending ? '1px solid #bbf7d0' : 'none',
                      cursor: isFull ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {rsvping === event._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isAttending ? (
                      <><Check className="w-4 h-4" /> Going — Cancel RSVP</>
                    ) : isFull ? (
                      'Event Full'
                    ) : (
                      <>RSVP — I'm Coming <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>

                  {event.isVirtual && event.meetingLink && isAttending && (
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="block mt-2 text-center text-xs font-semibold underline"
                      style={{ color: purple }}
                    >
                      Join Online Meeting Link →
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
