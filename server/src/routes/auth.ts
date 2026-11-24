import { Router } from 'express';
import type { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User, roles } from '../models/User.js';
import { requireAuth, signAccessToken, signRefreshToken, secret, type AuthRequest } from '../middleware/auth.js';

const router = Router();
const signupSchema = z.object({
  name: z.string().min(2), email: z.string().email(), password: z.string().min(8),
  regNo: z.string().min(3), department: z.string().min(2), year: z.string().min(1), phone: z.string().min(7),
});
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
}

router.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid application details', details: parsed.error.flatten() });
  const data = parsed.data;
  if (await User.exists({ $or: [{ email: data.email.toLowerCase() }, { regNo: data.regNo.toUpperCase() }] })) return res.status(409).json({ error: 'Email or register number already exists' });
  const user = await User.create({ ...data, email: data.email.toLowerCase(), regNo: data.regNo.toUpperCase(), passwordHash: await bcrypt.hash(data.password, 12) });
  return res.status(201).json({ data: { id: user.id, status: user.applicationStatus, message: 'Application submitted for president review' } });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Email and password are required' });
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return res.status(401).json({ error: 'Invalid email or password' });
  if (user.applicationStatus !== 'approved') return res.status(403).json({ error: 'Application is not approved', status: user.applicationStatus, rejectionReason: user.rejectionReason });
  const accessToken = signAccessToken({ id: user.id, role: user.role, tokenVersion: user.tokenVersion });
  setRefreshCookie(res, signRefreshToken({ id: user.id, tokenVersion: user.tokenVersion }));
  return res.json({ accessToken, user: { id: user.id, name: user.name, role: user.role, regNo: user.regNo } });
});

router.post('/refresh', async (req, res) => {
  try {
    const payload = jwt.verify(req.cookies.refreshToken ?? '', secret('JWT_REFRESH_SECRET')) as jwt.JwtPayload & { tokenVersion: number };
    const user = await User.findById(payload.sub);
    if (!user || user.tokenVersion !== payload.tokenVersion || user.applicationStatus !== 'approved') return res.status(401).json({ error: 'Refresh token is no longer valid' });
    return res.json({ accessToken: signAccessToken({ id: user.id, role: user.role, tokenVersion: user.tokenVersion }) });
  } catch {
    return res.status(401).json({ error: 'Refresh token is invalid or expired' });
  }
});

router.post('/logout', (_req, res) => { res.clearCookie('refreshToken'); res.status(204).send(); });
router.get('/me', requireAuth, async (req: AuthRequest, res) => res.json({ data: await User.findById(req.user!.id).select('-passwordHash -tokenVersion') }));
export default router;
