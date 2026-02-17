import React, { useState, useEffect } from 'react';
import { Users, Heart, BarChart3, Shield, Settings, Activity, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/api/admin/stats`);
      if (res.ok) setStats(await res.json());
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-slate-900 pt-32 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Overview of the Virgins community.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-bold">System Operational</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: <Users className="w-6 h-6 text-blue-400" />, label: 'Total Users', value: stats?.totalUsers || 0, color: 'bg-blue-500/10 border-blue-500/20' },
            { icon: <Heart className="w-6 h-6 text-red-400" />, label: 'Total Likes', value: stats?.totalLikes || 0, color: 'bg-red-500/10 border-red-500/20' },
            { icon: <CheckCircle className="w-6 h-6 text-green-400" />, label: 'Total Matches', value: stats?.totalMatches || 0, color: 'bg-green-500/10 border-green-500/20' },
          ].map((stat, i) => (
            <div key={i} className={`rounded-2xl border p-6 ${stat.color}`}>
              <div className="flex items-center gap-3 mb-4">{stat.icon}<span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span></div>
              <div className="text-4xl font-black text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
