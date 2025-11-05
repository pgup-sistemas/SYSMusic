import { User, Role } from '../types';
import { API_URL, getHeaders, apiFetch } from './index';

export const getUsers = async (): Promise<User[]> => {
    return apiFetch(`${API_URL}/users`, {
        headers: getHeaders(),
    });
};

export const addUser = async (userData: Omit<User, 'id' | 'avatarUrl' | 'isActive'>): Promise<User> => {
     return apiFetch(`${API_URL}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });
};

export const updateUser = async (user: User): Promise<User> => {
    return apiFetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(user),
    });
}

export const toggleUserStatus = async (userId: number, isActive: boolean): Promise<User> => {
     return apiFetch(`${API_URL}/users/${userId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ isActive }),
    });
}


export const updateUserProfile = async (userId: number, name: string, email: string): Promise<User> => {
     return apiFetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ name, email }),
    });
};

export const changeUserPassword = async (userId: number, currentPassword: string, newPassword: string): Promise<void> => {
     await apiFetch(`${API_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
    });
};