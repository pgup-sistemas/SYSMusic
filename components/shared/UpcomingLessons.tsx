
import React from 'react';
import { Lesson } from '../../types';
import { getCourseById, getUserById } from '../../constants';

interface UpcomingLessonsProps {
  lessons: Lesson[];
  title?: string;
  showStudent?: boolean;
  showTeacher?: boolean;
}

const UpcomingLessons: React.FC<UpcomingLessonsProps> = ({ lessons, title = "Próximas Aulas", showStudent = false, showTeacher = false }) => {
  const upcoming = lessons
    .filter(l => l.startTime > new Date() && l.status === 'Agendada')
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 5);

  const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-4">
        {upcoming.length > 0 ? (
          upcoming.map((lesson) => {
            const course = getCourseById(lesson.courseId);
            const student = showStudent ? getUserById(lesson.studentId) : null;
            const teacher = showTeacher ? getUserById(lesson.teacherId) : null;
            return (
              <div key={lesson.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">{lesson.startTime.toLocaleDateString('pt-BR', { month: 'short' })}</span>
                  <span className="text-lg font-bold text-indigo-800 dark:text-indigo-100">{lesson.startTime.getDate()}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-white">{course?.name || 'Aula Desconhecida'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(lesson.startTime)} &bull; {lesson.room}
                  </p>
                  {student && <p className="text-sm text-gray-500 dark:text-gray-400">Aluno: {student.name}</p>}
                  {teacher && <p className="text-sm text-gray-500 dark:text-gray-400">Professor: {teacher.name}</p>}
                </div>
                <i className="fa fa-chevron-right text-gray-400"></i>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Nenhuma aula agendada.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingLessons;
