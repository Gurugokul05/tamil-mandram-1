import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRoles, type AuthRequest } from '../middleware/auth.js';
import { Attendance } from '../models/Attendance.js';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import { User } from '../models/User.js';

const router = Router();
router.use(requireAuth, requireRoles('president', 'faculty_coordinator'));
const eventSchema = z.object({ title: z.string().min(2), subtitle: z.string().min(2), description: z.string().min(10), order: z.number().int().positive(), status: z.enum(['upcoming', 'past']).default('upcoming') });

router.get('/overview', async (_req, res) => {
  const [members, pendingPresident, pendingFaculty, registrations, attendance] = await Promise.all([
    User.countDocuments({ applicationStatus: 'approved' }),
    User.countDocuments({ applicationStatus: 'pending_president' }),
    User.countDocuments({ applicationStatus: 'pending_faculty' }),
    Registration.countDocuments({ status: { $ne: 'cancelled' } }),
    Attendance.countDocuments(),
  ]);
  res.json({ data: { members, pendingPresident, pendingFaculty, registrations, attendance } });
});

router.get('/members', async (_req, res) => res.json({ data: await User.find({ applicationStatus: 'approved' }).select('-passwordHash -tokenVersion').sort({ name: 1 }).lean() }));
router.post('/events', async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid event details' });
  const data = parsed.data;
  const event = await Event.create({ ...data, slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') });
  return res.status(201).json({ data: event });
});
router.delete('/events/:id', async (req, res) => {
  const deleted = await Event.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Event not found' });
  res.status(204).send();
});

export default router;
