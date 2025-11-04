export enum Role {
  Admin = 'Administrador',
  Secretary = 'Secretaria',
  Teacher = 'Professor',
  Student = 'Aluno',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  password?: string; // Added for login simulation
  isActive: boolean; // Added for user management
}

export interface Course {
  id: number;
  name: string;
  instrument: string;
  teacherId: number;
  color: string;
}

export interface Lesson {
  id: number;
  courseId: number;
  studentId: number;
  teacherId: number;
  startTime: Date;
  endTime: Date;
  room: string;
  status: 'Agendada' | 'Concluída' | 'Cancelada' | 'Em Andamento';
  notes?: string;
  studentEmail?: string;
}

export interface Payment {
  id: number;
  studentId: number;
  amount: number;
  dueDate: Date;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  courseName: string;
  paymentMethod?: 'Cartão de Crédito' | 'Boleto' | 'Manual';
  paidDate?: Date;
}

export interface Guardian {
  name: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface StudentData extends User {
    enrollmentDate: string;
    activeCourses: number;
    dateOfBirth?: Date;
    address?: string;
    guardian?: Guardian;
}

export interface AvailabilitySlot {
  day: string;
  time: string;
  isAvailable: boolean;
}

export interface Material {
  id: number;
  courseId: number;
  teacherId: number;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'audio' | 'video' | 'doc';
  uploadDate: Date;
  isFavorite?: boolean;
  fileUrl?: string; // Added for real file upload simulation
  file?: File; // Added for handling file object in form state
}

export interface Certificate {
  id: number;
  studentId: number;
  courseName: string;
  eventName: string;
  issueDate: Date;
  validationCode: string;
}

export interface Event {
  id: number;
  name: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  status: 'Agendado' | 'Cancelado';
  participantIds: number[];
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  date: Date;
  link?: string; // Optional link to a relevant page
}

export interface Room {
  id: number;
  name: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: Date;
}

export interface LandingPageContent {
  heroTitle: string;
  heroSubtitle: string;
  announcements: Announcement[];
}

export interface TrialLessonRequest {
  id: number;
  name: string;
  email: string;
  instrument: string;
  phone?: string;
  requestDate: Date;
  status: 'Pendente' | 'Contatado' | 'Agendado' | 'Cancelado';
}

export type AttendanceStatus = 'Presente' | 'Ausente' | 'Atrasado';

export interface AttendanceRecord {
  id: number;
  courseId: number;
  studentId: number;
  date: Date; // The specific date of the class
  status: AttendanceStatus;
  notes?: string;
}