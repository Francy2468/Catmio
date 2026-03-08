require('dotenv').config();

const fs = require('fs');
const path = require('path');
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

// Serve Next.js static export (built frontend).
// Placed before the rate-limiter so that fetching page assets (JS, CSS, images)
// doesn't consume the user's API quota, and before any explicit route handlers
// so the static index.html is returned for the root path without needing a
// dedicated '/' handler.  If the build hasn't run yet (e.g. in a bare dev
// clone) the middleware simply passes through and the API fallback routes take
// over.
const frontendBuildPath = path.join(__dirname, '../frontend/out');
const indexHtmlPath = path.join(frontendBuildPath, 'index.html');
const hasFrontendBuild = fs.existsSync(indexHtmlPath);
if (!hasFrontendBuild) {
  console.warn(
    `[warn] Frontend build not found at ${frontendBuildPath}. ` +
      'Run "npm run build:frontend" from the repo root to generate it.'
  );
}
app.use(express.static(frontendBuildPath));

app.use(apiLimiter);

// Health check (before auth / rate-limit for monitoring systems)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/obfuscator', obfuscatorRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/loader', loaderRoutes);

// SPA fallback – serve the frontend's index.html for any route that isn't
// an API endpoint or a static asset already handled above.  This lets
// Next.js client-side routing work correctly when users navigate directly
// to a URL (e.g. /login, /dashboard) or refresh the page.
app.use('*', (req, res, next) => {
  if (hasFrontendBuild) {
    return res.sendFile(indexHtmlPath);
  }
  next();
});

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
