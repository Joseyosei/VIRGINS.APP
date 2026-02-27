import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: {
    type: String,
    required: true,
    enum: [
      'profile_view',
      'like_sent',
      'pass_sent',
      'match_created',
      'message_sent',
      'date_requested',
      'date_accepted',
      'we_met',
      'subscription_upgraded',
      'profile_boosted',
    ],
  },
  targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who was viewed/liked/etc.
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

analyticsEventSchema.index({ userId: 1, event: 1, createdAt: -1 });
analyticsEventSchema.index({ event: 1, createdAt: -1 });

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
export default AnalyticsEvent;
