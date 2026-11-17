const { pool } = require('../config/db');

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

async function create({ full_name, phone, email, service_id, preferred_date, preferred_time, message }) {
  const [result] = await pool.execute(
    `INSERT INTO appointments
      (full_name, phone, email, service_id, preferred_date, preferred_time, message, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [full_name, phone, email || null, service_id || null, preferred_date, preferred_time, message || null],
  );
  return result.insertId;
}

/** Finds an identical pending request made in the last few minutes (double-clicks, re-submits). */
async function findRecentDuplicate({ phone, preferred_date, service_id, minutes = 30 }) {
  const [rows] = await pool.execute(
    `SELECT id FROM appointments
      WHERE phone = ? AND preferred_date = ? AND service_id <=> ? AND status = 'pending'
        AND created_at >= NOW() - INTERVAL ? MINUTE
      ORDER BY id DESC LIMIT 1`,
    [phone, preferred_date, service_id, minutes],
  );
  return rows[0]?.id || null;
}

/** Paginated list for the admin panel, newest first. */
async function list({ status, q, page = 1, limit = 20 }) {
  const where = [];
  const params = [];
  if (status && STATUSES.includes(status)) {
    where.push('a.status = ?');
    params.push(status);
  }
  if (q) {
    where.push('(a.full_name LIKE ? OR a.phone LIKE ? OR a.email LIKE ?)');
    const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    params.push(like, like, like);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT a.id, a.full_name, a.phone, a.email, a.preferred_date, a.preferred_time, a.message, a.status,
            a.created_at, s.service_name
       FROM appointments a LEFT JOIN services s ON s.id = a.service_id
       ${whereSql}
       ORDER BY a.created_at DESC, a.id DESC
       LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM appointments a ${whereSql}`, params);
  return { rows, total: Number(total), page, limit };
}

async function updateStatus(id, status) {
  const [result] = await pool.execute('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM appointments WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function stats() {
  const [byStatus] = await pool.query('SELECT status, COUNT(*) AS c FROM appointments GROUP BY status');
  const [[today]] = await pool.query('SELECT COUNT(*) AS c FROM appointments WHERE DATE(created_at) = CURDATE()');
  const [[upcoming]] = await pool.query(
    "SELECT COUNT(*) AS c FROM appointments WHERE preferred_date >= CURDATE() AND status IN ('pending','confirmed')",
  );
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  byStatus.forEach((r) => { counts[r.status] = Number(r.c); });
  return {
    ...counts,
    total: Object.values(counts).reduce((a, b) => a + b, 0),
    today: Number(today.c),
    upcoming: Number(upcoming.c),
  };
}

module.exports = { create, findRecentDuplicate, list, updateStatus, remove, stats, STATUSES };
