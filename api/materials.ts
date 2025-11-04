import { Material } from '../types';
import { MOCK_MATERIALS } from '../constants';

const LATENCY = 500;

const getFileType = (fileName: string): Material['fileType'] => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(extension)) return 'pdf';
    if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
    if (['mp4', 'mov', 'avi'].includes(extension)) return 'video';
    return 'doc';
};

export const getAllMaterials = (): Promise<Material[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(MOCK_MATERIALS)).map((m: any) => ({
                ...m,
                uploadDate: new Date(m.uploadDate)
            })));
        }, LATENCY);
    });
};


export const getMaterialsByTeacher = (teacherId: number): Promise<Material[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const materials = MOCK_MATERIALS.filter(m => m.teacherId === teacherId);
            resolve(JSON.parse(JSON.stringify(materials)).map((m: any) => ({
                ...m,
                uploadDate: new Date(m.uploadDate)
            })));
        }, LATENCY);
    });
};

export const addMaterial = (formData: FormData): Promise<Material> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const file = formData.get('file') as File;
            if (!file) {
                return reject(new Error('Nenhum arquivo enviado. Por favor, selecione um arquivo.'));
            }
            
            const newMaterial: Material = {
                id: Date.now(),
                title: formData.get('title') as string,
                courseId: parseInt(formData.get('courseId') as string),
                teacherId: parseInt(formData.get('teacherId') as string),
                fileName: file.name,
                fileType: getFileType(file.name),
                uploadDate: new Date(),
                isFavorite: false,
                fileUrl: URL.createObjectURL(file), // Simulate file storage
            };
            MOCK_MATERIALS.push(newMaterial);
            resolve(newMaterial);
        }, LATENCY);
    });
};

export const updateMaterial = (formData: FormData): Promise<Material> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const id = parseInt(formData.get('id') as string);
            const index = MOCK_MATERIALS.findIndex(m => m.id === id);
            if (index !== -1) {
                const file = formData.get('file') as File | null;
                const existingMaterial = MOCK_MATERIALS[index];

                existingMaterial.title = formData.get('title') as string;
                existingMaterial.courseId = parseInt(formData.get('courseId') as string);
                
                if (file) {
                    // Revoke old URL to prevent memory leaks, if it exists
                    if (existingMaterial.fileUrl?.startsWith('blob:')) {
                        URL.revokeObjectURL(existingMaterial.fileUrl);
                    }
                    existingMaterial.fileName = file.name;
                    existingMaterial.fileType = getFileType(file.name);
                    existingMaterial.fileUrl = URL.createObjectURL(file); // Simulate updating file
                }
                
                MOCK_MATERIALS[index] = existingMaterial;
                resolve(existingMaterial);
            } else {
                reject(new Error('Material not found'));
            }
        }, LATENCY);
    });
};


export const deleteMaterial = (materialId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_MATERIALS.findIndex(m => m.id === materialId);
            if (index !== -1) {
                const materialToDelete = MOCK_MATERIALS[index];
                if (materialToDelete.fileUrl?.startsWith('blob:')) {
                    URL.revokeObjectURL(materialToDelete.fileUrl);
                }
                MOCK_MATERIALS.splice(index, 1);
                resolve();
            } else {
                reject(new Error('Material not found'));
            }
        }, LATENCY);
    });
};

export const toggleFavorite = (materialId: number): Promise<Material> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_MATERIALS.findIndex(m => m.id === materialId);
            if (index !== -1) {
                MOCK_MATERIALS[index].isFavorite = !MOCK_MATERIALS[index].isFavorite;
                resolve(MOCK_MATERIALS[index]);
            } else {
                reject(new Error('Material not found'));
            }
        }, LATENCY);
    });
};