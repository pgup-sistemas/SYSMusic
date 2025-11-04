import React, { useState } from 'react';
import { User } from '../../types';
import * as usersApi from '../../api/users';

interface ProfilePageProps {
    user: User;
    onUserUpdate: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUserUpdate }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isSavingInfo, setIsSavingInfo] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    
    const handleInfoSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingInfo(true);
        try {
            const updatedUser = await usersApi.updateUserProfile(user.id, name, email);
            onUserUpdate(updatedUser);
            setIsEditingInfo(false);
        } catch (error) {
            alert('Falha ao atualizar o perfil.');
        } finally {
            setIsSavingInfo(false);
        }
    };

    const handlePasswordSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('As novas senhas não coincidem.');
            return;
        }
        if (newPassword.length < 6) {
             setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
             return;
        }

        setIsSavingPassword(true);
        try {
            await usersApi.changeUserPassword(user.id, currentPassword, newPassword);
            setPasswordSuccess('Senha alterada com sucesso!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordError((error as Error).message);
        } finally {
            setIsSavingPassword(false);
        }
    };
    
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Seu Perfil</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Gerencie suas informações pessoais e de segurança.</p>
            </div>

            {/* Profile Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <form onSubmit={handleInfoSave}>
                    <div className="p-6">
                        <div className="flex items-center space-x-5">
                            <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full" />
                            <div>
                                {isEditingInfo ? (
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-indigo-500 focus:outline-none" />
                                ) : (
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h2>
                                )}
                                <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                                {isEditingInfo ? (
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                                ) : (
                                    <p className="mt-1 text-gray-900 dark:text-white">{name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Endereço de E-mail</label>
                                {isEditingInfo ? (
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                                ) : (
                                    <p className="mt-1 text-gray-900 dark:text-white">{email}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end space-x-3">
                        {isEditingInfo ? (
                            <>
                                <button type="button" onClick={() => { setIsEditingInfo(false); setName(user.name); setEmail(user.email); }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                                <button type="submit" disabled={isSavingInfo} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                                    {isSavingInfo && <i className="fas fa-spinner fa-spin mr-2"></i>}
                                    Salvar Alterações
                                </button>
                            </>
                        ) : (
                            <button type="button" onClick={() => setIsEditingInfo(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                Editar Informações
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <form onSubmit={handlePasswordSave}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Alterar Senha</h3>
                        <div className="mt-4 grid grid-cols-1 gap-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha Atual</label>
                                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nova Senha</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nova Senha</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                            </div>
                        </div>
                        {passwordError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{passwordError}</p>}
                        {passwordSuccess && <p className="mt-2 text-sm text-green-600 dark:text-green-400">{passwordSuccess}</p>}
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                        <button type="submit" disabled={isSavingPassword} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                            {isSavingPassword && <i className="fas fa-spinner fa-spin mr-2"></i>}
                            Alterar Senha
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;