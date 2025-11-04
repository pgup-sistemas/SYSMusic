
import React, { useState } from 'react';
import { User, AvailabilitySlot } from '../../types';
import { MOCK_TEACHER_AVAILABILITY } from '../../constants';

const DisponibilidadePage: React.FC<{ user: User }> = ({ user }) => {
    const [availability, setAvailability] = useState<AvailabilitySlot[]>(MOCK_TEACHER_AVAILABILITY);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSlotClick = (day: string, time: string) => {
        setAvailability(prev => 
            prev.map(slot => 
                slot.day === day && slot.time === time 
                ? { ...slot, isAvailable: !slot.isAvailable } 
                : slot
            )
        );
    };

    const handleSaveChanges = () => {
        // Here you would normally make an API call to save the availability
        console.log('Saving availability for', user.name, availability);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // Hide message after 3 seconds
    };
    
    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    // FIX: Explicitly type `a` and `b` in the sort callback to resolve type inference issues.
    const timeSlots: string[] = [...new Set(availability.map(slot => slot.time))].sort((a: string, b: string) => a.localeCompare(b));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Minha Disponibilidade</h1>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">Marque os horários em que você está disponível para dar aulas.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-center">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                                <th className="p-2 border dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300">Horário</th>
                                {daysOfWeek.map(day => (
                                    <th key={day} className="p-2 border dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map(time => (
                                <tr key={time}>
                                    <td className="p-2 border dark:border-gray-600 font-mono text-sm text-gray-500 dark:text-gray-400">{time}</td>
                                    {daysOfWeek.map(day => {
                                        const slot = availability.find(s => s.day === day && s.time === time);
                                        const isAvailable = slot?.isAvailable || false;
                                        return (
                                            <td key={`${day}-${time}`} className="p-0 border dark:border-gray-600">
                                                <button 
                                                    onClick={() => handleSlotClick(day, time)}
                                                    className={`w-full h-full p-2 text-sm transition-colors duration-200 ${
                                                        isAvailable 
                                                        ? 'bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-700 text-green-800 dark:text-green-100' 
                                                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-400'
                                                    }`}
                                                >
                                                   {isAvailable ? 'Disponível' : '—'}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 flex justify-end items-center">
                     {showSuccess && (
                        <p className="text-green-600 dark:text-green-400 mr-4 transition-opacity duration-300">
                            <i className="fas fa-check-circle mr-2"></i>Disponibilidade salva com sucesso!
                        </p>
                    )}
                    <button
                        onClick={handleSaveChanges}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisponibilidadePage;