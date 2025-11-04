import { AttendanceRecord, AttendanceStatus, Course } from '../types';
import { MOCK_ATTENDANCE_RECORDS, MOCK_COURSES } from '../constants';

const LATENCY = 400;

export const getAttendanceRecords = (courseId: number, date: Date): Promise<AttendanceRecord[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const records = MOCK_ATTENDANCE_RECORDS.filter(r => 
                r.courseId === courseId &&
                r.date.toDateString() === date.toDateString()
            );
            resolve(JSON.parse(JSON.stringify(records)).map((r: any) => ({
                ...r,
                date: new Date(r.date),
            })));
        }, LATENCY);
    });
};

export const getAllTeacherRecords = (teacherId: number): Promise<AttendanceRecord[]> => {
     return new Promise(resolve => {
        setTimeout(() => {
            // In a real API, this would be a single DB query.
            const teacherCourseIds = MOCK_COURSES
                .filter((c: Course) => c.teacherId === teacherId)
                .map((c: Course) => c.id);
            
            const records = MOCK_ATTENDANCE_RECORDS.filter(r => teacherCourseIds.includes(r.courseId));
            
            resolve(JSON.parse(JSON.stringify(records)).map((r: any) => ({
                ...r,
                date: new Date(r.date),
            })));
        }, LATENCY);
    });
}

export const saveAttendanceRecords = (recordsToSave: { studentId: number, courseId: number, date: Date, status: AttendanceStatus, notes?: string }[]): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            recordsToSave.forEach(newRecord => {
                const index = MOCK_ATTENDANCE_RECORDS.findIndex(r => 
                    r.studentId === newRecord.studentId &&
                    r.courseId === newRecord.courseId &&
                    r.date.toDateString() === newRecord.date.toDateString()
                );

                if (index !== -1) {
                    // Update existing record
                    MOCK_ATTENDANCE_RECORDS[index].status = newRecord.status;
                    MOCK_ATTENDANCE_RECORDS[index].notes = newRecord.notes;
                } else {
                    // Add new record
                    const newId = Date.now() + Math.random();
                    MOCK_ATTENDANCE_RECORDS.push({
                        ...newRecord,
                        id: newId,
                    });
                }
            });
            resolve();
        }, LATENCY);
    });
};
