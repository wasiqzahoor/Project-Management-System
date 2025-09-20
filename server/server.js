// server/server.js (Final, Corrected and Refactored Code)

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const passport = require('passport');
require('./config/passport-setup');

const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics'); 


// Initialize Express App
const app = express();
const server = createServer(app);

// --- CORS Configuration ---
// Is object ko hum Express aur Socket.IO dono ke liye istemal karenge
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Saare zaroori methods allow karein
  credentials: true
};

// --- Socket.IO Server Setup ---
const io = new Server(server, {
  cors: corsOptions // Yahan a-one CORS configuration istemal karein
});

// --- Database Connection ---
connectDB();

// --- Directory Setup ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ======================= MIDDLEWARES =======================

// 1. Security Middlewares
app.use(helmet());
app.use(cors(corsOptions)); // Express ke liye bhi wahi CORS options
app.use(passport.initialize()); 
// 2. Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Thora barha diya hai, aam tor par 100 theek rehta hai
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 3. Body Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 4. Static Files Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Custom Middleware to attach Socket.IO instance to request object
// Yeh middleware sirf ek baar, server start hotay waqt register hoga.
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ======================= ROUTES =======================

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running smoothly' });
});

// ======================= SOCKET.IO LOGIC =======================

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  const pingInterval = setInterval(() => {
    console.log(`[SERVER PING] Sending 'hello' to socket ${socket.id}`);
    socket.emit('hello', `Server says hello at ${new Date().toLocaleTimeString()}`);
  }, 3000);
  // Event to join a project-specific room
  socket.on('join_project', (projectId) => {
    if (projectId) {
      socket.join(projectId);
      console.log(`User ${socket.id} joined project room: ${projectId}`);
    }
  });

  // Event to leave a project-specific room
  socket.on('leave_project', (projectId) => {
    if (projectId) {
      socket.leave(projectId);
      console.log(`User ${socket.id} left project room: ${projectId}`);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
     clearInterval(pingInterval);
  });
});

// ======================= ERROR HANDLING =======================

// 404 Not Found Handler (agar koi route match na ho)
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handling Middleware (sab se akhir mein)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went terribly wrong on the server!' });
});

// ======================= START SERVER =======================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;