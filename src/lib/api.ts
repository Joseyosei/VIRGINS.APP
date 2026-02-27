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

// ============ Phase 4 additions ============

// Password reset
export class ApiClientPhase4 {}

// Extend the existing api singleton by adding methods
Object.assign(ApiClient.prototype, {

  forgotPassword(email: string) {
    return (this as any).request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  resetPassword(token: string, password: string) {
    return (this as any).request(`/api/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password })
    });
  },

  // Photo / Video Upload (multipart — bypasses JSON request helper)
  uploadProfilePhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);
    return fetch(`${BASE_URL}/api/users/me/photos`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${(this as any).accessToken}` },
      body: formData
    }).then(r => r.ok ? r.json() : r.json().then((e: any) => { throw new Error(e.message) }));
  },

  deleteProfilePhoto(photoUrl: string) {
    return (this as any).request('/api/users/me/photos', {
      method: 'DELETE',
      body: JSON.stringify({ photoUrl })
    });
  },

  uploadVideoIntro(file: File) {
    const formData = new FormData();
    formData.append('video', file);
    return fetch(`${BASE_URL}/api/users/me/video`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${(this as any).accessToken}` },
      body: formData
    }).then(r => r.ok ? r.json() : r.json().then((e: any) => { throw new Error(e.message) }));
  },

  // Subscription / Stripe
  getSubscriptionPlans() {
    return (this as any).request('/api/subscription/plans');
  },

  createCheckoutSession(priceId: string) {
    return (this as any).request('/api/subscription/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ priceId })
    });
  },

  getSubscriptionStatus() {
    return (this as any).request('/api/subscription/status');
  },

  cancelSubscription() {
    return (this as any).request('/api/subscription/cancel', { method: 'POST' });
  },

  // AI expansion
  generateIcebreaker(matchId: string) {
    return (this as any).request('/api/users/ai/icebreaker', {
      method: 'POST',
      body: JSON.stringify({ matchId })
    });
  },

  getMatchInsights(matchId: string) {
    return (this as any).request(`/api/users/ai/insights/${matchId}`);
  },

  getPhotoFeedback(photoBase64: string) {
    return (this as any).request('/api/users/ai/photo-feedback', {
      method: 'POST',
      body: JSON.stringify({ photoBase64 })
    });
  },

  // Admin
  getAdminUsers(page = 1, search = '') {
    return (this as any).request(`/api/admin/users?page=${page}&search=${encodeURIComponent(search)}`);
  },

  getAdminUser(userId: string) {
    return (this as any).request(`/api/admin/users/${userId}`);
  },

  getAdminStats() {
    return (this as any).request('/api/admin/stats');
  },

  getPendingVerifications() {
    return (this as any).request('/api/admin/verifications/pending');
  },

  approveVerification(userId: string) {
    return (this as any).request(`/api/admin/verifications/${userId}/approve`, { method: 'PUT' });
  },

  rejectVerification(userId: string) {
    return (this as any).request(`/api/admin/verifications/${userId}/reject`, { method: 'PUT' });
  },

  banUser(userId: string) {
    return (this as any).request(`/api/admin/users/${userId}/ban`, { method: 'PUT' });
  },

  unbanUser(userId: string) {
    return (this as any).request(`/api/admin/users/${userId}/unban`, { method: 'PUT' });
  },

  // Notifications
  getNotifications(page = 1) {
    return (this as any).request(`/api/notifications?page=${page}`);
  },

  markNotificationRead(id: string) {
    return (this as any).request(`/api/notifications/${id}/read`, { method: 'PUT' });
  },

  markAllNotificationsRead() {
    return (this as any).request('/api/notifications/read-all', { method: 'PUT' });
  },

  // Push token registration
  registerPushToken(token: string) {
    return (this as any).request('/api/push/register', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  },

  unregisterPushToken() {
    return (this as any).request('/api/push/unregister', { method: 'DELETE' });
  },

  // Onboarding analytics
  trackOnboardingStep(step: number) {
    return (this as any).request('/api/analytics/onboarding-step', {
      method: 'POST',
      body: JSON.stringify({ step })
    }).catch(() => {}); // Silent — never block onboarding
  },

  trackOnboardingComplete() {
    return (this as any).request('/api/analytics/onboarding-complete', {
      method: 'POST'
    }).catch(() => {}); // Silent
  },

  // Phase 6 — Discovery
  getDiscovery(params?: { page?: number; gender?: string; minAge?: number; maxAge?: number }) {
    const qs = new URLSearchParams();
    if (params?.page)    qs.set('page',    String(params.page));
    if (params?.gender)  qs.set('gender',  params.gender);
    if (params?.minAge)  qs.set('minAge',  String(params.minAge));
    if (params?.maxAge)  qs.set('maxAge',  String(params.maxAge));
    return (this as any).request(`/api/discovery?${qs.toString()}`);
  },

  updatePreferences(prefs: object) {
    return (this as any).request('/api/discovery/preferences', {
      method: 'PUT',
      body: JSON.stringify(prefs),
    });
  },

  // Phase 6 — Profile (real backend)
  getMyProfile() {
    return (this as any).request('/api/users/me');
  },

  updateMyProfile(data: object) {
    return (this as any).request('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteMyAccount() {
    return (this as any).request('/api/users/me', { method: 'DELETE' });
  },

  exportMyData() {
    return (this as any).request('/api/users/me/data-export');
  },

  getReferral() {
    return (this as any).request('/api/users/me/referral');
  },

  // Phase 6 — Block / Report
  blockUser(userId: string) {
    return (this as any).request(`/api/users/${userId}/block`, { method: 'POST' });
  },

  unblockUser(userId: string) {
    return (this as any).request(`/api/users/${userId}/block`, { method: 'DELETE' });
  },

  submitReport(data: { reportedId: string; type: string; description?: string; conversationId?: string }) {
    return (this as any).request('/api/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Phase 6 — Dates / We Met
  listDates() {
    return (this as any).request('/api/dates');
  },

  requestDate(data: { matchId: string; stage?: string; category?: string; venue?: string; proposedDate?: string; proposedTime?: string }) {
    return (this as any).request('/api/dates/request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  respondToDate(dateId: string, response: 'accepted' | 'declined') {
    return (this as any).request(`/api/dates/${dateId}/respond`, {
      method: 'PUT',
      body: JSON.stringify({ response }),
    });
  },

  confirmWeMet(dateId: string) {
    return (this as any).request(`/api/dates/${dateId}/we-met`, { method: 'POST' });
  },

  // Phase 7 — Admin Reports
  getAdminReports(page = 1, status = 'pending') {
    return (this as any).request(`/api/admin/reports?page=${page}&status=${status}`);
  },

  resolveReport(reportId: string, action: 'actioned' | 'dismissed', adminNote?: string) {
    return (this as any).request(`/api/admin/reports/${reportId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ action, adminNote }),
    });
  },
});
