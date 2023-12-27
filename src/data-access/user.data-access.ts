import { Types } from 'mongoose';
import User, { IUser } from '../models/user.model';

export function createUser(newUser: IUser) {
    return new User(newUser).save();
}

export async function getUserByEmail(email: string) {
    return await User.findOne({ email });
}

export function getUserById(userId: Types.ObjectId) {
    return User.findById(userId);
}