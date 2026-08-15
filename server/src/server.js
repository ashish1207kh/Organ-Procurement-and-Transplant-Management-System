const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initDb, getDbMode } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    system: 'Organ Procurement and Transplant Management System (OPTM) API',
    dbMode: getDbMode(),
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/recipients', require('./routes/recipientRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/help', require('./routes/helpRoutes'));

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 OPTM Web Backend Server running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🗄️ Database Mode: ${getDbMode()}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
