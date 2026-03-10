import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

export default function SignupScreen({ navigation }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email) { setError('Please enter your email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      await signUp(name, email, password);
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.white }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, paddingTop: 60 }}>
        <View style={{ marginBottom: 32 }}>
          <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.navy900, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.gold500 }}>V</Text>
          </View>
          <Text style={{ fontSize: 32, fontWeight: '800', color: COLORS.navy900, marginBottom: 8 }}>Join Virgins</Text>
          <Text style={{ fontSize: 15, color: COLORS.slate500, lineHeight: 22 }}>Create an account to begin your journey to a lifelong covenant.</Text>
        </View>

        {error ? (
          <View style={{ backgroundColor: '#fef2f2', borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' }}>
            <Text style={{ color: COLORS.red500, fontSize: 13, fontWeight: '600' }}>{error}</Text>
          </View>
        ) : null}

        <Text style={labelStyle}>Full Name</Text>
        <View style={inputRow}>
          <Ionicons name="person-outline" size={18} color={COLORS.slate400} />
          <TextInput value={name} onChangeText={setName} placeholder="John Doe" style={inputStyle} />
        </View>

        <Text style={labelStyle}>Email Address</Text>
        <View style={inputRow}>
          <Ionicons name="mail-outline" size={18} color={COLORS.slate400} />
          <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" style={inputStyle} />
        </View>

        <Text style={labelStyle}>Create Password</Text>
        <View style={inputRow}>
          <Ionicons name="lock-closed-outline" size={18} color={COLORS.slate400} />
          <TextInput value={password} onChangeText={setPassword} placeholder="Min. 6 characters" secureTextEntry={!showPw} style={inputStyle} />
          <TouchableOpacity onPress={() => setShowPw(!showPw)}><Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.slate400} /></TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSignup} disabled={loading}
          style={{ backgroundColor: COLORS.navy900, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8, flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : (
            <><Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 16 }}>Continue Registration</Text><Ionicons name="arrow-forward" size={18} color={COLORS.white} /></>
          )}
        </TouchableOpacity>

        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text style={{ color: COLORS.slate500, fontSize: 14 }}>
            Already a member?{' '}
            <Text onPress={() => navigation.navigate('Login')} style={{ fontWeight: '700', color: COLORS.navy900 }}>Sign in here</Text>
          </Text>
        </View>

        <Text style={{ fontSize: 10, color: COLORS.slate400, textAlign: 'center', marginTop: 32, lineHeight: 16 }}>
          By joining, you agree to our Terms of Service and Privacy Policy, and commit to upholding our community guidelines.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const labelStyle = { fontSize: 10, fontWeight: '800', color: COLORS.slate400, letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' };
const inputRow = { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.slate50, borderRadius: 16, paddingHorizontal: 16, marginBottom: 16 };
const inputStyle = { flex: 1, paddingVertical: 16, paddingLeft: 12, fontSize: 15, color: COLORS.slate900 };
