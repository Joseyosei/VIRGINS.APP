import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import AnalyticsEvent from '../models/AnalyticsEvent';

export const activateBoost = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.isPremium) return res.status(403).json({ message: 'Ultimate membership required' });

    const boostExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await User.findByIdAndUpdate(req.userId, { boostExpiresAt });

    res.json({ success: true, boostExpiresAt, message: 'Profile boosted for 30 minutes!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const setTravelMode = async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lng, city } = req.body;
    const user = await User.findById(req.userId);
    if (!user?.isPremium) return res.status(403).json({ message: 'Ultimate membership required' });

    await User.findByIdAndUpdate(req.userId, { travelModeLocation: { lat, lng, city } });
    res.json({ success: true, message: `Travel mode set to ${city}` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.isPremium) return res.status(403).json({ message: 'Ultimate membership required' });

    const userId = req.userId!;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Real event-based counts from AnalyticsEvent model
    const [weeklyViews, totalLikes, totalMatches, totalDatesRequested, totalWeMet] = await Promise.all([
      AnalyticsEvent.countDocuments({ targetId: userId, event: 'profile_view', createdAt: { $gte: weekAgo } }),
      AnalyticsEvent.countDocuments({ targetId: userId, event: 'like_sent' }),
      AnalyticsEvent.countDocuments({ userId, event: 'match_created' }),
      AnalyticsEvent.countDocuments({ userId, event: 'date_requested' }),
      AnalyticsEvent.countDocuments({ userId, event: 'we_met' }),
    ]);

    const fields = ['name', 'bio', 'profileImage', 'faith', 'denomination', 'city', 'intention', 'lifestyle'];
    let completeness = 0;
    fields.forEach(f => { if ((user as any)[f]) completeness += 12.5; });

    const boostActive = !!(user.boostExpiresAt && user.boostExpiresAt > new Date());

    res.json({
      weeklyViews,
      totalLikes,
      totalMatches,
      totalDatesRequested,
      totalWeMet,
      reputationScore:    (user as any).reputationScore || 0,
      profileCompleteness: Math.min(100, completeness),
      boostActive,
      boostExpiresAt: user.boostExpiresAt || null,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
