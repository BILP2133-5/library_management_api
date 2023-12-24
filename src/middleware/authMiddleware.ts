import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretkey = process.env.JWT_SECRET as string;

function authenticate(authenticationHeader : string | undefined) {
  if (typeof authenticationHeader === "undefined") {
    throw new Error("Nonexistent auth headear", { cause: "nonexistence" })
  }
  if(!authenticationHeader.startsWith('Bearer ')) {
    throw new Error("Invalid authentication token format", { cause: "format" })
  }

  const authenticationToken = authenticationHeader.slice(7); 
  const result : any = jwt.verify(authenticationToken, secretkey);

  return result;
}

export const authorize = (allowedRoles : string[] | undefined) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const authenticationHeader = req.header('Authorization');
    const result = authenticate(authenticationHeader);
    (req as any).user = result;

    if(typeof allowedRoles !== "undefined") { // authorize if any roles are given
      if (!allowedRoles.includes((req as any).user.role)) {
        res.status(403).json({ error: 'Access denied. Only admin users can perform this action.' });
      }
    }

    next();
  } catch (error : any) {
    console.error("JWT Verification Error:", error);

    if (error.cause = "nonexistence") {
      res.status(401).json({ error: 'Authentication token is required' });
    } else if (error.cause = "format") {
      res.status(401).json({ error: 'Invalid authentication format' })
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
};