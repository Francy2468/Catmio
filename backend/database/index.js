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

module.exports = { query, pool };
