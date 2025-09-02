// // hooks/useHealthRecords.ts
// import { useState, useEffect } from 'react';
// import { HealthRecord, indexedDBService } from '../services/indexedDB';

// export const useHealthRecords = () => {
//   const [records, setRecords] = useState<HealthRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   useEffect(() => {
//     loadRecords();
//   }, []);

//   const loadRecords = async () => {
//     try {
//       setLoading(true);
//       const storedRecords = await indexedDBService.getRecords();
//       setRecords(storedRecords);
      
//       // If online, try to sync with server
//       if (isOnline) {
//         await syncWithServer();
//       }
//     } catch (err) {
//       setError('Failed to load health records');
//       console.error('Error loading records:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const syncWithServer = async () => {
//     try {
//       // In a real app, this would fetch from your backend API
//       // For now, we'll simulate this with mock data
//       const mockRecords: HealthRecord[] = [
//         {
//           id: '1',
//           date: '2023-06-15',
//           doctorName: 'Dr. Sharma',
//           diagnosis: 'Seasonal Flu',
//           prescription: 'Paracetamol 500mg, 3 times daily for 5 days',
//           notes: 'Patient advised to rest and drink plenty of fluids'
//         },
//         {
//           id: '2',
//           date: '2023-05-20',
//           doctorName: 'Dr. Kapoor',
//           diagnosis: 'Hypertension',
//           prescription: 'Amlodipine 5mg daily, regular BP monitoring',
//           notes: 'Follow up in 2 weeks'
//         }
//       ];

//       // Store mock records in IndexedDB
//       for (const record of mockRecords) {
//         await indexedDBService.addRecord(record);
//       }

//       // Reload records from IndexedDB
//       const updatedRecords = await indexedDBService.getRecords();
//       setRecords(updatedRecords);
//     } catch (err) {
//       console.error('Error syncing with server:', err);
//     }
//   };

//   const addRecord = async (record: Omit<HealthRecord, 'id'>) => {
//     try {
//       const newRecord = {
//         ...record,
//         id: Date.now().toString()
//       };

//       await indexedDBService.addRecord(newRecord);
//       setRecords(prev => [...prev, newRecord]);
      
//       // In a real app, you would also send this to your backend
//       // when online, and handle offline queueing
//     } catch (err) {
//       setError('Failed to add health record');
//       console.error('Error adding record:', err);
//       throw err;
//     }
//   };

//   const deleteRecord = async (id: string) => {
//     try {
//       await indexedDBService.deleteRecord(id);
//       setRecords(prev => prev.filter(record => record.id !== id));
      
//       // In a real app, you would also delete from your backend
//       // when online, and handle offline queueing
//     } catch (err) {
//       setError('Failed to delete health record');
//       console.error('Error deleting record:', err);
//       throw err;
//     }
//   };

//   return {
//     records,
//     loading,
//     error,
//     isOnline,
//     addRecord,
//     deleteRecord,
//     refreshRecords: loadRecords
//   };
// };