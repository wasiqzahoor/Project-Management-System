import React, { useState } from 'react';
import { tasksAPI } from '../../services/api';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { Upload, Paperclip, Trash2 } from 'lucide-react';

const TaskDetailModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!task) return null;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first.');
      return;
    }
    setLoading(true);
    try {
      await tasksAPI.uploadFile(task._id, selectedFile);
      toast.success('File uploaded successfully!');
      setSelectedFile(null); // Reset file input
      onTaskUpdated(); // Refresh the task data in the parent component
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload file.');
    } finally {
      setLoading(false);
    }
  };
  
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" size="lg">
      <div className="space-y-6">
        {/* Task Info */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{task.description}</p>
          <div className="mt-4 flex items-center gap-4">
             <span className={`px-3 py-1 text-sm font-semibold rounded-full ${priorityColors[task.priority]}`}>
                Priority: {task.priority}
            </span>
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                Status: {task.status}
            </span>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Attachments</h4>
          
          {/* File Upload Form */}
          <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <input 
              type="file" 
              onChange={handleFileChange} 
              id="file-upload"
              className="hidden"
            />
            <label htmlFor="file-upload" className="flex-1 cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                {selectedFile ? selectedFile.name : 'Choose a file to upload...'}
            </label>
            <Button onClick={handleFileUpload} loading={loading} disabled={!selectedFile} size="sm">
              <Upload size={16} className="mr-2"/>
              Upload
            </Button>
          </div>

          {/* Existing Attachments List */}
          <div className="mt-4 space-y-2">
            {task.attachments && task.attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Paperclip size={16} className="text-gray-500" />
                  <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${file.path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    {file.originalName}
                  </a>
                </div>
                {/* Delete button (optional feature) */}
                {/* <Button variant="ghost" size="sm" className="text-red-500"><Trash2 size={16} /></Button> */}
              </div>
            ))}
            {task.attachments && task.attachments.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No attachments yet.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;