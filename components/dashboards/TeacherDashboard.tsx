
import React from 'react';
import { User } from '../../types';
import { MOCK_LESSONS, MOCK_USERS, MOCK_STUDENTS_DATA } from '../../constants';
import DashboardCard from '../shared/DashboardCard';
import UpcomingLessons from '../shared/UpcomingLessons';

interface TeacherDashboardProps {
  user: User;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user }) => {
  const teacherLessons = MOCK_LESSONS.filter(l => l.teacherId === user.id);
  const myStudents = [...new Set(teacherLessons.map(l => l.studentId))].length;
  const upcomingLessonsCount = teacherLessons.filter(l => l.startTime > new Date() && l.status === 'Agendada').length;

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel do Professor</h1>
        <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Olá, {user.name}!</p>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard icon="fa-calendar-day" title="Aulas na Semana" value={String(upcomingLessonsCount)} color="bg-blue-500" />
        <DashboardCard icon="fa-users" title="Alunos Ativos" value={String(myStudents)} color="bg-green-500" />
        <DashboardCard icon="fa-check-circle" title="Aulas Concluídas" value={String(teacherLessons.filter(l => l.status === 'Concluída').length)} color="bg-yellow-500" />
        <DashboardCard icon="fa-clock" title="Próxima Aula" value="Hoje, 15:00" color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UpcomingLessons lessons={teacherLessons} title="Minhas Próximas Aulas" showStudent />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ações Rápidas</h3>
          <div className="flex flex-col space-y-3">
              <button className="text-left w-full p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900 rounded-lg text-indigo-700 dark:text-indigo-300 font-semibold transition-colors"><i className="fa fa-plus-circle mr-2"></i>Marcar Aula de Reposição</button>
              <button className="text-left w-full p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900 rounded-lg text-indigo-700 dark:text-indigo-300 font-semibold transition-colors"><i className="fa fa-upload mr-2"></i>Enviar Material de Aula</button>
              <button className="text-left w-full p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900 rounded-lg text-indigo-700 dark:text-indigo-300 font-semibold transition-colors"><i className="fa fa-paper-plane mr-2"></i>Enviar Comunicado</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
