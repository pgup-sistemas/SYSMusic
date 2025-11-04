import { Role, User, Course, Lesson, Payment, StudentData, AvailabilitySlot, Material, Certificate, Event, Notification, Room, LandingPageContent, TrialLessonRequest } from './types';

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Diretor Silva', email: 'diretor@music.com', role: Role.Admin, avatarUrl: 'https://picsum.photos/seed/admin/100/100', password: 'password', isActive: true },
  { id: 2, name: 'Ana Costa', email: 'secretaria@music.com', role: Role.Secretary, avatarUrl: 'https://picsum.photos/seed/secretary/100/100', password: 'password', isActive: true },
  { id: 3, name: 'Prof. Carlos', email: 'carlos@music.com', role: Role.Teacher, avatarUrl: 'https://picsum.photos/seed/teacher1/100/100', password: 'password', isActive: true },
  { id: 4, name: 'Profa. Beatriz', email: 'beatriz@music.com', role: Role.Teacher, avatarUrl: 'https://picsum.photos/seed/teacher2/100/100', password: 'password', isActive: true },
  { id: 5, name: 'João Pereira', email: 'joao@email.com', role: Role.Student, avatarUrl: 'https://picsum.photos/seed/student1/100/100', password: 'password', isActive: true },
  { id: 6, name: 'Maria Souza', email: 'maria@email.com', role: Role.Student, avatarUrl: 'https://picsum.photos/seed/student2/100/100', password: 'password', isActive: true },
  { id: 7, name: 'Pedro Alves', email: 'pedro@email.com', role: Role.Student, avatarUrl: 'https://picsum.photos/seed/student3/100/100', password: 'password', isActive: false },
];

export const MOCK_COURSES: Course[] = [
  { id: 1, name: 'Violão Clássico', instrument: 'Violão', teacherId: 3, color: '#3b82f6' },
  { id: 2, name: 'Piano Popular', instrument: 'Piano', teacherId: 4, color: '#10b981' },
  { id: 3, name: 'Teoria Musical', instrument: 'Teoria', teacherId: 4, color: '#8b5cf6' },
  { id: 4, name: 'Canto Coral', instrument: 'Canto', teacherId: 3, color: '#f97316' },
];

export let MOCK_LESSONS: Lesson[] = [
  { id: 1, courseId: 1, studentId: 5, teacherId: 3, startTime: new Date(new Date().setDate(new Date().getDate() + 1)), endTime: new Date(new Date().setHours(new Date().getHours() + 2)), room: 'Sala A', status: 'Agendada', notes: 'Focar na pestana.' },
  { id: 2, courseId: 2, studentId: 6, teacherId: 4, startTime: new Date(new Date().setDate(new Date().getDate() + 1)), endTime: new Date(new Date().setHours(new Date().getHours() + 3)), room: 'Sala B', status: 'Agendada' },
  { id: 3, courseId: 3, studentId: 7, teacherId: 4, startTime: new Date(new Date().setDate(new Date().getDate() + 2)), endTime: new Date(new Date().setHours(new Date().getHours() + 4)), room: 'Sala C', status: 'Agendada' },
  { id: 4, courseId: 1, studentId: 5, teacherId: 3, startTime: new Date(new Date().setDate(new Date().getDate() - 1)), endTime: new Date(new Date().setHours(new Date().getHours() - 23)), room: 'Sala A', status: 'Concluída', notes: 'Aluno progrediu bem.' },
  { id: 5, courseId: 4, studentId: 6, teacherId: 3, startTime: new Date(new Date().setDate(new Date().getDate() + 3)), endTime: new Date(new Date().setHours(new Date().getHours() + 5)), room: 'Auditório', status: 'Agendada' },
];


export let MOCK_PAYMENTS: Payment[] = [
    { id: 1, studentId: 5, amount: 250.00, dueDate: new Date('2024-08-10'), status: 'Pago', courseName: 'Violão Clássico' },
    { id: 2, studentId: 6, amount: 300.00, dueDate: new Date('2024-08-10'), status: 'Pendente', courseName: 'Piano Popular' },
    { id: 3, studentId: 7, amount: 150.00, dueDate: new Date('2024-07-10'), status: 'Atrasado', courseName: 'Teoria Musical' },
    { id: 4, studentId: 5, amount: 250.00, dueDate: new Date('2024-09-10'), status: 'Pendente', courseName: 'Violão Clássico' },
    { id: 5, studentId: 6, amount: 120.00, dueDate: new Date('2024-08-10'), status: 'Pago', courseName: 'Canto Coral' },
];


export const MOCK_STUDENTS_DATA: StudentData[] = [
    { ...(MOCK_USERS.find(u => u.id === 5) as User), enrollmentDate: '2023-02-15', activeCourses: 2 },
    { ...(MOCK_USERS.find(u => u.id === 6) as User), enrollmentDate: '2022-09-01', activeCourses: 1 },
    { ...(MOCK_USERS.find(u => u.id === 7) as User), enrollmentDate: '2024-01-20', activeCourses: 1 },
]

export const MOCK_CERTIFICATES: Certificate[] = [
    { id: 1, studentId: 5, courseName: 'Violão Clássico', eventName: 'Recital de Fim de Ano 2023', issueDate: new Date('2023-12-20'), validationCode: 'XYZ-123-ABC' },
    { id: 2, studentId: 6, courseName: 'Piano Popular', eventName: 'Apresentação de Primavera', issueDate: new Date('2024-05-15'), validationCode: 'PQR-456-DEF' },
    { id: 3, studentId: 5, courseName: 'Canto Coral', eventName: 'Concerto de Corais', issueDate: new Date('2024-07-01'), validationCode: 'MNO-789-GHI' },
];

export let MOCK_EVENTS: Event[] = [
    { id: 1, name: 'Recital de Fim de Ano', date: new Date(new Date().getFullYear(), 11, 15), startTime: '19:00', endTime: '21:00', location: 'Auditório Principal', description: 'Apresentação de encerramento do ano letivo.', status: 'Agendado', participantIds: [3, 4, 5, 6] },
    { id: 2, name: 'Workshop de Improvisação', date: new Date(new Date().setMonth(new Date().getMonth() + 1)), startTime: '14:00', endTime: '17:00', location: 'Estúdio 1', description: 'Workshop com o professor convidado Zé Ramalho.', status: 'Agendado', participantIds: [4] },
    { id: 3, name: 'Audição de Piano', date: new Date(new Date().setDate(new Date().getDate() - 30)), startTime: '10:00', endTime: '12:00', location: 'Sala B', description: 'Audições para a turma avançada de piano.', status: 'Agendado', participantIds: [6,7] },
];

export let MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, userId: 5, message: 'Sua aula de Violão foi reagendada para amanhã às 15:00.', isRead: false, date: new Date(), link: 'Minha Agenda' },
    { id: 2, userId: 5, message: 'O pagamento da sua mensalidade vence em 3 dias.', isRead: false, date: new Date(new Date().setDate(new Date().getDate() - 1)), link: 'Pagamentos' },
    { id: 3, userId: 5, message: 'Novo material disponível no curso de Violão Clássico.', isRead: true, date: new Date(new Date().setDate(new Date().getDate() - 2)), link: 'Materiais' },
    { id: 4, userId: 3, message: 'A aula do aluno João Pereira foi cancelada.', isRead: false, date: new Date(), link: 'Minhas Aulas' },
    { id: 5, userId: 1, message: 'Relatório financeiro de Julho está pronto.', isRead: true, date: new Date(new Date().setDate(new Date().getDate() - 5)), link: 'Financeiro' },
];

export let MOCK_ROOMS: Room[] = [
    { id: 1, name: 'Sala A' },
    { id: 2, name: 'Sala B' },
    { id: 3, name: 'Sala C' },
    { id: 4, name: 'Auditório' },
    { id: 5, name: 'Estúdio 1' },
];

export let MOCK_LANDING_PAGE_CONTENT: LandingPageContent = {
  heroTitle: "Desperte a Música em Você",
  heroSubtitle: "Aprenda com professores apaixonados em um ambiente inspirador. Oferecemos cursos de diversos instrumentos para todas as idades.",
  announcements: [
    { id: 1, title: "Matrículas Abertas para o Segundo Semestre!", content: "Garanta sua vaga nos nossos cursos de Violão, Piano, Canto e Teoria Musical. As vagas são limitadas!", date: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { id: 2, title: "Recital de Fim de Ano", content: "Nosso tradicional recital de fim de ano acontecerá no dia 15 de Dezembro. Venha prestigiar nossos talentosos alunos!", date: new Date(new Date().setDate(new Date().getDate() - 5)) },
  ]
};

export let MOCK_TRIAL_REQUESTS: TrialLessonRequest[] = [
  { id: 1, name: 'Carlos Andrade', email: 'carlos.a@example.com', instrument: 'Violão', phone: '11 98765-4321', requestDate: new Date(new Date().setDate(new Date().getDate() - 1)), status: 'Pendente' },
  { id: 2, name: 'Bruna Lima', email: 'bruna.l@example.com', instrument: 'Piano', requestDate: new Date(new Date().setDate(new Date().getDate() - 2)), status: 'Contatado' },
];


export const getCourseById = (id: number) => MOCK_COURSES.find(c => c.id === id);
export const getUserById = (id: number) => MOCK_USERS.find(u => u.id === id);

export const getStudentCountForCourse = (courseId: number) => {
    const studentIds = MOCK_LESSONS
        .filter(lesson => lesson.courseId === courseId)
        .map(lesson => lesson.studentId);
    return new Set(studentIds).size;
};

const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const times = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
export const MOCK_TEACHER_AVAILABILITY: AvailabilitySlot[] = days.flatMap(day => 
    times.map(time => ({
        day,
        time,
        isAvailable: Math.random() > 0.6 // Random initial availability
    }))
);


export let MOCK_MATERIALS: Material[] = [
    { id: 1, courseId: 1, teacherId: 3, title: 'Escalas Maiores', fileName: 'escalas_maiores.pdf', fileType: 'pdf', uploadDate: new Date('2024-07-15'), isFavorite: true },
    { id: 2, courseId: 1, teacherId: 3, title: 'Acompanhamento (Áudio)', fileName: 'base_violao.mp3', fileType: 'audio', uploadDate: new Date('2024-07-18'), isFavorite: false },
    { id: 3, courseId: 2, teacherId: 4, title: 'Partitura - Nível 1', fileName: 'partitura_piano_1.pdf', fileType: 'pdf', uploadDate: new Date('2024-07-20'), isFavorite: false },
];