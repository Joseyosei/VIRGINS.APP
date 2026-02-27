import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityEvent extends Document {
  title: string;
  description: string;
  category: 'worship' | 'social' | 'service' | 'study' | 'retreat';
  organizer: string;
  location: {
    address: string;
    city: string;
    state: string;
    lat?: number;
    lng?: number;
  };
  dateTime: Date;
  endDateTime?: Date;
  spotsTotal: number;
  attendees: mongoose.Types.ObjectId[];
  coverImage?: string;
  tags: string[];
  faithTradition?: string;
  isVirtual: boolean;
  meetingLink?: string;
  createdBy?: mongoose.Types.ObjectId;
}

const CommunityEventSchema = new Schema<ICommunityEvent>(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    category:    { type: String, enum: ['worship', 'social', 'service', 'study', 'retreat'], default: 'social' },
    organizer:   { type: String, required: true },
    location: {
      address: String,
      city:    { type: String, required: true },
      state:   String,
      lat:     Number,
      lng:     Number,
    },
    dateTime:    { type: Date, required: true },
    endDateTime: Date,
    spotsTotal:  { type: Number, default: 50 },
    attendees:   [{ type: Schema.Types.ObjectId, ref: 'User' }],
    coverImage:  String,
    tags:        [String],
    faithTradition: String,
    isVirtual:   { type: Boolean, default: false },
    meetingLink: String,
    createdBy:   { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

CommunityEventSchema.index({ dateTime: 1 });
CommunityEventSchema.index({ 'location.city': 1 });
CommunityEventSchema.index({ category: 1 });

export default mongoose.model<ICommunityEvent>('CommunityEvent', CommunityEventSchema);
