import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, DENOMINATIONS, VALUES_OPTIONS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

const TOTAL = 7;

export default function OnboardingScreen({ navigation }) {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    gender: '', age: '', location: '', denomination: '', faithLevel: '',
    intention: '', values: [], bio: '', work: '', education: '', height: '', exercise: '',
  });

  const next = () => setStep(s => Math.min(s + 1, TOTAL));
  const back = () => setStep(s => Math.max(s - 1, 1));
  const toggleValue = (v) => setForm(f => ({ ...f, values: f.values.includes(v) ? f.values.filter(x => x !== v) : f.values.length < 5 ? [...f.values, v] : f.values }));

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api.updateProfile(user.uid, { ...form, age: parseInt(form.age) || 0, status: 'verified', onboardingComplete: true });
      await refreshProfile();
      navigation.reset({ index: 0, routes: [{ name: 'Tutorial' }] });
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const canContinue = step === 1 ? !!form.gender : step === 2 ? !!form.age : step === 3 ? !!form.denomination : step === 4 ? !!form.intention : true;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* Progress bar */}
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {step > 1 && <TouchableOpacity onPress={back}><Ionicons name="arrow-back" size={22} color={COLORS.slate400} /></TouchableOpacity>}
        <View style={{ flex: 1, height: 4, backgroundColor: COLORS.slate100, borderRadius: 2, overflow: 'hidden' }}>
          <View style={{ width: `${(step / TOTAL) * 100}%`, height: '100%', backgroundColor: COLORS.navy900, borderRadius: 2 }} />
        </View>
        <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.slate400, letterSpacing: 2 }}>{step}/{TOTAL}</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 120 }}>
        {step === 1 && (
          <StepView title="I am a..." subtitle="Select your gender.">
            {['Man', 'Woman'].map(g => {
              const val = g === 'Man' ? 'Male' : 'Female';
              const sel = form.gender === val;
              return (
                <TouchableOpacity key={g} onPress={() => setForm({ ...form, gender: val })}
                  style={{ paddingVertical: 20, paddingHorizontal: 20, borderRadius: 16, marginBottom: 12, backgroundColor: sel ? COLORS.gold500 : COLORS.slate50, borderWidth: 1, borderColor: sel ? COLORS.gold500 : COLORS.slate200, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: sel ? COLORS.navy900 : COLORS.slate700 }}>{g}</Text>
                  {sel && <Ionicons name="checkmark" size={20} color={COLORS.navy900} />}
                </TouchableOpacity>
              );
            })}
          </StepView>
        )}
        {step === 2 && (
          <StepView title="Tell us about yourself" subtitle="Basic details to get started.">
            <Label text="Your Age" />
            <TextInput value={form.age} onChangeText={v => setForm({ ...form, age: v })} placeholder="How old are you?" keyboardType="number-pad" style={inputStyle} />
            <Label text="Your Location" />
            <View style={{ flexDirection: 'row', alignItems: 'center', ...inputContainerStyle }}>
              <Ionicons name="location-outline" size={18} color={COLORS.slate400} style={{ marginRight: 8 }} />
              <TextInput value={form.location} onChangeText={v => setForm({ ...form, location: v })} placeholder="e.g. Austin, TX" style={{ flex: 1, fontSize: 16, color: COLORS.slate900, paddingVertical: 16 }} />
            </View>
          </StepView>
        )}
        {step === 3 && (
          <StepView title="Your faith journey" subtitle="Help us understand your spiritual walk.">
            <Label text="Denomination" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {DENOMINATIONS.map(d => (
                <TouchableOpacity key={d} onPress={() => setForm({ ...form, denomination: d })}
                  style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: form.denomination === d ? COLORS.navy900 : COLORS.slate50, borderWidth: 1, borderColor: form.denomination === d ? COLORS.navy900 : COLORS.slate200 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: form.denomination === d ? COLORS.white : COLORS.slate600 }}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Label text="Faith Level" style={{ marginTop: 20 }} />
            {[{ v: 'Very Serious', d: 'Faith is the foundation of my life' }, { v: 'Practicing', d: 'I attend regularly' }, { v: 'Cultural', d: 'Faith is part of my heritage' }, { v: 'Exploring', d: 'On a spiritual journey' }].map(l => (
              <TouchableOpacity key={l.v} onPress={() => setForm({ ...form, faithLevel: l.v })}
                style={{ padding: 16, borderRadius: 14, marginBottom: 8, backgroundColor: form.faithLevel === l.v ? COLORS.gold50 : COLORS.slate50, borderWidth: form.faithLevel === l.v ? 2 : 1, borderColor: form.faithLevel === l.v ? COLORS.gold500 : COLORS.slate200, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View><Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.navy900 }}>{l.v}</Text><Text style={{ fontSize: 11, color: COLORS.slate400, marginTop: 2 }}>{l.d}</Text></View>
                {form.faithLevel === l.v && <Ionicons name="checkmark-circle" size={20} color={COLORS.gold500} />}
              </TouchableOpacity>
            ))}
          </StepView>
        )}
        {step === 4 && (
          <StepView title="What are you looking for?" subtitle="Be honest about your intentions.">
            {[{ v: 'Marriage ASAP', d: 'Ready to find my spouse now', badge: 'Most Intentional' }, { v: 'Marriage in 1-2 years', d: 'Building toward marriage' }, { v: 'Dating to Marry', d: 'Serious relationship' }, { v: 'Unsure', d: 'Exploring options' }].map(opt => (
              <TouchableOpacity key={opt.v} onPress={() => setForm({ ...form, intention: opt.v })}
                style={{ paddingVertical: 18, paddingHorizontal: 20, borderRadius: 16, marginBottom: 10, backgroundColor: form.intention === opt.v ? COLORS.navy900 : COLORS.slate50, borderWidth: 1, borderColor: form.intention === opt.v ? COLORS.navy900 : COLORS.slate200 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View><Text style={{ fontSize: 15, fontWeight: '700', color: form.intention === opt.v ? COLORS.white : COLORS.slate700 }}>{opt.v}</Text><Text style={{ fontSize: 11, color: form.intention === opt.v ? COLORS.slate300 : COLORS.slate400, marginTop: 2 }}>{opt.d}</Text></View>
                  {opt.badge && <View style={{ backgroundColor: form.intention === opt.v ? COLORS.gold500 : COLORS.gold100, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 }}><Text style={{ fontSize: 8, fontWeight: '900', color: form.intention === opt.v ? COLORS.navy900 : COLORS.gold500, letterSpacing: 1 }}>{opt.badge.toUpperCase()}</Text></View>}
                </View>
              </TouchableOpacity>
            ))}
          </StepView>
        )}
        {step === 5 && (
          <StepView title="What do you value most?" subtitle={`Select up to 5 (${form.values.length}/5)`}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {VALUES_OPTIONS.map(v => {
                const sel = form.values.includes(v);
                return (
                  <TouchableOpacity key={v} onPress={() => toggleValue(v)}
                    style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: sel ? COLORS.navy900 : COLORS.slate50, borderWidth: 1, borderColor: sel ? COLORS.navy900 : COLORS.slate200, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    {sel && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
                    <Text style={{ fontSize: 13, fontWeight: '700', color: sel ? COLORS.white : COLORS.slate600 }}>{v}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </StepView>
        )}
        {step === 6 && (
          <StepView title="Write your story" subtitle="A punchy intro that shows the real you.">
            <Label text="Bio" />
            <TextInput value={form.bio} onChangeText={v => setForm({ ...form, bio: v })} placeholder="Write something fun..." multiline numberOfLines={4} maxLength={500}
              style={{ ...inputStyle, height: 120, textAlignVertical: 'top' }} />
            <Text style={{ fontSize: 11, color: COLORS.slate400, textAlign: 'right', marginBottom: 12 }}>{form.bio.length}/500</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}><Label text="Work" /><TextInput value={form.work} onChangeText={v => setForm({ ...form, work: v })} placeholder="Add" style={inputStyle} /></View>
              <View style={{ flex: 1 }}><Label text="Education" /><TextInput value={form.education} onChangeText={v => setForm({ ...form, education: v })} placeholder="Add" style={inputStyle} /></View>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}><Label text="Height" /><TextInput value={form.height} onChangeText={v => setForm({ ...form, height: v })} placeholder={`5'10"`} style={inputStyle} /></View>
              <View style={{ flex: 1 }}><Label text="Exercise" /><TextInput value={form.exercise} onChangeText={v => setForm({ ...form, exercise: v })} placeholder="Active" style={inputStyle} /></View>
            </View>
          </StepView>
        )}
        {step === 7 && (
          <View style={{ paddingTop: 40, alignItems: 'center' }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.gold100, justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
              <Ionicons name="checkmark" size={40} color={COLORS.gold500} />
            </View>
            <Text style={{ fontSize: 32, fontWeight: '900', color: COLORS.navy900, marginBottom: 12 }}>You're all set!</Text>
            <Text style={{ fontSize: 16, color: COLORS.slate500, textAlign: 'center', maxWidth: 280, lineHeight: 24 }}>Your profile is ready. Time to discover your covenant match.</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16, backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <TouchableOpacity onPress={step === TOTAL ? finish : next} disabled={!canContinue || saving}
          style={{ backgroundColor: COLORS.navy900, borderRadius: 16, paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: canContinue ? 1 : 0.3 }}>
          {saving ? <ActivityIndicator color={COLORS.white} /> : (
            <><Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 17 }}>{step === TOTAL ? 'Start Matching' : 'Continue'}</Text><Ionicons name="arrow-forward" size={18} color={COLORS.white} /></>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StepView({ title, subtitle, children }) {
  return (
    <View style={{ paddingTop: 32 }}>
      <Text style={{ fontSize: 28, fontWeight: '900', color: COLORS.navy900, marginBottom: 8 }}>{title}</Text>
      {subtitle && <Text style={{ fontSize: 14, color: COLORS.slate500, marginBottom: 24, lineHeight: 20 }}>{subtitle}</Text>}
      {children}
    </View>
  );
}

function Label({ text, style }) {
  return <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.slate500, marginBottom: 8, ...style }}>{text}</Text>;
}

const inputStyle = { backgroundColor: COLORS.slate50, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16, color: COLORS.slate900, borderWidth: 1, borderColor: COLORS.slate200, marginBottom: 12 };
const inputContainerStyle = { backgroundColor: COLORS.slate50, borderRadius: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.slate200, marginBottom: 12 };
