/**
 * Simple SQL migration runner.
 *
 *   npm run migrate          → create the database if needed and apply pending migrations
 *   npm run migrate:status   → list applied / pending migrations
 *
 * Migrations live in ../database/migrations as NNN_description.sql and run in filename order.
 * Applied migrations are recorded in the `migrations` table, so each runs only once.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const fs = require('fs');
const mysql = require('mysql2/promise');

const DIR = path.join(__dirname, '..', '..', 'database', 'migrations');
const DB = process.env.DB_NAME || 'srinivasdental';
const statusOnly = process.argv.includes('--status');

if (!/^[A-Za-z0-9_]+$/.test(DB)) {
  console.error(`Invalid DB_NAME "${DB}" — use letters, numbers and underscores only.`);
  process.exit(1);
}

(async () => {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
    });

    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.query(`USE \`${DB}\``);
    await conn.query(`CREATE TABLE IF NOT EXISTS migrations (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(190) NOT NULL UNIQUE,
      run_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`);

    const [rows] = await conn.query('SELECT name, run_at FROM migrations ORDER BY id');
    const applied = new Map(rows.map((r) => [r.name, r.run_at]));
    const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort();

    if (statusOnly) {
      console.log(`Database: ${DB}\n`);
      files.forEach((f) => console.log(`${applied.has(f) ? '  [applied]' : '  [pending]'}  ${f}`));
      return;
    }

    const pending = files.filter((f) => !applied.has(f));
    if (!pending.length) {
      console.log(`Database "${DB}" is up to date — nothing to migrate.`);
      return;
    }

    console.log(`Migrating database "${DB}"…`);
    for (const file of pending) {
      const sql = fs.readFileSync(path.join(DIR, file), 'utf8');
      process.stdout.write(`  → ${file} … `);
      await conn.query(sql);
      await conn.execute('INSERT INTO migrations (name) VALUES (?)', [file]);
      console.log('done');
    }
    console.log(`\n${pending.length} migration(s) applied.`);
  } catch (err) {
    console.error(`\nMigration failed: ${err.code || ''} ${err.message}`);
    if (err.code === 'ECONNREFUSED') console.error('Is MySQL running? Start it from the XAMPP Control Panel.');
    process.exitCode = 1;
  } finally {
    if (conn) await conn.end();
  }
})();
