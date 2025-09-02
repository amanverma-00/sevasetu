import React from 'react';
import { motion } from 'framer-motion';

interface HealthRecord {
  id: number;
  date: string;
  type: string;
  doctorName: string;
  diagnosis: string;
  description: string;
  attachments: string[];
}

interface Props {
  record: HealthRecord;
}

export const HealthRecordCard: React.FC<Props> = ({ record }) => {
  return (
    <motion.div
      className="bg-background-light dark:bg-background-dark rounded-lg p-6 shadow-md border-l-4 border-primary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-sm text-text-light dark:text-text-dark opacity-70">
            {new Date(record.date).toLocaleDateString()}
          </span>
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mt-1">
            Dr. {record.doctorName}
          </h3>
          <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-sm mt-2">
            {record.type}
          </span>
        </div>
        <button
          className="text-text-light dark:text-text-dark opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Delete record"
        >
          ×
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <h4 className="font-medium text-text-light dark:text-text-dark">Diagnosis</h4>
          <p className="text-text-light dark:text-text-dark opacity-70">{record.diagnosis}</p>
        </div>

        <div>
          <h4 className="font-medium text-text-light dark:text-text-dark">Description</h4>
          <p className="text-text-light dark:text-text-dark opacity-70">{record.description}</p>
        </div>

        {record.attachments.length > 0 && (
          <div>
            <h4 className="font-medium text-text-light dark:text-text-dark">Attachments</h4>
            <div className="flex gap-2 mt-1">
              {record.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href="#"
                  className="inline-flex items-center px-3 py-1 bg-background-light dark:bg-background-dark rounded border border-primary/20 text-sm text-primary hover:bg-primary/5 transition-colors"
                >
                  📎 {attachment}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
// `;

// const Diagnosis = styled.p`
//   margin: 0.5rem 0;
//   font-weight: 600;
//   color: ${props => props.theme.colors.text};
// `;

// const Prescription = styled.div`
//   margin: 1rem 0;
//   padding: 1rem;
//   background: rgba(102, 126, 234, 0.1);
//   border-radius: 8px;
// `;

// const Notes = styled.p`
//   margin: 1rem 0;
//   font-style: italic;
//   color: ${props => props.theme.colors.text};
//   opacity: 0.8;
// `;

// const DeleteButton = styled(motion.button)`
//   background: none;
//   border: none;
//   color: #f44336;
//   cursor: pointer;
//   padding: 0.5rem;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// interface HealthRecordCardProps {
//   record: HealthRecord;
//   onDelete: (id: string) => void;
// }

// const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ record, onDelete }) => {
//   const handleDelete = () => {
//     if (window.confirm('Are you sure you want to delete this health record?')) {
//       onDelete(record.id);
//     }
//   };

//   return (
//     <Card
//       whileHover={{ y: -5 }}
//       transition={{ duration: 0.2 }}
//     >
//       <Header>
//         <div>
//           <DateText>{new Date(record.date).toLocaleDateString()}</DateText>
//           <DoctorName>{record.doctorName}</DoctorName>
//         </div>
//         <DeleteButton
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleDelete}
//         >
//           🗑️
//         </DeleteButton>
//       </Header>

//       <Diagnosis>Diagnosis: {record.diagnosis}</Diagnosis>

//       {record.prescription && (
//         <Prescription>
//           <strong>Prescription:</strong> {record.prescription}
//         </Prescription>
//       )}

//       {record.notes && (
//         <Notes>Notes: {record.notes}</Notes>
//       )}
//     </Card>
//   );
// };

// export default HealthRecordCard;