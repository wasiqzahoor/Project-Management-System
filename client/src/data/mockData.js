// Mock data for all charts

// Area Chart Data
export const areaChartData = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
  { name: 'Jul', revenue: 3490, profit: 4300 },
  { name: 'Aug', revenue: 4000, profit: 2400 },
  { name: 'Sep', revenue: 3000, profit: 1398 },
  { name: 'Oct', revenue: 2000, profit: 9800 },
  { name: 'Nov', revenue: 2780, profit: 3908 },
  { name: 'Dec', revenue: 1890, profit: 4800 },
];

// Bar Chart Data
export const barChartData = [
  { name: 'Jan', online: 4000, inStore: 2400 },
  { name: 'Feb', online: 3000, inStore: 1398 },
  { name: 'Mar', online: 2000, inStore: 5800 },
  { name: 'Apr', online: 2780, inStore: 3908 },
  { name: 'May', online: 1890, inStore: 4800 },
  { name: 'Jun', online: 2390, inStore: 3800 },
];

// Pie Chart Data
export const pieChartData = [
  { name: 'Organic', value: 400 },
  { name: 'Direct', value: 300 },
  { name: 'Referral', value: 300 },
  { name: 'Social', value: 200 },
];

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Line Chart Data
export const lineChartData = [
  { name: 'Jan', visits: 4000, conversions: 240 },
  { name: 'Feb', visits: 3000, conversions: 139 },
  { name: 'Mar', visits: 2000, conversions: 980 },
  { name: 'Apr', visits: 2780, conversions: 390 },
  { name: 'May', visits: 1890, conversions: 480 },
  { name: 'Jun', visits: 2390, conversions: 380 },
];

// Radar Chart Data
export const radarChartData = [
  { subject: 'Speed', A: 80, B: 60 },
  { subject: 'Quality', A: 95, B: 90 },
  { subject: 'Support', A: 50, B: 85 },
  { subject: 'Features', A: 85, B: 65 },
  { subject: 'UX', A: 90, B: 79 },
  { subject: 'Stability', A: 70, B: 60 },
];
import { BarChart3, Users, ShoppingCart, DollarSign } from 'lucide-react';
// Stats Cards Data
export const mockStats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign, // <-- AB YEH EK COMPONENT HAI, OBJECT NAHI
    color: 'green',
  },
  {
    title: 'Subscriptions',
    value: '+2350',
    change: '+180.1%',
    trend: 'up',
    icon: Users, // <-- AB YEH EK COMPONENT HAI
    color: 'purple',
  },
  {
    title: 'Sales',
    value: '+12,234',
    change: '+19%',
    trend: 'up',
    icon: ShoppingCart, // <-- AB YEH EK COMPONENT HAI
    color: 'blue',
  },
  {
    title: 'Active Now',
    value: '+573',
    change: '-2.1%',
    trend: 'down',
    icon: BarChart3, // <-- AB YEH EK COMPONENT HAI
    color: 'yellow',
  }
];
