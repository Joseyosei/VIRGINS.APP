import * as Sentry from '@sentry/node';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/db';

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
  enabled: !!process.env.SENTRY_DSN,
});
import { setIO } from './lib/socket';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import matchRoutes from './routes/matchRoutes';
import messageRoutes from './routes/messageRoutes';
import verificationRoutes from './routes/verificationRoutes';
import premiumRoutes from './routes/premiumRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import adminRoutes from './routes/adminRoutes';
import pushRoutes from './routes/pushRoutes';
import notificationRoutes from './routes/notificationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import Message from './models/Message';
import { sendPushToUser } from './services/pushService';
import Conversation from './models/Conversation';
import User from './models/User';

const app = express();
Sentry.setupExpressErrorHandler(app);
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

setIO(io);

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
// Stripe webhook needs raw body — must be before express.json
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '50mb' }) as any);

// Rate limiting
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many login attempts, please try again later.' } });
const forgotPasswordLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { message: 'Too many password reset requests.' } });
const aiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { message: 'AI request limit reached. Please wait.' } });
const videoLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { message: 'Video generation limit reached.' } });

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', forgotPasswordLimiter);
app.use('/api/users/ai/', aiLimiter);
app.use('/api/users/generate-bio', aiLimiter);
app.use('/api/users/generate-video', videoLimiter);

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/verify', verificationRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Virgins API — Love Worth Waiting For.', socketio: 'enabled', version: '1.0.0' });
});

app.get('/health', async (_req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  res.json({ status: 'ok', db: dbState === 1 ? 'connected' : 'disconnected', uptime: process.uptime() });
});

// ========================
// SOCKET.IO
// ========================

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'virgins_jwt_secret') as any;
    (socket as any).userId = decoded.id;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

const onlineUsers = new Map<string, string>();

io.on('connection', async (socket) => {
  const userId = (socket as any).userId as string;
  if (!userId) return;

  onlineUsers.set(userId, socket.id);
  await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() }).catch(() => {});

  io.emit('user_online', { userId });
  socket.join(`user_${userId}`);

  socket.on('join_room', (conversationId: string) => {
    if (conversationId) socket.join(`conv_${conversationId}`);
  });

  socket.on('leave_room', (conversationId: string) => {
    if (conversationId) socket.leave(`conv_${conversationId}`);
  });

  socket.on('send_message', async (data: { conversationId: string; content: string; type?: string }) => {
    try {
      const { conversationId, content, type = 'text' } = data;
      if (!conversationId || !content?.trim()) return;

      const conv = await Conversation.findById(conversationId);
      if (!conv || !conv.participants.map(p => p.toString()).includes(userId)) return;

      const message = await Message.create({
        conversationId,
        senderId: userId,
        content: content.trim(),
        type
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: content.trim(),
        lastMessageAt: new Date()
      });

      io.to(`conv_${conversationId}`).emit('receive_message', {
        ...message.toObject(),
        senderId: userId
      });

      // Push notification for offline recipient
      const recipientId = conv.participants.find(p => p.toString() !== userId)?.toString();
      if (recipientId && !onlineUsers.has(recipientId)) {
        const sender = await User.findById(userId).select('name').catch(() => null);
        sendPushToUser(
          recipientId,
          `New message from ${sender?.name || 'Someone'}`,
          content.substring(0, 60),
          { type: 'message', conversationId }
        ).catch(() => {});
      }
    } catch (err) {
      console.error('[Socket] send_message error:', err);
    }
  });

  socket.on('typing_start', (conversationId: string) => {
    if (conversationId) socket.to(`conv_${conversationId}`).emit('typing_start', { userId, conversationId });
  });

  socket.on('typing_stop', (conversationId: string) => {
    if (conversationId) socket.to(`conv_${conversationId}`).emit('typing_stop', { userId, conversationId });
  });

  socket.on('message_read', async (data: { messageId: string; conversationId: string }) => {
    try {
      await Message.findByIdAndUpdate(data.messageId, { readAt: new Date() });
      socket.to(`conv_${data.conversationId}`).emit('message_read', {
        messageId: data.messageId,
        readAt: new Date()
      });
    } catch (err) {
      console.error('[Socket] message_read error:', err);
    }
  });

  socket.on('disconnect', async () => {
    onlineUsers.delete(userId);
    await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() }).catch(() => {});
    io.emit('user_offline', { userId });
  });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

httpServer.listen(PORT, () => {
  console.log(`[Virgins API] Server + Socket.io running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('[Virgins API] Graceful shutdown initiated...');
  await mongoose.connection.close().catch(() => {});
  httpServer.close(() => {
    console.log('[Virgins API] HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { io };
