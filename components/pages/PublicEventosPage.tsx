
import React, { useState, useEffect, useMemo } from 'react';
import { Event } from '../../types';
import * as eventsApi from '../../api/events';

const PublicEventosPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            const allEvents = await eventsApi.getEvents();
            setEvents(allEvents.sort((a,b) => b.date.getTime() - a.date.getTime()));
            setIsLoading(false);
        };
        fetchEvents();
    }, []);

    const { upcomingEvents, pastEvents } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return events.reduce((acc, event) => {
            if (event.date >= today && event.status === 'Agendado') {
                acc.upcomingEvents.push(event);
            } else {
                acc.pastEvents.push(event);
            }
            return acc;
        }, { upcomingEvents: [] as Event[], pastEvents: [] as Event[] });
    }, [events]);

    const EventCard: React.FC<{event: Event}> = ({event}) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-6">
            <div className="flex-shrink-0 w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-300 text-center">
                <span className="text-md font-bold uppercase">{event.date.toLocaleDateString('pt-BR', { month: 'short' })}</span>
                <span className="text-4xl font-bold">{event.date.getDate()}</span>
                 <span className="text-sm">{event.date.getFullYear()}</span>
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">{event.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400"><i className="fas fa-map-marker-alt fa-fw mr-1"></i>{event.location}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400"><i className="fas fa-clock fa-fw mr-1"></i>{event.startTime} - {event.endTime}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{event.description}</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Agenda de Eventos</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    Fique por dentro dos nossos recitais, workshops e apresentações.
                </p>
            </div>

            {isLoading ? (
                <div className="text-center"><i className="fas fa-spinner fa-spin text-3xl text-indigo-500"></i></div>
            ) : (
                <div className="space-y-12">
                    <section>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Próximos Eventos</h3>
                        {upcomingEvents.length > 0 ? (
                            <div className="space-y-6">
                                {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
                            </div>
                        ) : (
                           <p className="text-center text-gray-500 dark:text-gray-400 py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">Nenhum evento agendado no momento.</p>
                        )}
                    </section>
                    <section>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Eventos Passados</h3>
                         {pastEvents.length > 0 ? (
                            <div className="space-y-6">
                                {pastEvents.map(event => <EventCard key={event.id} event={event} />)}
                            </div>
                        ) : (
                           <p className="text-center text-gray-500 dark:text-gray-400 py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">Nenhum evento no histórico.</p>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
};

export default PublicEventosPage;
