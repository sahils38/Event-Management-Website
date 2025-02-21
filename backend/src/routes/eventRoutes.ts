import express, { Request, Response, NextFunction } from 'express';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware';
import {
  createEvent,
  editEvent,
  deleteEvent,
  joinEvent,
  getAllEvents,
  eventDetails,
} from '../controllers/eventController';

const router = express.Router();

const asyncHandler =
  (fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  router.get('/', asyncHandler(getAllEvents));
  router.get('/:id', asyncHandler(eventDetails));
// Protected routes
router.post('/', verifyToken as any, asyncHandler(createEvent));
router.put('/:id', verifyToken as any, asyncHandler(editEvent));
router.delete('/:id', verifyToken as any, asyncHandler(deleteEvent));
router.post('/:id/join', verifyToken as any, asyncHandler(joinEvent));


export default router;
