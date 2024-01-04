import { Types } from 'mongoose';

import User from '../models/user.model';
import { IUserDocument } from '../models/user.model';
import * as UserDataAccess from '../data-access/user.data-access';

export async function getAllUsers() {
  return await UserDataAccess.getAllUsers();
}

export async function getUserById(userId: string) {
  const user = await UserDataAccess.getUserById(new Types.ObjectId(userId));
  if(user === null) {
    throw new Error("User is not found.", { cause: "emptyQueryResult" });
  }

  return user;
}

export async function getUserBorrowedBooks(userId: string) {
  const user = await UserDataAccess.getUserBorrowedBooks(new Types.ObjectId(userId));
  if (!user) {
    throw new Error("User is not found.", { cause: "emptyQueryResult" });
  }

  return user.borrowedBooks;
}

export async function removeUserByID(id: string): Promise<void> {
  try {
      await User.findByIdAndRemove(id);
  } catch (error) {
      throw new Error('Error while removing user');
  }
}