import express from 'express';
import { loginUser, logoutUser, getMe, refreshTokenHandler } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', protect as any, logoutUser as any);
router.get('/me', protect as any, getMe as any);
router.post('/refresh-token', refreshTokenHandler);

export default router;
