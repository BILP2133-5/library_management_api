import { Request, Response } from 'express';
import { IUser } from '../models/user.model';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUser: IUser = req.body;
      const user = await authService.register(newUser);
      res.json(user);
    } catch (error: any) { 
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unkown Error' });
      }
    }
  };
  
  export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      res.json(user);
      console.log(user);
    } catch (error: any) { 
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unkown Error' });
      }
    }
  };
  