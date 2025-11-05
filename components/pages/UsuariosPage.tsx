import React, { useState, useMemo, useEffect } from 'react';
import { User, Role } from '../../types';
import * as usersApi from '../../api/users';
import UserFormModal from '../shared/UserFormModal';
import Pagination from '../shared/Pagination';
import { normalizeText } from '../../utils';

const ITEMS_PER_PAGE = 10;

const UsuariosPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const fetchedUsers = await usersApi.getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter, statusFilter]);

    const filteredUsers = useMemo(() => {
        const normalizedSearch = normalizeText(searchTerm);
        return users.filter(user => {
            const roleMatch = roleFilter === 'all' || user.role === roleFilter;
            const statusMatch = statusFilter === 'all' || (statusFilter === 'active' ? user.isActive : !user.isActive);
            const searchTermMatch = normalizeText(user.name).includes(normalizedSearch) ||
                                    normalizeText(user.email).includes(normalizedSearch);
            return roleMatch && statusMatch && searchTermMatch;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);
    
    const currentUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const handleAddNew = () => {
        setUserToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleToggleActive = async (userId: number) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        try {
            await usersApi.toggleUserStatus(userId, !user.isActive);
            await fetchUsers();
        } catch (error) {
            alert((error as Error).message);
        }
    };

    const handleSaveUser = async (userData: User) => {
        try {
            if (userToEdit) {
                await usersApi.updateUser(userData);
            } else {
                const { name, email, role, password } = userData;
                if (!password) {
                    alert('A senha é obrigatória para novos usuários.');
                    return;
                }
                await usersApi.addUser({ name, email, role, password });
            }
            setIsModalOpen(false);
            setUserToEdit(null);
            await fetchUsers();
        } catch (error) {
            alert((error as Error).message);
        }
    };
    
    const roles = Object.values(Role);
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Usuários</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Gerencie todos os usuários do sistema em um só lugar.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <div className="relative w-full sm:max-w-xs">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fa fa-search text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                         <div className="relative w-full sm:max-w-xs">
                            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as Role | 'all')} className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="all">Todos os Perfis</option>
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="relative w-full sm:max-w-xs">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="all">Todos os Status</option>
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-shrink-0"
                    >
                        <i className="fa fa-plus mr-2"></i>Adicionar Usuário
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Perfil</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {user.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200" title="Editar">
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button onClick={() => handleToggleActive(user.id)} className={`hover:text-gray-900 dark:hover:text-gray-200 ${user.isActive ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} title={user.isActive ? 'Desativar' : 'Ativar'}>
                                            <i className={`fas ${user.isActive ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            Nenhum usuário encontrado.
                        </div>
                    )}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredUsers.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            </div>
            
            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                userToEdit={userToEdit}
            />
        </div>
    );
};

export default UsuariosPage;