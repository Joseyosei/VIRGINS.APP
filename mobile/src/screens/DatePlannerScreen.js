import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const VENUES = [
  { name: 'Grace Fellowship Cafe', dist: '0.8 mi', rating: 4.9, img: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=400&q=80', type: 'Cafe' },
  { name: 'Covenant Garden Park', dist: '1.2 mi', rating: 4.7, img: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=400&q=80', type: 'Park' },
  { name: 'The Bethany Bistro', dist: '1.5 mi', rating: 4.8, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', type: 'Restaurant' },
];

export default function DatePlannerScreen() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.slate50 }}>
      <View style={{ paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.slate100 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Ionicons name="sparkles" size={16} color={COLORS.gold500} />
          <Text style={{ fontSize: 10, fontWeight: '900', color: COLORS.gold500, letterSpacing: 2 }}>COURTSHIP PLANNING</Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '900', color: COLORS.navy900 }}>Plan Your Date</Text>
        <Text style={{ fontSize: 13, color: COLORS.slate500, marginTop: 4 }}>Get off the app. Meet in real life.</Text>
      </View>

      {/* Steps indicator */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 8 }}>
        {[1, 2, 3].map(s => (
          <React.Fragment key={s}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: step >= s ? COLORS.navy900 : COLORS.slate200, justifyContent: 'center', alignItems: 'center' }}>
              {step > s ? <Ionicons name="checkmark" size={18} color={COLORS.gold500} /> : <Text style={{ fontWeight: '800', color: step >= s ? COLORS.gold500 : COLORS.slate500, fontSize: 14 }}>{s}</Text>}
            </View>
            {s < 3 && <View style={{ width: 40, height: 3, borderRadius: 2, backgroundColor: step > s ? COLORS.navy900 : COLORS.slate200 }} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
        <View style={{ backgroundColor: COLORS.white, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, elevation: 3 }}>
          {step === 1 && (
            <View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.navy900, marginBottom: 16 }}>When?</Text>
              <TextInput value={date} onChangeText={setDate} placeholder="Enter a date (e.g. March 15)"
                style={{ backgroundColor: COLORS.slate50, borderRadius: 14, padding: 16, fontSize: 16, borderWidth: 1, borderColor: COLORS.slate200, marginBottom: 20 }} />
              <TouchableOpacity onPress={() => setStep(2)} disabled={!date}
                style={{ backgroundColor: COLORS.navy900, borderRadius: 14, paddingVertical: 16, alignItems: 'center', opacity: date ? 1 : 0.3, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 16 }}>Next</Text><Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
          {step === 2 && (
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.navy900 }}>Where?</Text>
                <TouchableOpacity onPress={() => setStep(1)}><Text style={{ color: COLORS.slate500, fontWeight: '700', fontSize: 13 }}>Back</Text></TouchableOpacity>
              </View>
              {VENUES.map(v => (
                <TouchableOpacity key={v.name} onPress={() => setVenue(v)}
                  style={{ marginBottom: 12, borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: venue?.name === v.name ? COLORS.gold500 : 'transparent' }}>
                  <Image source={{ uri: v.img }} style={{ width: '100%', height: 120 }} />
                  <View style={{ padding: 12 }}>
                    <Text style={{ fontWeight: '700', color: COLORS.navy900 }}>{v.name}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.slate500, marginTop: 2 }}>{v.type} • {v.dist}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setStep(3)} disabled={!venue}
                style={{ backgroundColor: COLORS.navy900, borderRadius: 14, paddingVertical: 16, alignItems: 'center', opacity: venue ? 1 : 0.3, flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 4 }}>
                <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 16 }}>Confirm</Text><Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
          {step === 3 && (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                <Ionicons name="checkmark" size={32} color={COLORS.green500} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '900', color: COLORS.navy900, marginBottom: 8 }}>Date Planned!</Text>
              <Text style={{ fontSize: 14, color: COLORS.slate500, textAlign: 'center', lineHeight: 22 }}>
                Your courtship date at <Text style={{ fontWeight: '700', color: COLORS.navy900 }}>{venue?.name}</Text> on <Text style={{ fontWeight: '700', color: COLORS.navy900 }}>{date}</Text> is confirmed.
              </Text>
              <TouchableOpacity onPress={() => { setStep(1); setVenue(null); setDate(''); }}
                style={{ marginTop: 24, backgroundColor: COLORS.slate100, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24 }}>
                <Text style={{ fontWeight: '700', color: COLORS.navy900 }}>Plan Another</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
