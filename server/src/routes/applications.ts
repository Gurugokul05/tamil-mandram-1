import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRoles, type AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = Router();
const decisionSchema = z.object({ decision: z.enum(['approve', 'reject']), reason: z.string().max(500).optional() });

router.get('/mine', requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!.id).select('applicationStatus rejectionReason updatedAt');
  res.json({ data: user });
});

router.get('/queue', requireAuth, requireRoles('president', 'faculty_coordinator'), async (req: AuthRequest, res) => {
  const filter = req.user!.role === 'president' ? { applicationStatus: 'pending_president' } : { applicationStatus: 'pending_faculty' };
  res.json({ data: await User.find(filter).select('-passwordHash -tokenVersion').sort({ createdAt: 1 }).lean() });
});

router.patch('/:id', requireAuth, requireRoles('president', 'faculty_coordinator'), async (req: AuthRequest, res) => {
  const parsed = decisionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Decision and optional reason are required' });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Application not found' });
  const isPresident = req.user!.role === 'president';
  const expectedStatus = isPresident ? 'pending_president' : 'pending_faculty';
  if (user.applicationStatus !== expectedStatus) return res.status(409).json({ error: 'Application is not in your approval queue' });
  if (parsed.data.decision === 'reject') {
    user.applicationStatus = 'rejected';
    user.rejectionReason = parsed.data.reason || 'Application was not approved';
  } else if (isPresident) {
    user.applicationStatus = 'pending_faculty';
  } else {
    user.applicationStatus = 'approved';
  }
  await user.save();
  return res.json({ data: { id: user.id, status: user.applicationStatus } });
});

export default router;
