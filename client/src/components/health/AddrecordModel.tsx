import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

interface FormData {
  date: string;
  type: string;
  doctorName: string;
  diagnosis: string;
  description: string;
  attachments: string[];
}

export const AddrecordModel: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    type: '',
    doctorName: '',
    diagnosis: '',
    description: '',
    attachments: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background-light dark:bg-background-dark rounded-lg p-6 shadow-xl z-10 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">
              Add Health Record
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                  Record Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Lab Test">Lab Test</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Surgery">Surgery</option>
                </select>
              </div>

              <div>
                <label htmlFor="doctorName" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                  Doctor's Name
                </label>
                <input
                  type="text"
                  id="doctorName"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                  Diagnosis
                </label>
                <input
                  type="text"
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary h-24 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-text-light dark:text-text-dark border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Add Record
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
//   margin-bottom: 1.5rem;
//   color: ${props => props.theme.colors.text};
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const Input = styled.input`
//   padding: 0.75rem;
//   border: 1px solid ${props => props.theme.colors.border};
//   border-radius: 8px;
//   font-size: 1rem;
//   background: ${props => props.theme.colors.inputBackground};
//   color: ${props => props.theme.colors.text};
// `;

// const TextArea = styled.textarea`
//   padding: 0.75rem;
//   border: 1px solid ${props => props.theme.colors.border};
//   border-radius: 8px;
//   font-size: 1rem;
//   min-height: 100px;
//   resize: vertical;
//   background: ${props => props.theme.colors.inputBackground};
//   color: ${props => props.theme.colors.text};
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 1rem;
//   justify-content: flex-end;
//   margin-top: 1rem;
// `;

// const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
//   padding: 0.75rem 1.5rem;
//   border: none;
//   border-radius: 8px;
//   font-size: 1rem;
//   cursor: pointer;
//   background: ${props => 
//     props.variant === 'primary' 
//       ? props.theme.colors.primary 
//       : 'transparent'};
//   color: ${props => 
//     props.variant === 'primary' 
//       ? 'white' 
//       : props.theme.colors.text};
  
//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;

// interface AddRecordModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (record: any) => void;
// }

// const AddRecordModal: React.FC<AddRecordModalProps> = ({ isOpen, onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     date: '',
//     doctorName: '',
//     diagnosis: '',
//     prescription: '',
//     notes: ''
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//     setFormData({
//       date: '',
//       doctorName: '',
//       diagnosis: '',
//       prescription: '',
//       notes: ''
//     });
//   };

//   const handleClose = () => {
//     setFormData({
//       date: '',
//       doctorName: '',
//       diagnosis: '',
//       prescription: '',
//       notes: ''
//     });
//     onClose();
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <Overlay
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={handleClose}
//         >
//           <Modal
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <Title>Add Health Record</Title>
            
//             <Form onSubmit={handleSubmit}>
//               <Input
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//                 placeholder="Date"
//               />
              
//               <Input
//                 type="text"
//                 name="doctorName"
//                 value={formData.doctorName}
//                 onChange={handleChange}
//                 required
//                 placeholder="Doctor's Name"
//               />
              
//               <Input
//                 type="text"
//                 name="diagnosis"
//                 value={formData.diagnosis}
//                 onChange={handleChange}
//                 required
//                 placeholder="Diagnosis"
//               />
              
//               <TextArea
//                 name="prescription"
//                 value={formData.prescription}
//                 onChange={handleChange}
//                 placeholder="Prescription (optional)"
//               />
              
//               <TextArea
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 placeholder="Additional Notes (optional)"
//               />
              
//               <ButtonGroup>
//                 <Button type="button" onClick={handleClose}>
//                   Cancel
//                 </Button>
//                 <Button 
//                   type="submit" 
//                   variant="primary"
//                   disabled={!formData.date || !formData.doctorName || !formData.diagnosis}
//                 >
//                   Save Record
//                 </Button>
//               </ButtonGroup>
//             </Form>
//           </Modal>
//         </Overlay>
//       )}
//     </AnimatePresence>
//   );
// };

// export default AddRecordModal;