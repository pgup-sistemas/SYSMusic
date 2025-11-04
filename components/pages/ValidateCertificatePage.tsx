
import React, { useState } from 'react';
import { Certificate } from '../../types';
import { MOCK_CERTIFICATES, getUserById } from '../../constants';

const ValidateCertificatePage: React.FC = () => {
    const [code, setCode] = useState('');
    const [result, setResult] = useState<'idle' | 'valid' | 'invalid'>('idle');
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleValidate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult('idle');
        setCertificate(null);

        // Simulate API call
        setTimeout(() => {
            const foundCertificate = MOCK_CERTIFICATES.find(c => c.validationCode.toLowerCase() === code.toLowerCase());
            if (foundCertificate) {
                setCertificate(foundCertificate);
                setResult('valid');
            } else {
                setResult('invalid');
            }
            setIsLoading(false);
        }, 500);
    };

    const student = certificate ? getUserById(certificate.studentId) : null;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Validar Certificado</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Insira o código de validação encontrado no certificado para verificar sua autenticidade.
                    </p>
                </div>
                
                <form onSubmit={handleValidate} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="validation-code" className="sr-only">Código de Validação</label>
                        <input
                            id="validation-code"
                            type="text"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            required
                            placeholder="Ex: XYZ-123-ABC"
                            className="block w-full px-4 py-3 text-center border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-50 dark:bg-gray-700 font-mono"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        {isLoading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Verificando...</> : <><i className="fas fa-check-circle mr-2"></i>Validar</>}
                    </button>
                </form>

                {result !== 'idle' && (
                    <div className="mt-8 pt-6 border-t dark:border-gray-700">
                        {result === 'valid' && certificate && student && (
                             <div className="bg-green-50 dark:bg-green-900/50 p-6 rounded-lg text-center">
                                <i className="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
                                <h3 className="text-xl font-bold text-green-800 dark:text-green-200">Certificado Válido!</h3>
                                <div className="mt-4 text-left space-y-2 text-gray-700 dark:text-gray-300">
                                    <p><strong>Aluno:</strong> {student.name}</p>
                                    <p><strong>Evento:</strong> {certificate.eventName}</p>
                                    <p><strong>Curso:</strong> {certificate.courseName}</p>
                                    <p><strong>Data de Emissão:</strong> {certificate.issueDate.toLocaleDateString('pt-BR')}</p>
                                    <p><strong>Código:</strong> <span className="font-mono">{certificate.validationCode}</span></p>
                                </div>
                             </div>
                        )}
                        {result === 'invalid' && (
                            <div className="bg-red-50 dark:bg-red-900/50 p-6 rounded-lg text-center">
                                <i className="fas fa-times-circle text-5xl text-red-500 mb-4"></i>
                                <h3 className="text-xl font-bold text-red-800 dark:text-red-200">Certificado Inválido</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    O código inserido não foi encontrado em nossos registros. Por favor, verifique e tente novamente.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ValidateCertificatePage;
