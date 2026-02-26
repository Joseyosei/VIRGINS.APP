import express from 'express';
import request from 'supertest';
import subscriptionRoutes from '../routes/subscriptionRoutes';

const app = express();
app.use(express.json());
app.use('/api/subscription', subscriptionRoutes);

describe('GET /api/subscription/plans', () => {
  it('returns 200 with plans array', async () => {
    const res = await request(app).get('/api/subscription/plans');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('each plan has required fields', async () => {
    const res = await request(app).get('/api/subscription/plans');
    res.body.forEach((plan: any) => {
      expect(plan.id).toBeDefined();
      expect(plan.name).toBeDefined();
      expect(plan.features).toBeDefined();
    });
  });
});

describe('GET /api/subscription/status', () => {
  it('returns 401 for unauthenticated request', async () => {
    const res = await request(app).get('/api/subscription/status');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/subscription/create-checkout', () => {
  it('returns 401 for unauthenticated request', async () => {
    const res = await request(app).post('/api/subscription/create-checkout').send({ priceId: 'price_test' });
    expect(res.status).toBe(401);
  });
});
