import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  level: { type: Number, default: 0, min: 0, max: 4 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'none'],
    default: 'none'
  },
  pledgeSignedAt: { type: Date },
  documents: [{
    type: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  idReviewStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'none'],
    default: 'none'
  },
  idReviewedAt: { type: Date },
  idReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referenceEmail: { type: String },
  referenceToken: { type: String },
  referenceApproved: { type: Boolean, default: false },
  referenceApprovedAt: { type: Date },
  backgroundCheckStatus: {
    type: String,
    enum: ['not_started', 'pending', 'clear', 'consider', 'suspended'],
    default: 'not_started'
  },
  backgroundCheckId: { type: String },
  backgroundCheckWebhookAt: { type: Date },
  verifiedAt: { type: Date },
}, { timestamps: true });

verificationSchema.index({ idReviewStatus: 1 });
verificationSchema.index({ backgroundCheckStatus: 1 });

const Verification = mongoose.model('Verification', verificationSchema);
export default Verification;
