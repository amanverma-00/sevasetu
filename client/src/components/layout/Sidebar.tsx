// components/layout/Sidebar.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled(motion.div)<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  text-align: center;
`;

const Logo = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin: 0;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 1rem 0;
`;

const MenuItem = styled.li`
  margin: 0.5rem 0;
`;

const MenuLink = styled(Link)<{ isActive: boolean }>`
  display: block;
  padding: 0.75rem 1.5rem;
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  transition: all 0.3s ease;
  border-right: ${props => props.isActive ? `3px solid ${props.theme.colors.primary}` : 'none'};
  background: ${props => props.isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const MenuIcon = styled.span`
  margin-right: 0.75rem;
`;

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userType: 'patient' | 'doctor' | 'pharmacist';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, userType }) => {
  const location = useLocation();

  const patientMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/health-records', label: 'Health Records', icon: '📋' },
    { path: '/symptom-checker', label: 'Symptom Checker', icon: '🤖' },
    { path: '/consultation', label: 'Consult Doctor', icon: '👨‍⚕️' },
    { path: '/pharmacies', label: 'Find Pharmacy', icon: '💊' },
  ];

  const doctorMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/appointments', label: 'Appointments', icon: '📅' },
    { path: '/patients', label: 'My Patients', icon: '👥' },
    { path: '/consultation', label: 'Consultations', icon: '👨‍⚕️' },
  ];

  const pharmacistMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/orders', label: 'Orders', icon: '🛒' },
    { path: '/patients', label: 'Patients', icon: '👥' },
  ];

  const menuItems = userType === 'patient' ? patientMenu : 
                   userType === 'doctor' ? doctorMenu : 
                   pharmacistMenu;

  return (
    <AnimatePresence>
      {isOpen && (
        <SidebarContainer
          isOpen={isOpen}
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          exit={{ x: -250 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <SidebarHeader>
            <Logo>SevaSetu</Logo>
          </SidebarHeader>
          <nav>
            <MenuList>
              {menuItems.map((item, index) => (
                <MenuItem key={index}>
                  <MenuLink
                    to={item.path}
                    isActive={location.pathname === item.path}
                  >
                    <MenuIcon>{item.icon}</MenuIcon>
                    {item.label}
                  </MenuLink>
                </MenuItem>
              ))}
            </MenuList>
          </nav>
        </SidebarContainer>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;