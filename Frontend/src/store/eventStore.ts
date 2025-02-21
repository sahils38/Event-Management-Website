import { create } from 'zustand';
import { Event } from '../types';
import { socket, emitJoinEvent, emitLeaveEvent } from '../services/socket';

interface EventState {
  events: Event[];
  setEvents: (events: Event[]) => void;
  updateEventAttendees: (eventId: string, attendeeCount: number) => void;
  joinEvent: (eventId: string) => Promise<void>;
  leaveEvent: (eventId: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],

  setEvents: (events: Event[]) => set(() => ({ events })),

  updateEventAttendees: (eventId: string, attendeeCount: number) =>
    set((state) => ({
      events: state.events.map((event) =>
        event._id === eventId ? { ...event, attendeeCount } : event
      ),
    }) as Partial<EventState>),

  joinEvent: async (eventId: string) => {
    try {
      if (!socket.id) throw new Error('Socket ID is undefined');

      emitJoinEvent(eventId);
      // Optimistically update the UI
      set((state) => ({
        events: state.events.map((event) =>
          event._id === eventId
            ? {
                ...event,
                attendeeCount: event.attendeeCount + 1,
                attendees: [...event.attendees, socket.id], // Ensured attendees[] is `string[]`
              }
            : event
        ),
      }) as Partial<EventState>);
    } catch (error) {
      console.error('Failed to join event:', error);
      throw error;
    }
  },

  leaveEvent: async (eventId: string) => {
    try {
      if (!socket.id) throw new Error('Socket ID is undefined');

      emitLeaveEvent(eventId);
      // Optimistically update the UI
      set((state) => ({
        events: state.events.map((event) =>
          event._id === eventId
            ? {
                ...event,
                attendeeCount: Math.max(0, event.attendeeCount - 1), // Prevent negative count
                attendees: event.attendees.filter((id) => id !== socket.id),
              }
            : event
        ),
      }) as Partial<EventState>);
    } catch (error) {
      console.error('Failed to leave event:', error);
      throw error;
    }
  },
}));
