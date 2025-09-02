import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatMessage from '../../components/symptom-checker/ChatMessage';
import ChatInput from '../../components/symptom-checker/ChatInput';
import SymptomSummary from '../../components/symptom-checker/SymptomSummary';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SymptomChecker: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: "Hello! I'm here to help you understand your symptoms. Please describe what you're experiencing.",
    sender: 'ai',
    timestamp: new Date()
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    }]);

    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: 'Based on your symptoms, I recommend consulting with a healthcare provider. Would you like me to help you schedule a consultation?',
        sender: 'ai',
        timestamp: new Date()
      }]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <DashboardLayout userType="patient">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          className="min-h-[calc(100vh-120px)] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">
              AI Symptom Checker
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <div className="lg:col-span-2 bg-background-light dark:bg-background-dark rounded-lg p-6 shadow-md flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center"
                  >
                    <LoadingSpinner />
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>

            <div className="lg:col-span-1">
              <SymptomSummary
                symptoms={[
                  { name: 'Headache', severity: 'Moderate' },
                  { name: 'Fever', severity: 'Mild' }
                ]}
                recommendations={[
                  'Rest and stay hydrated',
                  'Consider over-the-counter pain relievers',
                  'Monitor temperature'
                ]}
                urgencyLevel="Low"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial AI message when component mounts
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      text: "Hello! I'm your AI health assistant. I can help you understand your symptoms and provide general health information. Please describe what you're experiencing, and I'll do my best to help. Remember, I'm not a substitute for professional medical advice.",
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Extract symptoms from user message
    const extractedSymptoms = extractSymptoms(text);
    if (extractedSymptoms.length > 0) {
      setSymptoms(prev => [...new Set([...prev, ...extractedSymptoms])]);
    }
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text, messages);
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Check if we should show the symptom summary
      if (shouldShowSummary(aiResponse)) {
        setShowSummary(true);
      }
    }, 1500);
  };

  const extractSymptoms = (text: string): string[] => {
    const symptomKeywords = [
      'headache', 'fever', 'cough', 'pain', 'nausea', 'dizziness', 
      'fatigue', 'rash', 'sore throat', 'chest pain', 'shortness of breath',
      'abdominal pain', 'vomiting', 'diarrhea', 'constipation', 'chills',
      'sweating', 'muscle pain', 'joint pain', 'back pain', 'weakness'
    ];
    
    const foundSymptoms: string[] = [];
    const lowerText = text.toLowerCase();
    
    symptomKeywords.forEach(symptom => {
      if (lowerText.includes(symptom)) {
        foundSymptoms.push(symptom);
      }
    });
    
    return foundSymptoms;
  };

  const generateAIResponse = (userMessage: string, allMessages: Message[]): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple response logic - in a real app, this would call an AI API
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! How can I help you today? Please describe any symptoms you're experiencing.";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else you'd like to know about your symptoms?";
    }
    
    if (lowerMessage.includes('headache')) {
      return "I understand you're experiencing a headache. How long have you had it? Is it a dull ache or sharp pain?";
    }
    
    if (lowerMessage.includes('fever')) {
      return "You mentioned a fever. What is your temperature? Have you taken any medication for it?";
    }
    
    if (lowerMessage.includes('cough')) {
      return "I see you have a cough. Is it a dry cough or are you producing phlegm? How long has it been going on?";
    }
    
    if (lowerMessage.includes('pain')) {
      return "You mentioned pain. Can you tell me where exactly you're feeling the pain and what it feels like?";
    }
    
    if (lowerMessage.includes('nausea') || lowerMessage.includes('vomit')) {
      return "I understand you're feeling nauseous. Have you vomited? How long have you been feeling this way?";
    }
    
    // If no specific symptom is detected, ask for more information
    return "Thank you for sharing that information. Can you tell me more about your symptoms? For example, when they started, how severe they are, and if anything makes them better or worse.";
  };

  const shouldShowSummary = (aiResponse: string): boolean => {
    // Show summary after a few messages exchange
    return messages.length >= 4 && symptoms.length > 0;
  };

  const handleStartOver = () => {
    setMessages([]);
    setSymptoms([]);
    setShowSummary(false);
    
    // Add initial AI message again
    setTimeout(() => {
      const initialMessage: Message = {
        id: '1',
        text: "Hello! I'm your AI health assistant. I can help you understand your symptoms and provide general health information. Please describe what you're experiencing, and I'll do my best to help. Remember, I'm not a substitute for professional medical advice.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }, 500);
  };

  return (
    <DashboardLayout userType="patient">
      <Container>
        <Header>
          <Title>Symptom Checker</Title>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartOver}
            style={{
              padding: '0.5rem 1rem',
              background: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Start Over
          </motion.button>
        </Header>

        <ChatContainer>
          <MessagesContainer>
            <Introduction
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p>
                <strong>Important:</strong> This AI symptom checker is for informational purposes only 
                and is not a substitute for professional medical advice, diagnosis, or treatment. 
                Always seek the advice of your physician or other qualified health provider with 
                any questions you may have regarding a medical condition.
              </p>
            </Introduction>

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
              />
            ))}

            {isTyping && (
              <TypingIndicator
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>AI is typing</span>
                <Dot
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <Dot
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
                />
                <Dot
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
              </TypingIndicator>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <ChatInput onSendMessage={handleSendMessage} />
        </ChatContainer>

        <AnimatePresence>
          {showSummary && (
            <SymptomSummary 
              symptoms={symptoms} 
              onClose={() => setShowSummary(false)}
            />
          )}
        </AnimatePresence>
      </Container>
    </DashboardLayout>
  );
};

export default SymptomChecker;