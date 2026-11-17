const { pool } = require('../config/db');

const COLS = 'id, patient_name, review_text, rating, treatment, source, sort_order';
const EDITABLE = ['patient_name', 'review_text', 'rating', 'treatment', 'source', 'is_active', 'sort_order'];
const clean = (c, v) => {
  if (c === 'is_active') return v ? 1 : 0;
  return v === '' || v === undefined ? null : v;
};

async function findActive() {
  const [rows] = await pool.query(`SELECT ${COLS} FROM testimonials WHERE is_active = 1 ORDER BY sort_order, id DESC`);
  return rows;
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLS}, is_active, updated_at FROM testimonials ORDER BY sort_order, id DESC`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(`SELECT ${COLS}, is_active FROM testimonials WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const given = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && v !== null));
  const values = { is_active: true, sort_order: 0, ...given };
  const [r] = await pool.execute(
    `INSERT INTO testimonials (${EDITABLE.join(', ')}) VALUES (${EDITABLE.map(() => '?').join(', ')})`,
    EDITABLE.map((c) => clean(c, values[c])),
  );
  return findById(r.insertId);
}

async function update(id, data) {
  const cols = EDITABLE.filter((c) => data[c] !== undefined);
  if (cols.length) {
    await pool.execute(
      `UPDATE testimonials SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`,
      [...cols.map((c) => (c === 'sort_order' ? data[c] ?? 0 : clean(c, data[c]))), id],
    );
  }
  return findById(id);
}

async function remove(id) {
  const [r] = await pool.execute('DELETE FROM testimonials WHERE id = ?', [id]);
  return r.affectedRows > 0;
}

async function countActive() {
  const [[row]] = await pool.query('SELECT COUNT(*) AS c FROM testimonials WHERE is_active = 1');
  return Number(row.c);
}

module.exports = { findActive, findAll, findById, create, update, remove, countActive };
