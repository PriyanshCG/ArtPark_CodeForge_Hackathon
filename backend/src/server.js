require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const router = require('./routes/index');

const app = express();
app.set('trust proxy', 1); // Required for Render/behind proxy to handle cookies/sessions correctly
const PORT = parseInt(process.env.PORT || '5000', 10);

// ── Ensure uploads directory exists ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app')) return callback(null, true);
    logger.warn(`[CORS] Rejected origin: ${origin}`);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

// ── Auth Middleware ──────────────────────────────────────────────────────────
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'artpark_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ──────────────────────────────────────────────────────────────────
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

// ── Root Route ───────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI-Adaptive Onboarding Engine API is running.',
    version: '1.0.0',
  });
});

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
    message: 'Server is healthy',
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', router);

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, data: null, message: 'Route not found' });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV ?? 'development'} mode`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
