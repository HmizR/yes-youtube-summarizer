const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB, sequelize } = require('./config/database');
const { apiLimiter } = require('./middleware/rateLimiter');
const env = require('./config/env');

// Import models
const db = require('./models');

// Import routes
const summaryRoutes = require('./routes/summaryRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const discussionRoutes = require('./routes/discussionRoutes');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true
  }
});

// Connect to database
connectDB().then(() => {
  console.log('Database connection established');
});

// Socket.IO middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  } else {
    next(new Error('Authentication required'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);
  
  // Join user's personal room
  socket.join(socket.userId);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  req.db = db;
  next();
});

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: env.CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message
    });
  }
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/summaries', summaryRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/', discussionRoutes);

// API documentation
app.get('/api/v1/docs', (req, res) => {
  res.json({
    message: 'YouTube Summarizer API',
    version: '1.0.0',
    database: 'MySQL',
    orm: 'Sequelize',
    endpoints: {
      auth: {
        register: 'POST /api/v1/auth/register',
        login: 'POST /api/v1/auth/login',
        logout: 'GET /api/v1/auth/logout',
        profile: 'GET /api/v1/auth/me'
      },
      summaries: {
        create: 'POST /api/v1/summaries',
        list: 'GET /api/v1/summaries',
        get: 'GET /api/v1/summaries/:id',
        update: 'PUT /api/v1/summaries/:id',
        delete: 'DELETE /api/v1/summaries/:id',
        export: 'GET /api/v1/summaries/:id/export/:format'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await sequelize.close();
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;