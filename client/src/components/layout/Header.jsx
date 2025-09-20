import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  // Framer Motion Variants for animations
  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div className="px-4 sm:px-6 py-3">
        <motion.div 
          variants={containerVariants}
          className="flex items-center justify-between"
        >
          {/* Left Side */}
          <motion.div variants={containerVariants} className="flex items-center space-x-2 sm:space-x-4">
            <motion.button 
              variants={itemVariants} 
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu size={24} className="text-gray-600 dark:text-gray-300" />
            </motion.button>
            
            <motion.div
              variants={itemVariants}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-lg flex items-center justify-center"
            >
              <img src="https://i.ibb.co/ZphbmwRs/Chat-GPT-Image-Sep-13-2025-08-08-12-PM.png" alt="Logo" />
            </motion.div>
            
            {/* Title - Hidden on small screens */}
            <motion.div variants={itemVariants} className="hidden md:block">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Project Management
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dynamic Dashboard
              </p>
            </motion.div>
          </motion.div>

          {/* Right Side */}
          <motion.div variants={containerVariants} className="flex items-center space-x-2 sm:space-x-4">
            <motion.div variants={itemVariants}>
              <ThemeToggle />
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center space-x-2 sm:space-x-3">
              {/* User Name - Hidden on small screens */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role || 'User'}
                </p>
              </div>
              
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-blue-500">
                <User size={18} className="text-white" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                variant="ghost"
                size="icon" // Default to icon size for mobile
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full sm:rounded-md sm:w-auto sm:px-3"
              >
                <LogOut size={18} />
                {/* Logout Text - Hidden on mobile */}
                <span className="hidden sm:inline sm:ml-2 text-sm">Logout</span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;