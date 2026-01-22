
import React, { useState } from 'react';
import { User, UserRole, SubscriptionStatus } from '../types';
import { Icons, APP_NAME } from '../constants';
import { logout } from '../services/mockBackend';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isExpired = user.subscriptionStatus === SubscriptionStatus.EXPIRED;
  const isFrozen = user.isFrozenByAdmin;
  const currentHash = window.location.hash || '#/';

  const NavItem = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => {
    const active = currentHash === href;
    return (
      <a
        href={href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
          active 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
        }`}
      >
        <Icon />
        <span className="font-semibold">{label}</span>
      </a>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tighter flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <span>BTM</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavItem icon={Icons.Dashboard} label="Dashboard" href="#/" />
        {user.role === UserRole.ADMIN && (
          <NavItem icon={Icons.Users} label="Manage Users" href="#/admin" />
        )}
        {user.role === UserRole.SELLER && (
          <NavItem icon={Icons.Products} label="My Inventory" href="#/products" />
        )}
        <NavItem icon={Icons.AILab} label="AI Lab" href="#/ai-lab" />
        <NavItem icon={Icons.Upgrade} label="Subscription" href="#/upgrade" />
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold uppercase">
              {user.fullName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.fullName}</p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            onLogout();
          }}
          className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm"
        >
          <Icons.Logout />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 h-full bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
          <h1 className="text-xl font-black text-indigo-600">{APP_NAME}</h1>
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {user.fullName.charAt(0)}
          </div>
        </header>

        {isFrozen && (
          <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-center space-x-3 sticky top-0 z-30 shadow-xl">
            <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="font-bold">ACCOUNT FROZEN: Administrative Action Required.</span>
          </div>
        )}
        {isExpired && !isFrozen && (
          <div className="bg-indigo-900 text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sticky top-0 z-30 shadow-xl">
            <div className="flex items-center space-x-3">
               <div className="bg-amber-400 p-1.5 rounded-lg text-indigo-900">
                  <Icons.Upgrade />
               </div>
               <span className="font-semibold text-sm">Your trial has expired. Access is limited until a plan is activated.</span>
            </div>
            <a href="#/upgrade" className="bg-amber-400 text-indigo-900 px-6 py-2 rounded-xl text-sm font-black hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-lg">
              UPGRADE NOW
            </a>
          </div>
        )}

        <div className="p-6 md:p-12 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
