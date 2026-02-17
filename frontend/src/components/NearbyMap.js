import React, { useState, useEffect, useCallback, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { MapPin, Users, Shield, EyeOff, Navigation2, Compass, Loader2, Coffee, Utensils, TreePine, Church, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API = process.env.REACT_APP_BACKEND_URL;
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Custom hook for geolocation
function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError(err.message || 'Unable to get your location');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { location, error, loading, refetch: getLocation };
}

// User Marker Component
function UserMarker({ user, onClick, isSelected }) {
  return (
    <AdvancedMarker
      position={{
        lat: user.coordinates?.coordinates?.[1] || 0,
        lng: user.coordinates?.coordinates?.[0] || 0,
      }}
      onClick={onClick}
      title={user.name}
    >
      <div className={`relative cursor-pointer transition-transform hover:scale-110 ${isSelected ? 'scale-125 z-50' : ''}`}>
        <div className="bg-white p-1 rounded-full border-2 border-gold-500 shadow-lg">
          <img
            src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1A1A2E&color=D4A574&size=100`}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
      </div>
    </AdvancedMarker>
  );
}

// Venue Marker Component
function VenueMarker({ venue, onClick }) {
  const getVenueIcon = (types) => {
    if (types?.includes('restaurant')) return <Utensils size={14} className="text-white" />;
    if (types?.includes('cafe') || types?.includes('coffee_shop')) return <Coffee size={14} className="text-white" />;
    if (types?.includes('park')) return <TreePine size={14} className="text-white" />;
    if (types?.includes('church')) return <Church size={14} className="text-white" />;
    return <MapPin size={14} className="text-white" />;
  };

  const getVenueColor = (types) => {
    if (types?.includes('restaurant')) return 'bg-rose-500';
    if (types?.includes('cafe') || types?.includes('coffee_shop')) return 'bg-amber-500';
    if (types?.includes('park')) return 'bg-emerald-500';
    if (types?.includes('church')) return 'bg-purple-500';
    return 'bg-blue-500';
  };

  return (
    <AdvancedMarker
      position={{
        lat: venue.location?.latitude || 0,
        lng: venue.location?.longitude || 0,
      }}
      onClick={onClick}
      title={venue.displayName?.text}
    >
      <div className={`${getVenueColor(venue.types)} p-2 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110`}>
        {getVenueIcon(venue.types)}
      </div>
    </AdvancedMarker>
  );
}

// Map Content Component (must be inside APIProvider)
function MapContent({ location, nearbyUsers, nearbyVenues, ghostMode, onUserClick, onVenueClick, selectedUser, selectedVenue }) {
  const map = useMap();

  useEffect(() => {
    if (map && location) {
      map.panTo({ lat: location.latitude, lng: location.longitude });
    }
  }, [map, location]);

  return (
    <>
      {/* Current user location */}
      <AdvancedMarker
        position={{ lat: location.latitude, lng: location.longitude }}
        title="Your Location"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping scale-[2]" />
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-500">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
          </div>
        </div>
      </AdvancedMarker>

      {/* Nearby users */}
      {!ghostMode && nearbyUsers.map((user) => (
        <UserMarker
          key={user.firebaseUid}
          user={user}
          onClick={() => onUserClick(user)}
          isSelected={selectedUser?.firebaseUid === user.firebaseUid}
        />
      ))}

      {/* Nearby venues */}
      {nearbyVenues.map((venue) => (
        <VenueMarker
          key={venue.id}
          venue={venue}
          onClick={() => onVenueClick(venue)}
        />
      ))}

      {/* User Info Window */}
      {selectedUser && (
        <InfoWindow
          position={{
            lat: selectedUser.coordinates?.coordinates?.[1] || 0,
            lng: selectedUser.coordinates?.coordinates?.[0] || 0,
          }}
          onCloseClick={() => onUserClick(null)}
        >
          <div className="p-2 max-w-xs">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={selectedUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}`}
                alt={selectedUser.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gold-500"
              />
              <div>
                <h3 className="font-bold text-navy-900">{selectedUser.name}, {selectedUser.age}</h3>
                <p className="text-xs text-slate-500">{selectedUser.distance ? `${selectedUser.distance} km away` : selectedUser.location}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">{selectedUser.bio}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedUser.denomination && (
                <span className="px-2 py-0.5 bg-gold-100 text-gold-700 rounded-full text-xs font-medium">{selectedUser.denomination}</span>
              )}
              {selectedUser.intention && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{selectedUser.intention}</span>
              )}
            </div>
          </div>
        </InfoWindow>
      )}

      {/* Venue Info Window */}
      {selectedVenue && (
        <InfoWindow
          position={{
            lat: selectedVenue.location?.latitude || 0,
            lng: selectedVenue.location?.longitude || 0,
          }}
          onCloseClick={() => onVenueClick(null)}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-bold text-navy-900">{selectedVenue.displayName?.text}</h3>
            <p className="text-xs text-slate-500 mt-1">{selectedVenue.formattedAddress}</p>
            {selectedVenue.rating && (
              <p className="text-sm mt-1">⭐ {selectedVenue.rating.toFixed(1)}</p>
            )}
            <p className="text-xs text-slate-400 mt-1 capitalize">{selectedVenue.primaryType?.replace(/_/g, ' ')}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function NearbyMap() {
  const { user } = useAuth();
  const { location, error: locationError, loading: locationLoading, refetch: refetchLocation } = useGeolocation();
  const [ghostMode, setGhostMode] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [nearbyVenues, setNearbyVenues] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);
  const [showVenues, setShowVenues] = useState(true);

  // Fetch nearby users and venues
  const fetchNearbyData = useCallback(async () => {
    if (!location || !user) return;

    setDataLoading(true);
    setDataError(null);

    try {
      // Update user's location in the database
      await fetch(`${API}/api/users/me/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-firebase-uid': user.uid,
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      // Fetch nearby users
      const usersResponse = await fetch(`${API}/api/users/nearby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-firebase-uid': user.uid,
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          maxDistance: 50000, // 50km
          limit: 20,
        }),
      });

      if (usersResponse.ok) {
        const users = await usersResponse.json();
        setNearbyUsers(users);
      }

      // Fetch nearby venues
      const venuesResponse = await fetch(
        `${API}/api/venues/nearby?latitude=${location.latitude}&longitude=${location.longitude}&radius=2000&place_types=restaurant,cafe,park,church`
      );

      if (venuesResponse.ok) {
        const venuesData = await venuesResponse.json();
        setNearbyVenues(venuesData.places || []);
      }
    } catch (err) {
      console.error('Error fetching nearby data:', err);
      setDataError('Failed to load nearby data');
    } finally {
      setDataLoading(false);
    }
  }, [location, user]);

  useEffect(() => {
    fetchNearbyData();
  }, [fetchNearbyData]);

  // Loading state
  if (locationLoading) {
    return (
      <div data-testid="nearby-map-page" className="min-h-screen bg-slate-900 pt-32 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-white font-bold">Getting your location...</p>
          <p className="text-slate-400 text-sm mt-2">Please allow location access when prompted</p>
        </div>
      </div>
    );
  }

  // Error state
  if (locationError) {
    return (
      <div data-testid="nearby-map-page" className="min-h-screen bg-slate-900 pt-32 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Location Access Required</h2>
          <p className="text-slate-400 mb-6">{locationError}</p>
          <p className="text-slate-500 text-sm mb-6">
            To use the Nearby Map feature, please enable location access in your browser settings and try again.
          </p>
          <button
            onClick={refetchLocation}
            className="px-6 py-3 bg-gold-500 text-navy-900 rounded-full font-bold hover:bg-gold-400 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={18} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // No API key
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div data-testid="nearby-map-page" className="min-h-screen bg-slate-900 pt-32 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Map Configuration Required</h2>
          <p className="text-slate-400">Google Maps API key is not configured. Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="nearby-map-page" className="min-h-screen bg-slate-900 pt-24 pb-0 relative overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 w-full relative z-10 pt-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1 flex items-center gap-3">
              Live Community <Navigation2 className="text-gold-500 fill-gold-500" size={24} />
            </h1>
            <p className="text-slate-400 font-medium text-sm">Verified, intentional singles near you • {nearbyUsers.length} nearby</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Ghost Mode Toggle */}
            <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex border border-white/10 shadow-2xl">
              <button
                onClick={() => setGhostMode(false)}
                className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${
                  !ghostMode ? 'bg-white text-navy-900 shadow-lg scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                VISIBLE
              </button>
              <button
                onClick={() => setGhostMode(true)}
                className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all flex items-center gap-1 ${
                  ghostMode ? 'bg-gold-500 text-navy-900 shadow-lg scale-105' : 'text-slate-400 hover:text-white'
                }`}
              >
                <EyeOff size={12} /> GHOST
              </button>
            </div>
            {/* Refresh Button */}
            <button
              onClick={fetchNearbyData}
              disabled={dataLoading}
              className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={dataLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative min-h-[60vh]">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={{ lat: location.latitude, lng: location.longitude }}
            defaultZoom={13}
            mapId="nearby-map"
            gestureHandling="greedy"
            disableDefaultUI={false}
            zoomControl={true}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
            style={{ width: '100%', height: '100%', minHeight: '60vh' }}
          >
            <MapContent
              location={location}
              nearbyUsers={nearbyUsers}
              nearbyVenues={showVenues ? nearbyVenues : []}
              ghostMode={ghostMode}
              onUserClick={setSelectedUser}
              onVenueClick={setSelectedVenue}
              selectedUser={selectedUser}
              selectedVenue={selectedVenue}
            />
          </Map>
        </APIProvider>

        {/* Stats Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="bg-navy-900/90 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3 shadow-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest block">Live Members</span>
              <span className="text-[11px] text-slate-400 font-medium">{nearbyUsers.length} nearby</span>
            </div>
          </div>
          {ghostMode && (
            <div className="bg-gold-500 p-3 rounded-xl shadow-xl flex items-center gap-3">
              <Shield size={16} className="text-navy-900" />
              <div>
                <span className="text-[10px] font-black text-navy-900 uppercase tracking-widest block">Ghost Mode</span>
                <span className="text-[11px] text-navy-800/70 font-bold">You're invisible</span>
              </div>
            </div>
          )}
        </div>

        {/* Venue Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowVenues(!showVenues)}
            className={`px-4 py-2 rounded-xl font-bold text-xs shadow-xl transition-all ${
              showVenues
                ? 'bg-white text-navy-900'
                : 'bg-navy-900/90 text-white border border-white/10'
            }`}
          >
            {showVenues ? 'Hide' : 'Show'} Date Spots
          </button>
        </div>
      </div>

      {/* Bottom User Cards */}
      {nearbyUsers.length > 0 && (
        <div className="bg-navy-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {nearbyUsers.slice(0, 6).map((nearbyUser) => (
                <div
                  key={nearbyUser.firebaseUid}
                  onClick={() => setSelectedUser(nearbyUser)}
                  className="flex-shrink-0 w-56 bg-navy-800/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl flex items-center gap-4 cursor-pointer hover:bg-navy-700 transition-all hover:-translate-y-1"
                >
                  <img
                    src={nearbyUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(nearbyUser.name)}&background=1A1A2E&color=D4A574`}
                    className="w-12 h-12 rounded-full border-2 border-gold-500 shadow-lg object-cover"
                    alt={nearbyUser.name}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm leading-none mb-1 truncate">{nearbyUser.name}, {nearbyUser.age}</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                      {nearbyUser.distance ? `${nearbyUser.distance} km` : nearbyUser.location}
                    </p>
                    <button className="mt-1 text-[10px] font-black text-gold-500 hover:text-gold-400 flex items-center gap-1">
                      VIEW <Compass size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {dataLoading && (
        <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-navy-800 p-6 rounded-2xl shadow-2xl text-center">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-2" />
            <p className="text-white font-medium">Updating nearby...</p>
          </div>
        </div>
      )}
    </div>
  );
}
