import React, { useState, useEffect, useRef } from 'react';
import { User, Payment } from '../../types';
import * as paymentsApi from '../../api/payments';
import DashboardCard from '../shared/DashboardCard';

declare const Chart: any;

interface FinanceiroDashboardProps {
    user: User;
    setActivePage: (page: string) => void;
}

const FinanceiroDashboard: React.FC<FinanceiroDashboardProps> = ({ user, setActivePage }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const monthlyRevenueChartRef = useRef<HTMLCanvasElement>(null);
    const paymentStatusChartRef = useRef<HTMLCanvasElement>(null);
    const chartInstances = useRef<{ revenue?: any; status?: any }>({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await paymentsApi.getPayments();
            setPayments(data);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Cleanup previous chart instances before creating new ones
        if (chartInstances.current.revenue) {
            chartInstances.current.revenue.destroy();
        }
        if (chartInstances.current.status) {
            chartInstances.current.status.destroy();
        }

        if (payments.length > 0 && !isLoading) {
            // Monthly Revenue Chart
            if (monthlyRevenueChartRef.current) {
                const revenueCtx = monthlyRevenueChartRef.current.getContext('2d');
                const revenueData = processMonthlyRevenue();
                chartInstances.current.revenue = new Chart(revenueCtx, {
                    type: 'bar',
                    data: {
                        labels: revenueData.labels,
                        datasets: [{
                            label: 'Receita Mensal',
                            data: revenueData.data,
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: { scales: { y: { beginAtZero: true } }, responsive: true }
                });
            }

            // Payment Status Chart
            if (paymentStatusChartRef.current) {
                const statusCtx = paymentStatusChartRef.current.getContext('2d');
                const statusData = processPaymentStatus();
                 chartInstances.current.status = new Chart(statusCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Pago', 'Pendente', 'Atrasado'],
                        datasets: [{
                            label: 'Status de Pagamentos',
                            data: [statusData.paid, statusData.pending, statusData.overdue],
                            backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(239, 68, 68, 0.7)'],
                            borderColor: ['#fff'],
                            borderWidth: 2
                        }]
                    },
                     options: { responsive: true, plugins: { legend: { position: 'top' } } }
                });
            }
        }
         // Cleanup function to run when the component unmounts
        return () => {
            if (chartInstances.current.revenue) chartInstances.current.revenue.destroy();
            if (chartInstances.current.status) chartInstances.current.status.destroy();
        };
    }, [payments, isLoading]);

    const processMonthlyRevenue = () => {
        const monthlyData: { [key: string]: number } = {};
        const paidPayments = payments.filter(p => p.status === 'Pago' && p.paidDate);

        paidPayments.forEach(p => {
            const monthYear = p.paidDate!.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' });
            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = 0;
            }
            monthlyData[monthYear] += p.amount;
        });
        
        const sortedLabels = Object.keys(monthlyData).sort((a, b) => {
            const dateA = new Date(`01 ${a.replace('.', '')}`);
            const dateB = new Date(`01 ${b.replace('.', '')}`);
            return dateA.getTime() - dateB.getTime();
        }).slice(-6); // Get last 6 months

        return {
            labels: sortedLabels,
            data: sortedLabels.map(label => monthlyData[label])
        };
    };
    
    const processPaymentStatus = () => ({
        paid: payments.filter(p => p.status === 'Pago').length,
        pending: payments.filter(p => p.status === 'Pendente').length,
        overdue: payments.filter(p => p.status === 'Atrasado').length,
    });

    const totalPaid = payments.filter(p => p.status === 'Pago').reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments.filter(p => p.status !== 'Pago').reduce((sum, p) => sum + p.amount, 0);
    const paidCount = payments.filter(p => p.status === 'Pago').length;
    const avgTicket = paidCount > 0 ? totalPaid / paidCount : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Financeiro</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Análise da saúde financeira da escola.</p>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard icon="fa-landmark" title="Total Arrecadado" value={`R$ ${totalPaid.toFixed(2)}`} color="bg-green-500" />
                <DashboardCard icon="fa-file-invoice-dollar" title="Pendente/Atrasado" value={`R$ ${totalPending.toFixed(2)}`} color="bg-yellow-500" />
                <DashboardCard icon="fa-receipt" title="Ticket Médio" value={`R$ ${avgTicket.toFixed(2)}`} color="bg-blue-500" />
                <DashboardCard icon="fa-users" title="Alunos com Pendências" value={String(new Set(payments.filter(p => p.status !== 'Pago').map(p => p.studentId)).size)} color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                 <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Receita Mensal (Últimos 6 meses)</h3>
                    <canvas ref={monthlyRevenueChartRef}></canvas>
                </div>
                 <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Status dos Pagamentos</h3>
                    <canvas ref={paymentStatusChartRef}></canvas>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                 <button 
                    onClick={() => setActivePage('Relatório Financeiro')} 
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                   <i className="fas fa-list-alt mr-2"></i> Ver Relatório Detalhado
                </button>
            </div>
        </div>
    );
};

export default FinanceiroDashboard;
