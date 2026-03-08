require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { apiLimiter } = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const executionRoutes = require('./routes/executions');
const obfuscatorRoutes = require('./routes/obfuscator');
const webhookRoutes = require('./routes/webhook');
const adminRoutes = require('./routes/admin');
const loaderRoutes = require('./routes/loader');

const app = express();

// Security & parsing middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(apiLimiter);

// Health check (before auth / rate-limit for monitoring systems)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Root route – redirect to the frontend or return API info
app.get('/', (req, res) => {
  if (process.env.FRONTEND_URL) {
    return res.redirect(302, process.env.FRONTEND_URL);
  }
  const { version } = require('./package.json');
  res.json({ name: 'Catmio API', status: 'running', version });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/obfuscator', obfuscatorRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/loader', loaderRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler – must be last
app.use(errorHandler);

const PORT = parseInt(process.env.PORT, 10) || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Catmio backend listening on port ${PORT}`);
});

module.exports = app;
