import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretkey = process.env.JWT_SECRET as string;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authenticationHeader = req.header('Authorization');
  if (typeof authenticationHeader === "undefined") {
    return void res.status(400).json({ error: 'Authentication token is required.' });
  } else if(!authenticationHeader.startsWith('Bearer ')) {
    return void res.status(400).json({ error: 'Invalid authentication token format.' });
  }
  
  let result;
  try {
    const authenticationToken = authenticationHeader.slice(7); 
    result = jwt.verify(authenticationToken, secretkey);
    (req as any).user = result;
  } catch (error) {
    return void res.status(400).json({ error: 'Given token is either incorrect or expired.' });
  }

  next();
}

// NOTE: Use authenticate before using this middleware to get the role from (req as any).user.role
export const authorize = (allowedRoles : string[]) => async (req: Request, res: Response, next: NextFunction) => {
  const userRole = (req as any).user.role;

  const isAuthorized = allowedRoles.includes(userRole);
  if (!isAuthorized) {
    return void res.status(403).json({ error: "Access denied. This user doesn't have necessary role to do the operation." });
  }

  next();
};