import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

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
    const user = await User.findById(req.userId).populate('likedBy matches');
    if (!user?.isPremium) return res.status(403).json({ message: 'Ultimate membership required' });

    const likeCount = Array.isArray(user.likedBy) ? user.likedBy.length : 0;
    const matchCount = Array.isArray(user.matches) ? user.matches.length : 0;

    const fields = ['name', 'bio', 'profileImage', 'faith', 'denomination', 'city', 'intention', 'lifestyle'];
    let completeness = 0;
    fields.forEach(f => { if ((user as any)[f]) completeness += 12.5; });

    const boostActive = !!(user.boostExpiresAt && user.boostExpiresAt > new Date());

    res.json({
      weeklyViews: likeCount * 3 + matchCount * 10,
      totalLikes: likeCount,
      totalMatches: matchCount,
      profileCompleteness: Math.min(100, completeness),
      boostActive,
      boostExpiresAt: user.boostExpiresAt || null
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
