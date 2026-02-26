import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import * as geminiService from '../services/geminiService';
import * as veoService from '../services/veoService';
import * as matchingService from '../services/matchingService';

// Register User
export const registerUser = async (req: any, res: any) => {
  try {
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      ...req.body,
      emailVerificationToken,
      isEmailVerified: false
    });

    // Send welcome email via emailService
    const verificationLink = `${req.protocol}://${req.get('host')}/api/users/verify-email/${emailVerificationToken}`;
    console.log(`[EMAIL] To: ${email} | Link: ${verificationLink}`);
    try {
      const emailSvc = await import('../services/emailService');
      await emailSvc.sendWelcomeEmail(email, req.body.name || email.split('@')[0]);
    } catch (emailErr) {
      console.error('[EMAIL] Failed to send welcome email:', emailErr);
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user._id
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Verify Email
export const verifyUserEmail = async (req: any, res: any) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).send('<h1>Invalid or expired verification link.</h1>');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1 style="color: #4CAF50;">Email Verified Successfully!</h1>
        <p>Your account is now active. You may return to the app.</p>
      </div>
    `);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Generate Bio (AI)
export const createAiBio = async (req: any, res: any) => {
  try {
    const result = await geminiService.generateProfileBio(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Photo (AI)
export const editPhoto = async (req: any, res: any) => {
  try {
    const { image, prompt } = req.body;
    if (!image || !prompt) return res.status(400).json({ message: 'Image and prompt required' });
    
    const result = await geminiService.editUserImage(image, prompt);
    res.json({ image: result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create Video Intro (Veo)
export const createVideoIntro = async (req: any, res: any) => {
  try {
    const { image, name } = req.body;
    if (!image) return res.status(400).json({ message: 'Image required' });

    // Note: Long running operation, usually handled via jobs/queues. 
    // Here we await it for simplicity in the demo context.
    const videoBase64 = await veoService.generateVideoIntro(image, name);
    res.json({ video: `data:video/mp4;base64,${videoBase64}` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Matches
export const getMatches = async (req: any, res: any) => {
  try {
    const { userId, preferences } = req.body;
    const matches = await matchingService.runCovenantAlgorithm(userId, preferences);
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Date Ideas (Maps)
export const getDateSpots = async (req: any, res: any) => {
    try {
        const { city, interests } = req.query;
        const result = await geminiService.getDateIdeas(String(city), String(interests));
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
import * as s3Service from '../services/s3Service';
import path from 'path';

// Upload Profile Photo
export const uploadProfilePhoto = async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const userId = req.userId;
    const ext = path.extname(req.file.originalname).replace('.', '') || 'jpg';
    const key = s3Service.buildPhotoKey(userId, ext);
    const url = await s3Service.uploadFile(req.file.buffer, key, req.file.mimetype);

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { images: url } },
      { new: true }
    ).select('images profileImage');

    if (user && !user.profileImage) {
      await User.findByIdAndUpdate(userId, { profileImage: url });
    }

    res.json({ url, images: user?.images || [url] });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Profile Photo
export const deleteProfilePhoto = async (req: any, res: any) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) return res.status(400).json({ message: 'photoUrl required' });
    const userId = req.userId;
    const key = s3Service.keyFromUrl(photoUrl);
    await s3Service.deleteFile(key);
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { images: photoUrl } },
      { new: true }
    ).select('images profileImage');
    res.json({ images: user?.images || [] });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Video Intro
export const uploadVideoIntro = async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No video file uploaded' });
    const userId = req.userId;
    const ext = path.extname(req.file.originalname).replace('.', '') || 'mp4';
    const key = s3Service.buildVideoKey(userId, ext);
    const url = await s3Service.uploadFile(req.file.buffer, key, req.file.mimetype);
    await User.findByIdAndUpdate(userId, { videoIntroUrl: url });
    res.json({ url });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Generate Icebreaker (AI)
export const generateIcebreakerHandler = async (req: any, res: any) => {
  try {
    const { matchId } = req.body;
    if (!matchId) return res.status(400).json({ message: 'matchId required' });
    const Match = (await import('../models/Match')).default;
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    const userA = await User.findById(match.userId1).select('name age faith faithLevel denomination values bio');
    const userB = await User.findById(match.userId2).select('name age faith faithLevel denomination values bio');
    if (!userA || !userB) return res.status(404).json({ message: 'Users not found' });
    const icebreakers = await geminiService.generateIcebreaker(userA, userB);
    res.json({ icebreakers });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Match Insights (AI)
export const getMatchInsightsHandler = async (req: any, res: any) => {
  try {
    const { matchId } = req.params;
    const Match = (await import('../models/Match')).default;
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    const userA = await User.findById(match.userId1).select('name age faith faithLevel denomination values intention lifestyle');
    const userB = await User.findById(match.userId2).select('name age faith faithLevel denomination values intention lifestyle');
    if (!userA || !userB) return res.status(404).json({ message: 'Users not found' });
    const insights = await geminiService.getMatchInsights(userA, userB);
    res.json(insights);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Photo Feedback (AI)
export const getPhotoFeedbackHandler = async (req: any, res: any) => {
  try {
    const { photoBase64 } = req.body;
    if (!photoBase64) return res.status(400).json({ message: 'photoBase64 required' });
    const feedback = await geminiService.getPhotoFeedback(photoBase64);
    res.json(feedback);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
