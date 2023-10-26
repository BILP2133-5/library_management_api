import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getUserByID(req: Request, res: Response): Promise<void> {
  const userId = req.params.userId;

  try {
    const user = await userService.getUserByID(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getUserBorrowedBooks(req: Request, res: Response): Promise<void> {
  const userId = req.params.userId;
  try {
    const borrowedBooks = await userService.getUserBorrowedBooks(userId);

    if (!borrowedBooks) {
      res.status(404).json({ error: 'User not found' });
    }

    res.json(borrowedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function giveUserAdmin(req: Request, res: Response): Promise<void> {
  const { adminUserId, userIdToPromote } = req.body;

  try {
    const result = await userService.giveUserAdmin(adminUserId, userIdToPromote);
    
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (['Admin user not found', 'Only admin users can promote other users', 'User to promote not found'].includes(error.message)) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
