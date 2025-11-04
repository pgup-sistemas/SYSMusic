
import React, { useEffect, useRef, useState } from 'react';
import { Lesson, Role, User, Room } from '../../types';
import { getCourseById, getUserById, MOCK_USERS, MOCK_COURSES } from '../../constants';
import * as lessonsApi from '../../api/lessons';
import * as roomsApi from '../../api/rooms';
import Modal from '../shared/Modal';

declare const FullCalendar: any;

interface LessonFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (lessonData: Omit<Lesson, 'id'> | Lesson) => Promise<void>;
    lessonToEdit: Lesson | null;
    isSaving: boolean;
}

const LessonFormModal: React.FC<LessonFormModalProps> = ({ isOpen, onClose, onSave, lessonToEdit, isSaving }) => {
    const [formData, setFormData] = useState({
        courseId: '', studentId: '', teacherId: '', date: '', startTime: '', endTime: '', room: '', notes: '', studentEmail: ''
    });
    const [emailError, setEmailError] = useState('');
    const [timeError, setTimeError] = useState('');
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const rooms = await roomsApi.getRooms();
            setAvailableRooms(rooms);
        };
        if (isOpen) {
            fetchRooms();
        }
    }, [isOpen]);

    useEffect(() => {
        if (lessonToEdit) {
            setFormData({
                courseId: String(lessonToEdit.courseId),
                studentId: String(lessonToEdit.studentId),
                teacherId: String(lessonToEdit.teacherId),
                date: lessonToEdit.startTime.toISOString().split('T')[0],
                startTime: lessonToEdit.startTime.toTimeString().substring(0, 5),
                endTime: lessonToEdit.endTime.toTimeString().substring(0, 5),
                room: lessonToEdit.room,
                notes: lessonToEdit.notes || '',
                studentEmail: lessonToEdit.studentEmail || '',
            });
        } else {
             setFormData({ courseId: '', studentId: '', teacherId: '', date: '', startTime: '', endTime: '', room: '', notes: '', studentEmail: '' });
        }
        setEmailError('');
        setTimeError('');
    }, [lessonToEdit, isOpen]);
    
    useEffect(() => {
        if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
            setTimeError('A hora de fim deve ser posterior à hora de início.');
        } else {
            setTimeError('');
        }
    }, [formData.startTime, formData.endTime]);

    const teachers = MOCK_USERS.filter(user => user.role === Role.Teacher);
    const students = MOCK_USERS.filter(user => user.role === Role.Student);

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setFormData(prev => ({...prev, studentEmail: newEmail}));
        if (emailError && validateEmail(newEmail)) {
            setEmailError('');
        }
    };

    const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const email = e.target.value;
        if (email && !validateEmail(email)) {
            setEmailError('Por favor, insira um e-mail válido.');
        } else {
            setEmailError('');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((formData.studentEmail && !validateEmail(formData.studentEmail)) || (formData.startTime && formData.endTime && formData.endTime <= formData.startTime)) {
            if (formData.studentEmail && !validateEmail(formData.studentEmail)) {
                setEmailError('Por favor, insira um e-mail válido.');
            }
            if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
                setTimeError('A hora de fim deve ser posterior à hora de início.');
            }
            return;
        }
        setEmailError('');
        setTimeError('');
        
        const lessonData = {
            ...lessonToEdit,
            id: lessonToEdit?.id || Date.now(),
            courseId: parseInt(formData.courseId),
            studentId: parseInt(formData.studentId),
            teacherId: parseInt(formData.teacherId),
            startTime: new Date(`${formData.date}T${formData.startTime}`),
            endTime: new Date(`${formData.date}T${formData.endTime}`),
            room: formData.room,
            status: lessonToEdit?.status || 'Agendada',
            notes: formData.notes,
            studentEmail: formData.studentEmail || undefined,
        };
        await onSave(lessonData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={lessonToEdit ? "Editar Aula" : "Agendar Nova Aula"}>
            <form onSubmit={handleSave} className="space-y-4">
                 <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Curso</label>
                    <select id="course" value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="" disabled>Selecione um curso</option>
                        {MOCK_COURSES.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="student" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aluno</label>
                    <select id="student" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="" disabled>Selecione um aluno</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email do Aluno (Opcional)</label>
                    <input type="email" id="studentEmail" value={formData.studentEmail} onChange={handleEmailChange} onBlur={handleEmailBlur} className={`mt-1 block w-full pl-3 pr-2 py-2 text-base border dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white ${emailError ? 'border-red-500' : 'border-gray-300'}`} placeholder="aluno@exemplo.com" />
                    {emailError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>}
                </div>
                <div>
                    <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Professor</label>
                    <select id="teacher" value={formData.teacherId} onChange={e => setFormData({...formData, teacherId: e.target.value})} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="" disabled>Selecione um professor</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="room" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sala</label>
                    <input type="text" id="room" list="rooms-datalist" value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" required placeholder="Selecione ou digite uma sala" />
                    <datalist id="rooms-datalist">{availableRooms.map(r => <option key={r.id} value={r.name} />)}</datalist>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Selecione da lista ou digite um nome de sala customizado.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
                        <input type="date" id="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Início</label>
                        <input type="time" id="start-time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required className={`mt-1 block w-full pl-3 pr-2 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white ${timeError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                    </div>
                    <div>
                        <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fim</label>
                        <input type="time" id="end-time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required className={`mt-1 block w-full pl-3 pr-2 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white ${timeError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
                    </div>
                </div>
                {timeError && <p className="text-sm text-red-600 dark:text-red-400 -mt-2">{timeError}</p>}
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações</label>
                    <textarea id="notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Notas sobre o plano de aula, progresso do aluno, etc."></textarea>
                </div>
                <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} disabled={isSaving} className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:opacity-50">Cancelar</button>
                    <button type="submit" disabled={isSaving || !!emailError || !!timeError} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                        {isSaving && <i className="fas fa-spinner fa-spin mr-2"></i>}
                        {isSaving ? (lessonToEdit ? 'Salvando...' : 'Agendando...') : (lessonToEdit ? 'Salvar Alterações' : 'Agendar Aula')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

const AgendaPage: React.FC<{ user: User }> = ({ user }) => {
    const calendarRef = useRef<HTMLDivElement>(null);
    const calendarInstanceRef = useRef<any>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [lessonToEdit, setLessonToEdit] = useState<Lesson | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
    const [selectedStudent, setSelectedStudent] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [timeFilter, setTimeFilter] = useState({ start: '', end: '' });

    const teachers = MOCK_USERS.filter(u => u.role === Role.Teacher);
    const students = MOCK_USERS.filter(u => u.role === Role.Student);
    const statuses: Lesson['status'][] = ['Agendada', 'Em Andamento', 'Concluída', 'Cancelada'];

    const fetchLessons = async () => {
        setIsLoading(true);
        const fetchedLessons = await lessonsApi.getLessons();
        setLessons(fetchedLessons);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLessons();
    }, []);
    
    useEffect(() => {
        if (user.role === Role.Teacher) {
            setSelectedTeacher(String(user.id));
        }
    }, [user.role, user.id]);

    const mapLessonsToEvents = (lessonsToMap: Lesson[]) => {
        return lessonsToMap.map(lesson => {
            const course = getCourseById(lesson.courseId);
            const isCancelled = lesson.status === 'Cancelada';
            let color = course?.color || '#3788d8';
            if (isCancelled) color = '#6b7280';
            if (lesson.status === 'Em Andamento') color = '#f59e0b';
            
            return {
                id: lesson.id.toString(),
                title: course?.name || 'Aula',
                start: lesson.startTime,
                end: lesson.endTime,
                backgroundColor: color,
                borderColor: color,
                textColor: isCancelled ? '#d1d5db' : '#ffffff',
                classNames: isCancelled ? ['line-through', 'opacity-70'] : [],
                extendedProps: { lesson }
            };
        });
    }

    const refreshCalendarEvents = () => {
         if (calendarInstanceRef.current) {
            let filteredLessons = lessons;

            if (selectedTeacher !== 'all') {
                filteredLessons = filteredLessons.filter(l => l.teacherId === parseInt(selectedTeacher));
            }
            if (selectedStudent !== 'all') {
                filteredLessons = filteredLessons.filter(l => l.studentId === parseInt(selectedStudent));
            }
            if (selectedStatus !== 'all') {
                filteredLessons = filteredLessons.filter(l => l.status === selectedStatus);
            }
            if (timeFilter.start || timeFilter.end) {
                filteredLessons = filteredLessons.filter(l => {
                    const lessonTime = l.startTime.toTimeString().substring(0, 5); // HH:mm format
                    const startMatch = !timeFilter.start || lessonTime >= timeFilter.start;
                    const endMatch = !timeFilter.end || lessonTime <= timeFilter.end;
                    return startMatch && endMatch;
                });
            }
            
            const newEvents = mapLessonsToEvents(filteredLessons);
            calendarInstanceRef.current.removeAllEvents();
            calendarInstanceRef.current.addEventSource(newEvents);
        }
    }

    const handleSaveLesson = async (lessonData: Omit<Lesson, 'id'> | Lesson) => {
        setIsSaving(true);
        if ('id' in lessonData && lessonToEdit) { // Editing
            await lessonsApi.updateLesson(lessonData as Lesson);
        } else { // Creating
            await lessonsApi.addLesson(lessonData as Omit<Lesson, 'id'>);
        }
        await fetchLessons();
        setIsSaving(false);
        closeFormModal();
    };
    
    const handleUpdateStatus = async (lesson: Lesson, status: Lesson['status']) => {
        setIsSaving(true);
        await lessonsApi.updateLesson({ ...lesson, status });
        await fetchLessons();
        setIsSaving(false);
        closeDetailModal();
    }

    const handleCancelLesson = (lesson: Lesson) => {
        if (window.confirm("Tem certeza que deseja cancelar esta aula? Esta ação não pode ser desfeita.")) {
            handleUpdateStatus(lesson, 'Cancelada');
        }
    };
    
    const handleEditClick = () => {
        setLessonToEdit(selectedLesson);
        setIsDetailModalOpen(false);
        setIsFormModalOpen(true);
    };

    useEffect(() => {
        if (!calendarInstanceRef.current && calendarRef.current && !isLoading) {
            const calendarEl = calendarRef.current;
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' },
                events: [],
                eventClick: (info: any) => {
                    const lesson = info.event.extendedProps.lesson;
                    if (lesson) {
                        setSelectedLesson(lesson);
                        setIsDetailModalOpen(true);
                    }
                },
                locale: 'pt-br',
                buttonText: { today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia' },
                dayMaxEvents: true,
            });
            calendar.render();
            calendarInstanceRef.current = calendar;
            refreshCalendarEvents();
        }
    }, [isLoading]);

    useEffect(refreshCalendarEvents, [lessons, selectedTeacher, selectedStudent, selectedStatus, timeFilter]);

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedLesson(null);
    }

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setLessonToEdit(null);
    }

    const course = selectedLesson ? getCourseById(selectedLesson.courseId) : null;
    const student = selectedLesson ? getUserById(selectedLesson.studentId) : null;
    const teacher = selectedLesson ? getUserById(selectedLesson.teacherId) : null;

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 relative">
            <div className="mb-4 flex flex-wrap gap-4 items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="teacher-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Professor</label>
                    <select id="teacher-filter" value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="all">Todos</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="student-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aluno</label>
                    <select id="student-filter" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="all">Todos</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select id="status-filter" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="all">Todos</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                    <label htmlFor="time-start-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Horário (Início)</label>
                    <input type="time" id="time-start-filter" value={timeFilter.start} onChange={e => setTimeFilter(prev => ({ ...prev, start: e.target.value }))} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div className="flex-1 min-w-[120px]">
                    <label htmlFor="time-end-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Horário (Fim)</label>
                    <input type="time" id="time-end-filter" value={timeFilter.end} onChange={e => setTimeFilter(prev => ({ ...prev, end: e.target.value }))} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
            </div>
            
            <div ref={calendarRef}></div>

            <button onClick={() => { setLessonToEdit(null); setIsFormModalOpen(true); }} className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110" aria-label="Adicionar Nova Aula">
                <i className="fas fa-plus text-xl"></i>
            </button>

            <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal} title="Detalhes da Aula">
                {selectedLesson && course && student && teacher && (
                    <>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                             <p className="flex items-start"><i className="fa fa-book w-6 text-indigo-500 pt-1"></i><strong>Curso:</strong><span className="ml-2">{course.name}</span></p>
                             <p className="flex items-start"><i className="fa fa-user-graduate w-6 text-indigo-500 pt-1"></i><strong>Aluno:</strong><span className="ml-2">{student.name}</span></p>
                             {selectedLesson.studentEmail && <p className="flex items-start"><i className="fa fa-envelope w-6 text-indigo-500 pt-1"></i><strong>Email do Aluno:</strong><span className="ml-2">{selectedLesson.studentEmail}</span></p>}
                             <p className="flex items-start"><i className="fa fa-chalkboard-teacher w-6 text-indigo-500 pt-1"></i><strong>Professor:</strong><span className="ml-2">{teacher.name}</span></p>
                             <p className="flex items-start"><i className="fa fa-clock w-6 text-indigo-500 pt-1"></i><strong>Horário:</strong><span className="ml-2">{selectedLesson.startTime.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} - {selectedLesson.endTime.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span></p>
                             <p className="flex items-start"><i className="fa fa-door-open w-6 text-indigo-500 pt-1"></i><strong>Sala:</strong><span className="ml-2">{selectedLesson.room}</span></p>
                             {selectedLesson.notes && <p className="flex items-start"><i className="fa fa-sticky-note w-6 text-indigo-500 pt-1"></i><strong>Observações:</strong><span className="ml-2 whitespace-pre-wrap">{selectedLesson.notes}</span></p>}
                             <div className="flex items-start"><i className="fa fa-check-circle w-6 text-indigo-500 pt-1"></i><strong>Status:</strong> <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full self-center ${selectedLesson.status === 'Agendada' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : selectedLesson.status === 'Concluída' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : selectedLesson.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>{selectedLesson.status}</span></div>
                        </div>
                        <div className="flex justify-end pt-6 mt-4 border-t dark:border-gray-700 space-x-2">
                             <button type="button" onClick={closeDetailModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Fechar</button>
                             {selectedLesson.status === 'Agendada' && <>
                                <button onClick={handleEditClick} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"><i className="fas fa-pencil-alt mr-2"></i>Editar Aula</button>
                                <button onClick={() => handleUpdateStatus(selectedLesson, 'Em Andamento')} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"><i className="fas fa-play-circle mr-2"></i>Iniciar Aula</button>
                                <button onClick={() => handleCancelLesson(selectedLesson)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"><i className="fas fa-times-circle mr-2"></i>Cancelar Aula</button>
                             </>}
                             {selectedLesson.status === 'Em Andamento' && 
                                <button onClick={() => handleUpdateStatus(selectedLesson, 'Concluída')} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"><i className="fas fa-check-circle mr-2"></i>Concluir Aula</button>
                             }
                        </div>
                    </>
                )}
            </Modal>
            <LessonFormModal isOpen={isFormModalOpen} onClose={closeFormModal} onSave={handleSaveLesson} lessonToEdit={lessonToEdit} isSaving={isSaving} />
        </div>
    );
};
export default AgendaPage;