import React from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Props {
  message: Message;
}

const ChatMessage: React.FC<Props> = ({ message }) => {
  const isAI = message.sender === 'ai';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
          isAI
            ? 'bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-gray-200 dark:border-gray-700'
            : 'bg-primary text-white'
        }`}
      >
        <p className="text-sm md:text-base">{message.text}</p>
        <div className={`text-xs mt-1 opacity-70 ${isAI ? 'text-left' : 'text-right'} text-gray-500 dark:text-gray-400`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;