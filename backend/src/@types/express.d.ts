import { IUser } from '../models/userModel'; // import your User type if necessary

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // This tells TypeScript that there might be a 'user' property on the Request object
    }
  }
}