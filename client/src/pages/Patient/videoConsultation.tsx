// pages/patient/VideoConsultation.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import DashboardLayout from '../../components/layout/DashboardLayout';
import VideoCall from '../../components/video/VideoCall';
import CallControls from '../../components/video/CallControls';
import ParticipantList from '../../components/video/ParticipantList';
import CallSetup from '../../components/video/CallSetup';
import { AgoraConfig } from '../../types/agora';

const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  gap: 1rem;
  height: 100%;
`;

const VideoContainer = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Sidebar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatusCard = styled(motion.div)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const VideoConsultation: React.FC = () => {
  const [callConfig, setCallConfig] = useState<AgoraConfig | null>(null);
  const [callState, setCallState] = useState({
    joined: false,
    published: false,
    localVideo: true,
    localAudio: true,
    remoteUsers: []
  });
  const [appointmentInfo, setAppointmentInfo] = useState({
    doctorName: 'Dr. Sharma',
    specialty: 'General Physician',
    appointmentTime: '10:00 AM',
    duration: '30 minutes'
  });

  // In a real app, this would come from your backend
  const initializeCall = async (channelName: string) => {
    try {
      // Simulate getting Agora config from backend
      const mockConfig: AgoraConfig = {
        appId: 'your-agora-app-id', // This should come from your backend
        channel: channelName,
        token: null, // In production, get a token from your backend
        uid: Math.floor(Math.random() * 100000) // Generate a random UID
      };
      
      setCallConfig(mockConfig);
      setCallState(prev => ({ ...prev, joined: true }));
    } catch (error) {
      console.error('Failed to initialize call:', error);
      alert('Failed to start the video call. Please try again.');
    }
  };

  const handleEndCall = () => {
    setCallConfig(null);
    setCallState({
      joined: false,
      published: false,
      localVideo: true,
      localAudio: true,
      remoteUsers: []
    });
  };

  const toggleAudio = () => {
    setCallState(prev => ({ ...prev, localAudio: !prev.localAudio }));
    // In a real app, you would also toggle the audio track here
  };

  const toggleVideo = () => {
    setCallState(prev => ({ ...prev, localVideo: !prev.localVideo }));
    // In a real app, you would also toggle the video track here
  };

  return (
    <DashboardLayout userType="patient">
      <Container>
        <Header>
          <Title>Video Consultation</Title>
        </Header>

        {!callState.joined ? (
          <CallSetup 
            appointmentInfo={appointmentInfo}
            onJoinCall={initializeCall}
          />
        ) : (
          <MainContent>
            <VideoContainer>
              {callConfig && (
                <VideoCall
                  config={callConfig}
                  callState={callState}
                  setCallState={setCallState}
                />
              )}
              <CallControls
                localAudio={callState.localAudio}
                localVideo={callState.localVideo}
                onToggleAudio={toggleAudio}
                onToggleVideo={toggleVideo}
                onEndCall={handleEndCall}
              />
            </VideoContainer>
            
            <Sidebar>
              <StatusCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3>Appointment Info</h3>
                <p><strong>Doctor:</strong> {appointmentInfo.doctorName}</p>
                <p><strong>Specialty:</strong> {appointmentInfo.specialty}</p>
                <p><strong>Time:</strong> {appointmentInfo.appointmentTime}</p>
                <p><strong>Duration:</strong> {appointmentInfo.duration}</p>
              </StatusCard>
              
              <ParticipantList
                remoteUsers={callState.remoteUsers}
                localAudio={callState.localAudio}
                localVideo={callState.localVideo}
              />
            </Sidebar>
          </MainContent>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default VideoConsultation;