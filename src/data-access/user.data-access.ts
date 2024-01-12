import { Types } from 'mongoose';
import User, { IUser, IUserDocument } from '../models/user.model';

export function createUser(newUser: IUser): Promise<IUserDocument> {
    return new User(newUser).save();
}

export async function getUserByEmail(email: string): Promise<IUserDocument | null> {
    return await User.findOne({ email }).exec();
}

export function getUserById(userId: Types.ObjectId): Promise<IUserDocument | null> {
    return User.findById(userId).exec();
}

export function getAllUsers(): Promise<IUserDocument[]>  {
    return User.find({}).exec();
}

export function getUserBorrowedBooks(userId: Types.ObjectId): Promise<IUserDocument | null> {
    return User.findById(userId).populate('borrowedBooks').exec();
}