import React from 'react';
import { motion } from 'framer-motion';

interface Order {
  id: string | number;
  customerName: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  timestamp: string;
}

interface RecentOrdersProps {
  orders: Order[];
  onStatusChange?: (orderId: string | number, status: Order['status']) => void;
  className?: string;
}

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, onStatusChange, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Orders
        </h3>
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white">
                    {order.customerName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {order.items.length} items • ₹{order.total.toFixed(2)}
                  </p>
                  <div className="mt-2">
                    {order.items.map((item, index) => (
                      <span
                        key={index}
                        className="inline-block mr-2 mb-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {item.quantity} {item.unit} {item.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={order.status} />
                  {onStatusChange && (
                    <select
                      className="form-select text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(order.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
