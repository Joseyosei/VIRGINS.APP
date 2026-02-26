import express from 'express';
import { getConversations, getMessages, sendMessage } from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect as any);

router.get('/conversations', getConversations as any);
router.get('/conversations/:id/messages', getMessages as any);
router.post('/conversations/:id/messages', sendMessage as any);

export default router;
