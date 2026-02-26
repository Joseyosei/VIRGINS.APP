import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'virgins_jwt_secret') as any;
    req.userId = decoded.id;
    // Check ban status (import inline to avoid circular deps)
    const User = (await import('../models/User')).default;
    const user = await User.findById(decoded.id).select('isBanned');
    if (user && (user as any).isBanned) {
      return res.status(403).json({ message: 'Account suspended. Contact support.' });
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'virgins_jwt_secret',
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'virgins_refresh_secret',
    { expiresIn: '30d' }
  );
  return { accessToken, refreshToken };
};
