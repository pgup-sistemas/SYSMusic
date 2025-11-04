import React, { useState } from 'react';
import { User } from '../../types';
import { MOCK_USERS } from '../../constants';
import ForgotPasswordModal from '../shared/ForgotPasswordModal';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onGoToPublic: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoToPublic }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user && user.password === password) {
      if (!user.isActive) {
        setError('Sua conta está desativada. Entre em contato com a administração.');
        return;
      }
      onLogin(user);
    } else {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
        <button onClick={onGoToPublic} className="absolute top-4 left-4 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm">
            <i className="fas fa-arrow-left mr-2"></i>Voltar ao Início
        </button>
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <i className="fas fa-music text-5xl text-indigo-500"></i>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-4">Acesso ao Portal</h1>
            <p className="text-gray-600 dark:text-gray-300">Sistema de Gestão Integrado</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
              <input
                id="password-input"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Sua senha"
              />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button type="button" onClick={() => setIsForgotPasswordOpen(true)} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Esqueceu a senha?
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Escola de Música. Todos os direitos reservados.</p>
        </footer>
      </div>
      <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />
    </>
  );
};

export default LoginPage;
