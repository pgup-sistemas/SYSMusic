import React, { useState } from 'react';
import Modal from './Modal';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending email
        console.log('Sending password reset email to:', email);
        setStep(2);
    };
    
    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate password update
        console.log('Password reset for', email, 'to', newPassword);
        setStep(3);
    };

    const resetAndClose = () => {
        setStep(1);
        setEmail('');
        setNewPassword('');
        onClose();
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <form onSubmit={handleSendEmail} className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Por favor, insira seu e-mail para enviarmos as instruções de redefinição de senha.
                        </p>
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                            <input
                                id="reset-email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="seu@email.com"
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                Enviar Instruções
                            </button>
                        </div>
                    </form>
                );
            case 2:
                 return (
                    <div className="text-center space-y-4">
                        <i className="fas fa-paper-plane text-4xl text-green-500"></i>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Instruções Enviadas!</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                           Se um conta com o e-mail <strong>{email}</strong> existir, um link de recuperação foi enviado.
                        </p>
                        {/* In a real app, the user would click a link in their email. Here, we simulate it. */}
                        <button onClick={() => handleResetPassword(new Event('submit') as any)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                           Simular clique no link e redefinir senha
                        </button>
                    </div>
                );
             case 3:
                 return (
                    <div className="text-center space-y-4">
                        <i className="fas fa-check-circle text-4xl text-green-500"></i>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Senha Redefinida!</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Sua senha foi alterada com sucesso. Você já pode fechar esta janela e fazer login com sua nova senha.
                        </p>
                         <div className="flex justify-end pt-2">
                            <button onClick={resetAndClose} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                Fechar
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={resetAndClose} title="Redefinir Senha">
            {renderStep()}
        </Modal>
    );
};

export default ForgotPasswordModal;