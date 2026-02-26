import express from 'express';
import { loginUser, logoutUser, getMe, refreshTokenHandler, forgotPassword, resetPassword } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidators';

const router = express.Router();

router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', protect as any, logoutUser as any);
router.get('/me', protect as any, getMe as any);
router.post('/refresh-token', refreshTokenHandler);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

export default router;
