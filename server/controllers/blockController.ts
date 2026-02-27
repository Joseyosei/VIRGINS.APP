import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Conversation from '../models/Conversation';
import Match from '../models/Match';

// POST /api/users/:id/block
export const blockUser = async (req: AuthRequest, res: Response) => {
  try {
    const blockerId  = req.userId!;
    const blockedId  = req.params.id;

    if (blockerId === blockedId) {
      return res.status(400).json({ message: 'Cannot block yourself' });
    }

    await User.findByIdAndUpdate(blockerId, {
      $addToSet: { blockedUsers: blockedId },
    });

    // Remove mutual match and conversation silently
    await Match.deleteMany({
      $or: [
        { userId1: blockerId, userId2: blockedId },
        { userId1: blockedId, userId2: blockerId },
      ],
    });
    await Conversation.deleteMany({
      participants: { $all: [blockerId, blockedId] },
    });

    res.json({ message: 'User blocked' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/:id/block
export const unblockUser = async (req: AuthRequest, res: Response) => {
  try {
    const blockerId = req.userId!;
    const blockedId = req.params.id;

    await User.findByIdAndUpdate(blockerId, {
      $pull: { blockedUsers: blockedId },
    });

    res.json({ message: 'User unblocked' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
