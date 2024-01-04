import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import * as UserDataAccess from "../data-access/user.data-access";

const secretkey = process.env.JWT_SECRET as string;

function authenticate(authenticationHeader : string | undefined) {
  if (typeof authenticationHeader === "undefined") {
    throw new Error("Nonexistent auth header", { cause: "nonexistence" })
  }
  if(!authenticationHeader.startsWith('Bearer ')) {
    throw new Error("Invalid authentication token format", { cause: "format" })
  }

  const authenticationToken = authenticationHeader.slice(7); 

  let result;
  try {
    result = jwt.verify(authenticationToken, secretkey);
  } catch (error) {
    throw new Error("Incorrect or expired token.", { cause: "incorrectOrExpiredToken" });
  }

  return result;
}

export const authorize = (allowedRoles : string[] | undefined) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authenticationHeader = req.header('Authorization');
    const result = authenticate(authenticationHeader);
    (req as any).user = result;

    const shouldAuthorize = typeof allowedRoles !== "undefined";
    if(shouldAuthorize) { // authorize if any roles are given
      const userRole = (req as any).user.role;
      if (!allowedRoles.includes(userRole)) {
        return void res.status(403).json({ error: "Access denied. This user doesn't have necessary role to do the operation." });
      }
    }

    next();
  } catch (error : any) {
    console.error("JWT Verification Error:", error);

    if (error.cause === "nonexistence") {
      return void res.status(401).json({ error: 'Authentication token is required.' });
    } else if (error.cause === "format") {
      return void res.status(401).json({ error: 'Invalid authentication format.' })
    } else if (error.cause === "incorrectOrExpiredToken") {
      return void res.status(401).json({ error: 'Given token is either incorrect or expired.' });
    }

    return void res.status(500).json({ error: "Internal server error." })
  }
};