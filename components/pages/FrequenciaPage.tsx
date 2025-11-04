import React, { useState, useEffect, useMemo } from 'react';
import { User, Course, AttendanceRecord, AttendanceStatus, Role } from '../../types';
// FIX: import MOCK_USERS
import { MOCK_COURSES, getStudentsForCourse, getUserById, getCourseById, MOCK_USERS } from '../../constants';
import * as attendanceApi from '../../api/attendance';

declare const jspdf: any;
declare const autoTable: any;

type AttendanceData = {
    [studentId: number]: {
        status: AttendanceStatus;
        notes: string;
    }
};

const FrequenciaPage: React.FC<{ user: User }> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'register' | 'reports'>('register');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Controle de Frequência</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Registre a presença dos alunos e gere relatórios detalhados.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('register')}
                            className={`${activeTab === 'register' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Registrar Frequência
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`${activeTab === 'reports' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Relatórios de Frequência
                        </button>
                    </nav>
                </div>
                <div className="pt-6">
                    {activeTab === 'register' ? <RegisterView teacherId={user.id} /> : <ReportsView teacherId={user.id} />}
                </div>
            </div>
        </div>
    );
};

const RegisterView: React.FC<{ teacherId: number }> = ({ teacherId }) => {
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState<User[]>([]);
    const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const teacherCourses = useMemo(() => MOCK_COURSES.filter(c => c.teacherId === teacherId), [teacherId]);

    useEffect(() => {
        if (selectedCourseId) {
            const courseIdNum = parseInt(selectedCourseId);
            const classStudents = getStudentsForCourse(courseIdNum);
            setStudents(classStudents);
            
            // Fetch existing attendance for this class and date
            setIsLoading(true);
            const dateObj = new Date(new Date(selectedDate).getTime() + new Date().getTimezoneOffset() * 60000)
            attendanceApi.getAttendanceRecords(courseIdNum, dateObj).then(records => {
                const newAttendanceData: AttendanceData = {};
                classStudents.forEach(student => {
                    const record = records.find(r => r.studentId === student.id);
                    newAttendanceData[student.id] = {
                        status: record?.status || 'Presente',
                        notes: record?.notes || ''
                    };
                });
                setAttendanceData(newAttendanceData);
                setIsLoading(false);
            });
        } else {
            setStudents([]);
            setAttendanceData({});
        }
    }, [selectedCourseId, selectedDate]);

    const handleAttendanceChange = (studentId: number, status: AttendanceStatus) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }));
    };

    const handleNotesChange = (studentId: number, notes: string) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], notes }
        }));
    };

    const handleSave = async () => {
        if (!selectedCourseId) return;
        setIsSaving(true);
        const recordsToSave = students.map(student => ({
            studentId: student.id,
            courseId: parseInt(selectedCourseId),
            date: new Date(new Date(selectedDate).getTime() + new Date().getTimezoneOffset() * 60000),
            status: attendanceData[student.id].status,
            notes: attendanceData[student.id].notes,
        }));
        await attendanceApi.saveAttendanceRecords(recordsToSave);
        setIsSaving(false);
        alert('Frequência salva com sucesso!');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selecione o Curso</label>
                    <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="" disabled>Selecione...</option>
                        {teacherCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selecione a Data da Aula</label>
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
                </div>
            </div>

            {isLoading && <div className="text-center py-4"><i className="fas fa-spinner fa-spin text-2xl text-indigo-500"></i></div>}

            {!isLoading && students.length > 0 && (
                <div className="space-y-4">
                    {students.map(student => (
                        <div key={student.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center flex-shrink-0 w-full sm:w-1/4">
                                <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full mr-3" />
                                <span className="font-medium text-gray-800 dark:text-white">{student.name}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {(['Presente', 'Ausente', 'Atrasado'] as AttendanceStatus[]).map(status => (
                                    <label key={status} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`status-${student.id}`}
                                            checked={attendanceData[student.id]?.status === status}
                                            onChange={() => handleAttendanceChange(student.id, status)}
                                            className="form-radio h-4 w-4 text-indigo-600"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{status}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex-1 w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Observações (opcional)"
                                    value={attendanceData[student.id]?.notes || ''}
                                    onChange={e => handleNotesChange(student.id, e.target.value)}
                                    className="block w-full text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                            {isSaving && <i className="fas fa-spinner fa-spin mr-2"></i>}
                            {isSaving ? 'Salvando...' : 'Salvar Frequência'}
                        </button>
                    </div>
                </div>
            )}
             {!isLoading && selectedCourseId && students.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum aluno encontrado para este curso.</p>}
        </div>
    );
};

const ReportsView: React.FC<{ teacherId: number }> = ({ teacherId }) => {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [courseFilter, setCourseFilter] = useState('all');
    const [studentFilter, setStudentFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

    const teacherCourses = useMemo(() => MOCK_COURSES.filter(c => c.teacherId === teacherId), [teacherId]);
    const teacherStudents = useMemo(() => {
        const studentIds = new Set<number>();
        teacherCourses.forEach(course => {
            getStudentsForCourse(course.id).forEach(student => studentIds.add(student.id));
        });
        return MOCK_USERS.filter(u => studentIds.has(u.id));
    }, [teacherCourses]);

    useEffect(() => {
        setIsLoading(true);
        attendanceApi.getAllTeacherRecords(teacherId).then(data => {
            setRecords(data);
            setIsLoading(false);
        });
    }, [teacherId]);

    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const courseMatch = courseFilter === 'all' || r.courseId === parseInt(courseFilter);
            const studentMatch = studentFilter === 'all' || r.studentId === parseInt(studentFilter);
            const startDate = dateFilter.start ? new Date(new Date(dateFilter.start).getTime() + new Date().getTimezoneOffset() * 60000) : null;
            const endDate = dateFilter.end ? new Date(new Date(dateFilter.end).getTime() + new Date().getTimezoneOffset() * 60000) : null;
            const dateMatch = (!startDate || r.date >= startDate) && (!endDate || r.date <= endDate);
            return courseMatch && studentMatch && dateMatch;
        });
    }, [records, courseFilter, studentFilter, dateFilter]);
    
    const handleExportCSV = () => {
        const headers = ["ID", "Aluno", "Curso", "Data", "Status", "Observações"];
        const csvRows = [headers.join(',')];
        filteredRecords.forEach(rec => {
            const student = getUserById(rec.studentId)?.name || '';
            const course = getCourseById(rec.courseId)?.name || '';
            const row = [rec.id, `"${student}"`, `"${course}"`, rec.date.toLocaleDateString('pt-BR'), rec.status, `"${rec.notes || ''}"`].join(',');
            csvRows.push(row);
        });
        const blob = new Blob([`\uFEFF${csvRows.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", "relatorio_frequencia.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const doc = new jspdf.jsPDF();
        const tableColumn = ["Aluno", "Curso", "Data", "Status", "Observações"];
        const tableRows: any[][] = [];
        filteredRecords.forEach(rec => {
            const student = getUserById(rec.studentId)?.name || '';
            const course = getCourseById(rec.courseId)?.name || '';
            tableRows.push([student, course, rec.date.toLocaleDateString('pt-BR'), rec.status, rec.notes || '']);
        });
        doc.text("Relatório de Frequência", 14, 15);
        doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
        doc.save("relatorio_frequencia.pdf");
    };


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg dark:border-gray-700">
                <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} className="w-full border-gray-300 dark:border-gray-600 rounded-md">
                    <option value="all">Todos os Cursos</option>
                    {teacherCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                 <select value={studentFilter} onChange={e => setStudentFilter(e.target.value)} className="w-full border-gray-300 dark:border-gray-600 rounded-md">
                    <option value="all">Todos os Alunos</option>
                    {teacherStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <div className="flex items-center gap-2">
                    <input type="date" value={dateFilter.start} onChange={e => setDateFilter(p => ({...p, start: e.target.value}))} className="w-full border-gray-300 dark:border-gray-600 rounded-md text-sm" />
                    <span className="text-gray-500">até</span>
                    <input type="date" value={dateFilter.end} onChange={e => setDateFilter(p => ({...p, end: e.target.value}))} className="w-full border-gray-300 dark:border-gray-600 rounded-md text-sm" />
                </div>
            </div>
             <div className="flex justify-end gap-2">
                <button onClick={handleExportCSV} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-300 text-sm"><i className="fas fa-file-csv mr-2"></i>Exportar CSV</button>
                <button onClick={handleExportPDF} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-sm hover:bg-red-600 text-sm"><i className="fas fa-file-pdf mr-2"></i>Exportar PDF</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Aluno</th><th className="px-6 py-3">Curso</th><th className="px-6 py-3">Data</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Observações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map(rec => {
                            const student = getUserById(rec.studentId);
                            const course = getCourseById(rec.courseId);
                            return (
                            <tr key={rec.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{student?.name}</td>
                                <td className="px-6 py-4">{course?.name}</td>
                                <td className="px-6 py-4">{rec.date.toLocaleDateString('pt-BR')}</td>
                                <td className="px-6 py-4">{rec.status}</td>
                                <td className="px-6 py-4">{rec.notes}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
                 {filteredRecords.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum registro de frequência encontrado com os filtros selecionados.</p>}
            </div>
        </div>
    );
};

export default FrequenciaPage;
