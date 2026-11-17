const { pool } = require('../config/db');

const FIELDS = [
  'clinic_name', 'tagline', 'address_line1', 'address_line2', 'city', 'pincode',
  'phone_primary', 'phone_secondary', 'landline', 'email', 'whatsapp_number',
  'google_maps_url', 'google_maps_embed_url', 'facebook_url', 'instagram_url', 'google_reviews_url',
  'logo_url', 'logo_banner_url',
];

function parseHours(raw) {
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((h) => h && h.days && h.time) : [];
  } catch {
    return [];
  }
}

async function get() {
  const [rows] = await pool.query(
    `SELECT id, ${FIELDS.join(', ')}, address, opening_hours, updated_at FROM clinic_settings ORDER BY id LIMIT 1`,
  );
  const row = rows[0];
  if (!row) return null;
  return { ...row, opening_hours: parseHours(row.opening_hours) };
}

async function update(data) {
  const current = await get();
  const values = FIELDS.map((f) => {
    const v = data[f];
    return v === '' || v === undefined || v === null ? null : String(v).trim();
  });
  const pick = (f) => values[FIELDS.indexOf(f)];
  const cityLine = [pick('city'), pick('pincode')].filter(Boolean).join(' – ');
  const address = [pick('address_line1'), pick('address_line2'), cityLine].filter(Boolean).join(', ');
  const hours = JSON.stringify((data.opening_hours || []).map((h) => ({ days: h.days.trim(), time: h.time.trim() })));

  const sql = `${FIELDS.map((f) => `${f} = ?`).join(', ')}, address = ?, opening_hours = ?`;
  if (current) {
    await pool.execute(`UPDATE clinic_settings SET ${sql} WHERE id = ?`, [...values, address, hours, current.id]);
  } else {
    await pool.execute(`INSERT INTO clinic_settings SET ${sql}`, [...values, address, hours]);
  }
  return get();
}

module.exports = { get, update, FIELDS };
