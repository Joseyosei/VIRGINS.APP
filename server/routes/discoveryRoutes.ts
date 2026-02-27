import express from 'express';
import { getDiscovery, updatePreferences } from '../controllers/discoveryController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect as any);

router.get('/', getDiscovery as any);
router.put('/preferences', updatePreferences as any);

export default router;
