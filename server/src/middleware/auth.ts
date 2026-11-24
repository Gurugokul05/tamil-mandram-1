import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, type Role } from '../models/User.js';

export type AuthRequest = Request & { user?: { id: string; role: Role; tokenVersion: number } };

function secret(name: 'JWT_SECRET' | 'JWT_REFRESH_SECRET') {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function signAccessToken(user: { id: string; role: Role; tokenVersion: number }) {
  return jwt.sign({ role: user.role, tokenVersion: user.tokenVersion }, secret('JWT_SECRET'), { subject: user.id, expiresIn: '15m' });
}

export function signRefreshToken(user: { id: string; tokenVersion: number }) {
  return jwt.sign({ tokenVersion: user.tokenVersion }, secret('JWT_REFRESH_SECRET'), { subject: user.id, expiresIn: '7d' });
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    const payload = jwt.verify(token, secret('JWT_SECRET')) as jwt.JwtPayload & { role: Role; tokenVersion: number };
    const user = await User.findById(payload.sub).select('_id role tokenVersion applicationStatus').lean();
    if (!user || user.tokenVersion !== payload.tokenVersion || user.applicationStatus !== 'approved') {
      return res.status(401).json({ error: 'Your account is not authorized' });
    }
    req.user = { id: user._id.toString(), role: user.role as Role, tokenVersion: user.tokenVersion };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
}

export function requireRoles(...allowed: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowed.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
}

export { secret };
