import React, { useState, useEffect } from 'react';
import { Course, Event } from '../../types';
import { MOCK_COURSES } from '../../constants';
import * as eventsApi from '../../api/events';
import TrialLessonModal from '../shared/TrialLessonModal';

const LandingPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoadingEvents(true);
            const allEvents = await eventsApi.getEvents();
            const upcoming = allEvents
                .filter(e => e.date >= new Date() && e.status === 'Agendado')
                .sort((a,b) => a.date.getTime() - b.date.getTime())
                .slice(0, 3); // Show top 3 upcoming events
            setEvents(upcoming);
            setIsLoadingEvents(false);
        };
        fetchEvents();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="bg-indigo-50 dark:bg-gray-800/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                        Desperte a Música em Você
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                        Aprenda com professores apaixonados em um ambiente inspirador. Oferecemos cursos de diversos instrumentos para todas as idades.
                    </p>
                    <button 
                        onClick={() => setIsTrialModalOpen(true)}
                        className="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
                    >
                        Agende uma Aula Experimental
                    </button>
                </div>
            </section>

            {/* Courses Section */}
            <section id="cursos" className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-10">Nossos Cursos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {MOCK_COURSES.map(course => (
                            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="p-6">
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: course.color}}>
                                        <i className="fas fa-guitar text-white text-3xl"></i> {/* Icon needs to be dynamic */}
                                    </div>
                                    <h3 className="font-bold text-xl mb-2">{course.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{course.instrument}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section id="eventos" className="bg-gray-50 dark:bg-gray-800/50 py-16">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-10">Próximos Eventos</h2>
                    {isLoadingEvents ? (
                        <div className="text-center"><i className="fas fa-spinner fa-spin text-2xl"></i></div>
                    ) : events.length > 0 ? (
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {events.map(event => (
                                <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-6">
                                    <div className="flex-shrink-0 w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-300">
                                        <span className="text-sm font-bold">{event.date.toLocaleDateString('pt-BR', { month: 'short' })}</span>
                                        <span className="text-3xl font-bold">{event.date.getDate()}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{event.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400"><i className="fas fa-map-marker-alt fa-fw mr-1"></i>{event.location}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400"><i className="fas fa-clock fa-fw mr-1"></i>{event.startTime} - {event.endTime}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Nenhum evento agendado no momento.</p>
                    )}
                 </div>
            </section>
            
            <TrialLessonModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} />
        </>
    );
};

export default LandingPage;