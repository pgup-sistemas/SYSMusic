import { Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';

const LATENCY = 300;

export const getNotifications = (userId: number): Promise<Notification[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const userNotifications = MOCK_NOTIFICATIONS.filter(n => n.userId === userId);
            resolve(JSON.parse(JSON.stringify(userNotifications)).map((n: any) => ({
                ...n,
                date: new Date(n.date),
            })));
        }, LATENCY);
    });
};

export const markAsRead = (notificationId: number): Promise<Notification> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === notificationId);
            if (index !== -1) {
                MOCK_NOTIFICATIONS[index].isRead = true;
                resolve(MOCK_NOTIFICATIONS[index]);
            } else {
                reject(new Error('Notification not found'));
            }
        }, LATENCY);
    });
};

export const markAllAsRead = (userId: number): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            MOCK_NOTIFICATIONS.forEach(n => {
                if (n.userId === userId) {
                    n.isRead = true;
                }
            });
            resolve();
        }, LATENCY);
    });
};
