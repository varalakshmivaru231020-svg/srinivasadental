const { pool } = require('../config/db');

const PUBLIC_COLS = `id, service_name, slug, tagline, description, icon, image, content,
  meta_title, meta_description, show_on_home, sort_order`;

const EDITABLE = ['service_name', 'tagline', 'description', 'icon', 'image', 'content',
  'meta_title', 'meta_description', 'sort_order', 'is_active', 'show_on_home'];

const clean = (v) => (v === '' || v === undefined ? null : v);

async function findActive() {
  const [rows] = await pool.query(`SELECT ${PUBLIC_COLS} FROM services WHERE is_active = 1 ORDER BY sort_order, id`);
  return rows;
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${PUBLIC_COLS}, is_active, updated_at FROM services ORDER BY sort_order, id`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(`SELECT ${PUBLIC_COLS}, is_active, updated_at FROM services WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function findIdBySlug(slug) {
  const [rows] = await pool.execute('SELECT id FROM services WHERE slug = ? AND is_active = 1 LIMIT 1', [slug]);
  return rows[0]?.id || null;
}

async function nextSortOrder() {
  const [rows] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM services');
  return rows[0].n;
}

async function create(data) {
  const values = {
    ...data,
    sort_order: data.sort_order ?? (await nextSortOrder()),
    is_active: data.is_active ?? true,
    show_on_home: data.show_on_home ?? false,
  };
  const cols = ['slug', ...EDITABLE];
  const [result] = await pool.execute(
    `INSERT INTO services (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
    cols.map((c) => (c === 'is_active' || c === 'show_on_home' ? (values[c] ? 1 : 0) : clean(values[c]))),
  );
  return findById(result.insertId);
}

/** Updates only the fields present in `data`. The slug (web address) is fixed after creation. */
async function update(id, data) {
  const cols = EDITABLE.filter((c) => data[c] !== undefined);
  if (cols.length) {
    await pool.execute(
      `UPDATE services SET ${cols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`,
      [...cols.map((c) => (c === 'is_active' || c === 'show_on_home' ? (data[c] ? 1 : 0) : clean(data[c]))), id],
    );
  }
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.execute('DELETE FROM services WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function counts() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total, COALESCE(SUM(is_active), 0) AS active FROM services');
  return { total: Number(rows[0].total), active: Number(rows[0].active) };
}

module.exports = { findActive, findAll, findById, findIdBySlug, create, update, remove, counts };
