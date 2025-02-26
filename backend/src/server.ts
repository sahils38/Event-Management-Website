import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';  // ✅ Import event routes

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // For local development
  'https://event-management-website-three.vercel.app', // Old frontend (if still needed)
  'https://event-management-website-713pxmn4c.vercel.app' // ✅ New frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);  // ✅ Register event routes

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
