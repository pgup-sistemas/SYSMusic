import React, { useState, useEffect } from 'react';
import { Room } from '../../types';
import * as roomsApi from '../../api/rooms';
import Modal from '../shared/Modal';

interface RoomFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => Promise<void>;
    roomToEdit: Room | null;
    isSaving: boolean;
}

const RoomFormModal: React.FC<RoomFormModalProps> = ({ isOpen, onClose, onSave, roomToEdit, isSaving }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (roomToEdit) {
            setName(roomToEdit.name);
        } else {
            setName('');
        }
    }, [roomToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(name);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={roomToEdit ? 'Editar Sala' : 'Adicionar Nova Sala'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="room-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Sala</label>
                    <input
                        id="room-name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Ex: Estúdio de Gravação"
                    />
                </div>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} disabled={isSaving} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="submit" disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                        {isSaving && <i className="fas fa-spinner fa-spin mr-2"></i>}
                        Salvar
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const SalasPage: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

    const fetchRooms = async () => {
        setIsLoading(true);
        const fetchedRooms = await roomsApi.getRooms();
        setRooms(fetchedRooms);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleSave = async (name: string) => {
        setIsSaving(true);
        if (roomToEdit) {
            await roomsApi.updateRoom({ ...roomToEdit, name });
        } else {
            await roomsApi.addRoom(name);
        }
        setIsSaving(false);
        setIsModalOpen(false);
        setRoomToEdit(null);
        fetchRooms();
    };

    const handleDelete = async (roomId: number) => {
        if (window.confirm("Tem certeza que deseja excluir esta sala?")) {
            await roomsApi.deleteRoom(roomId);
            fetchRooms();
        }
    };

    const handleEdit = (room: Room) => {
        setRoomToEdit(room);
        setIsModalOpen(true);
    };
    
    const handleAddNew = () => {
        setRoomToEdit(null);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Salas</h1>
                    <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Adicione, edite e remova as salas da escola.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <i className="fa fa-plus mr-2"></i>Adicionar Sala
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Nome da Sala</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{room.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{room.name}</td>
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <button onClick={() => handleEdit(room)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200" title="Editar"><i className="fas fa-pencil-alt"></i></button>
                                        <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200" title="Excluir"><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {rooms.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">Nenhuma sala cadastrada.</div>
                )}
            </div>
             <RoomFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                roomToEdit={roomToEdit}
                isSaving={isSaving}
             />
        </div>
    );
};

export default SalasPage;