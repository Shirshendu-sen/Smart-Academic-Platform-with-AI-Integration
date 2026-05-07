import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import lessonRoutes from './routes/lessons';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();

// ── SECURITY MIDDLEWARE ─────────────────────────────────────────
// helmet sets secure HTTP headers (prevents common attacks)
app.use(helmet());

// CORS: only allow requests from our frontend
app.use(cors({
  origin: (origin: string | undefined, callback: Function) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowed = [
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ];

    // Allow all Vercel preview/deployment URLs
    if (origin.endsWith('.vercel.app') || allowed.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting: max 100 requests per 15 minutes per IP
// Protects against brute-force attacks on the auth endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/auth', limiter);

// Parse JSON request bodies (limit 10mb for lesson content)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── ROUTES ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/ai', aiRoutes);

// ── HEALTH CHECK ────────────────────────────────────────────────
// Vercel and monitoring tools ping this to check if the server is alive
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── GLOBAL ERROR HANDLER ─────────────────────────────────────────
// Catches any error thrown from route handlers
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

export default app;
