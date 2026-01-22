
import React, { useState, useEffect } from 'react';
import { User, UserRole, Product } from '../types';
import { getProducts } from '../services/mockBackend';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const stats = user.role === UserRole.SELLER ? [
    { label: 'Total Inventory', value: '₹4.2L', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Enquiries', value: '28', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Network Reach', value: '1.2k', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Market Rank', value: '#14', color: 'text-purple-600', bg: 'bg-purple-50' },
  ] : [
    { label: 'Verified Sellers', value: '450+', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Fabrics Sourced', value: '12', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Saved Items', value: '45', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Loyalty Points', value: '1,250', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Greetings, {user.fullName.split(' ')[0]}! 👋
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            {user.role === UserRole.SELLER 
              ? "Your textile shop's digital pulse for today." 
              : "Discover premium fabrics from India's finest manufacturers."}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm self-start md:self-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Market Status: Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
              <div className={`${stat.bg} p-2 rounded-xl`}>
                 <div className={`w-3 h-3 rounded-full ${stat.color.replace('text', 'bg')}`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">
            {user.role === UserRole.SELLER ? 'Your Top Listed Products' : 'Curated Collections for You'}
          </h3>
          <button className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">Explore Full Catalog</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-8 gap-8">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="group border border-slate-50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="h-64 bg-slate-100 relative overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <p className="text-white text-sm font-medium">{product.description}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                   <h4 className="font-bold text-slate-900 text-lg">{product.name}</h4>
                   <span className="bg-slate-50 text-[10px] font-black text-slate-500 px-2 py-1 rounded-lg uppercase">{product.category}</span>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900">₹{product.price}<span className="text-xs text-slate-400 font-normal"> /m</span></span>
                  <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
                    {user.role === UserRole.SELLER ? 'Manage' : 'Inquire'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {user.role === UserRole.SELLER ? (
         <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-indigo-600 transform -skew-x-12 translate-x-1/2 scale-150 opacity-20"></div>
            <div className="bg-indigo-700 p-10 md:p-14 text-white relative flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex-1 space-y-4">
                 <h3 className="text-4xl font-black leading-tight">Automate your textile business with BTM AI</h3>
                 <p className="opacity-80 text-lg max-w-xl font-medium">Smart inventory tracking, AI-powered price suggestions, and automated buyer outreach designed specifically for Indian wholesalers.</p>
                 <div className="flex space-x-6 pt-4">
                    <div className="flex items-center space-x-2">
                       <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                       <span className="text-sm font-bold">Premium Seller Feature</span>
                    </div>
                 </div>
              </div>
              <a href="#/products" className="bg-white text-indigo-700 px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-slate-50 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap">
                 Update Inventory
              </a>
            </div>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-500">
                 <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04c0 4.835 1.503 9.359 4.07 13.04a11.955 11.955 0 01-8.618 3.04c0 4.835 1.503 9.359 4.07 13.04a11.955 11.955 0 01-8.618 3.04c0 4.835 1.503 9.359 4.07 13.04a11.955 11.955 0 01-8.618 3.04c0 4.835 1.503 9.359 4.07 13.04a11.955 11.955 0 01-8.618 3.04c0 4.835 1.503 9.359 4.07 13.04z" /></svg>
              </div>
              <h4 className="text-2xl font-black mb-2">Verified Sourcing</h4>
              <p className="opacity-80 font-medium mb-6">Every seller on BTM undergoes a 3-step physical verification. Buy with 100% confidence.</p>
              <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all">Learn More</button>
           </div>
           <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
              <h4 className="text-2xl font-black mb-2">Bulk Discounts</h4>
              <p className="opacity-80 font-medium mb-6">Sourcing for a factory? Unlock exclusive tiered pricing on orders above 500 meters.</p>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/40">Apply for Wholesale</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
