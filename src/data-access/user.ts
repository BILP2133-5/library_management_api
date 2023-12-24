import User from '../models/user.model';

export interface NewUser {
    name: string;
    email: string;
    password: string;
    role?: "user" | "admin" | "superadmin";
}
export function createUser(newUser: NewUser) {
    return new User(newUser).save();
}

export async function getUserByEmail(email: string) {
    return await User.findOne({ email });
}

export function getUserById(userId: string) {
    return User.findById(userId);
}