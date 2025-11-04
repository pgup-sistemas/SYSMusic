import React, { useState } from 'react';
import { User, Role } from '../../types';
import Sidebar from './Sidebar';
import Header from './Header';
import AdminDashboard from '../dashboards/AdminDashboard';
import TeacherDashboard from '../dashboards/TeacherDashboard';
import StudentDashboard from '../dashboards/StudentDashboard';
import SecretaryDashboard from '../dashboards/SecretaryDashboard';
import AgendaPage from '../pages/AgendaPage';
import PaymentsPage from '../pages/PaymentsPage';
import UsuariosPage from '../pages/UsuariosPage';
import CursosPage from '../pages/CursosPage';
import MeusAlunosPage from '../pages/MeusAlunosPage';
import DisponibilidadePage from '../pages/DisponibilidadePage';
import MateriaisPage from '../pages/MateriaisPage';
import CertificadosPage from '../pages/CertificadosPage';
import EventosPage from '../pages/EventosPage';
import ProfilePage from '../pages/ProfilePage';
import SalasPage from '../pages/SalasPage';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  setCurrentUser: (user: User) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout, setCurrentUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        switch (user.role) {
          case Role.Admin: return <AdminDashboard user={user} />;
          case Role.Secretary: return <SecretaryDashboard user={user} />;
          case Role.Teacher: return <TeacherDashboard user={user} />;
          case Role.Student: return <StudentDashboard user={user} />;
          default: return <div>Dashboard Padrão</div>;
        }
      case 'Agenda':
      case 'Minha Agenda':
      case 'Minhas Aulas':
        return <AgendaPage user={user} />;
      case 'Financeiro':
      case 'Pagamentos':
        return <PaymentsPage user={user} />;
      case 'Usuários':
        return <UsuariosPage />;
      case 'Cursos':
        return <CursosPage />;
      case 'Meus Alunos':
        return <MeusAlunosPage user={user} />;
      case 'Disponibilidade':
        return <DisponibilidadePage user={user} />;
      case 'Materiais':
        return <MateriaisPage user={user} />;
      case 'Certificados':
        return <CertificadosPage user={user} />;
      case 'Eventos':
        return <EventosPage />;
      case 'Seu Perfil':
        return <ProfilePage user={user} onUserUpdate={setCurrentUser} />;
      case 'Salas':
        return <SalasPage />;
      default:
        return <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-gray-900 dark:text-white">
            <h2 className="text-2xl font-bold mb-4">{activePage}</h2>
            <p>Esta página está em construção.</p>
        </div>;
    }
  };

  const getPageTitle = () => {
    if (activePage === 'Dashboard') {
        return `Dashboard - ${user.role}`;
    }
    return activePage;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <Sidebar 
        userRole={user.role} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user} 
          onLogout={onLogout} 
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={getPageTitle()}
          setActivePage={setActivePage}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;