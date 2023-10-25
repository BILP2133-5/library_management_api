import { Types } from "mongoose";
import User from "../models/user.model";
import { IUser } from "../models/user.model";

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
  user?: IUser;
}

export async function giveUserAdmin(
  adminUserId: string,
  userIdToPromote: string
): Promise<IUser | { error: string }> {
  try {
    const adminUser = await User.findById(adminUserId);

    if (!adminUser) {
      return { error: "Admin user not found" };
    }

    if (adminUser.role !== "admin") {
      return { error: "Only admin users can promote other users" };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userIdToPromote,
      { role: "admin" },
      { new: true }
    );

    if (!updatedUser) {
      return { error: "User to promote not found" };
    }

    return updatedUser;
  } catch (error) {
    return { error: "Internal server error" };
  }
}
