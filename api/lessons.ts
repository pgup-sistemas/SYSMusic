import { Lesson } from '../types';
import { MOCK_LESSONS } from '../constants';

// Simulate network latency
const LATENCY = 500;

export const getLessons = (): Promise<Lesson[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Return a deep copy to prevent direct mutation of the mock data
            resolve(JSON.parse(JSON.stringify(MOCK_LESSONS)).map((l: any) => ({
                ...l,
                startTime: new Date(l.startTime),
                endTime: new Date(l.endTime)
            })));
        }, LATENCY);
    });
};

export const addLesson = (lessonData: Omit<Lesson, 'id'>): Promise<Lesson> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newLesson: Lesson = {
                ...lessonData,
                id: Date.now(),
            };
            MOCK_LESSONS.push(newLesson);
            resolve(newLesson);
        }, LATENCY);
    });
};

export const updateLesson = (updatedLesson: Lesson): Promise<Lesson> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_LESSONS.findIndex(l => l.id === updatedLesson.id);
            if (index !== -1) {
                MOCK_LESSONS[index] = updatedLesson;
                resolve(updatedLesson);
            } else {
                reject(new Error('Lesson not found'));
            }
        }, LATENCY);
    });
};

export const deleteLesson = (lessonId: number): Promise<void> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_LESSONS.findIndex(l => l.id === lessonId);
            if (index !== -1) {
                MOCK_LESSONS.splice(index, 1);
                resolve();
            } else {
                 reject(new Error('Lesson not found'));
            }
        }, LATENCY);
    });
};