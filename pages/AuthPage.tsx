
import React, { useState } from 'react';
import { UserRole, User, SubscriptionStatus, PlanType } from '../types';
import { TRIAL_DAYS, APP_NAME } from '../constants';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    role: UserRole.BUYER
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users: User[] = JSON.parse(localStorage.getItem('btm_users') || '[]');

    if (isLogin) {
      const user = users.find(u => u.email === formData.email && formData.password === 'password'); // In demo, pass is 'password'
      if (user) {
        localStorage.setItem('btm_current_user', JSON.stringify(user));
        onAuthSuccess(user);
      } else {
        setError('Invalid credentials. (Hint: password is "password")');
      }
    } else {
      if (users.find(u => u.email === formData.email)) {
        setError('User with this email already exists.');
        return;
      }

      const trialStart = new Date();
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);

      const newUser: User = {
        id: `user_${Date.now()}`,
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        role: formData.role as UserRole,
        trialStartDate: trialStart.toISOString(),
        trialEndDate: trialEnd.toISOString(),
        subscriptionStatus: SubscriptionStatus.TRIAL,
        planType: PlanType.NONE,
        isFrozenByAdmin: false
      };

      users.push(newUser);
      localStorage.setItem('btm_users', JSON.stringify(users));
      localStorage.setItem('btm_current_user', JSON.stringify(newUser));
      onAuthSuccess(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-2">{APP_NAME}</h1>
          <p className="text-slate-500">{isLogin ? 'Welcome back to the textile hub' : 'Join the digital textile revolution'}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{isLogin ? 'Login' : 'Create Account'}</h2>
          
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    required
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                  <input
                    required
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                  >
                    <option value={UserRole.BUYER}>Buyer (I want to source fabrics)</option>
                    <option value={UserRole.SELLER}>Seller (I own a shop/factory)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                required
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                required
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transform hover:scale-[1.01] transition-all shadow-lg"
            >
              {isLogin ? 'Login' : 'Get Started for Free'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 font-bold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
        
        {isLogin && (
           <div className="mt-6 text-center text-xs text-slate-400">
             Try Demo Login: <span className="font-mono bg-slate-100 px-1">admin@btm.com</span> with password <span className="font-mono bg-slate-100 px-1">password</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
