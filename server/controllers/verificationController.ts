import { Request, Response } from 'express';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth';
import Verification from '../models/Verification';
import User from '../models/User';

export const signPledge = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    let verification = await Verification.findOne({ userId });
    if (!verification) {
      verification = new Verification({ userId });
    }

    verification.pledgeSignedAt = new Date();
    if (verification.level < 1) verification.level = 1;
    verification.status = 'approved';
    await verification.save();

    await User.findByIdAndUpdate(userId, {
      $max: { trustLevel: 1 },
      $addToSet: { trustBadges: 'pledge' }
    });

    res.json({
      success: true,
      message: 'Covenant pledge signed. Level 1 badge granted.',
      level: 1
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadId = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    if (!req.file) return res.status(400).json({ message: 'Document image required' });

    const documentUrl = `pending_review_${userId}_${Date.now()}`;

    let verification = await Verification.findOne({ userId });
    if (!verification) {
      verification = new Verification({ userId, pledgeSignedAt: new Date(), level: 1 });
    }

    verification.documents.push({
      type: req.body.documentType || 'government_id',
      url: documentUrl,
      uploadedAt: new Date()
    });
    verification.idReviewStatus = 'pending';
    await verification.save();

    res.json({
      success: true,
      message: 'Document submitted. Pending admin review (1-2 business days).',
      status: 'pending'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const requestReference = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { referenceEmail } = req.body;

    if (!referenceEmail) return res.status(400).json({ message: 'Reference email required' });

    const token = crypto.randomBytes(32).toString('hex');

    let verification = await Verification.findOne({ userId });
    if (!verification) {
      verification = new Verification({ userId });
    }

    verification.referenceEmail = referenceEmail;
    verification.referenceToken = token;
    await verification.save();

    const confirmUrl = `${process.env.APP_URL || 'http://localhost:5000'}/api/verify/reference-confirm/${token}`;
    console.log(`[REF EMAIL] To: ${referenceEmail}`);
    console.log(`[REF EMAIL] Confirm URL: ${confirmUrl}`);

    res.json({
      success: true,
      message: `Reference request sent to ${referenceEmail}.`
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmReference = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const verification = await Verification.findOne({ referenceToken: token });

    if (!verification) return res.status(400).send('<h1>Invalid or expired link.</h1>');

    verification.referenceApproved = true;
    verification.referenceApprovedAt = new Date();
    verification.referenceToken = undefined;
    if (verification.level < 3) verification.level = 3;
    verification.status = 'approved';
    await verification.save();

    await User.findByIdAndUpdate(verification.userId, {
      $max: { trustLevel: 3 },
      $addToSet: { trustBadges: 'reference_verified' }
    });

    res.send(`
      <div style="font-family:sans-serif;text-align:center;margin:50px;color:#4B0082">
        <h1>Thank you for your reference!</h1>
        <p>Your confirmation has been received. This person's trust level has been upgraded.</p>
      </div>
    `);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getVerificationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const verification = await Verification.findOne({ userId: req.userId });
    const user = await User.findById(req.userId).select('trustLevel trustBadges');

    res.json({
      verification: verification || null,
      trustLevel: user?.trustLevel || 1,
      trustBadges: user?.trustBadges || []
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const initiateBackgroundCheck = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const user = await User.findById(userId);

    if (!user?.isPremium) {
      return res.status(403).json({ message: 'Background check requires Ultimate membership' });
    }

    let verification = await Verification.findOne({ userId });
    if (!verification) {
      verification = new Verification({ userId });
    }

    verification.backgroundCheckStatus = 'pending';
    await verification.save();

    res.json({
      success: true,
      message: 'Background check initiated. Results in 3-5 business days.',
      status: 'pending'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
