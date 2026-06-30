const rateLimit = require('express-rate-limit');

/**
 * General API limiter
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: {
    error: "Too many requests, try again later."
  }
});

/**
 * Strict limiter for auth routes (important!)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many login attempts. Try again later."
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};
