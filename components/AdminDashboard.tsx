import React, { useState, useEffect } from 'react';
import { Lock, Search, Users, Download, ShieldCheck, Clock, UserCheck, Heart } from 'lucide-react';
import { WaitlistUser } from '../types';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load users from localStorage on mount
  useEffect(() => {
    if (isAuthenticated) {
      const storedUsers = localStorage.getItem('virgins_waitlist_data');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        // Add some mock data if empty for demonstration
        setUsers([
          { 
            id: '1', 
            name: 'Demo User', 
            email: 'demo@virgins.app', 
            gender: 'Man', 
            age: '28', 
            faith: 'Catholic', 
            city: 'Austin, TX', 
            joinedAt: new Date().toISOString(), 
            status: 'verified' 
          }
        ]);
      }
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'virgins2024') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.faith && user.faith.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: users.length,
    men: users.filter(u => u.gender === 'Man').length,
    women: users.filter(u => u.gender === 'Woman').length,
    verified: users.filter(u => u.status === 'verified').length
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-600">
              <Lock className="w-8 h-8 text-gold-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Admin Access</h2>
            <p className="text-slate-400 mt-2">Enter your credentials to view user data.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-bold py-3 rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:-translate-y-0.5"
            >
              Access Dashboard
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-xs">Protected Area • Authorized Personnel Only</p>
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
            <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage waitlist and user signups.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Signups</h3>
              <Users className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.total.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Count
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Verified</h3>
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.verified.toLocaleString()}</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(stats.verified / stats.total) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Men</h3>
              <UserCheck className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.men.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-2">{Math.round((stats.men / stats.total) * 100)}% of userbase</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Women</h3>
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.women.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-2">{Math.round((stats.women / stats.total) * 100)}% of userbase</p>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-bold text-slate-900">Waitlist Users</h3>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name & ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Demographics</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Faith / Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-gold-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500">ID: {user.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 font-medium">{user.gender}</div>
                        <div className="text-xs text-slate-500">Age: {user.age || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-slate-900">{user.faith || 'N/A'}</div>
                         <div className="text-xs text-slate-500">{user.city}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">Showing {filteredUsers.length} of {stats.total} users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;