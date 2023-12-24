import { IUser } from '../models/user.model';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const secretkey = process.env.JWT_SECRET as string;

export async function register(newUser: IUser): Promise<string> {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);

    newUser.password = hashedPassword;

    const user = new User(newUser);
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, secretkey, {
      expiresIn: '1h', // Token expiration time
    });

    return token;
  } catch (error) {
    throw new Error('Registration failed');
  }
}

export async function createAdmin(newUser: IUser): Promise<string> {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);

    newUser.password = hashedPassword;

    const user = new User(newUser);
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, secretkey, {
      expiresIn: '1h', // Token expiration time
    });

    return token;
  } catch (error) {
    console.error('Error in register:', error);
    throw new Error('Registration failed');
  }
}

export async function login(email: string, password: string): Promise<string> {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, secretkey, {
    expiresIn: '1h', // Token expiration time
  });

  return token;
}

