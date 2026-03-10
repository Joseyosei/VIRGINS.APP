import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.slate50 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: COLORS.navy900, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.gold500 }}>V</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.navy900, marginBottom: 8 }}>Welcome Back</Text>
          <Text style={{ fontSize: 15, color: COLORS.slate500 }}>Sign in to continue your courtship journey.</Text>
        </View>

        <View style={{ backgroundColor: COLORS.white, borderRadius: 28, padding: 28, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 3 }}>
          {error ? (
            <View style={{ backgroundColor: '#fef2f2', borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' }}>
              <Text style={{ color: COLORS.red500, fontSize: 13, fontWeight: '600' }}>{error}</Text>
            </View>
          ) : null}

          <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.slate400, letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>Email Address</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.slate50, borderRadius: 16, paddingHorizontal: 16, marginBottom: 16 }}>
            <Ionicons name="mail-outline" size={18} color={COLORS.slate400} />
            <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none"
              style={{ flex: 1, paddingVertical: 16, paddingLeft: 12, fontSize: 15, color: COLORS.slate900 }} />
          </View>

          <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.slate400, letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>Password</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.slate50, borderRadius: 16, paddingHorizontal: 16, marginBottom: 24 }}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.slate400} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry={!showPw}
              style={{ flex: 1, paddingVertical: 16, paddingLeft: 12, fontSize: 15, color: COLORS.slate900 }} />
            <TouchableOpacity onPress={() => setShowPw(!showPw)}><Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.slate400} /></TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleLogin} disabled={loading}
            style={{ backgroundColor: COLORS.navy900, borderRadius: 16, paddingVertical: 16, alignItems: 'center', opacity: loading ? 0.7 : 1 }}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 16 }}>Sign In</Text>}
          </TouchableOpacity>

          <View style={{ marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: COLORS.slate100, alignItems: 'center' }}>
            <Text style={{ color: COLORS.slate500, fontSize: 14 }}>
              Don't have an account?{' '}
              <Text onPress={() => navigation.navigate('Signup')} style={{ fontWeight: '700', color: COLORS.navy900 }}>Join the community</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
