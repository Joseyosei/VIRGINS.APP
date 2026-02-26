const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private accessToken: string | null = null;

  setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('virgins_access_token', token);
  }

  clearToken() {
    this.accessToken = null;
    localStorage.removeItem('virgins_access_token');
    localStorage.removeItem('virgins_refresh_token');
  }

  loadToken() {
    const stored = localStorage.getItem('virgins_access_token');
    if (stored) this.accessToken = stored;
    return stored;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || 'Request failed');
    }
    return res.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ accessToken: string; refreshToken: string; user: any }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    );
    this.setToken(data.accessToken);
    localStorage.setItem('virgins_refresh_token', data.refreshToken);
    return data;
  }

  getMe() { return this.request<any>('/api/auth/me'); }

  async logout() {
    await this.request('/api/auth/logout', { method: 'POST' }).catch(() => {});
    this.clearToken();
  }

  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('virgins_refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    const data = await this.request<{ accessToken: string; refreshToken: string }>(
      '/api/auth/refresh-token',
      { method: 'POST', body: JSON.stringify({ refreshToken }) }
    );
    this.setToken(data.accessToken);
    localStorage.setItem('virgins_refresh_token', data.refreshToken);
    return data;
  }

  // Discovery
  getDiscovery(preferences: any) {
    return this.request<any[]>('/api/users/matches', {
      method: 'POST',
      body: JSON.stringify(preferences)
    });
  }

  // Matches
  likeUser(targetId: string) {
    return this.request<any>(`/api/matches/like/${targetId}`, { method: 'POST' });
  }
  passUser(targetId: string) {
    return this.request<any>(`/api/matches/pass/${targetId}`, { method: 'POST' });
  }
  getMatches() { return this.request<any[]>('/api/matches'); }
  unmatch(matchId: string) {
    return this.request<any>(`/api/matches/unmatch/${matchId}`, { method: 'DELETE' });
  }
  whoLikedMe() { return this.request<any[]>('/api/matches/who-liked-me'); }

  // Messages
  getConversations() { return this.request<any[]>('/api/messages/conversations'); }
  getMessages(convId: string, page = 1) {
    return this.request<any[]>(`/api/messages/conversations/${convId}/messages?page=${page}`);
  }
  sendMessage(convId: string, content: string, type = 'text') {
    return this.request<any>(`/api/messages/conversations/${convId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, type })
    });
  }

  // Verification
  signPledge() { return this.request<any>('/api/verify/pledge', { method: 'POST' }); }

  uploadIdDocument(file: File, documentType = 'government_id') {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    return fetch(`${BASE_URL}/api/verify/id-upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.accessToken}` },
      body: formData
    }).then(r => r.json());
  }

  requestReference(referenceEmail: string) {
    return this.request<any>('/api/verify/reference', {
      method: 'POST',
      body: JSON.stringify({ referenceEmail })
    });
  }

  getVerificationStatus() { return this.request<any>('/api/verify/status'); }

  initiateBackgroundCheck() {
    return this.request<any>('/api/verify/background-check', { method: 'POST' });
  }

  // Premium
  activateBoost() { return this.request<any>('/api/premium/boost', { method: 'POST' }); }

  setTravelMode(lat: number, lng: number, city: string) {
    return this.request<any>('/api/premium/travel-mode', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, city })
    });
  }

  getAnalytics() { return this.request<any>('/api/premium/analytics'); }

  // AI features (via existing user routes)
  generateBio(data: any) {
    return this.request<any>('/api/users/generate-bio', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  getDateIdeas(city: string, interests: string) {
    return this.request<any>(`/api/users/date-ideas?city=${encodeURIComponent(city)}&interests=${encodeURIComponent(interests)}`);
  }
}

export const api = new ApiClient();
api.loadToken();
