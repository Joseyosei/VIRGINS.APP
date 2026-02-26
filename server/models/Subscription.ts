import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  stripePriceId: { type: String },
  tier: { type: String, enum: ['free', 'plus', 'ultimate'], default: 'free' },
  status: { type: String, enum: ['active', 'canceled', 'past_due', 'trialing', 'incomplete'], default: 'active' },
  currentPeriodEnd: { type: Date },
  cancelAtPeriodEnd: { type: Boolean, default: false },
}, { timestamps: true });

subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
