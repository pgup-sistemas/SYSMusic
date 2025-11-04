import React, { useMemo, useState, useEffect } from 'react';
import { User } from '../../types';
import { MOCK_LESSONS, MOCK_STUDENTS_DATA, MOCK_COURSES } from '../../constants';
import Pagination from '../shared/Pagination';
import { normalizeText } from '../../utils';

const ITEMS_PER_PAGE = 10;

const MeusAlunosPage: React.FC<{ user: User }> = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const teacherCourses = useMemo(() => {
        return MOCK_COURSES.filter(course => course.teacherId === user.id);
    }, [user.id]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCourse, statusFilter]);

    const myStudentIds = useMemo(() => {
        let lessons = MOCK_LESSONS.filter(lesson => lesson.teacherId === user.id);
        
        if (selectedCourse !== 'all') {
            lessons = lessons.filter(lesson => lesson.courseId === parseInt(selectedCourse));
        }

        const ids = lessons.map(lesson => lesson.studentId);
        return [...new Set(ids)];
    }, [user.id, selectedCourse]);

    const myStudents = useMemo(() => {
        return MOCK_STUDENTS_DATA.filter(student => myStudentIds.includes(student.id));
    }, [myStudentIds]);

    const filteredStudents = useMemo(() => {
        const normalizedSearch = normalizeText(searchTerm);
        return myStudents.filter(student => {
             const statusMatch = statusFilter === 'all' || (statusFilter === 'active' ? student.isActive : !student.isActive);
             const searchTermMatch = normalizeText(student.name).includes(normalizedSearch) ||
                                     normalizeText(student.email).includes(normalizedSearch);
            return statusMatch && searchTermMatch;
        });
    }, [myStudents, searchTerm, statusFilter]);

    const currentStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredStudents, currentPage]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Alunos</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Gerencie e acompanhe o progresso dos seus alunos.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-start gap-4 mb-4">
                    <div className="relative w-full sm:max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fa fa-search text-gray-400"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                     <div className="relative w-full sm:max-w-xs">
                        <select
                            value={selectedCourse}
                            onChange={e => setSelectedCourse(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="all">Todos os Cursos</option>
                            {teacherCourses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>
                     <div className="relative w-full sm:max-w-xs">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome do Aluno</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Data de Matrícula</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStudents.map(student => (
                                <tr key={student.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                                        <img src={student.avatarUrl} alt={student.name} className="w-8 h-8 rounded-full mr-3" />
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4">{student.email}</td>
                                     <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                            {student.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(student.enrollmentDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200" title="Ver Perfil">
                                            <i className="fas fa-user-circle"></i>
                                        </button>
                                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200" title="Enviar Mensagem">
                                            <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredStudents.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Nenhum aluno encontrado para os filtros selecionados.
                        </div>
                    )}
                </div>
                 <Pagination
                    currentPage={currentPage}
                    totalItems={filteredStudents.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default MeusAlunosPage;