const jwt = require('jsonwebtoken');
const { query } = require('../database');
const { sendWebhook } = require('./webhookController');

/**
 * GET /api/loader/:script_id
 * Query params or headers: hwid (or X-HWID header), user_id (fallback if no JWT)
 */
async function loadScript(req, res, next) {
  try {
    const { script_id } = req.params;
    const hwid =
      req.query.hwid ||
      req.headers['x-hwid'];

    if (!hwid) {
      return res.status(400).json({ error: 'HWID is required' });
    }

    // Resolve user: prefer JWT, fall back to query param user_id
    let userId;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
        userId = decoded.id;
      } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    } else if (req.query.user_id) {
      userId = req.query.user_id;
    } else {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userResult = await query(
      'SELECT id, hwid, is_banned, hwid_banned, webhook_url FROM users WHERE id = $1',
      [userId]
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

    // If the user already has a stored HWID it must match
    if (user.hwid && user.hwid !== hwid) {
      return res.status(403).json({ error: 'HWID_NOT_ALLOWED' });
    }

    // Persist HWID on first use
    if (!user.hwid) {
      await query('UPDATE users SET hwid = $1 WHERE id = $2', [hwid, userId]);
    }

    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'unknown';

    const insertResult = await query(
      `INSERT INTO executions (user_id, hwid, script_name, game_name, ip_address, executed_at)
       VALUES ($1, $2, $3, NULL, $4, NOW())
       RETURNING id`,
      [userId, hwid, script_id, ip]
    );

    const executionId = insertResult.rows[0].id;

    if (user.webhook_url) {
      sendWebhook(user.webhook_url, {
        event: 'loader_execution',
        execution_id: executionId,
        user_id: userId,
        script_id,
        hwid,
        ip,
        timestamp: new Date().toISOString(),
      }).catch((err) => console.error('Loader webhook delivery failed:', err.message));
    }

    return res.json({
      script_id,
      status: 'ok',
      execution_id: executionId,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { loadScript };
