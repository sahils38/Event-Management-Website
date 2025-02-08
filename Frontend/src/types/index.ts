export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'user';
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  imageUrl: string;
  creatorId: string;
  attendeeCount: number;
  category: string;
  attendees: (string | User)[]; // 🔥 Now supports both user IDs and user objects
}
