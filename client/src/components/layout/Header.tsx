// components/layout/Header.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled(motion.h1)`
  font-size: 1.8rem;
  margin: 0;
  color: ${props => props.theme.colors.text};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ title, onToggleSidebar, onToggleTheme, theme }) => {
  // In a real app, this would come from authentication context
  const user = { name: 'John Doe', role: 'patient' };

  return (
    <HeaderContainer>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <IconButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
        >
          ☰
        </IconButton>
        <Title
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </Title>
      </div>
      
      <Controls>
        <IconButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleTheme}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </IconButton>
        
        <UserInfo>
          <Avatar>
            {user.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>{user.name}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{user.role}</div>
          </div>
        </UserInfo>
      </Controls>
    </HeaderContainer>
  );
};

export default Header;