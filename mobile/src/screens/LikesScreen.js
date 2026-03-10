import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

export default function LikesScreen() {
  const { user } = useAuth();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const data = await api.getReceivedLikes(user.uid);
      setLikes(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleLikeBack = async (liker) => {
    setActionLoading(liker.firebaseUid);
    try {
      const res = await api.likeUser(user.uid, liker.firebaseUid);
      if (res.matched) Alert.alert("It's a Match!", `You and ${liker.name} liked each other!`);
      setLikes(prev => prev.filter(l => l.firebaseUid !== liker.firebaseUid));
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const handlePass = (uid) => setLikes(prev => prev.filter(l => l.firebaseUid !== uid));

  const renderItem = ({ item }) => (
    <View style={{ flex: 1, margin: 6, backgroundColor: COLORS.white, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}>
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: item.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' }} style={{ width: '100%', height: 180 }} />
        <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: COLORS.gold500, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
          <Text style={{ fontSize: 9, fontWeight: '900', color: COLORS.navy900, letterSpacing: 1, textTransform: 'uppercase' }}>Likes You</Text>
        </View>
      </View>
      <View style={{ padding: 14 }}>
        <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.navy900 }}>{item.name}, {item.age}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <Ionicons name="location-outline" size={12} color={COLORS.slate400} />
          <Text style={{ fontSize: 12, color: COLORS.slate500 }}>{item.location || 'Somewhere beautiful'}</Text>
        </View>
        {item.bio && <Text style={{ fontSize: 12, color: COLORS.slate600, marginTop: 8, fontStyle: 'italic' }} numberOfLines={2}>"{item.bio}"</Text>}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <TouchableOpacity onPress={() => handleLikeBack(item)} disabled={actionLoading === item.firebaseUid}
            style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.navy900, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
            {actionLoading === item.firebaseUid ? <ActivityIndicator size="small" color={COLORS.white} /> : (
              <><Ionicons name="heart" size={14} color={COLORS.gold500} /><Text style={{ fontWeight: '700', fontSize: 13, color: COLORS.white }}>Like Back</Text></>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePass(item.firebaseUid)}
            style={{ paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, backgroundColor: COLORS.slate100 }}>
            <Ionicons name="close" size={16} color={COLORS.slate500} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.slate50 }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.slate100 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <View style={{ backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="sparkles" size={12} color={COLORS.green500} />
            <Text style={{ fontSize: 9, fontWeight: '900', color: '#15803d', letterSpacing: 1 }}>FREE ON VIRGINS</Text>
          </View>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '900', color: COLORS.navy900 }}>Who <Text style={{ fontStyle: 'italic', color: COLORS.gold500 }}>Likes</Text> You</Text>
        <Text style={{ fontSize: 13, color: COLORS.slate500, marginTop: 4 }}>Other apps charge $30/month for this.</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={COLORS.gold500} /></View>
      ) : likes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.slate100, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            <Ionicons name="heart-outline" size={36} color={COLORS.slate300} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.navy900, marginBottom: 8 }}>No likes yet</Text>
          <Text style={{ fontSize: 14, color: COLORS.slate500, textAlign: 'center', lineHeight: 22 }}>Keep updating your profile and stay active!</Text>
        </View>
      ) : (
        <FlatList data={likes} renderItem={renderItem} keyExtractor={item => item.firebaseUid} numColumns={2}
          contentContainerStyle={{ padding: 10 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={COLORS.gold500} />} />
      )}
    </View>
  );
}
