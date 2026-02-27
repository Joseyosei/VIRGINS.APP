import express from 'express';
import { submitReport } from '../controllers/reportController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect as any);

router.post('/', submitReport as any);

export default router;
