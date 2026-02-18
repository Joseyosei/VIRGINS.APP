import { UserProfile } from '../types';

export interface MatchPreferences {
  gender: string;
  minAge: number;
  maxAge: number;
  faithImportance: number;
  valueImportance: number;
  locationImportance: number;
  targetDenominations: string[];
  requiredValues: string[];
}

export interface MatchResult {
  profile: any;
  score: number;
  breakdown: {
    faithScore: number;
    valuesScore: number;
    intentionScore: number;
    lifestyleScore: number;
  };
  reasons: string[];
  bio?: string;
}

/**
 * THE COVENANT ALGORITHM
 * Calculates compatibility based on weighted pillars:
 * 1. Faith (35%) - Denomination match, intensity level
 * 2. Values (30%) - Shared core values
 * 3. Intention (25%) - Timeline alignment
 * 4. Lifestyle (10%) - Traditional vs Modern spectrum
 */
export const calculateMatchScore = (user: any, candidate: any, prefs: MatchPreferences): MatchResult => {
  let reasons: string[] = [];
  
  // 1. FAITH SCORE (35 points max)
  let faithScore = 0;
  if (prefs.targetDenominations.includes(candidate.denomination || '')) {
    faithScore += 20;
    reasons.push(`Denomination Match: ${candidate.denomination}`);
  }
  
  if (candidate.faith_level >= 8) faithScore += 15;
  else if (candidate.faith_level >= 5) faithScore += 10;
  
  faithScore = (faithScore / 35) * (prefs.faithImportance * 3.5); 

  // 2. VALUES SCORE (30 points max)
  let valuesScore = 0;
  const candidateValues = Array.isArray(candidate.values) ? candidate.values : (candidate.values ? JSON.parse(candidate.values) : []);
  const sharedValues = candidateValues.filter((v: string) => prefs.requiredValues.includes(v));
  const matchPercentage = sharedValues.length / Math.max(prefs.requiredValues.length, 1);
  valuesScore = matchPercentage * 30;
  
  if (sharedValues.length > 0) {
    reasons.push(`Shared Values: ${sharedValues.join(', ')}`);
  }

  // 3. INTENTION SCORE (25 points max)
  let intentionScore = 0;
  if (candidate.intention_level >= 8) {
    intentionScore = 25;
    reasons.push('High Marriage Intention');
  } else if (candidate.intention_level >= 5) {
    intentionScore = 15;
  }

  // 4. LIFESTYLE SCORE (10 points max)
  let lifestyleScore = 0;
  if (candidate.lifestyle_level >= 8) {
    lifestyleScore = 10;
    reasons.push('Traditional Lifestyle');
  } else if (candidate.lifestyle_level >= 5) {
    lifestyleScore = 5;
  }

  const totalScore = Math.min(Math.round(faithScore + valuesScore + intentionScore + lifestyleScore), 100);

  return {
    profile: {
      ...candidate,
      name: candidate.display_name,
      image: candidate.photo_url,
      age: candidate.age || 25, // Fallback
      denomination: candidate.denomination || 'Christian',
      faithLevel: candidate.faith_level >= 8 ? 'Very Serious' : 'Practicing'
    },
    score: totalScore,
    breakdown: {
      faithScore,
      valuesScore,
      intentionScore,
      lifestyleScore
    },
    reasons
  };
};
