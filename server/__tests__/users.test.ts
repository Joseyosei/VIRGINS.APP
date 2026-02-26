import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import userRoutes from '../routes/userRoutes';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('POST /api/users/register', () => {
  it('returns 422 for underage user', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'Young User',
      email: 'young@example.com',
      password: 'password123',
      age: 15,
      gender: 'Man',
      city: 'NYC',
      faith: 'Christian',
    });
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].field).toBe('age');
  });

  it('returns 422 for invalid email', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'User',
      email: 'notvalid',
      password: 'password123',
      age: 25,
      gender: 'Man',
      city: 'NYC',
      faith: 'Christian',
    });
    expect(res.status).toBe(422);
  });

  it('returns 422 for short password', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'User',
      email: 'user@example.com',
      password: '123',
      age: 25,
      gender: 'Man',
      city: 'NYC',
      faith: 'Christian',
    });
    expect(res.status).toBe(422);
  });

  it('returns 422 for invalid gender', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'User',
      email: 'user@example.com',
      password: 'password123',
      age: 25,
      gender: 'Other',
      city: 'NYC',
      faith: 'Christian',
    });
    expect(res.status).toBe(422);
  });

  it('returns 201 for valid registration', async () => {
    if (mongoose.connection.readyState !== 1) return;
    const res = await request(app).post('/api/users/register').send({
      name: 'Valid User',
      email: `valid${Date.now()}@example.com`,
      password: 'password123',
      age: 25,
      gender: 'Man',
      city: 'NYC',
      faith: 'Christian',
    });
    expect(res.status).toBe(201);
    expect(res.body.userId).toBeDefined();
  });

  it('returns 400 for duplicate email', async () => {
    if (mongoose.connection.readyState !== 1) return;
    const email = `dup${Date.now()}@example.com`;
    await request(app).post('/api/users/register').send({
      name: 'First User',
      email,
      password: 'password123',
      age: 25,
      gender: 'Man',
      city: 'NYC',
      faith: 'Christian',
    });
    const res = await request(app).post('/api/users/register').send({
      name: 'Second User',
      email,
      password: 'password123',
      age: 26,
      gender: 'Woman',
      city: 'LA',
      faith: 'Christian',
    });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/users/verify-email/:token', () => {
  it('returns HTML error for invalid token', async () => {
    if (mongoose.connection.readyState !== 1) return;
    const res = await request(app).get('/api/users/verify-email/invalidtoken');
    expect(res.status).toBe(400);
    expect(res.text).toContain('Invalid');
  });
});
