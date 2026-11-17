const { pool } = require('../config/db');

const PUBLIC_COLS = 'id, image, thumb, alt, caption, category';
const COLS = `${PUBLIC_COLS}, sort_order`;
const EDITABLE = ['image', 'thumb', 'alt', 'caption', 'category', 'sort_order', 'is_active'];

const clean = (c, v) => {
  if (c === 'is_active') return v ? 1 : 0;
  if (c === 'sort_order') return v ?? 0;
  if (c === 'category') return v || 'clinic';
  return v === '' || v === undefined ? null : v;
};

/** Visible gallery photos for the public website. Returns null (not an error) if the table does not exist yet. */
async function findActive() {
  try {
    const [rows] = await pool.query(`SELECT ${PUBLIC_COLS} FROM gallery_photos WHERE is_active = 1 ORDER BY sort_order, id`);
    return rows;
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return null;
    throw err;
  }
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLS}, is_active, updated_at FROM gallery_photos ORDER BY sort_order, id`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(`SELECT ${COLS}, is_active, updated_at FROM gallery_photos WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function nextSortOrder() {
  const [rows] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM gallery_photos');
  return Math.min(Number(rows[0].n), 9999); // stays within the 0–9999 the edit form accepts
}

/** Adds a photo. Without a display order it goes at the end. */
async function create(data) {
  const values = {
    is_active: true,
    ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)),
  };
  if (values.sort_order === null || values.sort_order === undefined) values.sort_order = await nextSortOrder();
  const [r] = await pool.execute(
    `INSERT INTO gallery_photos (${EDITABLE.join(', ')}) VALUES (${EDITABLE.map(() => '?').join(', ')})`,
    EDITABLE.map((c) => clean(c, values[c])),
  );
  return findById(r.insertId);
}

/** Updates only the fields present in `data`. */
async function update(id, data) {
  const cols = EDITABLE.filter((c) => data[c] !== undefined);
  if (cols.length) {
    await pool.execute(
      `UPDATE gallery_photos SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`,
      [...cols.map((c) => clean(c, data[c])), id],
    );
  }
  return findById(id);
}

async function remove(id) {
  const [r] = await pool.execute('DELETE FROM gallery_photos WHERE id = ?', [id]);
  return r.affectedRows > 0;
}

module.exports = { findActive, findAll, findById, create, update, remove };
