import { API_URL } from '../constants/theme';

const headers = (uid) => ({
  'Content-Type': 'application/json',
  ...(uid ? { 'x-firebase-uid': uid } : {}),
});

export async function signup(name, email, password) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Signup failed');
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  return data;
}

export async function getProfile(uid) {
  const res = await fetch(`${API_URL}/api/users/me`, { headers: headers(uid) });
  if (!res.ok) return null;
  return res.json();
}

export async function updateProfile(uid, data) {
  const res = await fetch(`${API_URL}/api/users/me`, {
    method: 'PUT',
    headers: headers(uid),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function discoverUsers(uid, gender = 'Female', minAge = 18, maxAge = 50) {
  const res = await fetch(
    `${API_URL}/api/users/discover?gender=${gender}&min_age=${minAge}&max_age=${maxAge}`,
    { headers: headers(uid) }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function likeUser(uid, toUserId) {
  const res = await fetch(`${API_URL}/api/likes`, {
    method: 'POST',
    headers: headers(uid),
    body: JSON.stringify({ toUserId }),
  });
  return res.json();
}

export async function unlikeUser(uid, toUserId) {
  const res = await fetch(`${API_URL}/api/likes/${toUserId}`, {
    method: 'DELETE',
    headers: headers(uid),
  });
  return res.json();
}

export async function getReceivedLikes(uid) {
  const res = await fetch(`${API_URL}/api/likes/received`, { headers: headers(uid) });
  if (!res.ok) return [];
  return res.json();
}

export async function getSentLikes(uid) {
  const res = await fetch(`${API_URL}/api/likes/sent`, { headers: headers(uid) });
  if (!res.ok) return [];
  return res.json();
}

export async function getMatches(uid) {
  const res = await fetch(`${API_URL}/api/matches`, { headers: headers(uid) });
  if (!res.ok) return [];
  return res.json();
}

export async function generateBio(data) {
  const res = await fetch(`${API_URL}/api/ai/generate-bio`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
}
