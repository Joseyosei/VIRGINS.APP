import { UserProfile, MatchPreferences, MatchResult } from '../types';

// Mock Database of Users
const MOCK_DB: UserProfile[] = [
  {
    id: '1',
    name: 'Elizabeth',
    age: 24,
    gender: 'Female',
    location: 'Austin, TX',
    faith: 'Christian',
    faithLevel: 'Very Serious',
    denomination: 'Baptist',
    values: ['Purity', 'Family', 'Homeschooling'],
    intention: 'Marriage ASAP',
    lifestyle: 'Traditional',
    image: 'https://picsum.photos/400/500?random=1',
    bio: 'Saving myself for marriage. Looking for a spiritual leader.'
  },
  {
    id: '2',
    name: 'Sarah',
    age: 26,
    gender: 'Female',
    location: 'Dallas, TX',
    faith: 'Christian',
    faithLevel: 'Practicing',
    denomination: 'Non-Denominational',
    values: ['Kindness', 'Family', 'Travel'],
    intention: 'Dating to Marry',
    lifestyle: 'Moderate',
    image: 'https://picsum.photos/400/500?random=2',
    bio: 'Love Jesus and coffee. Want a family one day.'
  },
  {
    id: '3',
    name: 'Mary',
    age: 23,
    gender: 'Female',
    location: 'Houston, TX',
    faith: 'Catholic',
    faithLevel: 'Very Serious',
    denomination: 'Catholic',
    values: ['Purity', 'Tradition', 'Pro-Life'],
    intention: 'Marriage ASAP',
    lifestyle: 'Traditional',
    image: 'https://picsum.photos/400/500?random=3',
    bio: 'Traditional Catholic mass attendee. Values faith above all.'
  },
  {
    id: '4',
    name: 'James',
    age: 27,
    gender: 'Male',
    location: 'Austin, TX',
    faith: 'Christian',
    faithLevel: 'Very Serious',
    denomination: 'Reformed',
    values: ['Leadership', 'Purity', 'Family'],
    intention: 'Marriage ASAP',
    lifestyle: 'Traditional',
    image: 'https://picsum.photos/400/500?random=4',
    bio: 'Biblical manhood. Seeking a Proverbs 31 woman.'
  },
  {
    id: '5',
    name: 'David',
    age: 29,
    gender: 'Male',
    location: 'Dallas, TX',
    faith: 'Christian',
    faithLevel: 'Practicing',
    denomination: 'Methodist',
    values: ['Career', 'Faith', 'Sports'],
    intention: 'Marriage in 1-2 years',
    lifestyle: 'Modern',
    image: 'https://picsum.photos/400/500?random=5',
    bio: 'Work hard, pray hard.'
  }
];

/**
 * THE COVENANT ALGORITHM
 * Calculates compatibility based on weighted pillars:
 * 1. Faith (35%) - Denomination match, intensity level
 * 2. Values (30%) - Shared core values
 * 3. Intention (25%) - Timeline alignment
 * 4. Lifestyle (10%) - Traditional vs Modern spectrum
 */
export const calculateMatches = (prefs: MatchPreferences): MatchResult[] => {
  const candidates = MOCK_DB.filter(u => 
    u.gender === prefs.gender && 
    u.age >= prefs.minAge && 
    u.age <= prefs.maxAge
  );

  const results: MatchResult[] = candidates.map(candidate => {
    let reasons: string[] = [];
    
    // 1. FAITH SCORE (35 points max)
    let faithScore = 0;
    // Denomination Match
    if (prefs.targetDenominations.includes(candidate.denomination)) {
      faithScore += 20;
      reasons.push(`Denomination Match: ${candidate.denomination}`);
    } else if (prefs.targetDenominations.includes('Any Christian') && candidate.faith === 'Christian') {
      faithScore += 15;
    }
    // Intensity Match
    if (candidate.faithLevel === 'Very Serious') faithScore += 15;
    else if (candidate.faithLevel === 'Practicing') faithScore += 10;
    
    // Adjust based on user importance preference
    faithScore = (faithScore / 35) * (prefs.faithImportance * 3.5); 

    // 2. VALUES SCORE (30 points max)
    let valuesScore = 0;
    const sharedValues = candidate.values.filter(v => prefs.requiredValues.includes(v));
    const matchPercentage = sharedValues.length / Math.max(prefs.requiredValues.length, 1);
    valuesScore = matchPercentage * 30;
    
    if (sharedValues.length > 0) {
      reasons.push(`Shared Values: ${sharedValues.join(', ')}`);
    }

    // 3. INTENTION SCORE (25 points max)
    let intentionScore = 0;
    if (candidate.intention === 'Marriage ASAP') {
      intentionScore = 25;
      reasons.push('Ready for Marriage Now');
    } else if (candidate.intention === 'Marriage in 1-2 years') {
      intentionScore = 20;
    } else if (candidate.intention === 'Dating to Marry') {
      intentionScore = 15;
    }

    // 4. LIFESTYLE SCORE (10 points max)
    let lifestyleScore = 0;
    if (candidate.lifestyle === 'Traditional') {
      lifestyleScore = 10;
      reasons.push('Traditional Lifestyle');
    } else if (candidate.lifestyle === 'Moderate') {
      lifestyleScore = 5;
    }

    const totalScore = Math.min(Math.round(faithScore + valuesScore + intentionScore + lifestyleScore), 100);

    return {
      profile: candidate,
      score: totalScore,
      breakdown: {
        faithScore,
        valuesScore,
        intentionScore,
        lifestyleScore
      },
      reasons
    };
  });

  // Sort by highest score
  return results.sort((a, b) => b.score - a.score);
};