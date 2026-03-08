const axios = require('axios');
const { query } = require('../database');

/**
 * Internal helper – POST payload to a webhook URL with up to 3 retries.
 * Not exported; used by executionController and route handlers.
 * @param {string} url - The webhook destination URL
 * @param {object} payload - JSON body to send
 */
async function sendWebhook(url, payload) {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      return;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        // Exponential back-off: 1 s, 2 s
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw lastError;
}

/**
 * PUT /api/webhook/url
 * Body: { webhook_url }
 * Requires auth middleware.
 */
async function updateWebhookUrl(req, res, next) {
  try {
    const { webhook_url } = req.body;

    if (webhook_url !== undefined && webhook_url !== null && webhook_url !== '') {
      try {
        new URL(webhook_url); // validates URL format
      } catch {
        return res.status(400).json({ error: 'Invalid webhook URL' });
      }
    }

    await query('UPDATE users SET webhook_url = $1 WHERE id = $2', [
      webhook_url || null,
      req.user.id,
    ]);

    return res.json({ message: 'Webhook URL updated successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/webhook/test
 * Sends a test payload to the user's configured webhook URL.
 * Requires auth middleware.
 */
async function testWebhook(req, res, next) {
  try {
    const result = await query('SELECT webhook_url FROM users WHERE id = $1', [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { webhook_url } = result.rows[0];

    if (!webhook_url) {
      return res.status(400).json({ error: 'No webhook URL configured' });
    }

    const testPayload = {
      event: 'test',
      user_id: req.user.id,
      message: 'This is a test webhook from Catmio',
      timestamp: new Date().toISOString(),
    };

    await sendWebhook(webhook_url, testPayload);

    return res.json({ message: 'Test webhook sent successfully' });
  } catch (err) {
    if (err.response || err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      return res.status(502).json({ error: 'Failed to reach webhook URL', details: err.message });
    }
    next(err);
  }
}

module.exports = { sendWebhook, updateWebhookUrl, testWebhook };
