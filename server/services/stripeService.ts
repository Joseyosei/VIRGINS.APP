import Stripe from 'stripe';

const SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

const isConfigured = () =>
  SECRET_KEY && !SECRET_KEY.startsWith('sk_test_replace');

let stripeClient: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripeClient) {
    if (!isConfigured()) {
      throw new Error('Stripe not configured. Set STRIPE_SECRET_KEY in .env');
    }
    stripeClient = new Stripe(SECRET_KEY, { apiVersion: '2026-02-25.clover' });
  }
  return stripeClient;
};

export const createCheckoutSession = async (
  userId: string,
  stripeCustomerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> => {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
    subscription_data: { metadata: { userId } },
    allow_promotion_codes: true,
  });
  return { sessionId: session.id, url: session.url! };
};

export const createOrGetCustomer = async (email: string, name: string): Promise<string> => {
  const stripe = getStripe();
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0].id;
  const customer = await stripe.customers.create({ email, name });
  return customer.id;
};

export const cancelSubscription = async (subscriptionId: string): Promise<Stripe.Subscription> => {
  const stripe = getStripe();
  return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
};

export const retrieveSubscription = async (subscriptionId: string): Promise<Stripe.Subscription> => {
  return getStripe().subscriptions.retrieve(subscriptionId);
};

export const constructWebhookEvent = (
  rawBody: Buffer,
  signature: string
): Stripe.Event => {
  if (!WEBHOOK_SECRET || WEBHOOK_SECRET.startsWith('whsec_replace')) {
    throw new Error('Stripe webhook secret not configured');
  }
  return getStripe().webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
};

export const PLAN_DEFINITIONS = [
  {
    id: 'standard',
    name: 'Standard',
    tier: 'free',
    description: 'The foundation for your intentional journey.',
    features: [
      '3 Match discoveries per day',
      'Basic profile verification',
      'See who likes you (Limited)',
      'GPS Nearby Radar',
    ],
    prices: { monthly: null, yearly: null },
    stripePriceIds: { monthly: null, yearly: null },
  },
  {
    id: 'plus',
    name: 'Plus',
    tier: 'plus',
    description: 'Enhanced visibility and intentional matching.',
    features: [
      'Unlimited daily discoveries',
      'Priority profile placement',
      'See all likes instantly',
      '5 AI Bio generations per month',
      'Incognito browsing',
    ],
    prices: { monthly: 19.99, yearly: 179.99 },
    stripePriceIds: {
      monthly: process.env.STRIPE_PRICE_PLUS_MONTHLY || null,
      yearly: process.env.STRIPE_PRICE_PLUS_YEARLY || null,
    },
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    tier: 'ultimate',
    description: 'The complete experience for serious seekers.',
    features: [
      'Everything in Plus',
      'Direct messaging with anyone',
      'Full compatibility breakdowns',
      'Exclusive date planning AI',
      'VIP support and verification',
      'Ad-free experience',
    ],
    prices: { monthly: 39.99, yearly: 359.99 },
    stripePriceIds: {
      monthly: process.env.STRIPE_PRICE_ULTIMATE_MONTHLY || null,
      yearly: process.env.STRIPE_PRICE_ULTIMATE_YEARLY || null,
    },
  },
];
