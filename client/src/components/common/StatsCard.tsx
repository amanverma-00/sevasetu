import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  isAction?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  isAction = false, 
  trend, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md 
        ${isAction ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : ''} 
        ${className}
      `}
      style={color ? { borderTop: `3px solid ${color}` } : undefined}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          {!isAction && (
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {value}
            </p>
          )}
          {trend && !isAction && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div 
            className="text-4xl"
            style={color ? { color } : undefined}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
