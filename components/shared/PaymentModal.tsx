import React, { useState } from 'react';
import { Payment } from '../../types';
import * as paymentsApi from '../../api/payments';
import Modal from './Modal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, payment, onPaymentSuccess }) => {
    const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [errors, setErrors] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    const validate = () => {
        let tempErrors = { number: '', name: '', expiry: '', cvv: '' };
        let isValid = true;

        if (!/^\d{16}$/.test(card.number.replace(/\s/g, ''))) {
            tempErrors.number = 'Número de cartão inválido.';
            isValid = false;
        }
        if (!card.name.trim()) {
            tempErrors.name = 'Nome é obrigatório.';
            isValid = false;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
            tempErrors.expiry = 'Validade deve ser MM/AA.';
            isValid = false;
        }
        if (!/^\d{3,4}$/.test(card.cvv)) {
            tempErrors.cvv = 'CVV inválido.';
            isValid = false;
        }
        setErrors(tempErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        if (name === 'number') {
            value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').substr(0, 19);
        } else if (name === 'expiry') {
            value = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').substr(0, 5);
        } else if (name === 'cvv') {
            value = value.replace(/\D/g, '').substr(0, 4);
        }
        setCard(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentError('');
        if (!validate()) return;

        setIsProcessing(true);
        try {
            await paymentsApi.processPayment(payment.id);
            onPaymentSuccess();
        } catch (error) {
            setPaymentError('Falha no processamento do pagamento. Tente novamente.');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Pagar Fatura - R$ ${payment.amount.toFixed(2)}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-white">{payment.courseName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Vencimento: {payment.dueDate.toLocaleDateString('pt-BR')}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número do Cartão</label>
                    <input type="text" name="number" value={card.number} onChange={handleChange} placeholder="0000 0000 0000 0000" required className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                    {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome no Cartão</label>
                    <input type="text" name="name" value={card.name} onChange={handleChange} placeholder="Nome Completo" required className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                     {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Validade (MM/AA)</label>
                        <input type="text" name="expiry" value={card.expiry} onChange={handleChange} placeholder="MM/AA" required className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CVV</label>
                        <input type="text" name="cvv" value={card.cvv} onChange={handleChange} placeholder="123" required className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                        {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                    </div>
                </div>

                {paymentError && <p className="text-red-500 text-sm text-center">{paymentError}</p>}

                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} disabled={isProcessing} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="submit" disabled={isProcessing} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center min-w-[120px] justify-center">
                        {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : `Pagar R$ ${payment.amount.toFixed(2)}`}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default PaymentModal;