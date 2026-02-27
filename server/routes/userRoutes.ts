import express from 'express';
import {
  registerUser,
  verifyUserEmail,
  createAiBio,
  editPhoto,
  createVideoIntro,
  getMatches,
  getDateSpots,
  uploadProfilePhoto,
  deleteProfilePhoto,
  uploadVideoIntro,
  generateIcebreakerHandler,
  getMatchInsightsHandler,
  getPhotoFeedbackHandler
} from '../controllers/userController';
import { getMe, updateMe, deleteMyAccount, exportMyData, getReferral } from '../controllers/gdprController';
import { blockUser, unblockUser } from '../controllers/blockController';
import { protect } from '../middleware/auth';
import { imageUpload, videoUpload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { registerSchema } from '../validators/userValidators';

const router = express.Router();

// Auth & Profile
router.post('/register', validate(registerSchema), registerUser);
router.get('/verify-email/:token', verifyUserEmail);

// Current user (GDPR + profile)
router.get('/me',             protect as any, getMe           as any);
router.patch('/me',           protect as any, updateMe        as any);
router.delete('/me',          protect as any, deleteMyAccount as any);
router.get('/me/data-export', protect as any, exportMyData    as any);
router.get('/me/referral',    protect as any, getReferral     as any);

// Block / Unblock
router.post('/:id/block',    protect as any, blockUser   as any);
router.delete('/:id/block',  protect as any, unblockUser as any);

// AI Features
router.post('/generate-bio', createAiBio);
router.post('/edit-photo', editPhoto);
router.post('/generate-video', createVideoIntro);
router.get('/date-ideas', getDateSpots);

// Matching (legacy)
router.post('/matches', getMatches);

// Photo & Video Upload (protected)
router.post('/me/photos', protect as any, imageUpload.single('photo'), uploadProfilePhoto as any);
router.delete('/me/photos', protect as any, deleteProfilePhoto as any);
router.post('/me/video', protect as any, videoUpload.single('video'), uploadVideoIntro as any);

// AI Expansion (protected)
router.post('/ai/icebreaker', protect as any, generateIcebreakerHandler as any);
router.get('/ai/insights/:matchId', protect as any, getMatchInsightsHandler as any);
router.post('/ai/photo-feedback', protect as any, getPhotoFeedbackHandler as any);

export default router;