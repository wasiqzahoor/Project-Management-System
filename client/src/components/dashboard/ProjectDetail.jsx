// client/src/components/dashboard/ProjectDetail.jsx (FINAL MERGED CODE)

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { tasksAPI } from '../../services/api';
import TaskBoard from './TaskBoard';
import NewTaskModal from './NewTaskModal';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import TaskDetailModal from './TaskDetailModal';
import { useSocket } from '../../contexts/SocketContext';

const ProjectDetail = ({ project, onBack }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
const { user } = useAuth(); 
  // States for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // States for modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  // useEffect for fetching data based on filters
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (priorityFilter !== 'all') params.priority = priorityFilter;

        const res = await tasksAPI.getByProject(project._id, params);
        setTasks(res.data.tasks);
      } catch (error) {
        toast.error('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    if (project?._id) {
      fetchTasks();
    }
  }, [project?._id, searchTerm, priorityFilter]);

  // COMBINED useEffect for all socket-related logic
  useEffect(() => {
    if (!socket || !project?._id) return;

    const handleStatusUpdate = (updatedTask) => {
      console.log('--- EVENT RECEIVED ---', updatedTask);

      setTasks(currentTasks => {
        console.log('--- UPDATING STATE ---');
        const newTasks = currentTasks.map(task =>
          task._id === updatedTask._id ? updatedTask : task
        );
        console.log('--- NEW STATE ---', newTasks);
        return newTasks;
      });
    };

    socket.on('task_status_updated', handleStatusUpdate);

    // Join room
    socket.emit('join_project', project._id);

    // Cleanup
    return () => {
      socket.off('task_status_updated', handleStatusUpdate);
      socket.emit('leave_project', project._id);
    };
  }, [socket, project?._id]);

  // Handler for drag-and-drop task status update
  const handleDropTask = async (taskId, newStatus) => {
    const originalTasks = [...tasks];
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
    try {
      await tasksAPI.updateStatus(taskId, { status: newStatus });
    } catch (error) {
      toast.error('Failed to update task status.');
      setTasks(originalTasks); // Revert on error
    }
  };
 const isOwner = project.owner?._id === user?.id || project.owner === user?.id;
  // Handler to open the new task modal
  const handleOpenNewTaskModal = (status) => {
    setNewTaskStatus(status);
    setIsTaskModalOpen(true);
  };

  // Handler for when a new task is created FROM THE MODAL
  const onTaskModalCreate = () => {
    setIsTaskModalOpen(false);
  };

  // Handler to select a task and open the detail modal
  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  // Handler for when a task is updated FROM THE MODAL
  const onTaskModalUpdate = () => {
    setDetailModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
        </div>
      </div>

      {/* Search and Filter UI */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Pass loading prop to TaskBoard */}
      <TaskBoard
        tasks={tasks}
        loading={loading}
        onDropTask={handleDropTask}
        onAddTask={handleOpenNewTaskModal}
        onSelectTask={handleSelectTask}
        isOwner={isOwner} 
      />

      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={onTaskModalCreate}
        projectId={project._id}
        initialStatus={newTaskStatus}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        task={selectedTask}
        onTaskUpdated={onTaskModalUpdate}
      />
    </div>
  );
};

export default ProjectDetail;
