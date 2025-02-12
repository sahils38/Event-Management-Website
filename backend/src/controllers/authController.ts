import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = (await User.findOne({ email })) as IUser | null;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return; // Ensure we stop execution here
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return; // Ensure we stop execution here
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

    res.cookie('token', token, { httpOnly: true }).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};
