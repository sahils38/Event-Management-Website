import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  eventName: string;
  description: string;
  date: Date;
  image: string;
  organiser: mongoose.Types.ObjectId;
  attendeeCount: number;
  category: string;
  attendees: mongoose.Types.ObjectId[];
}

const eventSchema = new Schema<IEvent>({
  eventName: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true }, // Changed to Date for better handling
  image: { type: String, required: true },
  organiser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Changed from creatorId
  attendeeCount: { type: Number, default: 0 },
  category: { type: String, required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }] // Store User references
}, { timestamps: true });

export default mongoose.model<IEvent>('Event', eventSchema);
