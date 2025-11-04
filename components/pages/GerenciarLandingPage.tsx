import React, { useState, useEffect } from 'react';
import { Announcement, LandingPageContent } from '../../types';
import * as landingPageApi from '../../api/landingPage';
import Modal from '../shared/Modal';

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


const GerenciarLandingPage: React.FC = () => {
    const [content, setContent] = useState<LandingPageContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        const data = await landingPageApi.getContent();
        setContent(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleHeroSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;
        setIsSaving(true);
        await landingPageApi.updateHero(content.heroTitle, content.heroSubtitle);
        setIsSaving(false);
        alert('Seção principal atualizada!');
    };
    
    const handleAnnouncementSave = async (data: { title: string; content: string }) => {
        setIsSaving(true);
        if (announcementToEdit) {
            await landingPageApi.updateAnnouncement({ ...announcementToEdit, ...data });
        } else {
            await landingPageApi.addAnnouncement(data);
        }
        setIsSaving(false);
        setIsModalOpen(false);
        setAnnouncementToEdit(null);
        fetchData();
    };

    const handleAnnouncementDelete = async (id: number) => {
        if(window.confirm('Tem certeza que deseja excluir esta publicação?')) {
            await landingPageApi.deleteAnnouncement(id);
            fetchData();
        }
    };

    if (isLoading || !content) {
        return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciar Conteúdo Público</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Edite os textos e as notícias da página inicial do site.</p>
            </div>

            {/* Hero Section Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Seção Principal (Hero)</h2>
                <form onSubmit={handleHeroSave} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título Principal</label>
                        <input type="text" value={content.heroTitle} onChange={e => setContent(c => c ? {...c, heroTitle: e.target.value} : null)} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subtítulo</label>
                        <textarea value={content.heroSubtitle} onChange={e => setContent(c => c ? {...c, heroSubtitle: e.target.value} : null)} rows={3} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                    </div>
                    <div className="flex justify-end">
                         <button type="submit" disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                            {isSaving && <i className="fas fa-spinner fa-spin mr-2"></i>}
                            Salvar Seção Principal
                        </button>
                    </div>
                </form>
            </div>

            {/* Announcements Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Notícias e Anúncios</h2>
                    <button onClick={() => { setAnnouncementToEdit(null); setIsModalOpen(true); }} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
                        <i className="fa fa-plus mr-2"></i>Nova Publicação
                    </button>
                </div>
                <div className="space-y-4">
                    {content.announcements.map(ann => (
                        <div key={ann.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{ann.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{ann.content}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(ann.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="flex-shrink-0 flex items-center space-x-3 ml-4">
                                <button onClick={() => { setAnnouncementToEdit(ann); setIsModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"><i className="fas fa-pencil-alt"></i></button>
                                <button onClick={() => handleAnnouncementDelete(ann.id)} className="text-red-600 hover:text-red-900 dark:text-red-400"><i className="fas fa-trash"></i></button>
                            </div>
                        </div>
                    ))}
                    {content.announcements.length === 0 && <p className="text-center text-gray-500 py-4">Nenhuma publicação encontrada.</p>}
                </div>
            </div>

            <AnnouncementFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAnnouncementSave}
                announcementToEdit={announcementToEdit}
                isSaving={isSaving}
            />
        </div>
    );
};

export default GerenciarLandingPage;