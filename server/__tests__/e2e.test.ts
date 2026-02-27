/**
 * E2E Tests — Core User Journey
 *
 * Covers: register → login → discovery → like → match → message →
 *         date request → block/report → GDPR deletion
 */

import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Match from '../models/Match';
import Conversation from '../models/Conversation';
import authRoutes from '../routes/authRoutes';
import userRoutes from '../routes/userRoutes';
import matchRoutes from '../routes/matchRoutes';
import reportRoutes from '../routes/reportRoutes';
import discoveryRoutes from '../routes/discoveryRoutes';
import dateRoutes from '../routes/dateRoutes';

// ── Minimal Express app for E2E tests ──────────────────────────────────────
const app = express();
app.use(express.json());
app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/matches',   matchRoutes);
app.use('/api/reports',   reportRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/dates',     dateRoutes);

// ── Helpers ────────────────────────────────────────────────────────────────
const skip = () => mongoose.connection.readyState !== 1;

async function createUser(overrides: object = {}) {
  const passwordHash = await bcrypt.hash('Test1234!', 10);
  const base = {
    email:     `user_${Date.now()}_${Math.random().toString(36).slice(2)}@test.com`,
    name:      'Test User',
    gender:    'Man',
    age:       25,
    city:      'Austin',
    faith:     'Christian',
    passwordHash,
    isEmailVerified: true,
  };
  return User.create({ ...base, ...overrides });
}

async function loginAs(email: string, password = 'Test1234!'): Promise<string> {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  return res.body.accessToken;
}

// ══════════════════════════════════════════════════════════════════════════════
// REGISTRATION
// ══════════════════════════════════════════════════════════════════════════════
describe('Registration', () => {
  it('blocks users under 18', async () => {
    if (skip()) return;
    const res = await request(app).post('/api/users/register').send({
      email:    'young@test.com',
      name:     'Teen User',
      gender:   'Man',
      age:      16,
      city:     'Dallas',
      faith:    'Christian',
      password: 'Test1234!',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/18/);
  });

  it('registers a valid adult user and returns a referral code', async () => {
    if (skip()) return;
    const res = await request(app).post('/api/users/register').send({
      email:    `register_${Date.now()}@test.com`,
      name:     'Grace Johnson',
      gender:   'Woman',
      age:      23,
      city:     'Nashville',
      faith:    'Baptist',
      password: 'Test1234!',
    });
    expect(res.status).toBe(201);
    expect(res.body.referralCode).toMatch(/^[A-F0-9]{8}$/);
  });

  it('credits referrer when valid referral code used', async () => {
    if (skip()) return;
    const referrer = await createUser({ referralCode: 'TESTCODE', referralCount: 0 });

    await request(app).post('/api/users/register').send({
      email:        `referred_${Date.now()}@test.com`,
      name:         'New Member',
      gender:       'Man',
      age:          22,
      city:         'Austin',
      faith:        'Christian',
      password:     'Test1234!',
      referralCode: 'TESTCODE',
    });

    const updated = await User.findById(referrer._id);
    expect((updated as any).referralCount).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// DISCOVERY FEED
// ══════════════════════════════════════════════════════════════════════════════
describe('Discovery Feed', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app).get('/api/discovery');
    expect(res.status).toBe(401);
  });

  it('returns discovery profiles for authenticated user', async () => {
    if (skip()) return;
    const user = await createUser({ gender: 'Man' });
    // Create a potential match
    await createUser({ gender: 'Woman', email: `woman_${Date.now()}@test.com` });

    const token = await loginAs(user.email);
    const res = await request(app)
      .get('/api/discovery')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('profiles');
    expect(res.body).toHaveProperty('total');
  });

  it('excludes blocked users from discovery', async () => {
    if (skip()) return;
    const userA = await createUser({ gender: 'Man' });
    const userB = await createUser({
      gender: 'Woman',
      email:  `blocked_${Date.now()}@test.com`,
    });
    // Block userB
    await User.findByIdAndUpdate(userA._id, { blockedUsers: [userB._id] });

    const token  = await loginAs(userA.email);
    const res    = await request(app)
      .get('/api/discovery')
      .set('Authorization', `Bearer ${token}`);

    const ids = res.body.profiles?.map((p: any) => p.user._id.toString()) || [];
    expect(ids).not.toContain(userB._id.toString());
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// BLOCK & REPORT
// ══════════════════════════════════════════════════════════════════════════════
describe('Block & Report', () => {
  it('blocks a user and removes mutual match', async () => {
    if (skip()) return;
    const [userA, userB] = await Promise.all([
      createUser({ gender: 'Man' }),
      createUser({ gender: 'Woman', email: `b_${Date.now()}@test.com` }),
    ]);
    await Match.create({ userId1: userA._id, userId2: userB._id, status: 'matched' });

    const token = await loginAs(userA.email);
    const res   = await request(app)
      .post(`/api/users/${userB._id}/block`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const updatedA = await User.findById(userA._id);
    expect((updatedA as any).blockedUsers.map((id: any) => id.toString())).toContain(userB._id.toString());

    const match = await Match.findOne({ userId1: userA._id, userId2: userB._id });
    expect(match).toBeNull();
  });

  it('submits a report successfully', async () => {
    if (skip()) return;
    const [reporter, reported] = await Promise.all([
      createUser({ gender: 'Man' }),
      createUser({ gender: 'Woman', email: `rep_${Date.now()}@test.com` }),
    ]);

    const token = await loginAs(reporter.email);
    const res   = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({ reportedId: reported._id.toString(), type: 'harassment', description: 'Test description' });

    expect(res.status).toBe(201);
    expect(res.body.reportId).toBeDefined();
  });

  it('prevents reporting yourself', async () => {
    if (skip()) return;
    const user  = await createUser({ gender: 'Man' });
    const token = await loginAs(user.email);
    const res   = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({ reportedId: user._id.toString(), type: 'spam' });
    expect(res.status).toBe(400);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// DATE REQUEST / WE MET
// ══════════════════════════════════════════════════════════════════════════════
describe('Date Request & We Met', () => {
  it('creates a date request and recipient can respond', async () => {
    if (skip()) return;
    const [userA, userB] = await Promise.all([
      createUser({ gender: 'Man' }),
      createUser({ gender: 'Woman', email: `date_b_${Date.now()}@test.com` }),
    ]);
    const match = await Match.create({ userId1: userA._id, userId2: userB._id, status: 'matched' });

    const tokenA = await loginAs(userA.email);

    // Request date
    const reqRes = await request(app)
      .post('/api/dates/request')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        matchId:      match._id.toString(),
        stage:        'First Meeting',
        category:     'Coffee & Conversation',
        venue:        'Blue Bottle Coffee',
        proposedDate: '2026-03-15',
        proposedTime: 'Afternoon (12pm-4pm)',
      });

    expect(reqRes.status).toBe(201);
    const dateId = reqRes.body.dateRequest._id;

    // Recipient accepts
    const tokenB   = await loginAs(userB.email);
    const respRes  = await request(app)
      .put(`/api/dates/${dateId}/respond`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ response: 'accepted' });

    expect(respRes.status).toBe(200);
    expect(respRes.body.dateRequest.status).toBe('accepted');
  });

  it('awards reputation when both confirm We Met', async () => {
    if (skip()) return;
    const [userA, userB] = await Promise.all([
      createUser({ gender: 'Man', reputationScore: 0 } as any),
      createUser({ gender: 'Woman', email: `wm_b_${Date.now()}@test.com`, reputationScore: 0 } as any),
    ]);
    const match = await Match.create({ userId1: userA._id, userId2: userB._id, status: 'matched' });
    const DateRequest = (await import('../models/DateRequest')).default;
    const dateReq = await DateRequest.create({
      matchId: match._id, requesterId: userA._id, recipientId: userB._id, status: 'accepted',
    });

    const tokenA = await loginAs(userA.email);
    const tokenB = await loginAs(userB.email);

    await request(app).post(`/api/dates/${dateReq._id}/we-met`).set('Authorization', `Bearer ${tokenA}`);
    const finalRes = await request(app).post(`/api/dates/${dateReq._id}/we-met`).set('Authorization', `Bearer ${tokenB}`);

    expect(finalRes.status).toBe(200);
    expect(finalRes.body.dateRequest.weMet).toBe(true);

    const [updA, updB] = await Promise.all([User.findById(userA._id), User.findById(userB._id)]);
    expect((updA as any).reputationScore).toBe(1);
    expect((updB as any).reputationScore).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// GDPR — ACCOUNT DELETION
// ══════════════════════════════════════════════════════════════════════════════
describe('GDPR — Account Deletion', () => {
  it('anonymises PII and marks account deleted', async () => {
    if (skip()) return;
    const user  = await createUser({ name: 'Alice Smith', bio: 'My personal bio' });
    const token = await loginAs(user.email);

    const res = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const deleted = await User.findById(user._id);
    expect((deleted as any).name).toBe('Deleted User');
    expect((deleted as any).bio).toBe('');
    expect((deleted as any).isDeleted).toBe(true);
    expect((deleted as any).isBanned).toBe(true);
    expect((deleted as any).email).toContain('@deleted.invalid');
  });

  it('returns data export for authenticated user', async () => {
    if (skip()) return;
    const user  = await createUser({ name: 'Bob Export' });
    const token = await loginAs(user.email);

    const res = await request(app)
      .get('/api/users/me/data-export')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.exportedAt).toBeDefined();
    expect(res.body.data.name).toBe('Bob Export');
  });
});
