// components/video/ParticipantList.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { RemoteUser } from '../../types/agora';

const ListContainer = styled(motion.div)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex: 1;
  overflow-y: auto;
`;

const ListTitle = styled.h3`
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
`;

const ParticipantIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
`;

const ParticipantInfo = styled.div`
  flex: 1;
`;

const AudioIndicator = styled.div<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? '#4caf50' : '#f44336'};
`;

interface ParticipantListProps {
  remoteUsers: RemoteUser[];
  localAudio: boolean;
  localVideo: boolean;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
  remoteUsers,
  localAudio,
  localVideo
}) => {
  return (
    <ListContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ListTitle>Participants ({remoteUsers.length + 1})</ListTitle>
      
      {/* Local participant */}
      <ParticipantItem>
        <ParticipantIcon>Y</ParticipantIcon>
        <ParticipantInfo>
          <div>You</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            {localAudio ? 'Audio on' : 'Audio off'} • {localVideo ? 'Video on' : 'Video off'}
          </div>
        </ParticipantInfo>
        <AudioIndicator active={localAudio} />
      </ParticipantItem>
      
      {/* Remote participants */}
      {remoteUsers.map(user => (
        <ParticipantItem key={user.uid}>
          <ParticipantIcon>U</ParticipantIcon>
          <ParticipantInfo>
            <div>User {user.uid}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
              {user.hasAudio ? 'Audio on' : 'Audio off'} • {user.hasVideo ? 'Video on' : 'Video off'}
            </div>
          </ParticipantInfo>
          <AudioIndicator active={user.hasAudio} />
        </ParticipantItem>
      ))}
    </ListContainer>
  );
};

export default ParticipantList;