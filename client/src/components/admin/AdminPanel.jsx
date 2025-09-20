import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import UserList from './UserList';
import StatCard from '../ui/StatCard';
import { Users, Folder, CheckSquare } from 'lucide-react';


const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllUsers(),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    } catch (error) {
      toast.error('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatus = async (userId, isActive) => {
    try {
      await adminAPI.updateUserStatus(userId, { isActive });
      toast.success(`User status updated.`);
      fetchAdminData(); // Refresh data
    } catch (error) {
      toast.error('Failed to update user status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        await adminAPI.deleteUser(userId);
        toast.success('User deleted successfully.');
        fetchAdminData(); // Refresh data
      } catch (error) {
        toast.error('Failed to delete user.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
      
       {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Naye component ko is tarah istemal karein */}
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="blue" index={0} />
          <StatCard title="Total Projects" value={stats.totalProjects} icon={Folder} color="green" index={1} />
          <StatCard title="Total Tasks" value={stats.totalTasks} icon={CheckSquare} color="purple" index={2} />
        </div>
      )}
      
      {/* User List Table */}
      <UserList
        users={users}
        onUpdateStatus={handleUpdateUserStatus}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default AdminPanel;