const { query } = require('../database');
const { sendWebhook } = require('./webhookController');

/**
 * POST /api/executions
 * Body: { hwid, script_name, game_name }
 * Requires auth middleware.
 */
async function logExecution(req, res, next) {
  try {
    const { hwid, script_name, game_name } = req.body;

    if (!hwid || !script_name) {
      return res.status(400).json({ error: 'hwid and script_name are required' });
    }

    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'unknown';

    // Fetch user to check ban/HWID status
    const userResult = await query(
      'SELECT id, hwid, is_banned, hwid_banned, webhook_url FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    if (user.is_banned) {
      return res.status(403).json({ error: 'HWID_NOT_ALLOWED' });
    }

    if (user.hwid_banned) {
      return res.status(403).json({ error: 'HWID_NOT_ALLOWED' });
    }

    // If user has a stored HWID, it must match
    if (user.hwid && user.hwid !== hwid) {
      return res.status(403).json({ error: 'HWID_NOT_ALLOWED' });
    }

    const insertResult = await query(
      `INSERT INTO executions (user_id, hwid, script_name, game_name, ip_address, executed_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id`,
      [req.user.id, hwid, script_name, game_name || null, ip]
    );

    const executionId = insertResult.rows[0].id;

    // Fire webhook asynchronously – do not block the response
    if (user.webhook_url) {
      sendWebhook(user.webhook_url, {
        event: 'execution',
        execution_id: executionId,
        user_id: req.user.id,
        hwid,
        script_name,
        game_name: game_name || null,
        ip,
        timestamp: new Date().toISOString(),
      }).catch((err) => console.error('Webhook delivery failed:', err.message));
    }

    return res.status(201).json({ message: 'Execution logged', execution_id: executionId });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/executions
 * Query params: page, limit, script_name, game_name
 * Requires auth middleware.
 */
async function getExecutions(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const conditions = ['user_id = $1'];
    const values = [req.user.id];
    let idx = 2;

    if (req.query.script_name) {
      conditions.push(`script_name ILIKE $${idx++}`);
      values.push(`%${req.query.script_name}%`);
    }
    if (req.query.game_name) {
      conditions.push(`game_name ILIKE $${idx++}`);
      values.push(`%${req.query.game_name}%`);
    }

    const where = conditions.join(' AND ');

    const [dataResult, countResult] = await Promise.all([
      query(
        `SELECT id, hwid, script_name, game_name, ip_address, executed_at
         FROM executions
         WHERE ${where}
         ORDER BY executed_at DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...values, limit, offset]
      ),
      query(`SELECT COUNT(*) FROM executions WHERE ${where}`, values),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return res.json({
      executions: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/executions/stats
 * Returns executions per day for the last 30 days and total count.
 * Requires auth middleware.
 */
async function getExecutionStats(req, res, next) {
  try {
    const [dailyResult, totalResult] = await Promise.all([
      query(
        `SELECT DATE(executed_at) AS date, COUNT(*) AS count
         FROM executions
         WHERE user_id = $1
           AND executed_at >= NOW() - INTERVAL '30 days'
         GROUP BY DATE(executed_at)
         ORDER BY date ASC`,
        [req.user.id]
      ),
      query('SELECT COUNT(*) FROM executions WHERE user_id = $1', [req.user.id]),
    ]);

    return res.json({
      daily: dailyResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { logExecution, getExecutions, getExecutionStats };
