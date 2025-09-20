// client/src/components/analytics/AnalyticsTab.jsx

import React, { useState, useEffect } from 'react';
import { analyticsAPI, adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

// UI and Chart Components
import StatCard from '../ui/StatCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

// Icons
import { Users, AlertTriangle, Activity, Check } from 'lucide-react';

// Pie chart ke liye colors
const PIE_COLORS = {
  high: '#FF8042', // Red/Orange
  medium: '#FFBB28', // Yellow
  low: '#00C49F', // Green
  todo: '#0088FE', // Blue
  'in-progress': '#FFBB28', // Yellow
  completed: '#00C49F' // Green
};

const AnalyticsTab = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          adminAPI.getDashboardStats(),
          analyticsAPI.getChartData()
        ]);
        setStats(statsRes.data.stats);
        setChartData(chartsRes.data.data);
      } catch (error) {
        toast.error("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const statsCards = stats ? [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
    { title: 'Active Projects', value: stats.activeProjects, icon: Activity, color: 'green' },
    { title: 'Completed Tasks', value: stats.completedTasks, icon: Check, color: 'purple' },
    { title: 'Overdue Tasks', value: stats.overdueTasks, icon: AlertTriangle, color: 'yellow' },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Analytics Overview</h1>
      
     {/* Stats Cards - Ab yeh real data se render honge */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatCard
            key={index}
            index={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
      
      {/* Dynamic Charts - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Tasks Per Project</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData?.tasksPerProject} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasksCount" name="Tasks" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Tasks by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData?.tasksByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {chartData?.tasksByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Charts - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">New Users (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData?.userRegistrationTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Projects by Priority</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={chartData?.projectsByPriority} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {chartData?.projectsByPriority.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Charts - Third Row */}
      <div className="grid grid-cols-1">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Top 5 Projects Health Check</h2>
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData?.projectHealth}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <Tooltip />
                    <Radar name="Total Tasks" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Completed Tasks" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Radar name="Overdue Tasks" dataKey="C" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsTab;