// components/video/CallSetup.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const SetupContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
`;

const DoctorAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const JoinButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 2rem;
`;

const Countdown = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin: 1rem 0;
`;

interface CallSetupProps {
  appointmentInfo: {
    doctorName: string;
    specialty: string;
    appointmentTime: string;
    duration: string;
  };
  onJoinCall: (channelName: string) => void;
}

const CallSetup: React.FC<CallSetupProps> = ({ appointmentInfo, onJoinCall }) => {
  const [isStarting, setIsStarting] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleJoinCall = () => {
    setIsStarting(true);
    
    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          onJoinCall(`appointment-${Date.now()}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <SetupContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DoctorAvatar>
        {appointmentInfo.doctorName.charAt(0)}
      </DoctorAvatar>
      
      <h2>Video Consultation with {appointmentInfo.doctorName}</h2>
      <p>{appointmentInfo.specialty}</p>
      
      <div style={{ margin: '1rem 0' }}>
        <p><strong>Scheduled Time:</strong> {appointmentInfo.appointmentTime}</p>
        <p><strong>Duration:</strong> {appointmentInfo.duration}</p>
      </div>
      
      {isStarting ? (
        <>
          <Countdown>{countdown}</Countdown>
          <p>Joining call...</p>
        </>
      ) : (
        <>
          <p style={{ marginBottom: '1rem' }}>
            Please ensure you have a stable internet connection and 
            have granted camera and microphone permissions.
          </p>
          
          <JoinButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleJoinCall}
          >
            Join Video Call
          </JoinButton>
        </>
      )}
    </SetupContainer>
  );
};

export default CallSetup;