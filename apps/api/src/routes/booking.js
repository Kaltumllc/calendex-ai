const express = require('express');
const { pool } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/bookings — create a booking (public)
router.post('/', async (req, res) => {
  try {
    const { slug, guest_name, guest_email, start_time, notes } = req.body;

    if (!slug || !guest_name || !guest_email || !start_time) {
      return res.status(400).json({ error: 'slug, guest_name, guest_email, start_time are required' });
    }

    // Get scheduling link
    const linkResult = await pool.query(
      'SELECT * FROM scheduling_links WHERE slug = $1 AND is_active = true',
      [slug]
    );
    if (linkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Scheduling link not found' });
    }
    const link = linkResult.rows[0];

    const start = new Date(start_time);
    const end = new Date(start.getTime() + link.duration_minutes * 60000);

    // Check conflict
    const conflict = await pool.query(
      `SELECT id FROM bookings 
       WHERE scheduling_link_id = $1 
       AND status NOT IN ('cancelled')
       AND start_time < $2 AND end_time > $3`,
      [link.id, end.toISOString(), start.toISOString()]
    );
    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: 'Time slot no longer available' });
    }

    const result = await pool.query(
      `INSERT INTO bookings 
       (scheduling_link_id, host_user_id, guest_name, guest_email, start_time, end_time, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [link.id, link.user_id, guest_name, guest_email, start.toISOString(), end.toISOString(), notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// GET /api/bookings — get my bookings (authenticated host)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, from, to } = req.query;

    let query = `
      SELECT b.*, sl.title as link_title, sl.slug 
      FROM bookings b
      JOIN scheduling_links sl ON b.scheduling_link_id = sl.id
      WHERE b.host_user_id = $1
    `;
    const params = [req.user.id];

    if (status) { params.push(status); query += ` AND b.status = $${params.length}`; }
    if (from) { params.push(from); query += ` AND b.start_time >= $${params.length}`; }
    if (to) { params.push(to); query += ` AND b.start_time <= $${params.length}`; }

    query += ' ORDER BY b.start_time DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id — single booking
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, sl.title as link_title, sl.duration_minutes 
       FROM bookings b
       JOIN scheduling_links sl ON b.scheduling_link_id = sl.id
       WHERE b.id = $1 AND b.host_user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE bookings SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND host_user_id = $2 RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// PATCH /api/bookings/:id/reschedule
router.patch('/:id/reschedule', authMiddleware, async (req, res) => {
  try {
    const { new_start_time } = req.body;
    if (!new_start_time) return res.status(400).json({ error: 'new_start_time is required' });

    const bookingResult = await pool.query(
      `SELECT b.*, sl.duration_minutes 
       FROM bookings b JOIN scheduling_links sl ON b.scheduling_link_id = sl.id
       WHERE b.id = $1 AND b.host_user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (bookingResult.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });

    const booking = bookingResult.rows[0];
    const newStart = new Date(new_start_time);
    const newEnd = new Date(newStart.getTime() + booking.duration_minutes * 60000);

    const result = await pool.query(
      `UPDATE bookings 
       SET start_time = $1, end_time = $2, status = 'rescheduled', updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [newStart.toISOString(), newEnd.toISOString(), req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reschedule' });
  }
});

module.exports = router;
