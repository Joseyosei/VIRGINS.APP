import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import AnalyticsEvent from '../models/AnalyticsEvent';
import { runCovenantAlgorithm } from '../services/matchingService';

// GET /api/discovery
// Returns paginated covenant-scored profiles, respecting blocks and already-seen users.
export const getDiscovery = async (req: AuthRequest, res: Response) => {
  try {
    const userId   = req.userId!;
    const page     = parseInt(req.query.page  as string) || 1;
    const limit    = Math.min(parseInt(req.query.limit as string) || 10, 50);

    const currentUser = await User.findById(userId).select(
      'gender age preferences blockedUsers likedBy passedBy matches isBanned'
    );
    if (!currentUser) return res.status(404).json({ message: 'User not found' });
    if (currentUser.isBanned) return res.status(403).json({ message: 'Account suspended' });

    // Build preferences from stored or query-override
    const storedPrefs = currentUser.preferences || {};
    const prefs = {
      gender:               (req.query.gender   as string) || (storedPrefs as any).gender   || (currentUser.gender === 'Man' ? 'Woman' : 'Man'),
      minAge:               parseInt(req.query.minAge  as string) || (storedPrefs as any).minAge  || 18,
      maxAge:               parseInt(req.query.maxAge  as string) || (storedPrefs as any).maxAge  || 50,
      faithImportance:      (storedPrefs as any).faithImportance  ?? 35,
      valueImportance:      (storedPrefs as any).valueImportance  ?? 30,
      locationImportance:   10,
      targetDenominations:  (storedPrefs as any).targetDenominations || [],
      requiredValues:       (storedPrefs as any).requiredValues       || [],
      dealBreakers: {
        minTrustLevel: (storedPrefs as any).minTrustLevel || 1,
        maxDistanceKm: (storedPrefs as any).maxDistanceKm || 100,
      },
    };

    // IDs to exclude: self, blocked, already-liked/passed/matched
    const excludeIds = new Set<string>([
      userId,
      ...(currentUser.blockedUsers || []).map((id: any) => id.toString()),
      ...(currentUser.likedBy      || []).map((id: any) => id.toString()),
      ...(currentUser.passedBy     || []).map((id: any) => id.toString()),
      ...(currentUser.matches      || []).map((id: any) => id.toString()),
    ]);

    const results = await runCovenantAlgorithm(userId, prefs as any);

    // Filter excluded, sort boosted first then by score, paginate
    const filtered = results
      .filter((r: any) => !excludeIds.has(r.user._id.toString()))
      .sort((a: any, b: any) => {
        const aBoosted = a.user.boostExpiresAt && a.user.boostExpiresAt > new Date() ? 1 : 0;
        const bBoosted = b.user.boostExpiresAt && b.user.boostExpiresAt > new Date() ? 1 : 0;
        if (bBoosted !== aBoosted) return bBoosted - aBoosted;
        // Add reputation bonus (2 pts per confirmed meeting)
        const aScore = a.score + (a.user.reputationScore || 0) * 2;
        const bScore = b.score + (b.user.reputationScore || 0) * 2;
        return bScore - aScore;
      });

    const total   = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    // Strip sensitive fields before returning
    const profiles = paginated.map((r: any) => ({
      user: {
        _id:          r.user._id,
        name:         r.user.name,
        age:          r.user.age,
        city:         r.user.city,
        faith:        r.user.faith,
        denomination: r.user.denomination,
        bio:          r.user.bio,
        profileImage: r.user.profileImage,
        images:       r.user.images,
        videoIntroUrl:r.user.videoIntroUrl,
        trustLevel:   r.user.trustLevel,
        trustBadges:  r.user.trustBadges,
        values:       r.user.values,
        intention:    r.user.intention,
        lifestyle:    r.user.lifestyle,
        isOnline:     r.user.isOnline,
        lastSeen:     r.user.lastSeen,
        reputationScore: r.user.reputationScore,
      },
      score:     r.score,
      reasons:   r.reasons,
      breakdown: r.breakdown,
    }));

    // Track profile views
    if (paginated.length > 0) {
      const events = paginated.map((r: any) => ({
        userId,
        event: 'profile_view',
        targetId: r.user._id,
      }));
      AnalyticsEvent.insertMany(events).catch(() => {});
    }

    res.json({ profiles, total, page, pages: Math.ceil(total / limit) });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/discovery/preferences — save discovery preferences
export const updatePreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const allowed = ['gender', 'minAge', 'maxAge', 'maxDistanceKm', 'targetDenominations',
                     'requiredValues', 'faithImportance', 'valueImportance', 'minTrustLevel'];
    const update: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[`preferences.${key}`] = req.body[key];
    }
    await User.findByIdAndUpdate(userId, { $set: update });
    res.json({ message: 'Preferences saved' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
