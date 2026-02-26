import { Request, Response } from 'express';
import User from '../models/User';
import Subscription from '../models/Subscription';
import { AuthRequest } from '../middleware/auth';
import * as stripeService from '../services/stripeService';

export const getPlans = (_req: Request, res: Response) => {
  res.json(stripeService.PLAN_DEFINITIONS);
};

export const createCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { priceId, billingPeriod = 'monthly' } = req.body;
    if (!priceId) return res.status(400).json({ message: 'priceId required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let stripeCustomerId = (user as any).stripeCustomerId;
    if (!stripeCustomerId) {
      try {
        stripeCustomerId = await stripeService.createOrGetCustomer(user.email, user.name);
        await User.findByIdAndUpdate(req.userId, { stripeCustomerId });
      } catch (err: any) {
        return res.status(503).json({ message: 'Payment provider not configured. Set STRIPE_SECRET_KEY in .env', details: err.message });
      }
    }

    const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
    const successUrl = `${CLIENT_URL}?page=pricing&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${CLIENT_URL}?page=pricing&canceled=1`;

    try {
      const session = await stripeService.createCheckoutSession(
        req.userId!,
        stripeCustomerId,
        priceId,
        successUrl,
        cancelUrl
      );
      res.json(session);
    } catch (err: any) {
      res.status(503).json({ message: 'Payment provider error', details: err.message });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStatus = async (req: AuthRequest, res: Response) => {
  try {
    const sub = await Subscription.findOne({ userId: req.userId });
    if (!sub) {
      return res.json({ tier: 'free', status: 'active', currentPeriodEnd: null, cancelAtPeriodEnd: false });
    }
    res.json({
      tier: sub.tier,
      status: sub.status,
      currentPeriodEnd: sub.currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelUserSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const sub = await Subscription.findOne({ userId: req.userId });
    if (!sub || !sub.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }
    await stripeService.cancelSubscription(sub.stripeSubscriptionId);
    sub.cancelAtPeriodEnd = true;
    await sub.save();
    res.json({ message: 'Subscription will cancel at end of billing period', cancelAtPeriodEnd: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  let event: any;
  try {
    const sig = req.headers['stripe-signature'] as string;
    event = stripeService.constructWebhookEvent(req.body as Buffer, sig);
  } catch (err: any) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  try {
    const { type, data } = event;

    if (type === 'checkout.session.completed') {
      const session = data.object;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription;
      const customerId = session.customer;
      if (userId && subscriptionId) {
        const stripeSub = await stripeService.retrieveSubscription(subscriptionId);
        const priceId = stripeSub.items.data[0]?.price.id;
        const plan = stripeService.PLAN_DEFINITIONS.find(p =>
          p.stripePriceIds.monthly === priceId || p.stripePriceIds.yearly === priceId
        );
        const tier = (plan?.tier || 'plus') as 'plus' | 'ultimate';
        await Subscription.findOneAndUpdate(
          { userId },
          {
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            tier,
            status: 'active',
            currentPeriodEnd: new Date((stripeSub as any).current_period_end * 1000),
            cancelAtPeriodEnd: false
          },
          { upsert: true, new: true }
        );
        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          subscriptionTier: tier,
          stripeCustomerId: customerId
        });
      }
    }

    if (type === 'customer.subscription.updated') {
      const stripeSub = data.object;
      const userId = stripeSub.metadata?.userId;
      if (userId) {
        const priceId = stripeSub.items.data[0]?.price.id;
        const plan = stripeService.PLAN_DEFINITIONS.find(p =>
          p.stripePriceIds.monthly === priceId || p.stripePriceIds.yearly === priceId
        );
        const tier = (plan?.tier || 'plus') as 'plus' | 'ultimate';
        await Subscription.findOneAndUpdate(
          { userId },
          {
            status: stripeSub.status,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            tier
          },
          { upsert: false }
        );
        await User.findByIdAndUpdate(userId, { subscriptionTier: tier });
      }
    }

    if (type === 'customer.subscription.deleted') {
      const stripeSub = data.object;
      const userId = stripeSub.metadata?.userId;
      if (userId) {
        await Subscription.findOneAndUpdate({ userId }, { status: 'canceled', tier: 'free' });
        await User.findByIdAndUpdate(userId, { isPremium: false, subscriptionTier: 'free' });
      }
    }

    if (type === 'invoice.payment_failed') {
      const invoice = data.object;
      const sub = await Subscription.findOne({ stripeSubscriptionId: invoice.subscription });
      if (sub) {
        sub.status = 'past_due';
        await sub.save();
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('[Webhook processing error]', err);
    res.status(500).json({ message: err.message });
  }
};
