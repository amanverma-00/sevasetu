// components/symptom-checker/ChatInput.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 24px;
  font-size: 1rem;
  outline: none;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
`;

const SendButton = styled(motion.button)`
  margin-left: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
`;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <InputContainer>
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your symptoms..."
        />
        <SendButton
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!message.trim()}
        >
          ➤
        </SendButton>
      </form>
    </InputContainer>
  );
};

export default ChatInput;