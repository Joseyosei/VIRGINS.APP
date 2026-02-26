import express from 'express';
import {
  signPledge,
  uploadId,
  requestReference,
  confirmReference,
  getVerificationStatus,
  initiateBackgroundCheck
} from '../controllers/verificationController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/reference-confirm/:token', confirmReference);

router.use(protect as any);

router.post('/pledge', signPledge as any);
router.post('/id-upload', upload.single('document'), uploadId as any);
router.post('/reference', requestReference as any);
router.get('/status', getVerificationStatus as any);
router.post('/background-check', initiateBackgroundCheck as any);

export default router;
