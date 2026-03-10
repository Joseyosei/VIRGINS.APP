import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

const NEARBY_USERS = [
  { id: 1, name: 'Elizabeth', dist: '0.4 mi', age: 24, faith: 'Baptist', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', bio: 'Saving myself for marriage.' },
  { id: 2, name: 'Sarah', dist: '0.7 mi', age: 26, faith: 'Non-Denom', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', bio: 'Love Jesus and coffee.' },
  { id: 3, name: 'Mary', dist: '1.2 mi', age: 23, faith: 'Catholic', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200', bio: 'Traditional Catholic mass attendee.' },
  { id: 4, name: 'Hannah', dist: '1.5 mi', age: 22, faith: 'Baptist', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200', bio: 'Worship leader.' },
  { id: 5, name: 'James', dist: '0.9 mi', age: 27, faith: 'Reformed', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', bio: 'Biblical manhood.' },
];

export default function NearbyScreen() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Detecting...');
  const [ghostMode, setGhostMode] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const [geo] = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
          if (geo) setLocationName(`${geo.city || geo.region || 'Your Area'}${geo.region ? `, ${geo.region}` : ''}`);
          else setLocationName(profile?.location || 'Your Area');
        } else {
          setLocationName(profile?.location || 'Location Unavailable');
        }
      } catch { setLocationName(profile?.location || 'Your Area'); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.slate900 }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '900', color: COLORS.white }}>Nearby</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <Ionicons name="location" size={14} color={COLORS.gold500} />
              <Text style={{ fontSize: 13, color: COLORS.gold400, fontWeight: '700' }}>{locationName}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 3 }}>
            <TouchableOpacity onPress={() => setGhostMode(false)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: !ghostMode ? COLORS.white : 'transparent' }}>
              <Text style={{ fontSize: 10, fontWeight: '900', color: !ghostMode ? COLORS.navy900 : COLORS.slate400, letterSpacing: 1 }}>VISIBLE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGhostMode(true)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: ghostMode ? COLORS.gold500 : 'transparent', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="eye-off" size={12} color={ghostMode ? COLORS.navy900 : COLORS.slate400} />
              <Text style={{ fontSize: 10, fontWeight: '900', color: ghostMode ? COLORS.navy900 : COLORS.slate400, letterSpacing: 1 }}>GHOST</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Radar view */}
      <View style={{ flex: 1, marginHorizontal: 16, borderRadius: 28, backgroundColor: '#0a0a14', overflow: 'hidden', marginBottom: 16 }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.gold500} />
            <Text style={{ color: COLORS.slate400, marginTop: 12, fontWeight: '700', fontSize: 11, letterSpacing: 2 }}>CALIBRATING...</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {/* Center dot - You */}
            <View style={{ position: 'absolute', top: '45%', left: '45%', alignItems: 'center', zIndex: 10 }}>
              <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.blue500, shadowOpacity: 0.5, shadowRadius: 20, elevation: 5 }}>
                <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.blue500 }} />
              </View>
              <View style={{ marginTop: 8, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 }}>
                <Text style={{ fontSize: 9, fontWeight: '900', color: COLORS.navy900, letterSpacing: 1 }}>YOU</Text>
              </View>
            </View>

            {/* Nearby users */}
            {NEARBY_USERS.map((u, i) => {
              const positions = [{ t: '15%', l: '65%' }, { t: '55%', l: '15%' }, { t: '20%', l: '20%' }, { t: '70%', l: '60%' }, { t: '40%', l: '75%' }];
              const pos = positions[i] || positions[0];
              return (
                <TouchableOpacity key={u.id} onPress={() => setSelected(u)}
                  style={{ position: 'absolute', top: pos.t, left: pos.l, alignItems: 'center', zIndex: 5 }}>
                  <View style={{ padding: 3, borderRadius: 30, borderWidth: 2, borderColor: COLORS.gold500, backgroundColor: COLORS.white }}>
                    <Image source={{ uri: u.img }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                    <View style={{ position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.green500, borderWidth: 2, borderColor: COLORS.white }} />
                  </View>
                  <View style={{ marginTop: 4, backgroundColor: 'rgba(26,26,46,0.9)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <Text style={{ fontSize: 9, fontWeight: '800', color: COLORS.white }}>{u.name}, {u.age}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Info cards */}
            <View style={{ position: 'absolute', top: 16, left: 16, gap: 8, zIndex: 10 }}>
              <View style={{ backgroundColor: 'rgba(26,26,46,0.9)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.green500 }} />
                <Text style={{ fontSize: 10, fontWeight: '900', color: COLORS.white, letterSpacing: 1 }}>{NEARBY_USERS.length} NEARBY</Text>
              </View>
              <View style={{ backgroundColor: COLORS.gold500, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="shield-checkmark" size={14} color={COLORS.navy900} />
                <Text style={{ fontSize: 10, fontWeight: '900', color: COLORS.navy900, letterSpacing: 1 }}>SAFE MODE</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Bottom cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}>
        {NEARBY_USERS.map(u => (
          <TouchableOpacity key={u.id} onPress={() => setSelected(u)}
            style={{ width: 200, backgroundColor: 'rgba(26,26,46,0.8)', borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
            <Image source={{ uri: u.img }} style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: COLORS.gold500 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 15 }}>{u.name}, {u.age}</Text>
              <Text style={{ color: COLORS.gold500, fontSize: 10, fontWeight: '700', marginTop: 2 }}>{u.faith}</Text>
              <Text style={{ color: COLORS.slate400, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 2 }}>{u.dist}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* User modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
            {selected && (
              <>
                <Image source={{ uri: selected.img }} style={{ width: '100%', height: 200 }} />
                <TouchableOpacity onPress={() => setSelected(null)} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="close" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <View style={{ padding: 24 }}>
                  <Text style={{ fontSize: 24, fontWeight: '900', color: COLORS.navy900 }}>{selected.name}, {selected.age}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.gold500, marginTop: 4 }}>{selected.faith} • {selected.dist} away</Text>
                  <Text style={{ fontSize: 14, color: COLORS.slate600, marginTop: 12, fontStyle: 'italic', lineHeight: 22 }}>"{selected.bio}"</Text>
                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 20, paddingBottom: 20 }}>
                    <TouchableOpacity style={{ flex: 1, paddingVertical: 16, borderRadius: 14, backgroundColor: COLORS.navy900, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                      <Ionicons name="heart" size={18} color={COLORS.gold500} /><Text style={{ fontWeight: '700', fontSize: 15, color: COLORS.white }}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, paddingVertical: 16, borderRadius: 14, backgroundColor: COLORS.slate100, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                      <Ionicons name="chatbubble-outline" size={16} color={COLORS.navy900} /><Text style={{ fontWeight: '700', fontSize: 15, color: COLORS.navy900 }}>Chat</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
