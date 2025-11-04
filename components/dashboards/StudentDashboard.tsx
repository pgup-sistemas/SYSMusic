
import React from 'react';
import { User, Payment } from '../../types';
import { MOCK_LESSONS, MOCK_PAYMENTS, getUserById } from '../../constants';
import UpcomingLessons from '../shared/UpcomingLessons';

interface StudentDashboardProps {
  user: User;
}

const PaymentStatus: React.FC<{payments: Payment[]}> = ({ payments }) => {
    const getStatusColor = (status: Payment['status']) => {
        switch (status) {
            case 'Pago': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Atrasado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Situação Financeira</h3>
          <div className="space-y-3">
            {payments.map(p => (
                 <div key={p.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{p.courseName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Vencimento: {p.dueDate.toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-800 dark:text-white">R$ {p.amount.toFixed(2)}</p>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(p.status)}`}>{p.status}</span>
                    </div>
                 </div>
            ))}
          </div>
        </div>
    )
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const studentLessons = MOCK_LESSONS.filter(l => l.studentId === user.id);
  const studentPayments = MOCK_PAYMENTS.filter(p => p.studentId === user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portal do Aluno</h1>
        <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Seja bem-vindo(a), {user.name}!</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UpcomingLessons lessons={studentLessons} title="Sua Agenda de Aulas" showTeacher />
        <PaymentStatus payments={studentPayments} />
      </div>

       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Acesso Rápido</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-center transition-colors">
                <i className="fa fa-file-pdf text-3xl text-red-500 mb-2"></i>
                <p className="font-semibold text-gray-800 dark:text-white">Materiais de Aula</p>
              </button>
               <button className="p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-center transition-colors">
                <i className="fa fa-award text-3xl text-yellow-500 mb-2"></i>
                <p className="font-semibold text-gray-800 dark:text-white">Meus Certificados</p>
              </button>
               <button className="p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-center transition-colors">
                <i className="fa fa-calendar-plus text-3xl text-green-500 mb-2"></i>
                <p className="font-semibold text-gray-800 dark:text-white">Agendar Reposição</p>
              </button>
          </div>
        </div>
    </div>
  );
};

export default StudentDashboard;
