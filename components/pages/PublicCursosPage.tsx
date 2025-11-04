
import React from 'react';
import { MOCK_COURSES, getUserById } from '../../constants';

const PublicCursosPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Conheça Nossos Cursos</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    Oferecemos uma variedade de cursos para todos os níveis, do iniciante ao avançado.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_COURSES.map(course => {
                    const teacher = getUserById(course.teacherId);
                    return (
                        <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                           <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('https://picsum.photos/seed/${course.instrument}/400/200')`}}></div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">{course.name}</h3>
                                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">{course.instrument}</p>
                                
                                {teacher && (
                                    <div className="flex items-center mt-4 pt-4 border-t dark:border-gray-700">
                                        <img src={teacher.avatarUrl} alt={teacher.name} className="w-10 h-10 rounded-full mr-3"/>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{teacher.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Professor(a)</p>
                                        </div>
                                    </div>
                                )}
                                
                                <button className="mt-6 w-full px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-semibold rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900">
                                    Saiba Mais
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PublicCursosPage;