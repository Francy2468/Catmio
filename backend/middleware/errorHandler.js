/**
 * Global error-handling middleware.
 * Must be registered last in the Express middleware chain.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('Unhandled error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  const status = err.status || err.statusCode || 500;
  const message =
    status < 500
      ? err.message
      : process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
