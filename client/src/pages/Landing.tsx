// pages/Landing.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
`;

const HeroSection = styled.section`
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background: ${props => props.theme.colors.primary};
  color: white;
  margin: 0.5rem;
`;

const Landing: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Container>
      <nav style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </motion.button>
      </nav>

      <HeroSection>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: '3rem', marginBottom: '1rem' }}
        >
          SevaSetu
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: '1.2rem', marginBottom: '2rem' }}
        >
          Bridging Healthcare Gaps in Rural Nabha
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/login">
            <Button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Sign Up
            </Button>
          </Link>
        </motion.div>
      </HeroSection>

      <section style={{ padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How SevaSetu Helps</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
          {/* Feature cards with animations */}
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                background: '#f8f9fa',
                padding: '2rem',
                borderRadius: '10px',
                width: '300px',
                textAlign: 'center'
              }}
              whileHover={{ y: -5 }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Container>
  );
};

const features = [
  {
    icon: '👨‍⚕️',
    title: 'Video Consultations',
    description: 'Connect with doctors from the comfort of your home'
  },
  {
    icon: '💊',
    title: 'Medicine Availability',
    description: 'Check real-time medicine stock at local pharmacies'
  },
  {
    icon: '📋',
    title: 'Health Records',
    description: 'Access your medical history anytime, even offline'
  },
  {
    icon: '🤖',
    title: 'AI Symptom Checker',
    description: 'Get preliminary diagnosis before consulting a doctor'
  }
];

export default Landing;