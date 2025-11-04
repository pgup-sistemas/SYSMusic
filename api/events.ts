import { Event } from '../types';
import { MOCK_EVENTS } from '../constants';

// Simulate network latency
const LATENCY = 500;

export const getEvents = (): Promise<Event[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Return a deep copy to prevent direct mutation of the mock data
            resolve(JSON.parse(JSON.stringify(MOCK_EVENTS)).map((e: any) => ({
                ...e,
                date: new Date(e.date),
            })));
        }, LATENCY);
    });
};

export const addEvent = (eventData: Omit<Event, 'id' | 'status' | 'participantIds'>): Promise<Event> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newEvent: Event = {
                ...eventData,
                id: Date.now(),
                status: 'Agendado',
                participantIds: [],
            };
            MOCK_EVENTS.push(newEvent);
            resolve(newEvent);
        }, LATENCY);
    });
};

export const updateEvent = (updatedEvent: Event): Promise<Event> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_EVENTS.findIndex(e => e.id === updatedEvent.id);
            if (index !== -1) {
                MOCK_EVENTS[index] = updatedEvent;
                resolve(updatedEvent);
            } else {
                reject(new Error('Event not found'));
            }
        }, LATENCY);
    });
};

export const updateEventStatus = (eventId: number, status: Event['status']): Promise<Event> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_EVENTS.findIndex(e => e.id === eventId);
            if (index !== -1) {
                MOCK_EVENTS[index].status = status;
                resolve(MOCK_EVENTS[index]);
            } else {
                reject(new Error('Event not found'));
            }
        }, LATENCY);
    });
};
