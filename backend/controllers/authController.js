const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../database');
const { sendVerificationEmail, sendWelcomeEmail } = require('../services/emailService');

/**
 * POST /api/auth/register
 * Body: { email, password }
 */
async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = uuidv4();

    await query(
      `INSERT INTO users (email, password_hash, verification_token, role, is_banned, verified, created_at)
       VALUES ($1, $2, $3, 'user', false, false, NOW())`,
      [email.toLowerCase(), passwordHash, verificationToken]
    );

    try {
      await sendVerificationEmail(email.toLowerCase(), verificationToken);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr.message);
    }

    return res.status(201).json({ message: 'Registration successful. Please verify your email.' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await query(
      'SELECT id, email, password_hash, role, verified, is_banned FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (!user.verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }
    if (user.is_banned) {
      return res.status(403).json({ error: 'Your account has been banned' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/verify-email?token=<uuid>
 */
async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const result = await query(
      'SELECT id, email, verified FROM users WHERE verification_token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    const user = result.rows[0];

    if (user.verified) {
      return res.json({ message: 'Email already verified' });
    }

    await query(
      'UPDATE users SET verified = true, verification_token = NULL WHERE id = $1',
      [user.id]
    );

    try {
      await sendWelcomeEmail(user.email);
    } catch (emailErr) {
      console.error('Failed to send welcome email:', emailErr.message);
    }

    return res.json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/profile
 * Requires auth middleware.
 */
async function getProfile(req, res, next) {
  try {
    const result = await query(
      'SELECT id, email, role, verified, is_banned, hwid, webhook_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/auth/profile
 * Body: { email?, password?, webhook_url? }
 * Requires auth middleware.
 */
async function updateProfile(req, res, next) {
  try {
    const { email, password, webhook_url } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;

    if (email !== undefined) {
      if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }
      const conflict = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email.toLowerCase(), req.user.id]
      );
      if (conflict.rows.length > 0) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      updates.push(`email = $${idx++}`);
      values.push(email.toLowerCase());
    }

    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      const passwordHash = await bcrypt.hash(password, 12);
      updates.push(`password_hash = $${idx++}`);
      values.push(passwordHash);
    }

    if (webhook_url !== undefined) {
      updates.push(`webhook_url = $${idx++}`);
      values.push(webhook_url || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.user.id);
    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx}`,
      values
    );

    return res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, verifyEmail, getProfile, updateProfile };
