require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedule');
const bookingRoutes = require('./routes/booking');
const aiRoutes = require('./routes/ai');
const googleRoutes = require('./routes/google');
const { initDb } = require('./db/init');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Calendex AI API', version: '1.0.0' }));
app.use('/api/auth', authRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/google', googleRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`🚀 Calendex AI API running on port ${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
  });
}
start().catch(console.error);
