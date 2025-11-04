
import React from 'react';

interface DashboardCardProps {
  icon: string;
  title: string;
  value: string;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, value, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center space-x-6 hover:shadow-xl transition-shadow duration-300">
      <div className={`p-4 rounded-full ${color}`}>
        <i className={`fa ${icon} text-white text-2xl`}></i>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
