
import React, { useState, useEffect } from 'react';
import { User, UserRole, SubscriptionStatus } from '../types';
import { getAllUsers, updateUserInStore } from '../services/mockBackend';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  const toggleFreeze = (user: User) => {
    const updated = { ...user, isFrozenByAdmin: !user.isFrozenByAdmin };
    updateUserInStore(updated);
    setUsers(getAllUsers());
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(filter.toLowerCase()) || 
    u.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Command Center</h2>
          <p className="text-slate-500">Monitor all platform users and subscription states.</p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
          <button className="px-4 py-1.5 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-md">Overview</button>
          <button className="px-4 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-700">Analytics</button>
          <button className="px-4 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-700">Settings</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full max-w-md p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                      user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                      user.role === UserRole.SELLER ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{user.planType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1.5">
                       <span className={`w-2 h-2 rounded-full ${
                         user.isFrozenByAdmin ? 'bg-red-500' : 
                         user.subscriptionStatus === SubscriptionStatus.ACTIVE ? 'bg-green-500' :
                         user.subscriptionStatus === SubscriptionStatus.TRIAL ? 'bg-blue-500' : 'bg-amber-500'
                       }`}></span>
                       <span className="text-sm text-slate-700">
                         {user.isFrozenByAdmin ? 'Frozen' : user.subscriptionStatus}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(user.trialEndDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleFreeze(user)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                        user.isFrozenByAdmin ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      {user.isFrozenByAdmin ? 'Unfreeze' : 'Freeze Access'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
