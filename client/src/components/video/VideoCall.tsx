// components/video/VideoCall.tsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraConfig, CallState } from '../../types/agora';

const VideoContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 0.5rem;
  padding: 0.5rem;
  background: #000;
  overflow: auto;
`;

const VideoWrapper = styled.div<{ isLocal?: boolean }>`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #333;
  aspect-ratio: 16/9;
  
  ${props => props.isLocal && `
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 200px;
    z-index: 10;
    border: 2px solid ${props.theme.colors.primary};
  `}
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ParticipantInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  font-size: 0.8rem;
`;

const AudioIndicator = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4caf50;
`;

interface VideoCallProps {
  config: AgoraConfig;
  callState: CallState;
  setCallState: React.Dispatch<React.SetStateAction<CallState>>;
}

const VideoCall: React.FC<VideoCallProps> = ({ config, callState, setCallState }) => {
  const localVideoRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);
  const localAudioTrackRef = useRef<any>(null);
  const localVideoTrackRef = useRef<any>(null);

  useEffect(() => {
    const initAgora = async () => {
      try {
        // Create Agora client
        const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        clientRef.current = client;

        // Set up event listeners
        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          
          if (mediaType === 'video') {
            setCallState(prev => ({
              ...prev,
              remoteUsers: [...prev.remoteUsers, {
                uid: user.uid,
                videoTrack: user.videoTrack,
                audioTrack: user.audioTrack,
                hasAudio: user.hasAudio,
                hasVideo: user.hasVideo
              }]
            }));
          }

          if (mediaType === 'audio') {
            user.audioTrack.play();
          }
        });

        client.on('user-unpublished', (user) => {
          setCallState(prev => ({
            ...prev,
            remoteUsers: prev.remoteUsers.filter(u => u.uid !== user.uid)
          }));
        });

        // Join the channel
        await client.join(config.appId, config.channel, config.token, config.uid);

        // Create and publish local tracks
        if (callState.localAudio) {
          localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
        }
        
        if (callState.localVideo) {
          localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack();
          if (localVideoRef.current) {
            localVideoTrackRef.current.play(localVideoRef.current);
          }
        }

        // Publish tracks
        if (localAudioTrackRef.current || localVideoTrackRef.current) {
          await client.publish([
            ...(localAudioTrackRef.current ? [localAudioTrackRef.current] : []),
            ...(localVideoTrackRef.current ? [localVideoTrackRef.current] : [])
          ]);
          
          setCallState(prev => ({ ...prev, published: true }));
        }
      } catch (error) {
        console.error('Agora initialization error:', error);
      }
    };

    if (config && !callState.published) {
      initAgora();
    }

    return () => {
      // Cleanup function
      if (clientRef.current) {
        clientRef.current.leave();
      }
      
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
      }
      
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.close();
      }
    };
  }, [config, callState.published, callState.localAudio, callState.localVideo, setCallState]);

  // Handle audio/video toggles
  useEffect(() => {
    const toggleTracks = async () => {
      if (localAudioTrackRef.current) {
        if (callState.localAudio) {
          await localAudioTrackRef.current.setEnabled(true);
        } else {
          await localAudioTrackRef.current.setEnabled(false);
        }
      }

      if (localVideoTrackRef.current) {
        if (callState.localVideo) {
          await localVideoTrackRef.current.setEnabled(true);
        } else {
          await localVideoTrackRef.current.setEnabled(false);
        }
      }
    };

    toggleTracks();
  }, [callState.localAudio, callState.localVideo]);

  return (
    <VideoContainer>
      {/* Local video */}
      <VideoWrapper isLocal ref={localVideoRef}>
        <ParticipantInfo>You</ParticipantInfo>
        {callState.localAudio && <AudioIndicator />}
      </VideoWrapper>

      {/* Remote videos */}
      {callState.remoteUsers.map(user => (
        <VideoWrapper key={user.uid}>
          <VideoElement ref={el => {
            if (el && user.videoTrack) {
              user.videoTrack.play(el);
            }
          }} />
          <ParticipantInfo>User {user.uid}</ParticipantInfo>
          {user.hasAudio && <AudioIndicator />}
        </VideoWrapper>
      ))}
    </VideoContainer>
  );
};

export default VideoCall;