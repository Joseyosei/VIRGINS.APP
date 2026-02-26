import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';
import { generateTokens, AuthRequest } from '../middleware/auth';
import * as emailService from '../services/emailService';

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    user.jwtRefreshToken = refreshToken;
    user.lastSeen = new Date();
    user.isOnline = true;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        trustLevel: user.trustLevel,
        trustBadges: user.trustBadges,
        isPremium: user.isPremium,
        subscriptionTier: user.subscriptionTier,
        profileImage: user.profileImage,
        bio: user.bio,
        age: user.age,
        city: user.city,
        faith: user.faith,
        denomination: user.denomination,
        intention: user.intention,
        lifestyle: user.lifestyle,
        images: user.images,
        videoIntroUrl: user.videoIntroUrl,
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, {
        jwtRefreshToken: undefined,
        isOnline: false,
        lastSeen: new Date()
      });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash -jwtRefreshToken -emailVerificationToken');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });

    const user = await User.findOne({ jwtRefreshToken: token });
    if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString());
    user.jwtRefreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always respond 200 to avoid user enumeration
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    (user as any).passwordResetToken = token;
    (user as any).passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await emailService.sendPasswordResetEmail(user.email, token);

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) return res.status(400).json({ message: 'Token and new password required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpiry: { $gt: new Date() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.passwordHash = await bcrypt.hash(password, 12);
    (user as any).passwordResetToken = undefined;
    (user as any).passwordResetExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
