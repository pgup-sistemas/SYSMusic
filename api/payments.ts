import { Payment, Role } from '../types';
import { MOCK_PAYMENTS, MOCK_USERS } from '../constants';

// Simulate network latency
const LATENCY = 300;

export const getPayments = (): Promise<Payment[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Return a deep copy to prevent direct mutation of the mock data
            resolve(JSON.parse(JSON.stringify(MOCK_PAYMENTS)).map((p: any) => ({
                ...p,
                dueDate: new Date(p.dueDate),
                paidDate: p.paidDate ? new Date(p.paidDate) : undefined,
            })));
        }, LATENCY);
    });
};

export const updatePaymentStatus = (paymentId: number, status: Payment['status'], method: Payment['paymentMethod'] = 'Manual'): Promise<Payment> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_PAYMENTS.findIndex(p => p.id === paymentId);
            if (index !== -1) {
                MOCK_PAYMENTS[index].status = status;
                if(status === 'Pago') {
                    MOCK_PAYMENTS[index].paymentMethod = method;
                    MOCK_PAYMENTS[index].paidDate = new Date();
                }
                resolve(MOCK_PAYMENTS[index]);
            } else {
                reject(new Error('Payment not found'));
            }
        }, LATENCY);
    });
};

export const processPayment = (paymentId: number): Promise<Payment> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_PAYMENTS.findIndex(p => p.id === paymentId);
            if (index !== -1) {
                if (MOCK_PAYMENTS[index].status === 'Pago') {
                    return reject(new Error('This payment has already been paid.'));
                }
                MOCK_PAYMENTS[index].status = 'Pago';
                MOCK_PAYMENTS[index].paymentMethod = 'Cartão de Crédito';
                MOCK_PAYMENTS[index].paidDate = new Date();
                resolve(MOCK_PAYMENTS[index]);
            } else {
                reject(new Error('Payment not found'));
            }
        }, 1500); // Simulate gateway processing time
    });
};

export const generateMonthlyPayments = (): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const activeStudents = MOCK_USERS.filter(u => u.role === Role.Student && u.isActive);
            const today = new Date();
            const dueDate = new Date(today.getFullYear(), today.getMonth() + 1, 10); // Due date is 10th of next month

            activeStudents.forEach(student => {
                // Check if a payment for this month already exists to avoid duplicates
                const alreadyExists = MOCK_PAYMENTS.some(p => 
                    p.studentId === student.id &&
                    p.dueDate.getMonth() === dueDate.getMonth() &&
                    p.dueDate.getFullYear() === dueDate.getFullYear()
                );

                if (!alreadyExists) {
                    const newPayment: Payment = {
                        id: Date.now() + student.id, // simple unique ID
                        studentId: student.id,
                        amount: 280.00, // standard amount
                        dueDate: dueDate,
                        status: 'Pendente',
                        courseName: `Mensalidade - ${dueDate.toLocaleString('pt-BR', { month: 'long' })}`
                    };
                    MOCK_PAYMENTS.push(newPayment);
                }
            });
            resolve();
        }, LATENCY * 2); // Longer latency for a "bigger" operation
    });
};