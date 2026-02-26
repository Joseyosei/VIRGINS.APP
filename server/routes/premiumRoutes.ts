import express from 'express';
import { activateBoost, setTravelMode, getAnalytics } from '../controllers/premiumController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect as any);

router.post('/boost', activateBoost as any);
router.post('/travel-mode', setTravelMode as any);
router.get('/analytics', getAnalytics as any);

export default router;
