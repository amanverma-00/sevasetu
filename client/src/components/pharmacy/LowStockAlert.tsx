import React from 'react';
import { motion } from 'framer-motion';

interface Medicine {
  id: string | number;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
  reorderPoint: number;
}

interface LowStockAlertProps {
  medicines: Medicine[];
  onReorder?: (medicineId: string | number) => void;
  className?: string;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ medicines, onReorder, className = '' }) => {
  const lowStockMedicines = medicines.filter(med => med.currentStock <= med.reorderPoint);

  if (lowStockMedicines.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Low Stock Alert
          </h3>
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            {lowStockMedicines.length} items need attention
          </span>
        </div>

        <div className="space-y-4">
          {lowStockMedicines.map((medicine) => (
            <motion.div
              key={medicine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white">
                    {medicine.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Current Stock: {medicine.currentStock} {medicine.unit}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Min Required: {medicine.minStock} {medicine.unit}
                    </span>
                  </div>
                </div>
                {onReorder && (
                  <button
                    onClick={() => onReorder(medicine.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:hover:bg-red-800"
                  >
                    Reorder
                  </button>
                )}
              </div>
              <div className="mt-2">
                <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-2">
                  <div
                    className="bg-red-600 dark:bg-red-500 rounded-full h-2"
                    style={{
                      width: `${Math.min(
                        (medicine.currentStock / medicine.minStock) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;
