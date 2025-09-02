// components/video/CallControls.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  border-top: 1px solid ${props => props.theme.colors.border};
  gap: 1rem;
`;

const ControlButton = styled(motion.button)<{ active?: boolean; danger?: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  background: ${props => {
    if (props.danger) return '#f44336';
    if (props.active) return props.theme.colors.primary;
    return '#f0f0f0';
  }};
  color: ${props => (props.danger || props.active) ? 'white' : '#333'};
`;

interface CallControlsProps {
  localAudio: boolean;
  localVideo: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
  localAudio,
  localVideo,
  onToggleAudio,
  onToggleVideo,
  onEndCall
}) => {
  return (
    <ControlsContainer>
      <ControlButton
        active={localAudio}
        onClick={onToggleAudio}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {localAudio ? '🎤' : '🎤🚫'}
      </ControlButton>
      
      <ControlButton
        active={localVideo}
        onClick={onToggleVideo}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {localVideo ? '📹' : '📹🚫'}
      </ControlButton>
      
      <ControlButton
        danger
        onClick={onEndCall}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        📞
      </ControlButton>
    </ControlsContainer>
  );
};

export default CallControls;