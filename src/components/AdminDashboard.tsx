import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Search, Users, ShieldCheck, Clock, Heart, TrendingUp, CheckCircle, XCircle, Ban, UserCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'users' | 'verifications'>('users');
  const [loading, setLoading] = useState(false);

  // Check if current user is admin
  useEffect(() => {
    const check = async () => {
      try {
        const me = await api.getMe() as any;
        if (me?.role === 'admin') {
          setIsAuthenticated(true);
        }
      } catch {
        // Not logged in or not admin
      } finally {
        setCheckingAuth(false);
      }
    };
    check();
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await (api as any).getAdminStats();
      setStats(data);
    } catch (err: any) {
      toast.error('Failed to load stats: ' + err.message);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await (api as any).getAdminUsers(page, searchTerm) as any;
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
    } catch (err: any) {
      toast.error('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  const loadPendingVerifications = useCallback(async () => {
    try {
      const data = await (api as any).getPendingVerifications();
      setPendingVerifications(data || []);
    } catch (err: any) {
      toast.error('Failed to load verifications: ' + err.message);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadUsers();
      loadPendingVerifications();
    }
  }, [isAuthenticated, loadStats, loadUsers, loadPendingVerifications]);

  const handleApprove = async (userId: string) => {
    try {
      await (api as any).approveVerification(userId);
      toast.success('Verification approved');
      loadPendingVerifications();
      loadStats();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await (api as any).rejectVerification(userId);
      toast.success('Verification rejected');
      loadPendingVerifications();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleBan = async (userId: string, ban: boolean) => {
    try {
      if (ban) {
        await (api as any).banUser(userId);
        toast.success('User banned');
      } else {
        await (api as any).unbanUser(userId);
        toast.success('User unbanned');
      }
      loadUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-virgins-gold animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600">
            <Lock className="w-8 h-8 text-virgins-gold" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Admin Access</h2>
          <p className="text-slate-400 mb-6">You must be logged in as an admin to view this page.</p>
          <div className="bg-slate-700 rounded-xl p-4 text-left text-sm text-slate-300">
            <p className="font-mono">Grant admin role via MongoDB:</p>
            <code className="text-virgins-gold text-xs block mt-2">db.users.updateOne({'{'} email: 'you@virgins.app' {'}'}, {'{'} $set: {'{'} role: 'admin' {'}'} {'}'})</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-virgins-purple">Admin Dashboard</h1>
            <p className="text-slate-500">Real-time platform management — VIRGINS.APP</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { loadStats(); loadUsers(); loadPendingVerifications(); }} className="flex items-center gap-2 px-4 py-2 bg-virgins-purple text-white rounded-lg font-medium text-sm hover:bg-virgins-purple/90 transition-colors">
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {[
            { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: <Users className="w-5 h-5 text-virgins-purple" />, color: 'text-virgins-purple' },
            { label: 'Premium Members', value: stats?.premiumUsers ?? '—', icon: <TrendingUp className="w-5 h-5 text-virgins-gold" />, color: 'text-virgins-gold' },
            { label: 'Pending Verifications', value: stats?.pendingVerifications ?? '—', icon: <AlertTriangle className="w-5 h-5 text-amber-500" />, color: 'text-amber-600' },
            { label: 'Matches Today', value: stats?.matchesToday ?? '—', icon: <Heart className="w-5 h-5 text-pink-500" />, color: 'text-pink-600' },
            { label: 'Messages Today', value: stats?.messagesToday ?? '—', icon: <ShieldCheck className="w-5 h-5 text-green-500" />, color: 'text-green-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</h3>
                {stat.icon}
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('users')} className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'users' ? 'bg-virgins-purple text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>Users</button>
          <button onClick={() => setActiveTab('verifications')} className={`px-5 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'verifications' ? 'bg-virgins-purple text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            Verifications
            {pendingVerifications.length > 0 && <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendingVerifications.length}</span>}
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="text-lg font-bold text-slate-900">Platform Users</h3>
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-virgins-purple"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Faith / City</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trust</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {loading ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-virgins-purple" /></td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No users found.</td></tr>
                  ) : users.map((user) => (
                    <tr key={user._id} className={`hover:bg-slate-50 transition-colors ${user.isBanned ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-virgins-purple/20 to-virgins-gold/20 flex items-center justify-center text-virgins-purple font-bold">
                            {user.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{user.faith || 'N/A'}</div>
                        <div className="text-xs text-slate-500">{user.city || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-virgins-purple/10 text-virgins-purple">
                          Level {user.trustLevel || 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.isPremium ? 'bg-virgins-gold/20 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
                          {user.subscriptionTier || 'free'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleBan(user._id, !user.isBanned)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${user.isBanned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                        >
                          {user.isBanned ? <><UserCheck size={12} /> Unban</> : <><Ban size={12} /> Ban</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">Showing {users.length} users (page {page} of {totalPages})</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded text-sm border border-slate-300 disabled:opacity-50 hover:bg-slate-100">Prev</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded text-sm border border-slate-300 disabled:opacity-50 hover:bg-slate-100">Next</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verifications' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Pending ID Verifications</h3>
              <p className="text-sm text-slate-500 mt-1">Review and approve user identity documents</p>
            </div>
            {pendingVerifications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">All clear! No pending verifications.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {pendingVerifications.map((v: any) => (
                  <div key={v._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-virgins-purple/20 to-virgins-gold/20 flex items-center justify-center text-virgins-purple font-bold text-lg">
                        {(v.userId?.name || '?').charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{v.userId?.name || 'Unknown'}</div>
                        <div className="text-sm text-slate-500">{v.userId?.email} · {v.userId?.city}</div>
                        <div className="text-xs text-slate-400 mt-1">Submitted: {new Date(v.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleApprove(v.userId?._id)} className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold text-sm hover:bg-green-200 transition-colors">
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button onClick={() => handleReject(v.userId?._id)} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-sm hover:bg-red-200 transition-colors">
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
