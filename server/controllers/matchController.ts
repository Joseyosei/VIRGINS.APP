import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Match from '../models/Match';
import Conversation from '../models/Conversation';
import { getIO } from '../lib/socket';
import { sendPushToUser } from '../services/pushService';
import mongoose from 'mongoose';

export const likeUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id: targetId } = req.params;
    const userId = req.userId!;

    if (userId === targetId) return res.status(400).json({ message: 'Cannot like yourself' });

    const existingMutualMatch = await Match.findOne({
      $or: [
        { userId1: userId, userId2: targetId, status: 'matched' },
        { userId1: targetId, userId2: userId, status: 'matched' }
      ]
    });
    if (existingMutualMatch) return res.status(400).json({ message: 'Already matched' });

    const alreadyLiked = await Match.findOne({ userId1: userId, userId2: targetId });
    if (alreadyLiked) return res.status(400).json({ message: 'Already liked this user' });

    const theyLikedUs = await Match.findOne({
      userId1: targetId,
      userId2: userId,
      status: 'pending'
    });

    if (theyLikedUs) {
      theyLikedUs.status = 'matched';
      theyLikedUs.matchedAt = new Date();
      await theyLikedUs.save();

      const conversation = await Conversation.create({
        matchId: theyLikedUs._id,
        participants: [userId, targetId]
      });

      await User.findByIdAndUpdate(userId, { $addToSet: { matches: new mongoose.Types.ObjectId(targetId) } });
      await User.findByIdAndUpdate(targetId, { $addToSet: { matches: new mongoose.Types.ObjectId(userId) } });

      const currentUser = await User.findById(userId).select('name profileImage trustLevel');

      try {
        getIO()?.to(`user_${targetId}`).emit('new_match', {
          matchId: theyLikedUs._id,
          conversationId: conversation._id,
          user: currentUser
        });
      } catch (_) {}

      // Push notifications for mutual match
      const targetUser = await User.findById(targetId).select('name');
      sendPushToUser(
        targetId,
        "You have a Covenant Match! 💛",
        `${currentUser?.name} liked you back`,
        { type: 'match', matchId: String(theyLikedUs._id) }
      ).catch(() => {});
      sendPushToUser(
        userId,
        "You have a Covenant Match! 💛",
        `${targetUser?.name} liked you back`,
        { type: 'match', matchId: String(theyLikedUs._id) }
      ).catch(() => {});

      return res.json({
        matched: true,
        matchId: theyLikedUs._id,
        conversationId: conversation._id
      });
    }

    await Match.create({
      userId1: userId,
      userId2: targetId,
      status: 'pending',
      initiatedBy: new mongoose.Types.ObjectId(userId)
    });

    await User.findByIdAndUpdate(targetId, { $addToSet: { likedBy: new mongoose.Types.ObjectId(userId) } });

    res.json({ matched: false });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const passUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id: targetId } = req.params;
    const userId = req.userId!;
    await User.findByIdAndUpdate(userId, { $addToSet: { passedBy: new mongoose.Types.ObjectId(targetId) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMatches = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const matches = await Match.find({
      $or: [{ userId1: userId }, { userId2: userId }],
      status: 'matched'
    }).populate('userId1 userId2', 'name profileImage trustLevel trustBadges lastSeen isOnline age city bio');

    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const unmatch = async (req: AuthRequest, res: Response) => {
  try {
    const { id: matchId } = req.params;
    const userId = req.userId!;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (match.userId1.toString() !== userId && match.userId2.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    match.status = 'unmatched';
    await match.save();

    await User.findByIdAndUpdate(match.userId1, { $pull: { matches: match.userId2 } });
    await User.findByIdAndUpdate(match.userId2, { $pull: { matches: match.userId1 } });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const whoLikedMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const user = await User.findById(userId).populate('likedBy', 'name profileImage trustLevel trustBadges age city');
    res.json(user?.likedBy || []);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
