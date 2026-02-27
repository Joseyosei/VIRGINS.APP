import express from 'express';
import { requestDate, respondToDate, confirmWeMet, listDates } from '../controllers/dateController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect as any);

router.get('/',                   listDates     as any);
router.post('/request',           requestDate   as any);
router.put('/:dateId/respond',    respondToDate as any);
router.post('/:dateId/we-met',    confirmWeMet  as any);

export default router;
