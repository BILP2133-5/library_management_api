import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

import { IUser } from '../models/user.model';
import * as UserDataAccess from '../data-access/user.data-access';
import * as UserLogic from "../logic/user.logic";

const secretKey = process.env.JWT_SECRET as string;

export async function register(newUser: IUser): Promise<string> {
  if (!UserLogic.isValidRole(newUser.role)) {
    throw new Error('Invalid user role.', { cause: "invalidUserRole" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
    newUser.password = hashedPassword;
  } catch (error) {
    throw new Error("Error while password hashing.", { cause: "passwordHashing" })
  }


  let createdUserDocument;
  try {
    createdUserDocument = await UserDataAccess.createUser(newUser);
  } catch (error) {
    throw new Error("Couldn't create new user document on database.", { cause: "userDocumentCreation" })
  }

  let token;
  try {
    token = jwt.sign({ userId: createdUserDocument._id, role: createdUserDocument.role }, secretKey, {
      expiresIn: '1h', // Token expiration time
    });
  } catch (error) {
    throw new Error("Problem while signing the userId role.", { cause: "jwtTokenSigning" })
  }

  return token;
}

export async function createAdmin(newUser: IUser): Promise<string> {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);

    newUser.password = hashedPassword;

    let createdUserDocument;
    try {
      createdUserDocument = await UserDataAccess.createUser(newUser);
    } catch (error) {
      throw new Error("Couldn't create new user document on database.", { cause: "userDocumentCreation" })
    }

    const token = jwt.sign({ userId: createdUserDocument._id, role: createdUserDocument.role }, secretKey, {
      expiresIn: '1h', // Token expiration time
    });

    return token;
  } catch (error) {
    console.error('Error in register:', error);
    throw new Error('Registration failed');
  }
}

export async function login(email: string, password: string): Promise<string> {
  const user = await UserDataAccess.getUserByEmail(email);
  if (!user) {
    throw new Error('User not found.', { cause: "emptyQueryResult" });
  } else if (!UserLogic.isValidRole(user.role)) {
    throw new Error('Invalid user role.', { cause: "invalidUserRole" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Incorrect password.', { cause: "incorrectPassword" });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, {
    expiresIn: '1h', // Token expiration time
  });

  return token;
}

export async function protectedRoute(userId: Types.ObjectId) {
  const user = await UserDataAccess.getUserById(userId);
  if (!user) {
    throw new Error("No such user is found.", { cause: "emptyQueryResult" })
  }

  return user;
}