import { Request, Response } from 'express';
import * as userService from '../services/user.service';

function isValidRole(role: string): boolean {
  return role === 'admin' || role === 'user';
}

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

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  const { userIdToPromote, role } = req.body;

  if (!isValidRole(role)) {
     res.status(400).json({ error: 'Invalid role. Role must be "admin" or "user".' });
     return;
  }

  try {
    const result = await userService.updateUserRole(userIdToPromote, role);
    
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

export async function removeUserByID(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  try {
    await userService.removeUserByID(id);
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}