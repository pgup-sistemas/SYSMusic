import React from 'react';
import { Role } from '../../types';

interface SidebarProps {
  userRole: Role;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

const adminNav = [
  { name: 'Dashboard', icon: 'fa-home' },
  { name: 'Usuários', icon: 'fa-users-cog' },
  { name: 'Cursos', icon: 'fa-book' },
  { name: 'Salas', icon: 'fa-door-open' },
  { name: 'Agenda', icon: 'fa-calendar-alt' },
  { name: 'Financeiro', icon: 'fa-dollar-sign' },
  { name: 'Eventos', icon: 'fa-star' },
  { name: 'Certificados', icon: 'fa-award' },
];

const secretaryNav = [
  { name: 'Dashboard', icon: 'fa-home' },
  { name: 'Matrículas', icon: 'fa-file-signature' },
  { name: 'Agenda', icon: 'fa-calendar-alt' },
  { name: 'Pagamentos', icon: 'fa-cash-register' },
  { name: 'Eventos', icon: 'fa-star' },
  { name: 'Salas', icon: 'fa-door-open' },
  { name: 'Documentos', icon: 'fa-folder-open' },
];

const teacherNav = [
  { name: 'Dashboard', icon: 'fa-home' },
  { name: 'Minhas Aulas', icon: 'fa-calendar-check' },
  { name: 'Meus Alunos', icon: 'fa-users' },
  { name: 'Disponibilidade', icon: 'fa-clock' },
  { name: 'Materiais', icon: 'fa-file-alt' },
];

const studentNav = [
  { name: 'Dashboard', icon: 'fa-home' },
  { name: 'Minha Agenda', icon: 'fa-calendar-alt' },
  { name: 'Pagamentos', icon: 'fa-receipt' },
  { name: 'Materiais', icon: 'fa-book-open' },
  { name: 'Certificados', icon: 'fa-award' },
];

const navItems = {
  [Role.Admin]: adminNav,
  [Role.Secretary]: secretaryNav,
  [Role.Teacher]: teacherNav,
  [Role.Student]: studentNav,
};

const Sidebar: React.FC<SidebarProps> = ({ userRole, isOpen, setIsOpen, activePage, setActivePage }) => {
  const navigation = navItems[userRole] || [];

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setIsOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 text-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <i className="fa fa-times text-white"></i>
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <i className="fas fa-music text-3xl text-indigo-400"></i>
              <span className="ml-3 text-2xl font-bold">MúsicaSYS</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = activePage === item.name;
                return (
                  <a key={item.name} href="#" onClick={(e) => { e.preventDefault(); setActivePage(item.name); setIsOpen(false); }} 
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive ? 'bg-gray-900 text-white' : 'text-indigo-100 hover:bg-gray-700 hover:text-white'}`}>
                    <i className={`fa ${item.icon} mr-4 flex-shrink-0 h-6 w-6 ${isActive ? 'text-indigo-400' : 'text-indigo-300'}`}></i>
                    {item.name}
                  </a>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800 text-white">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
                <i className="fas fa-music text-3xl text-indigo-400"></i>
                <span className="ml-3 text-2xl font-bold">MúsicaSYS</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = activePage === item.name;
                  return (
                    <a key={item.name} href="#" onClick={(e) => { e.preventDefault(); setActivePage(item.name); }} 
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? 'bg-gray-900 text-white' : 'text-indigo-100 hover:bg-gray-700 hover:text-white'}`}>
                      <i className={`fa ${item.icon} mr-3 flex-shrink-0 h-6 w-6 ${isActive ? 'text-indigo-400' : 'text-indigo-300'}`}></i>
                      {item.name}
                    </a>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;