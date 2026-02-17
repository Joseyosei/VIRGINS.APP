import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

const API = process.env.REACT_APP_BACKEND_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('virgins_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser({ uid: parsed.uid, email: parsed.email, displayName: parsed.name || '' });
        fetchProfile(parsed.uid).then(p => { if (p) setProfile(p); });
      } catch (e) {
        localStorage.removeItem('virgins_auth');
      }
    }
    setLoading(false);
  }, []);

  const fetchProfile = async (uid) => {
    try {
      const res = await fetch(`${API}/api/users/me`, {
        headers: { 'x-firebase-uid': uid },
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch profile:', e);
    }
    return null;
  };

  const signup = async (name, email, password) => {
    const res = await fetch(`${API}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Signup failed');

    const authData = { uid: data.uid, email, name, token: data.token };
    localStorage.setItem('virgins_auth', JSON.stringify(authData));
    setUser({ uid: data.uid, email, displayName: name });
    if (data.user) setProfile(data.user);
    return data;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed');

    const authData = { uid: data.uid, email, name: data.user?.name || '', token: data.token };
    localStorage.setItem('virgins_auth', JSON.stringify(authData));
    setUser({ uid: data.uid, email, displayName: data.user?.name || '' });
    if (data.user) setProfile(data.user);
    return data;
  };

  const logout = async () => {
    localStorage.removeItem('virgins_auth');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.uid);
    if (p) setProfile(p);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signup, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
