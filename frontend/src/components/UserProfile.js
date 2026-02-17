import React, { useState, useEffect } from 'react';
import { Crown, Star, Gem, ArrowRight, Shield, Edit, MapPin, Eye, Heart, Users, LogOut, Sparkles, Check, Briefcase, GraduationCap, Ruler, Dumbbell, Home, Church, X, Loader2, Save, Camera, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SinglePhotoUploader } from './PhotoUploader';
import PhotoUploader from './PhotoUploader';

const API = process.env.REACT_APP_BACKEND_URL;

export default function UserProfile({ onNavigate }) {
  const { user, profile, logout, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (profile) {
      setEditData({
        bio: profile.bio || '',
        work: profile.work || '',
        education: profile.education || '',
        height: profile.height || '',
        exercise: profile.exercise || '',
        location: profile.location || '',
        hometown: profile.hometown || '',
      });
      setPhotos(profile.photos || []);
    }
  }, [profile]);

  const handlePhotosChange = async (newPhotos) => {
    setPhotos(newPhotos);
    await refreshProfile();
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await fetch(`${API}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-firebase-uid': user.uid },
        body: JSON.stringify(editData),
      });
      await refreshProfile();
      setEditing(false);
    } catch (e) {
      console.error('Profile save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">Sign in to view your profile</h2>
          <button data-testid="profile-login-btn" onClick={() => onNavigate('login')} className="px-8 py-3 bg-navy-900 text-white rounded-full font-bold">Sign In</button>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || user?.displayName || 'Member';
  const displayAge = profile?.age || '';
  const displayLocation = profile?.location || 'Update your location';
  const displayImage = profile?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1A1A2E&color=D4A574&size=200&font-size=0.4&bold=true`;

  return (
    <div data-testid="user-profile-page" className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Profile Card */}
        <div className="bg-navy-900 rounded-[2rem] shadow-xl overflow-hidden mb-6 relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-navy-800 to-transparent opacity-50" />
          <div className="relative z-10 p-8 flex flex-col items-center">
            <div className="relative mb-4">
              <img src={displayImage} alt="Profile" className="w-28 h-28 rounded-full border-4 border-gold-500 shadow-2xl object-cover" />
              <button className="absolute bottom-0 right-0 bg-gold-500 p-2 rounded-full text-navy-900 hover:bg-gold-400 transition-colors shadow-lg">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">{displayName}{displayAge ? `, ${displayAge}` : ''}</h1>
            <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> {displayLocation}
            </p>
            {profile?.denomination && (
              <span className="mt-3 px-4 py-1 bg-gold-500/20 text-gold-400 rounded-full text-xs font-bold">{profile.denomination} {profile.faithLevel && `\u2022 ${profile.faithLevel}`}</span>
            )}
          </div>
        </div>

        {/* Edit / View Profile Details */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Edit size={14} className="text-navy-900" /> {editing ? 'Edit Profile' : 'Profile Details'}
            </h3>
            {!editing ? (
              <button data-testid="edit-profile-btn" onClick={() => setEditing(true)} className="text-xs font-bold text-gold-600 hover:text-gold-700 px-3 py-1 bg-gold-50 rounded-full">
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1 bg-slate-100 rounded-full flex items-center gap-1">
                  <X size={12} /> Cancel
                </button>
                <button data-testid="save-profile-btn" onClick={handleSave} disabled={saving} className="text-xs font-bold text-white px-3 py-1 bg-navy-900 rounded-full flex items-center gap-1 disabled:opacity-50">
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bio</label>
                <p className="text-xs text-slate-400 mb-2">Write a fun and punchy intro.</p>
                <textarea data-testid="edit-bio" rows={4} maxLength={500}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all resize-none"
                  placeholder="A little bit about you..." value={editData.bio}
                  onChange={e => setEditData({ ...editData, bio: e.target.value })} />
                <p className="text-xs text-slate-400 text-right">{editData.bio?.length || 0}/500</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <EditField icon={<Briefcase size={16} />} label="Work" value={editData.work} placeholder="Add" onChange={v => setEditData({ ...editData, work: v })} />
                <EditField icon={<GraduationCap size={16} />} label="Education" value={editData.education} placeholder="Add" onChange={v => setEditData({ ...editData, education: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <EditField icon={<MapPin size={16} />} label="Location" value={editData.location} placeholder="Add" onChange={v => setEditData({ ...editData, location: v })} />
                <EditField icon={<Home size={16} />} label="Hometown" value={editData.hometown} placeholder="Add" onChange={v => setEditData({ ...editData, hometown: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <EditField icon={<Ruler size={16} />} label="Height" value={editData.height} placeholder="Add" onChange={v => setEditData({ ...editData, height: v })} />
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Dumbbell size={16} /> Exercise</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy-900 outline-none appearance-none"
                    value={editData.exercise} onChange={e => setEditData({ ...editData, exercise: e.target.value })}>
                    <option value="">Add</option>
                    <option value="Active">Active</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Almost Never">Almost Never</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {profile?.bio && (
                <div className="p-5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bio</p>
                  <p className="text-slate-700 text-sm leading-relaxed italic">"{profile.bio}"</p>
                </div>
              )}
              <ProfileRow icon={<Briefcase size={16} />} label="Work" value={profile?.work} />
              <ProfileRow icon={<GraduationCap size={16} />} label="Education" value={profile?.education} />
              <ProfileRow icon={<MapPin size={16} />} label="Location" value={profile?.location} />
              <ProfileRow icon={<Home size={16} />} label="Hometown" value={profile?.hometown} />
              <ProfileRow icon={<Ruler size={16} />} label="Height" value={profile?.height} />
              <ProfileRow icon={<Dumbbell size={16} />} label="Exercise" value={profile?.exercise} />
              <ProfileRow icon={<Church size={16} />} label="Denomination" value={profile?.denomination} />
              <ProfileRow icon={<Heart size={16} />} label="Intention" value={profile?.intention} />
              {profile?.values?.length > 0 && (
                <div className="p-5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Values</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.values.map(v => (
                      <span key={v} className="px-3 py-1 bg-gold-50 text-gold-700 rounded-full text-xs font-bold border border-gold-200">{v}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-5 bg-slate-50 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account</h3>
          </div>
          <div className="divide-y divide-slate-100">
            <button onClick={() => onNavigate('pricing')} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3"><div className="p-2 bg-gold-50 rounded-lg"><Crown className="w-4 h-4 text-gold-600" /></div><span className="text-slate-700 font-medium text-sm">Membership</span></div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3"><div className="p-2 bg-slate-100 rounded-lg"><Shield className="w-4 h-4 text-slate-600" /></div><span className="text-slate-700 font-medium text-sm">Privacy & Security</span></div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="flex flex-col items-center mb-8">
          <button data-testid="end-session-btn" onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600 transition-colors px-6 py-2 rounded-xl hover:bg-red-50 text-sm">
            <LogOut className="w-4 h-4" /> End Session
          </button>
          <p className="text-xs text-slate-400 mt-4 font-medium tracking-tight">Covenant Cloud Build 2.5.0</p>
        </div>
      </div>
    </div>
  );
}

function EditField({ icon, label, value, placeholder, onChange }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">{icon} {label}</label>
      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy-900 focus:bg-white outline-none transition-all"
        placeholder={placeholder} value={value || ''} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function ProfileRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="p-4 flex items-center gap-4">
      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">{icon}</div>
      <div className="flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-medium text-navy-900">{value}</p>
      </div>
      <ArrowRight size={14} className="text-slate-300" />
    </div>
  );
}
