# Dynamic Project Management Dashboard

A modern, full-stack project management application built with React, Node.js, Express, and MongoDB. Features real-time updates, drag-and-drop functionality, user authentication, and an admin dashboard.

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI/UX**: Built with Tailwind CSS and Framer Motion animations
- **User Authentication**: JWT-based login and registration
- **Real-time Updates**: Socket.io integration for live updates
- **Drag & Drop**: Task management with React DnD
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on all device sizes
- **File Upload**: Attach files to tasks
- **Search & Filter**: Advanced filtering and search capabilities

### Backend (Express.js + MongoDB)
- **RESTful APIs**: Well-structured API endpoints
- **Real-time Communication**: Socket.io for live updates
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Multer integration for file handling
- **Security**: Helmet, CORS, and rate limiting
- **Database**: MongoDB with Mongoose ODM
- **Admin Panel**: Administrative controls and analytics

### Project Structure
```
dashboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── ...
│   └── package.json
├── server/                 # Express backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── uploads/          # File storage
│   └── server.js         # Main server file
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- pnpm (recommended) or npm

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the `.env` file with your MongoDB credentials:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://tasirzahoor9_db_user:YOUR_PASSWORD@cluster0.ptzofsp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🔧 Technologies Used

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- React DnD
- Socket.io Client
- Axios
- React Hot Toast
- Lucide React Icons
- Date-fns

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT (JSON Web Tokens)
- Bcrypt.js
- Multer
- Helmet
- CORS
- Express Rate Limit

## 📱 Key Features

### User Management
- User registration and login
- JWT-based authentication
- Role-based access control (User/Admin)
- Profile management

### Project Management
- Create, read, update, delete projects
- Project status tracking (Active, Completed, On-hold)
- Priority levels (High, Medium, Low)
- Progress tracking with visual indicators
- Deadline management

### Task Management
- Create tasks within projects
- Drag-and-drop task status updates
- Task priorities and deadlines
- File attachments
- Comments system
- Real-time task updates

### Admin Dashboard
- User management
- Project overview
- System analytics
- Activity monitoring

### Real-time Features
- Live task updates
- Real-time notifications
- Socket.io integration
- Multi-user collaboration

## 🔐 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## 🎨 UI/UX Features
- Modern, clean design
- Dark/Light mode toggle
- Smooth animations with Framer Motion
- Responsive design for all devices
- Interactive components
- Loading states and error handling

## 📊 Admin Features
- Dashboard with analytics
- User management (activate/deactivate users)
- Project oversight
- System statistics
- Activity logs

## 🚀 Deployment

### Frontend (Vercel)
1. Build the project: `pnpm run build`
2. Deploy to Vercel or your preferred hosting platform

### Backend (Render/Heroku)
1. Set environment variables
2. Deploy to Render, Heroku, or your preferred platform
3. Update CORS settings for production

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License.

## 🙋‍♂️ Support
For support, email your-email@example.com or create an issue in the repository.

---

Built with ❤️ using modern web technologies