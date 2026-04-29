const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { pool } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Helper: log AI interaction ──────────────────
async function logInteraction(userId, bookingId, type, prompt, response, model, tokens) {
  try {
    await pool.query(
      `INSERT INTO ai_interactions (user_id, booking_id, type, prompt, response, model, tokens_used)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [userId, bookingId, type, prompt, response, model, tokens]
    );
  } catch (e) { /* non-blocking */ }
}

// ─── POST /api/ai/assistant — Scheduling assistant chat ──
router.post('/assistant', authMiddleware, async (req, res) => {
  try {
    const { message, context = {} } = req.body;

    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Get user's upcoming bookings for context
    const bookings = await pool.query(
      `SELECT guest_name, guest_email, start_time, end_time, status
       FROM bookings WHERE host_user_id = $1 AND start_time > NOW()
       ORDER BY start_time LIMIT 5`,
      [req.user.id]
    );

    const systemPrompt = `You are Calendex AI, an intelligent scheduling assistant for ${context.userName || 'the user'}.
You help users manage their calendar, schedule meetings, and optimize their time.

The user's upcoming meetings (next 5):
${JSON.stringify(bookings.rows, null, 2)}

Current time (UTC): ${new Date().toISOString()}

You can help with:
- Finding optimal meeting times
- Suggesting when to reschedule
- Answering questions about their schedule
- Giving productivity tips around scheduling

Be concise, helpful, and friendly. Format times in a readable way.`;

    const response = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    });

    const aiText = response.content[0].text;
    await logInteraction(req.user.id, null, 'assistant', message, aiText, response.model, response.usage?.input_tokens + response.usage?.output_tokens);

    res.json({ reply: aiText, model: response.model });
  } catch (err) {
    console.error('AI assistant error:', err);
    res.status(500).json({ error: 'AI assistant failed' });
  }
});

// ─── POST /api/ai/suggest-reschedule — Smart rescheduling ──
router.post('/suggest-reschedule', authMiddleware, async (req, res) => {
  try {
    const { booking_id, reason } = req.body;

    if (!booking_id) return res.status(400).json({ error: 'booking_id required' });

    // Get the booking
    const bookingResult = await pool.query(
      `SELECT b.*, sl.duration_minutes, sl.title as meeting_type
       FROM bookings b JOIN scheduling_links sl ON b.scheduling_link_id = sl.id
       WHERE b.id = $1 AND b.host_user_id = $2`,
      [booking_id, req.user.id]
    );
    if (bookingResult.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    const booking = bookingResult.rows[0];

    // Get availability
    const availResult = await pool.query(
      'SELECT * FROM availability WHERE user_id = $1 ORDER BY day_of_week',
      [req.user.id]
    );

    // Get other bookings in the next 14 days
    const otherBookings = await pool.query(
      `SELECT start_time, end_time FROM bookings 
       WHERE host_user_id = $1 AND status NOT IN ('cancelled')
       AND start_time > NOW() AND start_time < NOW() + INTERVAL '14 days'
       ORDER BY start_time`,
      [req.user.id]
    );

    const prompt = `I need to reschedule a meeting. Here are the details:

Original meeting:
- Title: ${booking.meeting_type}
- Guest: ${booking.guest_name} (${booking.guest_email})
- Original time: ${new Date(booking.start_time).toLocaleString()}
- Duration: ${booking.duration_minutes} minutes
- Reason for rescheduling: ${reason || 'Not specified'}

My weekly availability:
${JSON.stringify(availResult.rows, null, 2)}

My other upcoming meetings (next 14 days):
${JSON.stringify(otherBookings.rows, null, 2)}

Current date: ${new Date().toISOString()}

Please suggest 3 optimal alternative time slots for this meeting. Consider:
1. Avoiding back-to-back meetings
2. Preferred morning/afternoon slots
3. Buffer time between meetings
4. Not too far in the future

Return your response as JSON with this format:
{
  "suggestions": [
    {"slot": "ISO datetime string", "reason": "why this slot works well"},
    {"slot": "ISO datetime string", "reason": "why this slot works well"},
    {"slot": "ISO datetime string", "reason": "why this slot works well"}
  ],
  "summary": "Brief explanation of your recommendation"
}`;

    const response = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const aiText = response.content[0].text;

    // Parse JSON from response
    let suggestions;
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : { suggestions: [], summary: aiText };
    } catch {
      suggestions = { suggestions: [], summary: aiText };
    }

    await logInteraction(req.user.id, booking_id, 'rescheduling', prompt, aiText, response.model, null);

    res.json({ booking, suggestions });
  } catch (err) {
    console.error('Reschedule AI error:', err);
    res.status(500).json({ error: 'AI rescheduling failed' });
  }
});

// ─── POST /api/ai/summarize — Meeting summarization ──
router.post('/summarize', authMiddleware, async (req, res) => {
  try {
    const { booking_id, transcript, notes } = req.body;

    if (!booking_id || !transcript) {
      return res.status(400).json({ error: 'booking_id and transcript are required' });
    }

    // Get booking details
    const bookingResult = await pool.query(
      `SELECT b.*, sl.title as meeting_type
       FROM bookings b JOIN scheduling_links sl ON b.scheduling_link_id = sl.id
       WHERE b.id = $1 AND b.host_user_id = $2`,
      [booking_id, req.user.id]
    );
    if (bookingResult.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    const booking = bookingResult.rows[0];

    const prompt = `Please analyze and summarize this meeting:

Meeting details:
- Type: ${booking.meeting_type}
- Guest: ${booking.guest_name}
- Date: ${new Date(booking.start_time).toLocaleString()}
- Duration: ${Math.round((new Date(booking.end_time) - new Date(booking.start_time)) / 60000)} minutes

${notes ? `Pre-meeting notes: ${notes}` : ''}

Meeting transcript/notes:
${transcript}

Please provide a structured summary with:
1. Key discussion points
2. Decisions made
3. Action items with owners (if mentioned)
4. Next steps
5. Follow-up meeting needed? (yes/no and suggested timing)

Keep it professional and concise.`;

    const response = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const summary = response.content[0].text;

    // Save summary to booking
    await pool.query(
      'UPDATE bookings SET ai_summary = $1, status = $2, updated_at = NOW() WHERE id = $3',
      [summary, 'completed', booking_id]
    );

    await logInteraction(req.user.id, booking_id, 'summarization', transcript, summary, response.model, null);

    res.json({ summary, booking_id });
  } catch (err) {
    console.error('Summarize error:', err);
    res.status(500).json({ error: 'Meeting summarization failed' });
  }
});

module.exports = router;
