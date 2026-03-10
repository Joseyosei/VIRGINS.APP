import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

export default function ProfileScreen({ navigation }) {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (profile) setForm({ bio: profile.bio || '', work: profile.work || '', education: profile.education || '', height: profile.height || '', exercise: profile.exercise || '', location: profile.location || '' });
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile(user.uid, form);
      await refreshProfile();
      setEditing(false);
    } catch (e) { Alert.alert('Error', 'Could not save profile.'); }
    finally { setSaving(false); }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await signOut();
      }},
    ]);
  };

  const name = profile?.name || user?.displayName || 'Member';
  const age = profile?.age || '';
  const loc = profile?.location || 'Update location';
  const img = profile?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1A1A2E&color=D4A574&size=200&font-size=0.4&bold=true`;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.slate50 }} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile header */}
      <View style={{ backgroundColor: COLORS.navy900, paddingTop: 60, paddingBottom: 30, alignItems: 'center', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
        <View style={{ position: 'relative', marginBottom: 12 }}>
          <Image source={{ uri: img }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: COLORS.gold500 }} />
          <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.gold500, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="pencil" size={16} color={COLORS.navy900} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.white }}>{name}{age ? `, ${age}` : ''}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <Ionicons name="location-outline" size={14} color={COLORS.slate400} />
          <Text style={{ color: COLORS.slate400, fontSize: 13 }}>{loc}</Text>
        </View>
        {profile?.denomination && (
          <View style={{ marginTop: 10, backgroundColor: 'rgba(212,165,116,0.2)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 }}>
            <Text style={{ color: COLORS.gold400, fontSize: 12, fontWeight: '700' }}>{profile.denomination} {profile.faithLevel ? `• ${profile.faithLevel}` : ''}</Text>
          </View>
        )}
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        {/* Profile details card */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 20, overflow: 'hidden', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.slate100, backgroundColor: COLORS.slate50 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.slate500, letterSpacing: 1, textTransform: 'uppercase' }}>{editing ? 'Edit Profile' : 'Profile Details'}</Text>
            {!editing ? (
              <TouchableOpacity onPress={() => setEditing(true)} style={{ backgroundColor: COLORS.gold50, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.gold500 }}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={() => setEditing(false)} style={{ backgroundColor: COLORS.slate100, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.slate500 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} disabled={saving} style={{ backgroundColor: COLORS.navy900, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                  {saving ? <ActivityIndicator size="small" color={COLORS.white} /> : <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.white }}>Save</Text>}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {editing ? (
            <View style={{ padding: 16, gap: 12 }}>
              <View><Text style={editLabel}>Bio</Text><TextInput value={form.bio} onChangeText={v => setForm({ ...form, bio: v })} multiline maxLength={500} placeholder="A little about you..." style={[editInput, { height: 100, textAlignVertical: 'top' }]} /></View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}><Text style={editLabel}>Work</Text><TextInput value={form.work} onChangeText={v => setForm({ ...form, work: v })} placeholder="Add" style={editInput} /></View>
                <View style={{ flex: 1 }}><Text style={editLabel}>Education</Text><TextInput value={form.education} onChangeText={v => setForm({ ...form, education: v })} placeholder="Add" style={editInput} /></View>
              </View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}><Text style={editLabel}>Height</Text><TextInput value={form.height} onChangeText={v => setForm({ ...form, height: v })} placeholder="Add" style={editInput} /></View>
                <View style={{ flex: 1 }}><Text style={editLabel}>Exercise</Text><TextInput value={form.exercise} onChangeText={v => setForm({ ...form, exercise: v })} placeholder="Add" style={editInput} /></View>
              </View>
              <View><Text style={editLabel}>Location</Text><TextInput value={form.location} onChangeText={v => setForm({ ...form, location: v })} placeholder="Add" style={editInput} /></View>
            </View>
          ) : (
            <View>
              {profile?.bio && <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.slate100 }}><Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.slate400, letterSpacing: 1, marginBottom: 6 }}>BIO</Text><Text style={{ color: COLORS.slate700, fontSize: 14, fontStyle: 'italic', lineHeight: 22 }}>"{profile.bio}"</Text></View>}
              <InfoRow icon="briefcase-outline" label="Work" value={profile?.work} />
              <InfoRow icon="school-outline" label="Education" value={profile?.education} />
              <InfoRow icon="resize-outline" label="Height" value={profile?.height} />
              <InfoRow icon="barbell-outline" label="Exercise" value={profile?.exercise} />
              <InfoRow icon="heart-outline" label="Intention" value={profile?.intention} />
              {profile?.values?.length > 0 && (
                <View style={{ padding: 16 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.slate400, letterSpacing: 1, marginBottom: 8 }}>VALUES</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {profile.values.map(v => (
                      <View key={v} style={{ backgroundColor: COLORS.gold50, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: COLORS.gold300 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.gold500 }}>{v}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Account */}
        <View style={{ backgroundColor: COLORS.white, borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
          <AccBtn icon="diamond-outline" label="Membership" />
          <AccBtn icon="shield-checkmark-outline" label="Privacy & Security" />
          <AccBtn icon="settings-outline" label="Settings" />
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={{ alignItems: 'center', paddingVertical: 16, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.red500} />
          <Text style={{ color: COLORS.red500, fontWeight: '700', fontSize: 15 }}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', color: COLORS.slate400, fontSize: 11, marginTop: 8, fontWeight: '500' }}>Covenant Cloud Build 2.5.0</Text>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.slate100, gap: 12 }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.slate100, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name={icon} size={18} color={COLORS.slate500} />
      </View>
      <View style={{ flex: 1 }}><Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.slate400, letterSpacing: 1 }}>{label.toUpperCase()}</Text><Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.navy900, marginTop: 2 }}>{value}</Text></View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.slate300} />
    </View>
  );
}

function AccBtn({ icon, label }) {
  return (
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.slate100, gap: 12 }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.slate100, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name={icon} size={18} color={COLORS.slate600} />
      </View>
      <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.slate700 }}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.slate300} />
    </TouchableOpacity>
  );
}

const editLabel = { fontSize: 11, fontWeight: '800', color: COLORS.slate400, letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' };
const editInput = { backgroundColor: COLORS.slate50, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, fontSize: 14, borderWidth: 1, borderColor: COLORS.slate200 };
