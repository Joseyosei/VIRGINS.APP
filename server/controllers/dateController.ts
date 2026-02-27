import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import DateRequest from '../models/DateRequest';
import Match from '../models/Match';
import User from '../models/User';
import AnalyticsEvent from '../models/AnalyticsEvent';
import { sendPushToUser } from '../services/pushService';
import { getIO } from '../lib/socket';

// POST /api/dates/request
export const requestDate = async (req: AuthRequest, res: Response) => {
  try {
    const requesterId = req.userId!;
    const { matchId, stage, category, venue, proposedDate, proposedTime } = req.body;

    if (!matchId) return res.status(400).json({ message: 'matchId required' });

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (match.userId1.toString() !== requesterId && match.userId2.toString() !== requesterId) {
      return res.status(403).json({ message: 'Not part of this match' });
    }

    const recipientId = match.userId1.toString() === requesterId
      ? match.userId2.toString()
      : match.userId1.toString();

    // Prevent duplicate pending request for same match
    const existing = await DateRequest.findOne({ matchId, requesterId, status: 'pending' });
    if (existing) {
      return res.status(409).json({ message: 'You already have a pending date request for this match' });
    }

    const dateReq = await DateRequest.create({
      matchId, requesterId, recipientId, stage, category, venue, proposedDate, proposedTime,
    });

    // Notify recipient
    const requester = await User.findById(requesterId).select('name');
    const message   = `${requester?.name || 'Someone'} wants to plan a date with you!`;

    getIO()?.to(`user_${recipientId}`).emit('date_request', {
      dateId:    dateReq._id,
      requesterId,
      requesterName: requester?.name,
      stage,
      category,
      venue,
      proposedDate,
    });

    sendPushToUser(recipientId, '💌 Date Request!', message, {
      type: 'date_request',
      dateId: dateReq._id.toString(),
    }).catch(() => {});

    AnalyticsEvent.create({ userId: requesterId, event: 'date_requested', targetId: recipientId }).catch(() => {});

    res.status(201).json({ message: 'Date request sent!', dateRequest: dateReq });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/dates/:dateId/respond
export const respondToDate = async (req: AuthRequest, res: Response) => {
  try {
    const { response } = req.body; // 'accepted' | 'declined'
    if (!['accepted', 'declined'].includes(response)) {
      return res.status(400).json({ message: "response must be 'accepted' or 'declined'" });
    }

    const dateReq = await DateRequest.findById(req.params.dateId);
    if (!dateReq) return res.status(404).json({ message: 'Date request not found' });
    if (dateReq.recipientId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the recipient can respond' });
    }
    if (dateReq.status !== 'pending') {
      return res.status(409).json({ message: 'Date request already resolved' });
    }

    dateReq.status = response === 'accepted' ? 'accepted' : 'declined';
    await dateReq.save();

    // Notify requester
    const recipient = await User.findById(req.userId).select('name');
    const text = response === 'accepted'
      ? `${recipient?.name} accepted your date request! 🎉`
      : `${recipient?.name} declined your date request.`;

    getIO()?.to(`user_${dateReq.requesterId.toString()}`).emit('date_response', {
      dateId:   dateReq._id,
      response,
      recipientName: recipient?.name,
    });

    sendPushToUser(dateReq.requesterId.toString(), '📅 Date Update', text, {
      type: 'date_response',
      dateId: dateReq._id.toString(),
    }).catch(() => {});

    if (response === 'accepted') {
      AnalyticsEvent.create({
        userId:   req.userId,
        event:    'date_accepted',
        targetId: dateReq.requesterId,
      }).catch(() => {});
    }

    res.json({ message: `Date request ${response}`, dateRequest: dateReq });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/dates/:dateId/we-met
export const confirmWeMet = async (req: AuthRequest, res: Response) => {
  try {
    const userId  = req.userId!;
    const dateReq = await DateRequest.findById(req.params.dateId);
    if (!dateReq) return res.status(404).json({ message: 'Date request not found' });
    if (dateReq.status !== 'accepted') {
      return res.status(409).json({ message: 'Date must be accepted before confirming we met' });
    }

    const isRequester = dateReq.requesterId.toString() === userId;
    const isRecipient = dateReq.recipientId.toString() === userId;
    if (!isRequester && !isRecipient) {
      return res.status(403).json({ message: 'Not part of this date' });
    }

    if (isRequester) dateReq.requesterMet = true;
    if (isRecipient) dateReq.recipientMet = true;

    // Both confirmed
    if (dateReq.requesterMet && dateReq.recipientMet && !dateReq.weMet) {
      dateReq.weMet   = true;
      dateReq.status  = 'completed';

      if (!dateReq.reputationAwarded) {
        dateReq.reputationAwarded = true;
        // Award +1 reputation to both parties
        await Promise.all([
          User.findByIdAndUpdate(dateReq.requesterId, { $inc: { reputationScore: 1 } }),
          User.findByIdAndUpdate(dateReq.recipientId, { $inc: { reputationScore: 1 } }),
        ]);

        AnalyticsEvent.create({ userId, event: 'we_met', targetId: isRequester ? dateReq.recipientId : dateReq.requesterId }).catch(() => {});

        // Notify both
        const user = await User.findById(userId).select('name');
        const otherId = isRequester ? dateReq.recipientId.toString() : dateReq.requesterId.toString();
        getIO()?.to(`user_${otherId}`).emit('we_met_confirmed', {
          dateId: dateReq._id,
          message: `Both of you confirmed "We Met"! Your reputation score increased. 🌟`,
        });
        sendPushToUser(otherId, '🌟 We Met Confirmed!', `${user?.name} confirmed your first meeting!`, {
          type: 'we_met',
          dateId: dateReq._id.toString(),
        }).catch(() => {});
      }
    }

    await dateReq.save();
    res.json({
      message: dateReq.weMet ? 'Both confirmed! Reputation awarded.' : 'Your confirmation recorded. Waiting for the other person.',
      dateRequest: dateReq,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/dates — list user's date requests
export const listDates = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const dates = await DateRequest.find({
      $or: [{ requesterId: userId }, { recipientId: userId }],
    })
      .populate('requesterId', 'name profileImage')
      .populate('recipientId', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({ dates });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
