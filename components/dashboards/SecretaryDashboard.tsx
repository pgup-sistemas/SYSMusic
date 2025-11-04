
import React from 'react';
import { User, Role } from '../../types';
import { MOCK_PAYMENTS, MOCK_USERS, MOCK_LESSONS } from '../../constants';
import DashboardCard from '../shared/DashboardCard';
import UpcomingLessons from '../shared/UpcomingLessons';


const PendingPayments: React.FC = () => {
    const pending = MOCK_PAYMENTS.filter(p => p.status !== 'Pago').slice(0, 5);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pagamentos Pendentes</h3>
          <div className="space-y-3">
              {pending.map(p => {
                  const student = MOCK_USERS.find(u => u.id === p.studentId);
                  return (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <img src={student?.avatarUrl} alt={student?.name} className="w-8 h-8 rounded-full"/>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">{student?.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{p.courseName}</p>
                            </div>
                        </div>
                        <button className={`text-sm font-semibold ${p.status === 'Atrasado' ? 'text-red-500' : 'text-yellow-500'}`}>
                           R$ {p.amount.toFixed(2)}
                        </button>
                    </div>
                  )
              })}
          </div>
        </div>
    )
}

const SecretaryDashboard: React.FC<{user: User}> = ({ user }) => {
    const pendingPaymentsCount = MOCK_PAYMENTS.filter(p => p.status !== 'Pago').length;

    return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel da Secretaria</h1>
        <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Bom trabalho, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard icon="fa-file-signature" title="Novas Matrículas" value="3" color="bg-blue-500" />
        <DashboardCard icon="fa-receipt" title="Pagamentos Pendentes" value={String(pendingPaymentsCount)} color="bg-yellow-500" />
        <DashboardCard icon="fa-calendar-alt" title="Aulas Experimentais" value="5" color="bg-green-500" />
        <DashboardCard icon="fa-exclamation-triangle" title="Conflitos de Agenda" value="1" color="bg-red-500" />
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <PendingPayments />
            </div>
            <div>
                 <UpcomingLessons lessons={MOCK_LESSONS} title="Agenda da Escola" showStudent showTeacher />
            </div>
       </div>

    </div>
  );
};

export default SecretaryDashboard;
