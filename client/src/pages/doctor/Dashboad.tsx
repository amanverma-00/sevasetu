// pages/doctor/Dashboard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/common/StatsCard';
import AppointmentList from '../../components/doctor/AppointmentList';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const DoctorDashboard: React.FC = () => {
  // In a real app, this data would come from API calls
  const stats = [
    { title: 'Today\'s Appointments', value: 8, icon: '📅', color: '#667eea' },
    { title: 'Pending Consultations', value: 3, icon: '⏱️', color: '#764ba2' },
    { title: 'Total Patients', value: 142, icon: '👥', color: '#f093fb' },
    { title: 'Messages', value: 5, icon: '✉️', color: '#4facfe' },
  ];

  const appointments = [
    { id: 1, patient: 'Rahul Sharma', time: '10:00 AM', type: 'Video Consultation', status: 'upcoming' },
    { id: 2, patient: 'Priya Patel', time: '10:30 AM', type: 'In-Person', status: 'upcoming' },
    { id: 3, patient: 'Amit Kumar', time: '11:15 AM', type: 'Video Consultation', status: 'upcoming' },
    { id: 4, patient: 'Sneha Singh', time: '2:00 PM', type: 'In-Person', status: 'upcoming' },
  ];

  return (
    <DashboardLayout userType="doctor">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Section>
          <SectionTitle>Today's Overview</SectionTitle>
          <Grid>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Today's Appointments</SectionTitle>
          <AppointmentList appointments={appointments} />
        </Section>

        <Section>
          <SectionTitle>Quick Actions</SectionTitle>
          <Grid>
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <StatsCard 
                title="Start Consultation" 
                value=""
                icon="👨‍⚕️" 
                color="#4facfe" 
                isAction={true}
              />
            </motion.div>
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <StatsCard 
                title="View Schedule" 
                value=""
                icon="📅" 
                color="#f093fb" 
                isAction={true}
              />
            </motion.div>
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <StatsCard 
                title="Patient Records" 
                value=""
                icon="📋" 
                color="#43e97b" 
                isAction={true}
              />
            </motion.div>
          </Grid>
        </Section>
      </motion.div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;