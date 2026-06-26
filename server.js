require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// ── DB ────────────────────────────────────────────────────
connectDB();

// ── APP ───────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://loadbhai-logistics.surge.sh',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());

// ── ROUTES ────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/loads',     require('./routes/loads'));
app.use('/api/trucks',    require('./routes/trucks'));
app.use('/api/bus',       require('./routes/bus'));
app.use('/api/corporate', require('./routes/corporate'));
app.use('/api/maps',      require('./routes/maps'));

// ── HEALTH CHECK ──────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ── START ─────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 LoadBhai API running on port ${PORT}`);
});