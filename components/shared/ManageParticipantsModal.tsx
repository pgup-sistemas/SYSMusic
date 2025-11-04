import React, { useState, useEffect, useMemo } from 'react';
import { Event, User, Role } from '../../types';
import Modal from './Modal';

interface ManageParticipantsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (participantIds: number[]) => Promise<void>;
    event: Event;
    allUsers: User[];
    isSaving: boolean;
}

const ManageParticipantsModal: React.FC<ManageParticipantsModalProps> = ({ isOpen, onClose, onSave, event, allUsers, isSaving }) => {
    const [participantIds, setParticipantIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (event) {
            setParticipantIds(new Set(event.participantIds));
        }
    }, [event, isOpen]);

    const { currentParticipants, availableUsers } = useMemo(() => {
        const participants: User[] = [];
        const available: User[] = [];
        // Only allow active teachers and students to be added
        const eligibleUsers = allUsers.filter(u => u.isActive && (u.role === Role.Teacher || u.role === Role.Student));

        eligibleUsers.forEach(user => {
            if (participantIds.has(user.id)) {
                participants.push(user);
            } else {
                available.push(user);
            }
        });
        return { currentParticipants: participants, availableUsers: available };
    }, [allUsers, participantIds]);

    const handleAdd = (userId: number) => {
        setParticipantIds(prev => new Set(prev).add(userId));
    };

    const handleRemove = (userId: number) => {
        setParticipantIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
        });
    };

    const handleSave = () => {
        onSave(Array.from(participantIds));
    };

    const UserListItem: React.FC<{ user: User, onAction: () => void, actionIcon: 'plus' | 'minus' }> = ({ user, onAction, actionIcon }) => (
        <li className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center">
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                </div>
            </div>
            <button
                onClick={onAction}
                className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${actionIcon === 'plus' ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800' : 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'}`}
            >
                <i className={`fas fa-${actionIcon}`}></i>
            </button>
        </li>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Gerenciar Participantes - ${event?.name}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-hidden">
                {/* Available Users */}
                <div className="flex flex-col">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Usuários Disponíveis</h4>
                    <ul className="space-y-1 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-y-auto">
                        {availableUsers.length > 0 ? availableUsers.map(user => (
                            <UserListItem key={user.id} user={user} onAction={() => handleAdd(user.id)} actionIcon="plus" />
                        )) : <p className="text-center text-sm text-gray-500 py-4">Nenhum usuário disponível.</p>}
                    </ul>
                </div>
                {/* Current Participants */}
                <div className="flex flex-col">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Participantes Atuais ({currentParticipants.length})</h4>
                    <ul className="space-y-1 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-y-auto">
                        {currentParticipants.length > 0 ? currentParticipants.map(user => (
                            <UserListItem key={user.id} user={user} onAction={() => handleRemove(user.id)} actionIcon="minus" />
                        )) : <p className="text-center text-sm text-gray-500 py-4">Nenhum participante adicionado.</p>}
                    </ul>
                </div>
            </div>
             <div className="flex justify-end pt-6 mt-4 border-t dark:border-gray-700">
                <button type="button" onClick={onClose} disabled={isSaving} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:opacity-50">Cancelar</button>
                <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                    {isSaving && <i className="fas fa-spinner fa-spin mr-2"></i>}
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </Modal>
    );
};

export default ManageParticipantsModal;