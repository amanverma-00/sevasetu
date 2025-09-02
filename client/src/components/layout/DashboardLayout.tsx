// components/layout/DashboardLayout.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  padding: 2rem;
  margin-left: ${props => (props.isSidebarOpen ? '250px' : '0')};
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'patient' | 'doctor' | 'pharmacist';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { theme, toggleTheme } = useTheme();

  return (
    <Container>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        userType={userType}
      />
      <MainContent
        isSidebarOpen={isSidebarOpen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Header 
          title={getDashboardTitle(userType)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleTheme={toggleTheme}
          theme={theme}
        />
        {children}
      </MainContent>
    </Container>
  );
};

const getDashboardTitle = (userType: string): string => {
  switch (userType) {
    case 'patient': return 'Patient Dashboard';
    case 'doctor': return 'Doctor Dashboard';
    case 'pharmacist': return 'Pharmacy Dashboard';
    default: return 'Dashboard';
  }
};

export default DashboardLayout;