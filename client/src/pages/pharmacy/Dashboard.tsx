// pages/pharmacy/Dashboard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/common/StatsCard';
import LowStockAlert from '../../components/pharmacy/LowStockAlert';
import RecentOrders from '../../components/pharmacy/RecentOrders';

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

const PharmacyDashboard: React.FC = () => {
  // In a real app, this data would come from API calls
  const stats = [
    { title: 'Total Orders', value: 24, icon: '🛒', color: '#667eea' },
    { title: 'Pending Orders', value: 5, icon: '⏱️', color: '#764ba2' },
    { title: 'Low Stock Items', value: 3, icon: '⚠️', color: '#ff5858' },
    { title: 'Revenue', value: '₹12,458', icon: '💰', color: '#4facfe' },
  ];

  const lowStockItems = [
    { 
      id: 1,
      name: 'Amoxicillin',
      currentStock: 12,
      minStock: 20,
      reorderPoint: 15,
      unit: 'boxes'
    },
    { 
      id: 2,
      name: 'Insulin',
      currentStock: 8,
      minStock: 15,
      reorderPoint: 10,
      unit: 'vials'
    },
    { 
      id: 3,
      name: 'Atorvastatin',
      currentStock: 18,
      minStock: 25,
      reorderPoint: 20,
      unit: 'boxes'
    },
  ];

  const recentOrders = [
    {
      id: 1,
      customerName: 'Rahul Sharma',
      items: [
        { name: 'Amoxicillin', quantity: 2, unit: 'boxes' },
        { name: 'Paracetamol', quantity: 1, unit: 'boxes' }
      ],
      total: 545,
      status: 'completed',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      customerName: 'Priya Patel',
      items: [
        { name: 'Insulin', quantity: 3, unit: 'vials' },
        { name: 'Syringes', quantity: 2, unit: 'boxes' }
      ],
      total: 1245,
      status: 'processing',
      timestamp: new Date().toISOString()
    },
    {
      id: 3,
      customerName: 'Amit Kumar',
      items: [
        { name: 'Atorvastatin', quantity: 1, unit: 'box' }
      ],
      total: 325,
      status: 'pending',
      timestamp: new Date().toISOString()
    }
  ];

  return (
    <DashboardLayout userType="pharmacist">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Section>
          <SectionTitle>Pharmacy Overview</SectionTitle>
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
          <SectionTitle>Low Stock Alerts</SectionTitle>
          <LowStockAlert medicines={lowStockItems} />
        </Section>

        <Section>
          <SectionTitle>Recent Orders</SectionTitle>
          <RecentOrders orders={recentOrders} />
        </Section>

        <Section>
          <SectionTitle>Quick Actions</SectionTitle>
          <Grid>
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <StatsCard 
                title="Manage Inventory" 
                value=""
                icon="📦" 
                color="#4facfe" 
                isAction={true}
              />
            </motion.div>
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <StatsCard 
                title="View Orders" 
                value=""
                icon="🛒" 
                color="#f093fb" 
                isAction={true}
              />
            </motion.div>
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <StatsCard 
                title="Add Medicine" 
                value=""
                icon="💊" 
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

export default PharmacyDashboard;