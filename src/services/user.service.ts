import User from '../models/user.model';
import { IUserDocument } from '../models/user.model';

export async function getAllUsers() {
  return User.find({});
}

export async function getUserByID(userId: string) {
  return User.findById(userId);
}

export async function getUserBorrowedBooks(userId: string) {
  const user = await User.findById(userId).populate('borrowedBooks');
  if (!user) {
    return null;
  }
  return user.borrowedBooks;
}

export interface UserOrError {
  error?: string;
  user?: IUserDocument;
}

export async function updateUserRole(userIdToPromote: string, role: string): Promise<IUserDocument> {

  const updatedUser = await User.findByIdAndUpdate(userIdToPromote, { role }, { new: true });
  if (!updatedUser) {
    throw new Error('User to promote not found');
  }

  return updatedUser;
}

export async function removeUserByID(id: string): Promise<void> {
  try {
      await User.findByIdAndRemove(id);
  } catch (error) {
      throw new Error('Error while removing user');
  }
}