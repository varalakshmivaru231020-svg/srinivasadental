const { pool } = require('../config/db');

// The pages whose banner the clinic can change (admin panel → Banners). Keep in step with frontend/src/data/banners.js.
const KEYS = ['home', 'about', 'services', 'service-detail', 'doctor-detail', 'contact', 'gallery', 'best-dentist'];
// Only these banners show a title the clinic may change; the others keep their built-in heading.
const TITLE_KEYS = ['contact', 'gallery'];

const clean = (v) => (v === '' || v === undefined ? null : v);

/**
 * Every banner the clinic has changed, as rows { page_key, image, title, updated_at }.
 * Returns null (not an error) if the table does not exist yet.
 */
async function findAll() {
  try {
    const [rows] = await pool.query('SELECT page_key, image, title, updated_at FROM page_banners ORDER BY page_key');
    return rows;
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return null;
    throw err;
  }
}

async function find(key) {
  const [rows] = await pool.execute('SELECT page_key, image, title, updated_at FROM page_banners WHERE page_key = ? LIMIT 1', [key]);
  return rows[0] || null;
}

/** Saves the banner for one page (adds the row the first time). Empty values are stored as NULL. */
async function upsert(key, { image, title }) {
  const values = [clean(image), clean(title)];
  // The values are repeated instead of using VALUES(), which MySQL 8 has deprecated; this form works on MariaDB too.
  await pool.execute(
    `INSERT INTO page_banners (page_key, image, title) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE image = ?, title = ?, updated_at = CURRENT_TIMESTAMP`,
    [key, ...values, ...values],
  );
  return find(key);
}

/** Goes back to the built-in banner for one page. */
async function reset(key) {
  const [r] = await pool.execute('DELETE FROM page_banners WHERE page_key = ?', [key]);
  return r.affectedRows > 0;
}

module.exports = { KEYS, TITLE_KEYS, findAll, find, upsert, reset };
