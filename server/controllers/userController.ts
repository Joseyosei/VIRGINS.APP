import { Request, Response } from 'express';
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
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
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