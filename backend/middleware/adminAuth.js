const Admin = require('../models/adminModel');
const { parseCookies } = require('../utils/cookies');
const { sha256 } = require('../utils/password');

const COOKIE_NAME = 'sdc_admin';
const SESSION_HOURS = 12;
const CSRF_HEADER = 'SDC-Admin';

function cookieOptions(req) {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: req.secure,
    path: '/api',
    maxAge: SESSION_HOURS * 3600 * 1000,
  };
}

/** Requires a valid admin session cookie. Sets req.admin and req.sessionHash. */
async function requireAdmin(req, res, next) {
  try {
    const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
    if (!token || !/^[a-f0-9]{64}$/.test(token)) {
      return res.status(401).json({ success: false, message: 'Please log in to continue.' });
    }
    const hash = sha256(token);
    const admin = await Admin.findSession(hash);
    if (!admin) {
      res.clearCookie(COOKIE_NAME, { path: '/api' });
      return res.status(401).json({ success: false, message: 'Your session has expired. Please log in again.' });
    }
    req.admin = admin;
    req.sessionHash = hash;
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Defence-in-depth against cross-site requests: state-changing admin calls must carry a custom header,
 * which browsers will not send cross-origin without a CORS pre-flight (on top of the SameSite=Strict cookie).
 */
function requireAdminHeader(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('X-Requested-With') !== CSRF_HEADER) {
    return res.status(403).json({ success: false, message: 'Request blocked.' });
  }
  return next();
}

module.exports = { requireAdmin, requireAdminHeader, cookieOptions, COOKIE_NAME, SESSION_HOURS };
