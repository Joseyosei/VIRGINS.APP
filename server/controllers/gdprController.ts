import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import crypto from 'crypto';

// DELETE /api/users/me — GDPR right to erasure (soft-delete + PII anonymisation)
export const deleteMyAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const user   = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Cancel Stripe subscription if active
    if (user.stripeCustomerId && (user as any).subscriptionTier !== 'free') {
      try {
        const stripeSvc = await import('../services/stripeService');
        await stripeSvc.cancelSubscription(userId);
      } catch { /* best-effort */ }
    }

    // Delete S3 media
    try {
      const s3Svc = await import('../services/s3Service');
      for (const img of (user.images || [])) {
        const key = s3Svc.keyFromUrl(img);
        await s3Svc.deleteFile(key).catch(() => {});
      }
      if (user.videoIntroUrl) {
        const key = s3Svc.keyFromUrl(user.videoIntroUrl);
        await s3Svc.deleteFile(key).catch(() => {});
      }
    } catch { /* best-effort */ }

    // Anonymise PII — keep record shell for referential integrity
    const anonEmail = `deleted_${crypto.randomBytes(8).toString('hex')}@deleted.invalid`;
    await User.findByIdAndUpdate(userId, {
      $set: {
        name:                  'Deleted User',
        email:                 anonEmail,
        passwordHash:          '',
        bio:                   '',
        images:                [],
        profileImage:          '',
        videoIntroUrl:         '',
        pushToken:             '',
        jwtRefreshToken:       '',
        emailVerificationToken:'',
        passwordResetToken:    '',
        stripeCustomerId:      '',
        location:              {},
        isDeleted:             true,
        isBanned:              true,
        isEmailVerified:       false,
      },
      $unset: {
        referralCode: '',
        referredBy:   '',
      }
    });

    res.json({ message: 'Your account has been deleted and all personal data has been removed.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/me/data-export — GDPR data portability
export const exportMyData = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId)
      .select('-passwordHash -jwtRefreshToken -passwordResetToken -emailVerificationToken');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.setHeader('Content-Disposition', 'attachment; filename="virgins-data-export.json"');
    res.setHeader('Content-Type', 'application/json');
    res.json({
      exportedAt:  new Date().toISOString(),
      description: 'VIRGINS — Your personal data export (GDPR Article 20)',
      data:        user.toObject(),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/me — get current user profile
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId)
      .select('-passwordHash -jwtRefreshToken -passwordResetToken -emailVerificationToken');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/me — update current user profile
export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const allowed = ['name', 'bio', 'city', 'faith', 'faithLevel', 'denomination',
                     'values', 'hobbies', 'intention', 'lifestyle', 'location',
                     'onboardingStep', 'onboardingCompletedAt', 'preferences'];
    const update: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.userId, { $set: update }, { new: true })
      .select('-passwordHash -jwtRefreshToken -passwordResetToken -emailVerificationToken');
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/me/referral — referral stats
export const getReferral = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('referralCode referralCount');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate referral code if missing
    if (!(user as any).referralCode) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      await User.findByIdAndUpdate(req.userId, { referralCode: code });
      res.json({ referralCode: code, referralCount: 0, rewardEarned: false });
    } else {
      res.json({
        referralCode:  (user as any).referralCode,
        referralCount: (user as any).referralCount || 0,
        rewardEarned:  ((user as any).referralCount || 0) > 0,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
