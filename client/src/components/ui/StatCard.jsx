// src/components/ui/StatCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, change, trend, color = 'blue', index = 0 }) => {
  // Rango ke liye Tailwind classes ka mapping object
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
    },
    purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/20',
        text: 'text-purple-600 dark:text-purple-400',
      },
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          
          {/* Change aur Trend ko sirf tab show karein jab woh mojood hon */}
          {change && trend && (
            <div className="flex items-center mt-2 text-xs">
              <span className={`flex items-center font-semibold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? <TrendingUp size={14} className="mr-1"/> : <TrendingDown size={14} className="mr-1"/>}
                {change}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
            </div>
          )}
        </div>
        
        {/* Icon */}
        <div className={`p-3 rounded-lg ${selectedColor.bg}`}>
          <Icon className={`h-6 w-6 ${selectedColor.text}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;