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
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;