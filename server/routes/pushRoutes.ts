import express from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Register push token
router.post('/register', protect as any, async (req: AuthRequest, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'token required' });
    await User.findByIdAndUpdate(req.userId, { pushToken: token });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Unregister push token
router.delete('/unregister', protect as any, async (req: AuthRequest, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $unset: { pushToken: 1 } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
