
import React, { useState, useMemo, useEffect } from 'react';
import { User, Material, Course, Role } from '../../types';
import { getCourseById, MOCK_COURSES } from '../../constants';
import * as materialsApi from '../../api/materials';
import Modal from '../shared/Modal';

interface MaterialFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (material: FormData) => Promise<void>;
    teacherId: number;
    materialToEdit: Material | null;
    isSaving: boolean;
}

const MaterialFormModal: React.FC<MaterialFormModalProps> = ({ isOpen, onClose, onSave, teacherId, materialToEdit, isSaving }) => {
    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');

    const teacherCourses = useMemo(() => MOCK_COURSES.filter(c => c.teacherId === teacherId), [teacherId]);

    useEffect(() => {
        if (materialToEdit) {
            setTitle(materialToEdit.title);
            setCourseId(String(materialToEdit.courseId));
            setFileName(materialToEdit.fileName);
            setFile(null);
        } else {
            setTitle('');
            setCourseId(teacherCourses.length > 0 ? String(teacherCourses[0].id) : '');
            setFileName('');
            setFile(null);
        }
    }, [materialToEdit, isOpen, teacherCourses]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !courseId) return;

        if (!materialToEdit && !file) {
            alert("Por favor, selecione um arquivo para o novo material.");
            return;
        }
        
        const formData = new FormData();
        formData.append('id', materialToEdit?.id.toString() || '0');
        formData.append('title', title);
        formData.append('courseId', courseId);
        formData.append('teacherId', String(teacherId));
        if (file) {
            formData.append('file', file);
        }
        
        await onSave(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={materialToEdit ? "Editar Material" : "Adicionar Novo Material"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título do Material</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
                <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Curso Associado</label>
                    <select id="course" value={courseId} onChange={e => setCourseId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option value="" disabled>Selecione um curso</option>
                        {teacherCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Arquivo {materialToEdit && "(opcional para alterar)"}</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <i className="fas fa-file-upload mx-auto h-12 w-12 text-gray-400"></i>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Selecione um arquivo</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                </label>
                            </div>
                             {fileName ? <p className="text-xs text-gray-500 dark:text-gray-300 font-medium">{fileName}</p> : <p className="text-xs text-gray-500">PDF, MP3, MP4, DOC etc.</p>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} disabled={isSaving} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="submit" disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                         {isSaving && <i className="fas fa-spinner fa-spin mr-2"></i>}
                         {isSaving ? 'Salvando...' : 'Salvar Material'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const getFileIcon = (fileType: Material['fileType']) => {
    switch (fileType) {
        case 'pdf': return { icon: 'fa-file-pdf', color: 'text-red-500' };
        case 'audio': return { icon: 'fa-file-audio', color: 'text-blue-500' };
        case 'video': return { icon: 'fa-file-video', color: 'text-purple-500' };
        case 'doc':
        default: return { icon: 'fa-file-word', color: 'text-gray-500' };
    }
}

const TeacherView: React.FC<{ user: User }> = ({ user }) => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [materialToEdit, setMaterialToEdit] = useState<Material | null>(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const fetchMaterials = async () => {
        setIsLoading(true);
        const fetchedMaterials = await materialsApi.getMaterialsByTeacher(user.id);
        setMaterials(fetchedMaterials);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchMaterials();
    }, [user.id]);

    const filteredMaterials = useMemo(() => {
        return showFavoritesOnly ? materials.filter(m => m.isFavorite) : materials;
    }, [materials, showFavoritesOnly]);

    const handleSave = async (formData: FormData) => {
        setIsSaving(true);
        try {
            const id = parseInt(formData.get('id') as string);
            if (id > 0) {
                await materialsApi.updateMaterial(formData);
            } else {
                await materialsApi.addMaterial(formData);
            }
        } catch (error) {
            console.error(error);
            alert((error as Error).message);
        }
        setIsSaving(false);
        setIsModalOpen(false);
        setMaterialToEdit(null);
        fetchMaterials();
    };

    const handleDelete = async (materialId: number) => {
        if (window.confirm("Tem certeza que deseja excluir este material?")) {
            await materialsApi.deleteMaterial(materialId);
            fetchMaterials();
        }
    };

    const handleToggleFavorite = async (materialId: number) => {
        await materialsApi.toggleFavorite(materialId);
        fetchMaterials();
    };
    
    const handleEdit = (material: Material) => {
        setMaterialToEdit(material);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Materiais de Aula</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Adicione e gerencie os materiais para seus cursos.</p>
            </div>
            
            <div className="flex justify-between items-center">
                <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                        showFavoritesOnly 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    <i className={`fas fa-star mr-2 ${showFavoritesOnly ? '' : 'text-yellow-400'}`}></i>
                    {showFavoritesOnly ? 'Mostrar Todos' : 'Mostrar Favoritos'}
                </button>
                 <button
                    onClick={() => { setMaterialToEdit(null); setIsModalOpen(true); }}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <i className="fa fa-plus mr-2"></i>Adicionar Material
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {showFavoritesOnly ? 'Materiais Favoritos' : 'Seus Materiais'}
                </h3>
                {filteredMaterials.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMaterials.map(material => {
                            const course = getCourseById(material.courseId);
                            const iconInfo = getFileIcon(material.fileType);
                            return (
                                <div key={material.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <i className={`fas ${iconInfo.icon} ${iconInfo.color} text-3xl`}></i>
                                            <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{backgroundColor: course?.color, color: '#fff'}}>{course?.name || 'Curso'}</span>
                                        </div>
                                        <div className="flex items-center mt-3 gap-2">
                                            <h4 className="font-bold text-gray-800 dark:text-white">{material.title}</h4>
                                            <button onClick={() => handleToggleFavorite(material.id)} className={`text-gray-400 hover:text-yellow-500 ${material.isFavorite ? 'text-yellow-400' : ''}`} title="Favoritar">
                                                <i className={`${material.isFavorite ? 'fas' : 'far'} fa-star`}></i>
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{material.fileName}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Enviado em: {material.uploadDate.toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div className="flex items-center justify-end space-x-3 mt-4">
                                        <button onClick={() => handleEdit(material)} className="text-gray-400 hover:text-indigo-500" title="Editar"><i className="fas fa-pencil-alt"></i></button>
                                        <button onClick={() => handleDelete(material.id)} className="text-gray-400 hover:text-red-500" title="Excluir"><i className="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <i className={`fas ${showFavoritesOnly ? 'fa-star' : 'fa-folder-open'} text-4xl mb-3`}></i>
                        <p>{showFavoritesOnly ? 'Você ainda não marcou nenhum material como favorito.' : 'Você ainda não adicionou nenhum material.'}</p>
                    </div>
                )}
            </div>
            
            <MaterialFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                teacherId={user.id}
                materialToEdit={materialToEdit}
                isSaving={isSaving}
            />
        </div>
    );
}

const StudentView: React.FC<{ user: User }> = ({ user }) => {
    // This is a simplified view. In a real app, you'd get the student's courses first.
    // For now, we'll show all materials as an example.
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);

     const fetchMaterials = async () => {
        setIsLoading(true);
        // In a real scenario, this would fetch materials for the student's enrolled courses
        const fetchedMaterials = await materialsApi.getAllMaterials();
        setMaterials(fetchedMaterials);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
    }

     return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Materiais de Aula</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Acesse os materiais disponibilizados pelos seus professores.</p>
            </div>
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                {materials.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materials.map(material => {
                            const course = getCourseById(material.courseId);
                            const iconInfo = getFileIcon(material.fileType);
                            return (
                                <div key={material.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <i className={`fas ${iconInfo.icon} ${iconInfo.color} text-3xl`}></i>
                                            <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{backgroundColor: course?.color, color: '#fff'}}>{course?.name || 'Curso'}</span>
                                        </div>
                                        <h4 className="font-bold text-gray-800 dark:text-white mt-3">{material.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{material.fileName}</p>
                                    </div>
                                    <div className="text-right mt-4">
                                        <a href={material.fileUrl} download={material.fileName} className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                                            <i className="fas fa-download mr-2"></i>Baixar
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <i className="fas fa-folder-open text-4xl mb-3"></i>
                        <p>Nenhum material disponível no momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const MateriaisPage: React.FC<{ user: User }> = ({ user }) => {
    switch (user.role) {
        case Role.Teacher:
            return <TeacherView user={user} />;
        case Role.Student:
            return <StudentView user={user} />;
        default:
             return <div className="text-center py-16 text-gray-500 dark:text-gray-400">Página de materiais não disponível para este perfil.</div>;
    }
};

export default MateriaisPage;
