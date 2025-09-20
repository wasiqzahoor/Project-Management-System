// src/components/about/AboutUs.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Zap } from 'lucide-react';

const AboutUs = () => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 max-w-4xl mx-auto"
    >
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          About Us
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
          We help you turn great ideas into successful projects.
        </p>
      </div>

      {/* Our Mission Section */}
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Our mission is to make project management simple, fast, and accessible for every team. We build software that is not only powerful but also a joy to use, allowing you to focus on what truly matters your work.
        </p>
      </div>

      {/* What We Offer Section */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">What We Offer</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Zap className="mx-auto h-10 w-10 text-blue-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Real-Time Collaboration</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Update tasks instantly and stay in sync with your entire team.</p>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Intuitive Task Management</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Easily organize your workflow with our drag-and-drop boards.</p>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Users className="mx-auto h-10 w-10 text-purple-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Powerful Admin Tools</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage users and make better decisions with insightful analytics.</p>
          </div>
        </div>
      </div>
      
    </motion.div>
  );
};

export default AboutUs;