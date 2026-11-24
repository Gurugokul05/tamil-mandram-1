import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRoles, type AuthRequest } from '../middleware/auth.js';
import { Attendance } from '../models/Attendance.js';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';

const router = Router();
router.use(requireAuth);

router.get('/dashboard', async (req: AuthRequest, res) => {
  const [registrations, attendance, upcoming] = await Promise.all([
    Registration.countDocuments({ user: req.user!.id, status: { $ne: 'cancelled' } }),
    Attendance.countDocuments({ user: req.user!.id }),
    Event.find({ status: 'upcoming' }).sort({ order: 1 }).limit(3).lean(),
  ]);
  res.json({ data: { registrations, attendance, attendancePercent: registrations ? Math.round((attendance / registrations) * 100) : 0, upcoming } });
});

router.get('/events', async (_req, res) => res.json({ data: await Event.find().sort({ order: 1 }).lean() }));

router.post('/events/:eventId/register', async (req: AuthRequest, res) => {
  const event = await Event.findById(req.params.eventId).select('_id');
  if (!event) return res.status(404).json({ error: 'Event not found' });
  try {
    const registration = await Registration.create({ event: event.id, user: req.user!.id, qrToken: randomUUID() });
    return res.status(201).json({ data: registration });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'MongoServerError' && (error as { code?: number }).code === 11000) return res.status(409).json({ error: 'You are already registered for this event' });
    throw error;
  }
});

router.get('/attendance', async (req: AuthRequest, res) => {
  const data = await Attendance.find({ user: req.user!.id }).populate('event', 'title order').sort({ attendedAt: -1 }).lean();
  res.json({ data });
});

const markAttendanceSchema = z.object({ userId: z.string().min(1), source: z.enum(['qr', 'coordinator']).default('coordinator') });
router.post('/events/:eventId/attendance', requireRoles('student_coordinator', 'president', 'faculty_coordinator'), async (req: AuthRequest, res) => {
  const parsed = markAttendanceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'A valid member ID is required' });
  try {
    const attendance = await Attendance.create({ event: req.params.eventId, user: parsed.data.userId, markedBy: req.user!.id, source: parsed.data.source });
    return res.status(201).json({ data: attendance });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'MongoServerError' && (error as { code?: number }).code === 11000) return res.status(409).json({ error: 'Attendance is already marked' });
    throw error;
  }
});

export default router;
