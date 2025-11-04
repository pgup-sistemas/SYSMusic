import { Room } from '../types';
import { MOCK_ROOMS } from '../constants';

// Simulate network latency
const LATENCY = 300;

export const getRooms = (): Promise<Room[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([...MOCK_ROOMS]);
        }, LATENCY);
    });
};

export const addRoom = (name: string): Promise<Room> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newRoom: Room = {
                id: Date.now(),
                name,
            };
            MOCK_ROOMS.push(newRoom);
            resolve(newRoom);
        }, LATENCY);
    });
};

export const updateRoom = (updatedRoom: Room): Promise<Room> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_ROOMS.findIndex(r => r.id === updatedRoom.id);
            if (index !== -1) {
                MOCK_ROOMS[index] = updatedRoom;
                resolve(updatedRoom);
            } else {
                reject(new Error('Room not found'));
            }
        }, LATENCY);
    });
};

export const deleteRoom = (roomId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_ROOMS.findIndex(r => r.id === roomId);
            if (index !== -1) {
                MOCK_ROOMS.splice(index, 1);
                resolve();
            } else {
                reject(new Error('Room not found'));
            }
        }, LATENCY);
    });
};