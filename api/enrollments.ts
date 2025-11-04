import { User, StudentData, Payment, Guardian, Role, Course } from '../types';
import { MOCK_USERS, MOCK_STUDENTS_DATA, MOCK_PAYMENTS, MOCK_COURSES } from '../constants';

// Simulate network latency
const LATENCY = 800;

interface EnrollmentData {
    student: {
        name: string;
        email: string;
        dateOfBirth: string;
        address: string;
    };
    guardian?: Guardian;
    courseId: number;
}

export const createEnrollment = (data: EnrollmentData): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newId = Date.now();
            const course = MOCK_COURSES.find(c => c.id === data.courseId);

            // 1. Create new User
            const newUser: User = {
                id: newId,
                name: data.student.name,
                email: data.student.email,
                role: Role.Student,
                avatarUrl: `https://picsum.photos/seed/${newId}/100/100`,
                password: 'password', // Default password
                isActive: true,
            };
            MOCK_USERS.push(newUser);

            // 2. Create new StudentData
            const newStudentData: StudentData = {
                ...newUser,
                enrollmentDate: new Date().toISOString(),
                activeCourses: 1,
                dateOfBirth: new Date(data.student.dateOfBirth),
                address: data.student.address,
                guardian: data.guardian,
            };
            MOCK_STUDENTS_DATA.push(newStudentData);

            // 3. Create first Payment
            const today = new Date();
            const dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7); // Due in 7 days
            
            const newPayment: Payment = {
                id: newId,
                studentId: newId,
                amount: 280.00, // Standard amount, could come from course
                dueDate: dueDate,
                status: 'Pendente',
                courseName: `Matrícula - ${course?.name || 'Curso'}`
            };
            MOCK_PAYMENTS.push(newPayment);

            resolve();
        }, LATENCY);
    });
};
