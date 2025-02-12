import { Request, Response } from 'express';
import Event, { IEvent } from '../models/eventModel';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const event: IEvent = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events: IEvent[] = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};
