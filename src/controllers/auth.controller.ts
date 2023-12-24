import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = req.body;
    const token = await AuthService.register(newUser);

    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      if (error.cause === "passwordHashing") {
        res.status(500).json({ error: "Internal server error while password hashing." });
      } else if (error.cause === "userDocumentCreation") {
        res.status(500).json({ error: "Internal server error while trying to create a new user document." })
      } else if (error.cause === "jwtTokenSigning") {
        res.status(500).json({ error: "Internal server error while trying to sign the JWT token." })
      } else {
        res.status(500).json({ error: error.message }); 
      }
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const token = await AuthService.login(email, password);
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      if (error.cause === "emptyQueryResult") {
        res.status(404).json({ error: "There's no such user." });
      } else if (error.cause === 'incorrectPassword') {
        res.status(401).json({ error: "Given password is incorrect." });
      } else {
        res.status(500).json({ error: error.message });
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
    const user = await AuthService.protectedRoute(userId);

    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof Error) {
      if (error.cause === "emptyQueryResult") {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
};
