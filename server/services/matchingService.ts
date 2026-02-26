import User from '../models/User';

const INTENTION_MATRIX: Record<string, Record<string, number>> = {
  'Marriage ASAP': {
    'Marriage ASAP': 100,
    'Marriage in 1-2 years': 75,
    'Dating to Marry': 50,
    'Unsure': 20
  },
  'Marriage in 1-2 years': {
    'Marriage ASAP': 75,
    'Marriage in 1-2 years': 100,
    'Dating to Marry': 80,
    'Unsure': 40
  },
  'Dating to Marry': {
    'Marriage ASAP': 50,
    'Marriage in 1-2 years': 80,
    'Dating to Marry': 100,
    'Unsure': 60
  },
  'Unsure': {
    'Marriage ASAP': 20,
    'Marriage in 1-2 years': 40,
    'Dating to Marry': 60,
    'Unsure': 80
  },
};

const LIFESTYLE_MATRIX: Record<string, Record<string, number>> = {
  'Traditional': { 'Traditional': 100, 'Moderate': 65, 'Modern': 20 },
  'Moderate': { 'Traditional': 65, 'Moderate': 100, 'Modern': 70 },
  'Modern': { 'Traditional': 20, 'Moderate': 70, 'Modern': 100 },
};

function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface EnhancedMatchPreferences {
  gender: string;
  minAge: number;
  maxAge: number;
  faithImportance: number;
  valueImportance: number;
  locationImportance: number;
  targetDenominations: string[];
  requiredValues: string[];
  dealBreakers?: {
    minTrustLevel?: number;
    maxDistanceKm?: number;
  };
  intention?: string;
  lifestyle?: string;
}

export const runCovenantAlgorithm = async (userId: string, prefs: EnhancedMatchPreferences) => {
  const currentUser = await User.findById(userId);

  const query: any = {
    gender: prefs.gender,
    age: { $gte: prefs.minAge, $lte: prefs.maxAge },
    _id: { $ne: userId },
  };

  if (prefs.dealBreakers?.minTrustLevel) {
    query.trustLevel = { $gte: prefs.dealBreakers.minTrustLevel };
  }

  const candidates = await User.find(query).limit(100);

  const results = candidates.map(candidate => {
    // === FAITH SCORE (35 pts max) ===
    let faithScore = 0;
    if (prefs.targetDenominations?.length > 0 &&
      prefs.targetDenominations.includes(candidate.denomination || '')) {
      faithScore += 20;
    } else if (candidate.faith) {
      faithScore += 8;
    }
    const faithLevelMap: Record<string, number> = {
      'Very Serious': 15, 'Practicing': 10, 'Cultural': 5, 'Exploring': 2
    };
    faithScore += faithLevelMap[candidate.faithLevel || ''] || 0;
    faithScore = Math.min(35, (faithScore / 35) * ((prefs.faithImportance || 8) * 3.5));

    // === VALUES SCORE (30 pts max) ===
    let valuesScore = 0;
    const candidateValues = Array.isArray(candidate.values) ? candidate.values : [];
    const sharedValues = candidateValues.filter(v => (prefs.requiredValues || []).includes(v));
    const matchRatio = (prefs.requiredValues?.length || 0) > 0
      ? sharedValues.length / prefs.requiredValues.length
      : 0;
    valuesScore = Math.min(30, matchRatio * 30 * ((prefs.valueImportance || 8) / 10));

    // === INTENTION SCORE (25 pts max) ===
    const userIntention = prefs.intention || currentUser?.intention || 'Dating to Marry';
    const candidateIntention = candidate.intention || 'Unsure';
    const intentionCompat = INTENTION_MATRIX[userIntention]?.[candidateIntention] ?? 50;
    const intentionScore = (intentionCompat / 100) * 25;

    // === LIFESTYLE SCORE (10 pts max) ===
    const userLifestyle = prefs.lifestyle || currentUser?.lifestyle || 'Moderate';
    const candidateLifestyle = candidate.lifestyle || 'Moderate';
    const lifestyleCompat = LIFESTYLE_MATRIX[userLifestyle]?.[candidateLifestyle] ?? 50;
    const lifestyleScore = (lifestyleCompat / 100) * 10;

    // === LOCATION BONUS (5 pts max) ===
    let locationBonus = 0;
    const candidateLocation = (candidate as any).location;
    if (currentUser?.location?.lat && candidateLocation?.lat &&
      (prefs.locationImportance || 0) > 5) {
      const distKm = getDistanceKm(
        currentUser.location.lat, currentUser.location.lng || 0,
        candidateLocation.lat, candidateLocation.lng || 0
      );
      if (prefs.dealBreakers?.maxDistanceKm && distKm > prefs.dealBreakers.maxDistanceKm) {
        return null;
      }
      if (distKm < 50) locationBonus = 5;
      else if (distKm < 150) locationBonus = 3;
      else if (distKm < 400) locationBonus = 1;
    }

    // === TRUST BONUS ===
    const trustBonus = ((candidate as any).trustLevel || 1) * 1.5;

    const totalScore = Math.min(100, Math.round(
      faithScore + valuesScore + intentionScore + lifestyleScore + locationBonus + trustBonus
    ));

    const reasons: string[] = [];
    if (intentionCompat >= 75) reasons.push('Aligned Marriage Timeline');
    if (sharedValues.length > 0) reasons.push(`Shared Values: ${sharedValues.slice(0, 3).join(', ')}`);
    if ((prefs.targetDenominations || []).includes(candidate.denomination || '')) {
      reasons.push(`Denomination Match: ${candidate.denomination}`);
    }
    if (lifestyleCompat >= 80) reasons.push('Lifestyle Harmony');
    if ((candidate as any).trustLevel >= 3) reasons.push(`Trust Level ${(candidate as any).trustLevel} Verified`);

    return {
      user: candidate,
      score: totalScore,
      reasons,
      breakdown: { faithScore, valuesScore, intentionScore, lifestyleScore }
    };
  }).filter(Boolean).sort((a: any, b: any) => b.score - a.score);

  return results;
};
