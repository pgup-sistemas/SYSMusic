import React, { useState, useMemo, useEffect } from 'react';
import { User, Role, Certificate } from '../../types';
import { MOCK_CERTIFICATES, MOCK_USERS } from '../../constants';
import Modal from '../shared/Modal';
import Pagination from '../shared/Pagination';

interface CertificateFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (certificate: Omit<Certificate, 'id' | 'validationCode'>) => void;
}

const ITEMS_PER_PAGE = 10;

const CertificateFormModal: React.FC<CertificateFormModalProps> = ({ isOpen, onClose, onSave }) => {
    const [studentId, setStudentId] = useState('');
    const [eventName, setEventName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    
    const students = useMemo(() => MOCK_USERS.filter(u => u.role === Role.Student), []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId || !eventName || !courseName || !issueDate) return;
        
        onSave({
            studentId: parseInt(studentId),
            eventName,
            courseName,
            issueDate: new Date(new Date(issueDate).getTime() + new Date().getTimezoneOffset() * 60000), // Adjust for timezone
        });
        
        // Reset form
        setStudentId('');
        setEventName('');
        setCourseName('');
        setIssueDate(new Date().toISOString().split('T')[0]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerar Novo Certificado">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="student" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aluno</label>
                    <select id="student" value={studentId} onChange={e => setStudentId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="" disabled>Selecione um aluno</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Evento/Motivo</label>
                    <input type="text" id="eventName" value={eventName} onChange={e => setEventName(e.target.value)} required placeholder="Ex: Recital de Fim de Ano 2024" className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                 <div>
                    <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Curso</label>
                    <input type="text" id="courseName" value={courseName} onChange={e => setCourseName(e.target.value)} required placeholder="Ex: Conclusão de Violão Básico" className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Emissão</label>
                    <input type="date" id="issueDate" value={issueDate} onChange={e => setIssueDate(e.target.value)} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Gerar Certificado</button>
                </div>
            </form>
        </Modal>
    )
}

const AdminView: React.FC = () => {
    const [certificates, setCertificates] = useState<Certificate[]>(MOCK_CERTIFICATES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentFilter, setStudentFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
    const [currentPage, setCurrentPage] = useState(1);
    
    const students = useMemo(() => MOCK_USERS.filter(u => u.role === Role.Student), []);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [studentFilter, dateFilter]);

    const filteredCertificates = useMemo(() => {
        return certificates.filter(cert => {
            const studentMatch = studentFilter === 'all' || cert.studentId === parseInt(studentFilter);
            const startDate = dateFilter.start ? new Date(new Date(dateFilter.start).getTime() + new Date().getTimezoneOffset() * 60000) : null;
            const endDate = dateFilter.end ? new Date(new Date(dateFilter.end).getTime() + new Date().getTimezoneOffset() * 60000) : null;
            
            if (startDate) startDate.setHours(0, 0, 0, 0);
            if (endDate) endDate.setHours(23, 59, 59, 999);
    
            const dateMatch = (!startDate || cert.issueDate >= startDate) && (!endDate || cert.issueDate <= endDate);
    
            return studentMatch && dateMatch;
        });
    }, [certificates, studentFilter, dateFilter]);

    const currentCertificates = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCertificates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredCertificates, currentPage]);

    const handleSaveCertificate = (data: Omit<Certificate, 'id' | 'validationCode'>) => {
        const newCertificate: Certificate = {
            id: Date.now(),
            validationCode: `${Math.random().toString(36).substr(2, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`,
            ...data,
        };
        const updatedCerts = [...certificates, newCertificate].sort((a,b) => b.issueDate.getTime() - a.issueDate.getTime());
        setCertificates(updatedCerts);
        MOCK_CERTIFICATES.push(newCertificate);
    };

    const handleInvalidate = (id: number) => {
        if (window.confirm("Tem certeza que deseja invalidar este certificado? Esta ação não pode ser desfeita.")) {
            setCertificates(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciar Certificados</h1>
                    <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Emita e administre os certificados dos alunos.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-shrink-0"
                >
                    <i className="fa fa-plus mr-2"></i>Gerar Certificado
                </button>
            </div>

             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="mb-4 flex flex-wrap gap-4 items-end p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                     <div className="flex-grow min-w-[150px]">
                        <label htmlFor="student-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aluno</label>
                        <select id="student-filter" value={studentFilter} onChange={e => setStudentFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option value="all">Todos os Alunos</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                     <div className="flex-grow min-w-[120px]">
                        <label htmlFor="date-start-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emitido de:</label>
                        <input type="date" id="date-start-filter" value={dateFilter.start} onChange={e => setDateFilter(prev => ({...prev, start: e.target.value}))} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                     <div className="flex-grow min-w-[120px]">
                        <label htmlFor="date-end-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Até:</label>
                        <input type="date" id="date-end-filter" value={dateFilter.end} onChange={e => setDateFilter(prev => ({...prev, end: e.target.value}))} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Aluno</th>
                                <th scope="col" className="px-6 py-3">Evento/Curso</th>
                                <th scope="col" className="px-6 py-3">Data de Emissão</th>
                                <th scope="col" className="px-6 py-3">Código de Validação</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCertificates.map(cert => {
                                const student = MOCK_USERS.find(u => u.id === cert.studentId);
                                return (
                                <tr key={cert.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{student?.name || 'Aluno desconhecido'}</td>
                                    <td className="px-6 py-4">{cert.eventName}</td>
                                    <td className="px-6 py-4">{cert.issueDate.toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{cert.validationCode}</td>
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200" title="Ver/Baixar"><i className="fas fa-download"></i></button>
                                        <button onClick={() => handleInvalidate(cert.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200" title="Invalidar"><i className="fas fa-times-circle"></i></button>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                     {filteredCertificates.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-8">Nenhum certificado encontrado com os filtros selecionados.</p>}
                </div>
                 <Pagination
                    currentPage={currentPage}
                    totalItems={filteredCertificates.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            </div>

            <CertificateFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveCertificate} />
        </div>
    )
}

const StudentView: React.FC<{ user: User }> = ({ user }) => {
    const [yearFilter, setYearFilter] = useState('all');
    const myCertificates = useMemo(() => MOCK_CERTIFICATES.filter(c => c.studentId === user.id), [user.id]);
    
    // FIX: Explicitly type `a` and `b` as numbers to help TypeScript's type inference.
    const years = useMemo(() => [...new Set(myCertificates.map(c => c.issueDate.getFullYear()))].sort((a: number, b: number) => b - a), [myCertificates]);
    
    const filteredCertificates = useMemo(() => {
        if (yearFilter === 'all') return myCertificates;
        return myCertificates.filter(cert => cert.issueDate.getFullYear() === parseInt(yearFilter));
    }, [myCertificates, yearFilter]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Certificados</h1>
                    <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Aqui estão todos os certificados que você conquistou.</p>
                </div>
                <div className="relative w-full sm:w-auto sm:max-w-xs">
                    <label htmlFor="year-filter" className="sr-only">Filtrar por ano</label>
                    <select id="year-filter" value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="all">Todos os Anos</option>
                        {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
            </div>

            {filteredCertificates.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCertificates.map(cert => (
                        <div key={cert.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
                            <div>
                                <div className="flex justify-between items-start">
                                    <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                                        <i className="fas fa-award text-3xl text-yellow-500 dark:text-yellow-400"></i>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{cert.validationCode}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{cert.eventName}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{cert.courseName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Emitido em: {cert.issueDate.toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="mt-6 text-right">
                                <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <i className="fas fa-download mr-2"></i>Baixar PDF
                                </button>
                            </div>
                        </div>
                    ))}
                 </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <i className="fas fa-award text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">Nenhum certificado encontrado</h3>
                    <p className="text-gray-500 dark:text-gray-400">{yearFilter === 'all' ? 'Você ainda não possui certificados.' : `Nenhum certificado emitido em ${yearFilter}.`}</p>
                </div>
            )}
        </div>
    );
};


const CertificadosPage: React.FC<{ user: User }> = ({ user }) => {
    switch (user.role) {
        case Role.Admin:
        case Role.Secretary:
            return <AdminView />;
        case Role.Student:
            return <StudentView user={user} />;
        default:
            return (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <p className="text-gray-700 dark:text-gray-200">Você não tem permissão para acessar esta página.</p>
                </div>
            );
    }
};

export default CertificadosPage;