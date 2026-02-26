import express from 'express';
import { getUsers, getUser, getStats, getPendingVerifications, approveVerification, rejectVerification, banUser, unbanUser } from '../controllers/adminController';
import { protect } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = express.Router();

// All admin routes require JWT + admin role
router.use(protect as any, requireAdmin as any);

router.get('/users', getUsers as any);
router.get('/users/:id', getUser as any);
router.get('/stats', getStats as any);
router.get('/verifications/pending', getPendingVerifications as any);
router.put('/verifications/:userId/approve', approveVerification as any);
router.put('/verifications/:userId/reject', rejectVerification as any);
router.put('/users/:id/ban', banUser as any);
router.put('/users/:id/unban', unbanUser as any);

export default router;
