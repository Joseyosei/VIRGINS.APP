import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

const STEPS = [
  { icon: 'compass-outline', title: 'Discover Your Match', desc: 'Our Covenant Algorithm finds people who share your faith, values, and marriage intentions.', color: COLORS.gold500 },
  { icon: 'heart-outline', title: 'See Who Likes You', desc: "Other apps charge $30/month for this. On Virgins, it's always FREE.", color: '#fb7185', badge: 'FREE' },
  { icon: 'location-outline', title: 'Find Nearby Members', desc: 'See verified singles in your area in real-time. Enable location to discover who shares your community.', color: COLORS.blue500 },
  { icon: 'calendar-outline', title: 'Plan & Get Off The App', desc: 'We want you to meet in real life! Use our Date Planner to pick a venue and take things offline.', color: '#34d399' },
  { icon: 'shield-checkmark-outline', title: 'Safe & Verified', desc: 'Every profile is reviewed. Zero tolerance for harassment. Your privacy is always protected.', color: COLORS.gold500 },
];

export default function TutorialScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await AsyncStorage.setItem('virgins_tutorial_seen', 'true');
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('virgins_tutorial_seen', 'true');
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.navy900 }}>
      {/* Skip */}
      <TouchableOpacity onPress={handleSkip} style={{ position: 'absolute', top: 56, right: 24, zIndex: 10 }}>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '700' }}>Skip</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
          <Ionicons name={current.icon} size={48} color={current.color} />
          {current.badge && (
            <View style={{ position: 'absolute', top: -8, right: -16, backgroundColor: COLORS.green500, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ color: COLORS.white, fontSize: 9, fontWeight: '900', letterSpacing: 1 }}>{current.badge}</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 30, fontWeight: '900', color: COLORS.white, textAlign: 'center', marginBottom: 16, lineHeight: 36 }}>{current.title}</Text>
        <Text style={{ fontSize: 15, color: COLORS.slate400, textAlign: 'center', lineHeight: 24, maxWidth: 320 }}>{current.desc}</Text>
      </View>

      {/* Bottom */}
      <View style={{ paddingHorizontal: 32, paddingBottom: 50 }}>
        {/* Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 28 }}>
          {STEPS.map((_, i) => (
            <View key={i} style={{ height: 5, borderRadius: 3, backgroundColor: i === step ? COLORS.gold500 : i < step ? 'rgba(212,165,116,0.4)' : 'rgba(255,255,255,0.08)', width: i === step ? 28 : 14, transition: 'width 0.3s' }} />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext}
          style={{ backgroundColor: COLORS.gold500, borderRadius: 16, paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          <Text style={{ color: COLORS.navy900, fontWeight: '700', fontSize: 17 }}>{isLast ? 'Start Discovering' : 'Continue'}</Text>
          <Ionicons name={isLast ? 'sparkles' : 'arrow-forward'} size={18} color={COLORS.navy900} />
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 10, fontWeight: '700', letterSpacing: 2, marginTop: 16 }}>{step + 1} OF {STEPS.length}</Text>
      </View>
    </View>
  );
}
