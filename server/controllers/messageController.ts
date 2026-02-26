import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Conversation from '../models/Conversation';
import Message from '../models/Message';

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId,
      isActive: true
    })
      .populate('participants', 'name profileImage trustLevel trustBadges isOnline lastSeen')
      .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 50;

    const conv = await Conversation.findById(id);
    if (!conv || !conv.participants.map(p => p.toString()).includes(req.userId!)) {
      return res.status(403).json({ message: 'Not a participant' });
    }

    const messages = await Message.find({ conversationId: id, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('senderId', 'name profileImage');

    res.json(messages.reverse());
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content, type = 'text' } = req.body;

    if (!content?.trim()) return res.status(400).json({ message: 'Message content required' });

    const conv = await Conversation.findById(id);
    if (!conv || !conv.participants.map(p => p.toString()).includes(req.userId!)) {
      return res.status(403).json({ message: 'Not a participant' });
    }

    const message = await Message.create({
      conversationId: id,
      senderId: req.userId,
      content: content.trim(),
      type
    });

    await Conversation.findByIdAndUpdate(id, {
      lastMessage: content.trim(),
      lastMessageAt: new Date()
    });

    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
