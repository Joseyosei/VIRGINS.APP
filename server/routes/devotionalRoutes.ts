import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getToday, getDevotionalMatch } from '../controllers/devotionalController';

const router = Router();

router.get('/today', protect, getToday);
router.get('/match',  protect, getDevotionalMatch);

export default router;
