const { pool } = require('../config/db');

async function findByUsername(username) {
  const [rows] = await pool.execute('SELECT id, username, password_hash FROM admin_users WHERE username = ? LIMIT 1', [username]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT id, username, password_hash FROM admin_users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function upsert(username, passwordHash) {
  await pool.execute(
    `INSERT INTO admin_users (username, password_hash) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [username, passwordHash],
  );
  return findByUsername(username);
}

async function updatePassword(id, passwordHash) {
  await pool.execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function touchLogin(id) {
  await pool.execute('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?', [id]);
}

async function createSession(adminId, tokenHash, hours) {
  await pool.execute(
    'INSERT INTO admin_sessions (admin_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? HOUR))',
    [adminId, tokenHash, hours],
  );
}

async function findSession(tokenHash) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.username FROM admin_sessions s
       JOIN admin_users u ON u.id = s.admin_id
     WHERE s.token_hash = ? AND s.expires_at > NOW() LIMIT 1`,
    [tokenHash],
  );
  return rows[0] || null;
}

async function deleteSession(tokenHash) {
  await pool.execute('DELETE FROM admin_sessions WHERE token_hash = ?', [tokenHash]);
}

/** Signs the admin out everywhere except (optionally) the current session. */
async function deleteOtherSessions(adminId, keepHash = '') {
  await pool.execute('DELETE FROM admin_sessions WHERE admin_id = ? AND token_hash <> ?', [adminId, keepHash]);
}

async function deleteExpiredSessions() {
  await pool.query('DELETE FROM admin_sessions WHERE expires_at <= NOW()');
}

module.exports = {
  findByUsername, findById, upsert, updatePassword, touchLogin,
  createSession, findSession, deleteSession, deleteOtherSessions, deleteExpiredSessions,
};
