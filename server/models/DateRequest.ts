import mongoose from 'mongoose';

const dateRequestSchema = new mongoose.Schema({
  matchId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  stage: {
    type: String,
    enum: ['First Meeting', 'Getting to Know You', 'Courtship Proposal'],
    default: 'First Meeting',
  },
  category: { type: String }, // 'Coffee & Conversation', 'Outdoor Adventure', etc.
  venue:    { type: String },
  proposedDate: { type: Date },
  proposedTime: { type: String },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
    default: 'pending',
  },

  // "We Met" confirmation — requires both parties
  requesterMet: { type: Boolean, default: false },
  recipientMet: { type: Boolean, default: false },
  weMet:        { type: Boolean, default: false },
  reputationAwarded: { type: Boolean, default: false },
}, { timestamps: true });

dateRequestSchema.index({ matchId: 1 });
dateRequestSchema.index({ requesterId: 1, status: 1 });
dateRequestSchema.index({ recipientId: 1, status: 1 });

const DateRequest = mongoose.model('DateRequest', dateRequestSchema);
export default DateRequest;
