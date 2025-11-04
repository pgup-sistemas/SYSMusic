import React, { useState, useMemo } from 'react';
import { Course, Guardian } from '../../types';
import { MOCK_COURSES, getUserById } from '../../constants';
import * as enrollmentsApi from '../../api/enrollments';

const initialStudentState = { name: '', email: '', dateOfBirth: '', address: '' };
const initialGuardianState = { name: '', email: '', phone: '', relationship: '' };

const Stepper: React.FC<{ step: number }> = ({ step }) => {
    const steps = ["Aluno", "Responsável", "Curso", "Revisão"];
    return (
        <div className="flex justify-between items-center mb-8">
            {steps.map((name, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-300 ${step > index + 1 ? 'bg-green-500' : step === index + 1 ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                            {step > index + 1 ? <i className="fas fa-check"></i> : index + 1}
                        </div>
                        <p className={`mt-2 text-sm font-medium ${step >= index + 1 ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{name}</p>
                    </div>
                    {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${step > index + 1 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

const MatriculasPage: React.FC<{ setActivePage: (page: string) => void; }> = ({ setActivePage }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [studentData, setStudentData] = useState(initialStudentState);
    const [isMinor, setIsMinor] = useState(false);
    const [guardianData, setGuardianData] = useState(initialGuardianState);
    const [courseId, setCourseId] = useState<number | ''>('');
    
    const calculateAge = (dob: string) => {
        if (!dob) return 0;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStudentData(prev => ({ ...prev, [name]: value }));
        if (name === 'dateOfBirth') {
            setIsMinor(calculateAge(value) < 18);
        }
    };

    const handleGuardianChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setGuardianData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        if (courseId === '') return;
        setIsSubmitting(true);
        try {
            await enrollmentsApi.createEnrollment({
                student: studentData,
                guardian: isMinor ? guardianData : undefined,
                courseId: courseId
            });
            nextStep(); // Go to success step
        } catch (error) {
            alert('Ocorreu um erro ao realizar a matrícula.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const resetForm = () => {
        setStep(1);
        setStudentData(initialStudentState);
        setGuardianData(initialGuardianState);
        setCourseId('');
        setIsMinor(false);
    };

    const selectedCourse = useMemo(() => MOCK_COURSES.find(c => c.id === courseId), [courseId]);
    const teacher = useMemo(() => selectedCourse ? getUserById(selectedCourse.teacherId) : null, [selectedCourse]);

    const renderStepContent = () => {
        switch (step) {
            case 1: // Student Info
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Dados do Aluno</h3>
                        <input name="name" value={studentData.name} onChange={handleStudentChange} placeholder="Nome Completo" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        <input name="email" type="email" value={studentData.email} onChange={handleStudentChange} placeholder="E-mail" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        <input name="dateOfBirth" type="date" value={studentData.dateOfBirth} onChange={handleStudentChange} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        <input name="address" value={studentData.address} onChange={handleStudentChange} placeholder="Endereço Completo" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        <div className="flex justify-end">
                            <button onClick={() => { isMinor ? nextStep() : setStep(3) }} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Próximo</button>
                        </div>
                    </div>
                );
            case 2: // Guardian Info
                return (
                     <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Dados do Responsável Legal</h3>
                        <input name="name" value={guardianData.name} onChange={handleGuardianChange} placeholder="Nome Completo do Responsável" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        <input name="email" type="email" value={guardianData.email} onChange={handleGuardianChange} placeholder="E-mail do Responsável" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        <input name="phone" type="tel" value={guardianData.phone} onChange={handleGuardianChange} placeholder="Telefone do Responsável" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        <select name="relationship" value={guardianData.relationship} onChange={handleGuardianChange} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <option value="" disabled>Grau de Parentesco</option>
                            <option>Pai</option><option>Mãe</option><option>Responsável Legal</option>
                        </select>
                         <div className="flex justify-between">
                            <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Voltar</button>
                            <button onClick={nextStep} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Próximo</button>
                        </div>
                    </div>
                );
            case 3: // Course Selection
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Seleção de Curso</h3>
                        <select value={courseId} onChange={e => setCourseId(Number(e.target.value))} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <option value="" disabled>Selecione um curso</option>
                            {MOCK_COURSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {teacher && <p className="text-sm text-gray-600 dark:text-gray-400">Professor(a): {teacher.name}</p>}
                        <div className="flex justify-between">
                            <button onClick={() => isMinor ? prevStep() : setStep(1)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Voltar</button>
                            <button onClick={nextStep} disabled={!courseId} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">Próximo</button>
                        </div>
                    </div>
                );
            case 4: // Review
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Revisão da Matrícula</h3>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md space-y-2">
                            <p><strong>Aluno:</strong> {studentData.name}</p>
                            <p><strong>Email:</strong> {studentData.email}</p>
                             {isMinor && guardianData.name && <>
                                <h4 className="font-semibold pt-2 mt-2 border-t dark:border-gray-600">Responsável</h4>
                                <p><strong>Nome:</strong> {guardianData.name}</p>
                                <p><strong>Email:</strong> {guardianData.email}</p>
                             </>}
                             <h4 className="font-semibold pt-2 mt-2 border-t dark:border-gray-600">Curso</h4>
                             <p><strong>Curso:</strong> {selectedCourse?.name}</p>
                             <p><strong>Professor:</strong> {teacher?.name}</p>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Voltar</button>
                            <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center">
                                {isSubmitting && <i className="fas fa-spinner fa-spin mr-2"></i>}
                                {isSubmitting ? 'Confirmando...' : 'Confirmar Matrícula'}
                            </button>
                        </div>
                    </div>
                );
             case 5: // Success
                return (
                    <div className="text-center space-y-4 py-8">
                        <i className="fas fa-check-circle text-6xl text-green-500"></i>
                        <h3 className="text-2xl font-bold">Matrícula Realizada com Sucesso!</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            O aluno {studentData.name} foi matriculado no curso de {selectedCourse?.name}.<br/>
                            A primeira mensalidade já foi gerada.
                        </p>
                        <div className="flex justify-center gap-4 pt-4">
                            <button onClick={resetForm} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Realizar Nova Matrícula</button>
                            <button onClick={() => setActivePage('Agenda')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Ir para a Agenda</button>
                        </div>
                    </div>
                );
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nova Matrícula</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Siga as etapas para matricular um novo aluno no sistema.</p>
            </div>
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
                {step < 5 && <Stepper step={step} />}
                <div className="mt-8">
                    {renderStepContent()}
                </div>
            </div>
        </div>
    );
};

export default MatriculasPage;