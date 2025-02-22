export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'user';
}

export interface Event {
  _id: string;
  eventName: string;
  description: string;
  date: Date;
  image: string;
  organiser: string;
  attendeeCount: number;
  category: string;
  attendees: (string | User)[]; // 🔥 Now supports both user IDs and user objects
}
