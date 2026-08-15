const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initDb, getDbMode } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow all origins in production or client URL
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome & API status endpoint
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>OPTM API Backend</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 480px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
          .badge { background: #0284c7; color: #fff; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; }
          h1 { margin-top: 16px; font-size: 24px; color: #fff; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.5; }
          .status { background: #064e3b; color: #34d399; border: 1px solid #059669; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; margin-top: 20px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">OPTM Healthcare</span>
          <h1>API Backend Server is Live</h1>
          <p>This is the Express REST API backend for the Organ Procurement and Transplant Management System.</p>
          <div class="status">✓ Service Status: Healthy (${getDbMode()} Database Mode)</div>
        </div>
      </body>
    </html>
  `);
});

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
