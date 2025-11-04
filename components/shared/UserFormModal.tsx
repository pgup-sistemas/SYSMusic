import React, { useState, useEffect } from 'react';
import { User, Role } from '../../types';
import Modal from './Modal';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
    userToEdit: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: Role.Student,
        password: '',
    });

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name,
                email: userToEdit.email,
                role: userToEdit.role,
                password: '', // Password is not pre-filled for security
            });
        } else {
            setFormData({ name: '', email: '', role: Role.Student, password: '' });
        }
    }, [userToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userData: User = {
            id: userToEdit?.id || Date.now(),
            avatarUrl: userToEdit?.avatarUrl || `https://picsum.photos/seed/${Date.now()}/100/100`,
            isActive: userToEdit?.isActive ?? true,
            password: formData.password || userToEdit?.password || 'password',
            ...formData,
        };
        onSave(userData);
    };

    const roles = Object.values(Role);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={userToEdit ? "Editar Usuário" : "Adicionar Novo Usuário"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Perfil</label>
                    <select name="role" id="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Senha {userToEdit ? "(Deixe em branco para não alterar)" : ""}
                    </label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required={!userToEdit} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Salvar</button>
                </div>
            </form>
        </Modal>
    );
};

export default UserFormModal;
