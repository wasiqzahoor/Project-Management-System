import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './contexts/SocketContext';

import AuthCallback from './components/auth/AuthCallback';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import AboutUs from './components/about/AboutUs';
import Contact from './components/pages/Contact';
import FAQ from './components/pages/FAQ'; 
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import Dashboard from './components/dashboard/Dashboard';
import TasksTab from './components/tasks/TasksTab';
import ProjectDetail from './components/dashboard/ProjectDetail'; 
import Login from './components/auth/Login';
import ProjectsTab from './components/projects/ProjectsTab';
import Register from './components/auth/Register';
import Footer from './components/layout/Footer';
import AnalyticsTab from './components/analytics/AnalyticsTab';
import ForgotPassword from './components/auth/ForgotPassword';
import AdminPanel from './components/admin/AdminPanel'; 

// 🔹 Auth Page
const AuthPage = () => {
  const [authView, setAuthView] = useState('login'); // 'login', 'register', 'forgot'

  if (authView === 'login') {
    return <Login onToggleRegister={() => setAuthView('register')} onForgotPassword={() => setAuthView('forgot')} />;
  }
  if (authView === 'register') {
    return <Register onToggle={() => setAuthView('login')} />;
  }
  if (authView === 'forgot') {
    return <ForgotPassword onBackToLogin={() => setAuthView('login')} />;
  }
};


// 🔹 Main App (authenticated UI)
const MainApp = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null); // <-- Naya state
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleProjectSelect = (project) => {
      setSelectedProject(project);
      // Optional: Aap activeTab ko bhi change kar sakte hain agar zaroorat ho
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderContent = () => {
    // Agar project select ho gaya hai → ProjectDetail show karein
    if (selectedProject) {
      return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
    }

    // Warna tabs ke hisaab se render karein
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onProjectSelect={setSelectedProject} />;
     case 'projects':
        return <ProjectsTab onProjectSelect={handleProjectSelect} />;
         case 'tasks':
        return <TasksTab />;
         case 'analytics':
        return <AnalyticsTab />;
      case 'admin':
        return <div className="p-6 text-center text-gray-600 dark:text-gray-400"><AdminPanel/></div>;
        case 'about':
        return <AboutUs />;
         case 'contact':
        return <Contact />;
      case 'faq':
        return <FAQ />;
      case 'privacy':
        return <PrivacyPolicy />;
      default:
        return <Dashboard onProjectSelect={setSelectedProject} />;
    }
  };

  return (
    // Step 1: Main container ko flex column banayein aur screen ki poori height dein
   <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header ko state toggle karne wala function pass karein */}
      <Header toggleSidebar={toggleSidebar} />
      {/* Step 2: Yeh container baaqi ki saari jagah le lega */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar ko state aur usay set karne wala function pass karein */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        {/* Step 3: Main content area scrollable hoga */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
          <Footer setActiveTab={setActiveTab} />
        </main>
      </div>
    </div>
  );
};


// 🔹 Root App Component
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <DndProvider backend={HTML5Backend}>
            <Router>
              <div className="App">
                <MainApp />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--toast-bg)',
                      color: 'var(--toast-color)',
                    },
                  }}
                />
              </div>
              <Routes>
              <Route path="/auth/callback" element={<AuthCallback />} />
              </Routes>
            </Router>
          </DndProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
