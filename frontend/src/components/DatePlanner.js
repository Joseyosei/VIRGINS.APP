import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Heart, Crown, ArrowRight, Check, Coffee, Utensils, TreePine, Church, Sparkles, ChevronLeft, Users, Brain, Loader2, Star, Clock, Send, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API = process.env.REACT_APP_BACKEND_URL;

// Community Events (mock data - in production would come from backend)
const COMMUNITY_EVENTS = [
  {
    id: 'event1',
    name: 'Singles Praise Night',
    date: '2026-02-22',
    time: '7:00 PM',
    location: 'Grace Community Church',
    type: 'church',
    description: 'Join fellow singles for an evening of worship and fellowship.',
    attendees: 24,
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'event2',
    name: 'Faith & Coffee Meetup',
    date: '2026-02-25',
    time: '10:00 AM',
    location: 'Covenant Coffee House',
    type: 'cafe',
    description: 'Casual conversation over coffee with other Christian singles.',
    attendees: 12,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'event3',
    name: 'Hiking for Him',
    date: '2026-03-01',
    time: '9:00 AM',
    location: 'Sunrise Trail Park',
    type: 'park',
    description: 'Enjoy God\'s creation with a group hike followed by prayer.',
    attendees: 18,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80',
  },
];

// AI Date Suggestions based on shared interests
const getAISuggestions = (profile, matchProfile) => {
  const suggestions = [
    {
      id: 'ai1',
      title: 'Coffee & Conversation',
      description: 'Start with a relaxed coffee date to get to know each other\'s faith journey.',
      duration: '1-2 hours',
      type: 'cafe',
      conversationStarters: [
        'What\'s your favorite Bible verse and why?',
        'How has your faith shaped your life goals?',
        'What does intentional dating mean to you?',
      ],
    },
    {
      id: 'ai2',
      title: 'Sunday Service & Lunch',
      description: 'Attend church together and share a meal afterward for meaningful discussion.',
      duration: '3-4 hours',
      type: 'church',
      conversationStarters: [
        'What spoke to you most from today\'s sermon?',
        'How do you envision faith in your future family?',
        'What ministry areas are you passionate about?',
      ],
    },
    {
      id: 'ai3',
      title: 'Nature Walk & Prayer',
      description: 'Enjoy God\'s creation together with a peaceful park walk and shared prayer time.',
      duration: '2-3 hours',
      type: 'park',
      conversationStarters: [
        'Where do you feel closest to God?',
        'What are your prayer habits like?',
        'How do you maintain peace in stressful times?',
      ],
    },
  ];
  return suggestions;
};

const venueCategories = [
  { id: 'cafe', name: 'Cafe', icon: <Coffee size={16} />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'restaurant', name: 'Restaurant', icon: <Utensils size={16} />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'park', name: 'Park', icon: <TreePine size={16} />, color: 'text-green-600 bg-green-50 border-green-200' },
  { id: 'church', name: 'Church', icon: <Church size={16} />, color: 'text-purple-600 bg-purple-50 border-purple-200' },
];

export default function DatePlanner() {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [planMode, setPlanMode] = useState(null); // 'ai', 'community', 'venues'
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [venues, setVenues] = useState([]);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('cafe');
  const [location, setLocation] = useState(null);
  const [matchToInvite, setMatchToInvite] = useState(null);
  const [matches, setMatches] = useState([]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => setLocation({ latitude: 30.2672, longitude: -97.7431 }) // Default to Austin
      );
    }
  }, []);

  // Fetch matches
  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API}/api/matches`, {
        headers: { 'x-firebase-uid': user.uid },
      });
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    }
  };

  // Fetch nearby venues from Google Places
  const fetchVenues = useCallback(async (category) => {
    if (!location) return;

    setVenuesLoading(true);
    try {
      const response = await fetch(
        `${API}/api/venues/nearby?latitude=${location.latitude}&longitude=${location.longitude}&radius=3000&place_types=${category}`
      );
      if (response.ok) {
        const data = await response.json();
        setVenues(data.places || []);
      }
    } catch (err) {
      console.error('Failed to fetch venues:', err);
    } finally {
      setVenuesLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (planMode === 'venues' && location) {
      fetchVenues(selectedCategory);
    }
  }, [planMode, selectedCategory, location, fetchVenues]);

  const aiSuggestions = getAISuggestions(profile, matchToInvite?.matchedUser);

  const handleSendInvitation = () => {
    // In production, this would send a real invitation through the chat system
    setStep(4);
  };

  const getVenueTypeIcon = (types) => {
    if (types?.includes('restaurant')) return <Utensils size={14} />;
    if (types?.includes('cafe') || types?.includes('coffee_shop')) return <Coffee size={14} />;
    if (types?.includes('park')) return <TreePine size={14} />;
    if (types?.includes('church')) return <Church size={14} />;
    return <MapPin size={14} />;
  };

  return (
    <div data-testid="date-planner-page" className="min-h-screen bg-slate-50 pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-100 text-gold-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Courtship Planning
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-navy-900 mb-3">Plan Your Date</h1>
          <p className="text-base text-slate-500">Create meaningful connections with our intelligent date planner.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s ? 'bg-navy-900 text-gold-500 shadow-lg' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s ? <Check size={16} /> : s}
              </div>
              {s < 4 && <div className={`w-10 h-0.5 rounded-full ${step > s ? 'bg-navy-900' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 md:p-10">
          {/* Step 1: Choose Planning Mode */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-serif font-bold text-navy-900 text-center mb-6">How would you like to plan?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* AI Suggestions */}
                <button
                  onClick={() => { setPlanMode('ai'); setStep(2); }}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-gold-500 hover:shadow-lg transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold-500 transition-colors">
                    <Brain className="w-6 h-6 text-gold-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-navy-900 mb-1">AI Suggestions</h3>
                  <p className="text-sm text-slate-500">Get personalized date ideas based on shared interests and values.</p>
                </button>

                {/* Community Events */}
                <button
                  onClick={() => { setPlanMode('community'); setStep(2); }}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-gold-500 hover:shadow-lg transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                    <Users className="w-6 h-6 text-purple-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-navy-900 mb-1">Community Events</h3>
                  <p className="text-sm text-slate-500">Join group activities and meet other faith-centered singles.</p>
                </button>

                {/* Browse Venues */}
                <button
                  onClick={() => { setPlanMode('venues'); setStep(2); }}
                  className="p-6 rounded-2xl border-2 border-slate-200 hover:border-gold-500 hover:shadow-lg transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                    <MapPin className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-navy-900 mb-1">Browse Venues</h3>
                  <p className="text-sm text-slate-500">Find real cafes, restaurants, and parks near you via Google Places.</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Option Based on Mode */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold text-navy-900">
                  {planMode === 'ai' && 'AI-Powered Date Ideas'}
                  {planMode === 'community' && 'Upcoming Community Events'}
                  {planMode === 'venues' && 'Nearby Venues'}
                </h2>
                <button onClick={() => setStep(1)} className="text-sm font-bold text-slate-500 hover:text-navy-900 flex items-center gap-1">
                  <ChevronLeft size={16} /> Back
                </button>
              </div>

              {/* AI Suggestions */}
              {planMode === 'ai' && (
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => { setSelectedSuggestion(suggestion); setStep(3); }}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all hover:shadow-lg ${
                        selectedSuggestion?.id === suggestion.id ? 'border-gold-500 bg-gold-50' : 'border-slate-200 hover:border-gold-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          suggestion.type === 'cafe' ? 'bg-amber-100 text-amber-600' :
                          suggestion.type === 'church' ? 'bg-purple-100 text-purple-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {suggestion.type === 'cafe' ? <Coffee size={24} /> :
                           suggestion.type === 'church' ? <Church size={24} /> :
                           <TreePine size={24} />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-navy-900 mb-1">{suggestion.title}</h3>
                          <p className="text-sm text-slate-500 mb-2">{suggestion.description}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Clock size={12} /> {suggestion.duration}</span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400 mb-2">CONVERSATION STARTERS</p>
                            <ul className="space-y-1">
                              {suggestion.conversationStarters.slice(0, 2).map((q, i) => (
                                <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                                  <MessageCircle size={10} className="mt-1 flex-shrink-0" /> {q}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Community Events */}
              {planMode === 'community' && (
                <div className="space-y-4">
                  {COMMUNITY_EVENTS.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => { setSelectedEvent(event); setStep(3); }}
                      className={`w-full rounded-2xl border-2 overflow-hidden text-left transition-all hover:shadow-lg ${
                        selectedEvent?.id === event.id ? 'border-gold-500' : 'border-slate-200 hover:border-gold-300'
                      }`}
                    >
                      <div className="flex">
                        <img src={event.image} alt={event.name} className="w-32 h-32 object-cover" />
                        <div className="p-4 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              event.type === 'church' ? 'bg-purple-100 text-purple-600' :
                              event.type === 'cafe' ? 'bg-amber-100 text-amber-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {event.type.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="font-bold text-navy-900 mb-1">{event.name}</h3>
                          <p className="text-xs text-slate-500 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                            <span className="flex items-center gap-1"><Users size={12} /> {event.attendees} going</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Browse Venues */}
              {planMode === 'venues' && (
                <div className="space-y-4">
                  {/* Category Filter */}
                  <div className="flex gap-2 flex-wrap">
                    {venueCategories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                          selectedCategory === c.id ? c.color + ' shadow-md' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {c.icon} {c.name}
                      </button>
                    ))}
                  </div>

                  {/* Venues Grid */}
                  {venuesLoading ? (
                    <div className="py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-2" />
                      <p className="text-slate-500">Finding nearby venues...</p>
                    </div>
                  ) : venues.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {venues.map((venue) => (
                        <button
                          key={venue.id}
                          onClick={() => { setSelectedVenue(venue); setStep(3); }}
                          className={`rounded-2xl border-2 overflow-hidden text-left transition-all hover:shadow-lg ${
                            selectedVenue?.id === venue.id ? 'border-gold-500' : 'border-slate-200 hover:border-gold-300'
                          }`}
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                {getVenueTypeIcon(venue.types)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-navy-900 text-sm">{venue.displayName?.text}</h3>
                                <p className="text-xs text-slate-500 mt-1">{venue.formattedAddress}</p>
                                {venue.rating && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <Star size={12} className="text-gold-500 fill-gold-500" />
                                    <span className="text-xs font-bold text-slate-600">{venue.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-500">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>No venues found nearby. Try a different category or expand your search.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Set Date & Invite */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold text-navy-900">Finalize Your Date</h2>
                <button onClick={() => setStep(2)} className="text-sm font-bold text-slate-500 hover:text-navy-900 flex items-center gap-1">
                  <ChevronLeft size={16} /> Back
                </button>
              </div>

              {/* Selected Option Summary */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Selected</p>
                <h3 className="font-bold text-navy-900 text-lg">
                  {selectedSuggestion?.title || selectedEvent?.name || selectedVenue?.displayName?.text}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedSuggestion?.description || selectedEvent?.location || selectedVenue?.formattedAddress}
                </p>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Select Match to Invite */}
              {user && matches.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">Invite a Match (Optional)</label>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {matches.map((match) => (
                      <button
                        key={match.matchedUser?.firebaseUid}
                        onClick={() => setMatchToInvite(match)}
                        className={`flex-shrink-0 p-3 rounded-xl border-2 transition-all ${
                          matchToInvite?.matchedUser?.firebaseUid === match.matchedUser?.firebaseUid
                            ? 'border-gold-500 bg-gold-50'
                            : 'border-slate-200 hover:border-gold-300'
                        }`}
                      >
                        <img
                          src={match.matchedUser?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.matchedUser?.name || 'U')}`}
                          alt={match.matchedUser?.name}
                          className="w-12 h-12 rounded-full object-cover mx-auto mb-2"
                        />
                        <p className="text-xs font-bold text-navy-900 text-center">{match.matchedUser?.name?.split(' ')[0]}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleSendInvitation}
                disabled={!date}
                className="w-full py-4 bg-navy-900 text-white rounded-2xl font-bold shadow-lg hover:bg-navy-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {matchToInvite ? 'Send Invitation' : 'Confirm Date'} <Send size={18} />
              </button>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="text-center space-y-6 animate-fadeIn py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-serif font-black text-navy-900">
                {matchToInvite ? 'Invitation Sent!' : 'Date Planned!'}
              </h2>
              <p className="text-base text-slate-500 max-w-md mx-auto">
                {matchToInvite ? (
                  <>You've invited <span className="font-bold text-navy-900">{matchToInvite.matchedUser?.name}</span> to </>
                ) : (
                  <>Your courtship date is scheduled for </>
                )}
                <span className="font-bold text-navy-900">
                  {selectedSuggestion?.title || selectedEvent?.name || selectedVenue?.displayName?.text}
                </span>
                {date && <> on <span className="font-bold text-navy-900">{date}</span></>}
                {time && <> at <span className="font-bold text-navy-900">{time}</span></>}.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setPlanMode(null);
                    setDate('');
                    setTime('');
                    setSelectedVenue(null);
                    setSelectedEvent(null);
                    setSelectedSuggestion(null);
                    setMatchToInvite(null);
                  }}
                  className="px-6 py-3 bg-slate-100 text-navy-900 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Plan Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
