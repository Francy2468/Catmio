const { Pool } = require('pg');

const sslConfig =
  process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase.co')
      ? { rejectUnauthorized: false }
      : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig || undefined,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

/**
 * Execute a parameterized query against the pool.
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 */
async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.debug('Executed query', { text, duration, rows: res.rowCount });
  }
  return res;
}

async function ensureDatabaseSchema() {
  // Core users table used by auth and dashboard features.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      verified BOOLEAN DEFAULT FALSE,
      verification_token TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      hwid TEXT,
      is_banned BOOLEAN DEFAULT FALSE,
      hwid_banned BOOLEAN DEFAULT FALSE,
      role TEXT DEFAULT 'user',
      webhook_url TEXT
    )
  `);

  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS hwid TEXT`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS hwid_banned BOOLEAN DEFAULT FALSE`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS webhook_url TEXT`);

  // Executions table used by logging and analytics.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS executions (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      ip_address TEXT,
      hwid TEXT,
      script_name TEXT,
      game_name TEXT,
      executed_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

module.exports = { query, pool, ensureDatabaseSchema };
