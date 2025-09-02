import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface Appointment {
  id: string | number;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface AppointmentCardProps {
  appointment: Appointment;
  onJoinCall?: () => void;
  onCancel?: () => void;
  className?: string;
}

const StyledCard = styled(motion.div)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatusBadge = styled.span<{ status: Appointment['status'] }>`
  ${({ status }) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  }}
`;

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onJoinCall,
  onCancel,
  className = ''
}) => {
  const isUpcoming = appointment.status === 'upcoming';
  const isVideoCall = appointment.type === 'video';

  return (
    <StyledCard
      className={`p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {appointment.doctorName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {appointment.specialization}
          </p>
        </div>
        <StatusBadge
          status={appointment.status}
          className="px-2.5 py-0.5 rounded-full text-sm font-medium"
        >
          {appointment.status}
        </StatusBadge>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <span className="mr-2">📅</span>
          {appointment.date}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <span className="mr-2">⏰</span>
          {appointment.time}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <span className="mr-2">{isVideoCall ? '🎥' : '🏥'}</span>
          {isVideoCall ? 'Video Consultation' : 'In-Person Visit'}
        </div>
      </div>

      {isUpcoming && (
        <div className="mt-6 flex gap-3">
          {isVideoCall && onJoinCall && (
            <button
              onClick={onJoinCall}
              className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Join Call
            </button>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </StyledCard>
  );
};

export default AppointmentCard;
