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

    // Simulate sending email (Log to console)
    const verificationLink = `${req.protocol}://${req.get('host')}/api/users/verify-email/${emailVerificationToken}`;
    console.log(`[EMAIL SERVICE] To: ${email} | Subject: Verify your Virgins account`);
    console.log(`[EMAIL SERVICE] Link: ${verificationLink}`);

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