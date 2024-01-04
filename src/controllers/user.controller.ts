import { Request, Response } from 'express';

import * as UserService from '../services/user.service';
import * as UserLogic from '../logic/user.logic';

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await UserService.getAllUsers();

    return void res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return void res.json({ error: error.message });  
    }

    return void res.json({ error: 'Internal server error.' });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const userId = req.params.userId;

  try {
    const user = await UserService.getUserById(userId);

    return void res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      if (error.cause === "emptyQueryResult") {
        return void res.json("User not found.");
      }

      return void res.json({ error: error.message });  
    }

    return void res.json({ error: 'Internal server error.' });
  }
}

export async function getUserBorrowedBooks(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.userId;
    const borrowedBooks = await UserService.getUserBorrowedBooks(userId);

    return void res.json(borrowedBooks);
  } catch (error) {
    if (error instanceof Error) {
      if (error.cause === "emptyQueryResult") {
        return void res.json({ error: 'User not found' });
      }

      return void res.json({ error: error.message });  
    }

    return void res.json({ error: 'Internal server error.' });
  }
}

export async function removeUserByID(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  try {
    await UserService.removeUserByID(id);
    return void res.json({ message: 'User removed successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return void res.json({ error: error.message });  
    }

    return void res.json({ error: 'Internal server error.' });
  }
}