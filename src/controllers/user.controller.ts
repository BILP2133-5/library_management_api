import { Request, Response } from 'express';

import * as UserService from '../services/user.service';
import * as UserLogic from '../logic/user.logic';

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await UserService.getAllUsers();

    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return void res.status(500).json({ error: error.message });  
    }

    return void res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const userId = req.params.userId;

  try {
    const user = await UserService.getUserById(userId);

    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      if (error.cause === "emptyQueryResult") {
        return void res.status(404).json("User not found.");
      }

      return void res.status(500).json({ error: error.message });  
    }

    return void res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function getUserBorrowedBooks(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.userId;
    const borrowedBooks = await UserService.getUserBorrowedBooks(userId);

    res.json(borrowedBooks);
  } catch (error) {
    if (error instanceof Error) {
      if (error.cause === "emptyQueryResult") {
        return void res.status(404).json({ error: 'User not found' });
      }

      return void res.status(500).json({ error: error.message });  
    }

    return void res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  const { userIdToPromote, role } = req.body;

  if (!UserLogic.isValidRole(role)) {
     res.status(400).json({ error: 'Invalid role. Role must be "admin","superadmin" or "user".' });
     return;
  }

  try {
    const result = await UserService.updateUserRole(userIdToPromote, role);
    
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof Error) {
        return void res.status(500).json({ error: error.message });  
      }
       
      return void res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

export async function removeUserByID(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  try {
    await UserService.removeUserByID(id);
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return void res.status(500).json({ error: error.message });  
    }

    return void res.status(500).json({ error: 'Internal server error.' });
  }
}