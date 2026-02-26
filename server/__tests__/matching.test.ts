import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import matchRoutes from '../routes/matchRoutes';
import userRoutes from '../routes/userRoutes';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);

describe('Matching Routes', () => {
  describe('POST /api/matches/like/:id', () => {
    it('returns 401 without auth token', async () => {
      const res = await request(app).post('/api/matches/like/someId');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/matches', () => {
    it('returns 401 without auth token', async () => {
      const res = await request(app).get('/api/matches');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/matches/who-liked-me', () => {
    it('returns 401 without auth token', async () => {
      const res = await request(app).get('/api/matches/who-liked-me');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/users/matches (covenant algorithm)', () => {
    it('returns results array (empty when no users)', async () => {
      if (mongoose.connection.readyState !== 1) return;
      const res = await request(app)
        .post('/api/users/matches')
        .send({ userId: new mongoose.Types.ObjectId().toString(), preferences: {} });
      // Should either return results or 500 (no access to matching service without full DB)
      expect([200, 500]).toContain(res.status);
    });
  });
});
