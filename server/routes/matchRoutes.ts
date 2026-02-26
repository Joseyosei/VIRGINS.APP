import express from 'express';
import { likeUser, passUser, getMatches, unmatch, whoLikedMe } from '../controllers/matchController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect as any);

router.post('/like/:id', likeUser as any);
router.post('/pass/:id', passUser as any);
router.get('/', getMatches as any);
router.delete('/unmatch/:id', unmatch as any);
router.get('/who-liked-me', whoLikedMe as any);

export default router;
