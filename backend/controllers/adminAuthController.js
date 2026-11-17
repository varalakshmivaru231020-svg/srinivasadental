const crypto = require('crypto');
const Admin = require('../models/adminModel');
const { hashPassword, verifyPassword, sha256 } = require('../utils/password');
const { cookieOptions, COOKIE_NAME, SESSION_HOURS } = require('../middleware/adminAuth');

// Used when the username does not exist, so a wrong username takes as long as a wrong password.
let dummyHash;
const getDummyHash = async () => {
  dummyHash = dummyHash || (await hashPassword(crypto.randomBytes(16).toString('hex')));
  return dummyHash;
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Admin.findByUsername(username);
    const valid = await verifyPassword(password, user ? user.password_hash : await getDummyHash());
    if (!user || !valid) {
      return res.status(401).json({ success: false, message: 'Incorrect username or password.' });
    }
    await Admin.deleteExpiredSessions();
    const token = crypto.randomBytes(32).toString('hex');
    await Admin.createSession(user.id, sha256(token), SESSION_HOURS);
    await Admin.touchLogin(user.id);
    res.cookie(COOKIE_NAME, token, cookieOptions(req));
    return res.json({ success: true, data: { username: user.username } });
  } catch (err) {
    return next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await Admin.deleteSession(req.sessionHash);
    res.clearCookie(COOKIE_NAME, { path: '/api' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.me = (req, res) => res.json({ success: true, data: { username: req.admin.username } });

exports.changePassword = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.admin.id);
    if (!user || !(await verifyPassword(req.body.current_password, user.password_hash))) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
        errors: [{ path: 'current_password', msg: 'Current password is incorrect.' }],
      });
    }
    await Admin.updatePassword(user.id, await hashPassword(req.body.new_password));
    await Admin.deleteOtherSessions(user.id, req.sessionHash);
    return res.json({ success: true, message: 'Password changed. Other devices have been signed out.' });
  } catch (err) {
    return next(err);
  }
};
