import React, { useState, useEffect } from 'react';

const ConfiguracoesPage: React.FC = () => {
    const [publicKey, setPublicKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showSecret, setShowSecret] = useState(false);

    useEffect(() => {
        // Load saved keys from localStorage on component mount
        const savedPublicKey = localStorage.getItem('payment_gateway_pk');
        const savedSecretKey = localStorage.getItem('payment_gateway_sk');
        if (savedPublicKey) setPublicKey(savedPublicKey);
        if (savedSecretKey) setSecretKey(savedSecretKey);
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setShowSuccess(false);

        // Simulate saving to a secure backend
        setTimeout(() => {
            localStorage.setItem('payment_gateway_pk', publicKey);
            localStorage.setItem('payment_gateway_sk', secretKey);
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Gerencie as integrações e configurações do sistema.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <form onSubmit={handleSave}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Gateway de Pagamento</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Insira as credenciais de API do seu provedor de pagamento (ex: Stripe, PagSeguro).</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="public-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chave Pública (Public Key)</label>
                                <input
                                    id="public-key"
                                    type="text"
                                    value={publicKey}
                                    onChange={e => setPublicKey(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                                    placeholder="pk_test_..."
                                />
                            </div>
                            <div>
                                <label htmlFor="secret-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chave Secreta (Secret Key)</label>
                                <div className="relative mt-1">
                                    <input
                                        id="secret-key"
                                        type={showSecret ? 'text' : 'password'}
                                        value={secretKey}
                                        onChange={e => setSecretKey(e.target.value)}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                                        placeholder="sk_test_..."
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowSecret(!showSecret)}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        <i className={`fas ${showSecret ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end items-center">
                         {showSuccess && (
                            <p className="text-green-600 dark:text-green-400 mr-4 text-sm font-medium">
                                <i className="fas fa-check-circle mr-1"></i>Credenciais salvas com sucesso!
                            </p>
                        )}
                        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                            {isSaving && <i className="fas fa-spinner fa-spin mr-2"></i>}
                            {isSaving ? 'Salvando...' : 'Salvar Credenciais'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfiguracoesPage;