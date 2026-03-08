require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { ensureDatabaseSchema } = require('./database');

const { apiLimiter } = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const executionRoutes = require('./routes/executions');
const obfuscatorRoutes = require('./routes/obfuscator');
const webhookRoutes = require('./routes/webhook');
const adminRoutes = require('./routes/admin');
const loaderRoutes = require('./routes/loader');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Security & parsing middleware
app.set('trust proxy', 1);
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        scriptSrc: ["'self'", 'https://accounts.google.com'],
        frameSrc: ["'self'", 'https://accounts.google.com'],
        connectSrc: ["'self'", 'https://accounts.google.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (no Origin header), like Render health checks.
      if (!origin) {
        return callback(null, true);
      }

      // If no FRONTEND_URL is configured, allow requests (useful for same-origin deploys).
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(Object.assign(new Error('Not allowed by CORS'), { status: 403 }));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

// Serve Next.js static export (built frontend).
// We resolve multiple candidate paths because some platforms run the service
// from different working directories during deploy/runtime.
const frontendBuildCandidates = [
  path.resolve(__dirname, '../frontend/out'),
  path.resolve(process.cwd(), 'frontend/out'),
  path.resolve(process.cwd(), 'out'),
  path.resolve(__dirname, 'out'),
  path.resolve(__dirname, 'public'),
];

const frontendBuildPath = frontendBuildCandidates.find((candidatePath) =>
  fs.existsSync(path.join(candidatePath, 'index.html'))
);

const hasFrontendBuild = Boolean(frontendBuildPath);
const indexHtmlPath = hasFrontendBuild
  ? path.join(frontendBuildPath, 'index.html')
  : null;
if (!hasFrontendBuild) {
  console.warn(
    `[warn] Frontend build not found in any known path: ${frontendBuildCandidates.join(', ')}. ` +
      'Run "npm run build:frontend" from the repo root to generate it.'
  );
} else {
  console.log(`[info] Serving frontend build from ${frontendBuildPath}`);
}
if (hasFrontendBuild) {
  app.use(express.static(frontendBuildPath));
}

app.use(apiLimiter);

// Health check (before auth / rate-limit for monitoring systems)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Root route: serve the web app when available. If the frontend build is
// missing, fail fast with 503 so deployment issues are immediately visible.
app.get('/', (req, res) => {
  if (hasFrontendBuild) {
    return res.sendFile(indexHtmlPath);
  }

  res.status(503).json({
    error: 'Frontend build missing',
    message: 'This deployment is unhealthy: static frontend was not generated.',
  });
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

  // Keep API 404 behavior intact, but fail-fast for web routes.
  if (req.path.startsWith('/api/')) {
    return next();
  }

  return res.status(503).json({
    error: 'Frontend build missing',
    message: 'This deployment is unhealthy: static frontend was not generated.',
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler – must be last
app.use(errorHandler);

const PORT = parseInt(process.env.PORT, 10) || 3001;

async function startServer() {
  try {
    await ensureDatabaseSchema();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Catmio backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database schema:', err.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
