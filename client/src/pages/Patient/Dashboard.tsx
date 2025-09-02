// pages/patient/Dashboard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/common/StatsCard';
import AppointmentCard from '../../components/patient/AppointmentCard';
import MedicineAvailability from '../../components/patient/MedicineAvailability';

const PatientDashboard: React.FC = () => {
  // In a real app, this data would come from API calls
  const stats = [
    { title: 'Upcoming Appointments', value: 2, icon: '📅', color: 'bg-primary' },
    { title: 'Medical Records', value: 5, icon: '📋', color: 'bg-secondary' },
    { title: 'Prescriptions', value: 3, icon: '💊', color: 'bg-pink-400' },
    { title: 'Messages', value: 4, icon: '✉️', color: 'bg-blue-400' },
  ];

  const appointments = [
    { id: 1, doctor: 'Dr. Sharma', date: '2023-06-15', time: '10:00 AM', type: 'Video Consultation' },
    { id: 2, doctor: 'Dr. Kapoor', date: '2023-06-17', time: '2:30 PM', type: 'In-Person' },
  ];

  const medicines = [
    { id: 1, name: 'Paracetamol', availability: 85, pharmacies: 5, pharmacy: 'MedPlus', price: 10 },
    { id: 2, name: 'Amoxicillin', availability: 60, pharmacies: 3, pharmacy: 'Apollo', price: 15 },
    { id: 3, name: 'Metformin', availability: 90, pharmacies: 7, pharmacy: 'LifeCare', price: 20 },
  ];

  return (
    <DashboardLayout userType="patient">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark">Upcoming Appointments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AppointmentCard appointment={appointment} />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark">Medicine Availability</h2>
          <MedicineAvailability medicines={medicines} />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <StatsCard 
                title="Book Appointment" 
                value=""
                icon="📅" 
                color="bg-blue-400" 
                isAction={true}
              />
            </motion.div>
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <StatsCard 
                title="Symptom Checker" 
                value=""
                icon="🤖" 
                color="bg-pink-400" 
                isAction={true}
              />
            </motion.div>
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <StatsCard 
                title="Health Records" 
                value=""
                icon="📋" 
                color="bg-green-400" 
                isAction={true}
              />
            </motion.div>
          </div>
        </section>
      </motion.div>
    </DashboardLayout>
  );
};

export default PatientDashboard;