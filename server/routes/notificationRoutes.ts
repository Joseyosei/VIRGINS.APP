import express from 'express';
import { protect } from '../middleware/auth';
import { getNotifications, markRead, markAllRead, deleteNotification } from '../controllers/notificationController';

const router = express.Router();

router.use(protect as any);

router.get('/', getNotifications as any);
router.put('/:id/read', markRead as any);
router.put('/read-all', markAllRead as any);
router.delete('/:id', deleteNotification as any);

export default router;
