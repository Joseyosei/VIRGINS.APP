import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState('Female');
  const [liked, setLiked] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const [users, sent] = await Promise.all([
        api.discoverUsers(user.uid, gender),
        api.getSentLikes(user.uid),
      ]);
      setResults(users);
      setLiked(new Set(sent));
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, [user, gender]);

  useEffect(() => { load(); }, [load]);

  const handleLike = async (profile) => {
    if (liked.has(profile.firebaseUid)) {
      await api.unlikeUser(user.uid, profile.firebaseUid);
      setLiked(prev => { const n = new Set(prev); n.delete(profile.firebaseUid); return n; });
    } else {
      const res = await api.likeUser(user.uid, profile.firebaseUid);
      setLiked(prev => new Set(prev).add(profile.firebaseUid));
      if (res.matched) Alert.alert("It's a Match!", `You and ${profile.name} liked each other!`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.slate50 }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.slate100 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '900', color: COLORS.navy900 }}>Discover</Text>
            <Text style={{ fontSize: 12, color: COLORS.slate400, marginTop: 2, fontWeight: '600' }}>Powered by Covenant AI</Text>
          </View>
          <TouchableOpacity onPress={() => { setLoading(true); load(); }}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.slate50, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="refresh" size={20} color={COLORS.navy900} />
          </TouchableOpacity>
        </View>
        {/* Gender toggle */}
        <View style={{ flexDirection: 'row', backgroundColor: COLORS.slate100, borderRadius: 12, padding: 3 }}>
          {['Female', 'Male'].map(g => (
            <TouchableOpacity key={g} onPress={() => { setGender(g); setLoading(true); }}
              style={{ flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: gender === g ? COLORS.white : 'transparent' }}>
              <Text style={{ fontWeight: '700', fontSize: 13, color: gender === g ? COLORS.navy900 : COLORS.slate500 }}>{g === 'Female' ? 'Women' : 'Men'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.gold500} />
          <Text style={{ color: COLORS.slate400, marginTop: 12, fontWeight: '700', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>Finding matches...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.gold500} />}>
          {results.map(profile => {
            const isLiked = liked.has(profile.firebaseUid);
            return (
              <View key={profile.firebaseUid} style={{ backgroundColor: COLORS.white, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 5 }, elevation: 3 }}>
                <View style={{ position: 'relative' }}>
                  <Image source={{ uri: profile.profileImage }} style={{ width: '100%', height: 280 }} />
                  {/* Score badge */}
                  <View style={{ position: 'absolute', top: 16, right: 16, backgroundColor: COLORS.white, borderRadius: 14, padding: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 }}>
                    <Text style={{ fontSize: 22, fontWeight: '900', color: COLORS.navy900 }}>{profile.score}%</Text>
                    <Text style={{ fontSize: 8, fontWeight: '800', color: COLORS.gold500, letterSpacing: 1, textTransform: 'uppercase' }}>Covenant</Text>
                  </View>
                  {/* Verified badge */}
                  <View style={{ position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="shield-checkmark" size={14} color={COLORS.green500} />
                    <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.navy900 }}>Verified</Text>
                  </View>
                </View>

                <View style={{ padding: 20 }}>
                  <Text style={{ fontSize: 24, fontWeight: '900', color: COLORS.navy900 }}>{profile.name}, {profile.age}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.gold500, marginTop: 4 }}>{profile.denomination} {profile.faithLevel ? `• ${profile.faithLevel}` : ''}</Text>
                  {profile.bio && <Text style={{ fontSize: 14, color: COLORS.slate600, marginTop: 10, lineHeight: 20, fontStyle: 'italic' }} numberOfLines={3}>"{profile.bio}"</Text>}

                  {/* Reasons */}
                  {profile.reasons?.length > 0 && (
                    <View style={{ marginTop: 12, gap: 6 }}>
                      {profile.reasons.slice(0, 2).map((r, i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.slate50, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                          <Ionicons name="checkmark-circle" size={14} color={COLORS.green500} />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.slate600 }}>{r}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                    <TouchableOpacity onPress={() => handleLike(profile)}
                      style={{ flex: 2, paddingVertical: 16, borderRadius: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, backgroundColor: isLiked ? COLORS.gold500 : COLORS.navy900 }}>
                      <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={18} color={isLiked ? COLORS.navy900 : COLORS.gold500} />
                      <Text style={{ fontWeight: '700', fontSize: 15, color: isLiked ? COLORS.navy900 : COLORS.white }}>{isLiked ? 'Saved' : 'Send a Like'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6, backgroundColor: COLORS.slate50, borderWidth: 1, borderColor: COLORS.slate200 }}>
                      <Ionicons name="chatbubble-outline" size={16} color={COLORS.navy900} />
                      <Text style={{ fontWeight: '700', fontSize: 14, color: COLORS.navy900 }}>Chat</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
          {results.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Ionicons name="search-outline" size={48} color={COLORS.slate300} />
              <Text style={{ color: COLORS.slate400, marginTop: 12, fontSize: 16 }}>No matches found. Try adjusting filters.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
