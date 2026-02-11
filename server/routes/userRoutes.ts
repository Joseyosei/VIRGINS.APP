import express from 'express';
import { 
  registerUser, 
  verifyUserEmail,
  createAiBio, 
  editPhoto, 
  createVideoIntro, 
  getMatches,
  getDateSpots 
} from '../controllers/userController';

const router = express.Router();

// Auth & Profile
router.post('/register', registerUser);
router.get('/verify-email/:token', verifyUserEmail);

// AI Features
router.post('/generate-bio', createAiBio);
router.post('/edit-photo', editPhoto);
router.post('/generate-video', createVideoIntro);
router.get('/date-ideas', getDateSpots);

// Matching
router.post('/matches', getMatches);

export default router;