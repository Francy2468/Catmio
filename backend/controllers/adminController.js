const { query } = require('../database');

/**
 * GET /api/admin/users
 * Returns paginated list of all users. Admin only.
 */
async function getUsers(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const [dataResult, countResult] = await Promise.all([
      query(
        `SELECT id, email, role, verified, is_banned, hwid, hwid_banned, webhook_url, created_at
         FROM users
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query('SELECT COUNT(*) FROM users'),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return res.json({
      users: dataResult.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/users/:id/ban
 */
async function banUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      'UPDATE users SET is_banned = true WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'User banned successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/users/:id/unban
 */
async function unbanUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      'UPDATE users SET is_banned = false WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'User unbanned successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/users/:id/ban-hwid
 * Sets the user's hwid_banned flag to true.
 */
async function banHwid(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      'UPDATE users SET hwid_banned = true WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'HWID banned successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/users/:id/unban-hwid
 */
async function unbanHwid(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      'UPDATE users SET hwid_banned = false WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'HWID unbanned successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/users/:id/reset-hwid
 * Clears the stored HWID for the user.
 */
async function resetHwid(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      'UPDATE users SET hwid = NULL, hwid_banned = false WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'HWID reset successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/analytics
 * Returns execution stats across all users.
 */
async function getAnalytics(req, res, next) {
  try {
    const [dailyResult, totalResult, topScriptsResult, topUsersResult] = await Promise.all([
      query(
        `SELECT DATE(executed_at) AS date, COUNT(*) AS count
         FROM executions
         WHERE executed_at >= NOW() - INTERVAL '30 days'
         GROUP BY DATE(executed_at)
         ORDER BY date ASC`
      ),
      query('SELECT COUNT(*) FROM executions'),
      query(
        `SELECT script_name, COUNT(*) AS count
         FROM executions
         GROUP BY script_name
         ORDER BY count DESC
         LIMIT 10`
      ),
      query(
        `SELECT u.id, u.email, COUNT(e.id) AS execution_count
         FROM users u
         LEFT JOIN executions e ON e.user_id = u.id
         GROUP BY u.id, u.email
         ORDER BY execution_count DESC
         LIMIT 10`
      ),
    ]);

    return res.json({
      daily: dailyResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
      top_scripts: topScriptsResult.rows,
      top_users: topUsersResult.rows,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/executions
 * Returns paginated list of all executions.
 */
async function getAllExecutions(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const [dataResult, countResult] = await Promise.all([
      query(
        `SELECT e.id, e.user_id, u.email, e.hwid, e.script_name, e.game_name, e.ip_address, e.executed_at
         FROM executions e
         JOIN users u ON u.id = e.user_id
         ORDER BY e.executed_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query('SELECT COUNT(*) FROM executions'),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    return res.json({
      executions: dataResult.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  banUser,
  unbanUser,
  banHwid,
  unbanHwid,
  resetHwid,
  getAnalytics,
  getAllExecutions,
};
