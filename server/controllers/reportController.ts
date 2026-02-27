import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Report from '../models/Report';
import User from '../models/User';

// POST /api/reports — submit a report
export const submitReport = async (req: AuthRequest, res: Response) => {
  try {
    const { reportedId, type, description, conversationId } = req.body;
    const reporterId = req.userId;

    if (!reportedId || !type) {
      return res.status(400).json({ message: 'reportedId and type are required' });
    }
    if (reportedId === reporterId) {
      return res.status(400).json({ message: 'Cannot report yourself' });
    }

    // Prevent duplicate open reports
    const existing = await Report.findOne({ reporterId, reportedId, status: 'pending' });
    if (existing) {
      return res.status(409).json({ message: 'You already have a pending report for this user' });
    }

    const report = await Report.create({ reporterId, reportedId, type, description, conversationId });
    res.status(201).json({ message: 'Report submitted. Our team will review it within 24 hours.', reportId: report._id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/reports — list reports (admin only)
export const listReports = async (req: AuthRequest, res: Response) => {
  try {
    const page   = parseInt(req.query.page  as string) || 1;
    const limit  = parseInt(req.query.limit as string) || 20;
    const status = (req.query.status as string) || 'pending';

    const query: any = {};
    if (status !== 'all') query.status = status;

    const total   = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('reporterId', 'name email profileImage')
      .populate('reportedId', 'name email profileImage isBanned')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ reports, total, page, pages: Math.ceil(total / limit) });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/reports/:id/resolve — resolve a report
export const resolveReport = async (req: AuthRequest, res: Response) => {
  try {
    const { action, adminNote } = req.body; // action: 'actioned' | 'dismissed'
    if (!['actioned', 'dismissed'].includes(action)) {
      return res.status(400).json({ message: "action must be 'actioned' or 'dismissed'" });
    }

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status     = action;
    report.adminNote  = adminNote;
    report.reviewedBy = req.userId as any;
    report.reviewedAt = new Date();
    await report.save();

    // If actioned, ban the reported user
    if (action === 'actioned') {
      await User.findByIdAndUpdate(report.reportedId, { isBanned: true });
    }

    res.json({ message: `Report ${action}`, report });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
