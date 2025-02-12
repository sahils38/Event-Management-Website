import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'; // Import User model to fetch user data

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    // Verify the token using the secret key and decode the payload
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { userId: string };

    // Fetch the user from the database using the userId from the JWT payload
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the full user object to req.user
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or Expired Token' });
  }
};
