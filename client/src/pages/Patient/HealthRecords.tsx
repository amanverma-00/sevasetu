// pages/patient/HealthRecords.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import HealthRecordCard from '../../components/health/HealthRecordCard';
import AddrecordModel from '../../components/health/AddrecordModel';
import { OffilneIndicator } from '../../components/common/OffilneIndicator';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface HealthRecord {
  id: number;
  date: string;
  type: string;
  doctorName: string;
  diagnosis: string;
  description: string;
  attachments: string[];
}

const HealthRecords: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<HealthRecord[]>([
    {
      id: 1,
      date: '2025-08-25',
      type: 'Lab Test',
      doctorName: 'Dr. Sharma',
      diagnosis: 'Regular checkup',
      description: 'Blood test results normal',
      attachments: ['blood_test.pdf']
    },
    {
      id: 2,
      date: '2025-08-15',
      type: 'Prescription',
      doctorName: 'Dr. Kapoor',
      diagnosis: 'Seasonal flu',
      description: 'Prescribed antibiotics and rest',
      attachments: ['prescription.pdf']
    }
  ]);

  React.useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);

    // Check online status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAddRecord = (newRecord: Omit<HealthRecord, 'id'>) => {
    const record: HealthRecord = {
      ...newRecord,
      id: records.length + 1
    };
    setRecords([...records, record]);
  };

  return (
    <DashboardLayout userType="patient">
      <div className="container mx-auto px-4 py-6">
        {isOffline && <OffilneIndicator />}
        
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">
              Health Records
            </h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Add Record
            </button>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {records.map((record) => (
                <HealthRecordCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {isAddModalOpen && (
            <AddrecordModel
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={(data) => {
                handleAddRecord(data as Omit<HealthRecord, 'id'>);
                setIsAddModalOpen(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default HealthRecords;
//   color: white;
//   border: none;
//   border-radius: 50px;
//   font-weight: 600;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
// `;

// const RecordsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
//   gap: 1.5rem;
//   margin-bottom: 2rem;
// `;

// const EmptyState = styled(motion.div)`
//   text-align: center;
//   padding: 3rem;
//   color: ${props => props.theme.colors.text};
//   opacity: 0.7;
// `;

// const ErrorMessage = styled.div`
//   padding: 1rem;
//   background: #ffebee;
//   color: #c62828;
//   border-radius: 8px;
//   margin-bottom: 1rem;
// `;

// const HealthRecords: React.FC = () => {
//   const { records, loading, error, isOnline, addRecord, deleteRecord, refreshRecords } = useHealthRecords();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleAddRecord = async (recordData: any) => {
//     await addRecord(recordData);
//     setIsModalOpen(false);
//   };

//   if (loading) {
//     return (
//       <DashboardLayout userType="patient">
//         <Container>
//           <LoadingSpinner />
//         </Container>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout userType="patient">
//       <Container>
//         <Header>
//           <Title>Health Records</Title>
//           <AddButton
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setIsModalOpen(true)}
//           >
//             <span>+</span> Add Record
//           </AddButton>
//         </Header>

//         {!isOnline && (
//           <OfflineIndicator 
//             message="You are currently offline. Records are stored locally and will sync when you're back online." 
//           />
//         )}

//         {error && (
//           <ErrorMessage>
//             {error}
//           </ErrorMessage>
//         )}

//         <AnimatePresence>
//           {records.length === 0 ? (
//             <EmptyState
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <h3>No health records yet</h3>
//               <p>Add your first health record to get started</p>
//             </EmptyState>
//           ) : (
//             <RecordsGrid>
//               {records.map((record, index) => (
//                 <motion.div
//                   key={record.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   layout
//                 >
//                   <HealthRecordCard
//                     record={record}
//                     onDelete={deleteRecord}
//                   />
//                 </motion.div>
//               ))}
//             </RecordsGrid>
//           )}
//         </AnimatePresence>

//         <AddRecordModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onSave={handleAddRecord}
//         />
//       </Container>
//     </DashboardLayout>
//   );
// };

// export default HealthRecords;