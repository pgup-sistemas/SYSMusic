
import React from 'react';
import { User, Role, StudentData } from '../../types';
import { MOCK_LESSONS, MOCK_USERS, MOCK_STUDENTS_DATA } from '../../constants';
import DashboardCard from '../shared/DashboardCard';
import UpcomingLessons from '../shared/UpcomingLessons';

interface AdminDashboardProps {
  user: User;
}

const StudentList: React.FC<{students: StudentData[]}> = ({ students }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Alunos Ativos</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nome</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Cursos</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                  <img src={student.avatarUrl} alt={student.name} className="w-8 h-8 rounded-full mr-3" />
                  {student.name}
                </td>
                <td className="px-6 py-4">{student.email}</td>
                <td className="px-6 py-4">{student.activeCourses}</td>
                <td className="px-6 py-4">
                  <a href="#" className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline">Ver Perfil</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
    const activeStudents = MOCK_STUDENTS_DATA.filter(s => s.isActive);
    const totalTeachers = MOCK_USERS.filter(u => u.role === Role.Teacher).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard do Administrador</h1>
        <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Bem-vindo(a) de volta, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard icon="fa-user-graduate" title="Alunos Ativos" value={String(activeStudents.length)} color="bg-blue-500" />
        <DashboardCard icon="fa-chalkboard-teacher" title="Total de Professores" value={String(totalTeachers)} color="bg-green-500" />
        <DashboardCard icon="fa-dollar-sign" title="Faturamento (Mês)" value="R$ 12.5k" color="bg-yellow-500" />
        <DashboardCard icon="fa-calendar-check" title="Aulas Hoje" value="8" color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <StudentList students={activeStudents} />
        </div>
        <div>
            <UpcomingLessons lessons={MOCK_LESSONS} title="Agenda Geral" showStudent showTeacher />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;