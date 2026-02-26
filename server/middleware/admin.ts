import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from './auth';

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Not authorized' });
    const user = await User.findById(req.userId).select('role');
    if (!user || (user as any).role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};
