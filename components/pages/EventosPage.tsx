import React, { useState, useEffect, useMemo } from 'react';
import { Event, User } from '../../types';
import * as eventsApi from '../../api/events';
import { MOCK_USERS } from '../../constants';
import Modal from '../shared/Modal';
import ManageParticipantsModal from '../shared/ManageParticipantsModal';

interface EventFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (eventData: Omit<Event, 'id' | 'status' | 'participantIds'> | Event) => Promise<void>;
    eventToEdit: Event | null;
    isSaving: boolean;
}

const EventFormModal: React.FC<EventFormModalProps> = ({ isOpen, onClose, onSave, eventToEdit, isSaving }) => {
    const [formData, setFormData] = useState({
        name: '', date: '', startTime: '', endTime: '', location: '', description: ''
    });

    useEffect(() => {
        if (eventToEdit) {
            setFormData({
                name: eventToEdit.name,
                date: eventToEdit.date.toISOString().split('T')[0],
                startTime: eventToEdit.startTime,
                endTime: eventToEdit.endTime,
                location: eventToEdit.location,
                description: eventToEdit.description,
            });
        } else {
            setFormData({ name: '', date: new Date().toISOString().split('T')[0], startTime: '19:00', endTime: '21:00', location: '', description: '' });
        }
    }, [eventToEdit, isOpen]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const eventData = {
            ...eventToEdit,
            id: eventToEdit?.id || Date.now(),
            name: formData.name,
            date: new Date(formData.date),
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: formData.location,
            description: formData.description,
            status: eventToEdit?.status || 'Agendado',
            participantIds: eventToEdit?.participantIds || []
        };
        await onSave(eventData as Event);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={eventToEdit ? "Editar Evento" : "Agendar Novo Evento"}>
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Evento</label>
                    <input type="text" id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
                        <input type="date" id="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Início</label>
                        <input type="time" id="startTime" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fim</label>
                        <input type="time" id="endTime" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Local</label>
                    <input type="text" id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                    <textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Detalhes sobre o evento, repertório, etc."></textarea>
                </div>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} disabled={isSaving} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:opacity-50">Cancelar</button>
                    <button type="submit" disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                        {isSaving && <i className="fas fa-spinner fa-spin mr-2"></i>}
                        {isSaving ? 'Salvando...' : 'Salvar Evento'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const EventosPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
    const [selectedEventForParticipants, setSelectedEventForParticipants] = useState<Event | null>(null);

    const fetchEvents = async () => {
        setIsLoading(true);
        const fetchedEvents = await eventsApi.getEvents();
        setEvents(fetchedEvents);
        setIsLoading(false);
    };

    useEffect(() => {
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

    const handleSave = async (eventData: Omit<Event, 'id' | 'status' | 'participantIds'> | Event) => {
        setIsSaving(true);
        if ('id' in eventData && eventToEdit) {
            await eventsApi.updateEvent(eventData as Event);
        } else {
            await eventsApi.addEvent(eventData as Omit<Event, 'id' | 'status' | 'participantIds'>);
        }
        setIsSaving(false);
        setIsFormModalOpen(false);
        setEventToEdit(null);
        fetchEvents();
    };

    const handleEdit = (event: Event) => {
        setEventToEdit(event);
        setIsFormModalOpen(true);
    };

    const handleCancel = async (eventId: number) => {
        if (window.confirm("Tem certeza que deseja cancelar este evento?")) {
            await eventsApi.updateEventStatus(eventId, 'Cancelado');
            fetchEvents();
        }
    };
    
    const handleOpenParticipantsModal = (event: Event) => {
        setSelectedEventForParticipants(event);
        setIsParticipantsModalOpen(true);
    };

    const handleSaveParticipants = async (updatedParticipantIds: number[]) => {
        if (!selectedEventForParticipants) return;
        
        setIsSaving(true);
        const updatedEvent = { ...selectedEventForParticipants, participantIds: updatedParticipantIds };
        await eventsApi.updateEvent(updatedEvent);
        
        setIsSaving(false);
        setIsParticipantsModalOpen(false);
        setSelectedEventForParticipants(null);
        fetchEvents();
    };


    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
    }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Eventos</h1>
            <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
            Planeje e gerencie os recitais, audições e outros eventos da escola.
            </p>
        </div>
        <button
            onClick={() => { setEventToEdit(null); setIsFormModalOpen(true); }}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <i className="fa fa-plus mr-2"></i>Agendar Novo Evento
        </button>
      </div>

       <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Próximos Eventos</h2>
                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
                                            <i className="fas fa-star text-3xl text-indigo-500 dark:text-indigo-400"></i>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{event.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{event.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm"><i className="fas fa-map-marker-alt mr-2"></i>{event.location}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm"><i className="fas fa-clock mr-2"></i>{event.startTime} - {event.endTime}</p>
                                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{event.description}</p>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700">
                                     <button onClick={() => handleOpenParticipantsModal(event)} className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                                        {event.participantIds.length} participantes
                                     </button>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(event)} className="text-gray-400 hover:text-indigo-500" title="Editar"><i className="fas fa-pencil-alt"></i></button>
                                        <button onClick={() => handleCancel(event.id)} className="text-gray-400 hover:text-red-500" title="Cancelar"><i className="fas fa-calendar-times"></i></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        <p className="text-gray-500 dark:text-gray-400">Nenhum evento agendado.</p>
                    </div>
                )}
            </div>
            
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Eventos Passados e Cancelados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Local</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastEvents.map(event => (
                                <tr key={event.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{event.name}</td>
                                    <td className="px-6 py-4">{event.date.toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4">{event.location}</td>
                                    <td className="px-6 py-4">
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${event.status === 'Cancelado' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                            {event.status === 'Cancelado' ? 'Cancelado' : 'Concluído'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
       </div>

        <EventFormModal 
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            onSave={handleSave}
            eventToEdit={eventToEdit}
            isSaving={isSaving}
        />

        {selectedEventForParticipants && (
            <ManageParticipantsModal
                isOpen={isParticipantsModalOpen}
                onClose={() => setIsParticipantsModalOpen(false)}
                onSave={handleSaveParticipants}
                event={selectedEventForParticipants}
                allUsers={MOCK_USERS}
                isSaving={isSaving}
            />
        )}
    </div>
  );
};

export default EventosPage;