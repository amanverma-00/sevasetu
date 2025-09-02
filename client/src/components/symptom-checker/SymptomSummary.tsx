// components/symptom-checker/SymptomSummary.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const SymptomList = styled.ul`
  margin-bottom: 1.5rem;
`;

const SymptomItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  background: ${props => 
    props.variant === 'primary' 
      ? props.theme.colors.primary 
      : 'transparent'};
  color: ${props => 
    props.variant === 'primary' 
      ? 'white' 
      : props.theme.colors.text};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Disclaimer = styled.div`
  padding: 1rem;
  background: rgba(255, 152, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

interface SymptomSummaryProps {
  symptoms: string[];
  onClose: () => void;
}

const SymptomSummary: React.FC<SymptomSummaryProps> = ({ symptoms, onClose }) => {
  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Modal
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Title>Symptom Summary</Title>
        
        <Disclaimer>
          <strong>Important:</strong> This is a preliminary assessment based on the symptoms you've described. 
          It is not a medical diagnosis. Please consult with a healthcare professional for proper medical advice.
        </Disclaimer>
        
        <h3>Based on our conversation, you've mentioned:</h3>
        <SymptomList>
          {symptoms.map((symptom, index) => (
            <SymptomItem key={index}>
              {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
            </SymptomItem>
          ))}
        </SymptomList>
        
        <h3>Recommended Next Steps:</h3>
        <ul>
          <li>Schedule a consultation with a healthcare provider</li>
          <li>Monitor your symptoms and note any changes</li>
          <li>Seek immediate medical attention if you experience severe symptoms</li>
        </ul>
        
        <ButtonGroup>
          <Button onClick={onClose}>
            Continue Chat
          </Button>
          <Button variant="primary">
            Book Consultation
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default SymptomSummary;