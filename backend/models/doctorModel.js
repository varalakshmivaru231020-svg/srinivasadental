const { pool } = require('../config/db');

const COLS = 'id, slug, name, title, qualification, experience, headline, photo, bio, profile, sort_order';
const EDITABLE = ['name', 'title', 'qualification', 'experience', 'headline', 'photo', 'bio', 'profile', 'sort_order', 'is_active'];

const clean = (c, v) => {
  if (c === 'is_active') return v ? 1 : 0;
  if (c === 'sort_order') return v ?? 0;
  return v === '' || v === undefined ? null : v;
};

/** Active doctors for the public website. Returns null (not an error) if the table does not exist yet. */
async function findActive() {
  try {
    const [rows] = await pool.query(`SELECT ${COLS} FROM doctors WHERE is_active = 1 ORDER BY sort_order, id`);
    return rows;
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return null;
    throw err;
  }
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${COLS}, is_active, updated_at FROM doctors ORDER BY sort_order, id`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(`SELECT ${COLS}, is_active, updated_at FROM doctors WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function nextSortOrder() {
  const [rows] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM doctors');
  return rows[0].n;
}

async function create(data) {
  const values = {
    is_active: true,
    ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)),
  };
  if (values.sort_order === null || values.sort_order === undefined) values.sort_order = await nextSortOrder();
  const cols = ['slug', ...EDITABLE];
  const [r] = await pool.execute(
    `INSERT INTO doctors (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
    cols.map((c) => (c === 'slug' ? values.slug : clean(c, values[c]))),
  );
  return findById(r.insertId);
}

/** Updates only the fields present in `data`. The web address (slug) is fixed after creation. */
async function update(id, data) {
  const cols = EDITABLE.filter((c) => data[c] !== undefined);
  if (cols.length) {
    await pool.execute(
      `UPDATE doctors SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`,
      [...cols.map((c) => clean(c, data[c])), id],
    );
  }
  return findById(id);
}

async function remove(id) {
  const [r] = await pool.execute('DELETE FROM doctors WHERE id = ?', [id]);
  return r.affectedRows > 0;
}

module.exports = { findActive, findAll, findById, create, update, remove };
