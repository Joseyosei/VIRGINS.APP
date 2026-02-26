import { Response } from 'express';
import User from '../models/User';
import Verification from '../models/Verification';
import Match from '../models/Match';
import Message from '../models/Message';
import { AuthRequest } from '../middleware/auth';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const isPremium = req.query.isPremium;
    const trustLevel = req.query.trustLevel;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';
    if (trustLevel) query.trustLevel = parseInt(trustLevel as string);

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash -jwtRefreshToken -passwordResetToken -emailVerificationToken')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash -jwtRefreshToken -passwordResetToken -emailVerificationToken');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const verification = await Verification.findOne({ userId: req.params.id });
    res.json({ user, verification });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (_req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      premiumUsers,
      pendingVerifications,
      matchesToday,
      messagesToday
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isPremium: true }),
      Verification.countDocuments({ idReviewStatus: 'pending' }),
      Match.countDocuments({ matchedAt: { $gte: today }, status: 'matched' }),
      Message.countDocuments({ createdAt: { $gte: today } })
    ]);

    res.json({ totalUsers, premiumUsers, pendingVerifications, matchesToday, messagesToday });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingVerifications = async (_req: AuthRequest, res: Response) => {
  try {
    const verifications = await Verification.find({ idReviewStatus: 'pending' })
      .populate('userId', 'name email age city faith profileImage trustLevel')
      .sort({ createdAt: 1 });
    res.json(verifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveVerification = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    await Verification.findOneAndUpdate({ userId }, { idReviewStatus: 'approved' });
    await User.findByIdAndUpdate(userId, {
      $max: { trustLevel: 2 },
      $addToSet: { trustBadges: 'id_verified' }
    });
    res.json({ message: 'Verification approved' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectVerification = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    await Verification.findOneAndUpdate({ userId }, { idReviewStatus: 'rejected' });
    res.json({ message: 'Verification rejected' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const banUser = async (req: AuthRequest, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBanned: true });
    res.json({ message: 'User banned' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const unbanUser = async (req: AuthRequest, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBanned: false });
    res.json({ message: 'User unbanned' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
