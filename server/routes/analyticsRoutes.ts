import express from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

router.use(protect as any);

// Track onboarding step progression
router.post('/onboarding-step', async (req: AuthRequest, res) => {
  try {
    const { step } = req.body;
    if (typeof step !== 'number') return res.status(400).json({ message: 'step must be a number' });
    await User.findByIdAndUpdate(req.userId, { onboardingStep: step });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Track onboarding completion
router.post('/onboarding-complete', async (req: AuthRequest, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { onboardingCompletedAt: new Date(), onboardingStep: 7 });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
