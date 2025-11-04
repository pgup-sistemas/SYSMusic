import React, { useState, useMemo, useEffect } from 'react';
import { User, Role, Payment } from '../../types';
import { MOCK_USERS, getUserById } from '../../constants';
import * as paymentsApi from '../../api/payments';
import DashboardCard from '../shared/DashboardCard';

interface PaymentsPageProps {
    user: User;
}

const PaymentsPage: React.FC<PaymentsPageProps> = ({ user }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [studentFilter, setStudentFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const fetchPayments = async () => {
        setIsLoading(true);
        const allPayments = await paymentsApi.getPayments();
        if (user.role === Role.Student) {
            setPayments(allPayments.filter(p => p.studentId === user.id));
        } else {
            setPayments(allPayments);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchPayments();
    }, [user]);

    const handleMarkAsPaid = async (paymentId: number) => {
        await paymentsApi.updatePaymentStatus(paymentId, 'Pago');
        fetchPayments(); // Refetch to update UI
    };

    const handleGeneratePayments = async () => {
        if(window.confirm("Tem certeza que deseja gerar as mensalidades para todos os alunos ativos? Esta ação não pode ser desfeita.")) {
            setIsGenerating(true);
            await paymentsApi.generateMonthlyPayments();
            await fetchPayments();
            setIsGenerating(false);
            alert("Mensalidades geradas com sucesso!");
        }
    };

    const filteredPayments = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return payments.filter(p => {
            const statusMatch = statusFilter === 'all' || p.status === statusFilter;
            const studentMatch = studentFilter === 'all' || p.studentId === parseInt(studentFilter);
            
            if (!statusMatch || !studentMatch) return false;

            switch (dateFilter) {
                case 'next7days': {
                    const nextWeek = new Date();
                    nextWeek.setDate(today.getDate() + 7);
                    return p.dueDate >= today && p.dueDate <= nextWeek;
                }
                case 'thisMonth': {
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    return p.dueDate >= startOfMonth && p.dueDate <= endOfMonth;
                }
                case 'last30days': {
                    const last30 = new Date();
                    last30.setDate(today.getDate() - 30);
                    return p.dueDate >= last30 && p.dueDate <= today;
                }
                case 'overdue': return p.dueDate < today && p.status !== 'Pago';
                default: return true;
            }
        });
    }, [payments, statusFilter, studentFilter, dateFilter]);

    const totalBilled = filteredPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalPaid = filteredPayments.filter(p => p.status === 'Pago').reduce((acc, p) => acc + p.amount, 0);
    const totalPending = filteredPayments.filter(p => p.status === 'Pendente').reduce((acc, p) => acc + p.amount, 0);
    const totalOverdue = filteredPayments.filter(p => p.status === 'Atrasado').reduce((acc, p) => acc + p.amount, 0);

    const students = MOCK_USERS.filter(u => u.role === Role.Student);
    const statuses: Payment['status'][] = ['Pago', 'Pendente', 'Atrasado'];

    const getStatusColor = (status: Payment['status']) => {
        switch (status) {
            case 'Pago': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Atrasado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão Financeira</h1>
                    <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
                        {user.role === Role.Student ? `Olá, ${user.name}! Aqui está seu histórico de pagamentos.` : 'Visão geral dos pagamentos da escola.'}
                    </p>
                </div>
                 {(user.role === Role.Admin || user.role === Role.Secretary) && (
                    <button
                        onClick={handleGeneratePayments}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
                    >
                        {isGenerating ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-file-invoice-dollar mr-2"></i>}
                        {isGenerating ? 'Gerando...' : 'Gerar Mensalidades'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard icon="fa-file-invoice-dollar" title="Total na Seleção" value={`R$ ${totalBilled.toFixed(2)}`} color="bg-blue-500" />
                <DashboardCard icon="fa-check-double" title="Pago na Seleção" value={`R$ ${totalPaid.toFixed(2)}`} color="bg-green-500" />
                <DashboardCard icon="fa-hourglass-half" title="Pendente na Seleção" value={`R$ ${totalPending.toFixed(2)}`} color="bg-yellow-500" />
                <DashboardCard icon="fa-exclamation-triangle" title="Atrasado na Seleção" value={`R$ ${totalOverdue.toFixed(2)}`} color="bg-red-500" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="mb-4 flex flex-wrap gap-4 items-end p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    {user.role !== Role.Student && (
                         <div className="flex-grow min-w-[150px]">
                            <label htmlFor="student-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aluno</label>
                            <select
                            id="student-filter"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            value={studentFilter}
                            onChange={e => setStudentFilter(e.target.value)}
                            >
                            <option value="all">Todos os Alunos</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="flex-grow min-w-[150px]">
                        <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vencimento</label>
                        <select
                        id="date-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        >
                        <option value="all">Qualquer Data</option>
                        <option value="next7days">Próximos 7 dias</option>
                        <option value="thisMonth">Este Mês</option>
                        <option value="last30days">Últimos 30 dias</option>
                        <option value="overdue">Vencidos</option>
                        </select>
                    </div>
                    <div className="flex-grow min-w-[150px]">
                        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <select
                        id="status-filter"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        >
                        <option value="all">Todos os Status</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {user.role !== Role.Student && <th scope="col" className="px-6 py-3">Aluno</th>}
                                <th scope="col" className="px-6 py-3">Curso</th>
                                <th scope="col" className="px-6 py-3">Valor</th>
                                <th scope="col" className="px-6 py-3">Vencimento</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(payment => {
                                const student = getUserById(payment.studentId);
                                return (
                                <tr key={payment.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    {user.role !== Role.Student && (
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                                            <img src={student?.avatarUrl} alt={student?.name} className="w-8 h-8 rounded-full mr-3" />
                                            {student?.name}
                                        </td>
                                    )}
                                    <td className="px-6 py-4">{payment.courseName}</td>
                                    <td className="px-6 py-4 font-semibold">R$ {payment.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">{payment.dueDate.toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200" title="Ver Detalhes">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        {(user.role === Role.Admin || user.role === Role.Secretary) && payment.status !== 'Pago' && (
                                            <button onClick={() => handleMarkAsPaid(payment.id)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200" title="Marcar como Pago">
                                                <i className="fas fa-check-circle"></i>
                                            </button>
                                        )}
                                        {user.role === Role.Student && payment.status !== 'Pago' && (
                                             <button onClick={() => handleMarkAsPaid(payment.id)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 font-semibold text-xs py-1 px-2 rounded-md bg-green-100 dark:bg-green-900/50">
                                                Pagar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                     {filteredPayments.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Nenhum pagamento encontrado com os filtros selecionados.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;