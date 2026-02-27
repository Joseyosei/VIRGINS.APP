import { Router } from 'express';
import { protect } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import {
  listEvents,
  getEvent,
  createEvent,
  rsvpEvent,
} from '../controllers/communityEventController';

const router = Router();

router.get('/',           protect, listEvents);
router.get('/:id',        protect, getEvent);
router.post('/',          protect, requireAdmin, createEvent);
router.post('/:id/rsvp',  protect, rsvpEvent);

export default router;
