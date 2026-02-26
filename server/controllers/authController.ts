import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateTokens, AuthRequest } from '../middleware/auth';

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
