import React, { useState, useEffect, useRef } from 'react';
import { User, Notification } from '../../types';
import * as notificationsApi from '../../api/notifications';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onMenuClick: () => void;
  pageTitle: string;
  setActivePage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onMenuClick, pageTitle, setActivePage }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const fetchNotifications = async () => {
    const userNotifications = await notificationsApi.getNotifications(user.id);
    setNotifications(userNotifications.sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  useEffect(() => {
    fetchNotifications();
  }, [user.id]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsRef]);


  const handleMarkOneAsRead = async (id: number) => {
    await notificationsApi.markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await notificationsApi.markAllAsRead(user.id);
    fetchNotifications();
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
       <button
        type="button"
        className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <i className="fa fa-bars h-6 w-6"></i>
      </button>
      <div className="flex-1 px-4 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white hidden md:block">{pageTitle}</h1>
        </div>
        <div className="flex items-center space-x-4">
            <form className="hidden md:block" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                Buscar
                </label>
                <div className="relative text-gray-400 focus-within:text-gray-600 dark:focus-within:text-gray-200">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <i className="fa fa-search h-5 w-5"></i>
                </div>
                <input
                    id="search-field"
                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-0 sm:text-sm"
                    placeholder="Buscar..."
                    type="search"
                    name="search"
                />
                </div>
            </form>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              type="button"
              className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-10 h-10 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <i className="fas fa-moon h-5 w-5"></i>
              ) : (
                <i className="fas fa-sun h-5 w-5"></i>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  type="button"
                  className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                  <span className="sr-only">Ver notificações</span>
                  <i className="fa fa-bell h-6 w-6"></i>
                  {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{unreadCount}</span>
                  )}
              </button>

              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                        <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-600">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notificações</h3>
                            {unreadCount > 0 && <button onClick={handleMarkAllAsRead} className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Marcar todas como lidas</button>}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                           {notifications.length > 0 ? notifications.map(n => (
                               <div key={n.id} className={`flex items-start px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600/50 ${!n.isRead ? 'bg-indigo-50 dark:bg-gray-800' : ''}`}>
                                  <div className="flex-1">
                                    <p>{n.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{n.date.toLocaleDateString('pt-BR', { day: '2-digit', month:'short', hour:'2-digit', minute: '2-digit' })}</p>
                                  </div>
                                  {!n.isRead && (
                                      <button onClick={() => handleMarkOneAsRead(n.id)} className="ml-2 flex-shrink-0" title="Marcar como lida">
                                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                      </button>
                                  )}
                               </div>
                           )) : (
                               <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">Nenhuma notificação.</p>
                           )}
                        </div>
                    </div>
                </div>
              )}
            </div>


            {/* Profile dropdown */}
            <div className="relative group">
                <div>
                <button
                    type="button"
                    className="max-w-xs bg-white dark:bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                >
                    <span className="sr-only">Abrir menu do usuário</span>
                    <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatarUrl}
                    alt=""
                    />
                </button>
                </div>
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => setActivePage('Seu Perfil')} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">
                        Seu Perfil
                    </button>
                    <button onClick={onLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">
                        Sair
                    </button>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;