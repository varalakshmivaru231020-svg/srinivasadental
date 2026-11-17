/**
 * Creates an admin user, or resets the password of an existing one.
 *
 *   npm run admin:set -- <username> <password>
 *
 * Resetting a password also signs that admin out of every device.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { pool } = require('../config/db');
const Admin = require('../models/adminModel');
const { hashPassword } = require('../utils/password');

(async () => {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error('Usage: npm run admin:set -- <username> <password>');
    process.exitCode = 1;
    return;
  }
  if (!/^[A-Za-z0-9._-]{3,60}$/.test(username)) {
    console.error('Username must be 3–60 characters: letters, numbers, dot, dash or underscore.');
    process.exitCode = 1;
    return;
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exitCode = 1;
    return;
  }
  try {
    const user = await Admin.upsert(username, await hashPassword(password));
    await Admin.deleteOtherSessions(user.id);
    console.log(`Admin "${username}" is ready. Log in at /admin`);
  } catch (err) {
    console.error(`Failed: ${err.code || ''} ${err.message}`);
    if (err.code === 'ER_NO_SUCH_TABLE') console.error('Run "npm run migrate" first.');
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
