import { Request, Response } from "express";
import User,{ IUser } from "../models/user.model";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser: IUser = req.body;
    const token = await authService.register(newUser);
    res.status(200).json({ token });
  } catch (error: any) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown Error' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.status(200).json({ token });
  } catch (error: any) {
    if (error instanceof Error) {
      if (error.message === 'User not found' || error.message === 'Invalid password') {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown Error' });
      }
    }
  }
};

export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser: IUser = req.body;
    
    newUser.role = 'admin';

    const token = await authService.register(newUser);
    res.status(200).json({ token });
  } catch (error: any) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown Error' });
    }
  }
};

export const protectedRoute = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId; 

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
