import { User } from '../types';
import { MOCK_USERS } from '../constants';

const LATENCY = 500;

export const updateUserProfile = (userId: number, name: string, email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_USERS.findIndex(u => u.id === userId);
            if (index !== -1) {
                MOCK_USERS[index].name = name;
                MOCK_USERS[index].email = email;
                resolve({ ...MOCK_USERS[index] });
            } else {
                reject(new Error('User not found'));
            }
        }, LATENCY);
    });
};

export const changeUserPassword = (userId: number, currentPassword: string, newPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_USERS.findIndex(u => u.id === userId);
            if (index !== -1) {
                if (MOCK_USERS[index].password === currentPassword) {
                    MOCK_USERS[index].password = newPassword;
                    resolve();
                } else {
                    reject(new Error('Senha atual incorreta.'));
                }
            } else {
                reject(new Error('User not found'));
            }
        }, LATENCY);
    });
};
