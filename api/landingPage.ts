import { LandingPageContent, Announcement } from '../types';
import { MOCK_LANDING_PAGE_CONTENT } from '../constants';

const LATENCY = 400;

export const getContent = (): Promise<LandingPageContent> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(MOCK_LANDING_PAGE_CONTENT)));
        }, LATENCY);
    });
};

export const updateHero = (title: string, subtitle: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            MOCK_LANDING_PAGE_CONTENT.heroTitle = title;
            MOCK_LANDING_PAGE_CONTENT.heroSubtitle = subtitle;
            resolve();
        }, LATENCY);
    });
};

export const addAnnouncement = (data: { title: string; content: string }): Promise<Announcement> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newAnnouncement: Announcement = {
                id: Date.now(),
                title: data.title,
                content: data.content,
                date: new Date(),
            };
            MOCK_LANDING_PAGE_CONTENT.announcements.unshift(newAnnouncement);
            resolve(newAnnouncement);
        }, LATENCY);
    });
};

export const updateAnnouncement = (updatedAnnouncement: Announcement): Promise<Announcement> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_LANDING_PAGE_CONTENT.announcements.findIndex(a => a.id === updatedAnnouncement.id);
            if (index !== -1) {
                MOCK_LANDING_PAGE_CONTENT.announcements[index] = { ...updatedAnnouncement, date: new Date() };
                resolve(MOCK_LANDING_PAGE_CONTENT.announcements[index]);
            } else {
                reject(new Error('Announcement not found'));
            }
        }, LATENCY);
    });
};

export const deleteAnnouncement = (announcementId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_LANDING_PAGE_CONTENT.announcements.findIndex(a => a.id === announcementId);
            if (index !== -1) {
                MOCK_LANDING_PAGE_CONTENT.announcements.splice(index, 1);
                resolve();
            } else {
                reject(new Error('Announcement not found'));
            }
        }, LATENCY);
    });
};