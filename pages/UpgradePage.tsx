
import React, { useState } from 'react';
import { User, PlanType, SubscriptionStatus } from '../types';
import { MONTHLY_PRICE, YEARLY_PRICE, APP_NAME } from '../constants';
import { updateUserInStore } from '../services/mockBackend';

interface UpgradePageProps {
  user: User;
  onPlanActivated: (user: User) => void;
}

const UpgradePage: React.FC<UpgradePageProps> = ({ user, onPlanActivated }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (plan: PlanType) => {
    setLoading(true);
    
    // Simulating Razorpay flow
    const amount = plan === PlanType.MONTHLY ? MONTHLY_PRICE : YEARLY_PRICE;
    
    // In a real app, you'd call the backend to create an order
    // const response = await fetch('/api/payment/order', { method: 'POST', body: JSON.stringify({ amount, plan }) });
    
    setTimeout(() => {
      const now = new Date();
      const end = new Date();
      if (plan === PlanType.MONTHLY) end.setMonth(end.getMonth() + 1);
      else end.setFullYear(end.getFullYear() + 1);

      const updatedUser: User = {
        ...user,
        planType: plan,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionStartDate: now.toISOString(),
        subscriptionEndDate: end.toISOString(),
        isFrozenByAdmin: false // Unfreeze on payment
      };

      updateUserInStore(updatedUser);
      onPlanActivated(updatedUser);
      setLoading(false);
      alert(`Success! You have activated the ${plan} plan.`);
    }, 1500);
  };

  const PlanCard = ({ title, price, features, plan, highlighted = false }: any) => (
    <div className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-transform hover:scale-[1.02] ${
      highlighted ? 'border-indigo-600' : 'border-slate-100'
    }`}>
      {highlighted && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Best Value
        </span>
      )}
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-extrabold text-slate-900">₹{price}</span>
        <span className="text-slate-500 ml-1">/{plan === PlanType.MONTHLY ? 'mo' : 'yr'}</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center text-slate-600">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <button
        disabled={loading}
        onClick={() => handlePayment(plan)}
        className={`w-full py-4 rounded-xl font-bold transition-all ${
          highlighted 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
        } disabled:opacity-50`}
      >
        {loading ? 'Processing...' : 'Activate Plan'}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Choose your growth plan</h2>
        <p className="text-xl text-slate-500">Professional features for serious textile entrepreneurs.</p>
        
        {user.subscriptionStatus === SubscriptionStatus.EXPIRED && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 font-medium">
            Your trial has ended. Please choose a plan below to unlock your dashboard and resume business.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <PlanCard
          title="Monthly Growth"
          price={MONTHLY_PRICE}
          plan={PlanType.MONTHLY}
          features={[
            'Unlimited product listings',
            'B2B Wholesale dashboard',
            'Verified Seller badge',
            'Direct buyer inquiries',
            'Basic market insights'
          ]}
        />
        <PlanCard
          title="Annual Enterprise"
          price={YEARLY_PRICE}
          plan={PlanType.YEARLY}
          highlighted={true}
          features={[
            'Everything in Monthly, plus:',
            '2 months free (Save ₹588)',
            'Priority listing search',
            'Advanced AI Seller tools',
            'Custom shop URL',
            '24/7 Premium support'
          ]}
        />
      </div>

      <div className="mt-20 text-center">
        <p className="text-slate-500 text-sm">Secure payments processed by Razorpay. Cancel anytime.</p>
        <div className="mt-8 flex items-center justify-center space-x-8 opacity-40 grayscale">
          <span className="font-bold text-lg">Razorpay</span>
          <span className="font-bold text-lg">Visa</span>
          <span className="font-bold text-lg">MasterCard</span>
          <span className="font-bold text-lg">UPI</span>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
