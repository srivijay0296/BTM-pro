
import React, { useState, useEffect } from 'react';
import { User, UserRole, SubscriptionStatus } from './types';
import { getSessionUser } from './services/mockBackend';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import UpgradePage from './pages/UpgradePage';
import AdminPage from './pages/AdminPage';
import ProductsPage from './pages/ProductsPage';
import AILabPage from './pages/AILabPage';
import LiveAssistant from './components/LiveAssistant';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    const sessionUser = getSessionUser();
    setUser(sessionUser);
    setLoading(false);

    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
           <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
           <p className="text-slate-500 font-bold animate-pulse tracking-widest uppercase text-xs">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={(u) => setUser(u)} />;
  }

  const isAccessRestricted = user.isFrozenByAdmin || user.subscriptionStatus === SubscriptionStatus.EXPIRED;
  const isAtUpgrade = currentPath === '#/upgrade';
  const canAccessFullApp = user.role === UserRole.ADMIN || (!isAccessRestricted);

  let content;
  if (!canAccessFullApp && !isAtUpgrade) {
    window.location.hash = '#/upgrade';
    content = <UpgradePage user={user} onPlanActivated={(u) => setUser(u)} />;
  } else {
    switch (currentPath) {
      case '#/upgrade':
        content = <UpgradePage user={user} onPlanActivated={(u) => setUser(u)} />;
        break;
      case '#/admin':
        content = user.role === UserRole.ADMIN ? <AdminPage /> : <Dashboard user={user} />;
        break;
      case '#/products':
        content = user.role === UserRole.SELLER ? <ProductsPage user={user} /> : <Dashboard user={user} />;
        break;
      case '#/ai-lab':
        content = <AILabPage user={user} />;
        break;
      case '#/':
      default:
        content = <Dashboard user={user} />;
        break;
    }
  }

  return (
    <Layout user={user} onLogout={() => setUser(null)}>
      {content}
      {!isAccessRestricted && <LiveAssistant />}
    </Layout>
  );
};

export default App;
