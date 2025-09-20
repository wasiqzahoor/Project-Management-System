// client/src/components/dashboard/ProjectModal.jsx

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select'; // react-select ko import karein
import api, { projectsAPI } from '../../services/api'; // api ko bhi import karein
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const ProjectModal = ({ isOpen, onClose, onSave, projectToEdit }) => {
  const isEditMode = !!projectToEdit;

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]); // Sab users ko store karne ke liye state

  // Users ki list fetch karne ke liye useEffect
  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const res = await api.get('/users'); // Humari nayi API
          // react-select ke format mein users ko transform karein
          const userOptions = res.data.users.map(user => ({
            value: user._id,
            label: user.name,
          }));
          setAllUsers(userOptions);
        } catch (error) {
          toast.error('Could not load users.');
        }
      };
      fetchUsers();
    }
  }, [isOpen]); // Yeh tab chalega jab modal khulega

  // Form ko data se fill karne ke liye useEffect
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && projectToEdit) {
         const validMembers = (projectToEdit.members || []).filter(member => member !== null);
        setFormData({
          title: projectToEdit.title || '',
          description: projectToEdit.description || '',
          priority: projectToEdit.priority || 'medium',
          status: projectToEdit.status || 'in-progress',
          deadline: projectToEdit.deadline ? new Date(projectToEdit.deadline) : null,
          // Maujooda members ko set karein
           members: validMembers.map(m => m._id), 
        });
      } else {
         setFormData({
          title: '',
          description: '',
          priority: 'medium',
          status: 'in-progress',
          isActive: true,
          deadline: null,
          members: [],
        });
      }
    }
  }, [isOpen, projectToEdit, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, deadline: date });
  };

  // Members ke select ke liye naya handler
  const handleMembersChange = (selectedOptions) => {
    const memberIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData({ ...formData, members: memberIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await projectsAPI.update(projectToEdit._id, formData);
        toast.success('Project updated successfully!');
      } else {
        await projectsAPI.create(formData);
        toast.success('Project created successfully!');
      }
      onSave();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} project.`);
    } finally {
      setLoading(false);
    }
  };
  
  // react-select ke "value" prop ke liye maujooda selected members ko find karein
  const selectedMemberOptions = allUsers.filter(option => formData.members?.includes(option.value));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Project' : 'Create New Project'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Title</label>
          <input name="title" value={formData.title || ''} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700" />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description || ''} onChange={handleChange} required rows="3" className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700"></textarea>
        </div>
        
        {/* Members Select UI */}
        <div>
          <label>Members</label>
          <Select
            isMulti
            name="members"
            options={allUsers}
            value={selectedMemberOptions}
            onChange={handleMembersChange}
            className="mt-1 react-select-container"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex gap-4">
       {/* Workflow Status Dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select name="status" value={formData.status || 'in-progress'} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700">
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
         {/* Priority Dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
            <select name="priority" value={formData.priority || 'medium'} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          </div>
          <div className="flex gap-4">
            {/* Deadline Picker */}
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                <DatePicker selected={formData.deadline} onChange={handleDateChange} className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700" />
            </div>
         {/* Naya Active/Inactive Dropdown */}
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project State</label>
                <select name="isActive" value={formData.isActive ? 'true' : 'false'} onChange={e => setFormData({...formData, isActive: e.target.value === 'true'})} className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700">
                  <option value="true">Active</option>
                  <option value="false">Inactive (Archived)</option>
                </select>
            </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{isEditMode ? 'Save Changes' : 'Create Project'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;