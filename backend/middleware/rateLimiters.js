const rateLimit = require('express-rate-limit');

const base = { standardHeaders: 'draft-7', legacyHeaders: false };

const apiLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, limit: 300 });

const appointmentLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 8,
  message: { success: false, message: 'Too many requests. Please call the clinic on 9611146955 to book.' },
});

const adminLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, limit: 1500 });

// Failed and successful attempts both count; 10 tries per 15 minutes per IP.
const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: 'Too many login attempts. Please wait 15 minutes and try again.' },
});

module.exports = { apiLimiter, appointmentLimiter, adminLimiter, loginLimiter };
