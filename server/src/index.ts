import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { Event } from './models/Event.js';
import authRouter from './routes/auth.js';
import applicationsRouter from './routes/applications.js';
import portalRouter from './routes/portal.js';
import adminRouter from './routes/admin.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'kare-thamizh-mandram' }));
app.get('/api/events', async (_req, res) => {
  const events = await Event.find().sort({ order: 1 }).lean();
  res.json({ data: events });
});
app.use('/api/auth', authRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/portal', portalRouter);
app.use('/api/admin', adminRouter);

const port = Number(process.env.PORT ?? 4000);
mongoose.connect(process.env.MONGODB_URI ?? '').then(() => {
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}).catch((error: unknown) => {
  console.error('MongoDB connection failed:', error);
  app.listen(port, () => console.log(`API listening without database on http://localhost:${port}`));
});
