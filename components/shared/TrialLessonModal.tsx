import React, { useState } from 'react';
import Modal from './Modal';
import { MOCK_COURSES } from '../../constants';

interface TrialLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TrialLessonModal: React.FC<TrialLessonModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [instrument, setInstrument] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending data
        console.log('Trial Lesson Request:', { name, email, instrument });
        setStep(2);
    };

    const resetAndClose = () => {
        setStep(1);
        setName('');
        setEmail('');
        setInstrument('');
        onClose();
    };
    
    const instruments = [...new Set(MOCK_COURSES.map(c => c.instrument))];

    return (
        <Modal isOpen={isOpen} onClose={resetAndClose} title={step === 1 ? 'Agendar Aula Experimental' : 'Solicitação Enviada!'}>
            {step === 1 ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Preencha o formulário abaixo e nossa secretaria entrará em contato para agendar o melhor horário para você!
                    </p>
                    <div>
                        <label htmlFor="trial-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seu Nome</label>
                        <input type="text" id="trial-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="trial-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Seu E-mail</label>
                        <input type="email" id="trial-email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="trial-instrument" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instrumento de Interesse</label>
                         <select id="trial-instrument" value={instrument} onChange={e => setInstrument(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                            <option value="" disabled>Selecione um instrumento</option>
                            {instruments.map(i => <option key={i} value={i}>{i}</option>)}
                             <option value="Outro">Outro</option>
                        </select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Enviar Solicitação</button>
                    </div>
                </form>
            ) : (
                <div className="text-center space-y-4 py-8">
                    <i className="fas fa-check-circle text-5xl text-green-500"></i>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Obrigado!</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Sua solicitação foi enviada com sucesso. Nossa equipe entrará em contato com você em breve.
                    </p>
                    <div className="pt-4">
                        <button onClick={resetAndClose} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Fechar</button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default TrialLessonModal;