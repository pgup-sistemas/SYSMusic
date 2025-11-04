import { TrialLessonRequest } from '../types';
import { MOCK_TRIAL_REQUESTS } from '../constants';

const LATENCY = 400;

export const getRequests = (): Promise<TrialLessonRequest[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(MOCK_TRIAL_REQUESTS)).map((r: any) => ({
                ...r,
                requestDate: new Date(r.requestDate),
            })));
        }, LATENCY);
    });
};

export const addRequest = (data: Omit<TrialLessonRequest, 'id' | 'requestDate' | 'status'>): Promise<TrialLessonRequest> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newRequest: TrialLessonRequest = {
                id: Date.now(),
                ...data,
                requestDate: new Date(),
                status: 'Pendente',
            };
            MOCK_TRIAL_REQUESTS.unshift(newRequest);
            resolve(newRequest);
        }, LATENCY);
    });
};

export const updateRequestStatus = (requestId: number, status: TrialLessonRequest['status']): Promise<TrialLessonRequest> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_TRIAL_REQUESTS.findIndex(r => r.id === requestId);
            if (index !== -1) {
                MOCK_TRIAL_REQUESTS[index].status = status;
                resolve(MOCK_TRIAL_REQUESTS[index]);
            } else {
                reject(new Error('Trial request not found'));
            }
        }, LATENCY);
    });
};
