import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include decoded JWT payload
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: 'student' | 'instructor' | 'admin';
    email: string;
  };
}

// ── MIDDLEWARE 1: Verify JWT ────────────────────────────────────
// Reads the Authorization header: "Bearer <token>"
// Decodes and verifies it. If valid, attaches user data to req.user
// If invalid or missing, returns 401 immediately (request never reaches the handler)
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided. Please log in.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: 'student' | 'instructor' | 'admin';
      email: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired. Please log in again.' });
    } else {
      res.status(401).json({ error: 'Invalid token. Please log in again.' });
    }
  }
};

// ── MIDDLEWARE 2: Role-Based Access Control ─────────────────────
// Usage: router.post('/create', authenticate, authorize('instructor'), handler)
// Passes if req.user.role is in the allowedRoles list
// Must be used AFTER authenticate (it depends on req.user being set)
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}.`
      });
      return;
    }

    next();
  };
};
