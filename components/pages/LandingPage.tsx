import React, { useState, useEffect } from 'react';
import { Course, Event, LandingPageContent } from '../../types';
import { MOCK_COURSES } from '../../constants';
import * as eventsApi from '../../api/events';
import * as landingPageApi from '../../api/landingPage';
import TrialLessonModal from '../shared/TrialLessonModal';

interface LandingPageProps {
    onGoToCursos: () => void;
    onGoToTrial: () => void;
}


const LandingPage: React.FC<LandingPageProps> = ({ onGoToCursos, onGoToTrial }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [content, setContent] = useState<LandingPageContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [fetchedContent, allEvents] = await Promise.all([
                landingPageApi.getContent(),
                eventsApi.getEvents()
            ]);
            
            setContent(fetchedContent);

            const upcomingEvents = allEvents
                .filter(e => e.date >= new Date() && e.status === 'Agendado')
                .sort((a,b) => a.date.getTime() - b.date.getTime())
                .slice(0, 3); // Show top 3 upcoming events
            setEvents(upcomingEvents);
            
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading || !content) {
        return <div className="flex justify-center items-center h-screen"><i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
    }

    return (
        <>
            {/* Hero Section */}
            <section className="bg-indigo-50 dark:bg-gray-800/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                        {content.heroTitle}
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                        {content.heroSubtitle}
                    </p>
                    <button 
                        onClick={() => setIsTrialModalOpen(true)}
                        className="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
                    >
                        Agende uma Aula Experimental
                    </button>
                </div>
            </section>
            
            {/* Announcements Section */}
            {content.announcements.length > 0 && (
                <section id="anuncios" className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-10">Notícias e Anúncios</h2>
                        <div className="max-w-3xl mx-auto space-y-4">
                        {content.announcements.map(ann => (
                            <div key={ann.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                <h3 className="font-bold text-xl text-indigo-600 dark:text-indigo-400">{ann.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{new Date(ann.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                <p className="text-gray-700 dark:text-gray-300">{ann.content}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Courses Section */}
            <section id="cursos" className="py-16 bg-gray-50 dark:bg-gray-800/50">
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
            <section id="eventos" className="py-16">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-10">Próximos Eventos</h2>
                    {events.length > 0 ? (
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