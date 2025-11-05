import { Room } from '../types';
import { API_URL, getHeaders, apiFetch } from './index';

export const getRooms = async (): Promise<Room[]> => {
    return apiFetch(`${API_URL}/rooms`, {
        headers: getHeaders(),
    });
};

export const addRoom = async (name: string): Promise<Room> => {
    return apiFetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name }),
    });
};

export const updateRoom = async (updatedRoom: Room): Promise<Room> => {
    return apiFetch(`${API_URL}/rooms/${updatedRoom.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedRoom),
    });
};

export const deleteRoom = async (roomId: number): Promise<void> => {
    await apiFetch(`${API_URL}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
};