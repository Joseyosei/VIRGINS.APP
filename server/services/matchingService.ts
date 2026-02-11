import User from '../models/User';

interface MatchPreferences {
  gender: string;
  minAge: number;
  maxAge: number;
  faithImportance: number;
  targetDenominations: string[];
  requiredValues: string[];
}

export const runCovenantAlgorithm = async (userId: string, prefs: MatchPreferences) => {
  // 1. Fetch Candidates from DB
  const candidates = await User.find({
    gender: prefs.gender,
    age: { $gte: prefs.minAge, $lte: prefs.maxAge },
    _id: { $ne: userId } // Exclude self
  });

  // 2. Score Candidates
  const results = candidates.map(candidate => {
    let score = 0;
    let reasons = [];

    // Faith Scoring (Weight: 35%)
    let faithScore = 0;
    if (prefs.targetDenominations.includes(candidate.denomination || '')) {
      faithScore = 35;
      reasons.push('Perfect Denomination Match');
    } else if (candidate.faith === 'Christian') { // Generic fallback logic
      faithScore = 20;
    }
    // Adjust by importance
    faithScore = (faithScore * prefs.faithImportance) / 10;

    // Values Scoring (Weight: 30%)
    let valuesScore = 0;
    const commonValues = candidate.values.filter(v => prefs.requiredValues.includes(v));
    const matchRatio = prefs.requiredValues.length > 0 ? commonValues.length / prefs.requiredValues.length : 0;
    valuesScore = matchRatio * 30;
    if (commonValues.length > 0) reasons.push(`Shared Values: ${commonValues.length}`);

    // Aggregate
    score = faithScore + valuesScore;
    
    // Normalize to 0-100
    score = Math.min(Math.round(score + 35), 100); // Add baseline points for being verified

    return {
      user: candidate,
      score,
      reasons
    };
  });

  // 3. Sort by Score
  return results.sort((a, b) => b.score - a.score);
};