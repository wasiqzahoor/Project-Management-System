// client/src/components/dashboard/ProjectCard.jsx

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Circle
} from 'lucide-react';
import { format } from 'date-fns';
import useOnClickOutside from '../hooks/useOnClickOutside';

const ProjectCard = ({ project, index, onEdit, onDeleteRequest }) => {
  const [stats, setStats] = useState({ progress: 0, completedTasks: 0, totalTasks: 0 });
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);
  useOnClickOutside(menuRef, () => setShowMenu(false));

  // ✅ Progress bar calculation based on tasks
  useEffect(() => {
    const { totalTasks = 0, completedTasks = 0 } = project;

    if (totalTasks > 0) {
      const progress = Math.round((completedTasks / totalTasks) * 100);
      setStats({ progress, completedTasks, totalTasks });
    } else {
      setStats({ progress: 0, completedTasks: 0, totalTasks: 0 });
    }
  }, [project.totalTasks, project.completedTasks]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'on-hold':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onDeleteRequest(project);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit(project);
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow flex flex-col justify-between"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {project.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={handleMenuToggle}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10"
              >
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                >
                  <Edit size={14} className="mr-2" />
                  Edit Project
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete Project
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
              project.priority
            )}`}
          >
            {project.priority}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
              project.status
            )}`}
          >
            {project.status.replace('-', ' ')}
          </span>
          {/* Archived Badge */}
          {!project.isActive && (
            <span className="px-2 py-1 text-xs font-medium rounded-full text-gray-600 bg-gray-200 dark:bg-gray-700">
              Archived
            </span>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{stats.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>
            {stats.completedTasks}/{stats.totalTasks} tasks completed
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {project.deadline && (
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {format(new Date(project.deadline), 'MMM dd')}
              </div>
            )}
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              {project.members?.length || 0}
            </div>
          </div>

          {project.deadline &&
            new Date(project.deadline) < new Date() &&
            project.status !== 'completed' && (
              <div className="flex items-center text-red-500 text-xs">
                <AlertCircle size={12} className="mr-1" />
                Overdue
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
