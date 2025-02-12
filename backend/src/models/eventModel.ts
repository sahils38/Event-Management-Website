import mongoose, { Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description: string;
  date: string;
  imageUrl: string;
  creatorId: string;
  attendeeCount: number;
  category: string;
  attendees: string[];
}

const eventSchema = new mongoose.Schema<IEvent>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  imageUrl: { type: String, required: true },
  creatorId: { type: String, required: true },
  attendeeCount: { type: Number, default: 0 },
  category: { type: String, required: true },
  attendees: { type: [String], default: [] },
});

export default mongoose.model<IEvent>('Event', eventSchema);
