// src/components/pages/FAQ.jsx

import React from 'react';
import { motion } from 'framer-motion';

const FAQItem = ({ question, answer }) => (
  <div className="py-6">
    <dt className="text-lg font-medium text-gray-900 dark:text-white">{question}</dt>
    <dd className="mt-2 text-base text-gray-500 dark:text-gray-400">{answer}</dd>
  </div>
);

const FAQ = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Can't find the answer you're looking for? Reach out to our support team.</p>
      </div>

      <div className="mt-12">
        <dl className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
          <FAQItem
            question="How do I create a new project?"
            answer="Simply click the 'New Project' button on the dashboard or projects tab. Fill in the details in the modal that appears and click 'Create Project'."
          />
          <FAQItem
            question="Can I add members to my project?"
            answer="Yes, when creating or editing a project, you can use the 'Members' dropdown to search and add registered users to your project."
          />
          <FAQItem
            question="How does real-time update work?"
            answer="We use WebSockets to instantly push changes to all connected members of a project. When you drag a task to a new column, everyone else sees it move immediately."
          />
           <FAQItem
            question="Is there a limit on file uploads?"
            answer="Currently, each individual file is limited to 5MB. You can upload multiple files to a single task."
          />
        </dl>
      </div>
    </motion.div>
  );
};

export default FAQ;