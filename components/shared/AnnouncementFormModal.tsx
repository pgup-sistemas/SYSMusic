import React, { useState, useEffect } from 'react';
import { Announcement } from '../../types';
import Modal from './Modal';

interface AnnouncementFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { title: string, content: string }) => Promise<void>;
    announcementToEdit: Announcement | null;
    isSaving: boolean;
}

const AnnouncementFormModal: React.FC<AnnouncementFormModalProps> = ({ isOpen, onClose, onSave, announcementToEdit, isSaving }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (announcementToEdit) {
            setTitle(announcementToEdit.title);
            setContent(announcementToEdit.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [announcementToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave({ title, content });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={announcementToEdit ? 'Editar Publicação' : 'Nova Publicação'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Conteúdo</label>
                    <textarea value={content} onChange={e => setContent(e.target.value)} required rows={5} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"></textarea>
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

export default AnnouncementFormModal;
