const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/init');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, timezone = 'UTC' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, timezone) 
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, timezone, created_at`,
      [name, email, passwordHash, timezone]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // Send welcome email
    resend.emails.send({ from: 'Calendex AI <noreply@kaltum.com>', to: email, subject: 'Welcome to Calendex AI!', html: `<div style='font-family:sans-serif;max-width:560px;margin:40px auto;'><div style='background:#8b0000;padding:32px;border-radius:12px 12px 0 0;text-align:center;'><h1 style='color:white;margin:0;font-size:1.5rem;'>Welcome to Calendex AI</h1></div><div style='background:#fff;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e0d8cc;'><p style='color:#3d2010;font-size:1rem;'>Hi <strong>\</strong>, your account is ready!</p><p style='color:#8a7060;margin:16px 0;'>Start scheduling smarter — create your first booking link and share it with anyone.</p><a href='https://www.calendexai.com/dashboard' style='display:inline-block;background:#8b0000;color:white;padding:12px 28px;border-radius:100px;text-decoration:none;font-weight:600;margin:16px 0;'>Go to Dashboard</a><p style='color:#b8a090;font-size:0.8rem;margin-top:24px;'>© 2026 Kaltum LLC · All rights reserved</p></div></div>` }).catch(e => console.error('Welcome email error:', e));
    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, avatar_url, timezone, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;

