import React from 'react';

export type PageView = 
  | 'home' 
  | 'waitlist'
  | 'matchmaker'
  | 'nearby'
  | 'date-planner'
  | 'about' 
  | 'careers' 
  | 'press' 
  | 'contact' 
  | 'privacy' 
  | 'terms' 
  | 'cookies' 
  | 'safety' 
  | 'pricing' 
  | 'how-it-works'
  | 'admin'
  | 'profile'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'dashboard'
  | 'matches'
  | 'likes'
  | 'membership';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface BioRequest {
  name: string;
  age: string;
  faith: string;
  hobbies: string;
  values: string;
  lookingFor: string;
}

export interface GeminiResponse {
  bio: string;
  advice: string;
}

export interface WaitlistUser {
  id: string;
  email: string;
  name: string;
  gender: string;
  age: string;
  faith: string;
  city: string;
  joinedAt: string;
  status: 'verified' | 'pending';
}

// --- Matching Algorithm Types ---

export type FaithLevel = 'Very Serious' | 'Practicing' | 'Cultural' | 'Exploring';
export type Intention = 'Marriage ASAP' | 'Marriage in 1-2 years' | 'Dating to Marry' | 'Unsure';
export type Lifestyle = 'Traditional' | 'Modern' | 'Moderate';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  bio?: string;
  gender?: string;
  location?: string;
  coordinates?: string;
  covenant_score?: number;
  faith_level?: number;
  values_level?: number;
  intention_level?: number;
  lifestyle_level?: number;
  photo_url?: string;
  is_premium?: boolean;
  created_at?: string;
  name?: string; // Legacy support
  age?: number;
  faith?: string;
  faithLevel?: string;
  denomination?: string;
  values?: string[];
  image?: string;
}

export interface MatchPreferences {
  gender: string;
  minAge: number;
  maxAge: number;
  faithImportance: number; // 1-10
  valueImportance: number; // 1-10
  locationImportance: number; // 1-10
  targetDenominations: string[];
  requiredValues: string[];
}

export interface MatchResult {
  profile: any;
  score: number; // 0-100
  breakdown: {
    faithScore: number;
    valuesScore: number;
    intentionScore: number;
    lifestyleScore: number;
  };
  reasons: string[];
  bio?: string;
}

export interface PlannedDate {
  id: string;
  partnerName: string;
  partnerImage: string;
  date: string;
  time: string;
  venue: string;
  status: 'pending' | 'confirmed' | 'completed';
  type: string;
}
