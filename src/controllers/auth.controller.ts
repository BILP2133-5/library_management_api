import { Request, Response } from "express";

import * as AuthService from "../services/auth.service";
import { IUser } from '../models/user.model';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = req.body;
    const token = await AuthService.register(newUser);

    return void res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      if (error.cause === "invalidUserRole") {
        return void res.json({ error: "The role for this user is invalid." });
      } else if (error.cause === "passwordHashing") {
        return void res.json({ error: "Internal server error while password hashing." });
      } else if (error.cause === "userDocumentCreation") {
        return void res.json({ error: "Internal server error while trying to create a new user document." })
      } else if (error.cause === "jwtTokenSigning") {
        return void res.json({ error: "Internal server error while trying to sign the JWT token." })
      }
       
      return void res.json({ error: error.message });
    }
     
    return void res.json({ error: "Internal server error." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const token = await AuthService.login(email, password);
    
    return void res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      if (error.cause === "emptyQueryResult") {
        return void res.json({ error: "There's no such user." });
      } else if (error.cause === "invalidUserRole") {
        return void res.json({ error: "The role for this user is invalid." });
      } else if (error.cause === 'incorrectPassword') {
        return void res.json({ error: "Given password is incorrect." });
      }
       
      return void res.json({ error: error.message });
    }
     
    return void res.json({ error: "Internal server error." });
  }
};

export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser: IUser = req.body;
    newUser.role = 'admin';

    const token = await AuthService.register(newUser);
    return void res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      return void res.json({ error: error.message });
    }
     
    return void res.json({ error: "Internal server error." });
  }
};

export const protectedRoute = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId; 

  try {
    const user = await AuthService.protectedRoute(userId);

    return void res.json({ user });
  } catch (error) {
    if (error instanceof Error) {
      if (error.cause === "emptyQueryResult") {
        return void res.json({ error: 'User not found' });
      }
       
      return void res.json({ error: error.message });
    }
     
    return void res.json({ error: "Internal server error." });
  }
};
