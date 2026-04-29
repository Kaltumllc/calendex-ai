const express = require('express');
const { pool } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');
const { getAuthUrl, getTokensFromCode, createCalendarEvent, getBusySlots } = require('../services/google-calendar');

const router = express.Router();

// Add google_tokens column to users table
async function ensureGoogleTokensColumn() {
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_tokens JSONB`);
  } catch (e) { /* already exists */ }
}
ensureGoogleTokensColumn();

// GET /api/google/auth — start OAuth flow
router.get('/auth', authMiddleware, (req, res) => {
  const url = getAuthUrl();
  // Store user ID in state for callback
  const stateUrl = url + `&state=${req.user.id}`;
  res.json({ url: stateUrl });
});

// GET /api/google/callback — OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code, state: userId } = req.query;
    if (!code || !userId) return res.status(400).send('Missing code or state');

    const tokens = await getTokensFromCode(code);

    // Save tokens to user
    await pool.query(
      'UPDATE users SET google_tokens = $1 WHERE id = $2',
      [JSON.stringify(tokens), userId]
    );

    // Redirect back to dashboard with success
    res.redirect(`${process.env.CORS_ORIGIN}/dashboard?google=connected`);
  } catch (err) {
    console.error('Google callback error:', err);
    res.redirect(`${process.env.CORS_ORIGIN}/dashboard?google=error`);
  }
});

// GET /api/google/status — check if connected
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT google_tokens FROM users WHERE id = $1', [req.user.id]);
    const tokens = result.rows[0]?.google_tokens;
    res.json({ connected: !!tokens });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check status' });
  }
});

// DELETE /api/google/disconnect
router.delete('/disconnect', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE users SET google_tokens = NULL WHERE id = $1', [req.user.id]);
    res.json({ message: 'Disconnected' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to disconnect' });
  }
});

// GET /api/google/busy — get busy slots
router.get('/busy', authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date required' });

    const result = await pool.query('SELECT google_tokens FROM users WHERE id = $1', [req.user.id]);
    const tokens = result.rows[0]?.google_tokens;
    if (!tokens) return res.json({ busy: [], connected: false });

    const timeMin = new Date(`${date}T00:00:00Z`).toISOString();
    const timeMax = new Date(`${date}T23:59:59Z`).toISOString();

    const busy = await getBusySlots({ tokens, timeMin, timeMax });
    res.json({ busy, connected: true });
  } catch (err) {
    console.error('Busy slots error:', err);
    res.status(500).json({ error: 'Failed to fetch busy slots' });
  }
});

module.exports = router;
