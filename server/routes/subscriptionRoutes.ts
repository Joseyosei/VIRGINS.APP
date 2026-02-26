import express from 'express';
import { getPlans, createCheckout, getStatus, cancelUserSubscription, handleWebhook } from '../controllers/subscriptionController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/create-checkout', protect as any, createCheckout as any);
router.get('/status', protect as any, getStatus as any);
router.post('/cancel', protect as any, cancelUserSubscription as any);
// Webhook uses raw body — must be registered with express.raw() in index.ts
router.post('/webhook', handleWebhook as any);

export default router;
