const axios = require('axios');

/**
 * POST /api/obfuscator
 * Body: { code, preset }
 * Requires auth middleware.
 * Forwards the request to the external Galactic obfuscator service.
 */
async function obfuscate(req, res, next) {
  try {
    const { code, preset } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'code is required and must be a string' });
    }

    const response = await axios.post(
      'https://galactic-obfuscator.up.railway.app/api/obfuscate',
      { code, preset },
      {
        headers: {
          'API-KEY': process.env.OBFUSCATOR_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
}

module.exports = { obfuscate };
