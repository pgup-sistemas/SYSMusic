import React, { useState, useEffect, useMemo } from 'react';
import { TrialLessonRequest } from '../../types';
import * as trialRequestsApi from '../../api/trialRequests';

const TrialRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<TrialLessonRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<TrialLessonRequest['status'] | 'all'>('all');

    const fetchRequests = async () => {
        setIsLoading(true);
        const fetchedRequests = await trialRequestsApi.getRequests();
        setRequests(fetchedRequests.sort((a,b) => b.requestDate.getTime() - a.requestDate.getTime()));
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusChange = async (requestId: number, newStatus: TrialLessonRequest['status']) => {
        await trialRequestsApi.updateRequestStatus(requestId, newStatus);
        fetchRequests();
    };

    const filteredRequests = useMemo(() => {
        if (statusFilter === 'all') return requests;
        return requests.filter(r => r.status === statusFilter);
    }, [requests, statusFilter]);
    
    const statuses: TrialLessonRequest['status'][] = ['Pendente', 'Contatado', 'Agendado', 'Cancelado'];

    const getStatusColor = (status: TrialLessonRequest['status']) => {
        switch (status) {
            case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Contatado': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Agendado': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Cancelado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Solicitações de Aula Experimental</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Gerencie os novos alunos interessados.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="mb-4 flex justify-start">
                     <div className="relative w-full sm:max-w-xs">
                        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Status</label>
                        <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="all">Todos</option>
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Interessado</th>
                                <th scope="col" className="px-6 py-3">Contato</th>
                                <th scope="col" className="px-6 py-3">Instrumento</th>
                                <th scope="col" className="px-6 py-3">Data da Solicitação</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(req => (
                                <tr key={req.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{req.name}</td>
                                    <td className="px-6 py-4">
                                        <div>{req.email}</div>
                                        {req.phone && <div className="text-xs text-gray-500">{req.phone}</div>}
                                    </td>
                                    <td className="px-6 py-4">{req.instrument}</td>
                                    <td className="px-6 py-4">{new Date(req.requestDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4">
                                        <select value={req.status} onChange={(e) => handleStatusChange(req.id, e.target.value as TrialLessonRequest['status'])} className={`text-xs font-semibold rounded-full border-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 ${getStatusColor(req.status)}`}>
                                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredRequests.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Nenhuma solicitação encontrada.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrialRequestsPage;
