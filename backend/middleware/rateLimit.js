const rateLimit = require('express-rate-limit');

/** Strict limiter for auth endpoints – 10 requests per 15 minutes. */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
});

/** General API limiter – 100 requests per 15 minutes. */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
});

module.exports = { authLimiter, apiLimiter };
