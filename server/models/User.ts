import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  name: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Man', 'Woman'] },
  age: { type: Number, required: true },
  city: { type: String, required: true },
  
  // Faith & Values
  faith: { type: String, required: true },
  faithLevel: { type: String, enum: ['Very Serious', 'Practicing', 'Cultural', 'Exploring'], default: 'Practicing' },
  denomination: { type: String },
  values: [{ type: String }],
  hobbies: [{ type: String }],
  
  // Intentionality
  intention: { type: String, enum: ['Marriage ASAP', 'Marriage in 1-2 years', 'Dating to Marry', 'Unsure'] },
  lifestyle: { type: String, enum: ['Traditional', 'Modern', 'Moderate'] },
  
  // Profile Content
  bio: { type: String },
  images: [{ type: String }], // URLs to stored images
  profileImage: { type: String },
  
  // Status
  status: { type: String, default: 'pending', enum: ['pending', 'verified', 'rejected'] },
  joinedAt: { type: Date, default: Date.now },
  
  // Subscription
  isPremium: { type: Boolean, default: false },
  subscriptionTier: { type: String, enum: ['free', 'plus', 'ultimate'], default: 'free' },
  
  // Security/Verification
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  verificationData: {
    faceVerified: { type: Boolean, default: false },
    idVerified: { type: Boolean, default: false },
    voiceVerified: { type: Boolean, default: false }
  },

  // Auth
  passwordHash: { type: String },
  jwtRefreshToken: { type: String },

  // Location
  location: {
    lat: { type: Number },
    lng: { type: Number },
    city: { type: String },
    country: { type: String, default: 'US' }
  },

  // Trust System
  trustLevel: { type: Number, default: 1, min: 1, max: 4 },
  trustBadges: [{ type: String, enum: ['pledge', 'id_verified', 'reference_verified', 'background_checked'] }],

  // Video Intro
  videoIntroUrl: { type: String },

  // Matching State
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  passedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Premium
  subscriptionExpiry: { type: Date },
  boostExpiresAt: { type: Date },
  travelModeLocation: {
    lat: { type: Number },
    lng: { type: Number },
    city: { type: String }
  },

  // Presence
  lastSeen: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  pushToken: { type: String },

  // Phase 4 additions
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBanned: { type: Boolean, default: false },
  stripeCustomerId: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpiry: { type: Date },

  // Phase 5 — onboarding analytics
  onboardingStep: { type: Number, default: 0 },
  onboardingCompletedAt: { type: Date },

  // Phase 6 — block/report/GDPR
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isDeleted: { type: Boolean, default: false },

  // Phase 6 — discovery preferences
  preferences: {
    gender: { type: String, enum: ['Man', 'Woman'] },
    minAge: { type: Number, default: 18 },
    maxAge: { type: Number, default: 50 },
    maxDistanceKm: { type: Number, default: 100 },
    targetDenominations: [{ type: String }],
    requiredValues: [{ type: String }],
    faithImportance: { type: Number, default: 35 },
    valueImportance: { type: Number, default: 30 },
    minTrustLevel: { type: Number, default: 1 },
  },

  // Phase 6 — reputation & referral
  reputationScore: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralCount: { type: Number, default: 0 },
}, {
  timestamps: true
});

// Critical indexes for matching, auth, admin
userSchema.index({ city: 1, faith: 1, trustLevel: 1 });
userSchema.index({ isPremium: 1, createdAt: -1 });
userSchema.index({ isOnline: 1, lastSeen: -1 });
userSchema.index({ boostExpiresAt: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isBanned: 1 });

const User = mongoose.model('User', userSchema);
export default User;