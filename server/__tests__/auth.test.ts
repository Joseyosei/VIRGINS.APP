import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';
import authRoutes from '../routes/authRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    if (mongoose.connection.readyState !== 1) return;
    const passwordHash = await bcrypt.hash('password123', 10);
    await User.create({
      email: 'test@example.com',
      name: 'Test User',
      gender: 'Man',
      age: 25,
      city: 'New York',
      faith: 'Christian',
      passwordHash,
    });
  });

  it('returns 422 for invalid email format', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'notanemail', password: 'password123' });
    expect(res.status).toBe(422);
  });

  it('returns 422 for short password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: '123' });
    expect(res.status).toBe(422);
  });

  it('returns 401 for wrong password', async () => {
    if (mongoose.connection.readyState !== 1) return;
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  it('returns 401 for non-existent user', async () => {
    if (mongoose.connection.readyState !== 1) return;
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.com', password: 'password123' });
    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/forgot-password', () => {
  it('returns 422 for invalid email', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'bad' });
    expect(res.status).toBe(422);
  });

  it('returns 200 for any valid email (no user leak)', async () => {
    if (mongoose.connection.readyState !== 1) return;
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'nobody@example.com' });
    expect(res.status).toBe(200);
  });
});

describe('POST /api/auth/reset-password/:token', () => {
  it('returns 422 for mismatched passwords', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password/sometoken')
      .send({ password: 'newpassword1', confirmPassword: 'different1' });
    expect(res.status).toBe(422);
  });

  it('returns 400 for invalid/expired token', async () => {
    if (mongoose.connection.readyState !== 1) return;
    const res = await request(app)
      .post('/api/auth/reset-password/invalidtoken')
      .send({ password: 'newpassword1', confirmPassword: 'newpassword1' });
    expect(res.status).toBe(400);
  });

  it('succeeds with valid token', async () => {
    if (mongoose.connection.readyState !== 1) return;
    const token = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash('oldpassword', 10);
    await User.create({
      email: 'reset@example.com',
      name: 'Reset User',
      gender: 'Woman',
      age: 24,
      city: 'LA',
      faith: 'Christian',
      passwordHash,
      passwordResetToken: token,
      passwordResetExpiry: new Date(Date.now() + 60 * 60 * 1000),
    });
    const res = await request(app)
      .post(`/api/auth/reset-password/${token}`)
      .send({ password: 'newsecurepass', confirmPassword: 'newsecurepass' });
    expect(res.status).toBe(200);
  });
});
