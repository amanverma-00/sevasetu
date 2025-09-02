import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface Medicine {
  id: string | number;
  name: string;
  pharmacy: {
    id: string | number;
    name: string;
    distance: string;
    address: string;
  };
  price: number;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  quantity?: number;
}

interface MedicineAvailabilityProps {
  medicines: Medicine[];
  onViewPharmacy?: (pharmacyId: string | number) => void;
  className?: string;
}

const StyledCard = styled(motion.div)`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StockBadge = styled.span<{ status: Medicine['availability'] }>`
  ${({ status }) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  }}
`;

const MedicineAvailability: React.FC<MedicineAvailabilityProps> = ({
  medicines,
  onViewPharmacy,
  className = ''
}) => {
  return (
    <StyledCard
      className={`p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Medicine Availability
      </h3>

      <div className="space-y-4">
        {medicines.map((medicine) => (
          <motion.div
            key={medicine.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                  {medicine.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {medicine.pharmacy.name} • {medicine.pharmacy.distance}
                </p>
              </div>
              <StockBadge
                status={medicine.availability}
                className="px-2.5 py-0.5 rounded-full text-sm font-medium"
              >
                {medicine.availability.replace('-', ' ')}
              </StockBadge>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                ₹{medicine.price.toFixed(2)}
                {medicine.quantity && ` • ${medicine.quantity} available`}
              </div>
              {onViewPharmacy && (
                <button
                  onClick={() => onViewPharmacy(medicine.pharmacy.id)}
                  className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors duration-200"
                >
                  View Pharmacy →
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {medicine.pharmacy.address}
            </p>
          </motion.div>
        ))}
      </div>
    </StyledCard>
  );
};

export default MedicineAvailability;
