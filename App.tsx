
import React, { useState } from 'react';
import { User } from './types';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './components/pages/LoginPage';
import PublicLayout from './components/layout/PublicLayout';

const App: React.FC = () => {
  const [view, setView] = useState<'public' | 'login' | 'dashboard'>('public');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('public');
  };

  const handleGoToLogin = () => {
    setView('login');
  };
  
  const handleGoToPublic = () => {
    setView('public');
  }

  const renderView = () => {
    switch (view) {
      case 'public':
        return <PublicLayout onGoToLogin={handleGoToLogin} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onGoToPublic={handleGoToPublic} />;
      case 'dashboard':
        if (currentUser) {
          return <DashboardLayout user={currentUser} onLogout={handleLogout} setCurrentUser={setCurrentUser} />;
        }
        // Fallback to login if user is null in dashboard view
        setView('login');
        return <LoginPage onLogin={handleLogin} onGoToPublic={handleGoToPublic} />;
      default:
        return <PublicLayout onGoToLogin={handleGoToLogin} />;
    }
  };

  return <>{renderView()}</>;
};

export default App;
