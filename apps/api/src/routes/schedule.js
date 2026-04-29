const express = require('express');
const { pool } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/schedule/links — create scheduling link
router.post('/links', authMiddleware, async (req, res) => {
  try {
    const {
      slug, title, description,
      duration_minutes = 30,
      buffer_before = 0,
      buffer_after = 0,
      max_bookings_per_day = 10
    } = req.body;

    if (!slug || !title) {
      return res.status(400).json({ error: 'Slug and title are required' });
    }

    const result = await pool.query(
      `INSERT INTO scheduling_links 
       (user_id, slug, title, description, duration_minutes, buffer_before, buffer_after, max_bookings_per_day)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.user.id, slug, title, description, duration_minutes, buffer_before, buffer_after, max_bookings_per_day]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already taken' });
    res.status(500).json({ error: 'Failed to create link' });
  }
});

// GET /api/schedule/links — get my links
router.get('/links', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM scheduling_links WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// GET /api/schedule/:slug/availability — public: get available slots
router.get('/:slug/availability', async (req, res) => {
  try {
    const { slug } = req.params;
    const { date } = req.query; // YYYY-MM-DD

    if (!date) return res.status(400).json({ error: 'Date query param required' });

    // Get the scheduling link
    const linkResult = await pool.query(
      'SELECT * FROM scheduling_links WHERE slug = $1 AND is_active = true',
      [slug]
    );
    if (linkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Scheduling link not found' });
    }
    const link = linkResult.rows[0];

    // Get host availability for day of week
    const dayOfWeek = new Date(date).getDay();
    const availResult = await pool.query(
      'SELECT * FROM availability WHERE user_id = $1 AND day_of_week = $2',
      [link.user_id, dayOfWeek]
    );

    if (availResult.rows.length === 0) {
      return res.json({ slots: [], message: 'No availability on this day' });
    }

    // Get existing bookings for that day
    const bookingsResult = await pool.query(
      `SELECT start_time, end_time FROM bookings 
       WHERE scheduling_link_id = $1 
       AND DATE(start_time) = $2 
       AND status NOT IN ('cancelled')`,
      [link.id, date]
    );

    // Generate slots
    const avail = availResult.rows[0];
    const slots = generateSlots(
      date, avail.start_time, avail.end_time,
      link.duration_minutes, link.buffer_before, link.buffer_after,
      bookingsResult.rows
    );

    res.json({ slots, duration: link.duration_minutes, title: link.title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// POST /api/schedule/availability — set my availability
router.post('/availability', authMiddleware, async (req, res) => {
  try {
    const { availability } = req.body; // array of { day_of_week, start_time, end_time }

    // Delete existing and replace
    await pool.query('DELETE FROM availability WHERE user_id = $1', [req.user.id]);

    for (const slot of availability) {
      await pool.query(
        'INSERT INTO availability (user_id, day_of_week, start_time, end_time) VALUES ($1,$2,$3,$4)',
        [req.user.id, slot.day_of_week, slot.start_time, slot.end_time]
      );
    }

    res.json({ message: 'Availability updated', count: availability.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

// Helper: generate time slots
function generateSlots(date, startTime, endTime, durationMins, bufferBefore, bufferAfter, existingBookings) {
  const slots = [];
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);

  let current = sh * 60 + sm;
  const end = eh * 60 + em;
  const step = durationMins + bufferBefore + bufferAfter;

  while (current + durationMins <= end) {
    const slotStart = new Date(`${date}T${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}:00`);
    const slotEnd = new Date(slotStart.getTime() + durationMins * 60000);

    const isBooked = existingBookings.some(b => {
      const bStart = new Date(b.start_time);
      const bEnd = new Date(b.end_time);
      return slotStart < bEnd && slotEnd > bStart;
    });

    if (!isBooked) {
      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        label: `${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`,
      });
    }

    current += step;
  }

  return slots;
}

module.exports = router;
