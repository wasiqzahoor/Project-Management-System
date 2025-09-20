// client/src/components/layout/Sidebar.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FolderOpen, CheckSquare, BarChart3, Shield, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ];

  if (user?.role === 'admin') {
    menuItems.push(
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'admin', label: 'Admin Panel', icon: Shield }
    );
  }

  // Variants for animation
  const sidebarVariants = {
    // Mobile ke liye (slide from left)
    openMobile: { 
      x: 0,
      transition: { type: 'tween', ease: 'easeInOut', duration: 0.3 } 
    },
    closedMobile: { 
      x: '-100%',
      transition: { type: 'tween', ease: 'easeInOut', duration: 0.3 } 
    },
    // Desktop ke liye (expand width)
    openDesktop: { 
      width: '16rem', // 256px
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closedDesktop: { 
      width: '0',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
  };

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const navListVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {}
  };

  const navItemVariants = {
    open: { y: 0, opacity: 1 },
    closed: { y: 20, opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop (Sirf mobile par dikhega) */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            key="sidebar"
            // Screen size ke hisab se alag animations
            variants={{
              open: window.innerWidth < 1024 ? sidebarVariants.openMobile : sidebarVariants.openDesktop,
              closed: window.innerWidth < 1024 ? sidebarVariants.closedMobile : sidebarVariants.closedDesktop,
            }}
            initial="closed"
            animate="open"
            exit="closed"
            // Screen size ke hisab se alag styling
            className="bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 
                       fixed top-0 left-0 h-full z-50 // Mobile styles (Overlay)
                       lg:relative lg:h-auto lg:z-auto lg:flex-shrink-0 // Desktop styles (Push)
                      "
            style={{ overflow: 'hidden' }}
          >
            {/* Inner container taake width fix rahe */}
            <div className="w-64 h-full flex flex-col">
              
              {/* Sidebar Header with Close button for mobile */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <img src="https://i.ibb.co/ZphbmwRs/Chat-GPT-Image-Sep-13-2025-08-08-12-PM.png" alt="Logo" className="w-8 h-8"/>
                    <span className="font-bold text-lg dark:text-white">Menu</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden">
                    <X size={24} className="text-gray-600 dark:text-gray-300"/>
                </button>
              </div>

              {/* Navigation */}
              <motion.nav 
                initial="closed"
                animate="open"
                exit="closed"
                variants={navListVariants}
                className="flex-1 p-4 space-y-2"
              >
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      variants={navItemVariants}
                      onClick={() => {
                        setActiveTab(item.id);
                        // Mobile par link click karne par sidebar band ho jaye
                        if (window.innerWidth < 1024) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </motion.nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;