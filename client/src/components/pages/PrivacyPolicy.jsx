// src/components/pages/PrivacyPolicy.jsx

import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto prose dark:prose-invert text-gray-400"
    >
      <h1>Privacy Policy</h1>
      <p className="lead">Last updated: September 15, 2025</p>

      <p>
        Welcome to Project Management System, We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
      </p>

      <h2>1. What Information Do We Collect?</h2>
      <p>
        We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, when you participate in activities on the application or otherwise when you contact us. The personal information we collect may include your name, email address, password, and contact details.
      </p>

      <h2>2. How Do We Use Your Information?</h2>
      <p>
        We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
      </p>

      <h2>3. Will Your Information Be Shared With Anyone?</h2>
      <p>
        We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your data to third-party advertisers.
      </p>
      
      <h2>4. How Do We Keep Your Information Safe?</h2>
      <p>
        We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
      </p>
    </motion.div>
  );
};

export default PrivacyPolicy;