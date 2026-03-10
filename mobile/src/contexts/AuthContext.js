import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('virgins_auth');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser({ uid: parsed.uid, email: parsed.email, displayName: parsed.name || '' });
          const p = await api.getProfile(parsed.uid);
          if (p) setProfile(p);
        }
      } catch (e) {
        console.error('Auth restore error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signUp = async (name, email, password) => {
    const data = await api.signup(name, email, password);
    const authData = { uid: data.uid, email, name, token: data.token };
    await AsyncStorage.setItem('virgins_auth', JSON.stringify(authData));
    setUser({ uid: data.uid, email, displayName: name });
    if (data.user) setProfile(data.user);
    return data;
  };

  const signIn = async (email, password) => {
    const data = await api.login(email, password);
    const authData = { uid: data.uid, email, name: data.user?.name || '', token: data.token };
    await AsyncStorage.setItem('virgins_auth', JSON.stringify(authData));
    setUser({ uid: data.uid, email, displayName: data.user?.name || '' });
    if (data.user) setProfile(data.user);
    return data;
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('virgins_auth');
    await AsyncStorage.removeItem('virgins_tutorial_seen');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await api.getProfile(user.uid);
    if (p) setProfile(p);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
