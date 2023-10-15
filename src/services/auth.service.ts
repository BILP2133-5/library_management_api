import { IUser } from '../models/user.model';
import User from '../models/user.model';
import bcrypt from 'bcrypt';

export async function register(newUser: IUser): Promise<IUser> {
    try {
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
  
      newUser.password = hashedPassword;
  
      const user = new User(newUser);
      return await user.save();
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

export async function login(email: string, password: string): Promise<IUser | null> {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return user;
};
