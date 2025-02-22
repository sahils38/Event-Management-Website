import { Response } from 'express';
import Event from '../models/eventModel';
import { AuthRequest } from '../middleware/authMiddleware';

// ✅ Create Event
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    const { eventName, description, date, time, image, category } = req.body;
    const organiser = req.user.id; // Attach logged-in user as organiser
    const combinedDateTime = new Date(`${date}T${time}:00.000Z`);
    const newEvent = new Event({
      eventName,
      description,
      date: combinedDateTime ,
      image,
      category,
      organiser, // Ensure consistency
      attendees: [],
      attendeeCount: 0,
    });

    await newEvent.save();
    res.status(201).json({ success: true, message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};
export const eventDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
       res.status(404).json({ message: 'Event not found' });
       return;
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// ✅ Edit Event
export const editEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    if (event.organiser.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { eventName, description, date, time, image, category } = req.body;
   

    event.eventName = eventName || event.eventName;
    event.description = description || event.description;
    if (date && time) {
      event.date = new Date(`${date}T${time}:00.000Z`);
    }

    event.image = image || event.image;
    event.category = category || event.category;

    await event.save();
    res.status(200).json({ success: true, message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

// ✅ Delete Event
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    if (event.organiser.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Unauthorized' });
      return;
    }

    await event.deleteOne();
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};
export const getAllEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
// ✅ Join Event
export const joinEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    const userId = req.user.id;

    if (event.attendees.includes(userId)) {
      res.status(400).json({ success: false, message: 'You already joined this event' });
      return;
    }

    event.attendees.push(userId);
    event.attendeeCount = event.attendees.length;

    await event.save();
    res.status(200).json({ success: true, message: 'Joined event successfully', event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};
