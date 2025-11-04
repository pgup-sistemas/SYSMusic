import React, { useState, useMemo, useEffect } from 'react';
import { Course, Role } from '../../types';
import { MOCK_COURSES, MOCK_USERS, getUserById, getStudentCountForCourse } from '../../constants';
import Modal from '../shared/Modal';

interface CourseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (course: Course) => void;
    courseToEdit: Course | null;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({ isOpen, onClose, onSave, courseToEdit }) => {
    const [formData, setFormData] = useState<Omit<Course, 'id'>>({
        name: '',
        instrument: '',
        teacherId: 0,
        color: '#3b82f6'
    });

    const teachers = useMemo(() => MOCK_USERS.filter(u => u.role === Role.Teacher), []);

    useEffect(() => {
        if (courseToEdit) {
            setFormData({
                name: courseToEdit.name,
                instrument: courseToEdit.instrument,
                teacherId: courseToEdit.teacherId,
                color: courseToEdit.color
            });
        } else {
            setFormData({ name: '', instrument: '', teacherId: teachers.length > 0 ? teachers[0].id : 0, color: '#3b82f6' });
        }
    }, [courseToEdit, isOpen, teachers]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'teacherId' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const courseData: Course = {
            id: courseToEdit?.id || Date.now(),
            ...formData,
        };
        onSave(courseData);
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={courseToEdit ? "Editar Curso" : "Adicionar Novo Curso"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Curso</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                 <div>
                    <label htmlFor="instrument" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instrumento</label>
                    <input type="text" name="instrument" id="instrument" value={formData.instrument} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                 <div>
                    <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Professor</label>
                    <select name="teacherId" id="teacherId" value={formData.teacherId} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cor no Calendário</label>
                    <input type="color" name="color" id="color" value={formData.color} onChange={handleChange} required className="mt-1 block w-full h-10 rounded-md" />
                </div>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Salvar</button>
                </div>
            </form>
        </Modal>
    );
};

const CursosPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

    const filteredCourses = useMemo(() => {
        return courses.filter(course =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instrument.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [courses, searchTerm]);

    const handleAddNew = () => {
        setCourseToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (course: Course) => {
        setCourseToEdit(course);
        setIsModalOpen(true);
    };

    const handleDelete = (courseId: number) => {
        if (window.confirm("Tem certeza que deseja excluir este curso?")) {
            setCourses(prev => prev.filter(c => c.id !== courseId));
        }
    };

    const handleSaveCourse = (courseData: Course) => {
        if (courseToEdit) {
            setCourses(prev => prev.map(c => c.id === courseData.id ? courseData : c));
        } else {
            setCourses(prev => [...prev, courseData]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Cursos</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Adicione, edite e gerencie os cursos da escola.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <div className="relative w-full sm:max-w-xs">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fa fa-search text-gray-400"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou instrumento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <i className="fa fa-plus mr-2"></i>Adicionar Novo Curso
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome do Curso</th>
                                <th scope="col" className="px-6 py-3">Instrumento</th>
                                <th scope="col" className="px-6 py-3">Professor</th>
                                <th scope="col" className="px-6 py-3">Alunos</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map(course => {
                                const teacher = getUserById(course.teacherId);
                                const studentCount = getStudentCountForCourse(course.id);
                                return (
                                <tr key={course.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                                        <span className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: course.color }}></span>
                                        {course.name}
                                    </td>
                                    <td className="px-6 py-4">{course.instrument}</td>
                                    <td className="px-6 py-4">{teacher?.name || 'Não definido'}</td>
                                    <td className="px-6 py-4">{studentCount}</td>
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <button onClick={() => handleEdit(course)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200" title="Editar">
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200" title="Excluir">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                     {filteredCourses.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Nenhum curso encontrado.
                        </div>
                    )}
                </div>
            </div>
            
            <CourseFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCourse}
                courseToEdit={courseToEdit}
            />
        </div>
    );
};

export default CursosPage;