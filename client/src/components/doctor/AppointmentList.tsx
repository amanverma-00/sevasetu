import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface Appointment {
  id: string | number;
  patient: string;
  time: string;
  type: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  symptoms?: string[];
}

interface AppointmentListProps {
  appointments: Appointment[];
  onStatusChange?: (id: string, status: Appointment['status']) => void;
  className?: string;
}

const getStatusStyles = (status: Appointment['status']): string => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const StatusBadge = styled.span<{ status: Appointment['status'] }>`
  ${({ status }) => getStatusStyles(status)} px-2.5 py-0.5 rounded-full text-sm font-medium
`;

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments, 
  onStatusChange,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Today's Appointments
        </h3>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white">
                    {appointment.patient}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {appointment.time} • {appointment.type}
                  </p>
                  {appointment.symptoms && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {appointment.symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={appointment.status}>
                    {appointment.status}
                  </StatusBadge>
                  {onStatusChange && (
                    <select
                      className="form-select text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      value={appointment.status}
                      onChange={(e) => onStatusChange(appointment.id.toString(), e.target.value as Appointment['status'])}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;
