// src/contexts/SocketContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
        transports: ['websocket'],
      });
      setSocket(newSocket);
  newSocket.on('connect', () => {
        console.log('[CLIENT LOG] Socket connected successfully! ID:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        console.log('[CLIENT LOG] Socket disconnected!');
      });
  // =================== YEH NAYA LISTENER ADD KAREIN ===================
      newSocket.on('hello', (data) => {
        console.log('%c PING RECEIVED FROM SERVER! ', 'background: #22c55e; color: #ffffff; font-weight: bold;', data);
      });
      // ====================================================================

      // Sirf woh notifications rakhein jo global hain
      newSocket.on('project_created', (project) => {
        toast.success(`New project created: ${project.title}`);
      });
      
      // Yahan se task-related toasts hata diye gaye hain
      // newSocket.on('task_created', ...);
      // newSocket.on('task_updated', ...);
      // newSocket.on('task_status_updated', ...);

      return () => {
        newSocket.close();
        newSocket.off('hello'); 
      };
    }
  }, [isAuthenticated]);

  const joinProject = (projectId) => {
    if (socket) {
      socket.emit('join_project', projectId);
    }
  };

  const leaveProject = (projectId) => {
    if (socket) {
      socket.emit('leave_project', projectId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, joinProject, leaveProject }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};