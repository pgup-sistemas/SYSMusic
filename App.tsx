
import React, { useState, useEffect } from 'react';
import { User } from './types';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './components/pages/LoginPage';
import PublicLayout from './components/layout/PublicLayout';
import * as authApi from './api/auth';

const App: React.FC = () => {
  const [view, setView] = useState<'public' | 'login' | 'dashboard'>('public');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCurrentUser = async () => {
      const user = await authApi.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setView('dashboard');
      }
      setIsLoading(false);
    };
    checkCurrentUser();
  }, []);


  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    setView('public');
  };

  const handleGoToLogin = () => {
    setView('login');
  };
  
  const handleGoToPublic = () => {
    setView('public');
  }

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
            <i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i>
        </div>
    );
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