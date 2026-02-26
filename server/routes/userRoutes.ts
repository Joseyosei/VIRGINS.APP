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
import { protect } from '../middleware/auth';
import { imageUpload, videoUpload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { registerSchema } from '../validators/userValidators';
const router = express.Router();

// Auth & Profile
router.post('/register', validate(registerSchema), registerUser);
router.get('/verify-email/:token', verifyUserEmail);

// AI Features
router.post('/generate-bio', createAiBio);
router.post('/edit-photo', editPhoto);
router.post('/generate-video', createVideoIntro);
router.get('/date-ideas', getDateSpots);

// Matching
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